import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onRefresh?: () => void;
}

export const NotificationPanel: React.FC<Props> = ({ isOpen, onClose, notifications, onRefresh }) => {
  if (!isOpen) return null;

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-[#0F3040]" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0F3040]" />
          <h4 className="text-xs font-bold text-[#0F3040] uppercase tracking-wider">Notifications</h4>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                !n.read ? 'bg-[#D99B7F]/5' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className={`text-xs font-bold ${!n.read ? 'text-[#0F3040]' : 'text-slate-700'}`}>
                    {n.title}
                  </h5>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[10px] text-[#A56F63] hover:underline flex items-center gap-0.5"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#464858] leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400">{n.createdAt}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
