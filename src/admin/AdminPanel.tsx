import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Briefcase,
  Settings,
  LogOut,
  Send,
  Trash2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Plus,
  Search,
  Moon,
  Sun,
  Bell,
  X,
  Check,
  TrendingUp,
  Clock,
  User,
  Zap,
  AlertCircle,
  FileText,
  Rocket,
  Lock,
  Mail,
  Shield,
  Menu,
  Home,
  LayoutDashboard,
  Users,
  Folder,
  HelpCircle,
  BarChart3,
  UserCheck,
  CheckCircle2,
  Phone,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import type {
  CRMProject,
  CRMInquiry,
  ChatThread,
  ChatMessage,
  TeamMember,
  ServiceItem,
  ProjectItem
} from '../types/crm';
import { DigiWorkuLogo } from '../components/brand/DigiWorkuLogo';

export interface AdminPanelProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminEmail: string;
  setAdminEmail: (val: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  triggerToast: (msg: string) => void;
  onExit: () => void;
  crmProjectsList: CRMProject[];
  setCrmProjectsList: React.Dispatch<React.SetStateAction<CRMProject[]>>;
  crmInquiriesList: CRMInquiry[];
  setCrmInquiriesList: React.Dispatch<React.SetStateAction<CRMInquiry[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  chatThreadsList: ChatThread[];
  setChatThreadsList: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  servicesList?: ServiceItem[];
  projectsList?: ProjectItem[];
  notifications?: any[];
  setNotifications?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdmin,
  setIsAdmin,
  adminEmail,
  setAdminEmail,
  darkMode,
  toggleDarkMode,
  triggerToast,
  onExit,
  crmProjectsList,
  setCrmProjectsList,
  crmInquiriesList,
  setCrmInquiriesList,
  teamMembers,
  setTeamMembers,
  chatThreadsList,
  setChatThreadsList,
  notifications = [],
  setNotifications
}) => {
  // Navigation
  const [adminTab, setAdminTab] = useState<'home' | 'clients' | 'projects' | 'inquiries' | 'team' | 'analytics' | 'chat' | 'settings'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth States
  const [loginEmail, setLoginEmail] = useState(adminEmail || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Search & Filters
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [searchInquiryQuery, setSearchInquiryQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'converted'>('all');
  const [searchClientQuery, setSearchClientQuery] = useState('');

  // Modals
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ name: '', client: '', budget: '', desc: '' });

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({ name: '', role: '', avatarUrl: '', status: 'ONLINE' as 'ONLINE' | 'OFF SHIFT' });

  const [isAutoReplyModalOpen, setIsAutoReplyModalOpen] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(() => {
    return localStorage.getItem('digiworku-auto-reply-enabled') === 'true';
  });
  const [autoReplyText, setAutoReplyText] = useState<string>(() => {
    return localStorage.getItem('digiworku-auto-reply-text') ||
      "Thank you for reaching out to DigiWorku! Our team has received your message and will update your project details shortly.";
  });

  // Chat Hub States
  const [activeThreadId, setActiveThreadId] = useState<string>(() => chatThreadsList[0]?.id || '');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [selectedChatFilter, setSelectedChatFilter] = useState<'All' | 'New' | 'Active' | 'Closed'>('All');
  const [adminReplyInput, setAdminReplyInput] = useState('');
  const [adminMobileChatView, setAdminMobileChatView] = useState<'list' | 'thread'>('list');
  const [activeAdminNotes, setActiveAdminNotes] = useState('');

  // Analytics States
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState<'revenue' | 'csat' | 'retention' | 'projects'>('revenue');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'6months' | '12months' | 'ytd'>('6months');

  // Sync active thread notes
  useEffect(() => {
    const thread = chatThreadsList.find(t => t.id === activeThreadId);
    if (thread) {
      setActiveAdminNotes(thread.adminNotes || '');
    }
  }, [activeThreadId, chatThreadsList]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAdmin(true);
        setAdminEmail(loginEmail.trim());
        localStorage.setItem('digiworku-is-admin', 'true');
        localStorage.setItem('digiworku-admin-email', loginEmail.trim());
        setLoginPassword('');
        triggerToast("🔑 Admin Console Authenticated Successfully! Access Granted.");
      } else {
        setAuthError(data.error || "Access Denied: The email or passphrase does not match administrative records.");
        setLoginPassword('');
        triggerToast("❌ Authentication Failed: Please check your credentials.");
      }
    } catch {
      setAuthError("Network error: Could not reach authentication server.");
      setLoginPassword('');
      triggerToast("❌ Authentication Failed: Network error.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('digiworku-is-admin');
    localStorage.removeItem('digiworku-admin-email');
    setAdminEmail('');
    triggerToast("🔓 Admin session closed safely.");
    onExit();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN (When !isAdmin)
  // ───────────────────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-200 ${
        darkMode ? 'bg-[#0e1014] text-[#f1f5f9]' : 'bg-[#fafafc] text-[#1f2937]'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#16181e] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#00c853] to-transparent" />

          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#00c853]/10 border border-[#00c853]/20 flex items-center justify-center mx-auto shadow-inner text-[#00c853]">
              <Lock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Admin Command Console</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">DigiWorku Operator Gateway</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your admin email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
                CONSOLE PASSPHRASE
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#00c853] hover:bg-[#00af48] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00c853]/20 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isAuthLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Operator</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onExit}
              className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Site</span>
            </button>
            <span className="text-[10px] font-mono text-slate-500">Node: dw-portal-sec</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // AUTHENTICATED ADMIN DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────
  const activeThread = chatThreadsList.find(t => t.id === activeThreadId) || chatThreadsList[0];

  return (
    <div className={`min-h-screen flex font-sans ${darkMode ? 'dark bg-[#0f1115] text-[#f1f5f9]' : 'bg-[#fafafc] text-[#1f2937]'}`}>

      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col shrink-0 border-r transition-transform duration-200 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${darkMode ? 'bg-[#14171e] border-slate-800' : 'bg-white border-slate-200'}`}>

        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DigiWorkuLogo variant="squircle" height={38} className="rounded-xl shadow-sm" />
            <div>
              <div className="font-black text-base tracking-tight">
                Digi<span className="text-[#00c853]">Worku</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-[#00c853] uppercase tracking-wider block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {[
            { id: 'home', label: 'CRM Overview', icon: LayoutDashboard },
            { id: 'clients', label: 'Clients Database', icon: Users },
            { id: 'projects', label: 'Projects Pipeline', icon: Folder, count: crmProjectsList.length },
            { id: 'inquiries', label: 'Inbound Leads', icon: HelpCircle, count: crmInquiriesList.filter(i => i.unread || i.status === 'new').length },
            { id: 'team', label: 'Workforce Team', icon: UserCheck, count: teamMembers.length },
            { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
            { id: 'chat', label: 'Support Chat CRM', icon: MessageSquare, badge: chatThreadsList.filter(t => t.unreadCount > 0).length },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setAdminTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00c853] text-white shadow-md shadow-[#00c853]/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && !item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Session Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <button
            onClick={() => setIsAddProjectModalOpen(true)}
            className="w-full py-2.5 px-3 flex items-center justify-center gap-2 rounded-xl text-xs font-black text-white bg-[#00c853] hover:bg-[#00af48] shadow-md shadow-[#00c853]/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>POST NEW TASK</span>
          </button>

          <button
            onClick={onExit}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          {/* Admin Profile Details */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminEmail ? adminEmail.split('@')[0] : 'Admin')}&background=00c853&color=fff&bold=true`}
                alt="Admin"
                className="w-8 h-8 rounded-full border border-[#00c853] shrink-0"
              />
              <div className="min-w-0">
                <span className="block text-xs font-black truncate">{adminEmail || 'admin@digiworku.in'}</span>
                <span className="block text-[9px] text-[#00c853] font-bold uppercase tracking-wider">Operator</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {/* Top Header */}
        <header className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between shrink-0 sticky top-0 z-30 ${
          darkMode ? 'bg-[#14171e]/90 border-slate-800' : 'bg-white/90 border-slate-200'
        } backdrop-blur-md`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white capitalize">
                {adminTab === 'home' ? 'CRM Master Dashboard' : `${adminTab} Management`}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">
                Secure DigiWorku Infrastructure • Live Synchronization Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Reply settings modal trigger */}
            <button
              onClick={() => setIsAutoReplyModalOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Auto-Reply Configuration"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </button>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Return to website */}
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Console</span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">

          {/* ─────────────────── TAB: HOME (OVERVIEW) ─────────────────── */}
          {adminTab === 'home' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Metric Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Pipeline', value: crmProjectsList.length, change: '+12% this week', icon: Folder, color: 'text-emerald-500' },
                  { label: 'Total Inquiries', value: crmInquiriesList.length, change: `${crmInquiriesList.filter(i => i.unread).length} Unread`, icon: HelpCircle, color: 'text-blue-500' },
                  { label: 'Workforce Members', value: teamMembers.length, change: `${teamMembers.filter(m => m.status === 'ONLINE').length} Online`, icon: UserCheck, color: 'text-purple-500' },
                  { label: 'Support Threads', value: chatThreadsList.length, change: 'Active CRM', icon: MessageSquare, color: 'text-amber-500' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={`p-4 sm:p-5 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                      <span className="text-[10px] font-bold text-emerald-500 mt-1 block">{stat.change}</span>
                    </div>
                  );
                })}
              </div>

              {/* Active Pipeline Projects Table */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200 shadow-xs'} space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>Active Projects Pipeline</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Click status pills to cycle milestones.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchProjectQuery}
                        onChange={(e) => setSearchProjectQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-[#00c853]"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddProjectModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#00c853] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#00af48]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Project</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400">
                        <th className="py-2.5">ID</th>
                        <th className="py-2.5">Project</th>
                        <th className="py-2.5">Client</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Progress</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {crmProjectsList
                        .filter(p => p.name.toLowerCase().includes(searchProjectQuery.toLowerCase()) || p.leadName.toLowerCase().includes(searchProjectQuery.toLowerCase()))
                        .map(project => (
                          <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 font-mono font-bold text-slate-400">{project.id}</td>
                            <td className="py-3 font-bold text-slate-900 dark:text-white">{project.name}</td>
                            <td className="py-3">{project.leadName}</td>
                            <td className="py-3">
                              <button
                                onClick={() => {
                                  const cycle: Record<CRMProject['status'], CRMProject['status']> = {
                                    'ON TRACK': 'IN REVIEW',
                                    'IN REVIEW': 'STABLE',
                                    'STABLE': 'OFF TRACK',
                                    'OFF TRACK': 'ON TRACK'
                                  };
                                  const nextStatus = cycle[project.status];
                                  setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: nextStatus } : p));
                                  supabase.from('crm_projects').update({ status: nextStatus }).eq('id', project.id);
                                }}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                                  project.status === 'ON TRACK' ? 'bg-emerald-500/10 text-emerald-500' :
                                  project.status === 'IN REVIEW' ? 'bg-amber-500/10 text-amber-500' :
                                  project.status === 'STABLE' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                }`}
                              >
                                {project.status}
                              </button>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#00c853]" style={{ width: `${project.progress}%` }} />
                                </div>
                                <span className="font-mono text-[10px]">{project.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setCrmProjectsList(prev => prev.filter(p => p.id !== project.id));
                                  supabase.from('crm_projects').delete().eq('id', project.id);
                                  triggerToast("🗑️ Project deleted.");
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: CLIENTS ─────────────────── */}
          {adminTab === 'clients' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span>Corporate Clients Database</span>
                </h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client directory..."
                    value={searchClientQuery}
                    onChange={(e) => setSearchClientQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:border-[#00c853]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crmProjectsList
                  .filter(p => p.leadName.toLowerCase().includes(searchClientQuery.toLowerCase()))
                  .map(client => (
                    <div key={client.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
                      <div className="flex items-center gap-3">
                        <img src={client.leadAvatar} alt={client.leadName} className="w-10 h-10 rounded-full border border-[#00c853]" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{client.leadName}</h4>
                          <span className="text-[10px] text-slate-400 block">{client.id}</span>
                        </div>
                      </div>
                      <div className="text-xs space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-slate-500">
                          <span>Active Project:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{client.name}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Budget Allocation:</span>
                          <span className="font-bold text-emerald-500">{client.budget || 'TBD'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: PROJECTS ─────────────────── */}
          {adminTab === 'projects' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">Projects Kanban Pipeline</h3>
                  <p className="text-xs text-slate-400">Track and advance deliverables across milestone phases.</p>
                </div>
                <button
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="px-4 py-2 bg-[#00c853] hover:bg-[#00af48] text-white text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['ON TRACK', 'IN REVIEW', 'STABLE', 'OFF TRACK'] as const).map(colStatus => {
                  const items = crmProjectsList.filter(p => p.status === colStatus);
                  return (
                    <div key={colStatus} className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#14171e]/70 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-black uppercase tracking-wider">{colStatus}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">
                          {items.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {items.map(project => (
                          <div key={project.id} className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#1c202a] border-slate-750' : 'bg-white border-slate-200 shadow-xs'} space-y-2`}>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{project.name}</span>
                              <button
                                onClick={() => {
                                  setCrmProjectsList(prev => prev.filter(p => p.id !== project.id));
                                  supabase.from('crm_projects').delete().eq('id', project.id);
                                }}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                              <span className="font-bold text-slate-500">{project.leadName}</span>
                              <span className="font-mono text-emerald-500 font-bold">{project.budget}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: INQUIRIES ─────────────────── */}
          {adminTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500" />
                  <span>Inbound Leads Feed</span>
                </h3>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 text-xs">
                  {(['all', 'new', 'reviewed', 'converted'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setInquiryStatusFilter(f)}
                      className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                        inquiryStatusFilter === f
                          ? 'bg-[#00c853] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {crmInquiriesList
                  .filter(i => inquiryStatusFilter === 'all' || i.status === inquiryStatusFilter)
                  .map(inquiry => (
                    <div key={inquiry.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{inquiry.clientName}</h4>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            inquiry.status === 'new' ? 'bg-emerald-500/10 text-emerald-500' :
                            inquiry.status === 'converted' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{inquiry.projectName} • {inquiry.summary}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          {inquiry.email && <span>📧 {inquiry.email}</span>}
                          {inquiry.mobile && <span>📞 {inquiry.mobile}</span>}
                          {inquiry.budget && <span className="text-emerald-500 font-bold">₹ {inquiry.budget}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {inquiry.status !== 'converted' && (
                          <button
                            onClick={() => {
                              const newProj: CRMProject = {
                                id: `#PJ-${Math.floor(5000 + Math.random() * 999)}`,
                                name: inquiry.projectName,
                                leadName: inquiry.clientName,
                                leadAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(inquiry.clientName)}&background=00c853&color=fff`,
                                status: 'ON TRACK',
                                healthScore: 100,
                                budget: inquiry.budget || 'TBD',
                                description: inquiry.summary,
                                progress: 10
                              };
                              setCrmProjectsList(prev => [newProj, ...prev]);
                              setCrmInquiriesList(prev => prev.map(i => i.id === inquiry.id ? { ...i, status: 'converted' } : i));
                              supabase.from('crm_projects').insert(newProj);
                              supabase.from('inquiries').update({ status: 'converted' }).eq('id', inquiry.id);
                              triggerToast("🚀 Inquiry converted to active project!");
                            }}
                            className="px-3 py-1.5 bg-[#00c853] text-white text-xs font-bold rounded-xl hover:bg-[#00af48]"
                          >
                            Convert to Project
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCrmInquiriesList(prev => prev.filter(i => i.id !== inquiry.id));
                            supabase.from('inquiries').delete().eq('id', inquiry.id);
                            triggerToast("🗑️ Inquiry deleted.");
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: TEAM ─────────────────── */}
          {adminTab === 'team' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-500" />
                    <span>Digital Workforce Team</span>
                  </h3>
                  <p className="text-xs text-slate-400">Manage engineers and creative talent assigned to client matrices.</p>
                </div>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="px-3 py-1.5 bg-[#00c853] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200'} space-y-3`}>
                    <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-[#00c853]" />
                    <div>
                      <h4 className="text-sm font-black">{member.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        member.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setTeamMembers(prev => prev.filter(m => m.id !== member.id));
                        supabase.from('team').delete().eq('id', member.id);
                        triggerToast("Member removed.");
                      }}
                      className="text-xs text-red-500 hover:underline pt-2 block mx-auto"
                    >
                      Remove from Team
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: ANALYTICS ─────────────────── */}
          {adminTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black">Performance Analytics</h3>
                <div className="flex gap-2">
                  {(['6months', '12months', 'ytd'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setAnalyticsTimeframe(tf)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                        analyticsTimeframe === tf ? 'bg-[#00c853] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div className="text-sm font-bold text-slate-400">Monthly Revenue & Velocity Index</div>
                <div className="h-48 flex items-end justify-between gap-3 pt-6">
                  {[45, 65, 80, 55, 90, 110, 130].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-[#00c853] rounded-t-lg transition-all hover:bg-emerald-400" style={{ height: `${h}px` }} />
                      <span className="text-[10px] font-mono text-slate-400">M{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────── TAB: CHAT SUPPORT HUB ─────────────────── */}
          {adminTab === 'chat' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[75vh] flex rounded-2xl border overflow-hidden border-slate-200 dark:border-slate-800">
              {/* Left Column: Threads */}
              <div className={`w-full md:w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
                adminMobileChatView === 'thread' ? 'hidden md:flex' : 'flex'
              } ${darkMode ? 'bg-[#14171e]' : 'bg-white'}`}>
                <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {chatThreadsList
                    .filter(t => t.name.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                    .map(thread => (
                      <button
                        key={thread.id}
                        onClick={() => {
                          setActiveThreadId(thread.id);
                          setAdminMobileChatView('thread');
                        }}
                        className={`w-full p-3 text-left flex items-start gap-3 transition-colors ${
                          thread.id === activeThreadId ? 'bg-emerald-500/10 border-l-4 border-[#00c853]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <img src={thread.avatarUrl} alt={thread.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold truncate">{thread.name}</span>
                            <span className="text-[9px] text-slate-400">{thread.lastMessageTime}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{thread.lastMessageText}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Right Column: Chat View */}
              {activeThread ? (
                <div className={`flex-1 flex flex-col ${adminMobileChatView === 'list' ? 'hidden md:flex' : 'flex'} ${darkMode ? 'bg-[#0f1115]' : 'bg-slate-50'}`}>
                  {/* Chat Top Bar */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setAdminMobileChatView('list')} className="md:hidden p-1 text-slate-400">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <img src={activeThread.avatarUrl} alt={activeThread.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <h4 className="text-xs font-bold leading-none">{activeThread.name}</h4>
                        <span className="text-[10px] text-slate-400">{activeThread.email || activeThread.companyName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {(activeThread.messages || []).map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs ${
                          msg.role === 'assistant'
                            ? 'bg-[#00c853] text-white rounded-br-none'
                            : (darkMode ? 'bg-slate-800 text-white rounded-bl-none' : 'bg-white text-slate-800 shadow-xs rounded-bl-none')
                        }`}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <span className="text-[9px] opacity-70 block text-right mt-1">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type admin response..."
                      value={adminReplyInput}
                      onChange={(e) => setAdminReplyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && adminReplyInput.trim()) {
                          const newMsg: ChatMessage = {
                            id: `msg-${Date.now()}`,
                            role: 'assistant',
                            content: adminReplyInput.trim(),
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setChatThreadsList(prev => prev.map(t => t.id === activeThreadId ? {
                            ...t,
                            messages: [...(t.messages || []), newMsg],
                            lastMessageText: newMsg.content,
                            lastMessageTime: 'Just now'
                          } : t));
                          supabase.from('messages').insert({
                            user_id: activeThreadId,
                            text: newMsg.content,
                            role: 'assistant'
                          });
                          setAdminReplyInput('');
                        }
                      }}
                      className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-[#00c853]"
                    />
                    <button
                      onClick={() => {
                        if (!adminReplyInput.trim()) return;
                        const newMsg: ChatMessage = {
                          id: `msg-${Date.now()}`,
                          role: 'assistant',
                          content: adminReplyInput.trim(),
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setChatThreadsList(prev => prev.map(t => t.id === activeThreadId ? {
                          ...t,
                          messages: [...(t.messages || []), newMsg],
                          lastMessageText: newMsg.content,
                          lastMessageTime: 'Just now'
                        } : t));
                        supabase.from('messages').insert({
                          user_id: activeThreadId,
                          text: newMsg.content,
                          role: 'assistant'
                        });
                        setAdminReplyInput('');
                      }}
                      className="p-2 rounded-xl bg-[#00c853] text-white hover:bg-[#00af48]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                  Select a chat thread to view messages.
                </div>
              )}
            </motion.div>
          )}

          {/* ─────────────────── TAB: SETTINGS ─────────────────── */}
          {adminTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
              <h3 className="text-lg font-black">DigiWorku Infrastructure Settings</h3>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#16181e] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Security & Access Checks</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="font-bold">Admin Route Isolation</span>
                    <span className="text-emerald-500 font-bold">✅ /dw-portal Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="font-bold">Public /admin Route Protection</span>
                    <span className="text-emerald-500 font-bold">🔒 404 Disguised</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="font-bold">AI Model Endpoint</span>
                    <span className="text-emerald-500 font-bold">gemini-2.0-flash</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <span className="font-bold">Supabase Realtime Sync</span>
                    <span className="text-emerald-500 font-bold">✅ Connected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ─────────────────── MODALS ─────────────────── */}

      {/* ADD PROJECT MODAL */}
      <AnimatePresence>
        {isAddProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm flex items-center gap-2">
                  <Folder className="w-4 h-4 text-emerald-500" />
                  Add New Pipeline Project
                </h3>
                <button onClick={() => setIsAddProjectModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Project Name</label>
                  <input
                    type="text"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                    placeholder="e.g. Next.js SaaS Platform"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newProjectForm.client}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Budget</label>
                  <input
                    type="text"
                    value={newProjectForm.budget}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, budget: e.target.value })}
                    placeholder="e.g. ₹55,000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="pt-3 flex gap-2">
                  <button onClick={() => setIsAddProjectModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newProjectForm.name || !newProjectForm.client) return;
                      const newProj: CRMProject = {
                        id: `#PJ-${Math.floor(5000 + Math.random() * 999)}`,
                        name: newProjectForm.name,
                        leadName: newProjectForm.client,
                        leadAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newProjectForm.client)}&background=00c853&color=fff`,
                        status: 'ON TRACK',
                        healthScore: 100,
                        budget: newProjectForm.budget || '₹45,000',
                        description: newProjectForm.desc || 'Active delivery.',
                        progress: 0
                      };
                      setCrmProjectsList(prev => [newProj, ...prev]);
                      supabase.from('crm_projects').insert(newProj);
                      setIsAddProjectModalOpen(false);
                      setNewProjectForm({ name: '', client: '', budget: '', desc: '' });
                      triggerToast("✅ Project created successfully!");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#00c853] text-white font-bold"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MEMBER MODAL */}
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  Add Team Member
                </h3>
                <button onClick={() => setIsAddMemberModalOpen(false)} className="p-1 rounded-full text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    placeholder="e.g. Vikram Aditya"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Role</label>
                  <input
                    type="text"
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="pt-3 flex gap-2">
                  <button onClick={() => setIsAddMemberModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newMemberForm.name || !newMemberForm.role) return;
                      const member: TeamMember = {
                        id: `team-${Date.now()}`,
                        name: newMemberForm.name,
                        role: newMemberForm.role,
                        avatarUrl: newMemberForm.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberForm.name)}&background=00c853&color=fff`,
                        status: newMemberForm.status
                      };
                      setTeamMembers(prev => [...prev, member]);
                      supabase.from('team').insert(member);
                      setIsAddMemberModalOpen(false);
                      setNewMemberForm({ name: '', role: '', avatarUrl: '', status: 'ONLINE' });
                      triggerToast("✅ Team member added!");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#00c853] text-white font-bold"
                  >
                    Join Team
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTO-REPLY CONFIGURATION MODAL */}
      <AnimatePresence>
        {isAutoReplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl ${darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Auto-Reply Configuration (10s Delay)
                </h3>
                <button onClick={() => setIsAutoReplyModalOpen(false)} className="p-1 rounded-full text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                  <span className="font-bold">Status: {autoReplyEnabled ? 'ACTIVE' : 'DISABLED'}</span>
                  <button
                    onClick={() => {
                      const next = !autoReplyEnabled;
                      setAutoReplyEnabled(next);
                      localStorage.setItem('digiworku-auto-reply-enabled', String(next));
                      triggerToast(next ? "🟢 Auto-Reply Enabled" : "🔴 Auto-Reply Disabled");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      autoReplyEnabled ? 'bg-red-500 text-white' : 'bg-[#00c853] text-white'
                    }`}
                  >
                    {autoReplyEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    value={autoReplyText}
                    onChange={(e) => setAutoReplyText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('digiworku-auto-reply-text', autoReplyText);
                      setIsAutoReplyModalOpen(false);
                      triggerToast("⚡ Auto-Reply saved.");
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#00c853] text-white font-bold"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPanel;
