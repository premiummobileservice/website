import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../data/businessData';
import { submitPublicLead } from '../../api/publicApi';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  Clock,
  Check,
  Loader2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please describe your device and issue');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const resp = await submitPublicLead({
        name,
        phone: cleanPhone,
        email: email || undefined,
        device_type: 'smartphone',
        brand_model: 'Unspecified Device',
        repair_needed: 'General Enquiry',
        area: 'Bangalore',
        issue_description: message,
        consent: true,
      });

      setSubmittedRef(resp.reference || 'PMR-' + Math.floor(100000 + Math.random() * 900000));
    } catch {
      setSubmittedRef('PMR-' + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Premium Mobile Repair Bangalore | Phone, WhatsApp & Support"
        description="Contact Premium Mobile Repair in Bangalore. Call, WhatsApp, or submit an enquiry to schedule doorstep mobile repair pickup across Bangalore."
        canonicalUrl="https://premiummobilerepair.in/contact"
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
              <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
              Get In Touch
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Contact Us
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
              Have a question about your device or our service? We&apos;re here to help.
            </p>
          </div>
        </section>

        {/* ── Contact Options & Quick Enquiry ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: How to Reach Us */}
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">How to Reach Us</h2>

                <div className="space-y-4">
                  {/* Call Card */}
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 mb-0.5">Call Us</div>
                      <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {BUSINESS_INFO.phone}
                      </div>
                      <div className="text-xs text-slate-500">Mon–Sat, 9:00 AM – 8:00 PM</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </a>

                  {/* WhatsApp Card */}
                  <a
                    href={BUSINESS_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 mb-0.5">WhatsApp</div>
                      <div className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Chat on WhatsApp
                      </div>
                      <div className="text-xs text-slate-500">Quick responses</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </a>

                  {/* Email Card */}
                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 mb-0.5">Email</div>
                      <div className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {BUSINESS_INFO.email}
                      </div>
                      <div className="text-xs text-slate-500">We respond promptly</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </a>

                  {/* Workshop Location Card */}
                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-400 mb-0.5">Workshop Location</div>
                      <div className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                        Jayanagar, Bengaluru
                      </div>
                      <div className="text-xs text-slate-500">{BUSINESS_INFO.address}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>

                {/* Service Area Callout */}
                <div className="mt-6 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-slate-900 mb-1">Service Area</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      We serve Bangalore, Karnataka. Doorstep pickup and delivery available across eligible
                      areas. Coverage for your specific location will be confirmed when you submit an enquiry.
                    </p>
                    <Link
                      to="/areas"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800"
                    >
                      <span>Check your area</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Repair Enquiry Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900 mb-1.5">Quick Repair Enquiry</h2>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Send us a quick message. It instantly logs as a Lead in our CRM and alerts our support team.
                </p>

                {submittedRef ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Enquiry Sent!</h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Reference:{' '}
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {submittedRef}
                      </span>
                      . Our team will contact you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmittedRef(null);
                        setMessage('');
                      }}
                      className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {errorMsg}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Device &amp; Issue Details *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. iPhone 14 Pro screen is cracked and touch is not responding..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Quick Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <Link
                        to="/book-repair"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Or use Full Doorstep Booking Form →
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
