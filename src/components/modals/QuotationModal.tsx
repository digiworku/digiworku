import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, X } from 'lucide-react';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: { projectName: string; scope: string; budget: string; timeline: string };
  setForm: React.Dispatch<React.SetStateAction<{ projectName: string; scope: string; budget: string; timeline: string }>>;
  onSubmit: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
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
              <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Dispatch Official Quotation & Scope
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Project Deliverable Title</label>
                <input
                  type="text"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                  placeholder="e.g. Next.js SaaS Web Application"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Scope of Work & Deliverables</label>
                <textarea
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  rows={3}
                  placeholder="Detail deliverables, milestones, tech stack, and testing stages..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Total Budget (₹)</label>
                  <input
                    type="text"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    placeholder="250000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Delivery Timeline</label>
                  <select
                    value={form.timeline}
                    onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                  >
                    <option value="1-2 weeks">1-2 weeks (Fast-Track Sprint)</option>
                    <option value="2-4 weeks">2-4 weeks (Standard Milestone)</option>
                    <option value="4-8 weeks">4-8 weeks (Full Enterprise Build)</option>
                    <option value="Ongoing Retainer">Ongoing Monthly Retainer</option>
                  </select>
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
                onClick={onSubmit}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Proposal</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
