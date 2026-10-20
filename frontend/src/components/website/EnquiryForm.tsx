import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitPublicLead } from '../../api/publicApi';
import { trackLeadSubmitted } from '../../utils/analytics';
import { BANGALORE_AREAS, SERVICES } from '../../data/businessData';
import { CheckCircle2, ArrowRight, Loader2, ShieldCheck, MapPin, Smartphone, HelpCircle } from 'lucide-react';

const phoneRegex = /^[6-9]\d{9}$/;

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Enter a valid 10-digit Indian mobile number (starting with 6–9)'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  device_type: z.enum(['smartphone', 'tablet', 'laptop', 'other']),
  brand_model: z.string().min(2, 'Please enter brand and model (e.g. iPhone 13, OnePlus 11)'),
  repair_needed: z.string().min(2, 'Please select or describe the required service'),
  area: z.string().min(2, 'Please select your Bangalore area'),
  issue_description: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted for pickup scheduling',
  }),
  website_url: z.string().optional(), // Honeypot field
});

type LeadFormData = z.infer<typeof leadSchema>;

interface EnquiryFormProps {
  initialService?: string;
  initialArea?: string;
  onSuccessCallback?: (reference: string) => void;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService = '',
  initialArea = '',
  onSuccessCallback,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ reference: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      gclid: params.get('gclid') || '',
      landing_page: window.location.href,
      referrer: document.referrer || '',
    });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      device_type: 'smartphone',
      repair_needed: initialService || 'Screen Replacement',
      area: initialArea || '',
      consent: true,
      website_url: '',
    },
  });

  useEffect(() => {
    if (initialService) setValue('repair_needed', initialService);
    if (initialArea) setValue('area', initialArea);
  }, [initialService, initialArea, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        device_type: data.device_type,
        brand_model: data.brand_model,
        repair_needed: data.repair_needed,
        area: data.area,
        issue_description: data.issue_description || '',
        consent: data.consent,
        website_url: data.website_url,
        ...utmParams,
      };

      const res = await submitPublicLead(payload);
      setSuccessData(res);
      trackLeadSubmitted({
        reference: res.reference,
        brand_model: data.brand_model,
        repair_needed: data.repair_needed,
        area: data.area,
      });
      if (onSuccessCallback) {
        onSuccessCallback(res.reference);
      }
      reset();
    } catch (err: any) {
      if (err.response?.data?.phone) {
        setErrorMessage(err.response.data.phone[0]);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Unable to submit enquiry at this time. Please call or WhatsApp us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Pickup Enquiry Confirmed!</h3>
        <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-md mx-auto">
          {successData.message || 'Our Bangalore coordinator will call you to confirm your pickup slot and location.'}
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 inline-block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Enquiry Reference Code
          </span>
          <span className="text-2xl font-mono font-extrabold text-indigo-600 tracking-wider">
            {successData.reference}
          </span>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-100 pt-4">
          <p>Transparent 6-Step Workflow: Diagnosis & quotation provided after collection. No repair without your approval.</p>
        </div>

        <button
          onClick={() => setSuccessData(null)}
          className="mt-6 text-xs text-indigo-600 hover:text-indigo-800 font-bold underline-offset-4 hover:underline cursor-pointer"
        >
          Submit another device enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ${className}`}
      noValidate
    >
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
          <MapPin className="w-3.5 h-3.5" /> Free Pickup & Delivery across Bangalore
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Book Doorstep Pickup</h3>
        <p className="text-slate-500 text-xs mt-1">
          Diagnosis before quotation. Payment only on satisfactory completion.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <input type="text" {...register('website_url')} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-4">
        {/* Device Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Device Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'smartphone', label: 'Smartphone' },
              { id: 'tablet', label: 'Tablet / iPad' },
              { id: 'laptop', label: 'Laptop' },
              { id: 'other', label: 'Other Gadget' },
            ].map((type) => (
              <label
                key={type.id}
                className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 text-xs font-semibold text-slate-700 cursor-pointer transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700"
              >
                <input type="radio" value={type.id} {...register('device_type')} className="sr-only" />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand & Model */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Device Model & Brand *
          </label>
          <input
            type="text"
            placeholder="e.g. iPhone 14 Pro, Samsung Galaxy S23, Pixel 7"
            {...register('brand_model')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
          />
          {errors.brand_model && (
            <p className="text-rose-600 text-[11px] mt-1">{errors.brand_model.message}</p>
          )}
        </div>

        {/* Service & Bangalore Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue / Service Needed *
            </label>
            <select
              {...register('repair_needed')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            >
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="General Diagnosis / Multiple Issues">General Diagnosis / Multiple Issues</option>
            </select>
            {errors.repair_needed && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.repair_needed.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bangalore Area *
            </label>
            <select
              {...register('area')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            >
              <option value="">Select your area</option>
              {BANGALORE_AREAS.map((a) => (
                <option key={a.slug} value={a.name}>
                  {a.name} ({a.deliveryTurnaround})
                </option>
              ))}
              <option value="Other Area in Bangalore">Other Area in Bangalore (Confirm on Call)</option>
            </select>
            {errors.area && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.area.message}</p>
            )}
          </div>
        </div>

        {/* Customer Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register('name')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
            {errors.name && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number (10 digits) *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold">
                +91
              </span>
              <input
                type="tel"
                placeholder="9880012345"
                maxLength={10}
                {...register('phone')}
                className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
              />
            </div>
            {errors.phone && (
              <p className="text-rose-600 text-[11px] mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Optional Email & Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Address (Optional – for receiving quote PDF)
          </label>
          <input
            type="email"
            placeholder="rahul@example.com"
            {...register('email')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Preferred Pickup Address or Symptoms (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Screen flickering after minor drop, pickup available from Koramangala 4th Block"
            {...register('issue_description')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('consent')}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-500 leading-tight">
              I agree to be contacted via phone or WhatsApp regarding this doorstep pickup enquiry. I understand diagnostic charges may apply if quotation is declined.
            </span>
          </label>
          {errors.consent && (
            <p className="text-rose-600 text-[11px] mt-1">{errors.consent.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scheduling Doorstep Pickup...</span>
            </>
          ) : (
            <>
              <span>Schedule Free Doorstep Pickup</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Free Doorstep Collection
          </span>
          <span className="flex items-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Pay On Satisfaction
          </span>
        </div>
      </div>
    </form>
  );
};
