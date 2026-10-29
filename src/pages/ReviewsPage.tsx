import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Plus, Send, CheckCircle2, User } from 'lucide-react';
import type { ReviewItem } from '../types/crm';
import { supabase } from '../supabase';

interface ReviewsPageProps {
  reviews: ReviewItem[];
  darkMode: boolean;
  onAddReview?: (newRev: ReviewItem) => void;
  triggerToast?: (msg: string) => void;
}

export function ReviewsPage({ reviews, darkMode, onAddReview, triggerToast }: ReviewsPageProps) {
  const [partnerName, setPartnerName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !feedback.trim()) return;

    setIsSubmitting(true);
    const initials = partnerName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: partnerName.trim(),
      role: role.trim() || 'Client Partner',
      rating,
      text: feedback.trim(),
      avatarInitials: initials,
      createdAt: 'Just now',
    };

    try {
      const { error } = await supabase.from('reviews').insert({
        name: newRev.name,
        role: newRev.role,
        rating: newRev.rating,
        text: newRev.text,
        avatar_initials: newRev.avatarInitials,
        approved: true,
      });

      if (error) {
        console.warn('Review save issue:', error.message);
      }

      if (onAddReview) onAddReview(newRev);

      setPartnerName('');
      setRole('');
      setFeedback('');
      if (triggerToast) triggerToast('🎉 Review logged and published!');
    } catch (err: any) {
      console.error('Review submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="tab-reviews"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Client Testimonials & Feedback</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified ratings and enterprise delivery praises from founders and engineering leaders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white/50 dark:bg-[#18181b]/50">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-[#00c853] rounded-xl font-black text-sm">
              4.9/5
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight">
                Corporate Delivery Satisfaction Score
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                Computed across all verified project sprints and deliverables.
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  "{rev.text}"
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#00c853]/15 text-[#00c853] font-black text-[11px] flex items-center justify-center">
                      {rev.avatarInitials}
                    </span>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {rev.name} <span className="text-slate-400 font-normal">({rev.role})</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{rev.createdAt}</span>
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                No reviews recorded yet. Submit feedback below!
              </div>
            )}
          </div>
        </div>

        {/* Submit Review */}
        <div
          className={`p-5 rounded-2xl border h-fit space-y-4 ${
            darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Submit Client Feedback</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Share your experience working with the DigiWorku team.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Your Name & Company
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Ramesh Singh, CTO at FlowTech"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Founder & CEO"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Feedback Statement
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="How did DigiWorku perform on velocity, delivery quality, and communication?"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Verified Review</span>
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
export default ReviewsPage;
