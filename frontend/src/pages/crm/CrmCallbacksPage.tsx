import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Search,
  Calendar,
  RefreshCw,
  Clock,
  User,
  Smartphone,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  MessageSquare,
} from 'lucide-react';
import { apiGet, apiPatch, apiPost } from '../../services/api';
import { Lead } from '../../types';
import toast from 'react-hot-toast';

export const CrmCallbacksPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [followupNote, setFollowupNote] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'due_today' | 'overdue' | 'upcoming'>('all');

  const fetchCallbacks = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Lead[]>('/leads/');
      // Filter leads that are in callback or contacted stage
      const callbackLeads = data.filter(
        (l) => l.status === 'callback_later' || l.status === 'contacted'
      );
      setLeads(callbackLeads);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load callbacks pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const dueTodayCount = leads.filter(
    (l) => l.preferred_time && l.preferred_time.startsWith(todayStr)
  ).length;

  const overdueCount = leads.filter(
    (l) => l.preferred_time && l.preferred_time < todayStr
  ).length;

  const upcomingCount = leads.filter(
    (l) => l.preferred_time && l.preferred_time > todayStr
  ).length;

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.lead_number?.toLowerCase().includes(q) ||
      l.full_name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.device_model?.toLowerCase().includes(q) ||
      l.problem_description?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (dateFilter && l.preferred_time && !l.preferred_time.startsWith(dateFilter)) {
      return false;
    }

    if (activeTab === 'due_today') {
      return l.preferred_time && l.preferred_time.startsWith(todayStr);
    }
    if (activeTab === 'overdue') {
      return l.preferred_time && l.preferred_time < todayStr;
    }
    if (activeTab === 'upcoming') {
      return l.preferred_time && l.preferred_time > todayStr;
    }

    return true;
  });

  const handleConvertToBooking = async (lead: Lead) => {
    try {
      await apiPatch(`/leads/${lead.id}/`, { status: 'interested' });
      // Create repair booking job
      await apiPost('/jobs/', {
        lead: lead.id,
        status: 'scheduled_pickup',
        estimated_quote: 0,
        work_notes: `Converted from Callback pipeline: ${lead.problem_description || ''}`,
      });
      toast.success(`Converted ${lead.lead_number} into Workshop Booking!`);
      fetchCallbacks();
    } catch {
      toast.error('Failed to convert to booking');
    }
  };

  const handleMarkRejected = async (lead: Lead) => {
    try {
      await apiPatch(`/leads/${lead.id}/`, {
        status: 'declined',
        internal_notes: `Customer declined during callback follow-up: ${followupNote || 'Customer changed mind'}`,
      });
      toast.success(`Moved ${lead.lead_number} to Rejected list`);
      setSelectedLead(null);
      fetchCallbacks();
    } catch {
      toast.error('Failed to update lead');
    }
  };

  const handleReschedule = async () => {
    if (!selectedLead) return;
    try {
      await apiPatch(`/leads/${selectedLead.id}/`, {
        status: 'callback_later',
        preferred_time: rescheduleDate || new Date().toISOString(),
        internal_notes: `Rescheduled callback: ${followupNote || 'Follow up agreed with customer'}`,
      });
      toast.success(`Callback rescheduled for ${selectedLead.lead_number}`);
      setSelectedLead(null);
      setFollowupNote('');
      fetchCallbacks();
    } catch {
      toast.error('Failed to reschedule');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PhoneCall className="w-7 h-7 text-amber-500" />
            Call Back Later — Follow-Up Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dedicated follow-up interface: Record outcomes, reschedule with full history, and convert to bookings seamlessly.
          </p>
        </div>

        <button
          onClick={fetchCallbacks}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('due_today')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            activeTab === 'due_today'
              ? 'bg-amber-50 border-amber-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Due Today</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">{dueTodayCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Must contact today</div>
        </div>

        <div
          onClick={() => setActiveTab('overdue')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-50 border-rose-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Overdue Callbacks</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">{overdueCount}</div>
          <div className="text-[11px] text-rose-700 mt-0.5">Scheduled date passed</div>
        </div>

        <div
          onClick={() => setActiveTab('upcoming')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            activeTab === 'upcoming'
              ? 'bg-blue-50 border-blue-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Upcoming</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-1">{upcomingCount}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Future scheduled dates</div>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-indigo-50 border-indigo-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">All Callbacks</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{leads.length}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Total active callback pipeline</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search callback leads by customer name, phone, lead ID, device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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

      {/* Callbacks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Lead ID / Created</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Device & Problem</th>
                <th className="py-3 px-4">Scheduled For</th>
                <th className="py-3 px-4">Status & Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading callbacks from database...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No callbacks scheduled matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isOverdue =
                    lead.preferred_time && lead.preferred_time < todayStr;
                  const isToday =
                    lead.preferred_time && lead.preferred_time.startsWith(todayStr);

                  return (
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
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-slate-500 hover:text-indigo-600 font-mono text-[11px] block mt-0.5"
                        >
                          {lead.phone}
                        </a>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-800">
                          {lead.device_brand} {lead.device_model}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5">
                          {lead.problem_description || 'General inspection required'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Clock
                            className={`w-3.5 h-3.5 ${
                              isOverdue
                                ? 'text-rose-500'
                                : isToday
                                ? 'text-amber-500'
                                : 'text-slate-400'
                            }`}
                          />
                          <span
                            className={
                              isOverdue
                                ? 'text-rose-600 font-bold'
                                : isToday
                                ? 'text-amber-700 font-bold'
                                : 'text-slate-700'
                            }
                          >
                            {lead.preferred_time
                              ? new Date(lead.preferred_time).toLocaleString([], {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : 'Pending Call'}
                          </span>
                        </div>
                        {isOverdue && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-bold rounded bg-rose-100 text-rose-700">
                            Overdue
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {lead.status === 'callback_later' ? 'Call Back Later' : 'Contacted'}
                        </span>
                        <div className="text-slate-500 text-[11px] truncate mt-1 italic">
                          {lead.internal_notes || 'No notes added yet'}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleConvertToBooking(lead)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-colors cursor-pointer"
                          title="Convert to Workshop Booking"
                        >
                          Book Repair →
                        </button>

                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setRescheduleDate(lead.preferred_time || '');
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Follow Up
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

      {/* Follow-Up / Reschedule Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Follow Up: {selectedLead.lead_number}
                </h3>
                <p className="text-xs text-slate-500">
                  Customer: {selectedLead.full_name} ({selectedLead.phone})
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reschedule Callback Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Call Outcome / Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Customer asked to call after 6 PM regarding screen quote..."
                  value={followupNote}
                  onChange={(e) => setFollowupNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => handleMarkRejected(selectedLead)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs cursor-pointer"
              >
                Mark Declined
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm cursor-pointer"
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
