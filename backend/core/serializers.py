"""Core app serializers for reference data."""
from rest_framework import serializers
from .models import Service, ServiceArea


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name", "slug", "description", "is_active", "sort_order"]


class ServiceAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceArea
        fields = ["id", "name", "slug", "is_active"]
