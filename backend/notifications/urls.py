"""Notifications URLs."""
from django.urls import path
from .views import EmailLogListView

urlpatterns = [
    path("email-log/", EmailLogListView.as_view(), name="email-log"),
]
