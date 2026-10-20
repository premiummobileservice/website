"""
Leads views – public submission and CRM management.
"""
import logging
import csv
from io import StringIO

from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.utils import timezone
from django.db import transaction
from datetime import timedelta

from .models import Lead, Activity, Note, FollowUp
from .serializers import (
    PublicLeadSerializer,
    LeadListSerializer,
    LeadDetailSerializer,
    LeadCreateManualSerializer,
    NoteSerializer,
    FollowUpSerializer,
    ActivitySerializer,
    BulkStatusUpdateSerializer,
    BulkAssignSerializer,
)
from accounts.permissions import IsTelecallerOrAbove, IsManagerOrAbove
from notifications.tasks import send_lead_notification_emails

logger = logging.getLogger(__name__)
User = get_user_model()


class LeadSubmitThrottle(AnonRateThrottle):
    """5 lead submissions per minute per IP."""
    rate = "5/min"
    scope = "lead_submit"


class PublicLeadCreateView(generics.CreateAPIView):
    """
    POST /api/public/leads/
    Public endpoint – no authentication required.
    Validates, deduplicates, saves, queues emails, returns reference code.
    """
    serializer_class = PublicLeadSerializer
    permission_classes = [AllowAny]
    throttle_classes = [LeadSubmitThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Silently drop honeypot-triggered submissions
        if validated_data.get("honeypot_triggered"):
            logger.warning(f"Honeypot triggered from IP: {self._get_ip()}")
            # Return success to avoid alerting bots
            return Response(
                {"reference": "PMR-000000", "message": "Thank you! We will be in touch shortly."},
                status=status.HTTP_201_CREATED,
            )

        # Deduplication: same phone + repair within 10 minutes
        ten_minutes_ago = timezone.now() - timedelta(minutes=10)
        phone = validated_data.get("phone", "")
        existing = Lead.objects.filter(
            phone=phone,
            created_at__gte=ten_minutes_ago,
        ).first()

        if existing:
            logger.info(f"Duplicate lead detected for phone {phone}, returning existing ref {existing.reference}")
            return Response(
                {
                    "reference": existing.reference,
                    "message": "Thank you! We already received your enquiry and will be in touch shortly.",
                },
                status=status.HTTP_200_OK,
            )

        # Save lead
        with transaction.atomic():
            lead = Lead.objects.create(**validated_data)
            Activity.objects.create(
                lead=lead,
                activity_type=Activity.ActivityType.STATUS_CHANGE,
                text=f"Lead created via website. Status: New.",
            )

        logger.info(f"New lead created: {lead.reference} from {self._get_ip()}")

        # Queue emails (failure must NOT fail the request)
        try:
            send_lead_notification_emails.apply_async(
                args=[lead.pk],
            )
        except Exception as e:
            logger.warning(f"Failed to queue email task for lead {lead.reference}: {e}. Trying direct dispatch.")
            try:
                send_lead_notification_emails.apply(args=[lead.pk])
            except Exception as exc:
                logger.error(f"Direct email dispatch also failed for lead {lead.reference}: {exc}")

        return Response(
            {
                "reference": lead.reference,
                "message": "Thank you! We've received your repair enquiry and will contact you shortly. "
                           "No repairs are carried out without your approval.",
            },
            status=status.HTTP_201_CREATED,
        )

    def _get_ip(self):
        xff = self.request.META.get("HTTP_X_FORWARDED_FOR")
        return xff.split(",")[0].strip() if xff else self.request.META.get("REMOTE_ADDR", "")


# ── CRM Lead ViewSet ───────────────────────────────────────────────────────────

class LeadFilter:
    """Simple filter helper."""
    pass


class LeadViewSet(viewsets.ModelViewSet):
    """
    CRM lead management – full CRUD + bulk actions + CSV export.
    Telecaller+: read + note + follow-up.
    Manager+: assign, status, bulk.
    Admin: delete.
    """
    permission_classes = [IsTelecallerOrAbove]
    filterset_fields = ["status", "source", "device_type", "area", "assigned_to"]
    search_fields = ["name", "phone", "email", "brand_model", "reference", "area"]
    ordering_fields = ["created_at", "updated_at", "status", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Lead.objects.select_related("assigned_to")
        # Technicians don't see leads (only jobs)
        if user.role == "technician":
            return Lead.objects.none()
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return LeadListSerializer
        if self.action == "create":
            return LeadCreateManualSerializer
        return LeadDetailSerializer

    def perform_create(self, serializer):
        lead = serializer.save()
        Activity.objects.create(
            lead=lead,
            user=self.request.user,
            activity_type=Activity.ActivityType.OTHER,
            text=f"Lead manually created by {self.request.user.get_full_name() or self.request.user.username}.",
        )

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_status = old_instance.status
        old_assigned = old_instance.assigned_to_id

        instance = serializer.save()

        # Auto-log status change
        if instance.status != old_status:
            Activity.objects.create(
                lead=instance,
                user=self.request.user,
                activity_type=Activity.ActivityType.STATUS_CHANGE,
                text=f"Status changed from '{old_status}' to '{instance.status}'.",
            )

        # Auto-log assignment change
        if instance.assigned_to_id != old_assigned:
            assignee_name = (
                instance.assigned_to.get_full_name() if instance.assigned_to else "Unassigned"
            )
            Activity.objects.create(
                lead=instance,
                user=self.request.user,
                activity_type=Activity.ActivityType.ASSIGNED,
                text=f"Lead assigned to {assignee_name}.",
            )

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "admin":
            return Response(
                {"detail": "Only admins can delete leads."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    # ── Nested actions ─────────────────────────────────────────────────────────

    @action(detail=True, methods=["get", "post"], url_path="notes")
    def notes(self, request, pk=None):
        lead = self.get_object()
        if request.method == "GET":
            notes = Note.objects.filter(lead=lead)
            return Response(NoteSerializer(notes, many=True).data)
        serializer = NoteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        note = serializer.save(lead=lead)
        Activity.objects.create(
            lead=lead,
            user=request.user,
            activity_type=Activity.ActivityType.NOTE_ADDED,
            text=f"Note added: {note.text[:100]}{'...' if len(note.text) > 100 else ''}",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post"], url_path="follow-ups")
    def follow_ups(self, request, pk=None):
        lead = self.get_object()
        if request.method == "GET":
            fus = FollowUp.objects.filter(lead=lead)
            return Response(FollowUpSerializer(fus, many=True).data)
        serializer = FollowUpSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        fu = serializer.save(lead=lead)
        Activity.objects.create(
            lead=lead,
            user=request.user,
            activity_type=Activity.ActivityType.FOLLOW_UP,
            text=f"Follow-up scheduled for {fu.due_at.strftime('%d %b %Y %H:%M')}.",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], url_path="activities")
    def activities(self, request, pk=None):
        lead = self.get_object()
        acts = Activity.objects.filter(lead=lead)
        return Response(ActivitySerializer(acts, many=True).data)

    @action(detail=True, methods=["post"], url_path="convert-to-job",
            permission_classes=[IsManagerOrAbove])
    def convert_to_job(self, request, pk=None):
        lead = self.get_object()
        from jobs.models import RepairJob
        from jobs.serializers import RepairJobSerializer

        if hasattr(lead, "repair_job"):
            return Response(
                {"detail": "A repair job already exists for this lead.",
                 "job_id": lead.repair_job.pk},
                status=status.HTTP_200_OK,
            )
        job = RepairJob.objects.create(
            lead=lead,
            device_description=f"{lead.brand_model} – {lead.repair_needed}",
            status=RepairJob.Status.PICKUP_SCHEDULED,
        )
        lead.status = Lead.Status.PICKUP_SCHEDULED
        lead.save()
        Activity.objects.create(
            lead=lead,
            user=request.user,
            activity_type=Activity.ActivityType.JOB_CREATED,
            text=f"Repair job {job.job_id} created.",
        )
        return Response({"job_id": job.pk, "job_ref": job.job_id}, status=status.HTTP_201_CREATED)

    # ── Bulk actions ────────────────────────────────────────────────────────────

    @action(detail=False, methods=["post"], url_path="bulk-status",
            permission_classes=[IsManagerOrAbove])
    def bulk_status(self, request):
        serializer = BulkStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        leads = Lead.objects.filter(pk__in=serializer.validated_data["lead_ids"])
        new_status = serializer.validated_data["status"]
        count = leads.count()
        leads.update(status=new_status)
        return Response({"updated": count, "status": new_status})

    @action(detail=False, methods=["post"], url_path="bulk-assign",
            permission_classes=[IsManagerOrAbove])
    def bulk_assign(self, request):
        serializer = BulkAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(pk=serializer.validated_data["user_id"])
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        leads = Lead.objects.filter(pk__in=serializer.validated_data["lead_ids"])
        count = leads.count()
        leads.update(assigned_to=user)
        return Response({"assigned": count, "to": user.get_full_name() or user.username})

    @action(detail=False, methods=["get"], url_path="export-csv",
            permission_classes=[IsManagerOrAbove])
    def export_csv(self, request):
        """Export filtered leads as CSV."""
        qs = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="leads.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "Reference", "Name", "Phone", "Email", "Device", "Brand/Model",
            "Repair Needed", "Area", "Status", "Source", "Assigned To",
            "Created", "UTM Source", "UTM Medium", "UTM Campaign",
        ])
        for lead in qs:
            writer.writerow([
                lead.reference, lead.name, lead.phone, lead.email,
                lead.device_type, lead.brand_model, lead.repair_needed,
                lead.area, lead.status, lead.source,
                lead.assigned_to.get_full_name() if lead.assigned_to else "",
                lead.created_at.strftime("%Y-%m-%d %H:%M"),
                lead.utm_source, lead.utm_medium, lead.utm_campaign,
            ])
        return response

    # ── Dashboard follow-ups ────────────────────────────────────────────────────

    @action(detail=False, methods=["get"], url_path="follow-ups-due")
    def follow_ups_due(self, request):
        """Follow-ups due today for current user."""
        today_end = timezone.now().replace(hour=23, minute=59, second=59)
        fus = FollowUp.objects.filter(
            is_done=False,
            due_at__lte=today_end,
        ).select_related("lead")
        if request.user.role not in ("admin", "manager"):
            fus = fus.filter(created_by=request.user)
        return Response(FollowUpSerializer(fus, many=True).data)
