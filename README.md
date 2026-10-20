# Premium Mobile Repair – Full-Stack System (Website + Django REST Backend + Staff CRM)

A complete, production-ready system for **Premium Mobile Repair**, a Bangalore device-repair business with doorstep pickup and delivery.

The system consists of three integrated components:
1. **Public React Website**: SEO-optimized, mobile-responsive doorstep device booking platform with real-time UTM tracking, zero price/review violations, and interactive Bangalore area landing pages.
2. **Django REST Backend**: Robust Python 3.12 / Django 5 REST API handling lead ingestion, deduplication, IP throttling, honeypot spam protection, Celery asynchronous email dispatch, JWT authentication, and role-based permissions (Admin, Manager, Technician, Telecaller).
3. **Staff CRM**: High-productivity React application featuring switchable Kanban pipeline, lead-to-job conversion, itemized quotation builder with PDF generation, customer history directory, and operational analytics.

---

## 1. Quick Start with Docker Compose

Running the entire stack requires only Docker & Docker Compose:

```bash
# 1. Clone the repository
git clone <repo-url>
cd premium-mobile-repair

# 2. Start all services (PostgreSQL, Redis, Django, Celery Worker, Celery Beat, React Frontend)
docker compose up --build
```

Services will be accessible at:
- **Public Website & Staff CRM**: [http://localhost:5173](http://localhost:5173)
- **Django REST API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger API Docs**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 2. Local Manual Development Setup

### Backend Setup (Django + Celery)
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL/SQLite and Redis credentials

# Run database migrations
python manage.py migrate

# Seed initial admin & demo users
python manage.py createsuperuser --username admin --email admin@premiummobilerepair.in

# Start Django development server
python manage.py runserver 0.0.0.0:8000

# In a separate terminal, run Celery worker (requires Redis)
celery -A config worker -l INFO
```

### Frontend Setup (React + Vite + TypeScript)
```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server with proxy to backend
npm run dev
# Accessible at http://localhost:5173
```

---

## 3. Staff CRM Access & Default Role Credentials

Visit `http://localhost:5173/crm/login`.

| Role | Username | Password | Permitted Views & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full system access, User Management, Email Settings, System Config |
| **Manager** | `manager` | `manager123` | Leads Pipeline, Jobs, Customers, Reports & Analytics, Export CSV |
| **Technician** | `technician` | `tech123` | Assigned Repair Jobs, Diagnostics, Quotation Builder & PDF Print |
| **Telecaller** | `telecaller` | `tele123` | Leads Pipeline, Call Logs, Internal Notes, Pickup Scheduling |

*(The login screen also provides quick-fill buttons for immediate role testing).*

---

## 4. End-to-End Verification Workflow

1. **Submit Public Enquiry**:
   - Go to [http://localhost:5173/](http://localhost:5173/).
   - Fill in the **Book Doorstep Pickup** form (e.g., iPhone 14 Pro, Screen Replacement, Koramangala, Mobile: `9880012345`).
   - Click **Schedule Free Doorstep Pickup**.
   - Notice instant confirmation card with reference code (e.g., `PMR-XXXXXX`).
2. **Review in Staff CRM**:
   - Navigate to [http://localhost:5173/crm/leads](http://localhost:5173/crm/leads).
   - The enquiry appears in the **New Enquiries** column within seconds.
   - Click the card to view customer details, area, and UTM tracking tags.
   - Click **Convert to Repair Job** to generate a lab work order.
3. **Itemized Quotation & PDF Print**:
   - Navigate to [http://localhost:5173/crm/jobs](http://localhost:5173/crm/jobs).
   - Open the job order. Add parts and labour amounts.
   - Click the **Printer** icon to view the printable letterhead quotation.

---

## 5. Third-Party Integrations & Configuration Guide

### A. SMTP Email Setup (Gmail / Google Workspace)
In `backend/.env`:
```ini
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=notifications@yourdomain.com
EMAIL_HOST_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Generate a 16-character App Password from Google Account Security
DEFAULT_FROM_EMAIL=Premium Mobile Repair <notifications@yourdomain.com>
LEAD_NOTIFY_EMAILS=dispatch@yourdomain.com,orders@yourdomain.com
```

### B. Google Tag Manager (GTM) & Google Analytics 4 (GA4)
In `frontend/.env`:
```ini
VITE_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### C. Google Ads Conversion & GCLID Tracking
The enquiry form automatically captures URL query parameters:
- `gclid`: Captured from Google Ads click and stored on the Lead model.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`: Automatically recorded and displayed in CRM Reports for ROI analysis.

---

## 6. Daily Database Backup Instructions

To perform a daily snapshot of the PostgreSQL database:
```bash
# Create automated backup directory
mkdir -p /backups/postgres

# Run pg_dump from Docker container
docker compose exec -t db pg_dump -U pmr_user -F c -b -v -f /var/lib/postgresql/data/pmr_backup_$(date +%Y%m%d_%H%M%S).dump pmr_db

# Restore from a backup snapshot:
docker compose exec -t db pg_restore -U pmr_user -d pmr_db /var/lib/postgresql/data/pmr_backup_YYYYMMDD_HHMMSS.dump
```

---

## 7. Compliance with Business Rules
- **No Pricing or Guarantees on Public Site**: The public website focuses exclusively on convenient doorstep pickup, technical diagnostics, and payment on satisfactory delivery. All pricing resides strictly within the Staff CRM quotation module.
- **Strict Anti-Spam & Deduplication**: Throttled to 5 submissions/min/IP with a silent honeypot field (`website_url`) and a 10-minute duplicate lead suppression filter.
