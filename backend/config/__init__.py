"""Make config a Django application package and load Celery."""
from .celery import app as celery_app

__all__ = ("celery_app",)
