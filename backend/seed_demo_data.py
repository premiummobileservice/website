"""Seed initial staff users, services, and Bangalore areas for local testing."""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
from core.models import Service, ServiceArea

User = get_user_model()

# 1. Create Staff Users
users_to_create = [
    {"username": "admin", "email": "admin@premiummobilerepair.in", "role": "admin", "password": "admin123", "first_name": "Admin", "last_name": "User", "is_staff": True, "is_superuser": True},
    {"username": "manager", "email": "manager@premiummobilerepair.in", "role": "manager", "password": "manager123", "first_name": "Sanjay", "last_name": "Deshmukh", "is_staff": True},
    {"username": "technician", "email": "tech@premiummobilerepair.in", "role": "technician", "password": "tech123", "first_name": "Rajesh", "last_name": "Kumar", "is_staff": True},
    {"username": "telecaller", "email": "tele@premiummobilerepair.in", "role": "telecaller", "password": "tele123", "first_name": "Anita", "last_name": "Rao", "is_staff": True},
]

for u in users_to_create:
    user, created = User.objects.get_or_create(username=u["username"], defaults={
        "email": u["email"],
        "role": u["role"],
        "first_name": u["first_name"],
        "last_name": u["last_name"],
        "is_staff": u.get("is_staff", False),
        "is_superuser": u.get("is_superuser", False),
    })
    user.set_password(u["password"])
    user.role = u["role"]
    user.is_staff = u.get("is_staff", False)
    user.is_superuser = u.get("is_superuser", False)
    user.save()
    print(f"User {u['username']} ({u['role']}) created/updated.")

# 2. Seed Services
services_data = [
    {"name": "Screen Replacement", "slug": "screen-replacement", "description": "Display repair", "sort_order": 1},
    {"name": "Battery Replacement", "slug": "battery-replacement", "description": "Battery replacement", "sort_order": 2},
    {"name": "Water Damage Repair", "slug": "water-damage-repair", "description": "Ultrasonic cleaning", "sort_order": 3},
    {"name": "Charging Port Repair", "slug": "charging-port-repair", "description": "Port replacement", "sort_order": 4},
    {"name": "iPhone Specialized Repair", "slug": "iphone-repair", "description": "Apple diagnostics", "sort_order": 5},
    {"name": "Camera & Lens Repair", "slug": "camera-repair", "description": "Lens and sensor fix", "sort_order": 6},
    {"name": "Speaker & Mic Repair", "slug": "speaker-mic-repair", "description": "Audio replacement", "sort_order": 7},
    {"name": "Face ID & Motherboard Repair", "slug": "motherboard-repair", "description": "Micro-soldering", "sort_order": 8},
]

for s in services_data:
    Service.objects.get_or_create(slug=s["slug"], defaults=s)

# 3. Seed Bangalore Areas
areas_data = [
    {"name": "Koramangala", "slug": "koramangala", "is_active": True},
    {"name": "Indiranagar", "slug": "indiranagar", "is_active": True},
    {"name": "HSR Layout", "slug": "hsr-layout", "is_active": True},
    {"name": "Whitefield", "slug": "whitefield", "is_active": True},
    {"name": "Jayanagar", "slug": "jayanagar", "is_active": True},
    {"name": "Marathahalli", "slug": "marathahalli", "is_active": True},
    {"name": "Bellandur", "slug": "bellandur", "is_active": True},
    {"name": "Electronic City", "slug": "electronic-city", "is_active": True},
    {"name": "BTM Layout", "slug": "btm-layout", "is_active": True},
]

for a in areas_data:
    ServiceArea.objects.get_or_create(slug=a["slug"], defaults=a)

print("Demo seed complete successfully!")
