import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Wrench,
  PhoneCall,
  XCircle,
  FileText,
  BarChart3,
  UserCheck,
  Settings,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const CrmLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/crm/login');
  };

  const getBreadcrumbTitle = () => {
    const p = location.pathname;
    if (p.includes('/crm/leads')) return 'Enquiries Pipeline';
    if (p.includes('/crm/repairs') || p.includes('/crm/jobs')) return 'Bookings & Workshop';
    if (p.includes('/crm/callbacks')) return 'Call Back Later Desk';
    if (p.includes('/crm/rejected')) return 'Not Interested / Declined Leads';
    if (p.includes('/crm/invoices')) return 'Invoices & Billing';
    if (p.includes('/crm/customers')) return 'Customers Directory';
    if (p.includes('/crm/reports')) return 'Reports & Analytics';
    if (p.includes('/crm/users')) return 'Staff Users';
    if (p.includes('/crm/technicians')) return 'Workshop Technicians';
    if (p.includes('/crm/settings')) return 'Settings';
    return 'Dashboard';
  };

  const isActive = (path: string) => {
    if (path === '/crm/dashboard') {
      return location.pathname === '/crm/dashboard' || location.pathname === '/crm';
    }
    if (path === '/crm/repairs') {
      return location.pathname.includes('/crm/repairs') || location.pathname.includes('/crm/jobs');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row font-sans">
      {/* ── Left Sidebar (Dark Navy matching image) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0c1322] border-r border-slate-900 shrink-0 text-slate-300 select-none">
        {/* Brand / Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md shadow-indigo-500/10 shrink-0 overflow-hidden p-1">
            <img
              src="/tab.png"
              alt="Premium Mobile Repair"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-none">
              Premium Mobile Repair
            </span>
            <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase mt-0.5 block">
              CRM PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto text-xs">
          {/* OVERVIEW */}
          <div>
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              OVERVIEW
            </div>
            <Link
              to="/crm/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                isActive('/crm/dashboard')
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* ORDER PIPELINE */}
          <div>
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              ORDER PIPELINE
            </div>
            <div className="space-y-1">
              <Link
                to="/crm/leads"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/leads')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>1. Enquiries</span>
              </Link>

              <Link
                to="/crm/repairs"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/repairs')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>2. Bookings</span>
              </Link>

              <Link
                to="/crm/callbacks"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/callbacks')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>3. Call Back Later</span>
              </Link>

              <Link
                to="/crm/rejected"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/rejected')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>4. Not Interested</span>
              </Link>

              <Link
                to="/crm/invoices"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/invoices')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>5. Invoices</span>
              </Link>
            </div>
          </div>

          {/* CUSTOMERS */}
          <div>
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              CUSTOMERS
            </div>
            <Link
              to="/crm/customers"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                isActive('/crm/customers')
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers Directory</span>
            </Link>
          </div>

          {/* REPORTS */}
          <div>
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              REPORTS
            </div>
            <Link
              to="/crm/reports"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                isActive('/crm/reports')
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports &amp; Analytics</span>
            </Link>
          </div>

          {/* ADMIN */}
          <div>
            <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
              ADMIN
            </div>
            <div className="space-y-1">
              <Link
                to="/crm/users"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/users')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Staff Users</span>
              </Link>

              <Link
                to="/crm/technicians"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/technicians')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Technicians</span>
              </Link>

              <Link
                to="/crm/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  isActive('/crm/settings')
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/60 space-y-1 text-xs">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Canvas (Light Grey matching image) ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-semibold">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 mr-2"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-slate-800 font-bold">CRM</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 font-bold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Right Area: Search, Bell, Profile Chip */}
          <div className="flex items-center gap-4">
            {/* Search Pill */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, repairs, IMEI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Notification Bell */}
            <button
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Profile Chip with Super Admin Badge (matching image) */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <UserIcon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Super Admin'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">
                {user?.role === 'admin' ? 'Super Admin' : user?.role || 'Super Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#0c1322] border-b border-slate-800 p-4 space-y-2 text-slate-300 text-xs">
            <Link
              to="/crm/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white font-bold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/crm/leads"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <Users className="w-4 h-4" />
              <span>1. Enquiries</span>
            </Link>
            <Link
              to="/crm/repairs"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <Wrench className="w-4 h-4" />
              <span>2. Bookings</span>
            </Link>
            <Link
              to="/crm/callbacks"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>3. Call Back Later</span>
            </Link>
            <Link
              to="/crm/rejected"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>4. Not Interested</span>
            </Link>
            <Link
              to="/crm/invoices"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>5. Invoices</span>
            </Link>
            <Link
              to="/crm/customers"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <Users className="w-4 h-4" />
              <span>Customers Directory</span>
            </Link>
            <Link
              to="/crm/reports"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports &amp; Analytics</span>
            </Link>
            <Link
              to="/crm/users"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <UserCheck className="w-4 h-4" />
              <span>Staff Users</span>
            </Link>
            <Link
              to="/crm/technicians"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <Wrench className="w-4 h-4" />
              <span>Technicians</span>
            </Link>
            <Link
              to="/crm/settings"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg pt-3 border-t border-slate-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
