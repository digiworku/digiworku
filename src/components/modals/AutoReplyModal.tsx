import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';

interface AutoReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoReplyEnabled: boolean;
  setAutoReplyEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  autoReplyText: string;
  setAutoReplyText: React.Dispatch<React.SetStateAction<string>>;
  triggerToast: (msg: string) => void;
}

export const AutoReplyModal: React.FC<AutoReplyModalProps> = ({
  isOpen,
  onClose,
  autoReplyEnabled,
  setAutoReplyEnabled,
  autoReplyText,
  setAutoReplyText,
  triggerToast,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-[#00c853]" />
                Auto-Reply Configuration (10s Delay)
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${autoReplyEnabled ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${autoReplyEnabled ? 'bg-[#00c853] animate-pulse' : 'bg-red-500'}`} />
                  <div>
                    <span className="block text-xs font-black text-slate-800 dark:text-white">
                      Auto-Reply Status: {autoReplyEnabled ? 'ACTIVE' : 'DISABLED / REMOVED'}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                      ⏱️ Response Delay: 10 Seconds
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const nextState = !autoReplyEnabled;
                    setAutoReplyEnabled(nextState);
                    localStorage.setItem('digiworku-auto-reply-enabled', String(nextState));
                    triggerToast(nextState ? "🟢 Auto-Reply enabled!" : "🗑️ Auto-Reply disabled & removed!");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${autoReplyEnabled
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#00c853] text-white hover:bg-emerald-600'
                    }`}
                >
                  {autoReplyEnabled ? 'Remove Auto-Reply' : 'Enable Auto-Reply'}
                </button>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Auto-Reply Message Content
                </label>
                <textarea
                  rows={4}
                  value={autoReplyText}
                  onChange={(e) => setAutoReplyText(e.target.value)}
                  placeholder="Enter the automated reply message..."
                  disabled={!autoReplyEnabled}
                  className="w-full p-3.5 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#00c853] outline-none disabled:opacity-50 transition-all leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">
                  💡 Users sending a message will receive this text exactly 10 seconds after sending.
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={() => {
                  const defMsg = "Thank you for reaching out to DigiWorku! Our team has received your message and will update your project details shortly.";
                  setAutoReplyText(defMsg);
                  localStorage.setItem('digiworku-auto-reply-text', defMsg);
                  triggerToast("↺ Reset to default message.");
                }}
                className="py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
              >
                Reset Default
              </button>

              <button
                onClick={() => {
                  localStorage.setItem('digiworku-auto-reply-text', autoReplyText);
                  localStorage.setItem('digiworku-auto-reply-enabled', String(autoReplyEnabled));
                  onClose();
                  triggerToast("⚡ Auto-Reply settings saved successfully!");
                }}
                className="flex-1 py-2.5 rounded-xl font-black text-white bg-[#00c853] hover:bg-emerald-600 text-xs transition-colors shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
