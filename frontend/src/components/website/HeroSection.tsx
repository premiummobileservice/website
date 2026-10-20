import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, CheckCircle, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onOpenBookingModal?: () => void;
}

// Animated counter
const Counter: React.FC<{ to: number; suffix?: string; duration?: number }> = ({
  to, suffix = '', duration = 1800,
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBookingModal }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden pt-[72px]"
      style={{
        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 30%, #fdf4ff 55%, #fff1f5 80%, #fff7ed 100%)',
      }}
    >
      {/* ── Subtle radial blob accents (non-intrusive) ── */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-[560px] h-[560px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #c7d2fe 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ddd6fe 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(ellipse, #fbcfe8 0%, transparent 60%)' }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-10 flex items-center">
        <div className="w-full grid lg:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-center py-14 lg:py-20">

          {/* LEFT: Text Column */}
          <div
            className={`flex flex-col transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start mb-6 px-4 py-2 rounded-full bg-white/80 border border-slate-200 shadow-sm text-[12px] font-semibold text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Doorstep Pickup · All Bangalore
            </div>

            {/* Headline – big, bold, two-tone like PulseIQ */}
            <h1 className="text-[3rem] sm:text-[3.6rem] lg:text-[4rem] xl:text-[4.4rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 mb-6">
              Your Phone,{' '}
              <span className="relative inline-block">
                <span
                  className="relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Broken.
                </span>
              </span>
              <br />
              We Fix It{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Today.
              </span>
            </h1>

            <p className="text-[15px] sm:text-[16px] text-slate-500 leading-relaxed max-w-[520px] mb-8">
              Premium doorstep mobile repair in Bangalore. We pick up your cracked screen,
              dead battery, or water-damaged phone — fix it with genuine parts — and deliver
              it back, same day.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                { icon: CheckCircle, label: 'Genuine Parts' },
                { icon: Zap, label: 'Same-Day Repair' },
                { icon: Shield, label: '6-Month Warranty' },
                { icon: MapPin, label: 'All Bangalore Areas' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 text-[12px] font-medium text-slate-700 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-500" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenBookingModal}
                id="hero-book-pickup-btn"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-700 text-white text-[14px] font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                Book Free Pickup
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border-2 border-slate-200 bg-white/80 hover:bg-white text-slate-800 text-[14px] font-semibold transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Call for Instant Help
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-200/80">
              {[
                { value: 4800, suffix: '+', label: 'Devices Repaired' },
                { value: 98, suffix: '%', label: 'Same-Day Fix Rate' },
                { value: 6, suffix: '-Month', label: 'Parts Warranty' },
                { value: 40, suffix: '+', label: 'Bangalore Areas' },
              ].map(({ value, suffix, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-[1.7rem] font-extrabold text-slate-900 leading-none tabular-nums">
                    {mounted ? <Counter to={value} suffix={suffix} /> : `0${suffix}`}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Broken Phone Visual */}
          <div
            className={`relative flex items-center justify-center transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Glow halo behind phone */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40 scale-90"
              style={{ background: 'radial-gradient(circle, #a5b4fc 0%, #c4b5fd 40%, transparent 70%)' }}
            />

            {/* Phone card container */}
            <div className="relative z-10 w-full max-w-[400px] mx-auto">
              {/* Decorative card backdrop */}
              <div
                className="absolute inset-x-8 -top-4 -bottom-4 rounded-[2.5rem] blur-xl opacity-60"
                style={{ background: 'linear-gradient(160deg, #c7d2fe, #e9d5ff)' }}
              />

              {/* The phone image */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src="/images/broken_phone_hero.jpg"
                  alt="Cracked smartphone screen needing repair – Premium Mobile Repair Bangalore"
                  className="w-full h-auto object-cover block"
                  style={{ maxHeight: '560px', objectPosition: 'center top' }}
                />

                {/* Glass overlay shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Floating badge: "Screen Cracked?" */}
              <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-slate-100 text-[12px] font-semibold text-slate-800 max-w-[150px]">
                <span className="text-xl">💔</span>
                <div>
                  <div className="font-bold text-slate-900">Screen Cracked?</div>
                  <div className="text-[10px] text-slate-500 font-normal">We fix it same day</div>
                </div>
              </div>

              {/* Floating badge: "Pickup Ready" */}
              <div className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-slate-100 text-[12px] font-semibold text-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">🛵</div>
                <div>
                  <div className="font-bold text-slate-900">Free Pickup</div>
                  <div className="text-[10px] text-slate-500 font-normal">All Bangalore</div>
                </div>
              </div>

              {/* Floating badge: repair in progress */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 text-[12px] font-bold whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-ping" />
                <span>Repair Starting Now</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom gradient fade into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))' }}
      />
    </section>
  );
};
