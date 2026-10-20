import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS_INFO, SERVICES } from '../../data/businessData';
import { Menu, X, ChevronDown, Lock, Phone, MessageSquare, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenBookingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBookingModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/60 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* ── Logo + Brand Name ── */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:border-indigo-300 transition-colors">
              <img
                src="/tab.png"
                alt="Premium Mobile Repair"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-black text-slate-900 text-[15px] sm:text-[18px] tracking-tight">
                  Premium
                </span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-[15px] sm:text-[18px] tracking-tight">
                  Mobile Repair
                </span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-1">
                Bangalore Doorstep Care
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-slate-600">
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                  location.pathname.startsWith('/services') ? 'text-slate-900 font-semibold' : ''
                }`}
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {servicesDropdown && (
                <div className="absolute top-full left-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-100 mb-1">
                    Doorstep Device Repairs
                  </div>
                  {SERVICES.slice(0, 6).map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="flex items-center px-3 py-2 text-[12px] rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="block text-center text-[11px] font-bold text-slate-900 hover:underline py-2 mt-1 border-t border-slate-100"
                  >
                    All Repair Services →
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/how-it-works"
              className={`px-4 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                location.pathname === '/how-it-works' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              How It Works
            </Link>

            <Link
              to="/areas"
              className={`px-4 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                location.pathname.startsWith('/areas') ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Bangalore Areas
            </Link>

            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                location.pathname === '/about' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg transition-colors hover:text-slate-900 ${
                location.pathname === '/contact' ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              Contacts
            </Link>
          </nav>

          {/* ── Desktop Right: Contact pill button (PulseIQ style) ── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="text-[12px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-2"
            >
              {BUSINESS_INFO.phone}
            </a>

            {/* Indigo pill "Book Repair" button matching reference design */}
            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Book Repair
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              to="/crm/dashboard"
              title="Staff CRM"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Book Repair
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-5 pt-4 pb-6">
          <div className="flex flex-col space-y-1 text-[13px] font-medium text-slate-700">
            <Link to="/" className="py-2.5 border-b border-slate-100 hover:text-slate-900">Home</Link>
            <Link to="/services" className="py-2.5 border-b border-slate-100 hover:text-slate-900">Services</Link>
            <Link to="/how-it-works" className="py-2.5 border-b border-slate-100 hover:text-slate-900">How It Works</Link>
            <Link to="/areas" className="py-2.5 border-b border-slate-100 hover:text-slate-900">Bangalore Areas</Link>
            <Link to="/about" className="py-2.5 border-b border-slate-100 hover:text-slate-900">About</Link>
            <Link to="/contact" className="py-2.5 border-b border-slate-100 hover:text-slate-900">Contacts</Link>

            <div className="pt-4 flex flex-col gap-2">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-slate-200 text-[12px] font-bold text-slate-800 bg-slate-50"
              >
                <Phone className="w-4 h-4" />
                Call {BUSINESS_INFO.phone}
              </a>
              <a
                href={BUSINESS_INFO.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-bold"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Chat
              </a>
              <Link
                to="/crm/dashboard"
                className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] text-slate-400 hover:text-slate-600"
              >
                <Lock className="w-3.5 h-3.5" /> Staff CRM Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
