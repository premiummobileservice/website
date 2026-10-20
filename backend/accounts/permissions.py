"""DRF permission classes for role-based access control."""
from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Any authenticated CRM staff member (all roles)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsAdminRole(BasePermission):
    """Only Admin role users."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsManagerOrAbove(BasePermission):
    """Admin or Manager roles."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "manager")
        )


class IsTelecallerOrAbove(BasePermission):
    """Admin, Manager, or Telecaller roles."""
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "manager", "telecaller")
        )
