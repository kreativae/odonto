import { useState } from 'react';
import {
  Bell,
  Calendar,
  DollarSign,
  UserPlus,
  Settings,
  Cake,
  Check,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { notifications as initialNotifications } from '../mockData';

const typeConfig = {
  appointment: { icon: <Calendar size={16} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  payment: { icon: <DollarSign size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  lead: { icon: <UserPlus size={16} />, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
  system: { icon: <Settings size={16} />, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-700' },
  birthday: { icon: <Cake size={16} />, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notificações</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas as notificações lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <CheckCheck size={16} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Todas ({notifs.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Não lidas ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.map((notif) => {
          const config = typeConfig[notif.type];
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 group ${
                notif.read
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50'
                  : 'bg-primary-50/50 dark:bg-primary-500/5 border-primary-200 dark:border-primary-500/20'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${config.bg} shrink-0`}>
                <span className={config.color}>{config.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className={`text-sm font-semibold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Marcar como lida"
                      >
                        <Check size={14} className="text-slate-400" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0 mt-1 pulse-soft" />
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
