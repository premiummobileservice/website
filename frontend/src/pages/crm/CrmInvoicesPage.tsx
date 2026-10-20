import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Calendar,
  RefreshCw,
  Plus,
  Printer,
  Download,
  DollarSign,
  CheckCircle2,
  Clock,
  Smartphone,
  User,
  X,
  CreditCard,
} from 'lucide-react';
import { apiGet, apiPatch } from '../../services/api';
import { Job } from '../../types';
import toast from 'react-hot-toast';

export const CrmInvoicesPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedInvoiceJob, setSelectedInvoiceJob] = useState<Job | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Job[]>('/jobs/');
      setJobs(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load invoice records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Jobs that have a price or are completed/delivered
  const invoicedJobs = jobs.filter(
    (j) => (j.final_quote && j.final_quote > 0) || j.status === 'delivered_collected'
  );

  const totalPaidRevenue = invoicedJobs.reduce((sum, j) => {
    if (j.status === 'delivered_collected') {
      return sum + (j.final_quote || j.estimated_quote || 0);
    }
    return sum;
  }, 0);

  const pendingBalance = invoicedJobs.reduce((sum, j) => {
    if (j.status !== 'delivered_collected') {
      return sum + (j.final_quote || j.estimated_quote || 0);
    }
    return sum;
  }, 0);

  const eligibleJobsCount = jobs.filter(
    (j) => j.status === 'repaired' || j.status === 'delivered_collected'
  ).length;

  const filteredJobs = invoicedJobs.filter((j) => {
    const q = search.toLowerCase();
    const invNum = `INV-${j.job_number?.replace('RO-', '') || j.id}`;
    const matchesSearch =
      invNum.toLowerCase().includes(q) ||
      j.job_number?.toLowerCase().includes(q) ||
      j.lead_details?.full_name?.toLowerCase().includes(q) ||
      j.lead_details?.phone?.toLowerCase().includes(q) ||
      j.lead_details?.device_model?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (paymentFilter === 'paid' && j.status !== 'delivered_collected') return false;
    if (paymentFilter === 'pending' && j.status === 'delivered_collected') return false;

    if (dateFilter && !j.created_at.startsWith(dateFilter)) return false;

    return true;
  });

  const handleMarkPaid = async (job: Job) => {
    try {
      await apiPatch(`/jobs/${job.id}/`, {
        status: 'delivered_collected',
        work_notes: `${job.work_notes || ''}\nPayment cleared on ${new Date().toLocaleString()}`,
      });
      toast.success(`Payment marked as collected for ${job.job_number}!`);
      fetchInvoices();
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-600" />
            Customer Invoices & Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official customer-facing tax invoices generated from completed database service bookings. Downloadable PDF & print ready.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Generated Invoices
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {invoicedJobs.length}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Stored in SQLite DB</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Paid Revenue Collected
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            ₹{totalPaidRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">All cleared transactions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            Pending Invoice Balance
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-1">
            ₹{pendingBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Awaiting collection</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
            Eligible Completed Jobs
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">
            {eligibleJobsCount}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5">Ready for invoice delivery</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoices by invoice number, order ID, lead ID, customer, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none text-slate-800"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-slate-400 hover:text-slate-600 text-[10px] ml-1"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setDateFilter(todayStr)}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice # / Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Job & Lead ID</th>
                <th className="py-3 px-4">Device & Work Done</th>
                <th className="py-3 px-4">Final Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">PDF & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading database invoices...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No generated invoices matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const isPaid = job.status === 'delivered_collected';
                  const amount = job.final_quote || job.estimated_quote || 0;
                  const invNumber = `INV-${job.job_number ? job.job_number.replace('RO-', '') : job.id.toString().padStart(6, '0')}`;

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">
                          {invNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {job.lead_details?.full_name || 'Customer'}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {job.lead_details?.phone}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-indigo-600 block">
                          {job.job_number}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {job.lead_details?.lead_number}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-800">
                          {job.lead_details?.device_brand} {job.lead_details?.device_model}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5">
                          {job.work_notes || job.lead_details?.problem_description || 'Device Repair'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-sm text-slate-900">
                          ₹{amount.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-slate-400">Incl. 18% GST</div>
                      </td>

                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5">
                        {!isPaid && (
                          <button
                            onClick={() => handleMarkPaid(job)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoiceJob(job)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-colors cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Printable View Modal */}
      {selectedInvoiceJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceJob(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Area */}
            <div id="printable-invoice" className="space-y-6">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    Premium Mobile Repair
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Doorstep Device Diagnostics & Lab Services • Bangalore, Karnataka
                  </p>
                  <p className="text-xs text-slate-600">
                    #159, 1st Floor 32nd E Cross Rd, Tilak Nagar, Jayanagar, Bengaluru 560041
                  </p>
                  <p className="text-xs text-slate-600">Phone: +91 99860 97786 • premiummobileservice3@gmail.com</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">GSTIN: 29AAAAA0000A1Z5</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black uppercase px-3 py-1 bg-slate-900 text-white rounded">
                    TAX INVOICE
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                    INV-{selectedInvoiceJob.job_number?.replace('RO-', '')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Date: {new Date(selectedInvoiceJob.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer & Job Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Billed To:
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedInvoiceJob.lead_details?.full_name}
                  </div>
                  <div className="text-slate-600 mt-0.5 font-mono">
                    Phone: {selectedInvoiceJob.lead_details?.phone}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Address: {selectedInvoiceJob.lead_details?.address || 'Bangalore, Karnataka'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Device Service Dossier:
                  </span>
                  <div className="font-bold text-slate-800">
                    {selectedInvoiceJob.lead_details?.device_brand}{' '}
                    {selectedInvoiceJob.lead_details?.device_model}
                  </div>
                  <div className="text-slate-600 font-mono mt-0.5">
                    Job Ref: {selectedInvoiceJob.job_number}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Lead Ref: {selectedInvoiceJob.lead_details?.lead_number}
                  </div>
                </div>
              </div>

              {/* Invoice Line Items */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Item & Repair Description</th>
                      <th className="py-2.5 px-4 text-center">HSN/SAC</th>
                      <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {selectedInvoiceJob.lead_details?.problem_description || 'Device Repair & Diagnostic Assembly'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Professional technician labor, diagnostics, calibration, dust sealing
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">998713</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹
                        {(
                          (selectedInvoiceJob.final_quote ||
                            selectedInvoiceJob.estimated_quote ||
                            0) / 1.18
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Calculations */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1.5 font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Value:</span>
                    <span className="font-mono">
                      ₹
                      {(
                        (selectedInvoiceJob.final_quote ||
                          selectedInvoiceJob.estimated_quote ||
                          0) / 1.18
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span className="font-mono">
                      ₹
                      {(
                        ((selectedInvoiceJob.final_quote ||
                          selectedInvoiceJob.estimated_quote ||
                          0) /
                          1.18) *
                        0.09
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span className="font-mono">
                      ₹
                      {(
                        ((selectedInvoiceJob.final_quote ||
                          selectedInvoiceJob.estimated_quote ||
                          0) /
                          1.18) *
                        0.09
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>Total Net Amount:</span>
                    <span className="font-mono text-base text-indigo-600">
                      ₹
                      {(
                        selectedInvoiceJob.final_quote ||
                        selectedInvoiceJob.estimated_quote ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 flex justify-between items-center">
                <p>This is a computer-generated tax invoice valid under Karnataka GST regulations.</p>
                <p className="font-semibold text-slate-600">Thank you for choosing Premium Mobile Repair!</p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedInvoiceJob(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
