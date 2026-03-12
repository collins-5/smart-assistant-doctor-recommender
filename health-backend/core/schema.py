import graphene
from graphene_django import DjangoObjectType
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token
from datetime import timedelta, datetime, time, date
from django.contrib.auth import authenticate
from django.db import models
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
import uuid
from graphene_file_upload.scalars import Upload

# Import channels only if available (for notifications)
try:
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    CHANNELS_AVAILABLE = True
except ImportError:
    CHANNELS_AVAILABLE = False

from .models import (
    User, Patient, Doctor, Appointment, Specialty,
    PatientDoctorBookmark, Notification, Country, County,
    Insuarance, DoctorAvailability, AIChatMessage,
)


class CountryType(DjangoObjectType):
    class Meta:
        model = Country
        fields = ("id", "name", "code")


class CountyType(DjangoObjectType):
    class Meta:
        model = County
        fields = ("id", "name", "country")


class PatientType(DjangoObjectType):
    email = graphene.String()
    phone_number = graphene.String()
    profile_picture_url = graphene.String()

    class Meta:
        model = Patient
        fields = "__all__"
        convert_choices_to_enum = False

    def resolve_email(self, info):
        return self.user.email if self.user else None

    def resolve_phone_number(self, info):
        return self.user.phone_number if self.user else None

    def resolve_profile_picture_url(self, info):
        if self.profile_picture:
            return info.context.build_absolute_uri(self.profile_picture.url)
        return None


class UserType(DjangoObjectType):
    patient = graphene.Field(PatientType)

    class Meta:
        model = User
        fields = ("id", "username", "email", "phone_number", "first_name", "last_name", "is_active")

    def resolve_patient(self, info):
        try:
            return self.patient
        except AttributeError:
            return None


class DoctorAvailabilityType(DjangoObjectType):
    is_booked = graphene.Boolean(description="True if an appointment overlaps this slot")

    class Meta:
        model = DoctorAvailability
        fields = ("id", "doctor", "start_time_of_day", "end_time_of_day", "start_time", "end_time", "is_recurring", 
                  "recurrence_day_of_week", "recurrence_end_date")

    def resolve_is_booked(self, info):
        return Appointment.objects.filter(
            doctor=self.doctor,
            start_time=self.start_time,
            status__in=['UPCOMING', 'ONGOING']
        ).exists()


class AvailableSlotType(graphene.ObjectType):
    id = graphene.String()
    doctor_id = graphene.Int()
    start_time = graphene.DateTime()
    end_time = graphene.DateTime()
    is_booked = graphene.Boolean()
    is_recurring = graphene.Boolean()


class DoctorType(DjangoObjectType):
    profile_picture_url = graphene.String()
    available_slots = graphene.List(
        AvailableSlotType,
        start_date=graphene.Date(),
        end_date=graphene.Date(),
        description="Get 30-minute time slots within a date range"
    )

    class Meta:
        model = Doctor
        fields = "__all__"

    def resolve_profile_picture_url(self, info):
        if self.profile_picture:
            return info.context.build_absolute_uri(self.profile_picture.url)
        return None

    def resolve_available_slots(self, info, start_date=None, end_date=None):
        now = timezone.now()
        
        if start_date is None:
            start_date = now.date()
        if end_date is None:
            end_date = (now + timedelta(days=30)).date()
        
        start_datetime = datetime.combine(start_date, time.min).replace(tzinfo=now.tzinfo)
        end_datetime = datetime.combine(end_date, time.max).replace(tzinfo=now.tzinfo)
        
        availability_rules = DoctorAvailability.objects.filter(doctor=self)
        
        generated_slots = []
        seen_slots = set()
        
        for rule in availability_rules:
            if rule.is_recurring:
                current_date = start_date
                
                while current_date.weekday() != rule.recurrence_day_of_week:
                    current_date += timedelta(days=1)
                    if current_date > end_date:
                        break
                
                while current_date <= end_date:
                    if rule.recurrence_end_date and current_date > rule.recurrence_end_date:
                        break
                    
                    block_start = datetime.combine(current_date, rule.start_time_of_day).replace(tzinfo=now.tzinfo)
                    block_end = datetime.combine(current_date, rule.end_time_of_day).replace(tzinfo=now.tzinfo)
                    
                    current = block_start
                    while True:
                        next_slot = current + timedelta(minutes=30)
                        if next_slot > block_end:
                            break
                        
                        if current >= now:
                            slot_key = current.isoformat()
                            
                            if slot_key not in seen_slots:
                                is_booked = Appointment.objects.filter(
                                    doctor=self,
                                    start_time=current,
                                    status__in=['UPCOMING', 'ONGOING']
                                ).exists()
                                
                                generated_slots.append(AvailableSlotType(
                                    id=f"recurring_{rule.id}_{slot_key}",
                                    doctor_id=self.id,
                                    start_time=current,
                                    end_time=next_slot,
                                    is_booked=is_booked,
                                    is_recurring=True
                                ))
                                seen_slots.add(slot_key)
                        
                        current = next_slot
                    
                    current_date += timedelta(weeks=1)
            
            else:
                if start_datetime <= rule.start_time <= end_datetime and rule.start_time >= now:
                    current = rule.start_time
                    block_end = rule.end_time
                    
                    while True:
                        next_slot = current + timedelta(minutes=30)
                        if next_slot > block_end:
                            break
                        
                        slot_key = current.isoformat()
                        
                        if slot_key not in seen_slots:
                            is_booked = Appointment.objects.filter(
                                doctor=self,
                                start_time=current,
                                status__in=['UPCOMING', 'ONGOING']
                            ).exists()
                            
                            generated_slots.append(AvailableSlotType(
                                id=f"onetime_{rule.id}_{slot_key}",
                                doctor_id=self.id,
                                start_time=current,
                                end_time=next_slot,
                                is_booked=is_booked,
                                is_recurring=False
                            ))
                            seen_slots.add(slot_key)
                        
                        current = next_slot
        
        generated_slots.sort(key=lambda x: x.start_time)
        return generated_slots


class AppointmentType(DjangoObjectType):
    status_display = graphene.String(description="Human readable status")

    class Meta:
        model = Appointment
        fields = "__all__"

    def resolve_status_display(self, info):
        return self.get_status_display()


class SpecialtyType(DjangoObjectType):
    class Meta:
        model = Specialty
        fields = "__all__"


class InsuaranceType(DjangoObjectType):
    logo_url = graphene.String(description="Full URL to the insurance logo")

    class Meta:
        model = Insuarance
        fields = "__all__"

    def resolve_logo_url(self, info):
        if self.logo:
            return info.context.build_absolute_uri(self.logo.url)
        return None


class NotificationType(graphene.ObjectType):
    id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    createdAt = graphene.DateTime(required=True)
    isRead = graphene.Boolean(required=True)


class BookmarkedDoctorType(DoctorType):
    class Meta:
        model = Doctor
        fields = "__all__"


class AIChatMessageType(DjangoObjectType):
    class Meta:
        model = AIChatMessage
        fields = ("id", "text", "is_from_user", "created_at")


class AppointmentInput(graphene.InputObjectType):
    doctor_id = graphene.Int(required=True)
    start_time = graphene.DateTime(required=True)
    encounter_mode = graphene.String(required=True)


class CreatePatientProfileInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    middle_name = graphene.String()
    date_of_birth = graphene.Date(required=True)
    gender = graphene.String(required=True)
    email = graphene.String()
    phone_number = graphene.String()
    country_id = graphene.Int()
    county_id = graphene.Int()


class EditProfileInput(graphene.InputObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    middle_name = graphene.String()
    date_of_birth = graphene.Date()
    gender = graphene.String()
    email = graphene.String()
    phone_number = graphene.String()
    country_id = graphene.Int()
    county_id = graphene.Int()


class CreateDoctorAvailabilityInput(graphene.InputObjectType):
    doctor_id = graphene.Int()
    start_time_of_day = graphene.Time(required=True, description="Start time of day (e.g., 09:00:00)")
    end_time_of_day = graphene.Time(required=True, description="End time of day (e.g., 17:00:00)")
    day_of_week = graphene.Int(required=True, description="0=Monday, 1=Tuesday, ..., 6=Sunday")
    effective_date = graphene.Date(required=True, description="When this availability starts")
    recurrence_end_date = graphene.Date(description="Optional end date for recurring availability")


class SignIn(graphene.Mutation):
    class Arguments:
        email_or_phone_number = graphene.String(required=True)
        password = graphene.String(required=True)

    jwt_token = graphene.String()
    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, email_or_phone_number, password):
        user = authenticate(username=email_or_phone_number, password=password)
        if not user:
            try:
                user_by_email = User.objects.get(email__iexact=email_or_phone_number)
                user = authenticate(username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass
        if not user:
            try:
                user_by_phone = User.objects.get(phone_number=email_or_phone_number)
                user = authenticate(username=user_by_phone.username, password=password)
            except User.DoesNotExist:
                pass
        if not user:
            raise Exception("Invalid credentials")
        token = get_token(user)
        return SignIn(jwt_token=token, user=user)


class SignUp(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        phone_number = graphene.String(required=True)
        password = graphene.String(required=True)

    jwt_token = graphene.String()
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    def mutate(root, info, username, email, phone_number, password):
        if User.objects.filter(username__iexact=username).exists():
            return SignUp(success=False, error="Username already taken")
        if User.objects.filter(email__iexact=email).exists():
            return SignUp(success=False, error="Email already registered")
        if User.objects.filter(phone_number=phone_number).exists():
            return SignUp(success=False, error="Phone number already registered")
        username = username.lower().strip()
        email = email.lower().strip()
        user = User.objects.create_user(
            username=username,
            email=email,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save()
        token = get_token(user)
        return SignUp(success=True, error=None, jwt_token=token, user=user)


class CreatePatientProfile(graphene.Mutation):
    class Arguments:
        input = CreatePatientProfileInput(required=True)

    patient = graphene.Field(PatientType)
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        user = info.context.user
        if hasattr(user, "patient"):
            return CreatePatientProfile(success=False, error="Patient profile already exists")
        if input.email:
            if User.objects.exclude(pk=user.pk).filter(email__iexact=input.email).exists():
                return CreatePatientProfile(success=False, error="Email already in use")
        user.email = input.email.lower().strip() if input.email else user.email
        if input.phone_number:
            if User.objects.exclude(pk=user.pk).filter(phone_number=input.phone_number).exists():
                return CreatePatientProfile(success=False, error="Phone number already in use")
        user.phone_number = input.phone_number
        user.first_name = input.first_name.strip()
        user.last_name = input.last_name.strip()
        user.save()
        country = None
        county = None
        if input.country_id:
            try:
                country = Country.objects.get(id=input.country_id)
            except Country.DoesNotExist:
                return CreatePatientProfile(success=False, error="Invalid country")
        if input.county_id:
            if not country:
                return CreatePatientProfile(success=False, error="Country is required when county is provided")
            try:
                county = County.objects.get(id=input.county_id, country=country)
            except County.DoesNotExist:
                return CreatePatientProfile(success=False, error="Invalid county")
        patient = Patient.objects.create(
            user=user,
            first_name=input.first_name.strip(),
            last_name=input.last_name.strip(),
            middle_name=(input.middle_name or "").strip(),
            date_of_birth=input.date_of_birth,
            gender=input.gender.upper(),
            country=country,
            county=county,
        )
        return CreatePatientProfile(success=True, error=None, patient=patient, user=user)


class EditProfile(graphene.Mutation):
    class Arguments:
        input = EditProfileInput(required=True)

    patient = graphene.Field(PatientType)
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        user = info.context.user
        try:
            patient = user.patient
        except AttributeError:
            return EditProfile(success=False, error="Patient profile does not exist")
        if input.email is not None:
            if User.objects.exclude(pk=user.pk).filter(email__iexact=input.email).exists():
                return EditProfile(success=False, error="Email already in use")
            user.email = input.email.lower()
        if input.phone_number is not None:
            if User.objects.exclude(pk=user.pk).filter(phone_number=input.phone_number).exists():
                return EditProfile(success=False, error="Phone number already in use")
            user.phone_number = input.phone_number
        user.save()
        if input.first_name is not None:
            patient.first_name = input.first_name
            user.first_name = input.first_name
        if input.last_name is not None:
            patient.last_name = input.last_name
            user.last_name = input.last_name
        if input.middle_name is not None:
            patient.middle_name = input.middle_name
        if input.date_of_birth is not None:
            patient.date_of_birth = input.date_of_birth
        if input.gender is not None:
            patient.gender = input.gender.upper()
        if input.country_id is not None:
            try:
                patient.country = Country.objects.get(id=input.country_id)
            except Country.DoesNotExist:
                return EditProfile(success=False, error="Invalid country")
        if input.county_id is not None:
            try:
                patient.county = County.objects.get(id=input.county_id)
            except County.DoesNotExist:
                return EditProfile(success=False, error="Invalid county")
        patient.save()
        user.save()
        return EditProfile(patient=patient, user=user, success=True)


class BookAppointment(graphene.Mutation):
    class Arguments:
        booking_args = AppointmentInput(required=True)

    appointment = graphene.Field(AppointmentType)
    success = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, booking_args):
        user = info.context.user
        if not hasattr(user, "patient"):
            return BookAppointment(success=False, message="Patient profile required")

        patient = user.patient
        
        try:
            doctor = Doctor.objects.get(pk=booking_args.doctor_id)
        except Doctor.DoesNotExist:
            return BookAppointment(success=False, message="Doctor not found")
        
        proposed_end = booking_args.start_time + timedelta(minutes=30)
        now = timezone.now()
        
        if booking_args.start_time < now:
            return BookAppointment(success=False, message="Cannot book appointments in the past")
        
        requested_day = booking_args.start_time.weekday()
        requested_time = booking_args.start_time.time()
        requested_date = booking_args.start_time.date()
        
        # Check availability
        has_availability = False
        
        recurring_rules = DoctorAvailability.objects.filter(
            doctor=doctor,
            is_recurring=True,
            recurrence_day_of_week=requested_day,
            start_time_of_day__lte=requested_time,
            end_time_of_day__gt=requested_time
        )
        
        for rule in recurring_rules:
            if rule.recurrence_end_date is None or requested_date <= rule.recurrence_end_date:
                has_availability = True
                break
        
        if not has_availability:
            has_availability = DoctorAvailability.objects.filter(
                doctor=doctor,
                is_recurring=False,
                start_time__lte=booking_args.start_time,
                end_time__gte=proposed_end,
            ).exists()
        
        if not has_availability:
            return BookAppointment(success=False, message="Doctor is not available at this time")
        
        if Appointment.objects.filter(
            doctor=doctor,
            start_time=booking_args.start_time,
            status__in=['UPCOMING', 'ONGOING']
        ).exists():
            return BookAppointment(success=False, message="This time slot is already booked")
        
        # ── Use real doctor price based on encounter mode ───────────────────
        mode = booking_args.encounter_mode.upper()
        
        if mode == 'TELE':
            cost = doctor.teleconsult_price
        elif mode == 'CLINIC':
            cost = doctor.clinic_visit_price
        elif mode == 'HOME':
            cost = doctor.homecare_price
        else:
            return BookAppointment(success=False, message=f"Invalid encounter mode: {mode}")
        
        if cost <= 0:
            return BookAppointment(
                success=False,
                message=f"Doctor has not set a valid price for {mode} consultations"
            )
        
        # Optional: add platform fee here if you want
        # cost += Decimal('200.00')
        
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            start_time=booking_args.start_time,
            end_time=proposed_end,
            encounter_mode=mode,
            cost=cost,
            payment_completed=False,
            rastuc_id=str(uuid.uuid4())
        )
        
        # Optional notification
        if CHANNELS_AVAILABLE:
            try:
                async_to_sync(get_channel_layer().group_send)(
                    f"notifications_{patient.id}",
                    {
                        "type": "send_notification",
                        "notification": {
                            "id": appointment.id,
                            "title": "Appointment Confirmed!",
                            "description": f"With Dr. {appointment.doctor.full_name} – {appointment.get_encounter_mode_display()} @ KES {cost}",
                            "createdAt": appointment.start_time.isoformat(),
                            "isRead": False,
                        }
                    }
                )
            except Exception:
                pass
        
        return BookAppointment(
            appointment=appointment,
            success=True,
            message="Appointment booked successfully"
        )


class BookmarkDoctor(graphene.Mutation):
    class Arguments:
        doctor_id = graphene.Int(required=True)

    success = graphene.Boolean()
    doctor = graphene.Field(DoctorType)

    @staticmethod
    @login_required
    def mutate(root, info, doctor_id):
        user = info.context.user
        if not hasattr(user, "patient"):
            raise Exception("Patient profile required")
        doctor = Doctor.objects.get(pk=doctor_id)
        PatientDoctorBookmark.objects.get_or_create(patient=user.patient, doctor=doctor)
        return BookmarkDoctor(success=True, doctor=doctor)


class UnbookmarkDoctor(graphene.Mutation):
    class Arguments:
        doctor_id = graphene.Int(required=True)

    success = graphene.Boolean()

    @staticmethod
    @login_required
    def mutate(root, info, doctor_id):
        user = info.context.user
        if not hasattr(user, "patient"):
            raise Exception("Patient profile required")
        try:
            bookmark = PatientDoctorBookmark.objects.get(patient=user.patient, doctor_id=doctor_id)
            bookmark.delete()
            return UnbookmarkDoctor(success=True)
        except PatientDoctorBookmark.DoesNotExist:
            return UnbookmarkDoctor(success=False)


class UploadProfilePicture(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    patient = graphene.Field(PatientType)

    @staticmethod
    @login_required
    def mutate(root, info, file):
        user = info.context.user
        try:
            patient = user.patient
        except AttributeError:
            return UploadProfilePicture(success=False, error="Patient profile does not exist. Create profile first.")
        if not file:
            return UploadProfilePicture(success=False, error="No file provided")
        patient.profile_picture = file
        patient.save()
        return UploadProfilePicture(success=True, error=None, patient=patient)


class RemoveProfilePicture(graphene.Mutation):
    success = graphene.Boolean()
    error = graphene.String()
    patient = graphene.Field(PatientType)

    @staticmethod
    @login_required
    def mutate(root, info):
        user = info.context.user
        try:
            patient = user.patient
        except AttributeError:
            return RemoveProfilePicture(success=False, error="Patient profile not found")
        if patient.profile_picture:
            patient.profile_picture.delete(save=False)
            patient.profile_picture = None
            patient.save()
        return RemoveProfilePicture(success=True, error=None, patient=patient)


class UploadInsuranceLogo(graphene.Mutation):
    class Arguments:
        insurance_id = graphene.Int(required=True)
        file = Upload(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    insurance = graphene.Field(InsuaranceType)

    @staticmethod
    @login_required
    def mutate(root, info, insurance_id, file):
        user = info.context.user
        if not user.is_staff:
            return UploadInsuranceLogo(success=False, error="Only staff can upload insurance logos")

        try:
            insurance = Insuarance.objects.get(id=insurance_id)
        except Insuarance.DoesNotExist:
            return UploadInsuranceLogo(success=False, error="Insurance not found")

        if not file:
            return UploadInsuranceLogo(success=False, error="No file provided")

        insurance.logo = file
        insurance.save()
        return UploadInsuranceLogo(success=True, error=None, insurance=insurance)


class CreateDoctorAvailability(graphene.Mutation):
    class Arguments:
        input = CreateDoctorAvailabilityInput(required=True)

    availability = graphene.Field(DoctorAvailabilityType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        user = info.context.user
        
        if user.is_staff:
            if not input.doctor_id:
                return CreateDoctorAvailability(success=False, error="Staff users must provide doctor_id")
            try:
                doctor = Doctor.objects.get(id=input.doctor_id)
            except Doctor.DoesNotExist:
                return CreateDoctorAvailability(success=False, error="Doctor not found")
        else:
            try:
                doctor = user.doctor
            except AttributeError:
                return CreateDoctorAvailability(success=False, error="Only doctors or staff can create availability")
        
        if input.start_time_of_day >= input.end_time_of_day:
            return CreateDoctorAvailability(success=False, error="Start time must be before end time")
        
        if input.day_of_week < 0 or input.day_of_week > 6:
            return CreateDoctorAvailability(success=False, error="day_of_week must be 0-6 (Monday-Sunday)")
        
        duration = datetime.combine(date.min, input.end_time_of_day) - datetime.combine(date.min, input.start_time_of_day)
        if duration < timedelta(minutes=30):
            return CreateDoctorAvailability(success=False, error="Availability block must be at least 30 minutes")
        
        # Calculate the effective start date for overlap check
        current_date = input.effective_date
        while current_date.weekday() != input.day_of_week:
            current_date += timedelta(days=1)
        
        # Overlap check
        overlapping = DoctorAvailability.objects.filter(
            doctor=doctor,
            is_recurring=True,
            recurrence_day_of_week=input.day_of_week,
            start_time_of_day__lt=input.end_time_of_day,
            end_time_of_day__gt=input.start_time_of_day
        )
        
        if input.recurrence_end_date:
            overlapping = overlapping.filter(
                models.Q(recurrence_end_date__isnull=True) | 
                models.Q(recurrence_end_date__gte=current_date)
            )
        
        if overlapping.exists():
            return CreateDoctorAvailability(
                success=False,
                error="Overlapping availability exists for this day and time"
            )
        
        availability = DoctorAvailability.objects.create(
            doctor=doctor,
            start_time_of_day=input.start_time_of_day,
            end_time_of_day=input.end_time_of_day,
            is_recurring=True,
            recurrence_day_of_week=input.day_of_week,
            recurrence_end_date=input.recurrence_end_date
        )
        
        return CreateDoctorAvailability(
            availability=availability,
            success=True,
            error=None
        )


class DeleteDoctorAvailability(graphene.Mutation):
    class Arguments:
        availability_id = graphene.Int(required=True)

    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, availability_id):
        user = info.context.user
        
        try:
            availability = DoctorAvailability.objects.get(id=availability_id)
        except DoctorAvailability.DoesNotExist:
            return DeleteDoctorAvailability(success=False, error="Availability not found")
        
        if not user.is_staff:
            try:
                if availability.doctor != user.doctor:
                    return DeleteDoctorAvailability(success=False, error="Not authorized")
            except AttributeError:
                return DeleteDoctorAvailability(success=False, error="Not authorized")
        
        availability.delete()
        return DeleteDoctorAvailability(success=True, error=None)


class SendAIChatMessage(graphene.Mutation):
    class Arguments:
        text = graphene.String(required=True)
        is_from_user = graphene.Boolean(default_value=True)

    message = graphene.Field(AIChatMessageType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, text, is_from_user=True):
        user = info.context.user
        if not hasattr(user, "patient"):
            return SendAIChatMessage(success=False, error="Patient profile required")
        patient = user.patient
        message = AIChatMessage.objects.create(
            patient=patient,
            text=text.strip(),
            is_from_user=is_from_user,
        )
        return SendAIChatMessage(message=message, success=True, error=None)


class CancelAppointment(graphene.Mutation):
    class Arguments:
        appointment_id = graphene.Int(required=True)
        reason = graphene.String()

    appointment = graphene.Field(AppointmentType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, appointment_id, reason=""):
        user = info.context.user
        try:
            appointment = Appointment.objects.get(id=appointment_id, patient=user.patient)
        except Appointment.DoesNotExist:
            return CancelAppointment(success=False, error="Appointment not found or not yours")

        try:
            appointment.cancel(user, reason)
        except ValidationError as e:
            return CancelAppointment(success=False, error=str(e))

        if CHANNELS_AVAILABLE:
            try:
                async_to_sync(get_channel_layer().group_send)(
                    f"notifications_{user.patient.id}",
                    {
                        "type": "send_notification",
                        "notification": {
                            "id": appointment.id,
                            "title": "Appointment Cancelled",
                            "description": f"Your appointment with Dr. {appointment.doctor.full_name} has been cancelled.",
                            "createdAt": timezone.now().isoformat(),
                            "isRead": False,
                        }
                    }
                )
            except Exception:
                pass

        return CancelAppointment(appointment=appointment, success=True)


class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Health Backend API is LIVE!")
    me = graphene.Field(UserType)
    doctors = graphene.List(DoctorType)
    doctor = graphene.Field(DoctorType, id=graphene.Int(required=True))
    doctor_available_slots = graphene.List(
        AvailableSlotType,
        doctor_id=graphene.Int(required=True),
        start_date=graphene.Date(),
        end_date=graphene.Date()
    )
    specialties = graphene.List(SpecialtyType)
    insuarances = graphene.List(InsuaranceType)
    patients = graphene.List(PatientType)
    appointments = graphene.List(AppointmentType, status=graphene.String())
    bookmarked_doctors = graphene.List(BookmarkedDoctorType)
    countries = graphene.List(CountryType)
    counties = graphene.List(CountyType, country_id=graphene.Int())
    ai_chat_messages = graphene.List(AIChatMessageType)

    def resolve_me(self, info):
        return info.context.user if info.context.user.is_authenticated else None

    def resolve_doctors(self, info):
        return Doctor.objects.all()

    def resolve_doctor(self, info, id):
        try:
            return Doctor.objects.get(pk=id)
        except Doctor.DoesNotExist:
            return None

    def resolve_doctor_available_slots(self, info, doctor_id, start_date=None, end_date=None):
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return []
        
        now = timezone.now()
        
        if start_date is None:
            start_date = now.date()
        if end_date is None:
            end_date = (now + timedelta(days=30)).date()
        
        start_datetime = datetime.combine(start_date, time.min).replace(tzinfo=now.tzinfo)
        end_datetime = datetime.combine(end_date, time.max).replace(tzinfo=now.tzinfo)
        
        availability_rules = DoctorAvailability.objects.filter(doctor=doctor)
        
        generated_slots = []
        seen_slots = set()
        
        for rule in availability_rules:
            if rule.is_recurring:
                current_date = start_date
                
                while current_date.weekday() != rule.recurrence_day_of_week:
                    current_date += timedelta(days=1)
                    if current_date > end_date:
                        break
                
                while current_date <= end_date:
                    if rule.recurrence_end_date and current_date > rule.recurrence_end_date:
                        break
                    
                    block_start = datetime.combine(current_date, rule.start_time_of_day).replace(tzinfo=now.tzinfo)
                    block_end = datetime.combine(current_date, rule.end_time_of_day).replace(tzinfo=now.tzinfo)
                    
                    current = block_start
                    while True:
                        next_slot = current + timedelta(minutes=30)
                        if next_slot > block_end:
                            break
                        
                        if current >= now:
                            slot_key = current.isoformat()
                            
                            if slot_key not in seen_slots:
                                is_booked = Appointment.objects.filter(
                                    doctor=doctor,
                                    start_time=current,
                                    status__in=['UPCOMING', 'ONGOING']
                                ).exists()
                                
                                generated_slots.append(AvailableSlotType(
                                    id=f"recurring_{rule.id}_{slot_key}",
                                    doctor_id=doctor.id,
                                    start_time=current,
                                    end_time=next_slot,
                                    is_booked=is_booked,
                                    is_recurring=True
                                ))
                                seen_slots.add(slot_key)
                        
                        current = next_slot
                    
                    current_date += timedelta(weeks=1)
            
            else:
                if start_datetime <= rule.start_time <= end_datetime and rule.start_time >= now:
                    current = rule.start_time
                    block_end = rule.end_time
                    
                    while True:
                        next_slot = current + timedelta(minutes=30)
                        if next_slot > block_end:
                            break
                        
                        slot_key = current.isoformat()
                        
                        if slot_key not in seen_slots:
                            is_booked = Appointment.objects.filter(
                                doctor=doctor,
                                start_time=current,
                                status__in=['UPCOMING', 'ONGOING']
                            ).exists()
                            
                            generated_slots.append(AvailableSlotType(
                                id=f"onetime_{rule.id}_{slot_key}",
                                doctor_id=doctor.id,
                                start_time=current,
                                end_time=next_slot,
                                is_booked=is_booked,
                                is_recurring=False
                            ))
                            seen_slots.add(slot_key)
                        
                        current = next_slot
        
        generated_slots.sort(key=lambda x: x.start_time)
        return generated_slots

    def resolve_specialties(self, info):
        return Specialty.objects.all()

    def resolve_insuarances(self, info):
        return Insuarance.objects.all()

    def resolve_patients(self, info):
        if info.context.user.is_staff:
            return Patient.objects.all()
        return Patient.objects.none()

    def resolve_appointments(self, info, status=None):
        user = info.context.user
        if not user.is_authenticated or not hasattr(user, "patient"):
            return Appointment.objects.none()

        queryset = Appointment.objects.filter(patient=user.patient)

        now = timezone.now()
        for appt in queryset:
            original_status = appt.status

            if appt.status in ["UPCOMING", "ONGOING"]:
                if appt.start_time <= now <= appt.end_time:
                    appt.status = "ONGOING"
                elif now > appt.end_time:
                    appt.status = "COMPLETED"

                if appt.status != original_status:
                    appt.save(update_fields=["status"])

        if status:
            queryset = queryset.filter(status=status.upper())

        return queryset.order_by("-start_time")

    @login_required
    def resolve_bookmarked_doctors(self, info):
        user = info.context.user
        if not hasattr(user, "patient"):
            return Doctor.objects.none()
        patient = user.patient
        bookmarks = PatientDoctorBookmark.objects.filter(patient=patient).values_list("doctor_id", flat=True)
        return Doctor.objects.filter(id__in=bookmarks).order_by('-patientdoctorbookmark__created_at')

    def resolve_countries(self, info):
        return Country.objects.all()

    def resolve_counties(self, info, country_id=None):
        if country_id:
            return County.objects.filter(country_id=country_id)
        return County.objects.all()

    @login_required
    def resolve_ai_chat_messages(self, info):
        user = info.context.user
        if not hasattr(user, "patient"):
            return AIChatMessage.objects.none()
        return user.patient.ai_chat_messages.all().order_by('created_at')


class Subscription(graphene.ObjectType):
    retrieve_new_notifications = graphene.Field(
        NotificationType,
        patient_id=graphene.Int(required=True),
        jwt_token=graphene.String(required=True),
    )

    @staticmethod
    @login_required
    async def subscribe_retrieve_new_notifications(root, info, patient_id, jwt_token):
        user = info.context.user
        if not hasattr(user, "patient") or user.patient.id != patient_id:
            raise Exception("Unauthorized")
        return [f"notifications_{patient_id}"]


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    create_patient_profile = CreatePatientProfile.Field()
    edit_profile = EditProfile.Field()
    book_appointment = BookAppointment.Field()
    bookmark_doctor = BookmarkDoctor.Field()
    unbookmark_doctor = UnbookmarkDoctor.Field()
    upload_profile_picture = UploadProfilePicture.Field()
    remove_profile_picture = RemoveProfilePicture.Field()
    create_doctor_availability = CreateDoctorAvailability.Field()
    delete_doctor_availability = DeleteDoctorAvailability.Field()
    send_ai_chat_message = SendAIChatMessage.Field()
    cancel_appointment = CancelAppointment.Field()
    upload_insurance_logo = UploadInsuranceLogo.Field()


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)