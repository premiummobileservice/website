from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "get_full_name", "role", "is_active", "is_staff"]
    list_filter = ["role", "is_active", "is_staff"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("PMR Role", {"fields": ("role", "phone")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("PMR Role", {"fields": ("role", "phone", "email", "first_name", "last_name")}),
    )
