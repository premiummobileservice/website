import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BANGALORE_AREAS, SERVICES } from '../../data/businessData';
import { SEOHead } from '../../components/common/SEOHead';
import { EnquiryForm } from '../../components/website/EnquiryForm';
import { MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const AreaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const area = BANGALORE_AREAS.find((a) => a.slug === slug);

  if (!area) {
    return <Navigate to="/areas" replace />;
  }

  return (
    <>
      <SEOHead
        title={`Mobile & Gadget Repair in ${area.name}, Bangalore | Free Pickup`}
        description={`Doorstep phone and device repair in ${area.name}, Bangalore (${area.pincode}). Screen, battery, and motherboard repair with ${area.deliveryTurnaround.toLowerCase()}.`}
        canonicalUrl={`https://premiummobilerepair.in/areas/${area.slug}`}
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-20">
        {/* ── Page Header ── */}
        <section
          className="py-14 sm:py-18 border-b border-slate-200/80"
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 40%, #fdf4ff 70%, #fff7ed 100%)',
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-indigo-600">Home</Link>
              <span>/</span>
              <Link to="/areas" className="hover:text-indigo-600">Areas</Link>
              <span>/</span>
              <span className="text-indigo-600 font-bold">{area.name}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {area.hubZone}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Doorstep Device Repair in {area.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Convenient doorstep device collection and delivery serving residences, apartments, and tech parks throughout {area.name} (PIN: {area.pincode}). Our executive collects your smartphone or laptop securely, transports it to our central lab, and returns it after repair and quality testing.
            </p>
          </div>
        </section>

        {/* ── Main Detail Grid ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 space-y-6">
                {/* Turnaround Badge */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
                  <Clock className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div className="text-xs sm:text-sm text-slate-600">
                    <strong className="text-slate-900">Estimated Turnaround for {area.name}:</strong>{' '}
                    {area.deliveryTurnaround}. Scheduled morning and afternoon executive dispatch routes.
                  </div>
                </div>

                {/* Common Pickup Locations */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Frequent Pickup Landmarks in {area.name}:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                    {area.popularSpots.map((spot, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services available in this area */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Services Provided in {area.name}:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-800 hover:text-indigo-700 transition-colors"
                      >
                        <span className="font-medium">{s.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area Booking Form */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                  <EnquiryForm initialArea={area.name} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
