from django.contrib import admin
from .models import Service, ServiceArea, AuditLog


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active", "sort_order"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["is_active", "sort_order"]


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["is_active"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["timestamp", "user", "action", "model_name", "object_id", "ip_address"]
    list_filter = ["action", "model_name"]
    readonly_fields = ["timestamp", "user", "action", "model_name", "object_id", "ip_address", "metadata"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
