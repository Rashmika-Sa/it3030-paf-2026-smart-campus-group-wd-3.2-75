import { useEffect } from 'react';
import { Bell, CheckCheck, Ticket, CalendarCheck, CalendarX, AlertCircle } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import Navbar from '../components/layout/Navbar';

const TYPE_ICON = {
  TICKET_CREATED: <AlertCircle className="h-5 w-5 text-yellow-400" />,
  TICKET_UPDATED: <Ticket className="h-5 w-5 text-blue-400" />,
  BOOKING_CREATED: <CalendarCheck className="h-5 w-5 text-yellow-400" />,
  BOOKING_APPROVED: <CalendarCheck className="h-5 w-5 text-green-400" />,
  BOOKING_REJECTED: <CalendarX className="h-5 w-5 text-red-400" />,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-28 px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-sliit-gold" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-sliit-gold transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-sliit-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Bell className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-lg">No notifications yet</p>
          </div>
        )}

        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer
                ${n.read
                  ? 'bg-[#2a2a2a] border-gray-800 opacity-60'
                  : 'bg-[#2e2a1a] border-sliit-gold/30 hover:border-sliit-gold/60'
                }`}
            >
              <div className="mt-0.5 shrink-0">
                {TYPE_ICON[n.type] ?? <Bell className="h-5 w-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'text-gray-400' : 'text-white'}`}>
                  {n.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && (
                <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-sliit-gold shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
