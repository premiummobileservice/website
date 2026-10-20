"""Customers serializers, views and URLs."""
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    total_jobs = serializers.ReadOnlyField()
    completed_jobs = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = [
            "id", "name", "phone", "email", "address", "notes",
            "total_jobs", "completed_jobs", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "phone", "email"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]
