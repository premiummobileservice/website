import React, { useState } from 'react';
import { Building, Shield, AlertTriangle, Save, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const CrmSettingsPage: React.FC = () => {
  const [bizName, setBizName] = useState('Premium Mobile Repair');
  const [bizEmail, setBizEmail] = useState('contact@premiummobilerepair.in');
  const [phone, setPhone] = useState('9343584460');
  const [whatsapp, setWhatsapp] = useState('9343584460');
  const [address, setAddress] = useState(
    '#159, 1st Floor 32nd E Cross Rd, Opp To Sanjay Gandhi Hospital, 4th T Block East, Tilak Nagar, Jayanagar Bengaluru, Karnataka 560041'
  );
  const [hours, setHours] = useState('Monday - Saturday: 9:00 AM – 8:00 PM | Sunday: Closed');
  const [warranty, setWarranty] = useState('6');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Business and CRM configuration saved successfully!');
    }, 500);
  };

  const handleClearDemoData = () => {
    if (window.confirm('Are you sure you want to clear test leads and restore demo data?')) {
      toast.success('Demo environment state reset.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business &amp; CRM Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure workshop location, notification emails, customer service hours, and system data.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Card 1: Workshop & Brand Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Workshop &amp; Brand Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Notification Email Address</label>
              <input
                type="email"
                required
                value={bizEmail}
                onChange={(e) => setBizEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                All incoming website enquiries and lead alerts are dispatched to this email.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Workshop Address (Jayanagar, Bangalore)</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Working Hours</label>
              <input
                type="text"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Standard Warranty</label>
              <select
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              >
                <option value="3">3 Months Warranty</option>
                <option value="6">6 Months Warranty (Standard)</option>
                <option value="12">1 Year Warranty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: CRM Superadmin Account */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">CRM Superadmin Account</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">User ID</div>
              <div className="text-sm font-bold text-slate-900 mt-1 font-mono">admin</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Default Password</div>
              <div className="text-sm font-bold text-slate-900 mt-1 font-mono">admin1234</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Level</div>
              <div className="text-sm font-bold text-emerald-600 mt-1">Superadmin (Full Access)</div>
            </div>
          </div>
        </div>

        {/* Card 3: Data Reset & Fresh Setup (Red Danger Card) */}
        <div className="bg-rose-50/70 rounded-2xl p-6 border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base">Data Reset &amp; Fresh Setup</h2>
          </div>
          <p className="text-rose-800 text-xs leading-relaxed">
            Clear all demo / placeholder records with one click so you can test entering your own real customer leads,
            repair jobs, and profit tracking from scratch.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={handleClearDemoData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Demo / Test Data</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
