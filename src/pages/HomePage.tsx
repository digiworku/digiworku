import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  UserPlus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Globe,
  Clock,
  MessageSquare,
} from 'lucide-react';
import type { LegalPageSlug } from '../components/LegalPages';

interface HomePageProps {
  darkMode: boolean;
  onRequestService: (serviceTitle: string) => void;
  onOpenFreelancerModal: () => void;
  onNavigateToTab: (tab: string) => void;
  onNavigateToLegal: (slug: LegalPageSlug) => void;
  onNavigateToFounder: () => void;
}

export function HomePage({
  darkMode,
  onRequestService,
  onOpenFreelancerModal,
  onNavigateToTab,
  onNavigateToLegal,
  onNavigateToFounder,
}: HomePageProps) {
  return (
    <motion.div
      key="tab-home"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex-1 px-4 md:px-8 py-4 space-y-8 max-w-7xl mx-auto w-full"
    >
      {/* ── HERO SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mx-auto pt-2">
        {/* Left Column Text Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/45 border border-[#00c853]/20 text-xs font-bold text-[#00c853]">
            <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
            <span>India's Top 1% Digital Talent</span>
          </div>

          <h1
            className={`text-4xl md:text-5xl lg:text-5.5xl font-black tracking-tight leading-[1.08] ${
              darkMode ? 'text-white' : 'text-[#00311F]'
            }`}
          >
            Top IT & AI Ecosystem in India: Build Faster With{' '}
            <span className="text-[#00c853] underline decoration-[#00c853]/20 decoration-wavy">
              DigiWorku
            </span>
          </h1>

          <p
            className={`text-sm md:text-base leading-relaxed max-w-xl font-medium ${
              darkMode ? 'text-slate-400' : 'text-[#00311F]/75'
            }`}
          >
            India's Digital Workforce Platform for Startups, Businesses & Creators. Scale your operations with
            specialized teams built for speed and engineered for outstanding growth.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1.5">
            <button
              id="start-project-hero-btn"
              onClick={() => onRequestService('Custom Project Build')}
              className="bg-[#00c853] hover:bg-[#00b047] active:scale-95 text-black px-7 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-xl shadow-[#00c853]/20 cursor-pointer flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="join-us-hero-btn"
              onClick={onOpenFreelancerModal}
              className="bg-[#00311F] hover:bg-[#002517] dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 dark:text-emerald-300 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Join Us (Freelancer)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Project Dashboard Preview Card */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1.5 bg-[#00c853] rounded-3xl opacity-[0.06] blur-xl" />

          <div
            className={`p-6 rounded-2xl border transition-all shadow-xl relative ${
              darkMode ? 'bg-[#202020]/90 border-slate-700/80' : 'bg-white border-slate-200'
            }`}
          >
            <div className="mb-5 rounded-xl overflow-hidden h-40 relative group border border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=75"
                alt="Tech Agency Team Collaboration"
                className="w-full h-full object-cover group-hover:scale-102 duration-300 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[10px] font-black text-white bg-[#00c853] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  DigiWorku Tech Hub
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">Active Production Sprints</span>
                <span className="text-[#00c853] font-bold">100% On-Time SLA</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-[#00c853] h-full rounded-full w-[94%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Verified Milestones: <strong>500+ Delivered</strong></span>
                <span>Avg Rating: <strong>4.9 / 5.0</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
        {[
          { label: 'Projects Delivered', value: '200+', icon: <Layers className="w-4 h-4 text-[#00c853]" /> },
          { label: 'Client Satisfaction', value: '4.9/5', icon: <Award className="w-4 h-4 text-amber-500" /> },
          { label: 'On-Time Velocity', value: '99.8%', icon: <Clock className="w-4 h-4 text-blue-500" /> },
          { label: 'Intellectual Property', value: '100% Client Owned', icon: <ShieldCheck className="w-4 h-4 text-purple-500" /> },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border text-center space-y-1 ${
              darkMode ? 'bg-[#18181b]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              {stat.icon}
              <span className="font-bold">{stat.label}</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── RICH SEO/AEO/GEO CONTENT SECTION ── */}
      <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#142318] border-[#00c853]/20' : 'bg-[#f0fff7] border-[#00c853]/15'
          }`}
        >
          <p className={`text-sm leading-relaxed font-semibold ${darkMode ? 'text-slate-300' : 'text-[#00311F]/80'}`}>
            <span className="font-black text-[#00c853]">Summary: </span>
            DigiWorku is India's digital workforce and AI ecosystem platform that connects startups, enterprises,
            and creators with dedicated engineering, UI/UX design, video production, branding, and AI automation
            teams — all managed in a single secure workspace. Projects start from ₹8,000 with transparent
            milestone-based pricing.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className={`text-xl font-black mb-3 ${darkMode ? 'text-white' : 'text-[#030712]'}`}>
              What is DigiWorku?
            </h2>
            <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              DigiWorku is a digital workforce platform based in India that gives businesses access to dedicated
              teams of engineers, designers, video editors, and AI specialists. Unlike traditional freelance
              marketplaces, DigiWorku provides fully managed, vetted teams that work exclusively on your project
              with real-time milestone tracking, direct communication, and guaranteed delivery standards.
            </p>
            <ul className={`text-sm space-y-1.5 list-none pl-0 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {[
                '200+ projects delivered across India, UAE, UK, and the USA',
                'Top 1% vetted engineers, designers, and AI specialists',
                'Milestone-based pricing starting from ₹8,000',
                'Real-time project dashboards and direct team communication',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-[#00c853]/15 text-[#00c853] flex items-center justify-center text-[9px] font-black">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-black mb-3 ${darkMode ? 'text-white' : 'text-[#030712]'}`}>
              What services does DigiWorku offer?
            </h2>
            <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              DigiWorku covers every digital service a modern business needs. Our core service categories include:
            </p>
            <ul className={`text-sm space-y-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {[
                ['Website & Web App Development', 'Custom React, Next.js, and Node.js web applications from ₹45,000'],
                ['UI/UX Graphic Design', 'Social media graphics, pitch decks, and branding kits from ₹8,000'],
                ['Video Editing & Production', 'YouTube, Reels, and corporate video post-production from ₹12,500'],
                ['Brand Identity & Branding', 'Complete logo, guidelines, and brand systems from ₹30,000'],
                ['AI Automation & Engineering', 'Custom AI chatbots, workflow automation, and system integration'],
              ].map(([t, desc], i) => (
                <li key={i} className="flex items-start gap-2 list-none">
                  <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-[#00c853]/15 text-[#00c853] flex items-center justify-center text-[9px] font-black">
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-bold">{t}</span> — {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-black mb-4 ${darkMode ? 'text-white' : 'text-[#030712]'}`}>
              Explore DigiWorku
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Our Services', tab: 'services', desc: 'Browse all digital services' },
                { label: 'Client Portfolio', tab: 'portfolio', desc: 'View completed projects' },
                { label: 'Client Reviews', tab: 'reviews', desc: 'Verified testimonials' },
              ].map(({ label, tab, desc }) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onNavigateToTab(tab)}
                  className={`p-3.5 rounded-xl border transition-all group block text-left hover:border-[#00c853] cursor-pointer ${
                    darkMode
                      ? 'bg-[#18181b] border-slate-800 hover:bg-[#00c853]/5'
                      : 'bg-white border-slate-200 hover:bg-[#f0fff7] shadow-xs'
                  }`}
                >
                  <span
                    className={`block text-xs font-black group-hover:text-[#00c853] transition-colors ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="block text-[10px] mt-0.5 text-slate-500">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER WITH COMPREHENSIVE LEGAL & FOUNDER LINKS ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-8 pb-10 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <button
              onClick={onNavigateToFounder}
              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00c853] cursor-pointer"
            >
              👤 Meet the Founder
            </button>
            {([
              ['privacy-policy', 'Privacy Policy'],
              ['terms-of-service', 'Terms of Service'],
              ['cookie-policy', 'Cookie Policy'],
              ['refund-policy', 'Refund Policy'],
              ['cancellation-policy', 'Cancellation Policy'],
              ['disclaimer', 'Disclaimer'],
              ['acceptable-use-policy', 'Acceptable Use'],
              ['security-policy', 'Security'],
              ['responsible-disclosure', 'Responsible Disclosure'],
              ['help-center', 'Help Center'],
            ] as [LegalPageSlug, string][]).map(([slug, label]) => (
              <button
                key={slug}
                onClick={() => onNavigateToLegal(slug)}
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00c853] cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-medium">
            © {new Date().getFullYear()} DigiWorku Technologies. All rights reserved. • Registered Entity: DigiWorku, New Delhi, India • IT Act 2000 & DPDP Act 2023 Compliant
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
export default HomePage;
