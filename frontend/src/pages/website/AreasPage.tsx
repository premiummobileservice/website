import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';
import {
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { BUSINESS_INFO } from '../../data/businessData';

interface AreasPageProps {
  onOpenBookingModal: (areaName?: string) => void;
}

const SERVED_AREAS = [
  { name: 'Koramangala', pincode: '560034–560095', slug: 'koramangala' },
  { name: 'Indiranagar', pincode: '560038', slug: 'indiranagar' },
  { name: 'HSR Layout', pincode: '560102', slug: 'hsr-layout' },
  { name: 'Jayanagar', pincode: '560041', slug: 'jayanagar' },
  { name: 'JP Nagar', pincode: '560078', slug: 'jp-nagar' },
  { name: 'BTM Layout', pincode: '560076', slug: 'btm-layout' },
  { name: 'Banashankari', pincode: '560070', slug: 'banashankari' },
  { name: 'Whitefield', pincode: '560066', slug: 'whitefield' },
  { name: 'Marathahalli', pincode: '560037', slug: 'marathahalli' },
  { name: 'Electronic City', pincode: '560100', slug: 'electronic-city' },
  { name: 'Sarjapur Road', pincode: '560035', slug: 'sarjapur-road' },
  { name: 'Bellandur', pincode: '560103', slug: 'bellandur' },
];

const CONFIRMATION_AREAS = [
  { name: 'Hebbal', pincode: '560024' },
  { name: 'Yelahanka', pincode: '560064' },
  { name: 'Rajajinagar', pincode: '560010' },
  { name: 'Malleswaram', pincode: '560003' },
  { name: 'Basavanagudi', pincode: '560004' },
  { name: 'Bannerghatta Road', pincode: '560083' },
];

export const AreasPage: React.FC<AreasPageProps> = ({ onOpenBookingModal }) => {
  return (
    <>
      <SEOHead
        title="Device Repair Service Areas in Bangalore — Premium Mobile Repair | Doorstep Pickup & Delivery"
        description="Premium Mobile Repair provides device repair with pickup and delivery across Bangalore, Karnataka. Check if we serve your area — Koramangala, Indiranagar, HSR Layout, Whitefield, and more."
        canonicalUrl="https://premiummobilerepair.in/service-areas/bangalore"
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-24 sm:pt-28">
        {/* ── Hero Section ── */}
        <section
          className="relative py-16 sm:py-20 border-b border-slate-200/80 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 40%, #fdf4ff 70%, #fff7ed 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-indigo-700 uppercase tracking-wider mb-5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                Bangalore Coverage
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
                Device Repair in Bangalore with Pickup &amp; Delivery
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                {BUSINESS_INFO.name} provides doorstep pickup and delivery for device repairs across
                Bangalore, Karnataka. Submit an enquiry and we&apos;ll confirm coverage for your specific
                location.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/book-repair"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Request a Repair
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold transition-all shadow-sm"
                >
                  Ask About Your Area
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 Pickup Benefits ── */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">We Come to You</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Our executive collects your device from your home or office at the scheduled time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Flexible Scheduling</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Choose morning, afternoon, or evening pickup windows that suit your daily schedule.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Area Confirmation</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We confirm pickup availability for your specific location before scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Areas Grid (Served Areas & Confirmation Required) ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Served Areas */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-xl font-extrabold text-slate-900">Served Areas</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    12 areas
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Pickup and delivery is available in these Bangalore areas. Submit an enquiry to schedule.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVED_AREAS.map((area) => (
                    <button
                      key={area.name}
                      onClick={() => onOpenBookingModal(area.name)}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {area.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{area.pincode}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Confirmation Required */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h2 className="text-xl font-extrabold text-slate-900">Confirmation Required</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    6 areas
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Coverage in these areas requires confirmation before scheduling. Submit an enquiry and
                  we&apos;ll verify availability for your location.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {CONFIRMATION_AREAS.map((area) => (
                    <button
                      key={area.name}
                      onClick={() => onOpenBookingModal(area.name)}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-left group cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                          {area.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{area.pincode}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Area Not Listed Callout */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">Your area not listed?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Submit an enquiry with your location and we&apos;ll check if we can serve you. We&apos;re
                    continuously expanding our Bangalore doorstep coverage.
                  </p>
                  <Link
                    to="/book-repair"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Enquiry
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Informative SEO Text Section ── */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
              Device Repair with Pickup &amp; Delivery in Bangalore
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                <strong>{BUSINESS_INFO.name}</strong> provides professional device repair services across
                Bangalore, Karnataka. Whether you need iPhone screen replacement, battery replacement,
                water damage repair, or charging port repair, we cover a wide range of device issues with the
                convenience of doorstep pickup and delivery.
              </p>
              <p>
                Rather than visiting a crowded service centre and waiting in long queues, you can submit a
                repair enquiry online and our team will arrange to collect your device from your home or
                office in Bangalore. After assessing your device in our ESD-safe central diagnostic lab, we
                send you a clear itemized quotation — you only pay if you approve the repair.
              </p>
              <p>
                Our pickup service is active across major Bangalore hubs including Koramangala, Indiranagar,
                HSR Layout, Whitefield, Jayanagar, BTM Layout, Marathahalli, Electronic City, and many more.
                Coverage is continuously expanding. If your specific pincode is not listed above, simply
                submit an enquiry or call our support team to verify instant availability.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
