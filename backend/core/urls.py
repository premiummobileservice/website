"""Core app URL routing."""
from django.urls import path
from .views import (
    PublicServiceListView,
    PublicServiceAreaListView,
    DashboardStatsView,
)

urlpatterns = [
    path("services/", PublicServiceListView.as_view(), name="public-services"),
    path("areas/", PublicServiceAreaListView.as_view(), name="public-areas"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
]
