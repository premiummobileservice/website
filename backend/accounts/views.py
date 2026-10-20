"""Accounts views: login, logout, me, users CRUD, password management."""
import logging
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, ChangePasswordSerializer
from .permissions import IsAdminRole, IsManagerOrAbove

logger = logging.getLogger(__name__)
User = get_user_model()


class LoginView(TokenObtainPairView):
    """JWT login – returns access + refresh tokens."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            logger.info(f"Login: {request.data.get('username')} from {self._get_ip(request)}")
        return response

    def _get_ip(self, request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR", "")


class LogoutView(generics.GenericAPIView):
    """Blacklist the refresh token to invalidate the session."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass  # Token may already be expired or invalid
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)


class MeView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the currently authenticated user's profile."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """Change the current user's password."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated successfully."})


class UserViewSet(viewsets.ModelViewSet):
    """CRUD for CRM users – Admin only for write, Manager+ for read."""
    queryset = User.objects.all().order_by("first_name")
    filterset_fields = ["role", "is_active"]
    search_fields = ["username", "email", "first_name", "last_name"]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsManagerOrAbove()]
        return [IsAdminRole()]

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response(
                {"detail": "Cannot deactivate your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)
