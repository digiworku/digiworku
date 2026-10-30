import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  Rocket,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  FileText,
  Check,
  Trash2
} from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
  read: boolean;
  category: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  isAdmin: boolean;
  panelMode: 'user' | 'admin';
  triggerToast: (msg: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  notifications,
  setNotifications,
  isAdmin,
  panelMode,
  triggerToast
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 ${
              darkMode ? 'bg-[#182025] text-white border-l border-slate-800' : 'bg-white text-slate-800 border-l border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00c853]/10 text-[#00c853] rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Notification Center</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {notifications.filter(n => !n.read).length} Unread Updates
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Toolbar */}
            <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-900/20 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-500 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    triggerToast("✨ All notifications marked as read!");
                  }}
                  className="hover:text-[#00c853] dark:hover:text-[#00c853] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Mark all as read
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  onClick={() => {
                    setNotifications([]);
                    triggerToast("🗑️ All notifications cleared!");
                  }}
                  className="hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Clear all
                </button>
              </div>

              {isAdmin && panelMode === 'admin' && (
                <button
                  onClick={() => {
                    const title = prompt("Enter Broadcast Title:");
                    if (!title) return;
                    const msg = prompt("Enter Broadcast Message:");
                    if (!msg) return;
                    const newNotif: AppNotification = {
                      id: `broadcast-${Date.now()}`,
                      title: `📢 ${title}`,
                      description: msg,
                      time: 'Just now',
                      type: 'success',
                      read: false,
                      category: 'Admin Broadcast'
                    };
                    setNotifications(prev => [newNotif, ...prev]);
                    localStorage.setItem('digiworku-broadcast-notification', JSON.stringify(newNotif));
                    triggerToast("📢 Broadcast sent to all active users!");
                  }}
                  className="text-[#00c853] hover:text-[#00a845] flex items-center gap-1 cursor-pointer transition-colors border border-[#00c853]/20 bg-[#00c853]/10 px-2 py-1 rounded-md"
                >
                  <Rocket className="w-3.5 h-3.5" /> Broadcast
                </button>
              )}
            </div>

            {/* Notification Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <Bell className="w-8 h-8 opacity-40 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Notifications Yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      You've cleared your feed! Wait for live developer team and CRM events, or reset the default feed below.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setNotifications([
                        {
                          id: 'notif-1',
                          title: '🚀 AI Agent Initialized',
                          description: 'DigiWorku AI Operator is ready. Smart routing has been updated for high-speed indexing.',
                          time: 'Just now',
                          type: 'success',
                          read: false,
                          category: 'System'
                        },
                        {
                          id: 'notif-2',
                          title: '💬 Team Member Assigned',
                          description: 'Ananya Sharma has been linked as your Lead PM for DigiWorku workspace.',
                          time: '20 mins ago',
                          type: 'message',
                          read: false,
                          category: 'Team'
                        }
                      ]);
                      triggerToast("🔄 Default notification feed restored.");
                    }}
                    className="text-xs text-[#00c853] font-bold underline cursor-pointer"
                  >
                    Reset Default Feed
                  </button>
                </div>
              ) : (
                notifications.map((notif) => {
                  let iconColor = "text-blue-500 bg-blue-500/10";
                  let IconComponent = FileText;

                  if (notif.type === 'success') {
                    iconColor = "text-[#00c853] bg-[#00c853]/10";
                    IconComponent = CheckCircle2;
                  } else if (notif.type === 'message') {
                    iconColor = "text-indigo-500 bg-indigo-500/10";
                    IconComponent = MessageSquare;
                  } else if (notif.type === 'warning' || notif.type === 'alert') {
                    iconColor = "text-amber-500 bg-amber-500/10";
                    IconComponent = AlertCircle;
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border transition-all relative group flex items-start gap-3 ${
                        notif.read
                          ? (darkMode ? 'bg-slate-900/30 border-slate-800 text-slate-400' : 'bg-slate-50/50 border-slate-100 text-slate-500')
                          : (darkMode ? 'bg-slate-800/45 border-[#00c853]/35 text-white shadow-xs' : 'bg-[#00c853]/5 dark:bg-[#00c853]/10 border-[#00c853]/25 text-slate-800 shadow-xs')
                      }`}
                    >
                      {/* Unread pulsing dot */}
                      {!notif.read && (
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#00c853] rounded-full" />
                      )}

                      {/* Icon */}
                      <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Title and details */}
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`text-xs font-bold leading-snug ${notif.read ? 'text-slate-700 dark:text-slate-350' : 'text-slate-900 dark:text-white font-black'}`}>
                            {notif.title}
                          </h4>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
                          {notif.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-400 font-bold">
                            {notif.time}
                          </span>
                          <span className="text-[10px] text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                            {notif.category}
                          </span>
                        </div>
                      </div>

                      {/* Actions drawer hover panel */}
                      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-[#182025] rounded-lg shadow-md p-1 border border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: !n.read } : n));
                            triggerToast(notif.read ? "Marked as unread" : "Marked as read");
                          }}
                          className="p-1 text-slate-400 hover:text-[#00c853] rounded-md"
                          title={notif.read ? "Mark Unread" : "Mark Read"}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.filter(n => n.id !== notif.id));
                            triggerToast("Notification deleted");
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Secure Footer Status Block */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center text-[10px] text-slate-400 font-bold">
              🔒 DigiWorku Notification Service Secured by End-to-End Encryption
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
