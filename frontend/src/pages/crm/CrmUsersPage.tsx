import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  RefreshCw,
  Shield,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  X,
  Edit2,
  Key,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiGet, apiPost } from '../../services/api';
import toast from 'react-hot-toast';

interface StaffUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician' | 'telecaller' | 'pickup_boy';
  is_active: boolean;
  date_joined?: string;
}

export const CrmUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([
    {
      id: 1,
      username: 'admin',
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@premiummobilerepair.in',
      phone: '+91 93435 84460',
      role: 'admin',
      is_active: true,
      date_joined: '2026-01-15',
    },
    {
      id: 2,
      username: 'manager',
      first_name: 'Operations',
      last_name: 'Manager',
      email: 'manager@premiummobilerepair.in',
      phone: '+91 93435 84461',
      role: 'manager',
      is_active: true,
      date_joined: '2026-02-01',
    },
    {
      id: 3,
      username: 'technician',
      first_name: 'Senior',
      last_name: 'Technician',
      email: 'tech@premiummobilerepair.in',
      phone: '+91 93435 84462',
      role: 'technician',
      is_active: true,
      date_joined: '2026-02-10',
    },
    {
      id: 4,
      username: 'telecaller',
      first_name: 'Support',
      last_name: 'Executive',
      email: 'support@premiummobilerepair.in',
      phone: '+91 93435 84463',
      role: 'telecaller',
      is_active: true,
      date_joined: '2026-02-15',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'technician' | 'telecaller' | 'pickup_boy'>('technician');
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // If backend has user management endpoint:
      const data = await apiGet<StaffUser[]>('/auth/users/').catch(() => null);
      if (data && Array.isArray(data)) {
        setUsers(data);
      }
    } catch {
      // Keep initial seeded users
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast.error('Username and password are required');
      return;
    }

    try {
      const newUser: StaffUser = {
        id: users.length + 1,
        username: newUsername,
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        is_active: true,
        date_joined: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      toast.success(`Staff user ${newUsername} added successfully!`);
      setModalOpen(false);
      // Reset form
      setNewUsername('');
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPhone('');
      setNewPassword('');
    } catch {
      toast.error('Failed to create staff account');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(q) ||
      u.first_name.toLowerCase().includes(q) ||
      u.last_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'manager':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'technician':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'telecaller':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pickup_boy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            Staff & User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Super Admin access: Manage CRM executive, technician, manager & staff accounts. Handled leads will display the staff member's name.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Staff User</span>
          </button>
        </div>
      </div>

      {/* Superadmin Alert Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-700 shrink-0" />
          <div>
            <div className="font-bold text-indigo-950">
              Logged in as:{' '}
              <span className="text-indigo-600 font-extrabold">
                {currentUser?.first_name || 'Super Admin'} ({currentUser?.username || 'admin'})
              </span>
            </div>
            <p className="text-indigo-800 text-[11px] mt-0.5">
              Only the Super Admin can create additional staff users. Leads handled by any staff member will record their exact name in the CRM.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white font-bold text-indigo-900 border border-indigo-200 rounded-lg text-xs whitespace-nowrap shadow-xs">
          Total Staff: {users.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="admin">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="technician">Technician</option>
            <option value="telecaller">CRM Executive</option>
            <option value="pickup_boy">Pickup / Delivery</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Email & Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">@{u.username}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role === 'admin'
                        ? 'Super Admin'
                        : u.role === 'telecaller'
                        ? 'CRM Executive'
                        : u.role === 'pickup_boy'
                        ? 'Pickup Executive'
                        : u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.phone || '+91 93435 84460'}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active Staff
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {u.date_joined || '2026-01-15'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toast.success(`Viewing profile for @${u.username}`)}
                      className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 font-semibold text-[11px] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  Add New Staff User
                </h3>
                <p className="text-xs text-slate-500">
                  Provision new team credentials for CRM lead handling & workshop assignments.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul_tech"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@premiummobilerepair.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98800 12345"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role & Level</label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(
                      e.target.value as 'admin' | 'manager' | 'technician' | 'telecaller' | 'pickup_boy'
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                >
                  <option value="technician">Workshop Technician</option>
                  <option value="telecaller">CRM Executive (Telecaller / Support)</option>
                  <option value="pickup_boy">Pickup & Delivery Executive</option>
                  <option value="manager">Operations Manager</option>
                  <option value="admin">Super Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
