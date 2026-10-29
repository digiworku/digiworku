import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Home,
  MessageSquare,
  Briefcase,
  Layers,
  Sparkles,
  Users,
  Star,
  Sun,
  Moon,
  Lock,
  Menu,
  X,
  User,
  ArrowRight,
  LogOut,
  FolderGit2,
} from 'lucide-react';
import { AnimatedGridBackground } from './components/AnimatedGridBackground';
import { ErrorBoundary } from './components/ErrorBoundary';
import { supabase } from './supabase';
import type {
  ProjectItem,
  CRMProject,
  CRMInquiry,
  ChatThread,
  TeamMember,
  ReviewItem,
  ServiceItem,
} from './types/crm';
import type { LegalPageSlug } from './components/LegalPages';

// ── Lazy Loaded Route Chunks (Optimized for initial load < 200 KB) ──────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const FounderPage = lazy(() => import('./pages/FounderPage'));
const ClientPortalPage = lazy(() => import('./pages/ClientPortalPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const AdminPanel = lazy(() => import('./admin/AdminPanel'));
const CaseStudies = lazy(() => import('./components/CaseStudies'));
const LegalPages = lazy(() => import('./components/LegalPages'));
const ServiceDetailPage = lazy(() => import('./components/ServiceDetailPage'));
const KanbanBoard = lazy(() => import('./components/crm/KanbanBoard'));
const ChatWindow = lazy(() => import('./components/chat/ChatWindow'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

// Modals
import { InquiryModal } from './components/modals/InquiryModal';
import { FreelancerModal } from './components/modals/FreelancerModal';
import { AuthModal } from './components/modals/AuthModal';

export type TabType =
  | 'home'
  | 'chat'
  | 'portfolio'
  | 'caseStudies'
  | 'caseStudyDetail'
  | 'services'
  | 'serviceDetail'
  | 'legal'
  | 'founder'
  | 'clients'
  | 'projects'
  | 'inquiries'
  | 'reviews'
  | 'team'
  | 'analytics'
  | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('digiworku-dark-mode') !== 'false';
  });

  // Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [panelMode, setPanelMode] = useState<'user' | 'admin'>('user');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal States
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState('Website Development');
  const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalAdminDefault, setAuthModalAdminDefault] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Routing Sub-states
  const [activeLegalSlug, setActiveLegalSlug] = useState<LegalPageSlug | null>(null);
  const [activeServiceSlug, setActiveServiceSlug] = useState<string | null>(null);
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null);
  const [is404, setIs404] = useState<boolean>(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [crmProjectsList, setCrmProjectsList] = useState<CRMProject[]>([]);
  const [inquiriesList, setInquiriesList] = useState<CRMInquiry[]>([]);
  const [chatThreadsList, setChatThreadsList] = useState<ChatThread[]>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // 1. Verify Cryptographic Admin Session with Backend on Mount
  useEffect(() => {
    const token = localStorage.getItem('digiworku-admin-token');
    const savedEmail = localStorage.getItem('digiworku-admin-email');

    if (token) {
      fetch('/api/admin-verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.authenticated && data.role === 'admin') {
            setIsAdmin(true);
            setAdminEmail(data.email || savedEmail || 'admin@digiworku.in');
          } else {
            // Invalid or expired token
            localStorage.removeItem('digiworku-admin-token');
            setIsAdmin(false);
          }
        })
        .catch(() => {
          setIsAdmin(false);
        });
    }
  }, []);

  // 2. Fetch Initial Public Data from Supabase
  const loadDatabaseData = async () => {
    try {
      const [projRes, teamRes, revRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('team').select('*').order('sort_order', { ascending: true }),
        supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }),
      ]);

      if (projRes.data) {
        setProjectsList(
          projRes.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            category: p.category || 'General',
            tags: p.tags || [],
            imageUrl: p.image_url || '',
            videoUrl: p.video_url || undefined,
            mediaType: p.media_type || 'image',
            clientName: p.client_name || 'DigiWorku Client',
            impactResult: p.impact_result || undefined,
          }))
        );
      }

      if (teamRes.data) {
        setTeamMembers(
          teamRes.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            avatarUrl: t.avatar_url || '',
            status: t.status || 'ONLINE',
            blocked: t.blocked || false,
          }))
        );
      }

      if (revRes.data) {
        setReviewsList(
          revRes.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            role: r.role || 'Client Partner',
            rating: r.rating || 5,
            text: r.text,
            avatarInitials: r.avatar_initials || 'DW',
            createdAt: new Date(r.created_at).toLocaleDateString(),
          }))
        );
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // 3. Dynamic URL Synchronization & SEO Meta
  useEffect(() => {
    const pathname = window.location.pathname;

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      setIs404(true);
      return;
    }

    if (pathname === '/dw-portal' || pathname.startsWith('/dw-portal/')) {
      setActiveTab('home');
      setPanelMode('admin');
      return;
    }

    if (pathname === '/founder') {
      setActiveTab('founder');
    } else if (pathname === '/services') {
      setActiveTab('services');
    } else if (pathname === '/portfolio') {
      setActiveTab('portfolio');
    } else if (pathname === '/case-studies') {
      setActiveTab('caseStudies');
    } else if (pathname === '/reviews') {
      setActiveTab('reviews');
    } else if (pathname === '/team') {
      setActiveTab('team');
    } else if (pathname.startsWith('/legal/')) {
      const slug = pathname.replace('/legal/', '') as LegalPageSlug;
      setActiveTab('legal');
      setActiveLegalSlug(slug);
    }
  }, []);

  const handleAdminAuthSuccess = (token: string, email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    setPanelMode('admin');
    triggerToast('✅ Admin cryptographic session authenticated successfully!');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('digiworku-admin-token');
    localStorage.removeItem('digiworku-admin-email');
    setIsAdmin(false);
    setPanelMode('user');
    triggerToast('Logged out of admin console.');
  };

  const currentChatUserId = currentUser?.id || 'guest-session';

  if (is404) {
    return <NotFoundPage onGoHome={() => { setIs404(false); window.history.pushState({}, '', '/'); }} />;
  }

  // Admin View (Method 1: Mounted only when in admin mode)
  if (panelMode === 'admin') {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <AdminPanel
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          adminEmail={adminEmail}
          setAdminEmail={setAdminEmail}
          darkMode={darkMode}
          toggleDarkMode={() => {
            const next = !darkMode;
            setDarkMode(next);
            localStorage.setItem('digiworku-dark-mode', String(next));
          }}
          onExit={() => setPanelMode('user')}
          triggerToast={triggerToast}
          projectsList={projectsList}
          crmProjectsList={crmProjectsList}
          setCrmProjectsList={setCrmProjectsList}
          crmInquiriesList={inquiriesList}
          setCrmInquiriesList={setInquiriesList}
          chatThreadsList={chatThreadsList}
          setChatThreadsList={setChatThreadsList}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          servicesList={[]}
        />
      </Suspense>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 relative overflow-x-hidden ${
        darkMode ? 'dark bg-[#111111] text-[#f1f5f9]' : 'bg-[#fafafc] text-[#1f2937]'
      }`}
    >
      {/* High-Performance Animated Background */}
      <AnimatedGridBackground darkMode={darkMode} />

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-[#111111]/80 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00c853] to-emerald-400 text-black font-black flex items-center justify-center text-sm shadow-md">
              DW
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Digi<span className="text-[#00c853]">Worku</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Services' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'caseStudies', label: 'Case Studies' },
              { id: 'team', label: 'Team' },
              { id: 'reviews', label: 'Reviews' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as TabType)}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === nav.id
                    ? 'bg-[#00c853]/15 text-[#00c853]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                localStorage.setItem('digiworku-dark-mode', String(next));
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#00c853] cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAdmin ? (
              <button
                onClick={() => setPanelMode('admin')}
                className="py-2 px-3 rounded-xl bg-[#00c853] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalAdminDefault(false);
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:flex py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:border-[#00c853] cursor-pointer"
              >
                <User className="w-3.5 h-3.5 mr-1" />
                <span>Portal Sign In</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedServiceForInquiry('Website Development');
                setIsInquiryModalOpen(true);
              }}
              className="py-2 px-3.5 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] space-y-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Services' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'caseStudies', label: 'Case Studies' },
              { id: 'team', label: 'Team' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'founder', label: 'Meet the Founder' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveTab(nav.id as TabType);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold ${
                  activeTab === nav.id
                    ? 'bg-[#00c853]/15 text-[#00c853]'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Routed Page Content */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        <Suspense fallback={<PageSkeleton />}>
          {activeTab === 'home' && (
            <HomePage
              darkMode={darkMode}
              onRequestService={(s) => {
                setSelectedServiceForInquiry(s);
                setIsInquiryModalOpen(true);
              }}
              onOpenFreelancerModal={() => setIsFreelancerModalOpen(true)}
              onNavigateToTab={(t) => setActiveTab(t as TabType)}
              onNavigateToLegal={(slug) => {
                setActiveTab('legal');
                setActiveLegalSlug(slug);
              }}
              onNavigateToFounder={() => setActiveTab('founder')}
            />
          )}

          {activeTab === 'services' && (
            <ServicesPage
              services={[]}
              darkMode={darkMode}
              isAdmin={isAdmin}
              onSelectServiceDetail={(slug) => {
                setActiveServiceSlug(slug);
                setActiveTab('serviceDetail');
              }}
              onRequestServiceDirectly={(s) => {
                setSelectedServiceForInquiry(s);
                setIsInquiryModalOpen(true);
              }}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioPage
              projects={projectsList}
              isAdmin={isAdmin}
              darkMode={darkMode}
              onRequestService={(s) => {
                setSelectedServiceForInquiry(s);
                setIsInquiryModalOpen(true);
              }}
            />
          )}

          {activeTab === 'team' && (
            <TeamPage
              members={teamMembers}
              isAdmin={isAdmin}
              darkMode={darkMode}
              onRefresh={loadDatabaseData}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsPage
              reviews={reviewsList}
              darkMode={darkMode}
              onAddReview={(newRev) => setReviewsList((prev) => [newRev, ...prev])}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'founder' && (
            <FounderPage
              darkMode={darkMode}
              onOpenServiceRequestModal={() => {
                setSelectedServiceForInquiry('Custom Build');
                setIsInquiryModalOpen(true);
              }}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden">
              <ChatWindow
                userId={currentChatUserId}
                userName={currentUser?.name || 'DigiWorku Client'}
                darkMode={darkMode}
                isAdmin={isAdmin}
                triggerToast={triggerToast}
              />
            </div>
          )}

          {activeTab === 'legal' && activeLegalSlug && (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
              <LegalPages
                slug={activeLegalSlug}
                darkMode={darkMode}
                onBack={() => setActiveTab('home')}
              />
            </div>
          )}

          {(activeTab === 'caseStudies' || activeTab === 'caseStudyDetail') && (
            <CaseStudies
              activeSlug={activeCaseStudySlug}
              darkMode={darkMode}
              onNavigateToSlug={(slug: string) => {
                setActiveCaseStudySlug(slug);
                setActiveTab('caseStudyDetail');
              }}
              onBackToListing={() => {
                setActiveCaseStudySlug(null);
                setActiveTab('caseStudies');
              }}
              onCTA={(serviceCategory?: string) => {
                setSelectedServiceForInquiry(serviceCategory || 'Website Development');
                setIsInquiryModalOpen(true);
              }}
            />
          )}
        </Suspense>
      </main>

      {/* Floating Chat shortcut button */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#00c853] hover:bg-[#00b04a] text-black shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Open Realtime Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Global Modals */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        darkMode={darkMode}
        preselectedService={selectedServiceForInquiry}
        onSuccessToast={triggerToast}
      />

      <FreelancerModal
        isOpen={isFreelancerModalOpen}
        onClose={() => setIsFreelancerModalOpen(false)}
        darkMode={darkMode}
        onSuccessToast={triggerToast}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        darkMode={darkMode}
        onClientAuthSuccess={(u) => {
          setCurrentUser(u);
          triggerToast(`Welcome back, ${u.name}!`);
        }}
        onAdminAuthSuccess={handleAdminAuthSuccess}
        defaultAdminMode={authModalAdminDefault}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 py-2.5 px-5 rounded-2xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-black text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[50vh] space-y-4">
      <div className="w-10 h-10 rounded-xl bg-[#00c853]/20 border border-[#00c853] flex items-center justify-center animate-spin">
        <Sparkles className="w-5 h-5 text-[#00c853]" />
      </div>
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
        Loading DigiWorku Architecture...
      </p>
    </div>
  );
}
