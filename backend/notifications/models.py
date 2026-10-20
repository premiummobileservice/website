"""Email log model for tracking all outbound emails."""
from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class EmailLog(TimestampedModel):
    """Records every email attempted (sent or failed) by Celery tasks."""

    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"
        RETRYING = "retrying", "Retrying"

    class EmailType(models.TextChoices):
        LEAD_BUSINESS = "lead_business", "Lead Notification to Business"
        LEAD_CUSTOMER = "lead_customer", "Lead Acknowledgement to Customer"
        PASSWORD_RESET = "password_reset", "Password Reset"
        OTHER = "other", "Other"

    lead_id = models.IntegerField(null=True, blank=True, db_index=True)
    email_type = models.CharField(max_length=30, choices=EmailType.choices)
    recipient = models.EmailField()
    subject = models.CharField(max_length=500)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
    error_message = models.TextField(blank=True)
    attempt_count = models.PositiveSmallIntegerField(default=0)
    sent_at = models.DateTimeField(null=True, blank=True)
    task_id = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["lead_id", "email_type"]),
            models.Index(fields=["status", "created_at"]),
        ]

    def __str__(self):
        return f"{self.email_type} → {self.recipient} ({self.status})"
