"""Jobs URL routing."""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepairJobViewSet

router = DefaultRouter()
router.register(r"", RepairJobViewSet, basename="job")

urlpatterns = [path("", include(router.urls))]
