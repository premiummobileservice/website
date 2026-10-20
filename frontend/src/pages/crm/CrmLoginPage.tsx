import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Smartphone, Lock, User, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export const CrmLoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/crm/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Invalid username or password. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoRole = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Premium Mobile Repair
          </span>
        </Link>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Staff CRM & Operations Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Authorized personnel access for Bangalore doorstep operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter staff username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              Role Testing Shortcuts:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setDemoRole('admin', 'admin123')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-rose-600">Admin</div>
                <div className="text-slate-400 text-[10px]">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('manager', 'manager123')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-purple-600">Manager</div>
                <div className="text-slate-400 text-[10px]">manager / manager123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('technician', 'tech123')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-sky-600">Technician</div>
                <div className="text-slate-400 text-[10px]">technician / tech123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('telecaller', 'tele123')}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-amber-600">Telecaller</div>
                <div className="text-slate-400 text-[10px]">telecaller / tele123</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-indigo-600 font-semibold">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
