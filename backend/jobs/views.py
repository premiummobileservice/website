"""Jobs views."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import RepairJob, QuoteLine
from .serializers import RepairJobSerializer, RepairJobListSerializer
from accounts.permissions import IsTelecallerOrAbove


class RepairJobViewSet(viewsets.ModelViewSet):
    filterset_fields = ["status", "payment_status", "technician"]
    search_fields = ["job_id", "device_description", "imei_serial"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = RepairJob.objects.select_related("technician", "lead")
        # Technicians only see their own jobs
        if user.role == "technician":
            return qs.filter(technician=user)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return RepairJobListSerializer
        return RepairJobSerializer

    def get_permissions(self):
        return [IsAuthenticated()]
