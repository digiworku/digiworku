import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, X } from 'lucide-react';
import type { ChatThread } from '../../types/crm';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: { name: string; company: string; email: string; phone: string; projectName: string; budget: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; company: string; email: string; phone: string; projectName: string; budget: string }>>;
  onClientCreated: (newThread: ChatThread) => void;
  triggerToast: (msg: string) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  onClientCreated,
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
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-500" />
                Onboard Corporate Client
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Company / Brand Name</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="e.g. Singhania TechVentures"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Corporate Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vikram@corp.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Initial Project Name</label>
                  <input
                    type="text"
                    value={form.projectName}
                    onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                    placeholder="e.g. ERP Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Budget Allocation</label>
                  <input
                    type="text"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    placeholder="e.g. ₹3,50,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!form.name.trim() || !form.email.trim()) {
                    triggerToast("⚠️ Client Name and Email are required.");
                    return;
                  }
                  const clientId = `client-${Date.now()}`;
                  const formattedBudget = form.budget ? (form.budget.startsWith('₹') ? form.budget : `₹${form.budget}`) : '₹2,50,000';
                  const newThread: ChatThread = {
                    id: clientId,
                    name: form.name.trim(),
                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name.trim())}&background=00c853&color=fff&bold=true`,
                    companyName: form.company.trim() || 'Independent Partner',
                    status: 'online',
                    lastSeen: 'Just now',
                    lastMessageText: 'Client account onboarded to ecosystem.',
                    lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    tag: 'Enterprise Client',
                    unreadCount: 0,
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim() || '+91 98765 43210',
                    activeProjectName: form.projectName.trim() || 'Digital Transformation',
                    activeProjectBudget: formattedBudget,
                    activeProjectProgress: 10,
                    adminNotes: 'Direct client profile created via Corporate Directory.',
                    messages: [
                      {
                        id: `m-${Date.now()}`,
                        role: 'assistant',
                        content: `Welcome ${form.name.trim()}! Your dedicated client workspace has been initialized.`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]
                  };

                  onClientCreated(newThread);
                  onClose();
                  setForm({ name: '', company: '', email: '', phone: '', projectName: '', budget: '' });
                  triggerToast(`🎉 Client onboarded: ${newThread.name} (${newThread.companyName})!`);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 text-xs transition-colors cursor-pointer"
              >
                Onboard Client
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
