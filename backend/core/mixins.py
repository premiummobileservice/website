"""Shared mixins for DRF views."""
from rest_framework.response import Response
from rest_framework import status


class AuditLogMixin:
    """
    Mixin that auto-logs create/update/delete actions to AuditLog.
    Attach to any ModelViewSet that modifies sensitive data.
    """

    def perform_create(self, serializer):
        instance = serializer.save()
        self._log_audit("create", instance)
        return instance

    def perform_update(self, serializer):
        instance = serializer.save()
        self._log_audit("update", instance)
        return instance

    def perform_destroy(self, instance):
        self._log_audit("delete", instance)
        instance.delete()

    def _log_audit(self, action: str, instance):
        from core.models import AuditLog
        try:
            AuditLog.objects.create(
                user=self.request.user if self.request.user.is_authenticated else None,
                action=action,
                model_name=instance.__class__.__name__,
                object_id=str(instance.pk),
                ip_address=self._get_client_ip(),
            )
        except Exception:
            pass  # Audit failures must never break the main flow

    def _get_client_ip(self):
        x_forwarded = self.request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded:
            return x_forwarded.split(",")[0].strip()
        return self.request.META.get("REMOTE_ADDR", "")
