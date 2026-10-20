import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES, BUSINESS_INFO } from '../../data/businessData';
import { SEOHead } from '../../components/common/SEOHead';
import {
  Smartphone,
  Star,
  ArrowRight,
  Phone,
  Truck,
  Shield,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle,
  Wrench,
  MessageSquare,
  MapPin,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Map slug or alias
  const targetSlug = slug === 'iphone-screen-replacement' ? 'iphone-repair' : slug;
  const service = SERVICES.find((s) => s.slug === targetSlug || s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const isApple = service.slug === 'iphone-repair' || slug === 'iphone-screen-replacement';

  const structuredSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
    },
    areaServed: 'Bangalore',
    description: service.shortDesc,
  };

  return (
    <>
      <SEOHead
        title={`${isApple ? 'Specialized Apple iPhone Repair' : service.title} in Bangalore | Premium Mobile Repair`}
        description={`Bangalore's dedicated repair service. ${service.title} with doorstep pickup and delivery. Genuine parts, transparent diagnosis and quote before repair.`}
        canonicalUrl={`https://premiummobilerepair.in/services/${slug}`}
        schema={structuredSchema}
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-24 sm:pt-28">
        {/* ── Hero Section ── */}
        <section
          className="relative py-14 sm:py-18 border-b border-slate-200/80"
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 40%, #fdf4ff 70%, #fff7ed 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-indigo-600 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-indigo-600 font-semibold">
                {isApple ? 'Specialized Apple iPhone Repair' : service.title}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
                  <Star className="w-3.5 h-3.5 text-indigo-600" />
                  {isApple ? 'Apple Hardware Specialists' : 'Certified Hardware Care'}
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
                  {isApple ? 'Specialized Apple iPhone Repair in Bangalore' : `${service.title} in Bangalore`}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                  {isApple
                    ? "Bangalore's dedicated independent Apple repair service. iPhone screen, battery, TrueDepth Face ID, camera, rear housing glass, and logic board micro-soldering."
                    : service.fullDesc}
                </p>

                {/* Quick Info Bar */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Turnaround
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                      ⚡ Same Day or 24 Hours
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Component Grade
                    </div>
                    <div className="font-extrabold text-sm text-indigo-600 mt-0.5">
                      🛡️ OEM-Tested &amp; Precision Tools
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/book-repair?service=${slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all"
                  >
                    Request This Repair
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold transition-all shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span>Call: {BUSINESS_INFO.phone}</span>
                  </a>
                </div>
              </div>

              {/* Right Media Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-80 sm:h-96 object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-xs font-bold mb-2">
                    <Wrench className="w-3 h-3" />
                    {BUSINESS_INFO.name} Lab
                  </div>
                  <div className="font-bold text-sm sm:text-base text-white">
                    Precision ESD-Safe Bench Repair in Jayanagar, Bangalore
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4-Column Benefits Bar ── */}
        <section className="py-6 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Doorstep Pickup &amp; Return</div>
                  <div className="text-[11px] text-slate-500">Across eligible Bangalore areas</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Clear Quote First</div>
                  <div className="text-[11px] text-slate-500">No repair without approval</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">OEM-Tested Parts</div>
                  <div className="text-[11px] text-slate-500">Strict multi-point hardware QC</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Prompt Turnaround</div>
                  <div className="text-[11px] text-slate-500">Real-time status updates</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Detail Body ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
              {/* Left Column Content */}
              <div className="space-y-8">
                {/* 1. About Service */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-4">About This Repair Service</h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                    {service.fullDesc} Handled in an ESD-protected clean laboratory with precision tools.
                    With doorstep pickup and return across Bangalore, you receive lab-grade service
                    without the steep markup or multiple days of turnaround delay.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Covers iPhone 15, 14, 13, 12, 11, XS, XR, X, 8, SE series & flagship Android',
                      'Preserves original display sensor calibrations and ambient data',
                      'Laser desoldering for clean outer back glass restoration',
                      'Specialized TrueDepth, camera, and logic board micro-soldering',
                      'Transparent diagnostic and clear quotation before work begins',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Common Symptoms */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Diagnostic Checklist
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                    Common Symptoms You Might Be Experiencing
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6">
                    If your device shows any of these indicators, submit a repair enquiry for immediate pickup:
                  </p>

                  <div className="space-y-2.5">
                    {service.commonIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-900"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Lab Workflow */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <Wrench className="w-3.5 h-3.5" />
                    Lab Workflow
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                    How We Perform This Repair in Our Bangalore Lab
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        num: 1,
                        title: 'Diagnostic Hardware Assessment',
                        desc: 'We perform intake diagnostics checking sensor data, component calibration, ambient light, and battery cycle counts.',
                      },
                      {
                        num: 2,
                        title: 'Precision Lab Teardown & Isolation',
                        desc: 'Opening using thermal heating jigs and suction ensures zero frame stress. Screws and brackets are catalogued in magnetic project trays.',
                      },
                      {
                        num: 3,
                        title: 'Component Calibration & Data Programming',
                        desc: 'We use professional hardware programmers to migrate display calibration, battery health profiles, and sensor alignments.',
                      },
                      {
                        num: 4,
                        title: 'Perimeter Water-Seal & 24-Point Verification',
                        desc: 'A fresh adhesive seal is pressed into place. We test audio, charging speed, touchscreen response, wireless coils, and cameras.',
                      },
                    ].map(({ num, title, desc }) => (
                      <div key={num} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {num}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Supported Devices & Models */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2">Supported Devices &amp; Models</h2>
                  <p className="text-xs text-slate-500 mb-5">
                    We service all major smartphone brands and tablet series in Bangalore:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {service.supportedDevices.map((dev, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-900"
                      >
                        {dev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. FAQs */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Clear Answers
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>

                  <div className="space-y-3">
                    <details className="group rounded-2xl bg-slate-50 border border-slate-200 p-4 open:bg-white transition-colors">
                      <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                        <span>Will True Tone and Face ID continue to work after display repair?</span>
                        <span className="text-indigo-600 font-bold group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        Yes. Our lab uses specialized EEPROM programmers to transfer original display serial numbers to the new panel, preserving True Tone and Face ID functionality.
                      </p>
                    </details>

                    <details className="group rounded-2xl bg-slate-50 border border-slate-200 p-4 open:bg-white transition-colors">
                      <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                        <span>Can you replace just the broken glass if the display inside still works?</span>
                        <span className="text-indigo-600 font-bold group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        Yes! If your underlying OLED/LCD panel shows no lines or ink bleed, we can perform precision glass-only refurbishment using OCA laminators, reducing your repair cost significantly.
                      </p>
                    </details>

                    <details className="group rounded-2xl bg-slate-50 border border-slate-200 p-4 open:bg-white transition-colors">
                      <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                        <span>What is your typical turnaround time?</span>
                        <span className="text-indigo-600 font-bold group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        Standard screen and battery replacements are typically completed within 4 to 8 hours on the same day including pickup and delivery across Bangalore.
                      </p>
                    </details>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Sticky Cards */}
              <div className="space-y-6 sticky top-24">
                {/* Purple Action Card */}
                <div
                  className="rounded-3xl p-6 sm:p-7 text-white shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
                  }}
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                    DOORSTEP SERVICE
                  </div>
                  <h3 className="text-xl font-extrabold text-white mb-2">
                    Book Your Repair Assessment
                  </h3>
                  <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                    Tell us your device model and address. We pick up, diagnose thoroughly, and send you a
                    transparent quote before any work starts.
                  </p>

                  <Link
                    to={`/book-repair?service=${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-white text-indigo-700 font-bold text-xs shadow-lg hover:bg-slate-50 transition-all"
                  >
                    <span>Request Pickup &amp; Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-4 text-center">
                    <a
                      href={BUSINESS_INFO.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white underline font-medium hover:text-indigo-200 transition-colors"
                    >
                      💬 Or chat with us on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Direct Hotline */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Direct Repair Hotline
                  </div>
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center gap-2 text-lg font-extrabold text-indigo-600 hover:text-indigo-700 transition-colors mb-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{BUSINESS_INFO.phone}</span>
                  </a>
                  <p className="text-xs text-slate-500">
                    Available Monday to Saturday, 9:00 AM – 8:00 PM for instant technical consultation.
                  </p>
                </div>

                {/* Service Lab */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Service Lab in Bangalore</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    <strong>{BUSINESS_INFO.name}</strong>
                    <br />
                    {BUSINESS_INFO.address}
                  </p>
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>View on Google Maps</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
