import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Check, 
  Trash2, 
  Filter, 
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';

export const StudentNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ACTION_REQUIRED'>('ALL');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await api.markNotificationAsRead(n.id);
      } catch (err) {
        // continue
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'UNREAD') return !item.isRead;
    if (filter === 'ACTION_REQUIRED') {
      return item.type === 'ACTION_REQUIRED' || item.type === 'ALERT' || item.type === 'WARNING';
    }
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'WARNING':
      case 'ACTION_REQUIRED':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'ERROR':
      case 'ALERT':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3040]">Notification Center</h1>
          <p className="text-[#464858] text-sm mt-1">
            Real-time updates regarding application progress, verification outcomes, and administrative requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2 text-gray-500 hover:text-[#0F3040] hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-2 text-xs font-semibold text-[#0F3040] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'ALL'
              ? 'bg-[#0F3040] text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'UNREAD'
              ? 'bg-[#0F3040] text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>
        <button
          onClick={() => setFilter('ACTION_REQUIRED')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'ACTION_REQUIRED'
              ? 'bg-[#0F3040] text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Action Required
        </button>
      </div>

      {/* List */}
      {loading ? (
        <LoadingState message="Loading your notifications..." />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={
            filter === 'UNREAD'
              ? 'You have caught up with all notifications!'
              : 'You have no notifications in this category.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-gray-200 opacity-90'
                  : 'bg-white border-l-4 border-l-[#0F3040] border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${notif.isRead ? 'text-gray-700' : 'text-[#0F3040]'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#A56F63]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#464858] mt-1 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="text-[#0F3040] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        View Related Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-xs text-gray-400 hover:text-[#0F3040] p-1 rounded hover:bg-gray-50 transition-colors flex items-center gap-1 flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsPage;
