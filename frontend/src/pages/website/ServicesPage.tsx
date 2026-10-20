import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES, BUSINESS_INFO } from '../../data/businessData';
import { SEOHead } from '../../components/common/SEOHead';
import {
  Smartphone,
  BatteryCharging,
  Droplets,
  Zap,
  Shield,
  Camera,
  Volume2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Phone,
  Wrench,
  Clock,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-indigo-600" />,
  BatteryCharging: <BatteryCharging className="w-6 h-6 text-indigo-600" />,
  Droplets: <Droplets className="w-6 h-6 text-indigo-600" />,
  Zap: <Zap className="w-6 h-6 text-indigo-600" />,
  Shield: <Shield className="w-6 h-6 text-indigo-600" />,
  Camera: <Camera className="w-6 h-6 text-indigo-600" />,
  Volume2: <Volume2 className="w-6 h-6 text-indigo-600" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-600" />,
};

interface ServicesPageProps {
  onOpenBookingModal: (serviceTitle?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenBookingModal }) => {
  return (
    <>
      <SEOHead
        title="Device Repair Services — iPhone, Screen, Battery & More in Bangalore | Premium Mobile Repair"
        description="Comprehensive device diagnostics: screen replacement, battery renewal, water damage restoration, charging port repair, camera, speaker, and motherboard repair across Bangalore."
        canonicalUrl="https://premiummobilerepair.in/services"
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-20">
        {/* ── Page Header ── */}
        <section
          className="py-16 text-center border-b border-slate-200/80"
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 40%, #fdf4ff 70%, #fff7ed 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
              <Wrench className="w-3.5 h-3.5 text-indigo-600" />
              Full Service Catalog
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Device Repair Services
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Every repair is handled by certified technicians using OEM-grade parts and precision tools.
              Free doorstep pickup and delivery across Bangalore.
            </p>
          </div>
        </section>

        {/* ── Services Catalog Grid ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Image Header with Zoom Effect */}
                    <div className="relative h-52 sm:h-60 overflow-hidden bg-slate-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-sm">
                          Bangalore Pickup &amp; Delivery
                        </span>
                        <div className="w-9 h-9 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-sm">
                          {iconMap[service.icon] || <Smartphone className="w-4 h-4 text-indigo-600" />}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {service.shortDesc}
                      </p>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                            Common Symptoms We Resolve:
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            {service.commonIssues.slice(0, 4).map((issue, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Supported Devices:
                          </h4>
                          <p className="text-xs text-slate-500">
                            {service.supportedDevices.join(' • ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Repair Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/book-repair?service=${service.slug}`}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Request Repair
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Callout */}
            <div className="mt-16 text-center bg-white border border-slate-200 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Need a custom device assessment?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                We handle motherboards, water-damaged logic circuits, Face ID restoration, and specialized micro-soldering.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  to="/book-repair"
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
                >
                  Book Free Pickup &amp; Quote
                </Link>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="px-6 py-3 rounded-full text-xs font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Call: {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
