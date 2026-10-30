import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import type { ServiceItem } from '../../types/crm';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  servicesList: ServiceItem[];
  selectedServiceTitle: string;
  setSelectedServiceTitle: (title: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  budget: string;
  setBudget: (budget: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  servicesList,
  selectedServiceTitle,
  setSelectedServiceTitle,
  clientName,
  setClientName,
  email,
  setEmail,
  phone,
  setPhone,
  budget,
  setBudget,
  description,
  setDescription,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#e8fcf0] dark:bg-emerald-950/80 text-[#00c853] rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight font-display">Request Project Service</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submit project requirements to launch a sprint with DigiWorku.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Service Category
                </label>
                <select
                  value={selectedServiceTitle}
                  onChange={(e) => {
                    setSelectedServiceTitle(e.target.value);
                    const found = servicesList.find(s => s.title === e.target.value);
                    if (found) setBudget(found.price);
                  }}
                  className={`w-full p-3 rounded-xl border text-xs font-bold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                >
                  {servicesList.map(s => (
                    <option key={s.id} value={s.title}>{s.title} ({s.price})</option>
                  ))}
                  <option value="Custom Software & AI Architecture">Custom Software & AI Architecture (Custom Quote)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Singh"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Estimated Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹45,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Project Goals & Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your goals, tech preferences, or desired launch timeline..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase text-white bg-[#00c853] hover:bg-[#00b047] active:scale-98 transition-all shadow-lg shadow-[#00c853]/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
