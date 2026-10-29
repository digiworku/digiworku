import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Phone, Calendar, Clock, X, ExternalLink, Check, Copy } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  clientName?: string;
  clientEmail?: string;
}

export function MeetingModal({
  isOpen,
  onClose,
  darkMode,
  clientName = 'Client',
}: MeetingModalProps) {
  const [meetingType, setMeetingType] = useState<'video' | 'voice'>('video');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('14:00');
  const [topic, setTopic] = useState<string>('Project Scope & Discovery Call');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const instantMeetUrl = 'https://meet.google.com/new';
  const directPhone = '+919521207156';

  const handleCopyMeetLink = () => {
    navigator.clipboard.writeText(instantMeetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
            darkMode ? 'bg-[#18181b] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00c853]/15 text-[#00c853] flex items-center justify-center font-bold">
                {meetingType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base">Direct Consultation Call</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connect with DigiWorku Engineering Lead</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setMeetingType('video')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  meetingType === 'video'
                    ? 'bg-[#00c853] text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Google Meet Video</span>
              </button>
              <button
                type="button"
                onClick={() => setMeetingType('voice')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  meetingType === 'voice'
                    ? 'bg-[#00c853] text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Direct Voice Call</span>
              </button>
            </div>

            {meetingType === 'video' ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-700 dark:text-emerald-300">
                  <p className="font-bold mb-1">⚡ Instant Video Conference Room</p>
                  <p className="text-[11px] leading-relaxed">
                    Launch a high-definition Google Meet session with end-to-end encryption. You can share your screen, inspect prototypes, or discuss scope.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discussion Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Design review, Architecture discussion"
                    className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href={instantMeetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Launch Google Meet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyMeetLink}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    title="Copy Meeting URL"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[#00c853]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
                  <p className="font-bold mb-1 text-slate-800 dark:text-slate-200">Direct Founder & Lead Line</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Call our direct engineering desk directly on mobile or WhatsApp voice.
                  </p>
                  <p className="text-sm font-black text-[#00c853] mt-2 tracking-wide">+91 95212 07156</p>
                </div>

                <a
                  href={`tel:${directPhone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {directPhone}</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default MeetingModal;
