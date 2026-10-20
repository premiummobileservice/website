import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { crmApi } from '../../api/crmApi';
import { Lead, LeadStatus, User } from '../../types';
import {
  KanbanSquare,
  List,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  UserCheck,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';

const STATUS_COLUMNS: { id: LeadStatus; label: string; headerColor: string; pillColor: string }[] = [
  { id: 'new', label: '1. New Enquiries', headerColor: 'bg-purple-50 text-purple-700 border-purple-200', pillColor: 'bg-purple-100 text-purple-700' },
  { id: 'contacted', label: '2. Contacted', headerColor: 'bg-blue-50 text-blue-700 border-blue-200', pillColor: 'bg-blue-100 text-blue-700' },
  { id: 'pickup_scheduled', label: '3. Pickup Scheduled', headerColor: 'bg-amber-50 text-amber-700 border-amber-200', pillColor: 'bg-amber-100 text-amber-700' },
  { id: 'device_collected', label: '4. Device Collected', headerColor: 'bg-indigo-50 text-indigo-700 border-indigo-200', pillColor: 'bg-indigo-100 text-indigo-700' },
  { id: 'quote_sent', label: '5. Quote Sent', headerColor: 'bg-sky-50 text-sky-700 border-sky-200', pillColor: 'bg-sky-100 text-sky-700' },
  { id: 'approved', label: '6. Approved', headerColor: 'bg-teal-50 text-teal-700 border-teal-200', pillColor: 'bg-teal-100 text-teal-700' },
  { id: 'in_repair', label: '7. In Repair', headerColor: 'bg-violet-50 text-violet-700 border-violet-200', pillColor: 'bg-violet-100 text-violet-700' },
  { id: 'delivered', label: '8. Delivered & Paid', headerColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', pillColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'declined', label: 'Declined / Lost', headerColor: 'bg-rose-50 text-rose-700 border-rose-200', pillColor: 'bg-rose-100 text-rose-700' },
];

export const CrmLeadsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusReason, setStatusReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<{ id: number; text: string; created_at: string }[]>([]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const [leadsRes, usersRes] = await Promise.allSettled([
        crmApi.getLeads({ search: searchQuery || undefined }),
        crmApi.getUsers(),
      ]);

      if (leadsRes.status === 'fulfilled') {
        setLeads(leadsRes.value.results);
      }
      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery]);

  useEffect(() => {
    const leadId = searchParams.get('leadId');
    if (leadId && leads.length > 0) {
      const found = leads.find((l) => l.id.toString() === leadId);
      if (found) {
        setSelectedLead(found);
      }
    }
  }, [searchParams, leads]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await crmApi.updateLeadStatus(selectedLead.id, newStatus, statusReason);
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setStatusReason('');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConvertToJob = async () => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    try {
      await crmApi.convertToJob(selectedLead.id);
      await fetchLeads();
      alert('Lead successfully converted to Repair Job!');
      setSelectedLead(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error converting lead to job');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    try {
      await crmApi.createLeadNote(selectedLead.id, newNote);
      setNotes((prev) => [
        { id: Date.now(), text: newNote, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setNewNote('');
    } catch {
      alert('Error adding note');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.reference?.toLowerCase().includes(q) ||
        lead.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Order & Enquiries Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time enquiries tracking with 4-action review and doorstep pickup scheduling
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, customer phone, PMR reference code, or Bangalore area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm w-full sm:w-auto font-medium"
        >
          <option value="all">All Pipeline Stages</option>
          {STATUS_COLUMNS.map((col) => (
            <option key={col.id} value={col.id}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
          {STATUS_COLUMNS.map((col) => {
            const columnLeads = filteredLeads.filter((l) => l.status === col.id);
            return (
              <div
                key={col.id}
                className="w-72 shrink-0 rounded-2xl bg-slate-100/70 border border-slate-200/80 p-3 flex flex-col max-h-[calc(100vh-240px)]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200 px-1">
                  <h3 className="text-xs font-bold text-slate-800 truncate">
                    {col.label}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${col.pillColor}`}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white hover:border-indigo-400 border border-slate-200 rounded-xl p-3.5 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 font-bold mb-1">
                        <span>{lead.reference || `PMR-${lead.id}`}</span>
                        <span className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 text-xs mb-1 group-hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </div>

                      <div className="text-[11px] text-slate-600 mb-2 truncate">
                        {lead.brand_model} • {lead.repair_needed}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{lead.area}</span>
                        </span>
                        <span className="text-indigo-600 font-semibold group-hover:underline text-[10px]">
                          Review →
                        </span>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="text-center py-10 text-[11px] text-slate-400">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Ref Code</th>
                  <th className="px-5 py-3.5 font-bold">Customer</th>
                  <th className="px-5 py-3.5 font-bold">Phone</th>
                  <th className="px-5 py-3.5 font-bold">Device & Problem</th>
                  <th className="px-5 py-3.5 font-bold">Bangalore Area</th>
                  <th className="px-5 py-3.5 font-bold">Stage</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">
                      {lead.reference || `PMR-${lead.id}`}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{lead.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{lead.phone}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {lead.brand_model} ({lead.repair_needed})
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.area}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 block">
                    {selectedLead.reference || `PMR-${selectedLead.id}`}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedLead.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Action Buttons */}
              <div className="py-4 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pipeline Stage
                  </span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                    disabled={isUpdatingStatus}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-indigo-700 font-bold focus:outline-none focus:border-indigo-500"
                  >
                    {STATUS_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleConvertToJob}
                  disabled={isUpdatingStatus}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Convert Lead into Active Workshop Booking</span>
                </button>
              </div>

              {/* Contact and Device Details */}
              <div className="py-4 border-b border-slate-100 space-y-3 text-xs">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Enquiry Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Mobile Number</span>
                    <a href={`tel:${selectedLead.phone}`} className="font-bold text-indigo-600 hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Customer Email</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {selectedLead.email || 'None Provided'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Device & Model</span>
                    <span className="font-bold text-slate-900">{selectedLead.brand_model}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Bangalore Area</span>
                    <span className="font-semibold text-slate-800">{selectedLead.area}</span>
                  </div>
                </div>

                {selectedLead.issue_description && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-1">Customer Symptoms / Address Notes</span>
                    <p className="text-slate-800">{selectedLead.issue_description}</p>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="py-4 space-y-3">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Follow-Up Logs & Internal Notes
                </h4>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log a call or pickup confirmation note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Save
                  </button>
                </form>

                <div className="space-y-2 mt-3">
                  {notes.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <p className="text-slate-800">{n.text}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {new Date(n.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
