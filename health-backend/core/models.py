from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('M','Male'),('F','Female'),('O','Other')], blank=True)

class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor')
    title = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200, blank=True)
    
    # THIS IS THE FIX
    primary_specialty = models.ForeignKey(
        Specialty,
        on_delete=models.SET_NULL,
        null=True,
        related_name='primary_doctors'
    )
    sub_specialties = models.ManyToManyField(
        Specialty,
        blank=True,
        related_name='subspecialty_doctors'
    )

    takes_postpaid_payment = models.BooleanField(default=True)
    takes_prepaid_payment = models.BooleanField(default=True)
    teleconsult_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    clinic_visit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    homecare_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = f"{self.title} {self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)

class Organization(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100, blank=True)

class OrganizationClinic(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

class Appointment(models.Model):
    MODE_CHOICES = [('TELE','Teleconsult'), ('CLINIC','Clinic Visit'), ('HOME','Homecare')]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    organization_clinic = models.ForeignKey(OrganizationClinic, on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    encounter_mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_completed = models.BooleanField(default=False)
    rastuc_id = models.CharField(max_length=100, blank=True, unique=True)

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
