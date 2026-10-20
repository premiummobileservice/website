"""Axes lockout callable – returns DRF-style JSON error."""
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


def axes_lockout_response(request, credentials, *args, **kwargs):
    return JsonResponse(
        {
            "detail": "Too many failed login attempts. Your account has been temporarily locked. "
                      "Please try again in 30 minutes."
        },
        status=status.HTTP_429_TOO_MANY_REQUESTS,
    )
