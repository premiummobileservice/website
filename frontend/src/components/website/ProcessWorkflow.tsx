import React from 'react';
import { WORKFLOW_STEPS } from '../../data/businessData';
import {
  FileEdit,
  PhoneCall,
  PackageCheck,
  SearchCheck,
  Wrench,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  FileEdit: <FileEdit className="w-5 h-5 text-indigo-600" />,
  PhoneCall: <PhoneCall className="w-5 h-5 text-indigo-600" />,
  PackageCheck: <PackageCheck className="w-5 h-5 text-indigo-600" />,
  SearchCheck: <SearchCheck className="w-5 h-5 text-indigo-600" />,
  Wrench: <Wrench className="w-5 h-5 text-indigo-600" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
};

interface ProcessWorkflowProps {
  onOpenBookingModal?: () => void;
}

export const ProcessWorkflow: React.FC<ProcessWorkflowProps> = ({ onOpenBookingModal }) => {
  return (
    <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            Simple & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our 6-Step Repair & Delivery Workflow
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Every device in Bangalore is handled through our structured verification chain. No repair proceeds without your explicit approval.
          </p>
        </div>

        {/* 6 Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    {iconMap[step.icon]}
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    0{step.step}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-indigo-600 font-bold">
                <span>Step {step.step} of 6</span>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Callout */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700">
              <strong className="text-amber-900 font-bold block mb-0.5">
                Our Customer Approval & Diagnostic Guarantee:
              </strong>
              No repair is ever carried out without your prior quotation confirmation. If you choose not to proceed after diagnosis, a standard diagnostic inspection charge may apply, and your device will be safely returned.
            </div>
          </div>

          <button
            onClick={onOpenBookingModal}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
          >
            Book Free Pickup
          </button>
        </div>
      </div>
    </section>
  );
};
