import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Shield, LogIn, Sparkles, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // Redirect based on role
      const savedUser = JSON.parse(localStorage.getItem('scholartrack_user') || '{}');
      if (savedUser.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string, role: 'STUDENT' | 'ADMIN') => {
    setEmail(userEmail);
    setPassword(userPass);
    setActiveTab(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0F3040] text-[#D99B7F] flex items-center justify-center font-bold shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-[#0F3040] tracking-tight">
              Scholar<span className="text-[#A56F63]">Track</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-[#0F3040]">Sign in to your portal</h2>
          <p className="text-xs text-[#464858]">Access student applications or administrative review consoles.</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-premium space-y-6">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('STUDENT');
                if (email === 'admin@scholartrack.edu') {
                  setEmail('rahul.kumar@scholartrack.edu');
                  setPassword('');
                }
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'STUDENT'
                  ? 'bg-white text-[#0F3040] shadow-xs'
                  : 'text-[#464858] hover:text-[#0F3040]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ADMIN');
                setEmail('admin@scholartrack.edu');
                setPassword('');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-[#0F3040] shadow-xs'
                  : 'text-[#464858] hover:text-[#0F3040]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          </div>

          {isExpired && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040] block">
                {activeTab === 'ADMIN' ? 'Admin Email Address' : 'Student Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'ADMIN' ? 'admin@scholartrack.edu' : 'student@scholartrack.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040] focus:ring-1 focus:ring-[#0F3040]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#0F3040] block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0F3040] focus:ring-1 focus:ring-[#0F3040]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#0F3040] hover:bg-[#0A202B] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {activeTab}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Demo Prototype Quick Fill
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('admin@scholartrack.edu', '', 'ADMIN')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F3040] font-bold text-left transition-all"
              >
                <div className="text-[10px] text-[#A56F63]">Administrator</div>
                <div className="truncate">Dr. Thorne (Reviewer)</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('rahul.kumar@scholartrack.edu', '', 'STUDENT')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F3040] font-bold text-left transition-all"
              >
                <div className="text-[10px] text-emerald-700">Eligible Student</div>
                <div className="truncate">Rahul Kumar</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('priya.sharma@scholartrack.edu', '', 'STUDENT')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F3040] font-bold text-left transition-all"
              >
                <div className="text-[10px] text-sky-700">Approved Student</div>
                <div className="truncate">Priya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('vikram.singh@scholartrack.edu', '', 'STUDENT')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F3040] font-bold text-left transition-all"
              >
                <div className="text-[10px] text-rose-700">Mismatch Case</div>
                <div className="truncate">Vikram Singh</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#464858]">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#0F3040] hover:text-[#A56F63] underline">
                Register as Student
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
