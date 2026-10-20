"""Lead model – the central entity of the CRM."""
import uuid
from django.db import models
from django.conf import settings
from core.models import TimestampedModel


def generate_reference():
    """Generate PMR-XXXXXX reference code."""
    # We'll set this properly in the save() method using the PK
    return ""


class Lead(TimestampedModel):
    """A repair enquiry submitted from the website or added manually."""

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        PICKUP_SCHEDULED = "pickup_scheduled", "Pickup Scheduled"
        DEVICE_COLLECTED = "device_collected", "Device Collected"
        QUOTE_SENT = "quote_sent", "Quote Sent"
        APPROVED = "approved", "Approved"
        IN_REPAIR = "in_repair", "In Repair"
        QUALITY_CHECK = "quality_check", "Quality Check"
        DELIVERED = "delivered", "Delivered"
        COMPLETED = "completed", "Completed"
        DECLINED = "declined", "Declined"
        LOST = "lost", "Lost"

    class Source(models.TextChoices):
        WEBSITE = "website", "Website"
        GOOGLE_ADS = "google_ads", "Google Ads"
        ORGANIC = "organic", "Organic Search"
        SOCIAL = "social", "Social Media"
        REFERRAL = "referral", "Referral"
        WALK_IN = "walk_in", "Walk-In"
        PHONE = "phone", "Phone Call"
        WHATSAPP = "whatsapp", "WhatsApp"
        OTHER = "other", "Other"

    class DeviceType(models.TextChoices):
        SMARTPHONE = "smartphone", "Smartphone"
        TABLET = "tablet", "Tablet"
        LAPTOP = "laptop", "Laptop"
        OTHER = "other", "Other"

    # Reference code
    reference = models.CharField(max_length=20, unique=True, blank=True, db_index=True)

    # Contact details
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15, db_index=True)
    email = models.EmailField(blank=True)

    # Device details
    device_type = models.CharField(
        max_length=20,
        choices=DeviceType.choices,
        default=DeviceType.SMARTPHONE,
    )
    brand_model = models.CharField(max_length=200, help_text="e.g. iPhone 14 Pro, Samsung Galaxy S23")
    repair_needed = models.CharField(max_length=100, help_text="Service slug or free text")
    area = models.CharField(max_length=100)
    issue_description = models.TextField(blank=True)

    # Consent & honeypot check
    consent = models.BooleanField(default=False)
    honeypot_triggered = models.BooleanField(default=False)

    # CRM fields
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_leads",
    )
    lost_reason = models.TextField(blank=True, help_text="Required when status=lost")
    declined_reason = models.TextField(blank=True)

    # Source tracking
    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.WEBSITE,
    )
    utm_source = models.CharField(max_length=200, blank=True)
    utm_medium = models.CharField(max_length=200, blank=True)
    utm_campaign = models.CharField(max_length=200, blank=True)
    utm_term = models.CharField(max_length=200, blank=True)
    gclid = models.CharField(max_length=500, blank=True)
    landing_page = models.URLField(max_length=500, blank=True)
    referrer = models.URLField(max_length=500, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["phone", "created_at"]),
            models.Index(fields=["assigned_to", "status"]),
        ]

    def __str__(self):
        return f"{self.reference} – {self.name} ({self.brand_model})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.reference:
            self.reference = f"PMR-{self.pk:06d}"
            Lead.objects.filter(pk=self.pk).update(reference=self.reference)


class Activity(models.Model):
    """Auto-generated timeline of everything that happens to a lead."""

    class ActivityType(models.TextChoices):
        STATUS_CHANGE = "status_change", "Status Changed"
        ASSIGNED = "assigned", "Assigned"
        NOTE_ADDED = "note_added", "Note Added"
        FOLLOW_UP = "follow_up", "Follow-Up Scheduled"
        EMAIL_SENT = "email_sent", "Email Sent"
        CALL = "call", "Call Logged"
        JOB_CREATED = "job_created", "Repair Job Created"
        OTHER = "other", "Other"

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="activities")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lead_activities",
    )
    activity_type = models.CharField(max_length=30, choices=ActivityType.choices)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["lead", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.lead.reference}: {self.activity_type} at {self.timestamp}"


class Note(TimestampedModel):
    """Staff notes on a lead."""
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="notes")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="lead_notes",
    )
    text = models.TextField()

    class Meta:
        ordering = ["-created_at"]


class FollowUp(TimestampedModel):
    """Scheduled follow-up task for a lead."""
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="follow_ups")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_follow_ups",
    )
    due_at = models.DateTimeField(db_index=True)
    note = models.TextField(blank=True)
    is_done = models.BooleanField(default=False)
    done_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["due_at"]

    def __str__(self):
        return f"{self.lead.reference} follow-up at {self.due_at}"
