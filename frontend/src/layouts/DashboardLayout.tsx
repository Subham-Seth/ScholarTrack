import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { AIChatPanel } from '../components/common/AIChatPanel';
import { LoadingState } from '../components/common/LoadingState';
import { Menu, X } from 'lucide-react';

interface Props {
  allowedRoles: ('STUDENT' | 'ADMIN')[];
}

export const DashboardLayout: React.FC<Props> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading, isStudent } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <LoadingState message="Authenticating session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Modal */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col z-10">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F3040] uppercase">Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar onLinkClick={() => setMobileSidebarOpen(false)} className="border-r-0 h-full" />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile Sidebar Drawer Trigger Button */}
          <div className="md:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-[#0F3040]"
            >
              <Menu className="w-4 h-4" />
              <span>Menu Navigation</span>
            </button>
            <span className="text-[11px] font-bold text-[#A56F63] uppercase tracking-wide">
              {user.role}
            </span>
          </div>

          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant for Students */}
      {isStudent && <AIChatPanel floating={true} />}
    </div>
  );
};
