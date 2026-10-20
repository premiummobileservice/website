from django.contrib import admin
from .models import RepairJob, QuoteLine


class QuoteLineInline(admin.TabularInline):
    model = QuoteLine
    extra = 1


@admin.register(RepairJob)
class RepairJobAdmin(admin.ModelAdmin):
    list_display = ["job_id", "device_description", "status", "technician", "payment_status", "created_at"]
    list_filter = ["status", "payment_status"]
    search_fields = ["job_id", "device_description"]
    inlines = [QuoteLineInline]
    readonly_fields = ["job_id", "created_at", "updated_at"]
