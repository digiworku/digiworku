import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Globe,
  Palette,
  Film,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  BarChart3,
  Zap,
  Award,
  Star,
  Filter,
  Layers,
  ArrowUpRight,
  Building2,
  Calendar,
  MapPin,
  Code2,
  Workflow,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type CaseStudyCategory =
  | 'Web Apps'
  | 'Design'
  | 'Video'
  | 'Branding'
  | 'AI Automation';

export interface CaseStudyMetric {
  label: string;
  before?: string;
  after?: string;
  highlight?: string;
}

export interface WebAppCaseStudy {
  type: 'web-app';
  slug: string;
  clientName: string;
  headline: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  industry: string;
  location: string;
  techStack: string[];
  timeline: string;
  team: string;
  liveUrl?: string;
  keyResults: { label: string; value: string }[];
  clientDesc: string;
  challenges: string[];
  challengeImpact: string;
  approach: { phase: string; desc: string }[];
  features: { title: string; why: string }[];
  results: CaseStudyMetric[];
  resultsPeriod: string;
  quote: string;
  quoteName: string;
  quoteDesignation: string;
  isInternal?: boolean;
}

export interface DesignCaseStudy {
  type: 'design';
  slug: string;
  category: 'Design' | 'Video' | 'Branding';
  clientName: string;
  headline: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  industry: string;
  serviceLabel: string;
  deliverables: string[];
  timeline: string;
  brief: string;
  idea: string;
  workItems: string[];
  galleryUrls: string[];
  impact?: string[];
  quote: string;
  quoteName: string;
  quoteDesignation: string;
  isInternal?: boolean;
}

export interface AICaseStudy {
  type: 'ai-automation';
  slug: string;
  clientName: string;
  headline: string;
  thumbnailUrl: string;
  industry: string;
  teamSize: string;
  toolsUsed: string[];
  timeline: string;
  timeSaved: string;
  costSaved: string;
  fasterBy: string;
  manualSteps: string[];
  manualCost: { people: string; hours: string; responseTime: string; pain: string };
  capabilities: string[];
  safetyMeasures: string[];
  results: CaseStudyMetric[];
  payback: string;
  quote: string;
  quoteName: string;
  quoteDesignation: string;
  isInternal?: boolean;
}

export type CaseStudy = WebAppCaseStudy | DesignCaseStudy | AICaseStudy;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
export const CASE_STUDIES: CaseStudy[] = [
  {
    type: 'web-app',
    slug: 'digiworku-platform',
    clientName: 'DigiWorku (Internal)',
    headline: 'How we built our own AI-powered project management platform from scratch',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    industry: 'SaaS / Digital Workforce',
    location: 'India (Remote-first)',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Vercel', 'Gemini AI'],
    timeline: '6 weeks',
    team: '1 project lead, 2 frontend engineers, 1 UI designer',
    liveUrl: 'https://digiworku.in',
    keyResults: [
      { label: 'Admin task time reduced', value: '4 hrs/day → 45 min/day' },
      { label: 'Client inquiry response time', value: '6 hrs → Under 2 min (AI)' },
      { label: 'Platform Lighthouse score', value: '98 / 100 Performance' },
    ],
    clientDesc:
      'DigiWorku is an India-based digital workforce platform connecting businesses with dedicated engineering, design, marketing, and AI automation teams. This case study documents our own internal platform build — the same platform you are currently viewing.',
    challenges: [
      'No centralised project tracking — leads, projects, and client messages lived in separate tools',
      'Admin operations required 4+ hours of manual data entry and follow-up daily',
      'No public-facing portfolio or service showcase with a consistent brand presence',
    ],
    challengeImpact:
      'Fragmented tooling slowed delivery, created client communication gaps, and made it impossible to demonstrate credibility to prospective clients at scale.',
    approach: [
      { phase: 'Week 1–2 — Discovery & Planning', desc: 'Mapped all admin workflows, designed data schemas, planned component architecture and milestone tracker.' },
      { phase: 'Week 3–4 — Design & Prototype', desc: 'Built full design system (colors, typography, spacing), created wireframes for every screen, and ran internal feedback sessions.' },
      { phase: 'Week 5–6 — Engineering & Launch', desc: 'Built React SPA with Supabase backend, integrated Gemini AI for client chat, shipped to Vercel with SEO prerendering.' },
    ],
    features: [
      { title: 'AI Chat Hub', why: 'Gemini-powered assistant handles client support queries 24/7, reducing response lag from hours to seconds.' },
      { title: 'Kanban Project Pipeline', why: 'Real-time milestone tracking across all active client projects, visible to admins at a glance.' },
      { title: 'Portfolio & Case Studies', why: 'Admin can add, edit, and publish portfolio projects and case studies without developer involvement.' },
      { title: 'Supabase CRM', why: 'All inquiries, client data, and chat history synced to a managed PostgreSQL backend — no spreadsheets.' },
      { title: 'Rate-Limited Admin Auth', why: 'Secure server-side credential verification with brute-force protection and DDoS rate limiting.' },
    ],
    results: [
      { label: 'Admin manual task time', before: '4 hrs/day', after: '45 min/day' },
      { label: 'Client inquiry response time', before: '6 hrs avg', after: 'Under 2 min' },
      { label: 'Lighthouse Performance', before: '62', after: '98' },
      { label: 'Page load time', before: '6.8s', after: '1.4s' },
    ],
    resultsPeriod: 'First 30 days post-launch',
    quote:
      'Building our own platform was our best investment. We use it every single day and it pays for itself by converting inbound visitors into paying clients automatically.',
    quoteName: 'DigiWorku Team',
    quoteDesignation: 'Internal Build — Founders',
    isInternal: true,
  },
  {
    type: 'design',
    slug: 'placeholder-brand-identity',
    category: 'Branding',
    clientName: '[Client Name Pending Permission]',
    headline: 'A D2C brand identity built for rapid retail expansion',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    heroImageUrl:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    industry: 'Fast-Moving Consumer Goods',
    serviceLabel: 'Brand Identity',
    deliverables: ['Primary logo + 3 variations', 'Colour palette & typography system', '30 social media templates', 'Packaging vector files', '25-page brand guidelines PDF'],
    timeline: '3 weeks',
    brief:
      'A growing D2C brand expanding from regional e-commerce to modern retail outlets needed a cohesive, premium brand identity that felt local but looked international. Client permission for full disclosure is pending.',
    idea:
      'We anchored the visual identity in earthy, confident tones inspired by Indian artisan craft — avoiding generic "startup teal" in favour of a warm ochre and charcoal palette that photographs well on-shelf and on-feed.',
    workItems: [
      'Primary logo + wordmark + sub-mark',
      'Colour palette (HEX, CMYK, Pantone)',
      'Typography pairing guide',
      'Instagram post & story templates',
      'Product packaging vector mockups',
      '60-second brand reveal reel',
    ],
    galleryUrls: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=800&q=80',
    ],
    impact: [
      '[Real numbers will be added once client provides post-launch data]',
      'Brand deployed across packaging, social, and retail displays within 4 weeks of handoff',
    ],
    quote: '"[Quote pending client review and permission]"',
    quoteName: 'Client Representative',
    quoteDesignation: 'Founder, [Company Name]',
    isInternal: false,
  },
  {
    type: 'ai-automation',
    slug: 'placeholder-ai-automation',
    clientName: '[Business Name Pending Permission]',
    headline: 'An SME saves 25+ hours a week with an AI WhatsApp support assistant',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=600&q=80',
    industry: '[Industry — Pending Disclosure]',
    teamSize: '[X] employees',
    toolsUsed: ['Gemini API', 'WhatsApp Business API', 'Google Sheets', 'n8n', 'Supabase'],
    timeline: '3 weeks',
    timeSaved: '25+ hrs/week',
    costSaved: '[To be confirmed]',
    fasterBy: '95% faster response',
    manualSteps: [
      'Customer sends WhatsApp message with a query',
      'Staff reads message, manually looks up order/account status',
      'Staff types personalised reply — often hours later',
      'Complex or refund queries require manager escalation',
    ],
    manualCost: {
      people: '[X] staff members',
      hours: '[X] hours/day',
      responseTime: 'Average 4–6 hours',
      pain: 'Night-time and weekend queries went unanswered until next business day',
    },
    capabilities: [
      'Answers FAQ and order-status queries 24/7 without human involvement',
      'Supports Hindi, English, and Hinglish naturally',
      'Escalates complex queries to a human agent with full context summary',
      'Logs all interactions to Google Sheets for team review',
    ],
    safetyMeasures: [
      "All customer data remains in the client's own Google Workspace account",
      'Human approval required before issuing any refund or discount',
      'Sensitive queries (complaints, escalations) are always routed to humans',
    ],
    results: [
      { label: 'Avg. response time', before: '4–6 hours', after: 'Under 30 seconds' },
      { label: 'Queries handled without staff', before: '0%', after: '~78%' },
      { label: 'Staff hours on support', before: '[X hrs/week]', after: '[Confirmed post-launch]' },
    ],
    payback: '[Project cost recovered in X weeks — to be confirmed with client]',
    quote: '"[Quote pending client permission]"',
    quoteName: 'Business Owner',
    quoteDesignation: '[Designation], [Company]',
    isInternal: false,
  },
];

// ─────────────────────────────────────────────
// CATEGORY FILTER CONFIG
// ─────────────────────────────────────────────
const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Web Apps', value: 'Web Apps' },
  { label: 'Design', value: 'Design' },
  { label: 'Video', value: 'Video' },
  { label: 'Branding', value: 'Branding' },
  { label: 'AI Automation', value: 'AI Automation' },
];

function getCategoryFromStudy(cs: CaseStudy): CaseStudyCategory {
  if (cs.type === 'web-app') return 'Web Apps';
  if (cs.type === 'ai-automation') return 'AI Automation';
  return (cs as DesignCaseStudy).category;
}

function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'Web Apps': return <Globe className="w-3.5 h-3.5" />;
    case 'Design': return <Palette className="w-3.5 h-3.5" />;
    case 'Video': return <Film className="w-3.5 h-3.5" />;
    case 'Branding': return <Award className="w-3.5 h-3.5" />;
    case 'AI Automation': return <Sparkles className="w-3.5 h-3.5" />;
    default: return <Layers className="w-3.5 h-3.5" />;
  }
}

// ─────────────────────────────────────────────
// CASE STUDY CARD
// ─────────────────────────────────────────────
interface CaseStudyCardProps {
  cs: CaseStudy;
  darkMode: boolean;
  onClick: () => void;
}

function CaseStudyCard({ cs, darkMode, onClick }: CaseStudyCardProps) {
  const category = getCategoryFromStudy(cs);
  const catColors: Record<string, string> = {
    'Web Apps': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Design': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    'Video': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Branding': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'AI Automation': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  const catClass = catColors[category] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';

  let keyResult: { label: string; value: string } | null = null;
  if (cs.type === 'web-app') keyResult = cs.keyResults[0];
  else if (cs.type === 'ai-automation') keyResult = { label: 'Time saved', value: cs.timeSaved };
  else if ((cs as DesignCaseStudy).impact?.[0]) keyResult = { label: 'Impact', value: (cs as DesignCaseStudy).impact![0] };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group text-left w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-shadow"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={cs.thumbnailUrl}
          alt={cs.clientName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${catClass}`}>
          {getCategoryIcon(category)}
          {category.toUpperCase()}
        </span>
        {cs.isInternal && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            INTERNAL
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
            Read case study <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{cs.clientName}</p>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug mb-3 group-hover:text-[#00c853] dark:group-hover:text-[#00c853] transition-colors">
          {cs.headline}
        </h3>

        {keyResult && (
          <div className="flex items-center gap-2 mt-auto">
            <TrendingUp className="w-3.5 h-3.5 text-[#00c853] flex-shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{keyResult.value}</span>
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {cs.timeline}
          </div>
          <span className="text-xs font-semibold text-[#00c853] flex items-center gap-1">
            Read <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// SHARED UI HELPERS
// ─────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xs font-bold text-[#00c853] uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </section>
  );
}

function QuoteBlock({ quote, name, designation }: { quote: string; name: string; designation: string }) {
  return (
    <blockquote className="mt-8 bg-[#00c853]/5 border-l-4 border-[#00c853] rounded-r-xl pl-5 pr-4 py-5">
      <p className="text-sm italic text-slate-700 dark:text-slate-200 leading-relaxed">{quote}</p>
      <footer className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        — {name}, {designation}
      </footer>
    </blockquote>
  );
}

function CTABlock({ heading, onPrimary, primaryLabel }: { heading: string; onPrimary: () => void; primaryLabel: string }) {
  return (
    <div className="mt-12 bg-gradient-to-br from-[#00c853]/10 to-transparent border border-[#00c853]/20 rounded-2xl p-6 text-center">
      <p className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">{heading}</p>
      <button
        onClick={onPrimary}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00c853] text-white font-semibold text-sm hover:bg-[#00b047] transition-colors"
      >
        {primaryLabel} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ResultsTable({ results }: { results: CaseStudyMetric[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#222]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Metric</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Before</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#00c853]">After</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
              <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 font-medium">{r.label}</td>
              <td className="px-4 py-3 text-xs text-slate-400">{r.before}</td>
              <td className="px-4 py-3 text-xs font-bold text-[#00c853]">{r.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL PAGE — WEB APP
// ─────────────────────────────────────────────
function WebAppDetail({ cs, darkMode, onBack, onCTA }: { cs: WebAppCaseStudy; darkMode: boolean; onBack: () => void; onCTA: () => void }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00c853] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Case Studies
      </button>

      {cs.isInternal && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
          <Star className="w-3.5 h-3.5" />
          This is an internal DigiWorku project, not a client engagement.
        </div>
      )}

      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 mb-3">
        <Globe className="w-3.5 h-3.5" /> WEB APP DEVELOPMENT
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
        {cs.clientName}: {cs.headline}
      </h1>

      <div className="mt-5 rounded-2xl overflow-hidden h-64 md:h-80">
        <img src={cs.heroImageUrl} alt={cs.clientName} className="w-full h-full object-cover" />
      </div>

      <section className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { icon: <Building2 className="w-4 h-4" />, label: 'Industry', val: cs.industry },
          { icon: <MapPin className="w-4 h-4" />, label: 'Location', val: cs.location },
          { icon: <Calendar className="w-4 h-4" />, label: 'Timeline', val: cs.timeline },
          { icon: <Users className="w-4 h-4" />, label: 'Team', val: cs.team },
          { icon: <Code2 className="w-4 h-4" />, label: 'Tech Stack', val: cs.techStack.join(', ') },
          ...(cs.liveUrl ? [{ icon: <ExternalLink className="w-4 h-4" />, label: 'Live Link', val: cs.liveUrl, href: cs.liveUrl }] : []),
        ].map((item: any, i) => (
          <div key={i} className="bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[#00c853] mb-1">{item.icon}<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.label}</span></div>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline truncate block">{item.val}</a>
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.val}</p>
            )}
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-bold text-[#00c853] uppercase tracking-wider mb-4">Key Results</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {cs.keyResults.map((r, i) => (
            <div key={i} className="bg-gradient-to-br from-[#00c853]/10 to-transparent border border-[#00c853]/20 rounded-xl p-4">
              <p className="text-xl font-extrabold text-[#00c853]">{r.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section title="1. The Client">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cs.clientDesc}</p>
      </Section>

      <Section title="2. The Challenge">
        <ul className="space-y-2 mb-4">
          {cs.challenges.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              {c}
            </li>
          ))}
        </ul>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-400 mb-1">Why it mattered</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{cs.challengeImpact}</p>
        </div>
      </Section>

      <Section title="3. Our Approach">
        <div className="space-y-3">
          {cs.approach.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00c853]/10 text-[#00c853] flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{a.phase}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="4. What We Built">
        <ul className="space-y-3">
          {cs.features.map((f, i) => (
            <li key={i} className="flex gap-3 bg-slate-50 dark:bg-[#222] rounded-xl p-3 border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.why}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5. The Results">
        <ResultsTable results={cs.results} />
        <p className="text-xs text-slate-400 mt-2">Measured over: {cs.resultsPeriod}</p>
      </Section>

      <QuoteBlock quote={cs.quote} name={cs.quoteName} designation={cs.quoteDesignation} />
      <CTABlock heading="Planning a similar web app?" onPrimary={onCTA} primaryLabel="Get a proposal in 24 hours" />
    </article>
  );
}

// ─────────────────────────────────────────────
// DETAIL PAGE — DESIGN / BRANDING / VIDEO
// ─────────────────────────────────────────────
function DesignDetail({ cs, darkMode, onBack, onCTA }: { cs: DesignCaseStudy; darkMode: boolean; onBack: () => void; onCTA: () => void }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00c853] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Case Studies
      </button>

      {!cs.isInternal && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
          <Star className="w-3.5 h-3.5" /> Client permission pending — details anonymised.
        </div>
      )}

      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-3">
        <Palette className="w-3.5 h-3.5" /> {cs.category.toUpperCase()}
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
        {cs.clientName}: {cs.headline}
      </h1>

      <div className="mt-5 rounded-2xl overflow-hidden h-64 md:h-96">
        <img src={cs.heroImageUrl} alt={cs.clientName} className="w-full h-full object-cover" />
      </div>

      <section className="mt-8 grid grid-cols-2 gap-3">
        {[
          { label: 'Client', val: cs.clientName },
          { label: 'Industry', val: cs.industry },
          { label: 'Service', val: cs.serviceLabel },
          { label: 'Timeline', val: cs.timeline },
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.val}</p>
          </div>
        ))}
        <div className="col-span-2 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-1">Deliverables</p>
          <div className="flex flex-wrap gap-1.5">
            {cs.deliverables.map((d, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">{d}</span>
            ))}
          </div>
        </div>
      </section>

      <Section title="The Brief">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cs.brief}</p>
      </Section>

      <Section title="The Idea">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{cs.idea}</p>
      </Section>

      <Section title="The Work">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {cs.galleryUrls.map((url, i) => (
            <div key={i} className="rounded-xl overflow-hidden h-36 md:h-48">
              <img src={url} alt={`Work sample ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <ul className="space-y-2">
          {cs.workItems.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> {item}
            </li>
          ))}
        </ul>
      </Section>

      {cs.impact && cs.impact.length > 0 && (
        <Section title="The Impact">
          <ul className="space-y-2">
            {cs.impact.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                <TrendingUp className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <QuoteBlock quote={cs.quote} name={cs.quoteName} designation={cs.quoteDesignation} />
      <CTABlock heading="Need a brand that stands out?" onPrimary={onCTA} primaryLabel="See design packages" />
    </article>
  );
}

// ─────────────────────────────────────────────
// DETAIL PAGE — AI AUTOMATION
// ─────────────────────────────────────────────
function AIDetail({ cs, darkMode, onBack, onCTA }: { cs: AICaseStudy; darkMode: boolean; onBack: () => void; onCTA: () => void }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00c853] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Case Studies
      </button>

      {!cs.isInternal && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
          <Star className="w-3.5 h-3.5" /> Client permission pending — details anonymised.
        </div>
      )}

      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-3">
        <Sparkles className="w-3.5 h-3.5" /> AI AUTOMATION
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
        {cs.headline}
      </h1>

      <section className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: <Clock className="w-5 h-5" />, val: cs.timeSaved, label: 'time saved' },
          { icon: <BarChart3 className="w-5 h-5" />, val: cs.costSaved, label: 'cost saved' },
          { icon: <Zap className="w-5 h-5" />, val: cs.fasterBy, label: 'response speed' },
        ].map((m, i) => (
          <div key={i} className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-4 text-center">
            <div className="text-[#00c853] mb-2 flex justify-center">{m.icon}</div>
            <p className="text-lg font-extrabold text-[#00c853]">{m.val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
          </div>
        ))}
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3">
        {[
          { label: 'Client', val: cs.clientName },
          { label: 'Industry', val: cs.industry },
          { label: 'Team Size', val: cs.teamSize },
          { label: 'Timeline', val: cs.timeline },
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.val}</p>
          </div>
        ))}
        <div className="col-span-2 bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-1">Tools Used</p>
          <div className="flex flex-wrap gap-1.5">
            {cs.toolsUsed.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <Section title="The Manual Problem">
        <div className="space-y-2 mb-4">
          {cs.manualSteps.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              <p className="text-sm text-slate-600 dark:text-slate-300">{s}</p>
            </div>
          ))}
        </div>
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-red-400 font-semibold">Staff involved</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{cs.manualCost.people}</p>
          </div>
          <div>
            <p className="text-xs text-red-400 font-semibold">Time spent</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{cs.manualCost.hours}</p>
          </div>
          <div>
            <p className="text-xs text-red-400 font-semibold">Response time</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{cs.manualCost.responseTime}</p>
          </div>
          <div>
            <p className="text-xs text-red-400 font-semibold">Key pain</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{cs.manualCost.pain}</p>
          </div>
        </div>
      </Section>

      <Section title="The Automated Solution">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs text-slate-500 dark:text-slate-400">
          {['Customer message', 'AI Assistant', 'Checks system', 'Instant reply', 'Human escalation (if needed)'].map((step, i, arr) => (
            <React.Fragment key={i}>
              <span className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#222] border border-slate-200 dark:border-slate-700 font-medium">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-[#00c853]" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-400 mb-2">What it does</p>
            <ul className="space-y-2">
              {cs.capabilities.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-400 mb-2">What we were careful about</p>
            <ul className="space-y-2">
              {cs.safetyMeasures.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Workflow className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Results">
        <ResultsTable results={cs.results} />
        <p className="text-xs text-slate-400 mt-2">Payback period: {cs.payback}</p>
      </Section>

      <QuoteBlock quote={cs.quote} name={cs.quoteName} designation={cs.quoteDesignation} />
      <CTABlock heading="Which task is eating up your team's time?" onPrimary={onCTA} primaryLabel="Get a free automation audit" />
    </article>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export interface CaseStudiesProps {
  darkMode: boolean;
  activeSlug: string | null;
  onNavigateToSlug: (slug: string) => void;
  onBackToListing: () => void;
  onCTA: () => void;
}

export function CaseStudies({ darkMode, activeSlug, onNavigateToSlug, onBackToListing, onCTA }: CaseStudiesProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (activeSlug) {
    const cs = CASE_STUDIES.find(c => c.slug === activeSlug);
    if (!cs) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
          <Layers className="w-10 h-10 text-slate-300" />
          <p className="text-sm text-slate-500">Case study not found.</p>
          <button onClick={onBackToListing} className="text-sm text-[#00c853] hover:underline">← Back to Case Studies</button>
        </div>
      );
    }
    if (cs.type === 'web-app') return <WebAppDetail cs={cs} darkMode={darkMode} onBack={onBackToListing} onCTA={onCTA} />;
    if (cs.type === 'design') return <DesignDetail cs={cs} darkMode={darkMode} onBack={onBackToListing} onCTA={onCTA} />;
    if (cs.type === 'ai-automation') return <AIDetail cs={cs} darkMode={darkMode} onBack={onBackToListing} onCTA={onCTA} />;
  }

  const filtered = CASE_STUDIES.filter(cs => {
    if (activeFilter === 'all') return true;
    return getCategoryFromStudy(cs) === activeFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00c853] mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> CASE STUDIES
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Real projects. Real results.
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Detailed breakdowns of what we built, how we built it, and the outcome — with verified numbers only. No inflated claims, no invented metrics.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeFilter === cat.value
                ? 'bg-[#00c853] text-white border-[#00c853]'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#00c853]/50'
            }`}
          >
            {cat.value !== 'all' && getCategoryIcon(cat.value)}
            {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl"
          >
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No case studies in this category yet.</p>
            <p className="text-xs text-slate-400 mt-1">Check back soon or{' '}
              <button onClick={() => setActiveFilter('all')} className="text-[#00c853] underline">view all</button>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map(cs => (
              <CaseStudyCard
                key={cs.slug}
                cs={cs}
                darkMode={darkMode}
                onClick={() => onNavigateToSlug(cs.slug)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-xs text-slate-400 mb-3">
          We only publish case studies with genuine client permission and verified numbers.
          Placeholders are clearly marked and will be updated as permissions are confirmed.
        </p>
        <button onClick={onCTA} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00c853] hover:underline">
          Start a project with us <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
