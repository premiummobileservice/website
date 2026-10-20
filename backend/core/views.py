"""Core app views – public reference data and dashboard stats."""
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Service, ServiceArea
from .serializers import ServiceSerializer, ServiceAreaSerializer


class PublicServiceListView(ListAPIView):
    """Public endpoint – list of active services (for website enquiry form)."""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]


class PublicServiceAreaListView(ListAPIView):
    """Public endpoint – list of active service areas."""
    queryset = ServiceArea.objects.filter(is_active=True)
    serializer_class = ServiceAreaSerializer
    permission_classes = [AllowAny]


class DashboardStatsView(APIView):
    """CRM dashboard KPI stats."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from leads.models import Lead
        from jobs.models import RepairJob

        today = timezone.now().date()
        month_start = today.replace(day=1)

        # Leads stats
        new_today = Lead.objects.filter(created_at__date=today).count()
        open_leads = Lead.objects.filter(
            status__in=["new", "contacted", "pickup_scheduled"]
        ).count()
        completed_month = Lead.objects.filter(
            status="completed",
            updated_at__date__gte=month_start,
        ).count()

        total_leads_month = Lead.objects.filter(
            created_at__date__gte=month_start,
        ).count()

        conversion_rate = (
            round((completed_month / total_leads_month) * 100, 1)
            if total_leads_month > 0
            else 0.0
        )

        # Job stats
        in_repair = RepairJob.objects.filter(status="in_repair").count()
        awaiting_approval = RepairJob.objects.filter(status="quote_sent").count()
        pickups_scheduled = RepairJob.objects.filter(status="pickup_scheduled").count()

        return Response(
            {
                "new_leads_today": new_today,
                "open_leads": open_leads,
                "pickups_scheduled": pickups_scheduled,
                "in_repair": in_repair,
                "awaiting_approval": awaiting_approval,
                "completed_this_month": completed_month,
                "conversion_rate": conversion_rate,
            }
        )
