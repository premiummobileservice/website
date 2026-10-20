"""
Celery tasks for email notifications.
All tasks use exponential backoff and log every attempt.
Email failures NEVER fail the lead submission request.
"""
import logging
from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)


def _send_email_with_log(
    lead_id,
    email_type: str,
    recipient: str,
    subject: str,
    text_body: str,
    html_body: str,
    task_id: str = "",
):
    """Helper that sends an email and updates the EmailLog."""
    from notifications.models import EmailLog

    log = EmailLog.objects.create(
        lead_id=lead_id,
        email_type=email_type,
        recipient=recipient,
        subject=subject,
        status=EmailLog.Status.QUEUED,
        task_id=task_id,
    )

    try:
        log.attempt_count += 1
        log.status = EmailLog.Status.RETRYING
        log.save(update_fields=["attempt_count", "status"])

        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send()

        log.status = EmailLog.Status.SENT
        log.sent_at = timezone.now()
        log.save(update_fields=["status", "sent_at"])
        logger.info(f"Email sent: {email_type} → {recipient} (lead_id={lead_id})")

    except Exception as exc:
        log.status = EmailLog.Status.FAILED
        log.error_message = str(exc)
        log.save(update_fields=["status", "error_message", "attempt_count"])
        logger.error(f"Email failed: {email_type} → {recipient}: {exc}")
        raise exc  # Allow Celery to retry


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 1 min, then 2 min, then 4 min
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=300,
    name="notifications.send_lead_notification_emails",
)
def send_lead_notification_emails(self, lead_id: int):
    """
    Queue both outbound emails for a new lead submission:
    1. Business notification email (to LEAD_NOTIFY_EMAILS)
    2. Customer acknowledgement email (if email provided)
    """
    from leads.models import Lead

    try:
        lead = Lead.objects.get(pk=lead_id)
    except Lead.DoesNotExist:
        logger.error(f"send_lead_notification_emails: Lead {lead_id} not found.")
        return

    crm_link = f"{settings.CRM_BASE_URL}/crm/leads/{lead.pk}"

    # ── 1. Business notification ──────────────────────────────────────────────
    notify_addresses = [e.strip() for e in settings.LEAD_NOTIFY_EMAILS if e.strip()]

    if notify_addresses:
        subject_business = f"New Repair Enquiry: {lead.reference} – {lead.brand_model}"
        context = {
            "lead": lead,
            "crm_link": crm_link,
            "business_name": "Premium Mobile Repair",
        }
        text_body = _render_text_business(lead, crm_link)
        html_body = _render_html_business(lead, crm_link)

        for email in notify_addresses:
            _send_email_with_log(
                lead_id=lead_id,
                email_type="lead_business",
                recipient=email,
                subject=subject_business,
                text_body=text_body,
                html_body=html_body,
                task_id=self.request.id or "",
            )

    # ── 2. Customer acknowledgement ────────────────────────────────────────────
    if lead.email:
        subject_customer = f"We received your repair enquiry – {lead.reference}"
        text_body_c = _render_text_customer(lead)
        html_body_c = _render_html_customer(lead)
        _send_email_with_log(
            lead_id=lead_id,
            email_type="lead_customer",
            recipient=lead.email,
            subject=subject_customer,
            text_body=text_body_c,
            html_body=html_body_c,
            task_id=self.request.id or "",
        )


# ── Email body helpers ─────────────────────────────────────────────────────────

def _render_text_business(lead, crm_link: str) -> str:
    return f"""
NEW REPAIR ENQUIRY - Premium Mobile Repair
==========================================

Reference: {lead.reference}
Submitted: {lead.created_at.strftime('%d %b %Y %H:%M IST')}

CUSTOMER DETAILS
Name:   {lead.name}
Phone:  {lead.phone}
Email:  {lead.email or 'Not provided'}

DEVICE & REPAIR
Device Type:    {lead.get_device_type_display()}
Brand / Model:  {lead.brand_model}
Repair Needed:  {lead.repair_needed}
Pickup Area:    {lead.area}

ISSUE DESCRIPTION
{lead.issue_description or 'No additional description provided.'}

SOURCE
Source:         {lead.get_source_display()}
UTM Source:     {lead.utm_source or '-'}
UTM Medium:     {lead.utm_medium or '-'}
UTM Campaign:   {lead.utm_campaign or '-'}
Landing Page:   {lead.landing_page or '-'}
GCLID:          {lead.gclid or '-'}

------------------------------------------
View in CRM: {crm_link}
------------------------------------------

This email was sent automatically when a lead was submitted on the Premium Mobile Repair website.
"""


def _render_html_business(lead, crm_link: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Enquiry – {lead.reference}</title></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6c3fff, #9b6dff); padding: 32px 24px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:22px;">New Repair Enquiry</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0;">Reference: <strong>{lead.reference}</strong></p>
    </div>
    <div style="padding: 28px 24px;">
      <h2 style="font-size:16px; color:#333; border-bottom:2px solid #6c3fff; padding-bottom:8px; margin-top:0;">Customer Details</h2>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr><td style="padding:6px 0; color:#666; width:140px;">Name</td><td style="padding:6px 0; font-weight:600; color:#111;">{lead.name}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Phone</td><td style="padding:6px 0; font-weight:600; color:#111;"><a href="tel:{lead.phone}" style="color:#6c3fff;">{lead.phone}</a></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Email</td><td style="padding:6px 0; color:#111;">{lead.email or 'Not provided'}</td></tr>
      </table>

      <h2 style="font-size:16px; color:#333; border-bottom:2px solid #6c3fff; padding-bottom:8px; margin-top:24px;">Device & Repair</h2>
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <tr><td style="padding:6px 0; color:#666; width:140px;">Device Type</td><td style="padding:6px 0; color:#111;">{lead.get_device_type_display()}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Brand / Model</td><td style="padding:6px 0; font-weight:600; color:#111;">{lead.brand_model}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Repair Needed</td><td style="padding:6px 0; color:#111;">{lead.repair_needed}</td></tr>
        <tr><td style="padding:6px 0; color:#666;">Pickup Area</td><td style="padding:6px 0; color:#111;">{lead.area}</td></tr>
      </table>

      {'<h2 style="font-size:16px; color:#333; border-bottom:2px solid #6c3fff; padding-bottom:8px; margin-top:24px;">Issue Description</h2><p style="font-size:14px; color:#444; line-height:1.6;">' + lead.issue_description + '</p>' if lead.issue_description else ''}

      <h2 style="font-size:16px; color:#333; border-bottom:2px solid #6c3fff; padding-bottom:8px; margin-top:24px;">Source</h2>
      <table style="width:100%; border-collapse:collapse; font-size:13px; color:#666;">
        <tr><td style="padding:4px 0; width:140px;">Source</td><td>{lead.get_source_display()}</td></tr>
        <tr><td style="padding:4px 0;">UTM Source</td><td>{lead.utm_source or '-'}</td></tr>
        <tr><td style="padding:4px 0;">UTM Medium</td><td>{lead.utm_medium or '-'}</td></tr>
        <tr><td style="padding:4px 0;">UTM Campaign</td><td>{lead.utm_campaign or '-'}</td></tr>
        <tr><td style="padding:4px 0;">GCLID</td><td style="word-break:break-all;">{lead.gclid or '-'}</td></tr>
        <tr><td style="padding:4px 0;">Landing Page</td><td style="word-break:break-all;">{lead.landing_page or '-'}</td></tr>
      </table>

      <div style="text-align:center; margin-top:32px;">
        <a href="{crm_link}" style="display:inline-block; background: linear-gradient(135deg, #6c3fff, #9b6dff); color:#fff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:600; font-size:15px;">
          View in CRM -&gt;
        </a>
      </div>
    </div>
    <div style="background:#f9f9f9; padding:16px 24px; text-align:center; font-size:12px; color:#999;">
      Premium Mobile Repair - Bangalore - Submitted {lead.created_at.strftime('%d %b %Y at %H:%M IST')}
    </div>
  </div>
</body>
</html>
"""


def _render_text_customer(lead) -> str:
    return f"""
Hi {lead.name.split()[0]},

Thank you for reaching out to Premium Mobile Repair!

We have received your repair enquiry for your {lead.brand_model}.

YOUR REFERENCE NUMBER: {lead.reference}
Please save this for your records.

WHAT HAPPENS NEXT?
Our team will review your enquiry and contact you at {lead.phone} to:
1. Confirm your pickup location and preferred time
2. Arrange collection of your device

IMPORTANT - Our commitment to you:
* We will diagnose your device and provide a full quotation before any repairs begin.
* No repair work will be carried out without your explicit approval.
* If you decline the quotation, a diagnostic charge may apply.
* Payment is collected only on satisfactory completion of repair and delivery.

If you have any questions in the meantime, please keep your reference number ({lead.reference}) handy when you contact us.

Thank you for choosing Premium Mobile Repair.

-- The Premium Mobile Repair Team
Bangalore, Karnataka, India
"""


def _render_html_customer(lead) -> str:
    first_name = lead.name.split()[0]
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Enquiry Received - {lead.reference}</title></head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin:0; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #6c3fff, #9b6dff); padding: 32px 24px; text-align:center;">
      <h1 style="color:#fff; margin:0; font-size:22px;">We've got your enquiry!</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0;">Reference: <strong>{lead.reference}</strong></p>
    </div>
    <div style="padding: 28px 24px;">
      <p style="font-size:16px; color:#333;">Hi <strong>{first_name}</strong>,</p>
      <p style="color:#555; line-height:1.7;">
        Thank you for contacting Premium Mobile Repair. We've received your enquiry for your
        <strong>{lead.brand_model}</strong> and our team will be in touch shortly at
        <strong>{lead.phone}</strong>.
      </p>

      <div style="background: linear-gradient(135deg, #f0ebff, #e8e0ff); border-radius:8px; padding:20px; margin: 24px 0; text-align:center;">
        <p style="margin:0 0 8px; color:#555; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Your Reference Number</p>
        <p style="margin:0; font-size:28px; font-weight:700; color:#6c3fff; letter-spacing:2px;">{lead.reference}</p>
        <p style="margin:8px 0 0; font-size:12px; color:#888;">Please save this for your records</p>
      </div>

      <h2 style="font-size:16px; color:#333; margin-top:28px;">What happens next?</h2>
      <ol style="color:#555; line-height:2; font-size:14px; padding-left:20px;">
        <li>We will contact you to confirm your pickup location and time</li>
        <li>Our team will collect your device from you</li>
        <li>We'll diagnose the issue and send you a full quotation</li>
        <li>Repairs begin only after <strong>your approval</strong></li>
        <li>Device delivered back - payment on satisfactory completion</li>
      </ol>

      <div style="background:#fff8f0; border-left:4px solid #ff9500; border-radius:0 8px 8px 0; padding:16px; margin-top:24px;">
        <p style="margin:0; font-size:13px; color:#444; line-height:1.6;">
          <strong>Important:</strong> No repairs are carried out without your explicit approval.
          If you decline the quotation, a diagnostic charge may apply.
          Payment is only collected on satisfactory repair and delivery.
        </p>
      </div>
    </div>
    <div style="background:#f9f9f9; padding:16px 24px; text-align:center; font-size:12px; color:#999;">
      Premium Mobile Repair - Bangalore, Karnataka, India<br>
      If you didn't submit this enquiry, please ignore this email.
    </div>
  </div>
</body>
</html>
"""
