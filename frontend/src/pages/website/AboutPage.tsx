import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../data/businessData';
import {
  ShieldCheck,
  MapPin,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Phone,
  Truck,
  Sparkles,
  Award,
  Clock,
  Lock,
} from 'lucide-react';

interface AboutPageProps {
  onOpenBookingModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBookingModal }) => {
  return (
    <>
      <SEOHead
        title="About Us | Doorstep Gadget & Phone Repair in Bangalore | Premium Mobile Repair"
        description="Premium Mobile Repair operates dedicated pickup and delivery logistics and a centralized hardware laboratory in Bangalore, Karnataka."
        canonicalUrl="https://premiummobilerepair.in/about"
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-24 sm:pt-28">
        {/* ── Hero Section ── */}
        <section
          className="relative py-16 sm:py-24 border-b border-slate-200/80 overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 35%, #fdf4ff 70%, #fff7ed 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs font-bold text-indigo-700 uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Bangalore Specialists
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              Engineered For Modern{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bangalore Living
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Navigating Bangalore traffic just to visit a mobile repair shop shouldn’t cost you hours of
              productive time. {BUSINESS_INFO.name} bridges device owners with certified lab diagnostics
              right at their doorstep.
            </p>

            {/* Quick Stat Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-200/60 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">4,800+</div>
                <div className="text-xs text-slate-500 font-medium">Devices Repaired</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Approval Before Work</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">Same-Day</div>
                <div className="text-xs text-slate-500 font-medium">Turnaround Rate</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div>
                <div className="text-2xl font-extrabold text-slate-900">12+</div>
                <div className="text-xs text-slate-500 font-medium">Core Tech Hubs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Centralized Laboratory Story ── */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                  <Wrench className="w-3.5 h-3.5" />
                  Our Diagnostic Workspace
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                  Bridging Busy Bangalore With Precision Hardware Care
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  <p>
                    Rather than rushing delicate screen laminations or motherboard micro-soldering in cramped
                    market kiosks, we established an ESD-protected diagnostic laboratory in Jayanagar, Bangalore.
                  </p>
                  <p>
                    Every device collected by our logistics personnel is transported in shock-insulated cases
                    directly to our optical inspection benches. We perform multi-point sensor diagnostics,
                    display EEPROM data programming, and ultrasonic chemical board cleaning under microscope.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Anti-static ESD safe mats &amp; grounding</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Stereo optical microscope stations</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Laser back glass desoldering</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>True Tone &amp; Face ID programmers</span>
                  </div>
                </div>
              </div>

              {/* Lab Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/about_workbench.jpg"
                  alt="Premium Mobile Repair Bangalore Diagnostic Laboratory"
                  className="w-full h-[380px] sm:h-[460px] object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-[11px] font-bold mb-2">
                    <Award className="w-3.5 h-3.5" />
                    Jayanagar Laboratory
                  </div>
                  <div className="font-extrabold text-sm sm:text-base">
                    Microscope Soldering &amp; Optical Calibration Bench
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    #159, 1st Floor 32nd E Cross Rd, Tilak Nagar, Jayanagar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: The Three Pillars (Redesigned with contrast) ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Built Around Your Convenience
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Three core principles that govern every single pickup, diagnosis, and doorstep handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  Dedicated Bangalore Fleet
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our logistics personnel operate across key Bangalore corridors: Koramangala, Indiranagar,
                  HSR Layout, Whitefield, Bellandur, and Electronic City, collecting and delivering devices on
                  scheduled daily runs.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  Centralized Laboratory
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rather than rushing repairs in cramped retail kiosks, all complex screen lamination,
                  ultrasonic board cleaning, and micro-soldering take place in an ESD-protected diagnostic
                  workspace with calibrated tooling.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  Transparent Governance
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every device receives an acknowledgment voucher upon collection. Quotations are strictly
                  itemized and presented for approval before any repair work commences. Zero surprise charges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Doorstep Handover Experience ── */}
        <section className="py-16 sm:py-20 bg-white border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white order-2 lg:order-1">
                <img
                  src="/images/about_doorstep.jpg"
                  alt="Customer receiving repaired phone at Bangalore apartment doorstep"
                  className="w-full h-[380px] sm:h-[460px] object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-[11px] font-bold mb-2">
                    <Truck className="w-3.5 h-3.5" />
                    Doorstep Delivery
                  </div>
                  <div className="font-extrabold text-sm sm:text-base">
                    Safe Handoff &amp; Verification Before Payment
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
                  <Truck className="w-3.5 h-3.5" />
                  Effortless Process
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
                  Your Phone Repaired Without Leaving Your Desk
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  <p>
                    Whether you are working from a tech park in Bellandur or staying at an apartment in
                    Koramangala, our dispatch executive coordinates with your schedule to pick up your phone.
                  </p>
                  <p>
                    Once the diagnostic assessment is complete, we WhatsApp you an itemized estimate. Upon your
                    approval, genuine parts are fitted and your device is returned in an anti-static cushioned
                    box for you to test on the spot.
                  </p>
                </div>

                <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Zero Upfront Advance</div>
                      <div className="text-[11px] text-slate-500">You pay only when satisfied with the repair.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Data Privacy Assurance</div>
                      <div className="text-[11px] text-slate-500">Your passcode is never required for standard hardware bench repairs.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Up to 6-Month Warranty</div>
                      <div className="text-[11px] text-slate-500">Every replaced screen, battery, or charging port carries our written warranty.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Bottom CTA Banner ── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div
              className="rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
              }}
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    Ready for Hassle-Free Repair?
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                    Book a convenient doorstep pickup window from your home or office in Bangalore. No upfront payment.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={onOpenBookingModal}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Book Free Doorstep Pickup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all text-center"
                  >
                    Call: {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Subtle background glow */}
              <div
                className="pointer-events-none absolute -bottom-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-30"
                style={{ background: '#818cf8' }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
