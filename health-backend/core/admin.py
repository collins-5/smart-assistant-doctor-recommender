# core/admin.py — FINAL CORRECTED & WORKING VERSION

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django import forms
from django.core.files.base import ContentFile
from django.utils.html import format_html
from datetime import timedelta
import os

from .models import (
    User, Patient, Doctor, Specialty, Appointment,
    Organization, OrganizationClinic, PatientDoctorBookmark, Notification,
    Country, County, Insuarance, DoctorAvailability,
)

# Optional: cleaner sidebar (remove Groups)
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

        if hasattr(file, 'read') and hasattr(file, 'name'):
            try:
                content = file.read()
                file_name = os.path.basename(file.name)
                safe_file = ContentFile(content, name=file_name)
                return safe_file
            except Exception:
                pass
        return file


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    form = PatientAdminForm
    list_display = ('user', 'first_name', 'last_name', 'date_of_birth', 'gender', 'country', 'county', 'preview_photo')
    search_fields = ('user__email', 'user__phone_number', 'first_name', 'last_name')
    list_filter = ('gender', 'date_of_birth', 'country')
    raw_id_fields = ('user',)

    def preview_photo(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius:50%; object-fit:cover;" />',
                obj.profile_picture.url
            )
        return "(No photo)"
    preview_photo.short_description = "Photo"


# ====================== DOCTOR AVAILABILITY INLINE (IMPROVED) ======================
class DoctorAvailabilityInline(admin.TabularInline):
    model = DoctorAvailability
    extra = 1
    ordering = ('start_time',)
    fields = ('start_time', 'is_recurring', 'end_time_display')
    readonly_fields = ('end_time_display',)

    def end_time_display(self, obj):
        if obj.pk and obj.start_time:
            end = obj.start_time + timedelta(minutes=30)
            return end.strftime('%Y-%m-%d %H:%M')
        return "— (Will be set to +30 min after save)"
    end_time_display.short_description = "End Time"


# ====================== DOCTOR ADMIN WITH AVAILABILITY INLINE ======================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'get_email', 'primary_specialty', 'takes_prepaid_payment', 'teleconsult_price')
    list_filter = ('primary_specialty', 'takes_prepaid_payment', 'takes_postpaid_payment')
    search_fields = ('user__email', 'first_name', 'last_name', 'full_name')
    raw_id_fields = ('user', 'primary_specialty')
    readonly_fields = ('full_name',)
    inlines = [DoctorAvailabilityInline]

    def get_email(self, obj):
        return obj.user.email if obj.user else '-'
    get_email.short_description = 'Email'


# ====================== STANDALONE DOCTOR AVAILABILITY ADMIN (FIXED) ======================
@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'start_time', 'end_time', 'is_recurring', 'booked_status_display')
    list_filter = ('is_recurring', 'start_time', 'doctor')
    search_fields = ('doctor__full_name', 'doctor__user__email')
    readonly_fields = ('end_time',)
    date_hierarchy = 'start_time'
    ordering = ('-start_time',)

    def booked_status_display(self, obj):
        booked = Appointment.objects.filter(
            doctor=obj.doctor,
            start_time__lt=obj.end_time,
            end_time__gt=obj.start_time,
        ).exists()

        color = "red" if booked else "green"
        status = "Booked" if booked else "Available"

        return format_html(
            '<span style="color:{}; font-weight:bold;">● {}</span>',
            color,
            status
        )

    booked_status_display.short_description = "Status"
    # Optional: prevent sorting on this virtual field
    # booked_status_display.admin_order_field = None


# ====================== OTHER ADMINS ======================
@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Insuarance)
class InsuaranceAdmin(admin.ModelAdmin):
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