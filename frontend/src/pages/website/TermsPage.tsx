import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../data/businessData';

export const TermsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service & Diagnostic Policy | Premium Mobile Repair"
        description="Terms of service, diagnosis approval policy, payment terms, and pickup guidelines for Premium Mobile Repair in Bangalore."
        canonicalUrl="https://premiummobilerepair.in/terms"
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Terms of Service &amp; Diagnostic Policy
            </h1>
            <p className="text-xs text-slate-400 pb-4 border-b border-slate-100">
              Operating Guidelines • {BUSINESS_INFO.name}, Bangalore, India
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">1. Pickup &amp; Chain of Custody</h2>
            <p>
              When a device is handed over to our verified Bangalore logistics executive, a physical or electronic acknowledgment receipt will be issued. It is the customer&apos;s responsibility to verify the outward condition documented at collection.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">2. Diagnosis &amp; Customer Approval Policy</h2>
            <p>
              No repair work will be initiated without explicit quotation approval from the customer. Following intake inspection at our Bangalore lab, our coordinator communicates the itemized quotation.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">3. Declined Quotation Policy</h2>
            <p>
              In the event that the customer chooses not to proceed with repair following technical inspection, a nominal diagnostic inspection fee may apply to cover lab testing procedures and logistics handling. The device will be scheduled for safe return to the designated Bangalore address.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">4. Payment Terms</h2>
            <p>
              Payment is collected at the customer&apos;s doorstep upon return delivery of the repaired device, only after the customer has tested and confirmed satisfactory completion. Accepted payment modes include UPI, credit/debit cards, and cash.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">5. Unclaimed Devices</h2>
            <p>
              Devices left unclaimed or where customer communication has lapsed beyond 45 days despite repeated attempts may be subject to safe disposal or scrap handling according to local regulations.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
