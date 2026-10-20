import React, { useState } from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import {
  Clock,
  ArrowRight,
  FileText,
  Phone,
  Package,
  Wrench,
  CheckCircle2,
  Star,
  Truck,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

interface HowItWorksPageProps {
  onOpenBookingModal: () => void;
}

interface StepItem {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  checks: string[];
  hasCta?: boolean;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenBookingModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps: StepItem[] = [
    {
      number: 1,
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      title: 'Submit a Repair Enquiry',
      description:
        "Start by filling in our repair request form with your device details and the issue you're facing. No upfront payment required at this stage.",
      checks: [
        'Quick online form — takes under 2 minutes',
        'Tell us your device type, brand, model, and issue',
        'Share your preferred pickup area and time',
        "You'll receive a reference number immediately",
      ],
      hasCta: true,
    },
    {
      number: 2,
      icon: <Phone className="w-5 h-5 text-indigo-600" />,
      title: 'We Contact You & Confirm Coverage',
      description:
        'Our team reviews your enquiry and contacts you to confirm the details and verify that pickup and delivery is available for your area.',
      checks: [
        'We call or message you within a few hours',
        'We confirm your Bangalore area is serviceable',
        'We clarify any questions about your device',
        'We schedule a convenient pickup time',
      ],
    },
    {
      number: 3,
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      title: 'Device Collected from You',
      description:
        'Our pickup executive arrives at your location at the scheduled time. Your device is collected safely and taken to our repair centre.',
      checks: [
        'Our executive arrives at the agreed time',
        'A handover record is created',
        'Your device is transported securely',
        "You're notified when the device is received",
      ],
    },
    {
      number: 4,
      icon: <Wrench className="w-5 h-5 text-indigo-600" />,
      title: 'Diagnosis & Quotation',
      description:
        'Our technicians inspect your device thoroughly, diagnose the issue, and prepare a detailed quotation. We send this to you before any repair work begins.',
      checks: [
        'Trained technician inspects your device',
        'Full diagnosis of the issue',
        'Quotation with parts and work required',
        'No chargeable repair begins without your approval',
      ],
    },
    {
      number: 5,
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" />,
      title: 'You Approve (or Decline)',
      description:
        'Once you receive the quotation, you decide whether to proceed. Approval is required before any chargeable work begins. You can decline without a repair charge.',
      checks: [
        'Review your quotation in full',
        'Approve the repair to proceed',
        'Decline if you prefer not to proceed',
        'Revised quotation if scope changes',
      ],
    },
    {
      number: 6,
      icon: <Star className="w-5 h-5 text-indigo-600" />,
      title: 'Repair & Quality Check',
      description:
        'Your approved repair is carried out by our technicians. Before your device is returned, it goes through quality checks to confirm the repair is complete.',
      checks: [
        'Repair carried out by trained technicians',
        'Quality check before dispatch',
        'Failed QC triggers a rework — not returned until passing',
        "You're notified when ready for delivery",
      ],
    },
    {
      number: 7,
      icon: <Truck className="w-5 h-5 text-indigo-600" />,
      title: 'Device Delivered Back to You',
      description:
        'Your repaired device is delivered back to your location. Payment is collected at this stage according to the agreed terms.',
      checks: [
        'Delivery to your location',
        'Payment collected on delivery',
        'Multiple payment methods accepted',
        'We request your feedback after completion',
      ],
    },
  ];

  const faqs = [
    {
      question: 'Do I need to pay anything upfront?',
      answer:
        'No. There is no upfront payment. You only pay after your repair is completed and your device is returned to you — and only if you approved the quotation.',
    },
    {
      question: "What if I don't want to proceed after seeing the quotation?",
      answer:
        'You can decline. If you decline without any chargeable work having been done, the device will be returned to you. Any diagnostic charge, if applicable, will be communicated before work begins.',
    },
    {
      question: 'How long does the full process take?',
      answer:
        'It depends on the repair type, parts availability, and how quickly you respond to the quotation. Many repairs are completed within 1–3 working days after the device is received. We keep you updated throughout.',
    },
    {
      question: 'Can I track my repair status?',
      answer:
        'Yes. Once your lead is in our system, our team will keep you updated at key stages. You can also use your reference number to enquire about your repair status.',
    },
    {
      question: 'What happens if the repair fails quality checks?',
      answer:
        "If a repair does not pass our quality check, we rework it before returning the device. We do not return a device that hasn't passed quality checks.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-800">
      <SEOHead
        title="How Device Repair Works — Pickup, Diagnosis & Delivery | Premium Mobile Repair Bangalore"
        description="Learn how Premium Mobile Repair's doorstep process works in Bangalore. Submit an enquiry, get a diagnosis and quotation, approve the repair, and receive your device via pickup and delivery."
        canonicalUrl="https://premiummobilerepair.in/how-it-works"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f5f3ff] to-[#ffffff] pt-32 pb-16 px-4 text-center border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>The Process</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            How It Works
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            A transparent, step-by-step repair journey — from your initial enquiry to receiving your repaired device.
          </p>

          <button
            onClick={onOpenBookingModal}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <span>Start a Repair Enquiry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7-Step Vertical Process Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Connecting Vertical Line */}
            <div className="absolute left-6 sm:left-7 top-10 bottom-10 w-0.5 bg-gradient-to-b from-purple-600 to-indigo-600 opacity-25" />

            {/* Steps Container */}
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="relative flex items-start gap-4 sm:gap-6">
                  {/* Step Number Circle */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30 z-10">
                    {step.number}
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        {step.icon}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        {step.title}
                      </h2>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {step.description}
                    </p>

                    {/* Check items in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {step.checks.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>

                    {step.hasCta && (
                      <div className="mt-5 pt-3 border-t border-slate-100">
                        <button
                          onClick={onOpenBookingModal}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                        >
                          <span>Request a Repair</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions / Process FAQs Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Process FAQs
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Submit your repair enquiry — no upfront payment, no surprises, just a clear quotation.
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenBookingModal}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-sm shadow-xl shadow-black/10 transition-all cursor-pointer"
            >
              <span>Request a Repair</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
