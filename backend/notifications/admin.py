from django.contrib import admin
from .models import EmailLog


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ["id", "email_type", "recipient", "status", "attempt_count", "sent_at", "created_at"]
    list_filter = ["email_type", "status"]
    readonly_fields = ["created_at", "updated_at", "sent_at"]

    def has_add_permission(self, request):
        return False
