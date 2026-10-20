import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO, SERVICES, BANGALORE_AREAS } from '../../data/businessData';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0c1322] border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-[#090e1a] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Bangalore Doorstep Diagnostics & Repair</div>
              <div className="text-slate-400 text-xs">Diagnosis before quotation. Payment only on satisfactory completion.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <a
              href={BUSINESS_INFO.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center">
              <div className="bg-white/10 rounded-xl p-1.5 hover:bg-white/20 transition-colors">
                <img
                  src="/pmr.png"
                  alt="Premium Mobile Repair Logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              Professional doorstep smartphone, tablet, and gadget diagnostics across Bangalore. Safe executive collection and return delivery serving Koramangala, Indiranagar, HSR Layout, Whitefield, and all Bangalore localities.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{BUSINESS_INFO.hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-indigo-300">
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-4">
              Repair Services
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="hover:text-indigo-300 transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bangalore Areas Column */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-4">
              Pickup Areas
            </h4>
            <ul className="space-y-2 text-xs">
              {BANGALORE_AREAS.slice(0, 7).map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/areas/${a.slug}`}
                    className="hover:text-indigo-300 transition-colors"
                  >
                    {a.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/areas" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  View all Bangalore zones →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-300 transition-colors">
                  Our 6-Step Workflow
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-300 transition-colors">
                  About Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-300 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-300 transition-colors">
                  Terms & Diagnostic Policy
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/crm/login"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Staff CRM Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-4 text-xs">
          <p>© {new Date().getFullYear()} Premium Mobile Repair. All rights reserved. Bangalore, Karnataka, India.</p>
          <p>No repair without customer approval. Doorstep collection and delivery across Bangalore.</p>
        </div>
      </div>
    </footer>
  );
};
