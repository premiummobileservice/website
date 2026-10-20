"""URL configuration for Premium Mobile Repair backend."""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django admin (keep for superuser access)
    path("admin/", admin.site.urls),

    # Public API (no auth required)
    path("api/public/", include("leads.urls_public")),

    # Authenticated API
    path("api/auth/", include("accounts.urls")),
    path("api/leads/", include("leads.urls")),
    path("api/jobs/", include("jobs.urls")),
    path("api/customers/", include("customers.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/core/", include("core.urls")),

    # OpenAPI Schema (staff only in production via spectacular settings)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    try:
        import debug_toolbar
        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
    except ImportError:
        pass
