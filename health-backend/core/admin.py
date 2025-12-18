# core/admin.py — FINAL VERSION (Admin + GraphQL upload both work perfectly)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django import forms
from django.core.files.base import ContentFile
import os

from .models import (
    User, Patient, Doctor, Specialty, Appointment,
    Organization, OrganizationClinic, PatientDoctorBookmark, Notification,
    Country, County, Insuarance,
)

# Optional: cleaner sidebar
admin.site.unregister(Group)

# ====================== USER ADMIN ======================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'phone_number', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('email', 'phone_number', 'first_name', 'last_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'fields': ('email', 'phone_number', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

# ====================== PATIENT ADMIN WITH SAFE FILE UPLOAD ======================
class PatientAdminForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'

    def clean_profile_picture(self):
        file = self.cleaned_data.get('profile_picture')
        if not file:
            return file

        # If it's a real uploaded file (from admin), force safe copy into MEDIA_ROOT
        if hasattr(file, 'read') and hasattr(file, 'name'):
            try:
                content = file.read()
                file_name = os.path.basename(file.name)
                safe_file = ContentFile(content, name=file_name)
                return safe_file
            except Exception as e:
                # Fallback: let Django handle it (will fail if path is bad, but we tried)
                pass
        return file


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    form = PatientAdminForm  # ← THIS FIXES THE SUSPICIOUS FILE ERROR
    list_display = ('user', 'first_name', 'last_name', 'date_of_birth', 'gender', 'country', 'county', 'preview_photo')
    search_fields = ('user__email', 'user__phone_number', 'first_name', 'last_name')
    list_filter = ('gender', 'date_of_birth', 'country')
    raw_id_fields = ('user',)

    def preview_photo(self, obj):
        if obj.profile_picture:
            from django.utils.html import format_html
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius:50%; object-fit:cover;" />',
                obj.profile_picture.url
            )
        return "(No photo)"
    preview_photo.short_description = "Photo"

# ====================== DOCTOR ADMIN ======================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'get_email', 'primary_specialty', 'takes_prepaid_payment', 'teleconsult_price')
    list_filter = ('primary_specialty', 'takes_prepaid_payment', 'takes_postpaid_payment')
    search_fields = ('user__email', 'first_name', 'last_name', 'full_name')
    raw_id_fields = ('user', 'primary_specialty')
    readonly_fields = ('full_name',)

    def get_email(self, obj):
        return obj.user.email if obj.user else '-'
    get_email.short_description = 'Email'

# ====================== OTHER ADMINS (unchanged) ======================
@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Insuarance)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'start_time', 'encounter_mode', 'cost', 'payment_completed')
    list_filter = ('encounter_mode', 'payment_completed', 'start_time')
    search_fields = (
        'patient__user__email',
        'patient__first_name',
        'doctor__user__email',
        'doctor__first_name',
        'rastuc_id'
    )
    raw_id_fields = ('patient', 'doctor', 'organization', 'organization_clinic')
    date_hierarchy = 'start_time'
    ordering = ('-start_time',)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'type')
    search_fields = ('name', 'type')

@admin.register(OrganizationClinic)
class OrganizationClinicAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization')
    search_fields = ('name', 'organization__name')
    raw_id_fields = ('organization',)

@admin.register(PatientDoctorBookmark)
class PatientDoctorBookmarkAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'created_at')
    list_filter = ('created_at',)
    raw_id_fields = ('patient', 'doctor')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('patient__user__email', 'title', 'description')
    readonly_fields = ('created_at',)
    raw_id_fields = ('patient',)

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    ordering = ('name',)

@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country__name')
    list_filter = ('country',)
    raw_id_fields = ('country',)
    ordering = ('country__name', 'name')