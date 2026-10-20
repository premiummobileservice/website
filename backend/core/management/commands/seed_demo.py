"""
Management command: seed_demo
Creates an admin user and clearly labelled demo data for LOCAL development only.
Never run this in production.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from core.models import Service, ServiceArea

User = get_user_model()

SERVICES = [
    ("Screen Replacement", "screen-replacement", "Fix cracked, unresponsive or discoloured displays."),
    ("Battery Replacement", "battery-replacement", "Restore all-day battery life with a genuine-grade battery."),
    ("Water Damage Repair", "water-damage-repair", "Specialist cleaning and component-level repair after liquid exposure."),
    ("Charging Port Repair", "charging-port-repair", "Fix slow, intermittent or failed charging on any device."),
    ("iPhone Repair", "iphone-repair", "Full-service iPhone repairs covering all models from iPhone 8 onwards."),
    ("Camera Repair", "camera-repair", "Fix blurry, black or non-functioning front and rear cameras."),
    ("Speaker & Microphone Repair", "speaker-microphone-repair", "Restore clear call audio and loudspeaker performance."),
    ("Face ID & Motherboard Repair", "face-id-motherboard-repair", "Advanced board-level repairs including Face ID restoration."),
]

AREAS = [
    "Koramangala", "Indiranagar", "HSR Layout", "Whitefield",
    "Jayanagar", "Marathahalli", "Bannerghatta Road", "Electronic City",
    "JP Nagar", "Bellandur", "Sarjapur Road", "Yelahanka",
    "Rajajinagar", "Malleshwaram", "Basavanagudi",
]


class Command(BaseCommand):
    help = "Seed demo data for LOCAL development. DO NOT run in production."

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("⚠️  Seeding DEMO data – local use only!"))

        # Admin user
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@demo.local",
                "first_name": "Demo",
                "last_name": "Admin",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("demo1234!")
            admin.save()
            self.stdout.write(self.style.SUCCESS("  ✓ Admin user created: admin / demo1234!"))
        else:
            self.stdout.write("  · Admin user already exists.")

        # Staff users
        for username, role, name in [
            ("manager1", "manager", "Priya Manager"),
            ("telecaller1", "telecaller", "Rahul Caller"),
            ("tech1", "technician", "Suresh Tech"),
        ]:
            first, last = name.split(" ")
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@demo.local",
                    "first_name": first,
                    "last_name": last,
                    "role": role,
                    "is_staff": True,
                },
            )
            if created:
                user.set_password("demo1234!")
                user.save()
                self.stdout.write(self.style.SUCCESS(f"  ✓ {role.title()}: {username} / demo1234!"))

        # Services
        for name, slug, desc in SERVICES:
            s, created = Service.objects.get_or_create(
                slug=slug,
                defaults={"name": name, "description": desc, "is_active": True},
            )
            if created:
                self.stdout.write(f"  ✓ Service: {name}")

        # Service areas
        for area in AREAS:
            sa, created = ServiceArea.objects.get_or_create(
                slug=slugify(area),
                defaults={"name": area, "is_active": True},
            )
            if created:
                self.stdout.write(f"  ✓ Area: {area}")

        # Demo leads
        self._seed_leads()

        self.stdout.write(self.style.SUCCESS("\n✅ Demo seed complete."))

    def _seed_leads(self):
        from leads.models import Lead
        import random

        demo_leads = [
            {
                "name": "[DEMO] Aakash Sharma",
                "phone": "9876543210",
                "email": "aakash@demo.local",
                "device_type": "smartphone",
                "brand_model": "iPhone 14 Pro",
                "repair_needed": "screen-replacement",
                "area": "Koramangala",
                "issue_description": "[DEMO] Screen is cracked and touch is unresponsive in the top area.",
                "status": "new",
                "source": "website",
            },
            {
                "name": "[DEMO] Meera Nair",
                "phone": "9123456789",
                "email": "meera@demo.local",
                "device_type": "smartphone",
                "brand_model": "Samsung Galaxy S23",
                "repair_needed": "battery-replacement",
                "area": "Indiranagar",
                "issue_description": "[DEMO] Battery drains within 3 hours of normal use.",
                "status": "contacted",
                "source": "google_ads",
            },
            {
                "name": "[DEMO] Rohit Verma",
                "phone": "9988776655",
                "email": "",
                "device_type": "smartphone",
                "brand_model": "OnePlus 11",
                "repair_needed": "charging-port-repair",
                "area": "HSR Layout",
                "issue_description": "[DEMO] Phone only charges when held at a specific angle.",
                "status": "pickup_scheduled",
                "source": "website",
            },
        ]

        for data in demo_leads:
            if not Lead.objects.filter(phone=data["phone"]).exists():
                Lead.objects.create(**data, consent=True)
                self.stdout.write(f"  ✓ Lead: {data['name']}")
