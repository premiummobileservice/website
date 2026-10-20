"""Jobs app serializers."""
from rest_framework import serializers
from .models import RepairJob, QuoteLine
from accounts.serializers import UserSerializer


class QuoteLineSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()

    class Meta:
        model = QuoteLine
        fields = ["id", "description", "quantity", "unit_price", "line_total"]


class RepairJobSerializer(serializers.ModelSerializer):
    quote_lines = QuoteLineSerializer(many=True, read_only=True)
    technician_detail = UserSerializer(source="technician", read_only=True)

    class Meta:
        model = RepairJob
        fields = [
            "id", "job_id",
            "lead", "customer", "technician", "technician_detail",
            "device_description", "imei_serial", "device_condition_notes",
            "pickup_address", "pickup_scheduled_at", "picked_up_at",
            "delivery_address", "delivered_at",
            "status", "diagnosis_notes", "repair_notes",
            "quote_total", "quote_lines", "quote_sent_at", "approved_at",
            "quote_declined_reason",
            "payment_status", "payment_method", "payment_received_at",
            "completed_at", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "job_id", "created_at", "updated_at"]


class RepairJobListSerializer(serializers.ModelSerializer):
    technician_name = serializers.SerializerMethodField()

    class Meta:
        model = RepairJob
        fields = [
            "id", "job_id", "device_description", "status",
            "technician_name", "quote_total", "payment_status", "created_at",
        ]

    def get_technician_name(self, obj):
        if obj.technician:
            return obj.technician.get_full_name() or obj.technician.username
        return None
