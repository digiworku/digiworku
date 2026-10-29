import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Check, Calculator, Sparkles, Send } from 'lucide-react';

interface QuotationBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onSendQuote: (quoteMessage: { title: string; formattedText: string; budget: string; timeline: string }) => void;
}

const AVAILABLE_SERVICES = [
  { id: 'web', name: 'Custom Website / Web App', basePrice: 45000, defaultWeeks: 3 },
  { id: 'mobile', name: 'Mobile App (iOS & Android)', basePrice: 75000, defaultWeeks: 5 },
  { id: 'design', name: 'UI/UX Design & Prototype', basePrice: 30000, defaultWeeks: 2 },
  { id: 'video', name: 'Commercial Video & Reel Editing', basePrice: 20000, defaultWeeks: 1 },
  { id: 'branding', name: 'Corporate Identity & Branding', basePrice: 25000, defaultWeeks: 2 },
  { id: 'ai', name: 'AI Workflows & LLM Integration', basePrice: 60000, defaultWeeks: 3 },
];

const ADDONS = [
  { id: 'seo', name: 'Enterprise SEO & Schema Setup', price: 15000 },
  { id: 'cms', name: 'Headless CMS Integration', price: 20000 },
  { id: 'speed', name: 'High-Performance Cloud CDN Optimization', price: 12000 },
  { id: 'support', name: '60 Days Dedicated Maintenance & SRE', price: 25000 },
];

export function QuotationBuilderModal({
  isOpen,
  onClose,
  darkMode,
  onSendQuote,
}: QuotationBuilderModalProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('web');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['seo']);
  const [customScope, setCustomScope] = useState<string>('End-to-end modern interface, responsive layout, SEO optimization, and live deployment.');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(3);
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  if (!isOpen) return null;

  const currentService = AVAILABLE_SERVICES.find((s) => s.id === selectedServiceId) || AVAILABLE_SERVICES[0];
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const subtotal = currentService.basePrice + addonsTotal;
  const discountAmount = Math.round((subtotal * customDiscount) / 100);
  const finalTotal = subtotal - discountAmount;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleGenerateAndSend = () => {
    const formattedPrice = `₹${finalTotal.toLocaleString('en-IN')}`;
    const selectedAddonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const formattedText = `📄 **[OFFICIAL CUSTOM QUOTATION — DIGIWORKU]**\n\n` +
      `• **Primary Service:** ${currentService.name}\n` +
      `• **Estimated Timeline:** ${timelineWeeks} Weeks\n` +
      `• **Deliverables & Scope:** ${customScope}\n` +
      (selectedAddonNames.length > 0 ? `• **Included Add-ons:**\n${selectedAddonNames.map((n) => `  - ${n}`).join('\n')}\n` : '') +
      `• **Total Investment:** ${formattedPrice}${customDiscount > 0 ? ` (Includes ${customDiscount}% special package discount)` : ''}\n\n` +
      `*This quotation is guaranteed for 14 days. Reply "ACCEPT" to lock sprint dates and commence resource allocation.*`;

    onSendQuote({
      title: `${currentService.name} Proposal`,
      formattedText,
      budget: formattedPrice,
      timeline: `${timelineWeeks} Weeks`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden my-8 ${
            darkMode ? 'bg-[#18181b] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00c853]/15 text-[#00c853] flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Interactive Quotation Builder</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Generate real parametric proposals</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Service Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Core Service Category
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  const s = AVAILABLE_SERVICES.find((serv) => serv.id === e.target.value);
                  if (s) setTimelineWeeks(s.defaultWeeks);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
              >
                {AVAILABLE_SERVICES.map((serv) => (
                  <option key={serv.id} value={serv.id}>
                    {serv.name} (Base: ₹{serv.basePrice.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Scope Details */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Scope of Work & Deliverables
              </label>
              <textarea
                value={customScope}
                onChange={(e) => setCustomScope(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
              />
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Optional Modules & Enhancements
              </label>
              <div className="space-y-1.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-[#00c853] border-[#00c853] text-black' : 'border-slate-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-semibold">{addon.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                        +₹{addon.price.toLocaleString('en-IN')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Timeline & Discount sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Timeline: <span className="text-[#00c853] font-bold">{timelineWeeks} Weeks</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={timelineWeeks}
                  onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                  className="w-full accent-[#00c853] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Discount: <span className="text-[#00c853] font-bold">{customDiscount}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(Number(e.target.value))}
                  className="w-full accent-[#00c853] cursor-pointer"
                />
              </div>
            </div>

            {/* Total Summary Box */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00c853] block">
                  Calculated Investment
                </span>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                <p>Est. Sprint: <strong>{timelineWeeks} Weeks</strong></p>
                <p>{selectedAddons.length} Add-on{selectedAddons.length === 1 ? '' : 's'} included</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleGenerateAndSend}
              className="w-full py-3 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>Send Dynamic Quotation to Client Chat</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default QuotationBuilderModal;
