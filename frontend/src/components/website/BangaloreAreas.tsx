import React from 'react';
import { Link } from 'react-router-dom';
import { BANGALORE_AREAS } from '../../data/businessData';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface BangaloreAreasProps {
  onOpenBookingModal?: (areaName?: string) => void;
}

export const BangaloreAreas: React.FC<BangaloreAreasProps> = ({ onOpenBookingModal }) => {
  return (
    <section className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              Bangalore Logistics Network
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pickup & Return Across Bangalore
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              Daily scheduled courier routes connecting tech parks, residential apartments, and business hubs directly with our centralized diagnostic laboratory.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to="/areas"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1.5"
            >
              <span>View all Bangalore areas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BANGALORE_AREAS.map((area) => (
            <div
              key={area.slug}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{area.name}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{area.hubZone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-3 bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                  <span>{area.deliveryTurnaround}</span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Common Pickup Points:
                  </div>
                  <div className="text-slate-700 leading-relaxed text-xs">
                    {area.popularSpots.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/areas/${area.slug}`}
                  className="text-xs text-slate-600 hover:text-indigo-600 font-bold transition-colors"
                >
                  Locality info →
                </Link>

                <button
                  onClick={() => onOpenBookingModal?.(area.name)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-all cursor-pointer"
                >
                  Schedule in {area.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          Don't see your neighborhood listed? We serve Koramangala, Indiranagar, HSR Layout, Whitefield, Jayanagar, Marathahalli, Bellandur, Electronic City, and more across Bangalore. Submit your address on enquiry to confirm pickup feasibility.
        </div>
      </div>
    </section>
  );
};
