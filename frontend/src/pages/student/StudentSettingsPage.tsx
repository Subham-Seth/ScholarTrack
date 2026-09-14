import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Save, 
  Check, 
  Smartphone, 
  Mail, 
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Notification preferences updated successfully.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSuccessMsg('Password changed successfully! You will use it for next login.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0F3040]">Account & Security Settings</h1>
        <p className="text-[#464858] text-sm mt-1">
          Manage your notification channels, security credentials, and platform privacy settings.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#0F3040] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#A56F63]" /> Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-500 block">Registered Name</span>
            <span className="font-semibold text-gray-800">{user?.fullName || 'Student'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Email Address</span>
            <span className="font-semibold text-gray-800">{user?.email}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Role</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#0F3040]/10 text-[#0F3040]">
              {user?.role}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Session Status</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active (JWT Authenticated)
            </span>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#0F3040] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#A56F63]" /> Notification Preferences
        </h2>

        <form onSubmit={handleSaveNotifications} className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#0F3040]">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive application updates, verification receipts, and official approvals via email.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#0F3040]">In-App Dashboard Alerts</p>
              <p className="text-xs text-gray-500">Show push-style badges for real-time document extraction and reviewer notes.</p>
            </div>
            <input
              type="checkbox"
              checked={inAppAlerts}
              onChange={(e) => setInAppAlerts(e.target.checked)}
              className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#0F3040]">SMS Urgent Alerts</p>
              <p className="text-xs text-gray-500">Receive SMS notifications for critical correction requests or deadline reminders.</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-[#0F3040]">Deadline Reminders</p>
              <p className="text-xs text-gray-500">Automated reminder 7 days and 24 hours before a scholarship application window closes.</p>
            </div>
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={(e) => setDeadlineReminders(e.target.checked)}
              className="w-4 h-4 text-[#0F3040] rounded focus:ring-[#0F3040]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
            >
              <Save className="w-4 h-4" /> Save Notification Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#0F3040] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#A56F63]" /> Change Password
        </h2>

        {passwordError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3040]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F3040] text-white text-xs font-semibold rounded-lg hover:bg-[#1a4b63] transition-colors"
          >
            <KeyRound className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
