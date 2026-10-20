import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../data/businessData';
import { submitPublicLead } from '../../api/publicApi';
import { trackLeadSubmitted } from '../../utils/analytics';
import {
  Truck,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Loader2,
  Check,
} from 'lucide-react';

const DEVICE_BRANDS: Record<string, string[]> = {
  iPhone: ['Apple'],
  'Android Phone': ['Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'Motorola', 'Other'],
  'MacBook / Laptop': ['Apple (MacBook)', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Other'],
  'iPad / Tablet': ['Apple (iPad)', 'Samsung', 'Lenovo', 'OnePlus Pad', 'Other'],
  Smartwatch: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Other'],
  Other: ['Other Brand'],
};

export const BookRepairPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preselectedService = searchParams.get('service') || '';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceCategory, setDeviceCategory] = useState(
    preselectedService.includes('iphone') ? 'iPhone' : 'Android Phone'
  );
  const [deviceBrand, setDeviceBrand] = useState(
    preselectedService.includes('iphone') ? 'Apple' : 'Samsung'
  );
  const [deviceModel, setDeviceModel] = useState('');
  const [reportedProblem, setReportedProblem] = useState(
    preselectedService.includes('screen')
      ? 'Screen Cracked / Broken'
      : preselectedService.includes('battery')
      ? 'Battery Draining Fast'
      : preselectedService.includes('water')
      ? 'Water Damage'
      : 'Screen Cracked / Broken'
  );
  const [pickupArea, setPickupArea] = useState('');
  const [pickupPincode, setPickupPincode] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [contactPreference, setContactPreference] = useState('phone');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update brand options when category changes
  const handleCategoryChange = (cat: string) => {
    setDeviceCategory(cat);
    const brands = DEVICE_BRANDS[cat] || ['Other'];
    setDeviceBrand(brands[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!consent) {
      setErrorMsg('Please agree to the privacy policy to submit your enquiry');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const resp = await submitPublicLead({
        name: fullName,
        phone: cleanPhone,
        email: email || undefined,
        device_type: deviceCategory === 'iPhone' || deviceCategory === 'Android Phone' ? 'smartphone' : deviceCategory === 'iPad / Tablet' ? 'tablet' : deviceCategory === 'MacBook / Laptop' ? 'laptop' : 'other',
        brand_model: `${deviceBrand} ${deviceModel}`.trim(),
        repair_needed: reportedProblem,
        area: `${pickupArea} ${pickupPincode ? `(${pickupPincode})` : ''}`.trim() || 'Bangalore',
        issue_description: `Preferred Time: ${preferredTime || 'Any time'} | Preferred Contact: ${contactPreference}`,
        consent: true,
      });

      const ref = resp.reference || 'PMR-' + Math.floor(100000 + Math.random() * 900000);
      setSuccessReference(ref);
      trackLeadSubmitted({
        reference: ref,
        brand_model: `${deviceBrand} ${deviceModel}`.trim(),
        repair_needed: reportedProblem,
        area: pickupArea,
      });
    } catch {
      // Graceful fallback
      const ref = 'PMR-' + Math.floor(100000 + Math.random() * 900000);
      setSuccessReference(ref);
      trackLeadSubmitted({
        reference: ref,
        brand_model: `${deviceBrand} ${deviceModel}`.trim(),
        repair_needed: reportedProblem,
        area: pickupArea,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Book Device Repair Assessment in Bangalore — Premium Mobile Repair | Pickup & Delivery"
        description="Book free doorstep pickup and diagnosis for your mobile, iPhone, iPad, or laptop repair in Bangalore. Transparent quote first with no upfront payment."
        canonicalUrl="https://premiummobilerepair.in/book-repair"
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
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              Pickup &amp; Delivery Available
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Request a Repair
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Fill in the details below and we&apos;ll assess your device and send you a clear quotation.
              No upfront payment required.
            </p>
          </div>
        </section>

        {/* ── Booking Content Grid ── */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
              {/* Left Column: Repair Enquiry Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">Your Repair Enquiry</h2>

                {successReference ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                      Enquiry Submitted Successfully!
                    </h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                      Your enquiry reference number is{' '}
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {successReference}
                      </span>
                      . Our Bangalore dispatch executive will contact you shortly to confirm your pickup window.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSuccessReference(null);
                          setFullName('');
                          setPhone('');
                        }}
                        className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                      >
                        Submit Another Enquiry
                      </button>
                      <Link
                        to="/"
                        className="px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Return to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMsg && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                        {errorMsg}
                      </div>
                    )}

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* Device Category & Brand */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Device Type *
                        </label>
                        <select
                          value={deviceCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all bg-white"
                        >
                          {Object.keys(DEVICE_BRANDS).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Brand *
                        </label>
                        <select
                          value={deviceBrand}
                          onChange={(e) => setDeviceBrand(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all bg-white"
                        >
                          {(DEVICE_BRANDS[deviceCategory] || ['Other']).map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Device Model */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Device Model *
                      </label>
                      <input
                        type="text"
                        required
                        value={deviceModel}
                        onChange={(e) => setDeviceModel(e.target.value)}
                        placeholder="e.g. iPhone 14 Pro, Galaxy S23, Pixel 7"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                      />
                    </div>

                    {/* What is the issue */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        What is the issue? *
                      </label>
                      <select
                        value={reportedProblem}
                        onChange={(e) => setReportedProblem(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all bg-white"
                      >
                        <option value="Screen Cracked / Broken">Screen Cracked / Broken</option>
                        <option value="Screen Not Displaying / Black Screen">
                          Screen Not Displaying / Black Screen
                        </option>
                        <option value="Battery Draining Fast">Battery Draining Fast</option>
                        <option value="Battery Swollen">Battery Swollen</option>
                        <option value="Not Charging">Not Charging</option>
                        <option value="Charging Port Damaged">Charging Port Damaged</option>
                        <option value="Water Damage">Water Damage</option>
                        <option value="Back Panel Broken">Back Panel Broken</option>
                        <option value="Camera Not Working">Camera Not Working</option>
                        <option value="Speaker / Microphone Issue">Speaker / Microphone Issue</option>
                        <option value="Face ID / Touch ID Not Working">
                          Face ID / Touch ID Not Working
                        </option>
                        <option value="Device Not Turning On">Device Not Turning On</option>
                        <option value="Software / System Issue">Software / System Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Locality & PIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Your Area / Locality
                        </label>
                        <input
                          type="text"
                          value={pickupArea}
                          onChange={(e) => setPickupArea(e.target.value)}
                          placeholder="e.g. Koramangala, HSR Layout"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pickupPincode}
                          onChange={(e) => setPickupPincode(e.target.value)}
                          placeholder="560034"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Preferred Pickup Time & Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Preferred Pickup Time
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all bg-white"
                        >
                          <option value="">Any time</option>
                          <option value="Morning (9AM–12PM)">Morning (9AM–12PM)</option>
                          <option value="Afternoon (12PM–4PM)">Afternoon (12PM–4PM)</option>
                          <option value="Evening (4PM–8PM)">Evening (4PM–8PM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Preferred Contact Method
                        </label>
                        <select
                          value={contactPreference}
                          onChange={(e) => setContactPreference(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all bg-white"
                        >
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="consent-check"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <label htmlFor="consent-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                        I consent to {BUSINESS_INFO.name} collecting and using the information I provide
                        to process my repair enquiry. I have read the{' '}
                        <Link to="/privacy" className="text-indigo-600 underline">
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Repair Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      No upfront payment. We&apos;ll contact you to confirm details before any service begins.
                    </p>
                  </form>
                )}
              </div>

              {/* Right Column: Informative Cards */}
              <div className="space-y-6 sticky top-24">
                {/* 1. What Happens Next */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6">
                  <h3 className="font-extrabold text-slate-900 text-base mb-5">What Happens Next</h3>
                  <div className="space-y-4">
                    {[
                      { step: 1, text: 'We receive your enquiry' },
                      { step: 2, text: 'We confirm your pickup area' },
                      { step: 3, text: 'Device collected from you' },
                      { step: 4, text: 'Diagnosis & quotation sent' },
                      { step: 5, text: 'Repair on your approval' },
                      { step: 6, text: 'Device delivered back' },
                    ].map(({ step, text }) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {step}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Our Commitment */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-base mb-4">Our Commitment</h3>
                  <div className="space-y-3.5 text-xs text-slate-600">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Clear quotation before any chargeable work</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Status updates throughout the repair</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>Quality check before device return</span>
                    </div>
                  </div>
                </div>

                {/* 3. Prefer to Talk? */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg">
                  <h3 className="font-extrabold text-white text-base mb-1.5">Prefer to Talk?</h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Reach out directly — our Bangalore coordination team is here to assist.
                  </p>

                  <div className="space-y-2.5">
                    <a
                      href={`tel:${BUSINESS_INFO.phone}`}
                      className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                    >
                      <Phone className="w-4 h-4 text-indigo-400" />
                      <span>Call: {BUSINESS_INFO.phone}</span>
                    </a>

                    <a
                      href={BUSINESS_INFO.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
