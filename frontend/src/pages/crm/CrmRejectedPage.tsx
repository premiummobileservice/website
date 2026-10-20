import React, { useState, useEffect } from 'react';
import {
  XCircle,
  Search,
  Calendar,
  RefreshCw,
  RotateCcw,
  User,
  Smartphone,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { apiGet, apiPatch } from '../../services/api';
import { Lead } from '../../types';
import toast from 'react-hot-toast';

export const CrmRejectedPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const fetchRejected = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Lead[]>('/leads/');
      // Filter leads that are declined or wrong number
      const inactive = data.filter(
        (l) => l.status === 'declined' || l.status === 'wrong_number'
      );
      setLeads(inactive);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inactive leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const notInterestedCount = leads.filter((l) => l.status === 'declined').length;
  const wrongNumberCount = leads.filter((l) => l.status === 'wrong_number').length;

  const handleReopen = async (lead: Lead) => {
    try {
      await apiPatch(`/leads/${lead.id}/`, {
        status: 'new',
        internal_notes: `Reopened lead from Rejected desk on ${new Date().toLocaleString()}`,
      });
      toast.success(`Lead ${lead.lead_number} reopened and moved to New Enquiries!`);
      fetchRejected();
    } catch {
      toast.error('Failed to reopen lead');
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.lead_number?.toLowerCase().includes(q) ||
      l.full_name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.device_model?.toLowerCase().includes(q) ||
      l.internal_notes?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (reasonFilter !== 'all') {
      if (reasonFilter === 'Wrong Number' && l.status !== 'wrong_number') return false;
      if (
        reasonFilter !== 'Wrong Number' &&
        !l.internal_notes?.toLowerCase().includes(reasonFilter.toLowerCase())
      ) {
        return false;
      }
    }

    if (sourceFilter !== 'all' && l.source !== sourceFilter) {
      return false;
    }

    if (dateFilter && !l.created_at.startsWith(dateFilter)) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <XCircle className="w-7 h-7 text-rose-600" />
            Not Interested & Wrong Number Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Leads rejected by customers or verified as wrong numbers. Preserved in the database with reasons, searchable, and reopenable anytime.
          </p>
        </div>

        <button
          onClick={fetchRejected}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-indigo-500 shadow-sm">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Total Inactive Leads
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{leads.length}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
            All reasons stored in DB
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
            Not Interested
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
            {notInterestedCount}
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5">Customer declined repair</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Wrong Numbers
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
            {wrongNumberCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Distinctly labelled & tracked</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rejected leads by customer, phone, lead ID, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Rejection Reasons</option>
            <option value="Price too high">Price too high</option>
            <option value="Customer changed mind">Customer changed their mind</option>
            <option value="Service not required">Service not required</option>
            <option value="Chose another provider">Chose another service provider</option>
            <option value="Service unavailable">Service unavailable</option>
            <option value="Wrong Number">Wrong Number</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Sources</option>
            <option value="website">Website Form</option>
            <option value="google_ads">Google Ads</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="walk_in">Walk-in</option>
            <option value="phone">Phone Call</option>
            <option value="reference">Reference</option>
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Lead ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Device & Problem</th>
                <th className="py-3 px-4">Status & Reason</th>
                <th className="py-3 px-4">Staff Notes</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading rejected leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No inactive or rejected leads recorded matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-600">
                        {lead.lead_number}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{lead.full_name}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{lead.phone}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-800">
                        {lead.device_brand} {lead.device_model}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate mt-0.5">
                        {lead.problem_description || 'General inspection'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.status === 'wrong_number'
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {lead.status === 'wrong_number' ? 'Wrong Number' : 'Not Interested'}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-600 text-[11px] truncate italic">
                        {lead.internal_notes || 'Customer declined repair'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                        {lead.source?.replace('_', ' ') || 'Website'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReopen(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                        title="Reopen Lead & move back to New Enquiries"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reopen Lead</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
