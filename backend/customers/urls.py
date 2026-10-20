"""Customers URLs."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .serializers import CustomerViewSet

router = DefaultRouter()
router.register(r"", CustomerViewSet, basename="customer")

urlpatterns = [path("", include(router.urls))]
