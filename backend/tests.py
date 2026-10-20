"""
Backend tests – lead creation, deduplication, throttling, email queuing, permissions.
Run: pytest
"""
import pytest
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

# ── Fixtures ────────────────────────────────────────────────────────────────


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    user = User.objects.create_user(
        username="testadmin",
        password="TestPass123!",
        email="admin@test.local",
        role="admin",
        is_staff=True,
        is_superuser=True,
    )
    return user


@pytest.fixture
def telecaller_user(db):
    user = User.objects.create_user(
        username="testcaller",
        password="TestPass123!",
        email="caller@test.local",
        role="telecaller",
        is_staff=True,
    )
    return user


@pytest.fixture
def technician_user(db):
    user = User.objects.create_user(
        username="testtech",
        password="TestPass123!",
        email="tech@test.local",
        role="technician",
        is_staff=True,
    )
    return user


@pytest.fixture
def auth_admin_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def auth_telecaller_client(api_client, telecaller_user):
    api_client.force_authenticate(user=telecaller_user)
    return api_client


@pytest.fixture
def auth_technician_client(api_client, technician_user):
    api_client.force_authenticate(user=technician_user)
    return api_client


VALID_LEAD_PAYLOAD = {
    "name": "Aakash Sharma",
    "phone": "9876543210",
    "email": "aakash@test.com",
    "device_type": "smartphone",
    "brand_model": "iPhone 14 Pro",
    "repair_needed": "screen-replacement",
    "area": "Koramangala",
    "issue_description": "Cracked screen, touch unresponsive.",
    "consent": True,
    "website_url": "",  # Honeypot empty
}


# ── Lead submission tests ───────────────────────────────────────────────────


@pytest.mark.django_db
@patch("leads.views.send_lead_notification_emails.apply_async")
def test_public_lead_create_success(mock_task, api_client):
    """Valid submission creates a lead and queues emails."""
    url = "/api/public/leads/"
    response = api_client.post(url, VALID_LEAD_PAYLOAD, format="json")
    assert response.status_code == 201
    data = response.json()
    assert "reference" in data
    assert data["reference"].startswith("PMR-")
    mock_task.assert_called_once()


@pytest.mark.django_db
def test_public_lead_invalid_phone(api_client):
    """Invalid phone number returns 400."""
    payload = {**VALID_LEAD_PAYLOAD, "phone": "12345"}
    response = api_client.post("/api/public/leads/", payload, format="json")
    assert response.status_code == 400
    assert "phone" in response.json()


@pytest.mark.django_db
def test_public_lead_no_consent(api_client):
    """Missing consent returns 400."""
    payload = {**VALID_LEAD_PAYLOAD, "consent": False}
    response = api_client.post("/api/public/leads/", payload, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
@patch("leads.views.send_lead_notification_emails.apply_async")
def test_public_lead_honeypot(mock_task, api_client):
    """Honeypot-triggered submissions return 201 but don't queue real emails."""
    payload = {**VALID_LEAD_PAYLOAD, "website_url": "http://spam.com"}
    response = api_client.post("/api/public/leads/", payload, format="json")
    assert response.status_code == 201
    # Email task should NOT be called for honeypot hits
    mock_task.assert_not_called()


@pytest.mark.django_db
@patch("leads.views.send_lead_notification_emails.apply_async")
def test_public_lead_deduplication(mock_task, api_client):
    """Same phone within 10 minutes returns 200 with existing reference."""
    url = "/api/public/leads/"
    r1 = api_client.post(url, VALID_LEAD_PAYLOAD, format="json")
    assert r1.status_code == 201
    ref1 = r1.json()["reference"]

    r2 = api_client.post(url, VALID_LEAD_PAYLOAD, format="json")
    assert r2.status_code == 200
    assert r2.json()["reference"] == ref1


@pytest.mark.django_db
def test_public_lead_requires_required_fields(api_client):
    """Missing required fields returns 400."""
    response = api_client.post("/api/public/leads/", {}, format="json")
    assert response.status_code == 400


# ── Auth tests ──────────────────────────────────────────────────────────────


@pytest.mark.django_db
def test_login_success(api_client, admin_user):
    response = api_client.post(
        "/api/auth/login/",
        {"username": "testadmin", "password": "TestPass123!"},
        format="json",
    )
    assert response.status_code == 200
    assert "access" in response.json()
    assert "refresh" in response.json()


@pytest.mark.django_db
def test_login_wrong_password(api_client, admin_user):
    response = api_client.post(
        "/api/auth/login/",
        {"username": "testadmin", "password": "wrongpass"},
        format="json",
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_me_endpoint(auth_admin_client):
    response = auth_admin_client.get("/api/auth/me/")
    assert response.status_code == 200
    assert response.json()["username"] == "testadmin"


# ── Permission tests ─────────────────────────────────────────────────────────


@pytest.mark.django_db
def test_leads_list_requires_auth(api_client):
    """Unauthenticated access to CRM leads is forbidden."""
    response = api_client.get("/api/leads/")
    assert response.status_code == 401


@pytest.mark.django_db
@patch("leads.views.send_lead_notification_emails.apply_async")
def test_telecaller_can_view_leads(mock_task, auth_telecaller_client):
    """Telecallers can list leads."""
    response = auth_telecaller_client.get("/api/leads/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_technician_cannot_view_leads(auth_technician_client):
    """Technicians get empty leads list (role-filtered)."""
    response = auth_technician_client.get("/api/leads/")
    assert response.status_code == 200
    assert response.json()["count"] == 0


@pytest.mark.django_db
def test_unauthenticated_cannot_access_crm_leads(api_client):
    """No auth → 401."""
    response = api_client.get("/api/leads/")
    assert response.status_code == 401


# ── Email task tests ─────────────────────────────────────────────────────────


@pytest.mark.django_db
@patch("django.core.mail.EmailMultiAlternatives.send")
def test_email_log_created_on_send(mock_send, db):
    """Email log entry is created when email task runs."""
    from leads.models import Lead
    from notifications.tasks import send_lead_notification_emails
    from notifications.models import EmailLog

    lead = Lead.objects.create(
        name="Test User",
        phone="9123456789",
        email="test@example.com",
        brand_model="iPhone 13",
        repair_needed="battery-replacement",
        area="Indiranagar",
        consent=True,
    )

    with patch("django.conf.settings.LEAD_NOTIFY_EMAILS", ["biz@test.local"]):
        # Call synchronously in tests
        send_lead_notification_emails(lead.pk)

    assert EmailLog.objects.filter(lead_id=lead.pk).count() >= 1


@pytest.mark.django_db
def test_email_failure_does_not_raise_to_view(api_client):
    """
    Even if email task fails to queue, the lead submission still returns 201.
    """
    with patch("leads.views.send_lead_notification_emails.apply_async", side_effect=Exception("Redis down")):
        response = api_client.post("/api/public/leads/", VALID_LEAD_PAYLOAD, format="json")
    assert response.status_code == 201
