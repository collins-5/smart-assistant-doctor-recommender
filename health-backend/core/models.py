# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import default_storage
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email or self.phone_number or str(self.id)

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, blank=True)

    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']

    def __str__(self):
        return self.name

class County(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='counties')

    class Meta:
        unique_together = ('name', 'country')
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.country.name}"

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        try:
            old = Patient.objects.get(pk=self.pk)
            if old.profile_picture and old.profile_picture != self.profile_picture:
                if default_storage.exists(old.profile_picture.path):
                    default_storage.delete(old.profile_picture.path)
        except Patient.DoesNotExist:
            pass
        super().save(*args, **kwargs)

class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Insuarance(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor')
    title = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=1000, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200, blank=True)
    primary_specialty = models.ForeignKey(Specialty, on_delete=models.SET_NULL, null=True, related_name='primary_doctors')
    sub_specialties = models.ManyToManyField(Specialty, blank=True, related_name='subspecialty_doctors')
    insuarance = models.ManyToManyField(Insuarance, blank=True, related_name='insuarance')
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True, blank=True)
    takes_postpaid_payment = models.BooleanField(default=True)
    takes_prepaid_payment = models.BooleanField(default=True)
    teleconsult_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    clinic_visit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    homecare_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    profile_picture = models.ImageField(upload_to='doctor_profile_pictures/', null=True, blank=True)

    def save(self, *args, **kwargs):
        try:
            old = Doctor.objects.get(pk=self.pk)
            if old.profile_picture and old.profile_picture != self.profile_picture:
                if default_storage.exists(old.profile_picture.path):
                    default_storage.delete(old.profile_picture.path)
        except Doctor.DoesNotExist:
            pass
        if not self.full_name:
            self.full_name = f"{self.title} {self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availabilities')
    start_time = models.DateTimeField(help_text="Start of the 30-minute availability slot")
    end_time = models.DateTimeField(help_text="Automatically set to start_time + 30 minutes", editable=False)
    is_recurring = models.BooleanField(default=False, help_text="If true, this slot repeats weekly on the same day/time")
    recurrence_day_of_week = models.IntegerField(null=True, blank=True, help_text="0=Monday ... 6=Sunday — only used if is_recurring=True")
    recurrence_end_date = models.DateField(null=True, blank=True, help_text="Optional: stop recurring after this date")

    class Meta:
        unique_together = ('doctor', 'start_time')
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['doctor', 'start_time']),
            models.Index(fields=['start_time']),
        ]

    def clean(self):
        if self.end_time and self.end_time != self.start_time + timedelta(minutes=30):
            raise ValidationError("End time must be exactly 30 minutes after start time.")

    def save(self, *args, **kwargs):
        self.end_time = self.start_time + timedelta(minutes=30)
        if self.is_recurring and self.recurrence_day_of_week is None:
            self.recurrence_day_of_week = self.start_time.weekday()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.doctor.full_name} - {self.start_time.strftime('%Y-%m-%d %H:%M')} to {self.end_time.strftime('%H:%M')}"

class Organization(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100, blank=True)

class OrganizationClinic(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

class Appointment(models.Model):
    MODE_CHOICES = [('TELE', 'Teleconsult'), ('CLINIC', 'Clinic Visit'), ('HOME', 'Homecare')]
    STATUS_CHOICES = [
        ('UPCOMING', 'Upcoming'),
        ('ONGOING', 'Ongoing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    organization_clinic = models.ForeignKey(OrganizationClinic, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    encounter_mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_completed = models.BooleanField(default=False)
    rastuc_id = models.CharField(max_length=100, blank=True, unique=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_appointments')
    cancellation_reason = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        now = timezone.now()

        if self.pk is not None:  # Only update status for existing appointments
            if self.status in ['UPCOMING', 'ONGOING']:
                if self.start_time <= now <= self.end_time:
                    self.status = 'ONGOING'
                elif now > self.end_time:
                    self.status = 'COMPLETED'

        super().save(*args, **kwargs)

    def cancel(self, user, reason=""):
        if self.status not in ['UPCOMING', 'ONGOING']:
            raise ValidationError("Cannot cancel a completed or already cancelled appointment.")
        self.status = 'CANCELLED'
        self.cancelled_at = timezone.now()
        self.cancelled_by = user
        self.cancellation_reason = reason
        self.save()

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return f"{self.patient} with {self.doctor} - {self.get_status_display()}"

class PatientDoctorBookmark(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('patient', 'doctor')

class Notification(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class AIChatMessage(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='ai_chat_messages')
    text = models.TextField()
    is_from_user = models.BooleanField(default=True, help_text="True if message is from the patient, False if from AI")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['patient', 'created_at']),
        ]

    def __str__(self):
        return f"{'User' if self.is_from_user else 'AI'} to {self.patient} at {self.created_at}"