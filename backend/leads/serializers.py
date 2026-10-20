"""Serializers for leads app."""
import re
import phonenumbers
from rest_framework import serializers
from django.utils import timezone
from .models import Lead, Activity, Note, FollowUp
from accounts.serializers import UserSerializer


# ── Validation helpers ────────────────────────────────────────────────────────

def validate_indian_phone(value: str) -> str:
    """Validate and normalise Indian mobile numbers."""
    # Strip spaces, dashes, parentheses
    cleaned = re.sub(r"[\s\-\(\)]", "", value)
    # Remove country code if present
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("0"):
        cleaned = cleaned[1:]

    if not re.match(r"^[6-9]\d{9}$", cleaned):
        raise serializers.ValidationError(
            "Please enter a valid 10-digit Indian mobile number (starting with 6–9)."
        )
    return cleaned


# ── Public lead submission serializer ─────────────────────────────────────────

class PublicLeadSerializer(serializers.ModelSerializer):
    """
    Used by the public website form.
    Includes honeypot field (website_url) – silently accepted but checked server-side.
    """
    # Honeypot – should always be empty; bots fill it
    website_url = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        help_text="Leave this field empty.",
    )
    phone = serializers.CharField()

    class Meta:
        model = Lead
        fields = [
            # Honeypot
            "website_url",
            # Contact
            "name", "phone", "email",
            # Device
            "device_type", "brand_model", "repair_needed", "area",
            "issue_description",
            # Consent
            "consent",
            # UTM / tracking (read from form hidden fields)
            "utm_source", "utm_medium", "utm_campaign", "utm_term",
            "gclid", "landing_page", "referrer",
        ]

    def validate_phone(self, value):
        return validate_indian_phone(value)

    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError("You must consent to the privacy policy to submit.")
        return value

    def validate(self, attrs):
        # Honeypot check – mark lead but don't reject (prevents bot enumeration)
        honeypot = attrs.pop("website_url", "")
        attrs["honeypot_triggered"] = bool(honeypot)

        # Determine source from UTM
        utm_source = attrs.get("utm_source", "").lower()
        gclid = attrs.get("gclid", "")
        if gclid or "google" in utm_source:
            attrs["source"] = Lead.Source.GOOGLE_ADS
        elif utm_source:
            attrs["source"] = Lead.Source.OTHER
        else:
            attrs["source"] = Lead.Source.WEBSITE

        return attrs


# ── CRM serializers ────────────────────────────────────────────────────────────

class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ["id", "activity_type", "text", "timestamp", "user_name", "metadata"]

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "System"


class NoteSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ["id", "text", "created_at", "updated_at", "user_name"]
        read_only_fields = ["id", "created_at", "updated_at", "user_name"]

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return "Unknown"

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUp
        fields = ["id", "due_at", "note", "is_done", "done_at", "created_at"]
        read_only_fields = ["id", "created_at", "done_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class LeadListSerializer(serializers.ModelSerializer):
    """Compact serializer for table/kanban views."""
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            "id", "reference", "name", "phone", "device_type", "brand_model",
            "repair_needed", "area", "status", "source", "assigned_to_name",
            "created_at", "updated_at",
        ]

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None


class LeadDetailSerializer(serializers.ModelSerializer):
    """Full serializer for lead detail view."""
    activities = ActivitySerializer(many=True, read_only=True)
    notes = NoteSerializer(many=True, read_only=True)
    follow_ups = FollowUpSerializer(many=True, read_only=True)
    assigned_to_detail = UserSerializer(source="assigned_to", read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id", "reference",
            "name", "phone", "email",
            "device_type", "brand_model", "repair_needed", "area", "issue_description",
            "consent", "status", "lost_reason", "declined_reason",
            "source", "utm_source", "utm_medium", "utm_campaign", "utm_term",
            "gclid", "landing_page", "referrer",
            "assigned_to", "assigned_to_detail",
            "activities", "notes", "follow_ups",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "reference", "created_at", "updated_at"]


class LeadCreateManualSerializer(serializers.ModelSerializer):
    """CRM manual lead creation (walk-in / phone call)."""
    phone = serializers.CharField()

    class Meta:
        model = Lead
        fields = [
            "name", "phone", "email",
            "device_type", "brand_model", "repair_needed", "area",
            "issue_description", "source", "assigned_to",
        ]

    def validate_phone(self, value):
        return validate_indian_phone(value)

    def create(self, validated_data):
        validated_data.setdefault("source", Lead.Source.PHONE)
        validated_data["consent"] = True  # Staff-created leads are always consented
        return super().create(validated_data)


class BulkStatusUpdateSerializer(serializers.Serializer):
    lead_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    status = serializers.ChoiceField(choices=Lead.Status.choices)


class BulkAssignSerializer(serializers.Serializer):
    lead_ids = serializers.ListField(child=serializers.IntegerField(), min_length=1)
    user_id = serializers.IntegerField()
