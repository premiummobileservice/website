"""Repair Job and Quote models."""
import uuid
from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class RepairJob(TimestampedModel):
    """A physical repair job created from a lead."""

    class Status(models.TextChoices):
        PICKUP_SCHEDULED = "pickup_scheduled", "Pickup Scheduled"
        DEVICE_COLLECTED = "device_collected", "Device Collected"
        DIAGNOSING = "diagnosing", "Diagnosing"
        QUOTE_SENT = "quote_sent", "Quote Sent"
        APPROVED = "approved", "Approved"
        IN_REPAIR = "in_repair", "In Repair"
        QUALITY_CHECK = "quality_check", "Quality Check"
        READY_FOR_DELIVERY = "ready_for_delivery", "Ready for Delivery"
        DELIVERED = "delivered", "Delivered"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PARTIAL = "partial", "Partial"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"

    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Cash"
        UPI = "upi", "UPI"
        CARD = "card", "Card"
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"

    job_id = models.CharField(max_length=20, unique=True, blank=True, db_index=True)
    lead = models.OneToOneField(
        "leads.Lead",
        on_delete=models.PROTECT,
        related_name="repair_job",
        null=True,
        blank=True,
    )
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="repair_jobs",
        null=True,
        blank=True,
    )
    technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_jobs",
        limit_choices_to={"role": "technician"},
    )

    # Device details
    device_description = models.CharField(max_length=300)
    imei_serial = models.CharField(max_length=100, blank=True, help_text="IMEI or serial number (optional)")
    device_condition_notes = models.TextField(blank=True, help_text="Physical condition at collection")

    # Pickup / Delivery
    pickup_address = models.TextField(blank=True)
    pickup_scheduled_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    delivery_address = models.TextField(blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    # Diagnosis and repair
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PICKUP_SCHEDULED,
        db_index=True,
    )
    diagnosis_notes = models.TextField(blank=True)
    repair_notes = models.TextField(blank=True)

    # Quote
    quote_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quote_sent_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    quote_declined_reason = models.TextField(blank=True)

    # Payment
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        blank=True,
    )
    payment_received_at = models.DateTimeField(null=True, blank=True)

    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["technician", "status"]),
        ]

    def __str__(self):
        return f"{self.job_id} – {self.device_description}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.job_id:
            self.job_id = f"JOB-{self.pk:06d}"
            RepairJob.objects.filter(pk=self.pk).update(job_id=self.job_id)


class QuoteLine(models.Model):
    """Individual line item in a repair quotation."""
    job = models.ForeignKey(RepairJob, on_delete=models.CASCADE, related_name="quote_lines")
    description = models.CharField(max_length=300)
    quantity = models.PositiveSmallIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["id"]

    @property
    def line_total(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.description} × {self.quantity} @ ₹{self.unit_price}"
