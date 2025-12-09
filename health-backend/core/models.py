from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import default_storage


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

    # LOCATION
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, null=True, blank=True)

    # PROFILE PICTURE
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        # Delete old photo when updating
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


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor')
    title = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200, blank=True)
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
    
    # PROFILE PICTURE
    profile_picture = models.ImageField(
        upload_to='doctor_profile_pictures/',
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        # Delete old photo when updating
        try:
            old = Doctor.objects.get(pk=self.pk)
            if old.profile_picture and old.profile_picture != self.profile_picture:
                if default_storage.exists(old.profile_picture.path):
                    default_storage.delete(old.profile_picture.path)
        except Doctor.DoesNotExist:
            pass
        
        # Update full_name
        if not self.full_name:
            self.full_name = f"{self.title} {self.first_name} {self.last_name}".strip()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


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