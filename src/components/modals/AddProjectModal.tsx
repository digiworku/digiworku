import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, X } from 'lucide-react';
import { supabase } from '../../supabase';
import type { CRMProject } from '../../types/crm';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: { name: string; client: string; budget: string; desc: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string; client: string; budget: string; desc: string }>>;
  onProjectCreated: (newProj: CRMProject) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  onProjectCreated,
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
                <Folder className="w-4 h-4 text-emerald-500" />
                Add New Pipeline Project
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Project Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Website Redesign"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Client / Lead Name</label>
                <input
                  type="text"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Budget (Optional)</label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. ₹50,000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Description</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Project requirements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white h-24 resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!form.name || !form.client) return;

                  const newProj: CRMProject = {
                    id: `#PJ-${Math.floor(5000 + Math.random() * 999)}`,
                    name: form.name,
                    leadName: form.client,
                    leadAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.client)}&background=random`,
                    status: 'ON TRACK',
                    healthScore: 100,
                    budget: form.budget || 'TBD',
                    description: form.desc || 'New operational milestone.',
                    progress: 0,
                  };

                  onProjectCreated(newProj);

                  // Save to Supabase
                  supabase.from('crm_projects').insert({
                    id: newProj.id,
                    name: newProj.name,
                    lead_name: newProj.leadName || '',
                    lead_avatar: newProj.leadAvatar || null,
                    status: newProj.status,
                    health_score: newProj.healthScore,
                    budget: newProj.budget || '',
                    description: newProj.description || '',
                    progress: newProj.progress || 0,
                  }).then(({ error }) => {
                    if (error) console.warn('CRM project insert error:', error.message);
                  });

                  onClose();
                  setForm({ name: '', client: '', budget: '', desc: '' });
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
