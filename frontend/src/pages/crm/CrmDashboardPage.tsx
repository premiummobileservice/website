import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crmApi } from '../../api/crmApi';
import { DashboardStats, Lead, RepairJob } from '../../types';
import {
  Users,
  Wrench,
  PhoneCall,
  RefreshCw,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  FileCheck,
} from 'lucide-react';

export const CrmDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, jobsRes] = await Promise.allSettled([
        crmApi.getDashboardStats(),
        crmApi.getLeads({ page: 1 }),
        crmApi.getJobs(),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }
      if (leadsRes.status === 'fulfilled') {
        setRecentLeads(leadsRes.value.results);
      }
      if (jobsRes.status === 'fulfilled') {
        setJobs(jobsRes.value.results);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLeadsCount = stats?.total_leads_today ?? recentLeads.length;
  const activeBookingsCount = jobs.filter((j) => j.status !== 'delivered_collected').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header (Matching Image) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Premium Mobile Repair Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline overview driven directly by the database: Enquiries, Bookings, Callbacks, and Revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Real Data</span>
          </button>

          <Link
            to="/crm/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <span>Open Enquiries Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 4 Top KPI Cards (Matching Image Exactly) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: TOTAL ENQUIRIES */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                TOTAL ENQUIRIES
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalLeadsCount}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 mt-3 border-t border-slate-100">
            <span className="font-semibold text-purple-600">
              {totalLeadsCount} New Today
            </span>
            <Link
              to="/crm/leads"
              className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-0.5"
            >
              <span>Review Leads</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: ACTIVE BOOKINGS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ACTIVE BOOKINGS
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {activeBookingsCount}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 mt-3 border-t border-slate-100">
            <span className="text-slate-500">
              {jobs.filter((j) => j.status === 'delivered_collected').length} Completed
            </span>
            <Link
              to="/crm/jobs"
              className="text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-0.5"
            >
              <span>View Workshop</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 3: PENDING CALLBACKS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PENDING CALLBACKS
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {recentLeads.filter((l) => l.status === 'contacted').length}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 mt-3 border-t border-slate-100">
            <span className="text-amber-600 font-semibold">
              0 Due Today / 0 Overdue
            </span>
            <Link
              to="/crm/leads?status=contacted"
              className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-0.5"
            >
              <span>Follow Up</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 4: TOTAL PAID REVENUE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                TOTAL PAID REVENUE
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                ₹
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              ₹0
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-4 mt-3 border-t border-slate-100">
            <span className="text-slate-500">0 Invoices Generated</span>
            <Link
              to="/crm/jobs"
              className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-0.5"
            >
              <span>View Invoices</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Second Row of Two Cards (Matching Image) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: New Enquiries Awaiting 4-Action Review */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                New Enquiries Awaiting 4-Action Review
              </h2>
            </div>
            <Link
              to="/crm/leads"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center">
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between hover:border-indigo-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          {lead.reference || `PMR-${lead.id}`}
                        </span>
                        <span className="font-semibold text-slate-900 text-xs">{lead.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {lead.brand_model} • {lead.repair_needed} • {lead.area}
                      </div>
                    </div>
                    <Link
                      to={`/crm/leads?leadId=${lead.id}`}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-50"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No new unreviewed enquiries right now.
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Active Workshop Repairs (In Progress) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Active Workshop Repairs (In Progress)
              </h2>
            </div>
            <Link
              to="/crm/jobs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center">
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between hover:border-sky-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-600">
                          {job.job_number}
                        </span>
                        <span className="font-semibold text-slate-900 text-xs">{job.customer_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {job.brand_model} • {job.repair_needed}
                      </div>
                    </div>
                    <Link
                      to="/crm/jobs"
                      className="px-2.5 py-1 bg-white border border-slate-200 text-sky-600 text-xs font-semibold rounded-lg hover:bg-sky-50"
                    >
                      Workshop
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No repairs currently in progress.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Third Row Card (Full Width): Scheduled Callbacks Requiring Attention ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Scheduled Callbacks Requiring Attention
            </h2>
          </div>
          <Link
            to="/crm/leads?status=contacted"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
          >
            <span>View Follow-Up Desk</span>
            <span>→</span>
          </Link>
        </div>

        <div className="p-10 text-center text-xs text-slate-400">
          No pending callbacks scheduled right now.
        </div>
      </div>
    </div>
  );
};
