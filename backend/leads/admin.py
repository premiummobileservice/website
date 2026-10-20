from django.contrib import admin
from .models import Lead, Activity, Note, FollowUp


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        "reference", "name", "phone", "brand_model", "repair_needed",
        "area", "status", "source", "assigned_to", "created_at",
    ]
    list_filter = ["status", "source", "device_type", "created_at"]
    search_fields = ["reference", "name", "phone", "email", "brand_model"]
    readonly_fields = ["reference", "created_at", "updated_at"]
    raw_id_fields = ["assigned_to"]
    ordering = ["-created_at"]


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ["lead", "activity_type", "user", "timestamp"]
    list_filter = ["activity_type"]
    readonly_fields = ["timestamp"]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["lead", "user", "created_at"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ["lead", "due_at", "is_done", "created_by"]
    list_filter = ["is_done"]
