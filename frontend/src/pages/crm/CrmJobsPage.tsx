import React, { useState, useEffect } from 'react';
import { crmApi } from '../../api/crmApi';
import { RepairJob, JobStatus, QuotationItem } from '../../types';
import {
  Wrench,
  Search,
  Printer,
  Plus,
  Trash2,
  X,
  Phone,
  ArrowRight,
} from 'lucide-react';

const JOB_STATUSES: { id: JobStatus; label: string; color: string }[] = [
  { id: 'pending_pickup', label: '1. Pending Pickup', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'received_at_hub', label: '2. Received at Hub', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'under_diagnosis', label: '3. Under Diagnosis', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'quote_pending_approval', label: '4. Quote Pending Approval', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'approved_in_progress', label: '5. Approved & In Progress', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { id: 'waiting_for_parts', label: '6. Waiting for Parts', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'qc_testing', label: '7. QC & Bench Testing', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'out_for_delivery', label: '8. Out for Delivery', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'delivered_collected', label: '9. Delivered & Paid', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
];

export const CrmJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);

  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    { description: 'Screen Assembly Replacement (Original Grade)', part_cost: 3200, labour_cost: 600, total: 3800 },
  ]);
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [showPrintQuote, setShowPrintQuote] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await crmApi.getJobs({ search: searchQuery || undefined });
      if (res && res.results && res.results.length > 0) {
        setJobs(res.results);
      } else {
        setJobs([
          {
            id: 101,
            job_number: 'JOB-2025-001',
            lead: 1,
            customer_name: 'Aditya Rao',
            customer_phone: '9880011223',
            device_type: 'smartphone',
            brand_model: 'iPhone 13 Pro',
            repair_needed: 'Screen Replacement',
            status: 'under_diagnosis',
            technician_name: 'Rajesh K.',
            diagnostic_notes: 'Digitizer cracked on top right corner. TrueTone EEPROM read successful.',
            quotation_amount: 4500,
            is_quote_approved: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pickup_address: 'Koramangala 4th Block, Bangalore',
          },
          {
            id: 102,
            job_number: 'JOB-2025-002',
            lead: 2,
            customer_name: 'Pooja Hegde',
            customer_phone: '9845022334',
            device_type: 'smartphone',
            brand_model: 'Samsung Galaxy S22 Ultra',
            repair_needed: 'Battery Replacement',
            status: 'approved_in_progress',
            technician_name: 'Vinay M.',
            diagnostic_notes: 'Battery health degraded at 71%. 5000mAh OEM pack installed.',
            quotation_amount: 2800,
            is_quote_approved: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pickup_address: 'Indiranagar 100 Feet Road, Bangalore',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery]);

  const handleOpenJob = (job: RepairJob) => {
    setSelectedJob(job);
    setDiagnosticNotes(job.diagnostic_notes || '');
    if (job.quotation_items && job.quotation_items.length > 0) {
      setQuoteItems(job.quotation_items);
    } else {
      setQuoteItems([
        { description: `${job.repair_needed} Hardware Part`, part_cost: 2500, labour_cost: 500, total: 3000 },
      ]);
    }
  };

  const handleAddQuoteItem = () => {
    setQuoteItems([
      ...quoteItems,
      { description: 'Hardware Replacement Part', part_cost: 1000, labour_cost: 400, total: 1400 },
    ]);
  };

  const handleRemoveQuoteItem = (idx: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = (idx: number, field: keyof QuotationItem, val: any) => {
    const next = [...quoteItems];
    next[idx] = { ...next[idx], [field]: val };
    if (field === 'part_cost' || field === 'labour_cost') {
      const part = Number(next[idx].part_cost) || 0;
      const labour = Number(next[idx].labour_cost) || 0;
      next[idx].total = part + labour;
    }
    setQuoteItems(next);
  };

  const quoteSubtotal = quoteItems.reduce((acc, it) => acc + (it.total || 0), 0);
  const gstAmount = Math.round(quoteSubtotal * 0.18);
  const grandTotal = quoteSubtotal + gstAmount;

  const handleUpdateJobStatus = async (status: JobStatus) => {
    if (!selectedJob) return;
    try {
      await crmApi.updateJobStatus(selectedJob.id, status);
      setSelectedJob({ ...selectedJob, status });
      setJobs((prev) => prev.map((j) => (j.id === selectedJob.id ? { ...j, status } : j)));
    } catch {
      setSelectedJob({ ...selectedJob, status });
      setJobs((prev) => prev.map((j) => (j.id === selectedJob.id ? { ...j, status } : j)));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workshop Bookings & Repairs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bangalore laboratory diagnostics, quotation generation, and technician repair work orders
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bookings, customers, models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-bold">Job #</th>
                <th className="px-5 py-3.5 font-bold">Customer</th>
                <th className="px-5 py-3.5 font-bold">Device & Problem</th>
                <th className="px-5 py-3.5 font-bold">Assigned Tech</th>
                <th className="px-5 py-3.5 font-bold">Quotation</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => {
                const statusMeta = JOB_STATUSES.find((s) => s.id === job.status) || JOB_STATUSES[0];
                return (
                  <tr
                    key={job.id}
                    onClick={() => handleOpenJob(job)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">
                      {job.job_number}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{job.customer_name}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{job.customer_phone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{job.brand_model}</div>
                      <div className="text-slate-500 text-[11px]">{job.repair_needed}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {job.technician_name || 'Unassigned'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900">
                        ₹{job.quotation_amount?.toLocaleString() || 'Pending'}
                      </span>
                      {job.is_quote_approved && (
                        <span className="ml-1.5 text-[10px] text-emerald-600 font-bold">Approved</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.color}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-bold">
                        Edit & Quote →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Detail & Quotation Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  {selectedJob.job_number}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {selectedJob.customer_name} • {selectedJob.brand_model}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintQuote(true)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Print Quotation PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Workflow Progression Stepper */}
            <div className="py-4 border-b border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Update Repair Status
              </label>
              <select
                value={selectedJob.status}
                onChange={(e) => handleUpdateJobStatus(e.target.value as JobStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-indigo-700 font-bold focus:outline-none focus:border-indigo-500"
              >
                {JOB_STATUSES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnostics Notes */}
            <div className="py-4 border-b border-slate-100 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Technician Diagnostic Notes & Test Results
              </label>
              <textarea
                rows={2}
                value={diagnosticNotes}
                onChange={(e) => setDiagnosticNotes(e.target.value)}
                placeholder="Log internal hardware diagnosis..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-medium"
              />
            </div>

            {/* Itemized Quotation Builder */}
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Itemized Quotation Breakdown</h3>
                  <p className="text-[11px] text-slate-500">Parts cost, labour, and GST</p>
                </div>
                <button
                  onClick={handleAddQuoteItem}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs text-indigo-700 font-bold inline-flex items-center gap-1 cursor-pointer border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              <div className="space-y-2.5">
                {quoteItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-indigo-500"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-[10px]">Part ₹</span>
                        <input
                          type="number"
                          value={item.part_cost}
                          onChange={(e) => handleUpdateItem(idx, 'part_cost', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-[10px]">Labour ₹</span>
                        <input
                          type="number"
                          value={item.labour_cost}
                          onChange={(e) => handleUpdateItem(idx, 'labour_cost', Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      {quoteItems.length > 1 && (
                        <button
                          onClick={() => handleRemoveQuoteItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quotation Summary Totals */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Parts & Labour</span>
                  <span className="text-slate-900 font-mono font-bold">₹{quoteSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="text-slate-900 font-mono font-bold">₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total (Payable on Delivery)</span>
                  <span className="text-indigo-600 font-mono">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedJob({ ...selectedJob, is_quote_approved: !selectedJob.is_quote_approved });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedJob.is_quote_approved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedJob.is_quote_approved ? '✓ Quotation Approved by Customer' : 'Mark Customer Approved'}
              </button>

              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Quotation View */}
      {showPrintQuote && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl p-8 my-8 print:p-0">
            <button
              onClick={() => setShowPrintQuote(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Premium Mobile Repair
                </h1>
                <p className="text-xs text-slate-600">
                  Doorstep Device Diagnostics & Lab Services • Bangalore, Karnataka
                </p>
                <p className="text-xs text-slate-600">Phone: +91 99860 97786 • premiummobileservice3@gmail.com</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 bg-slate-100 rounded text-slate-800">
                  QUOTATION
                </span>
                <p className="text-xs font-mono text-slate-600 mt-2">
                  Ref: {selectedJob.job_number}
                </p>
                <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs border border-slate-200 p-4 rounded-xl bg-slate-50">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">CUSTOMER:</span>
                <div className="font-semibold text-slate-900">{selectedJob.customer_name}</div>
                <div className="text-slate-600">{selectedJob.customer_phone}</div>
                <div className="text-slate-600">{selectedJob.pickup_address}</div>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">DEVICE DETAILS:</span>
                <div className="font-semibold text-slate-900">{selectedJob.brand_model}</div>
                <div className="text-slate-600">Issue: {selectedJob.repair_needed}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs mb-6">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-2 font-bold">Item Description</th>
                  <th className="py-2 text-right font-bold">Parts</th>
                  <th className="py-2 text-right font-bold">Labour</th>
                  <th className="py-2 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quoteItems.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium">{it.description}</td>
                    <td className="py-2 text-right">₹{it.part_cost}</td>
                    <td className="py-2 text-right">₹{it.labour_cost}</td>
                    <td className="py-2 text-right font-bold">₹{it.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t-2 border-slate-900 pt-3 flex flex-col items-end text-xs space-y-1">
              <div className="flex justify-between w-48 text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">₹{quoteSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-48 text-slate-600">
                <span>GST (18%):</span>
                <span className="font-bold text-slate-900">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-48 text-sm font-bold text-slate-900 pt-1 border-t border-slate-300">
                <span>Grand Total:</span>
                <span className="text-indigo-600 font-extrabold">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
              <p>• Diagnosis before repair: Work only begins following customer verbal/written approval.</p>
              <p>• Payment terms: Payable on satisfactory return delivery to your Bangalore doorstep.</p>
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
