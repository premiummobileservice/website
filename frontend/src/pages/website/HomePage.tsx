import React from 'react';
import { HeroSection } from '../../components/website/HeroSection';
import { ProcessWorkflow } from '../../components/website/ProcessWorkflow';
import { ServicesGrid } from '../../components/website/ServicesGrid';
import { BangaloreAreas } from '../../components/website/BangaloreAreas';
import { FAQSection } from '../../components/website/FAQSection';
import { SEOHead } from '../../components/common/SEOHead';
import { ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onOpenBookingModal: (serviceTitle?: string, areaName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenBookingModal }) => {
  return (
    <>
      <SEOHead
        title="Premium Mobile Repair | Doorstep Phone & Device Repair in Bangalore"
        description="Bangalore's trusted doorstep mobile and gadget repair service. Fast pickup and delivery across Koramangala, Indiranagar, HSR Layout, Whitefield & all Bangalore. Diagnosis before quote."
        canonicalUrl="https://premiummobilerepair.in/"
      />

      <HeroSection onOpenBookingModal={() => onOpenBookingModal()} />

      <ServicesGrid onOpenBookingModal={(service) => onOpenBookingModal(service)} />

      <ProcessWorkflow onOpenBookingModal={() => onOpenBookingModal()} />

      {/* Hardware Diagnostic Standards Section with Pinterest-style Photography */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Laboratory Standards
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Microscopic Bench Diagnostics & Controlled ESD Workstations
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
                Rather than makeshift counter repairs, your device is transported directly to our specialized Bangalore repair lab equipped with thermal imaging cameras, ultrasonic solvent baths, stereomicroscopes, and precision desoldering stations.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Strict Hardware Data Privacy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your files, photos, and accounts remain completely untouched. Diagnostics focus solely on motherboard rails and peripheral sensor health.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Component-Level Micro-Soldering</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We repair damaged power management ICs, charging controllers, and flex cables whenever feasible instead of imposing whole-board swaps.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/25 cursor-pointer text-xs sm:text-sm"
                >
                  <span>Book Free Doorstep Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pinterest Workshop Image Card & Checklist */}
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src="/images/about_workbench.jpg"
                  alt="High-precision electronic diagnostic workstation in Bangalore"
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Bangalore Pickup & Diagnosis Checklist
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Physical acknowledgment receipt given at handover</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>High-resolution intake photos documented in our system</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>25-point hardware functional test</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Detailed itemized quote sent via call, email, or WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Zero repair work without your verbal or written confirmation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Safe return delivery & verification before payment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BangaloreAreas onOpenBookingModal={(area) => onOpenBookingModal(undefined, area)} />

      <FAQSection />
    </>
  );
};
