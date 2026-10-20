import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../data/businessData';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Premium Mobile Repair Bangalore"
        description="Privacy policy and data protection practices for Premium Mobile Repair in Bangalore, India."
        canonicalUrl="https://premiummobilerepair.in/privacy"
      />

      <div className="bg-[#f8fafc] text-slate-800 min-h-screen pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Privacy Policy &amp; Device Data Protection
            </h1>
            <p className="text-xs text-slate-400 pb-4 border-b border-slate-100">
              Last updated: January 2025 • {BUSINESS_INFO.name}, Bangalore, India
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">1. Personal Information Collected</h2>
            <p>
              When you submit a repair enquiry on our website or over the phone, we collect your name, phone number, optional email address, Bangalore pickup address, and device model details. This information is strictly utilized to schedule logistics, perform hardware diagnosis, and provide itemized quotations.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">2. Device Data Security During Repair</h2>
            <p>
              We prioritize customer confidentiality. Our diagnostic technicians perform tests on electrical lines, battery health, and display matrices. We never inspect, copy, extract, or retain customer photos, messages, apps, or stored personal data. We strongly advise all customers to perform a complete cloud or offline backup prior to device collection.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">3. Data Sharing &amp; Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal contact details to third-party marketing brokers. Contact data is shared internally only with our verified dispatch executives and diagnostic technicians to facilitate your service request.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">4. Retention of Records</h2>
            <p>
              Job cards, diagnosis notes, and transaction references are retained in our internal CRM system for accounting and warranty verification records as required by Indian commercial regulations.
            </p>

            <h2 className="text-base font-bold text-slate-900 pt-2">5. Contact Information</h2>
            <p>
              For privacy enquiries or requests to delete contact information from our database, contact us at {BUSINESS_INFO.email} or call {BUSINESS_INFO.phone}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
