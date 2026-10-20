"""Notifications views."""
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import EmailLog
from .serializers import EmailLogSerializer


class EmailLogListView(ListAPIView):
    """CRM: email history for a lead (filter by lead_id)."""
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["lead_id", "email_type", "status"]

    def get_queryset(self):
        return EmailLog.objects.all()
