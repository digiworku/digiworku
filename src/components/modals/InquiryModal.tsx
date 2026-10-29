import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertCircle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '../../supabase';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  preselectedService?: string;
  onSuccessToast?: (msg: string) => void;
}

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid business email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Please describe your project scope (minimum 10 characters)').max(2000),
  dpdpConsent: z.boolean().refine((val) => val === true, 'Consent under DPDP Act 2023 is required to process your request'),
});

export function InquiryModal({
  isOpen,
  onClose,
  darkMode,
  preselectedService,
  onSuccessToast,
}: InquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [service, setService] = useState(preselectedService || 'Website Development');
  const [budget, setBudget] = useState('₹45,000 - ₹1,00,000');
  const [message, setMessage] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Bot detection: if hidden honeypot is populated, drop silently
    if (honeypot.trim().length > 0) {
      console.warn('[Bot protection] Dropped automated bot submission.');
      onClose();
      return;
    }

    // Zod validation
    const result = inquirySchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      service: service.trim(),
      budget,
      message: message.trim(),
      dpdpConsent,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errMap[issue.path[0].toString()] = issue.message;
        }
      });
      setValidationErrors(errMap);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      const inquiryId = `inq-${Date.now()}`;
      const payload = {
        name: result.data.name,
        email: result.data.email,
        mobile: result.data.mobile,
        service: result.data.service,
        budget: result.data.budget || 'Not specified',
        message: result.data.message,
        dpdp_consent: true,
        status: 'new',
      };

      // 1. Insert into Supabase inquiries table
      const { error: dbError } = await supabase.from('inquiries').insert(payload);

      if (dbError) {
        throw new Error(dbError.message || 'Database rejected lead insertion. Please check your network.');
      }

      // 2. Dispatch instant alert to Admin via backend webhook endpoint
      try {
        await fetch('/api/notify-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (alertErr) {
        console.warn('Webhook notification dispatch warning:', alertErr);
      }

      // 3. Reset form & close
      setName('');
      setEmail('');
      setMobile('');
      setMessage('');
      setIsSubmitting(false);
      onClose();

      if (onSuccessToast) {
        onSuccessToast('🎉 Project inquiry submitted successfully! Our lead architect will contact you within 2 hours.');
      }
    } catch (err: any) {
      console.error('Inquiry submission failure:', err);
      setIsSubmitting(false);
      setServerError(err.message || 'Failed to submit inquiry. Please try again or email hello@digiworku.in directly.');
    }
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
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Request Custom Proposal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive guaranteed fixed-price estimate</p>
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
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Anti-Bot Honeypot (hidden from human visitors) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {serverError && (
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                  validationErrors.name
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                }`}
              />
              {validationErrors.name && (
                <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    validationErrors.email
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    validationErrors.mobile
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                  }`}
                />
                {validationErrors.mobile && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.mobile}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Target Service *
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                >
                  <option value="Website Development">Website Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Graphic & UI/UX Design">Graphic & UI/UX Design</option>
                  <option value="Commercial Video Editing">Commercial Video Editing</option>
                  <option value="Corporate Branding">Corporate Branding</option>
                  <option value="AI Automation & Agents">AI Automation & Agents</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Estimated Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                >
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                  <option value="₹2,50,000+ (Enterprise)">₹2,50,000+ (Enterprise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Project Scope & Deliverables *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Describe your requirements, goals, references, or timeline expectations..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                  validationErrors.message
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                }`}
              />
              {validationErrors.message && (
                <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.message}</p>
              )}
            </div>

            {/* DPDP Act 2023 Explicit Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded accent-[#00c853]"
                />
                <span>
                  I consent to DigiWorku processing my submitted contact information in accordance with the{' '}
                  <strong className="text-slate-900 dark:text-white">Digital Personal Data Protection Act 2023 (DPDP)</strong>{' '}
                  for project communication and quotation generation.
                </span>
              </label>
              {validationErrors.dpdpConsent && (
                <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.dpdpConsent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Proposal Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry & Alert Lead Architect</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default InquiryModal;
