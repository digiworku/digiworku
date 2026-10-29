import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket } from 'lucide-react';

interface FounderPageProps {
  darkMode: boolean;
  onOpenServiceRequestModal: () => void;
  onBack?: () => void;
}

export function FounderPage({ darkMode, onOpenServiceRequestModal, onBack }: FounderPageProps) {
  return (
    <motion.div
      key="tab-founder"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`founder-page w-full min-h-screen overflow-y-auto overflow-x-hidden ${
        darkMode
          ? 'founder-page-dark bg-gradient-to-br from-slate-950 via-[#0a120a] to-slate-950 text-white'
          : 'founder-page-light bg-gradient-to-br from-[#fffdf0] via-[#f7f3e8] to-[#fffdf0] text-slate-900'
      }`}
    >
      <div className="min-h-screen w-full">
        {onBack && (
          <div className="max-w-5xl mx-auto px-6 pt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00c853] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Platform</span>
            </button>
          </div>
        )}

        {/* ── HERO SECTION ── */}
        <div className="relative w-full overflow-hidden pt-0">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00c853]/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-16 flex flex-col lg:flex-row items-center gap-12">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex-shrink-0 relative"
            >
              <div className="w-52 h-52 lg:w-64 lg:h-64 rounded-2xl overflow-hidden ring-4 ring-[#00c853]/40 shadow-[0_0_60px_rgba(0,200,83,0.2)]">
                <img
                  src="/founder-vir.jpg"
                  alt="Vir — Founder & CEO of DigiWorku"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00c853] text-black text-[10px] font-black shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                FOUNDER & CEO
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00c853]/10 border border-[#00c853]/20 text-[#00c853] text-xs font-black tracking-widest uppercase mb-4">
                🇮🇳 India's Youngest Digital CEO
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-2 tracking-tight">
                Vir
              </h1>
              <p className="text-xl font-bold text-[#00c853] mb-4">Founder & CEO, DigiWorku</p>
              <p className={`text-base leading-relaxed max-w-xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                A self-taught technologist and entrepreneur who built DigiWorku from scratch at just 16 — 
                turning a bold vision into India's fastest-growing digital workforce platform. 
                Commerce with Mathematics background, driven by an obsession with building real businesses that deliver real results.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                {[
                  { label: 'Age', value: '16' },
                  { label: 'Class', value: '11th' },
                  { label: 'Founded', value: '2024' },
                  { label: 'Platform', value: 'DigiWorku' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`text-center px-4 py-2 rounded-xl border ${
                      darkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                    }`}
                  >
                    <div className="text-xl font-black">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── SKILLS SECTION ── */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-[3px] bg-[#00c853] rounded-full" />
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '🌐', title: 'Web Development', desc: 'Full-stack websites & web apps using modern frameworks, React, and Vite.', level: 90 },
                { icon: '📈', title: 'SEO & Growth', desc: 'Technical SEO, schema markup, Core Web Vitals, and organic traffic strategies.', level: 88 },
                { icon: '💼', title: 'Business Strategy', desc: 'Startup operations, service pricing, client acquisition, and scaling digital businesses.', level: 85 },
                { icon: '🎨', title: 'UI/UX Design', desc: 'Designing premium interfaces with Figma and modern design systems.', level: 80 },
                { icon: '🤖', title: 'AI & Automation', desc: 'Building AI-powered workflows using Gemini API, prompt engineering, and LLM integrations.', level: 82 },
                { icon: '📊', title: 'Commerce & Finance', desc: 'Business accounting fundamentals, Math (Class XI), and financial planning.', level: 78 },
                { icon: '🛡️', title: 'Cybersecurity Basics', desc: 'Security headers, CSP, rate limiting, and safe API architecture.', level: 72 },
                { icon: '📱', title: 'Digital Marketing', desc: 'Brand positioning, social media strategy, and content-led growth.', level: 80 },
                { icon: '🗣️', title: 'Leadership & Vision', desc: 'Managing distributed remote teams and building culture from day one.', level: 88 },
              ].map((skill, i) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 + i * 0.05 }}
                  className={`p-5 rounded-2xl border transition-all group ${
                    darkMode
                      ? 'bg-white/5 border-white/10 hover:border-[#00c853]/40'
                      : 'bg-white/80 border-slate-200 hover:border-[#00c853]/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{skill.title}</div>
                      <div className="text-slate-400 text-xs mt-1 leading-relaxed">{skill.desc}</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-1.5 mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#00c853] to-[#69f0ae]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── JOURNEY TIMELINE ── */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-[3px] bg-[#00c853] rounded-full" />
              The Journey
            </h2>
            <div className="relative border-l-2 border-[#00c853]/30 pl-8 space-y-8 ml-4">
              {[
                { year: '2022', title: 'First Line of Code', desc: 'Started learning web development as a curious middle-schooler. Built first HTML/CSS websites and fell in love with creating things on the internet.' },
                { year: '2023', title: 'Mastering the Stack', desc: 'Dove deep into JavaScript, React, and backend development. Started understanding how real-world products are built and deployed.' },
                { year: '2024', title: 'DigiWorku Founded', desc: 'Identified the massive gap in India\'s digital services market. Founded DigiWorku to connect businesses with elite digital talent — all while studying in Class 11.' },
                { year: '2025', title: 'Platform Goes Live', desc: 'Launched the full DigiWorku platform with AI-powered client management, live chat, portfolio, and 500+ project milestones delivered.' },
                { year: '2026', title: 'Scaling to India\'s Top 1%', desc: 'Expanded team, launched AI Automation and Branding verticals, and pushed DigiWorku toward becoming India\'s #1 digital workforce ecosystem.' },
              ].map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-[39px] top-1 w-4 h-4 rounded-full bg-[#00c853] border-2 border-slate-950 shadow-[0_0_10px_rgba(0,200,83,0.5)]" />
                  <div className="text-[#00c853] text-xs font-black tracking-widest uppercase mb-1">{item.year}</div>
                  <div className="font-bold text-base mb-1">{item.title}</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── EDUCATION & PHILOSOPHY ── */}
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200 shadow-xs'
              }`}
            >
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">🎓 Education</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00c853]/20 flex items-center justify-center text-sm flex-shrink-0">📚</div>
                  <div>
                    <div className="font-bold text-sm">Class XI — Commerce with Mathematics</div>
                    <div className="text-slate-400 text-xs mt-0.5">Currently enrolled · 2025–26 Academic Year</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00c853]/20 flex items-center justify-center text-sm flex-shrink-0">💡</div>
                  <div>
                    <div className="font-bold text-sm">Self-Taught Developer</div>
                    <div className="text-slate-400 text-xs mt-0.5">4+ years of independent learning through online resources, projects & real client work</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00c853]/20 flex items-center justify-center text-sm flex-shrink-0">🏆</div>
                  <div>
                    <div className="font-bold text-sm">Subjects: Accountancy · Business Studies · Maths · Economics</div>
                    <div className="text-slate-400 text-xs mt-0.5">Strong commercial and analytical foundation</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.45 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#00c853]/10 to-transparent border border-[#00c853]/20"
            >
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">💬 Founder's Philosophy</h3>
              <blockquote className="text-base leading-relaxed italic border-l-4 border-[#00c853] pl-4 mb-4">
                "Age is just a number. What matters is the value you create. 
                I built DigiWorku because I believed businesses deserved better — 
                faster delivery, real talent, and zero compromises on quality."
              </blockquote>
              <div className="text-[#00c853] font-black text-sm">— Vir, Founder & CEO</div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className="mt-10 text-center"
          >
            <p className="text-slate-400 text-sm mb-4">Interested in working with the DigiWorku team?</p>
            <button
              onClick={onOpenServiceRequestModal}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#00c853] text-black font-black text-sm hover:bg-[#69f0ae] transition-all shadow-[0_0_30px_rgba(0,200,83,0.3)] hover:shadow-[0_0_40px_rgba(0,200,83,0.4)] cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Start a Project with DigiWorku</span>
            </button>
          </motion.div>

          <div className="text-center mt-12 pb-8 text-[11px] text-slate-500 font-medium">
            © {new Date().getFullYear()} DigiWorku · Founded by Vir · digiworku.in
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export default FounderPage;
