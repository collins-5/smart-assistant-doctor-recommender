# core/schema.py
import graphene
from graphene_django import DjangoObjectType
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token

from datetime import timedelta
from django.contrib.auth import authenticate
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import uuid

from .models import (
    User, Patient, Doctor, Appointment, Specialty,
    PatientDoctorBookmark, Notification
)


# ==================== TYPES ====================
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
        fields = ("id", "email", "phone_number", "first_name", "last_name", "is_active")
        convert_choices_to_enum = False

    def resolve_patient(self, info):
        try:
            return self.patient
        except AttributeError:
            return None


class DoctorType(DjangoObjectType):
    class Meta:
        model = Doctor
        fields = "__all__"


class AppointmentType(DjangoObjectType):
    class Meta:
        model = Appointment
        fields = "__all__"


class SpecialtyType(DjangoObjectType):
    class Meta:
        model = Specialty
        fields = "__all__"


class NotificationType(graphene.ObjectType):
    id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    createdAt = graphene.DateTime(required=True)
    isRead = graphene.Boolean(required=True)


# ==================== BOOKMARKED DOCTOR TYPE ====================
class BookmarkedDoctorType(DoctorType):
    """Same as DoctorType but used for bookmarked list (optional – you can reuse DoctorType)"""
    class Meta:
        model = Doctor
        fields = "__all__"


# ==================== INPUTS ====================
class AppointmentInput(graphene.InputObjectType):
    doctor_id = graphene.Int(required=True)
    start_time = graphene.DateTime(required=True)
    encounter_mode = graphene.String(required=True)


class CreatePatientProfileInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    middle_name = graphene.String()
    date_of_birth = graphene.Date()
    gender = graphene.String(required=True)


class EditProfileInput(graphene.InputObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    middle_name = graphene.String()
    date_of_birth = graphene.Date()
    gender = graphene.String()
    email = graphene.String()
    phone_number = graphene.String()


# ==================== MUTATIONS ====================
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
            raise Exception("Invalid credentials")
        token = get_token(user)
        return SignIn(jwt_token=token, user=user)


class SignUp(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        phone_number = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        date_of_birth = graphene.Date(required=True)
        gender = graphene.String(required=True)

    user = graphene.Field(UserType)
    patient = graphene.Field(PatientType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    def mutate(root, info, email, phone_number, password, first_name, last_name, date_of_birth, gender):
        if User.objects.filter(email=email).exists():
            return SignUp(success=False, error="Email already exists")
        if User.objects.filter(phone_number=phone_number).exists():
            return SignUp(success=False, error="Phone number already exists")

        user = User.objects.create_user(
            username=email,
            email=email,
            phone_number=phone_number,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()

        patient = Patient.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
            gender=gender.upper(),
        )
        return SignUp(user=user, patient=patient, success=True, error=None)


class CreatePatientProfile(graphene.Mutation):
    class Arguments:
        input = CreatePatientProfileInput(required=True)

    patient = graphene.Field(PatientType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, input):
        user = info.context.user
        if hasattr(user, "patient"):
            return CreatePatientProfile(success=False, error="Profile already exists")

        patient = Patient.objects.create(
            user=user,
            first_name=input.first_name,
            last_name=input.last_name,
            middle_name=input.get("middle_name") or "",
            date_of_birth=input.get("date_of_birth"),
            gender=input.gender.upper(),
        )
        return CreatePatientProfile(patient=patient, success=True)


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

        # Update User
        if input.email is not None:
            if User.objects.exclude(pk=user.pk).filter(email__iexact=input.email).exists():
                return EditProfile(success=False, error="Email already in use")
            user.email = input.email.lower()
        if input.phone_number is not None:
            if User.objects.exclude(pk=user.pk).filter(phone_number=input.phone_number).exists():
                return EditProfile(success=False, error="Phone number already in use")
            user.phone_number = input.phone_number
        user.save()

        # Update Patient
        if input.first_name is not None:
            patient.first_name = input.first_name
        if input.last_name is not None:
            patient.last_name = input.last_name
        if input.middle_name is not None:
            patient.middle_name = input.middle_name
        if input.date_of_birth is not None:
            patient.date_of_birth = input.date_of_birth
        if input.gender is not None:
            patient.gender = input.gender.upper()
        patient.save()

        return EditProfile(patient=patient, user=user, success=True)


class BookAppointment(graphene.Mutation):
    class Arguments:
        booking_args = AppointmentInput(required=True)

    appointment = graphene.Field(AppointmentType)

    @staticmethod
    @login_required
    def mutate(root, info, booking_args):
        user = info.context.user
        if not hasattr(user, "patient"):
            raise Exception("Patient profile required")

        patient = user.patient
        appt = Appointment.objects.create(
            patient=patient,
            doctor_id=booking_args.doctor_id,
            start_time=booking_args.start_time,
            end_time=booking_args.start_time + timedelta(minutes=30),
            encounter_mode=booking_args.encounter_mode,
            cost=2500,
            rastuc_id=str(uuid.uuid4())
        )

        # Send real-time notification
        async_to_sync(get_channel_layer().group_send)(
            f"notifications_{patient.id}",
            {
                "type": "send_notification",
                "notification": {
                    "id": appt.id,
                    "title": "Appointment Confirmed!",
                    "description": f"With Dr. {appt.doctor.full_name}",
                    "createdAt": appt.start_time.isoformat(),
                    "isRead": False,
                }
            }
        )
        return BookAppointment(appointment=appt)


# ==================== BOOKMARK MUTATIONS ====================
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


# ==================== QUERY ====================
class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Health Backend API is LIVE!")
    me = graphene.Field(UserType)
    doctors = graphene.List(DoctorType)
    specialties = graphene.List(SpecialtyType)
    patients = graphene.List(PatientType)
    appointments = graphene.List(AppointmentType)

    # NEW: Bookmarked Doctors
    bookmarked_doctors = graphene.List(BookmarkedDoctorType)

    def resolve_me(self, info):
        return info.context.user if info.context.user.is_authenticated else None

    def resolve_doctors(self, info):
        return Doctor.objects.all()

    def resolve_specialties(self, info):
        return Specialty.objects.all()

    def resolve_patients(self, info):
        if info.context.user.is_staff:
            return Patient.objects.all()
        return Patient.objects.none()

    def resolve_appointments(self, info):
        user = info.context.user
        if not user.is_authenticated or not hasattr(user, "patient"):
            return Appointment.objects.none()
        return Appointment.objects.filter(patient=user.patient).order_by('-start_time')

    @login_required
    def resolve_bookmarked_doctors(self, info):
        user = info.context.user
        if not hasattr(user, "patient"):
            return Doctor.objects.none()
        patient = user.patient
        bookmarks = PatientDoctorBookmark.objects.filter(patient=patient).values_list("doctor_id", flat=True)
        return Doctor.objects.filter(id__in=bookmarks).order_by('-patientdoctorbookmark__created_at')


# ==================== MUTATION ROOT ====================
class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    create_patient_profile = CreatePatientProfile.Field()
    edit_profile = EditProfile.Field()
    book_appointment = BookAppointment.Field()

    # Bookmark mutations
    bookmark_doctor = BookmarkDoctor.Field()
    unbookmark_doctor = UnbookmarkDoctor.Field()


# ==================== SUBSCRIPTION ====================
class Subscription(graphene.ObjectType):
    retrieve_new_notifications = graphene.Field(
        NotificationType,
        patient_id=graphene.Int(required=True)
    )

    async def subscribe_retrieve_new_notifications(root, info, patient_id):
        user = info.context.user
        if not user.is_authenticated or not hasattr(user, "patient") or user.patient.id != patient_id:
            raise Exception("Unauthorized")
        return [f"notifications_{patient_id}"]


# ==================== FINAL SCHEMA ====================
schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)