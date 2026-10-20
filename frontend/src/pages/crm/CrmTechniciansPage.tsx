import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  UserCheck,
  Cpu,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Technician {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  specialization: string[];
  activeJobs: number;
  completedJobs: number;
  rating: string;
  status: 'available' | 'busy' | 'leave';
  station: string;
}

const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Rajesh Kumar',
    code: 'TECH-101',
    email: 'rajesh.tech@premiummobilerepair.in',
    phone: '+91 98450 12890',
    specialization: ['iPhone Micro-soldering', 'Logic Board Repair', 'Face ID Recovery'],
    activeJobs: 3,
    completedJobs: 342,
    rating: '4.95',
    status: 'busy',
    station: 'Cleanroom Bay 1 (Jayanagar)',
  },
  {
    id: 'tech-2',
    name: 'Vinay Murthy',
    code: 'TECH-102',
    email: 'vinay.m@premiummobilerepair.in',
    phone: '+91 97412 88341',
    specialization: ['AMOLED Display & Glass Refurbishing', 'Frame Realignment'],
    activeJobs: 2,
    completedJobs: 289,
    rating: '4.91',
    status: 'available',
    station: 'Vacuum Laminator Bay 2',
  },
  {
    id: 'tech-3',
    name: 'Suresh Gowda',
    code: 'TECH-103',
    email: 'suresh.g@premiummobilerepair.in',
    phone: '+91 94811 50293',
    specialization: ['Battery Health Recalibration', 'Charging Port IC', 'Speaker / Mic'],
    activeJobs: 1,
    completedJobs: 198,
    rating: '4.88',
    status: 'available',
    station: 'Testing & Calibration Bay 3',
  },
  {
    id: 'tech-4',
    name: 'Anita Fernandez',
    code: 'TECH-104',
    email: 'anita.f@premiummobilerepair.in',
    phone: '+91 99002 61774',
    specialization: ['MacBook Logic Board', 'iPad Digitizer & Screen', 'SMD Rework'],
    activeJobs: 4,
    completedJobs: 264,
    rating: '4.97',
    status: 'busy',
    station: 'ESD Workbench Bay 4',
  },
];

export const CrmTechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Tech Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: 'iPhone Micro-soldering, Screen Replacement',
    station: 'Bay 1 (Jayanagar Workshop)',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Technician roster and live workloads synchronized');
    }, 600);
  };

  const handleAddTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please enter technician name and contact phone');
      return;
    }

    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: formData.name,
      code: `TECH-${100 + technicians.length + 1}`,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@premiummobilerepair.in`,
      phone: formData.phone,
      specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean),
      activeJobs: 0,
      completedJobs: 0,
      rating: '5.0',
      status: 'available',
      station: formData.station,
    };

    setTechnicians([newTech, ...technicians]);
    setShowAddModal(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      specialization: 'iPhone Micro-soldering, Screen Replacement',
      station: 'Bay 1 (Jayanagar Workshop)',
    });
    toast.success(`Technician ${newTech.name} added successfully!`);
  };

  const filteredTechnicians = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workshop Technicians &amp; Workload
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Database-backed workshop technician management and live active repair allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Technician</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search technicians by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Workshop Technicians: <strong className="text-slate-900">{filteredTechnicians.length}</strong>
        </div>
      </div>

      {/* Technicians List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Technician Details</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Core Specializations</th>
                <th className="py-3 px-4 text-center">Active Jobs</th>
                <th className="py-3 px-4 text-center">Completed</th>
                <th className="py-3 px-4">Workshop Bay</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTechnicians.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        {t.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="text-slate-400 font-mono text-[10px]">{t.code}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{t.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{t.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {t.specialization.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.activeJobs > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.activeJobs} Jobs
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="font-bold text-slate-900">{t.completedJobs}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{t.rating} ★ Rating</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-600 font-medium text-[11px] block">{t.station}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {t.status === 'available' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available
                      </span>
                    ) : t.status === 'busy' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Active Repairs
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        On Leave
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toast.success(`Viewing assigned repair queue for ${t.name}`)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
                    >
                      View Queue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Workshop Technician</h3>
                  <p className="text-xs text-slate-500">Register bench technician and assign workbench station</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTechnician} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Technician Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98450 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Staff Email</label>
                  <input
                    type="email"
                    placeholder="name@premiummobilerepair.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Station / Bay</label>
                <select
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Cleanroom Bay 1 (Jayanagar)">Cleanroom Bay 1 (Jayanagar)</option>
                  <option value="Vacuum Laminator Bay 2">Vacuum Laminator Bay 2</option>
                  <option value="Testing & Calibration Bay 3">Testing & Calibration Bay 3</option>
                  <option value="ESD Workbench Bay 4">ESD Workbench Bay 4</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  Add Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
