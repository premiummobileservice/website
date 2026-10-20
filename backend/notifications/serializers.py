"""Notifications serializers."""
from rest_framework import serializers
from .models import EmailLog


class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = [
            "id", "lead_id", "email_type", "recipient", "subject",
            "status", "attempt_count", "sent_at", "error_message", "created_at",
        ]
