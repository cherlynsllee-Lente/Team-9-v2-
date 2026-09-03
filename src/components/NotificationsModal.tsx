import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationAction: (item: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onNotificationAction,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in pt-16 sm:pt-4">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-extrabold text-base text-slate-100">Notifications</h2>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-orange-400 font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs hover:bg-slate-750 border border-slate-700/50"
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2 no-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onNotificationAction(n)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                !n.read
                  ? 'bg-slate-800/90 border-orange-500/40 shadow-sm'
                  : 'bg-slate-800/50 border-slate-700/40 opacity-75'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm ${
                  n.type === 'match'
                    ? 'bg-orange-500 text-white'
                    : n.type === 'poll'
                    ? 'bg-amber-500 text-white'
                    : n.type === 'alert'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-cyan-500 text-white'
                }`}
              >
                {n.type === 'match' ? '🏸' : n.type === 'poll' ? '📊' : n.type === 'alert' ? '🔔' : '📅'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
