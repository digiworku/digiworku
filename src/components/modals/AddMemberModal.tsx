import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, X } from 'lucide-react';
import { supabase } from '../../supabase';
import type { TeamMember } from '../../types/crm';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: { name: string; role: string; avatarUrl: string; status: 'ONLINE' | 'OFF SHIFT' };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; role: string; avatarUrl: string; status: 'ONLINE' | 'OFF SHIFT' }>>;
  onMemberAdded: (newMember: TeamMember) => void;
  triggerToast: (msg: string) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  onMemberAdded,
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
                Add Digital Workforce Member
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vikram Aditya"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Role / Specialization</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Next.js Developer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Avatar Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.avatarUrl}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or blank"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const name = form.name.trim() || 'Team';
                      const colors = ['00c853', '3b82f6', '8b5cf6', 'f59e0b', 'ef4444'];
                      const color = colors[Math.floor(Math.random() * colors.length)];
                      const generated = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&bold=true&size=256`;
                      setForm({ ...form, avatarUrl: generated });
                      triggerToast("🎨 Generated avatar from name!");
                    }}
                    className="px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-xs font-black text-slate-700 dark:text-slate-300 transition-colors"
                    title="Generate random profile image"
                  >
                    🎲 Random
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Shift Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'ONLINE' | 'OFF SHIFT' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="OFF SHIFT">OFF SHIFT</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!form.name || !form.role) {
                    triggerToast("⚠️ Name and Role are required fields.");
                    return;
                  }

                  const finalAvatar = form.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=00c853&color=fff`;

                  const newMember: TeamMember = {
                    id: `team-${Date.now()}`,
                    name: form.name,
                    role: form.role,
                    avatarUrl: finalAvatar,
                    status: form.status,
                    blocked: false,
                  };

                  onMemberAdded(newMember);

                  // Save to Supabase
                  supabase.from('team').insert({
                    id: newMember.id,
                    name: newMember.name,
                    role: newMember.role,
                    avatar_url: newMember.avatarUrl,
                    status: newMember.status,
                    blocked: false,
                  }).then(({ error }) => {
                    if (error) console.warn('Team insert error:', error.message);
                  });

                  onClose();
                  setForm({ name: '', role: '', avatarUrl: '', status: 'ONLINE' });
                  triggerToast(`👥 Team Joined: ${form.name} is now in workforce database!`);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Join Team
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
