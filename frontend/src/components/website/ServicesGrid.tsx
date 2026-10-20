import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/businessData';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface ServicesGridProps {
  onOpenBookingModal?: (serviceTitle?: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onOpenBookingModal }) => {
  return (
    <section className="py-20 bg-white border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Hardware Diagnostics & Repair
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Specialized Doorstep Repair Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Covering iPhone, Android smartphones, tablets, and laptops. Picked up from your location anywhere in Bangalore.
          </p>
        </div>

        {/* Pinterest-Style Rich Visual Grid with Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo with zoom effect */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                    Bangalore Pickup
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-extrabold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Key Symptoms:
                    </div>
                    {service.commonIssues.slice(0, 2).map((issue, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <Link
                  to={`/services/${service.slug}`}
                  className="text-xs text-slate-600 hover:text-indigo-600 font-bold inline-flex items-center gap-1 transition-colors"
                >
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => onOpenBookingModal?.(service.title)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                >
                  Book Pickup
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Explore full diagnostic capabilities and repair methods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
