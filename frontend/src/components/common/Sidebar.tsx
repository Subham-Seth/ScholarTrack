import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  FileCheck,
  FolderOpen,
  Bot,
  Bell,
  User,
  Settings,
  LogOut,
  ShieldAlert,
  Copy,
  Users,
  BarChart3,
  ScrollText,
  Award
} from 'lucide-react';

interface Props {
  className?: string;
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<Props> = ({ className = '', onLinkClick }) => {
  const { user, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const studentNavItems = [
    { label: 'Dashboard', to: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Scholarships', to: '/student/scholarships', icon: <Search className="w-4 h-4" /> },
    { label: 'AI Recommendations', to: '/student/recommendations', icon: <Sparkles className="w-4 h-4 text-[#D99B7F]" /> },
    { label: 'My Applications', to: '/student/applications', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Documents', to: '/student/documents', icon: <FolderOpen className="w-4 h-4" /> },
    { label: 'AI Assistant', to: '/student/assistant', icon: <Bot className="w-4 h-4 text-[#A56F63]" /> },
    { label: 'Notifications', to: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Profile', to: '/student/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', to: '/student/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Scholarships', to: '/admin/scholarships', icon: <Award className="w-4 h-4" /> },
    { label: 'Review Queue', to: '/admin/applications', icon: <FileCheck className="w-4 h-4" /> },
    { label: 'Duplicate Alerts', to: '/admin/duplicates', icon: <Copy className="w-4 h-4 text-amber-500" /> },
    { label: 'Fraud Alerts', to: '/admin/fraud-alerts', icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
    { label: 'Students', to: '/admin/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Analytics', to: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 text-[#0F3040]" /> },
    { label: 'Audit Logs', to: '/admin/audit-logs', icon: <ScrollText className="w-4 h-4" /> },
    { label: 'Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none ${className}`}>
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* User Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F3040] text-[#D99B7F] font-extrabold flex items-center justify-center text-sm shadow-xs">
            {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[#0F3040] truncate">{user?.fullName || 'User'}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A56F63]/15 text-[#A56F63] uppercase tracking-wide">
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0F3040] text-white shadow-xs font-bold'
                    : 'text-[#464858] hover:bg-slate-100 hover:text-[#0F3040]'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
