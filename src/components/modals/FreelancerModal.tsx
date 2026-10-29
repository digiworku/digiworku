import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '../../supabase';

interface FreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onSuccessToast?: (msg: string) => void;
}

const freelancerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  skill: z.string().min(1, 'Please select your primary skill'),
  portfolio: z.string().optional(),
  bio: z.string().min(10, 'Please provide a brief bio of your experience (minimum 10 characters)').max(1500),
  dpdpConsent: z.boolean().refine((val) => val === true, 'Consent under DPDP Act 2023 is required'),
});

export function FreelancerModal({
  isOpen,
  onClose,
  darkMode,
  onSuccessToast,
}: FreelancerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [skill, setSkill] = useState('Full Stack Developer (React / Node / Next.js)');
  const [portfolio, setPortfolio] = useState('');
  const [bio, setBio] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (honeypot.trim().length > 0) {
      onClose();
      return;
    }

    const result = freelancerSchema.safeParse({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      skill,
      portfolio: portfolio.trim(),
      bio: bio.trim(),
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
      const portfolioUrl = portfolio.trim()
        ? (portfolio.trim().startsWith('http') ? portfolio.trim() : `https://${portfolio.trim()}`)
        : 'N/A';
      const summaryText = `Skill: ${skill} | Portfolio: ${portfolioUrl} | Bio: ${bio.trim()}`;

      const payload = {
        name: `${name.trim()} (Freelancer Candidate)`,
        email: email.trim(),
        mobile: mobile.trim(),
        service: `Talent Network: ${skill}`,
        budget: 'Talent Pool Candidate',
        message: summaryText,
        dpdp_consent: true,
        status: 'new',
      };

      const { error: dbError } = await supabase.from('inquiries').insert(payload);

      if (dbError) {
        throw new Error(dbError.message || 'Database rejected submission. Please try again.');
      }

      // Dispatch alert
      try {
        await fetch('/api/notify-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (alertErr) {
        console.warn('Notification alert issue:', alertErr);
      }

      setName('');
      setEmail('');
      setMobile('');
      setPortfolio('');
      setBio('');
      setIsSubmitting(false);
      onClose();

      if (onSuccessToast) {
        onSuccessToast('🎉 Talent network application submitted! Our team will review your profile.');
      }
    } catch (err: any) {
      console.error('Freelancer submission failure:', err);
      setIsSubmitting(false);
      setServerError(err.message || 'Failed to submit application. Please email hello@digiworku.in');
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
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Join DigiWorku Talent Network</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Collaborate on enterprise digital projects</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="candidate_hp"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vir Kanwlia"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                  validationErrors.name ? 'border-red-500 bg-red-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                }`}
              />
              {validationErrors.name && <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    validationErrors.email ? 'border-red-500 bg-red-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                  }`}
                />
                {validationErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                    validationErrors.mobile ? 'border-red-500 bg-red-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                  }`}
                />
                {validationErrors.mobile && <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.mobile}</p>}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Primary Skill Specialization *</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
              >
                <option value="Full Stack Developer (React / Node / Next.js)">Full Stack Developer (React / Node / Next.js)</option>
                <option value="UI/UX Designer (Figma / Prototyping)">UI/UX Designer (Figma / Prototyping)</option>
                <option value="Commercial Video Editor (Premiere / After Effects)">Commercial Video Editor (Premiere / After Effects)</option>
                <option value="Python AI / LLM Engineer">Python AI / LLM Engineer</option>
                <option value="Growth Marketer & SEO Specialist">Growth Marketer & SEO Specialist</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Portfolio or GitHub Link</label>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://github.com/yourusername or portfolio URL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Summary of Experience & Achievements *</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Highlight your key projects, years of experience, and tech stack proficiency..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                  validationErrors.bio ? 'border-red-500 bg-red-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-[#00c853]'
                }`}
              />
              {validationErrors.bio && <p className="text-[10px] text-red-500 font-bold mt-1">{validationErrors.bio}</p>}
            </div>

            {/* DPDP Act 2023 Explicit Consent */}
            <div>
              <label className="flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded accent-[#00c853]"
                />
                <span>
                  I consent to DigiWorku processing my candidate details for vetting and project engagement pursuant to the{' '}
                  <strong className="text-slate-900 dark:text-white">DPDP Act 2023</strong>.
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
              {isSubmitting ? <span>Submitting Application...</span> : <><Send className="w-4 h-4" /><span>Submit Freelancer Application</span></>}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default FreelancerModal;
