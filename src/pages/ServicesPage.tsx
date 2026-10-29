import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Palette,
  Film,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  FileText,
} from 'lucide-react';
import type { ServiceItem } from '../types/crm';

interface ServicesPageProps {
  services: ServiceItem[];
  darkMode: boolean;
  isAdmin?: boolean;
  onSelectServiceDetail: (slug: string) => void;
  onRequestServiceDirectly: (serviceTitle: string) => void;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Website & Full-Stack Development',
    description: 'High-performance React, Next.js, and Node.js web applications built for speed, SEO, and massive scalability.',
    category: 'Development',
    price: 'Starting from ₹45,000',
    icon: 'Globe',
    deliverables: ['Custom Responsive Web App', 'Supabase Database Integration', 'SEO & Core Web Vitals 95+', 'Automated CI/CD Pipeline'],
  },
  {
    id: 's2',
    title: 'UI/UX & Product Design',
    description: 'World-class interactive prototypes, Figma design systems, and conversion-focused user interfaces.',
    category: 'Design & Branding',
    price: 'Starting from ₹25,000',
    icon: 'Palette',
    deliverables: ['Complete Figma Prototype', 'Design System & Component Library', 'Mobile & Desktop Responsive Wireframes', 'Developer Handoff Spec'],
  },
  {
    id: 's3',
    title: 'Commercial Video & Reel Editing',
    description: 'Viral short-form Reels, YouTube video production, motion graphics, and corporate video post-production.',
    category: 'Video Production',
    price: 'Starting from ₹15,000',
    icon: 'Film',
    deliverables: ['4K Color Graded Master', 'Dynamic Motion Subtitles', 'Sound Design & SFX', 'Multi-Platform Aspect Ratios (9:16, 16:9)'],
  },
  {
    id: 's4',
    title: 'Corporate Brand Identity',
    description: 'Distinctive brand identities, typography guidelines, vector assets, and brand books that command authority.',
    category: 'Design & Branding',
    price: 'Starting from ₹30,000',
    icon: 'Sparkles',
    deliverables: ['Vector Logo Suite (Dark & Light)', 'Typography & Color Guidelines', 'Social Media Branding Kit', 'Stationery & Collateral Templates'],
  },
  {
    id: 's5',
    title: 'AI Workflows & LLM Automation',
    description: 'Custom AI agents, Gemini API integration, customer support chatbots, and autonomous document processing pipelines.',
    category: 'Development',
    price: 'Starting from ₹55,000',
    icon: 'Zap',
    deliverables: ['Custom LLM Assistant & Prompts', 'Database Vector Embeddings', 'Automated Webhook Workflows', 'Dashboard Analytics & Token Guard'],
  },
];

export function ServicesPage({
  services,
  darkMode,
  isAdmin = false,
  onSelectServiceDetail,
  onRequestServiceDirectly,
}: ServicesPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Development' | 'Design & Branding' | 'Video Production'>('All');

  const displayList = services && services.length > 0 ? services : DEFAULT_SERVICES;

  const filteredServices = displayList.filter(
    (s) => selectedFilter === 'All' || s.category === selectedFilter
  );

  return (
    <motion.div
      key="tab-services"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] font-black uppercase text-[#00c853] tracking-wider">
            SERVICES ECOSYSTEM
          </span>
          <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
            Specialized Digital Engineering & <span className="text-[#00c853]">Design Teams</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            Transparent milestone pricing, top 1% vetted Indian specialists, and guaranteed project delivery standards.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', 'Development', 'Design & Branding', 'Video Production'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-[#00c853] text-black shadow-md'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
              darkMode ? 'bg-[#18181b]/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00c853]/15 text-[#00c853] flex items-center justify-center font-bold">
                {service.icon === 'Palette' ? (
                  <Palette className="w-6 h-6" />
                ) : service.icon === 'Film' ? (
                  <Film className="w-6 h-6" />
                ) : service.icon === 'Zap' ? (
                  <Zap className="w-6 h-6" />
                ) : (
                  <Globe className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-black text-[#00c853] uppercase tracking-wider block">
                  {service.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 leading-tight">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Core Inclusions
                  </span>
                  {service.deliverables.slice(0, 4).map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00c853] shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Fixed Pricing</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{service.price}</span>
              </div>

              <button
                onClick={() => onRequestServiceDirectly(service.title)}
                className="py-2 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
              >
                <span>Request Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
export default ServicesPage;
