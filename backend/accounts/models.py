"""Custom User model with role-based access control."""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model with role for CRM access control."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        TELECALLER = "telecaller", "Telecaller"
        TECHNICIAN = "technician", "Technician"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.TELECALLER,
    )
    phone = models.CharField(max_length=15, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "accounts_user"
        ordering = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_manager(self):
        return self.role in (self.Role.ADMIN, self.Role.MANAGER)

    @property
    def is_telecaller(self):
        return self.role in (self.Role.ADMIN, self.Role.MANAGER, self.Role.TELECALLER)

    @property
    def is_technician(self):
        return self.role == self.Role.TECHNICIAN
