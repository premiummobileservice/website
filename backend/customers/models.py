"""Customer model."""
from django.db import models
from core.models import TimestampedModel


class Customer(TimestampedModel):
    """A customer profile created when a lead converts to a job."""
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.phone})"

    @property
    def total_jobs(self):
        return self.repair_jobs.count()

    @property
    def completed_jobs(self):
        return self.repair_jobs.filter(status="completed").count()
