"""Public leads URL (no auth required)."""
from django.urls import path
from .views import PublicLeadCreateView

urlpatterns = [
    path("leads/", PublicLeadCreateView.as_view(), name="public-lead-create"),
]
