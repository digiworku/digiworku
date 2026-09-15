import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageSquare,
  Layers,
  Briefcase,
  Settings,
  LogOut,
  Send,
  Trash2,
  Copy,
  ArrowRight,
  ChevronRight,
  Plus,
  Search,
  Moon,
  Sun,
  Bell,
  ArrowUpRight,
  Download,
  Globe,
  Palette,
  Film,
  Megaphone,
  X,
  Check,
  TrendingUp,
  Clock,
  Sliders,
  User,
  FolderGit2,
  BriefcaseIcon,
  LineChart,
  Zap,
  Bookmark,
  Workflow,
  Award,
  AlertCircle,
  Paperclip,
  Mic,
  Image,
  FileText,
  FolderArchive,
  HardDrive,
  Music,
  Video,
  MapPin,
  FileUp,
  FileText as FileIcon,
  Rocket,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  LogIn,
  UserPlus,
  Shield,
  Menu,
  Home,
  LayoutDashboard,
  Users,
  Folder,
  HelpCircle,
  Star,
  BarChart3,
  UserCheck,
  CheckCircle2,
  Phone,
  MoreVertical,
  Database,
  DollarSign,
  Camera,
  Ban,
  UserMinus,
  Edit3,
  ExternalLink,
  WifiOff,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthForm } from './components/AuthForm';
import { AnimatedGridBackground } from './components/AnimatedGridBackground';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { LegalPages, type LegalPageSlug } from './components/LegalPages';
import { supabase } from './supabase';
// Helper to consistently get the unique user ID for chat, even for guests
export const getChatUserId = (currentUser: any) => {
  if (currentUser?.email) return currentUser.email;
  let guestId = localStorage.getItem('digiworku_guest_id');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('digiworku_guest_id', guestId);
  }
  return guestId;
};

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  clientName: string;
  impactResult?: string;
  created_at?: string;
}

export interface OfferingItem {
  title: string;
  desc: string;
  icon?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  desc: string;
}

export interface FeatureItem {
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'Development' | 'Design & Branding' | 'Video Production' | 'Marketing';
  price: string;
  icon: string;
  content?: string;
  intro?: string;
  overview?: string;
  offerings?: OfferingItem[];
  process?: ProcessStep[];
  features?: FeatureItem[];
  whyUs?: string[];
  deliverables?: string[];
  faqs?: FaqItem[];
}


// Map string icon names to React Element components
const getIconComponent = (iconName: string): React.ElementType => {
  const mapping: Record<string, React.ElementType> = {
    Globe,
    Palette,
    Film,
    Megaphone,
    Sparkles,
    Workflow,
    Zap,
    BarChart3,
    Database,
    Settings,
    Shield,
    Star,
    Home,
    Users
  };
  return mapping[iconName] || Sparkles;
};

const AVAILABLE_SERVICE_ICONS = [
  'Globe',
  'Palette',
  'Film',
  'Megaphone',
  'Sparkles',
  'Workflow',
  'Zap',
  'BarChart3',
  'Database',
  'Settings',
  'Shield',
  'Star'
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachment?: {
    filename: string;
    size: string;
    type: 'pdf' | 'image' | 'video' | 'zip' | 'voice' | 'drive' | 'archive' | 'other';
    url?: string;
  };
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-ugc-1',
    title: 'Viral D2C E-Commerce UGC Reel',
    description: 'High-converting Instagram & TikTok UGC short video featuring product unboxing, aesthetic lifestyle framing, and trending audio voiceover.',
    category: 'UGC Videos',
    tags: ['UGC', 'INSTAGRAM', 'REELS', 'D2C'],
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-1230-large.mp4',
    mediaType: 'video',
    clientName: 'GlowSkin Organics',
    impactResult: '2.4M Views & +58% Direct Purchase Conversion Rate'
  },
  {
    id: 'proj-gfx-1',
    title: 'Brand Identity & Visual Graphics Suite',
    description: 'Complete brand graphics package including vector logo mark, social media promotion banners, typography system, and product packaging vector files.',
    category: 'Graphics Design',
    tags: ['GRAPHICS', 'BRANDING', 'PACKAGING'],
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    clientName: 'Aura Premium Beverages',
    impactResult: '100% Brand Guidelines Standard & Retail Handoff'
  },
  {
    id: 'proj-1',
    title: 'EliteCommerce UI/UX',
    description: 'A complete overhaul of the shopping experience for a luxury fashion house, focusing on micro-interactions and seamless checkout flows.',
    category: 'UI/UX Design',
    tags: ['DESIGN', 'RETAIL'],
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    clientName: 'EliteCommerce',
    impactResult: '+45% conversion optimization with modern design standards'
  },
  {
    id: 'proj-3',
    title: 'Nexus Cloud Architecture',
    description: 'Scalable serverless infrastructure designed for high-concurrency real-time digital communication and transactional stability.',
    category: 'Web Development',
    tags: ['DEVELOPMENT', 'CLOUD'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    clientName: 'Nexus Inc.',
    impactResult: 'Zero outages under extreme 100k+ concurrent requests peak'
  }
];

// Initial Service Offerings matching Image 4
const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'serv-1',
    title: 'Website Development',
    description: 'Scalable, responsive, and high-performance web applications built with modern frameworks and robust security setups.',
    category: 'Development',
    price: '₹45,000',
    icon: 'Globe',
    content: `### Deep Dive: Comprehensive Website & Web Application Engineering

At DigiWorku, our Web Development methodology combines cutting-edge modern technologies (React, Next.js, TypeScript, Tailwind CSS, Node.js) with robust serverless architecture to deliver lightning-fast, SEO-optimized, and secure digital products.

#### What's Included in This Package:
- **Custom UI/UX Implementation**: Bespoke responsive designs tailored to your brand identity without clunky template dependencies.
- **Full-Stack Integration**: High-speed REST/GraphQL API connections, server-side rendering, and scalable database schemas (Supabase, PostgreSQL, MongoDB).
- **Performance & Security Suite**: 95+ Google Lighthouse speed scoring, SSL/TLS encryption, automated backups, and DDoS protection.
- **CMS & Admin Portal**: Easy-to-use content management dashboards allowing non-technical team members to update content instantly.

#### Development Lifecycle & Milestones:
1. **Discovery & Architecture Mapping** (Days 1-3): Wireframing, database schema planning, and technical specification lock.
2. **Sprint Execution & Prototype Review** (Days 4-14): Iterative frontend & backend engineering with live staging server updates.
3. **Quality Assurance & Security Audits** (Days 15-18): Cross-browser testing, penetration testing, and load testing.
4. **Deployment & Post-Launch Support** (Days 19-21): Production rollout, DNS configuration, and 30-day post-launch warranty.`
  },
  {
    id: 'serv-2',
    title: 'Graphic Design',
    description: 'Stunning visual assets, from social media graphics to corporate presentations that captivate your target audience.',
    category: 'Design & Branding',
    price: '₹8,000',
    icon: 'Palette',
    content: `### Deep Dive: High-Impact Visual Graphic Design & Brand Communication

Elevate your visual presence across all digital and print touchpoints with DigiWorku's elite graphic design suite. We craft eye-catching visual narratives that capture audience attention and drive conversion.

#### What's Included in This Package:
- **Social Media & Campaign Assets**: Premium custom templates, carousel graphics, promotional banners, and ad creatives formatted for all major platforms.
- **Corporate & Pitch Decks**: High-converting investor presentation decks, sales brochures, and annual report layouts.
- **Marketing Materials**: Print-ready flyers, business cards, billboards, vector icon sets, and custom illustrations.
- **Vector Source Files**: Full ownership of scalable vector files (.AI, .EPS, .SVG, .PNG, .PDF, Figma links).

#### Design Process:
1. **Brand Questionnaire & Moodboarding**: Aligning on color psychology, typography hierarchy, and competitive positioning.
2. **Concept Iterations**: Presenting 3 distinct visual directions within 48 hours.
3. **Refinement & Export**: Unlimited revisions on selected concept and multi-format asset export.`
  },
  {
    id: 'serv-3',
    title: 'Video Editing',
    description: 'Professional post-production for commercials, YouTube, and corporate videos with seamless transitions and motion graphics.',
    category: 'Video Production',
    price: '₹12,500',
    icon: 'Film',
    content: `### Deep Dive: Cinematic Video Post-Production & Motion Graphics

Transform raw footage into compelling cinematic visual stories. Our video engineering workflow produces broadcast-ready content optimized for social media feeds, YouTube, TV commercials, and corporate keynotes.

#### What's Included in This Package:
- **Precise Storyboarding & Cutting**: Expert pacing, dialogue trimming, multi-camera angle synchronization, and narrative structuring.
- **Color Grading & Visual FX**: Cinematic LUT color correction, custom motion graphic callouts, sound design, and audio mastering.
- **Multi-Format Export**: Rendered in crisp 4K UHD and optimized ratios for Instagram Reels (9:16), YouTube (16:9), and LinkedIn (1:1).
- **Subtitles & Captions**: Animated kinetic typography captions for high engagement on silent mobile feeds.

#### Production Timeline:
- Draft Cut delivery within 72 hours.
- 2 rounds of feedback implementation included.`
  },
  {
    id: 'serv-4',
    title: 'Branding',
    description: 'Complete brand identity kits including logo design, typography, color palettes, guidelines, and localized brand positioning.',
    category: 'Design & Branding',
    price: '₹30,000',
    icon: 'Palette',
    content: `### Deep Dive: Complete Brand Identity Strategy & Visual Ecosystem

A brand is more than just a logo—it's your market footprint. DigiWorku crafts unified, future-proof brand identities that convey trust, premium quality, and emotional connection.

#### What's Included in This Package:
- **Logo Design Architecture**: Primary logo, secondary mark, sub-mark, and favicon kit.
- **Comprehensive Brand Guidelines (Brand Book)**: 25+ page PDF documenting clear guidelines for logo usage, clear space, brand color palette (HEX, RGB, CMYK, Pantone), and typography pairings.
- **Tone of Voice & Messaging Rules**: Core brand values, slogan, elevator pitch, and communication style.
- **Stationery & Mockups**: Business card designs, letterheads, social media profile banners, and merchandise mockups.

#### Delivery Guarantee:
- 100% original custom visual artwork with full legal trademark assignment rights.`
  }
];

export interface CRMProject {
  id: string;
  name: string;
  leadName: string;
  leadAvatar: string;
  status: 'ON TRACK' | 'IN REVIEW' | 'STABLE' | 'OFF TRACK';
  healthScore: number;
  budget: string;
  description: string;
  progress: number;
  email?: string;
}

export interface CRMInquiry {
  id: string;
  clientName: string;
  projectName: string;
  timeAgo: string;
  summary: string;
  unread: boolean;
  budget?: string;
  status: 'new' | 'reviewed' | 'converted';
  // DB-mapped fields (from Supabase inquiries table)
  email?: string;
  mobile?: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatarUrl: string;
  companyName: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  lastMessageText: string;
  lastMessageTime: string;
  tag?: string;
  unreadCount: number;
  email: string;
  phone: string;
  activeProjectName: string;
  activeProjectBudget: string;
  activeProjectProgress: number;
  adminNotes: string;
  messages: ChatMessage[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  status: 'ONLINE' | 'OFF SHIFT';
  blocked?: boolean;
}

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Ananya Sharma',
    role: 'System Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-2',
    name: 'Kabir Rao',
    role: 'Lead prompt Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'ONLINE',
    blocked: false
  },
  {
    id: 'team-3',
    name: 'Neha Patel',
    role: 'UI/UX Craft Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'OFF SHIFT',
    blocked: false
  },
  {
    id: 'team-4',
    name: 'Aarav Kapoor',
    role: 'React D3 Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'ONLINE',
    blocked: false
  }
];

const INITIAL_CRM_PROJECTS: CRMProject[] = [
  {
    id: 'proj-1',
    name: 'EliteCommerce UI Revamp',
    leadName: 'Neha Gupta',
    leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'ON TRACK',
    healthScore: 98,
    budget: '₹4,50,000',
    description: 'Complete UI/UX redesign and Next.js frontend rebuild.',
    progress: 75
  },
  {
    id: 'proj-2',
    name: 'FinTrust Mobile App Security',
    leadName: 'Kabir Rao',
    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'STABLE',
    healthScore: 95,
    budget: '₹2,80,000',
    description: 'Biometric MFA & End-to-end encrypted transaction gateway.',
    progress: 90
  },
  {
    id: 'proj-3',
    name: 'Nexus Cloud Infrastructure',
    leadName: 'Aarav Kapoor',
    leadAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'IN REVIEW',
    healthScore: 88,
    budget: '₹6,00,000',
    description: 'Kubernetes orchestration and Supabase backend sync.',
    progress: 60
  }
];

const INITIAL_CRM_INQUIRIES: CRMInquiry[] = [
  {
    id: 'inq-1',
    clientName: 'Rahul Verma (VermaTech Solutions)',
    projectName: 'Custom AI Chatbot & Customer Portal',
    timeAgo: '10 mins ago',
    summary: 'Need a custom AI Assistant integrated into our customer portal to handle tier-1 support queries automatically.',
    unread: true,
    budget: '₹1,50,000 - ₹3,00,000',
    status: 'new'
  },
  {
    id: 'inq-2',
    clientName: 'Siddharth Mehta (GrowthSpark)',
    projectName: 'E-commerce Mobile App Development',
    timeAgo: '2 hours ago',
    summary: 'Looking for a dedicated React Native engineering squad to build a cross-platform mobile app in 6 weeks.',
    unread: false,
    budget: '₹3,50,000',
    status: 'reviewed'
  },
  {
    id: 'inq-3',
    clientName: 'Kavita Sundaram (Bloom Studio)',
    projectName: 'Brand Identity & Corporate Design Suite',
    timeAgo: '1 day ago',
    summary: 'Full brand guidelines, vector logo package, and animated social media kit for our new product launch.',
    unread: false,
    budget: '₹85,000',
    status: 'converted'
  }
];

const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'alex',
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    companyName: 'Rivera Tech',
    status: 'online',
    lastMessageText: "Checking the new feature build right now. Give me 5 minutes.",
    lastMessageTime: '12:32 PM',
    tag: 'WORKFLOW AUTOMATION',
    unreadCount: 0,
    email: 'alex.rivera@riveratech.com',
    phone: '+1 555-0199',
    activeProjectName: 'Workflow Automation',
    activeProjectBudget: '₹3,50,000',
    activeProjectProgress: 80,
    adminNotes: 'Alex is evaluating workflow features.',
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Welcome to DigiWorku! How can our engineering and design teams assist your project today?',
        timestamp: '12:00 PM'
      }
    ]
  }
];

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarInitials: string;
  createdAt: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Aditya Sen',
    role: 'Chief Architect, TechPulse',
    rating: 5,
    text: "Primacy in delivery parameters. The Indian development unit scaled our backend with extreme efficiency. Zero-mock pipelines built elegantly!",
    avatarInitials: 'AS',
    createdAt: '2 days ago'
  },
  {
    id: 'rev-2',
    name: 'Priya Kothari',
    role: 'Product Lead, Elevate Commerce',
    rating: 5,
    text: "Highly polished custom UI results. They did exactly what was described! Very communicative and responsive to our needs.",
    avatarInitials: 'PK',
    createdAt: '4 days ago'
  },
  {
    id: 'rev-3',
    name: 'Rohan Deshmukh',
    role: 'CTO, FinEdge Systems',
    rating: 5,
    text: "Outstanding turnaround time and code cleanliness. The Supabase integration and AI chat automation exceeded our expectations.",
    avatarInitials: 'RD',
    createdAt: '1 week ago'
  }
];

export default function App() {
  // Navigation & Screen Control
  // 'home' represents Image 1 (Landing Page / Main view)
  // 'chat' represents Image 2 (Dedicated Chat Workspace)
  // 'portfolio' represents Image 3 (Portfolio Showcase Panel)
  // Tab Navigation with Browser History Stack Support (Back Button)
  const tabToPath = (tab: string): string => {
    switch (tab) {
      case 'home': return '/';
      case 'services': return '/services';
      case 'portfolio': return '/portfolio';
      case 'projects': return '/projects';
      case 'team': return '/team';
      case 'inquiries': return '/inquiries';
      case 'reviews': return '/reviews';
      case 'chat': return '/chat';
      case 'settings': return '/settings';
      case 'analytics': return '/analytics';
      default: return '/' + tab;
    }
  };

  const pathToTab = (path: string) => {
    const cleanPath = path.replace(/\/$/, '') || '/';
    switch (cleanPath) {
      case '/': case '/home': return 'home' as const;
      case '/services': return 'services' as const;
      case '/portfolio': return 'portfolio' as const;
      case '/projects': return 'projects' as const;
      case '/team': return 'team' as const;
      case '/inquiries': return 'inquiries' as const;
      case '/reviews': return 'reviews' as const;
      case '/chat': return 'chat' as const;
      case '/settings': return 'settings' as const;
      case '/analytics': return 'analytics' as const;
      default: return 'home' as const;
    }
  };

  const [activeTabState, setActiveTabState] = useState<'home' | 'clients' | 'projects' | 'inquiries' | 'chat' | 'portfolio' | 'reviews' | 'team' | 'analytics' | 'settings' | 'services' | 'serviceDetail' | 'legal'>(() => {
    return pathToTab(window.location.pathname);
  });

  const [activeLegalSlug, setActiveLegalSlug] = useState<LegalPageSlug | null>(null);

  const setActiveTab = (tab: 'home' | 'clients' | 'projects' | 'inquiries' | 'chat' | 'portfolio' | 'reviews' | 'team' | 'analytics' | 'settings' | 'services' | 'serviceDetail' | 'legal') => {
    setActiveTabState(tab);
    const targetPath = tabToPath(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  const activeTab = activeTabState;

  // Listen to browser Back / Forward buttons (popstate event)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTabState(event.state.tab);
      } else {
        setActiveTabState(pathToTab(window.location.pathname));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Home Page Metrics State (Editable by user/admin)
  const [homeMetrics, setHomeMetrics] = useState<{ active: string; completed: string; pending: string }>(() => {
    const saved = localStorage.getItem('digiworku-home-metrics');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { active: '12+', completed: '500+', pending: '4' };
  });

  const [isEditingHomeMetrics, setIsEditingHomeMetrics] = useState<boolean>(false);
  const [editActiveVal, setEditActiveVal] = useState<string>(homeMetrics.active);
  const [editCompletedVal, setEditCompletedVal] = useState<string>(homeMetrics.completed);
  const [editPendingVal, setEditPendingVal] = useState<string>(homeMetrics.pending);

  const [activeServiceSlug, setActiveServiceSlug] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Supabase Backend Integration States
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Initializing connection to Supabase instance...');
  const [supabaseAutoSync, setSupabaseAutoSync] = useState<boolean>(true);
  const [isSupabaseSyncing, setIsSupabaseSyncing] = useState<boolean>(false);

  // Profile Drawer States
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [editProfileName, setEditProfileName] = useState<string>('');
  const [editProfileEmail, setEditProfileEmail] = useState<string>('');
  const [editProfileMobile, setEditProfileMobile] = useState<string>('');
  const [editProfileAvatar, setEditProfileAvatar] = useState<string>('');

  // Auto-Reply Management States (Disabled by default as requested)
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('digiworku-auto-reply-enabled');
    return saved !== null ? saved === 'true' : false;
  });

  const [autoReplyText, setAutoReplyText] = useState<string>(() => {
    const saved = localStorage.getItem('digiworku-auto-reply-text');
    return saved !== null ? saved : "Thank you for reaching out to DigiWorku! Our team has received your message and will update your project details shortly.";
  });

  const [isAutoReplyModalOpen, setIsAutoReplyModalOpen] = useState<boolean>(false);
  const [hasAutoReplied, setHasAutoReplied] = useState<boolean>(() => {
    // Always treat as already replied so auto-message never appears
    return true;
  });

  // Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Network Offline Monitor State
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Split-Panel Navigation Modes
  const [panelMode, setPanelMode] = useState<'user' | 'admin'>(() => {
    const savedMode = localStorage.getItem('digiworku-panel-mode');
    return (savedMode === 'admin' || savedMode === 'user') ? savedMode : 'user';
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('digiworku-is-admin') === 'true';
  });

  // Admin Authentication State variables (digiworku55@gmail.com / DigiWorku55@)
  const [adminEmailInput, setAdminEmailInput] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [isAdminAuthLoading, setIsAdminAuthLoading] = useState<boolean>(false);

  // Sync panel mode to localStorage
  useEffect(() => {
    localStorage.setItem('digiworku-panel-mode', panelMode);
  }, [panelMode]);

  // Sync Auto-Reply settings to localStorage
  useEffect(() => {
    localStorage.setItem('digiworku-auto-reply-enabled', String(autoReplyEnabled));
  }, [autoReplyEnabled]);

  useEffect(() => {
    localStorage.setItem('digiworku-auto-reply-text', autoReplyText);
  }, [autoReplyText]);

  // Monitor path changes or initial mount to switch mode to admin automatically when domain ends in /admin or hash has admin
  useEffect(() => {
    const checkPathnameAndRouteAdmin = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
      const search = window.location.search.toLowerCase();

      if (
        pathname === '/admin' ||
        pathname.endsWith('/admin') ||
        hash === 'admin' ||
        search.includes('admin')
      ) {
        setPanelMode('admin');
        setActiveTab('home');
        triggerToast("🔑 Routing to secure admin console node... Please authenticate.");
        return;
      }

      const validTabs: Array<'home' | 'clients' | 'projects' | 'inquiries' | 'chat' | 'portfolio' | 'reviews' | 'team' | 'analytics' | 'settings' | 'services' | 'serviceDetail' | 'legal'> = [
        'home', 'clients', 'projects', 'inquiries', 'chat', 'portfolio', 'reviews', 'team', 'analytics', 'settings', 'services', 'serviceDetail', 'legal'
      ];

      if (pathname.startsWith('/services/') && pathname !== '/services' && pathname !== '/services/') {
        const slug = pathname.replace('/services/', '');
        setActiveTab('serviceDetail');
        setActiveServiceSlug(slug);
        return;
      }

      const targetTab = validTabs.find(tab => pathname === `/${tab}` || hash === tab);
      if (targetTab) {
        setActiveTab(targetTab);
        if (targetTab !== 'serviceDetail') {
          setActiveServiceSlug(null);
        }
      }
    };

    // Run verification immediately
    checkPathnameAndRouteAdmin();

    // Listen to route mutations
    window.addEventListener('hashchange', checkPathnameAndRouteAdmin);
    window.addEventListener('popstate', checkPathnameAndRouteAdmin);
    return () => {
      window.removeEventListener('hashchange', checkPathnameAndRouteAdmin);
      window.removeEventListener('popstate', checkPathnameAndRouteAdmin);
    };
  }, []);

  // Safe exit translation helper restoring public domain clean of /admin
  const exitAdminPanelMode = () => {
    setPanelMode('user');
    setActiveTab('home');
    setIsSidebarOpen(false);

    try {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (pathname.endsWith('/admin') || pathname === '/admin') {
        window.history.pushState({}, '', '/');
      } else if (hash.includes('admin')) {
        window.history.pushState({}, '', window.location.pathname);
      }
    } catch (err) {
      console.warn("History pushState failed, fallback to state only reset:", err);
    }
  };

  // Admin Login Handle function
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminAuthLoading(true);
    setAdminAuthError(null);

    setTimeout(() => {
      if (adminEmailInput.trim() === 'digiworku55@gmail.com' && adminPasswordInput === 'DigiWorku55@') {
        setIsAdmin(true);
        localStorage.setItem('digiworku-is-admin', 'true');
        setAdminEmailInput('');
        setAdminPasswordInput('');
        setIsAdminAuthLoading(false);
        triggerToast("🔑 Admin Console Authenticated Successfully! Access Granted.");
      } else {
        setAdminAuthError("Access Denied: The email or passphrase does not match administrative records.");
        setAdminPasswordInput('');
        setIsAdminAuthLoading(false);
        triggerToast("❌ Authentication Failed: Please check your console keys.");
      }
    }, 900);
  };

  // CRM Admin Panel Live States
  const [crmProjectsList, setCrmProjectsList] = useState<CRMProject[]>(() => {
    const saved = localStorage.getItem('digiworku-crm-projects-v2');
    let projects: CRMProject[] = saved ? JSON.parse(saved) : INITIAL_CRM_PROJECTS;

    // Hard remove specific users
    projects = projects.map(p => p.leadName === 'Priya Sharma' ? { ...p, leadName: 'Neha Gupta' } : p);

    return projects;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('digiworku-team-members-v1');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({ name: '', role: '', avatarUrl: '', status: 'ONLINE' as 'ONLINE' | 'OFF SHIFT' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingPicMemberId, setEditingPicMemberId] = useState<string | null>(null);
  const [newPicUrl, setNewPicUrl] = useState('');

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ name: '', client: '', budget: '', desc: '' });

  // Analytics Dashboard Interactive States
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState<'revenue' | 'csat' | 'retention' | 'projects'>('revenue');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'6months' | '12months' | 'ytd'>('6months');
  const [analyticsHoveredPoint, setAnalyticsHoveredPoint] = useState<number | null>(null);
  const [analyticsShowComparison, setAnalyticsShowComparison] = useState<boolean>(true);


  const [crmInquiriesList, setCrmInquiriesList] = useState<CRMInquiry[]>(() => {
    const saved = localStorage.getItem('digiworku-crm-inquiries-v2');
    return saved ? JSON.parse(saved) : INITIAL_CRM_INQUIRIES;
  });

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('digiworku-services-v2');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [isAddingService, setIsAddingService] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormTitle, setServiceFormTitle] = useState<string>('');
  const [serviceFormDescription, setServiceFormDescription] = useState<string>('');
  const [serviceFormCategory, setServiceFormCategory] = useState<'Development' | 'Design & Branding' | 'Video Production' | 'Marketing'>('Development');
  const [serviceFormPrice, setServiceFormPrice] = useState<string>('');
  const [serviceFormIcon, setServiceFormIcon] = useState<string>('Globe');
  const [serviceFormContent, setServiceFormContent] = useState<string>('');

  // Extended Detailed Page Section States
  const [serviceFormOverview, setServiceFormOverview] = useState<string>('');
  const [serviceFormOfferings, setServiceFormOfferings] = useState<OfferingItem[]>([]);
  const [serviceFormProcess, setServiceFormProcess] = useState<ProcessStep[]>([]);
  const [serviceFormFeatures, setServiceFormFeatures] = useState<FeatureItem[]>([]);
  const [serviceFormWhyUs, setServiceFormWhyUs] = useState<string>('');
  const [serviceFormDeliverables, setServiceFormDeliverables] = useState<string>('');
  const [serviceFormFaqs, setServiceFormFaqs] = useState<FaqItem[]>([]);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);


  // Client Reviews List State
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('digiworku-reviews-v1');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Service Booking / Request Modal States
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState<boolean>(false);
  const [selectedRequestServiceTitle, setSelectedRequestServiceTitle] = useState<string>('Website Development');
  const [requestFormClientName, setRequestFormClientName] = useState<string>('');
  const [requestFormEmail, setRequestFormEmail] = useState<string>('');
  const [requestFormPhone, setRequestFormPhone] = useState<string>('');
  const [requestFormBudget, setRequestFormBudget] = useState<string>('₹45,000');
  const [requestFormDescription, setRequestFormDescription] = useState<string>('');
  const [isSubmittingServiceRequest, setIsSubmittingServiceRequest] = useState<boolean>(false);

  const handleOpenServiceRequestModal = (serviceTitle?: string) => {
    if (serviceTitle) {
      setSelectedRequestServiceTitle(serviceTitle);
      const found = servicesList.find(s => s.title === serviceTitle);
      if (found) setRequestFormBudget(found.price);
    }
    const savedUser = localStorage.getItem('digiworku-user-session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setRequestFormClientName(parsed.name);
        if (parsed.email) setRequestFormEmail(parsed.email);
        if (parsed.mobile) setRequestFormPhone(parsed.mobile);
      } catch (e) {}
    }
    setIsServiceRequestModalOpen(true);
  };

  const handleServiceRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestFormClientName.trim() || !requestFormEmail.trim()) {
      triggerToast("⚠️ Please fill in your name and corporate email address.");
      return;
    }

    setIsSubmittingServiceRequest(true);

    const inquiryId = `inq-${Date.now()}`;
    const summaryText = requestFormDescription.trim() || `Inquiry for ${selectedRequestServiceTitle}. Contact: ${requestFormEmail.trim()}, Phone: ${requestFormPhone.trim()}`;

    // Build local CRMInquiry object
    const newInquiry: CRMInquiry = {
      id: inquiryId,
      clientName: `${requestFormClientName.trim()}`,
      projectName: selectedRequestServiceTitle,
      timeAgo: 'Just now',
      summary: summaryText,
      unread: true,
      budget: requestFormBudget || '₹45,000',
      status: 'new',
      email: requestFormEmail.trim(),
      mobile: requestFormPhone.trim()
    };

    // Save to local state immediately (optimistic)
    setCrmInquiriesList(prev => [newInquiry, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📩 New Service Inquiry: ${selectedRequestServiceTitle}`,
        description: `Submitted by ${requestFormClientName.trim()} (${requestFormEmail.trim()})`,
        time: 'Just now',
        type: 'info',
        read: false,
        category: 'Inquiries'
      },
      ...prev
    ]);

    // Persist to Supabase (map to DB schema: id, name, email, mobile, message, status)
    try {
      const dbRecord = {
        id: inquiryId,
        name: requestFormClientName.trim(),
        email: requestFormEmail.trim(),
        mobile: requestFormPhone.trim() || null,
        message: `${selectedRequestServiceTitle}: ${summaryText} (Budget: ${requestFormBudget || '₹45,000'})`,
        status: 'new'
      };
      const { error: dbError } = await supabase.from('inquiries').insert(dbRecord);
      if (dbError) {
        console.warn('Supabase inquiry insert failed:', dbError.message);
      }
    } catch (dbErr: any) {
      console.warn('Supabase inquiry push error:', dbErr.message);
    }

    setIsSubmittingServiceRequest(false);
    setIsServiceRequestModalOpen(false);
    setRequestFormDescription('');
    triggerToast(`🎉 Service Request for "${selectedRequestServiceTitle}" submitted! Our leads will contact you.`);
  };

  // Freelancer Join Modal States
  const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState<boolean>(false);
  const [freelancerFormName, setFreelancerFormName] = useState<string>('');
  const [freelancerFormEmail, setFreelancerFormEmail] = useState<string>('');
  const [freelancerFormPhone, setFreelancerFormPhone] = useState<string>('');
  const [freelancerFormSkill, setFreelancerFormSkill] = useState<string>('Full Stack Developer (React / Node / Next.js)');
  const [freelancerFormPortfolio, setFreelancerFormPortfolio] = useState<string>('');
  const [freelancerFormBio, setFreelancerFormBio] = useState<string>('');
  const [isSubmittingFreelancer, setIsSubmittingFreelancer] = useState<boolean>(false);

  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancerFormName.trim() || !freelancerFormEmail.trim() || !freelancerFormPhone.trim()) {
      triggerToast('⚠️ Please complete all required contact details.');
      return;
    }

    setIsSubmittingFreelancer(true);

    const inquiryId = `inq-free-${Date.now()}`;
    const portfolioStr = freelancerFormPortfolio.trim() ? (freelancerFormPortfolio.trim().startsWith('http') ? freelancerFormPortfolio.trim() : `https://${freelancerFormPortfolio.trim()}`) : 'N/A';
    const summaryText = `Primary Skill: ${freelancerFormSkill} | Portfolio: ${portfolioStr} | Bio: ${freelancerFormBio.trim() || 'No bio provided'}`;

    const newInquiry: CRMInquiry = {
      id: inquiryId,
      clientName: `${freelancerFormName.trim()} (Freelancer Candidate)`,
      projectName: `👨‍💻 Freelancer Application (${freelancerFormSkill})`,
      timeAgo: 'Just now',
      summary: summaryText,
      unread: true,
      budget: 'Talent Network / Freelancer',
      status: 'new',
      email: freelancerFormEmail.trim(),
      mobile: freelancerFormPhone.trim()
    };

    // Save to local state
    setCrmInquiriesList(prev => [newInquiry, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `👨‍💻 New Freelancer Application`,
        description: `${freelancerFormName.trim()} applied for ${freelancerFormSkill}`,
        time: 'Just now',
        type: 'info',
        read: false,
        category: 'Inquiries'
      },
      ...prev
    ]);

    // Save to Supabase DB inquiries table
    try {
      const dbRecord = {
        id: inquiryId,
        name: `${freelancerFormName.trim()} (Freelancer Candidate)`,
        email: freelancerFormEmail.trim(),
        mobile: freelancerFormPhone.trim() || null,
        message: `👨‍💻 Freelancer Application (${freelancerFormSkill}): ${summaryText} (Budget: Talent Network)`,
        status: 'new'
      };
      const { error: dbError } = await supabase.from('inquiries').insert(dbRecord);
      if (dbError) {
        console.warn('Supabase freelancer inquiry insert failed:', dbError.message);
      }
    } catch (dbErr: any) {
      console.warn('Supabase freelancer inquiry push error:', dbErr.message);
    }

    setIsSubmittingFreelancer(false);
    setIsFreelancerModalOpen(false);

    // Reset form
    setFreelancerFormName('');
    setFreelancerFormEmail('');
    setFreelancerFormPhone('');
    setFreelancerFormSkill('Full Stack Developer (React / Node / Next.js)');
    setFreelancerFormPortfolio('');
    setFreelancerFormBio('');

    triggerToast('🎉 Freelancer application submitted successfully! Our team will review your application.');
  };

  const [chatThreadsList, setChatThreadsList] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('digiworku-crm-threads-v2');
    let threads: ChatThread[] = saved ? JSON.parse(saved) : [...INITIAL_CHAT_THREADS];

    // Hard remove specific users
    threads = threads.filter(t => !['aditya', 'priya', 'rajiv'].includes(t.id));

    const savedUser = localStorage.getItem('digiworku-user-session');
    const user = savedUser ? JSON.parse(savedUser) : null;

    const userId = getChatUserId(user);
    const hasThread = threads.some((t: ChatThread) => t.id === userId);
    if (!hasThread) {
      threads.unshift({
        id: userId,
        name: user?.name || 'Guest User',
        avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        companyName: user?.companyName || 'DigiWorku Client',
        status: 'online',
        lastMessageText: 'No messages yet',
        lastMessageTime: '',
        tag: 'CLIENT',
        unreadCount: 0,
        email: user?.email || '',
        phone: user?.mobile || '',
        activeProjectName: 'New Engagement',
        activeProjectBudget: '₹0',
        activeProjectProgress: 0,
        adminNotes: '',
        messages: []
      });
    } else {
      // Update existing thread with latest user info
      threads = threads.map(t => t.id === userId ? {
        ...t,
        name: user?.name || t.name,
        email: user?.email || t.email,
        phone: user?.mobile || t.phone,
        avatarUrl: user?.avatarUrl || t.avatarUrl,
      } : t);
    }
    return threads;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    const savedUser = localStorage.getItem('digiworku-user-session');
    const user = savedUser ? JSON.parse(savedUser) : null;
    return getChatUserId(user);
  });
  const [projectsViewMode, setProjectsViewMode] = useState<'kanban' | 'timeline'>('kanban');
  const [searchCrmProjectQuery, setSearchCrmProjectQuery] = useState<string>('');
  const [searchCrmInquiryQuery, setSearchCrmInquiryQuery] = useState<string>('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [selectedChatFilter, setSelectedChatFilter] = useState<'New' | 'Active' | 'Closed'>('Active');
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [adminMessageInput, setAdminMessageInput] = useState<string>('');

  const [isEditingActiveProject, setIsEditingActiveProject] = useState<boolean>(false);
  const [tempProjectName, setTempProjectName] = useState<string>('');
  const [tempProjectBudget, setTempProjectBudget] = useState<string>('');
  const [tempProjectProgress, setTempProjectProgress] = useState<number>(0);

  useEffect(() => {
    const activeThread = chatThreadsList.find(t => t.id === activeThreadId);
    if (activeThread) {
      setTempProjectName(activeThread.activeProjectName || '');
      setTempProjectBudget(activeThread.activeProjectBudget || '');
      setTempProjectProgress(activeThread.activeProjectProgress || 0);
    }
  }, [activeThreadId, isEditingActiveProject]);

  const handleSaveActiveProject = () => {
    setChatThreadsList(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          activeProjectName: tempProjectName,
          activeProjectBudget: tempProjectBudget,
          activeProjectProgress: tempProjectProgress
        };
      }
      return t;
    }));
    setIsEditingActiveProject(false);
    triggerToast("⚡ Active Project Details updated successfully!");
  };

  const handleUpdateAdminNotes = (noteVal: string) => {
    setChatThreadsList(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return { ...t, adminNotes: noteVal };
      }
      return t;
    }));
  };

  const handleSendQuotationMessage = () => {
    const timeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const quotationMsg = {
      id: `m-quote-${Date.now()}`,
      role: 'assistant' as const,
      content: "📄 [QUOTATION GENERATED]\n\nProject: Enterprise E-commerce UI Refresh\nScope: Interactive charts (D3.js) + full UI/UX revamp\nFinal Quotation: ₹4,50,000\nExecution Timeline: 4 weeks\n\nPlease let us know if you accept so we can start the onboarding sprint!",
      timestamp: timeFormatted
    };

    setChatThreadsList(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessageText: "Quotation Generated (₹4,50,000)",
          lastMessageTime: timeFormatted,
          messages: [...t.messages, quotationMsg]
        };
      }
      return t;
    }));

    if (activeThreadId === getChatUserId(currentUser)) {
      setChatHistory(prev => [...prev, quotationMsg]);
    }
    triggerToast("📄 Quotation generated & shared in client channel!");
  };

  const handleApproveProject = () => {
    const timeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const approvalMsg = {
      id: `m-approve-${Date.now()}`,
      role: 'assistant' as const,
      content: "✅ [PROJECT CONTRACT APPROVED & COMMITTED]\n\nThe contract and scope of work have been approved. Project parameters locked down, resources allocated, and dev sprint commenced! Let's build your scaling faster with us!",
      timestamp: timeFormatted
    };

    setChatThreadsList(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessageText: "Project Approved & Sprints Started",
          lastMessageTime: timeFormatted,
          activeProjectProgress: 100,
          messages: [...t.messages, approvalMsg]
        };
      }
      return t;
    }));

    if (activeThreadId === getChatUserId(currentUser)) {
      setChatHistory(prev => [...prev, approvalMsg]);
    }
    triggerToast("🎉 Project marked APPROVED & COMMITTED!");
  };

  const renderAdminChatConsole = () => {
    const activeThread = chatThreadsList.find(t => t.id === activeThreadId) || chatThreadsList[0];

    const filteredThreads = chatThreadsList.filter(thread => {
      const matchesSearch = thread.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        thread.companyName.toLowerCase().includes(chatSearchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedChatFilter === 'New') {
        return thread.unreadCount > 0;
      } else if (selectedChatFilter === 'Active') {
        return thread.activeProjectProgress < 100;
      } else if (selectedChatFilter === 'Closed') {
        return thread.activeProjectProgress === 100;
      }
      return true;
    });

    return (
      <motion.div
        key="tab-chat-admin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex min-h-0 bg-slate-50 dark:bg-[#0d0d0d] overflow-hidden"
      >
        {/* Left Column: Messages List Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-[#161616]/90 shrink-0">
          <div className="p-4.5 border-b border-slate-205 dark:border-slate-800 flex flex-col gap-3.5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Messages</h2>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-xl focus:border-[#00c853] focus:outline-none transition-all font-semibold"
              />
            </div>

            {/* Status Filters Bar */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs">
              {['New', 'Active', 'Closed'].map((filterName) => (
                <button
                  key={filterName}
                  onClick={() => setSelectedChatFilter(filterName as any)}
                  className={`flex-1 pb-2 font-bold transition-all relative cursor-pointer ${selectedChatFilter === filterName
                    ? 'text-[#00c853]'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  {filterName}
                  {selectedChatFilter === filterName && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c853]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List Scrolling body */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    if (thread.unreadCount > 0) {
                      setChatThreadsList(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
                    }
                  }}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors relative hover:bg-slate-100/70 dark:hover:bg-slate-800/30 cursor-pointer ${isActive ? 'bg-[#FFF3D6] dark:bg-[#00c853]/15 border-l-4 border-[#00c853]' : ''
                    }`}
                >
                  <span className="relative inline-block shrink-0">
                    <img
                      src={thread.avatarUrl}
                      alt={thread.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    {thread.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161616] animate-pulse" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#00311F] dark:text-slate-100 block truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] text-[#00311F]/70 dark:text-slate-400 block shrink-0 font-bold ml-1">
                        {thread.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#00311F]/80 dark:text-slate-300 truncate mt-0.5 font-medium leading-normal">
                      <span className="font-bold text-[#00311F] dark:text-slate-200">{thread.companyName}</span> • {thread.lastMessageText}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      {thread.tag ? (
                        <span className="p-1 px-2.5 rounded-md text-[10px] bg-[#00311F]/10 dark:bg-slate-800 text-[#00311F] dark:text-slate-300 font-extrabold uppercase tracking-tight block">
                          {thread.tag}
                        </span>
                      ) : (
                        <div />
                      )}

                      {thread.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#00c853] text-white flex items-center justify-center font-black text-[10px] shrink-0 animate-pulse">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredThreads.length === 0 && (
              <div className="p-10 text-center text-slate-450 text-xs text-slate-400 font-semibold">
                No conversations match your status filter.
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Chat Messages Viewport Panel */}
        {activeThread ? (
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0d0d0d]/40 min-w-0 h-full relative border-r border-slate-200 dark:border-slate-800">
            {/* Sub-Header info client */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#161616] shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                <span className="relative">
                  <img
                    src={activeThread.avatarUrl}
                    alt={activeThread.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                  {activeThread.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161616]" />
                  )}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                    {activeThread.name}
                  </h3>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-1 uppercase tracking-wider">
                    {activeThread.status === 'online' ? '• Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Top Header Contact Icons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoReplyModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00c853] bg-[#00c853]/10 hover:bg-[#00c853]/20 border border-[#00c853]/30 rounded-xl transition-all cursor-pointer"
                  title="Configure 10-second Auto Reply settings"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00c853]" />
                  <span className="hidden sm:inline">Auto-Reply {autoReplyEnabled ? '(10s Active)' : '(Disabled)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerToast(`📞 Audio calling client ${activeThread.name}...`)}
                  className="p-2 text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                  title="Voice line call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast(`📹 Dispatching secure Google Meet conference room link for ${activeThread.name}...`)}
                  className="p-2 text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                  title="Google Meet session"
                >
                  <Video className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete all messages for "${activeThread.name}" on both sides (Client & Admin)? This action cannot be undone.`)) {
                      const targetUserId = activeThread.email || activeThread.id;
                      
                      // 1. Delete from Supabase DB
                      try {
                        await supabase.from('messages').delete().eq('user_id', targetUserId);
                      } catch (err: any) {
                        console.warn("Failed deleting messages from Supabase:", err?.message || err);
                      }

                      // 2. Clear thread messages locally
                      setChatThreadsList(prev => prev.map(t => {
                        if (t.id === activeThread.id || t.id === targetUserId) {
                          return {
                            ...t,
                            lastMessageText: 'Chat cleared by Admin',
                            messages: []
                          };
                        }
                        return t;
                      }));

                      // 3. Clear chatHistory if active thread is current logged-in user
                      if (targetUserId === getChatUserId(currentUser)) {
                        setChatHistory([]);
                      }
                      localStorage.removeItem(`digiworku-messages-${targetUserId}`);
                      localStorage.removeItem('digiworku-messages');

                      triggerToast(`🗑️ Deleted all messages for "${activeThread.name}" on both sides!`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-1"
                  title="Delete all messages in this thread for both Admin and Client"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast("⚙️ Managing client directory support tokens...")}
                  className="p-2 text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroller body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="flex justify-center my-2 select-none">
                <span className="bg-slate-200/85 dark:bg-slate-800 text-slate-550 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  TODAY
                </span>
              </div>

              {activeThread.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="max-w-[75%] flex flex-col gap-0.5">
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-xs transition-all ${isUser
                          ? 'bg-white text-[#00311F] dark:bg-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 font-medium'
                          : 'bg-[#00311F] text-[#FFF7E6] dark:bg-[#00c853] dark:text-slate-950 rounded-tr-none border border-[#00311F] dark:border-emerald-500 font-medium'
                          }`}
                      >
                        {msg.attachment && (
                          <div className="mb-2 max-w-sm rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-2 border border-slate-200/50 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-[#00c853]/10 text-[#00c853] flex items-center justify-center font-bold">
                                📄
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="block text-xs font-bold truncate text-slate-800 dark:text-slate-250">
                                  {msg.attachment.filename}
                                </span>
                                <span className="block text-[9px] text-slate-450 dark:text-slate-400 font-extrabold uppercase mt-0.5">
                                  {msg.attachment.size} • {msg.attachment.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="break-words font-semibold">{msg.content}</div>

                        <div className={`text-[9px] font-bold text-right mt-1.5 select-none block leading-none ${isUser ? 'text-[#00311F]/60 dark:text-slate-400' : 'text-[#FFF7E6]/70 dark:text-slate-900/70'}`}>
                          {msg.timestamp} {!isUser && <span className="text-[#FFF7E6] dark:text-slate-900 font-extrabold ml-1">✓✓ Read</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex justify-start w-full">
                  <div className="p-3 bg-slate-200/80 dark:bg-slate-800 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Pill Actions under image design matches */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 bg-transparent">
              <button
                type="button"
                onClick={handleSendQuotationMessage}
                className="px-4 py-1.5 text-xs font-black text-[#00c853] bg-[#00c853]/5 hover:bg-[#00c853]/10 border border-[#00c853]/20 rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Send Quotation
              </button>
              <button
                type="button"
                onClick={handleApproveProject}
                className="px-4 py-1.5 text-xs font-black text-[#00c853] bg-[#00c853]/5 hover:bg-[#00c853]/10 border border-[#00c853]/20 rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Approve Project
              </button>
            </div>

            {/* Bottom Input Box Area Form */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161616] shrink-0">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!adminMessageInput.trim()) return;

                  const text = adminMessageInput.trim();
                  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                  const newMsgId = `msg_admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                  const newMsg = {
                    id: newMsgId,
                    role: 'assistant' as const,
                    content: text,
                    timestamp: time
                  };

                  setAdminMessageInput('');

                  // 1. Update state locally for the active thread only
                  setChatThreadsList(prev => prev.map(t => {
                    if (t.id === activeThreadId) {
                      return {
                        ...t,
                        lastMessageText: text,
                        lastMessageTime: time,
                        messages: [...t.messages, newMsg]
                      };
                    }
                    return t;
                  }));

                  // Also update chatHistory if the active thread is the currently logged-in user
                  const userId = getChatUserId(currentUser);
                  if (activeThreadId === userId) {
                    setChatHistory(prev => [...prev, newMsg]);
                  }

                  // 2. Write Admin reply to Supabase DB with user_id of active thread
                  try {
                    const threadUserId = activeThread?.email || activeThreadId;
                    await supabase.from('messages').insert([{
                      id: newMsgId,
                      role: 'admin',
                      content: text,
                      user_id: threadUserId,
                      created_at: new Date().toISOString()
                    }]);
                  } catch (err: any) {
                    console.warn("Failed saving admin message to Supabase:", err?.message || err);
                  }
                }}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => triggerToast("📂 Drop individual documents or media files to attach instantly.")}
                  className="p-1.5 rounded-full text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => triggerToast("😊 Voice messaging notes helper initialized.")}
                  className="p-1.5 rounded-full text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  🎙️
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={adminMessageInput}
                  onChange={(e) => setAdminMessageInput(e.target.value)}
                  className="flex-1 px-4.5 py-2.5 text-xs sm:text-sm rounded-full border border-slate-205 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00c853]/55 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 font-semibold"
                />

                <button
                  type="submit"
                  disabled={!adminMessageInput.trim()}
                  className="w-10 h-10 bg-[#00c853] hover:bg-emerald-600 disabled:opacity-40 text-white rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white fill-white translate-x-[1px]" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-16 h-16 opacity-30 animate-pulse text-[#00c853] mb-3" />
            <span>Select a conversation thread to view inquiries.</span>
          </div>
        )}

        {/* Right Column: Contact Detailed Profile Dossier card */}
        {activeThread && (
          <div className="w-80 overflow-y-auto bg-white dark:bg-[#161616] p-5 space-y-6 shrink-0 hidden lg:block">

            {/* Large Profile Picture with double active green ring spacer */}
            <div className="text-center space-y-3.5 pt-2">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full p-1 border-2 border-emerald-500 bg-white ring-4 ring-offset-2 ring-[#00c853]/20 dark:ring-offset-[#161616] dark:bg-slate-900 overflow-hidden">
                  <img
                    src={activeThread.avatarUrl}
                    alt={activeThread.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {activeThread.status === 'online' && (
                  <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-3 border-white dark:border-[#161616]" />
                )}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                  {activeThread.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                  {activeThread.companyName || 'Partner Representative'}
                </p>
              </div>

              {/* 2 Circle Social quick actions */}
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    window.location.href = `mailto:${activeThread.email}`;
                  }}
                  className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-450 hover:text-[#00c853] border border-slate-200/60 dark:border-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Email client"
                >
                  <Mail className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    window.location.href = `tel:${activeThread.phone}`;
                  }}
                  className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-450 hover:text-[#00c853] border border-slate-200/60 dark:border-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  title="Phone call"
                >
                  <Phone className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* CONTACT DETAILS blocks */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                Contact Details
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-650 dark:text-slate-350 block truncate font-semibold" title={activeThread.email}>
                    {activeThread.email}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-650 dark:text-slate-300 font-bold block">
                    {activeThread.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIVE PROJECT block details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                  Active Project
                </h4>
                <button
                  onClick={() => setIsEditingActiveProject(!isEditingActiveProject)}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-[#00c853] transition-colors cursor-pointer"
                  title="Configure project details"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>

              {isEditingActiveProject ? (
                <div className="space-y-3 pt-1">
                  {/* Project Name Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Project Name</label>
                    <input
                      type="text"
                      value={tempProjectName}
                      onChange={(e) => setTempProjectName(e.target.value)}
                      placeholder="e.g. Workflow Automation"
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#00c853] transition-colors text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Budget Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Budget</label>
                    <input
                      type="text"
                      value={tempProjectBudget}
                      onChange={(e) => setTempProjectBudget(e.target.value)}
                      placeholder="e.g. ₹3,50,000"
                      className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#00c853] transition-colors text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Progress Slider Input */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Progress</label>
                      <span className="text-[10px] text-slate-500 font-bold">{tempProjectProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={tempProjectProgress}
                      onChange={(e) => setTempProjectProgress(parseInt(e.target.value))}
                      className="w-full h-1.5 accent-[#00c853] bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Save/Cancel Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleSaveActiveProject}
                      className="flex-1 py-1.5 bg-[#00c853] hover:bg-[#00af48] text-white font-black text-[10px] tracking-wider uppercase rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingActiveProject(false)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-[10px] tracking-wider uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="block font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-tight">
                      {activeThread.activeProjectName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Budget</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {activeThread.activeProjectBudget}
                    </span>
                  </div>

                  {/* Progress slider bar styled like image */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full bg-slate-250 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00c853] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${activeThread.activeProjectProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>{activeThread.activeProjectProgress}% Progress</span>
                      <span>Phase 2</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AUTO-REPLY CONTROL CARD (10 Seconds delay & Admin editable / removable) */}
            <div className="p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00c853]" />
                  <h4 className="text-xs font-extrabold text-[#00311F] dark:text-white">Auto-Reply (10s Delay)</h4>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${autoReplyEnabled ? 'bg-emerald-500/20 text-[#00c853]' : 'bg-red-500/20 text-red-500'}`}>
                  {autoReplyEnabled ? 'ACTIVE (10s)' : 'DISABLED'}
                </span>
              </div>

              <p className="text-[10.5px] text-[#00311F]/80 dark:text-slate-300 font-medium leading-relaxed">
                Jab user msg karta hai to auto reply <strong>10 second</strong> baad receive hota hai. Aap yahan se text edit/remove kar sakte hain.
              </p>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#00311F]/70 dark:text-slate-400 uppercase tracking-widest block">Auto-Reply Message</label>
                <textarea
                  rows={3}
                  value={autoReplyText}
                  onChange={(e) => setAutoReplyText(e.target.value)}
                  placeholder="Enter auto reply text..."
                  disabled={!autoReplyEnabled}
                  className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FFFDF0] dark:bg-slate-950 focus:outline-none focus:border-[#00c853] text-[#00311F] dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('digiworku-auto-reply-text', autoReplyText);
                      localStorage.setItem('digiworku-auto-reply-enabled', String(autoReplyEnabled));
                      triggerToast("⚡ Auto-Reply message saved!");
                    }}
                    disabled={!autoReplyEnabled}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-[#00c853] text-white hover:bg-emerald-600 disabled:opacity-40 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextState = !autoReplyEnabled;
                      setAutoReplyEnabled(nextState);
                      localStorage.setItem('digiworku-auto-reply-enabled', String(nextState));
                      triggerToast(nextState ? "🟢 Auto-Reply enabled (10s delay)" : "🗑️ Auto-Reply disabled & removed!");
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${autoReplyEnabled
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30'
                    }`}
                  >
                    {autoReplyEnabled ? 'Remove Reply' : 'Enable Reply'}
                  </button>
                </div>

                {autoReplyEnabled && (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setHasAutoReplied(false);
                        localStorage.removeItem('digiworku-has-auto-replied');
                        triggerToast("🔄 Reset: Next user message will receive 10s auto-reply!");
                      }}
                      className="w-full py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors cursor-pointer text-center block"
                    >
                      ⚡ Re-trigger Auto-Reply for Next Message
                    </button>
                    <button
                      onClick={() => {
                        const defMsg = "Thank you for reaching out to DigiWorku! Our project manager has received your message and will respond shortly.";
                        setAutoReplyText(defMsg);
                        localStorage.setItem('digiworku-auto-reply-text', defMsg);
                        triggerToast("↺ Auto-Reply message reset to default.");
                      }}
                      className="w-full py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer text-center block"
                    >
                      Reset Default Message
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ADMIN NOTES textarea with direct saving */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Admin Notes
              </h4>

              <textarea
                placeholder="Add a private note about this client..."
                value={activeThread.adminNotes || ''}
                onChange={(e) => handleUpdateAdminNotes(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#00c853] transition-colors"
              />
            </div>

            {/* QUICK ACTIONS block buttons */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">
                Quick Actions
              </h4>

              <button
                onClick={() => triggerToast(`👥 Team delegation: Assigning Ananya Sharma to lead client requirements.`)}
                className="w-full py-2.5 px-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  🧑‍💻 <span className="group-hover:text-[#00c853] transition-colors">Assign to Team</span>
                </span>
                <span className="text-slate-355 text-[10px] shrink-0 font-extrabold">+</span>
              </button>

              <button
                onClick={handleSendQuotationMessage}
                className="w-full py-2.5 px-3.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  📄 <span className="group-hover:text-[#00c853] transition-colors">Generate Quotation</span>
                </span>
                <span className="text-[#00c853] shrink-0">⚡</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Save CRM states to local storage when changed
  useEffect(() => {
    localStorage.setItem('digiworku-crm-projects-v2', JSON.stringify(crmProjectsList));
  }, [crmProjectsList]);

  useEffect(() => {
    localStorage.setItem('digiworku-crm-inquiries-v2', JSON.stringify(crmInquiriesList));
  }, [crmInquiriesList]);

  useEffect(() => {
    localStorage.setItem('digiworku-crm-threads-v2', JSON.stringify(chatThreadsList));
  }, [chatThreadsList]);

  useEffect(() => {
    localStorage.setItem('digiworku-services-v2', JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem('digiworku-team-members-v1', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('digiworku-reviews-v1', JSON.stringify(reviewsList));
  }, [reviewsList]);

  // Theme state (Dark Mode / Light Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('digiworku-theme') === 'dark';
  });

  // Master platform state variables for Interactive Sandbox feel
  const [activeProjectsCount, setActiveProjectsCount] = useState<number>(3);
  const [completedProjectsCount, setCompletedProjectsCount] = useState<number>(12);
  const [pendingTasksCount, setPendingTasksCount] = useState<number>(5);
  const [totalClientsCount, setTotalClientsCount] = useState<number>(150);
  const [activeWorkflowsCount, setActiveWorkflowsCount] = useState<number>(24);

  // Chat system state (isolated per user)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const savedUser = localStorage.getItem('digiworku-user-session');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const userId = getChatUserId(user);
    const saved = localStorage.getItem(`digiworku-messages-${userId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Attachment States
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);
  const [fileInputAccept, setFileInputAccept] = useState<string>('*/*');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);

  // Close attachment menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    if (isAttachmentMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachmentMenuOpen]);

  // User Authentication States (Get Started feature)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatarUrl: string; registered?: boolean; mobile?: string } | null>(() => {
    const saved = localStorage.getItem('digiworku-user-session');
    return saved ? JSON.parse(saved) : null;
  });

  // Portfolio items and filters
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('digiworku-projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [portfolioFilter, setPortfolioFilter] = useState<string>('All');
  const [searchProjectQuery, setSearchProjectQuery] = useState<string>('');

  // Admin Project CRUD States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<ProjectItem | null>(null);

  const [projectFormTitle, setProjectFormTitle] = useState<string>('');
  const [projectFormCategory, setProjectFormCategory] = useState<string>('UGC Videos');
  const [projectFormCustomCategory, setProjectFormCustomCategory] = useState<string>('');
  const [projectFormMediaType, setProjectFormMediaType] = useState<'image' | 'video'>('image');
  const [projectFormImageUrl, setProjectFormImageUrl] = useState<string>('');
  const [projectFormVideoUrl, setProjectFormVideoUrl] = useState<string>('');
  const [projectFormClientName, setProjectFormClientName] = useState<string>('');
  const [projectFormDescription, setProjectFormDescription] = useState<string>('');
  const [projectFormTags, setProjectFormTags] = useState<string>('');
  const [projectFormImpactResult, setProjectFormImpactResult] = useState<string>('');

  // Sync projectsList to localStorage
  useEffect(() => {
    localStorage.setItem('digiworku-projects', JSON.stringify(projectsList));
  }, [projectsList]);

  // Fetch Projects from Supabase on mount
  useEffect(() => {
    const fetchProjectsFromDB = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const formatted: ProjectItem[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',') : []),
            imageUrl: item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
            videoUrl: item.video_url || item.videoUrl || undefined,
            mediaType: item.media_type || item.mediaType || (item.video_url || item.videoUrl ? 'video' : 'image'),
            clientName: item.client_name || item.clientName || 'DigiWorku Client',
            impactResult: item.impact_result || item.impactResult || undefined,
            created_at: item.created_at
          }));
          setProjectsList(formatted);
        }
      } catch (e) {
        console.log('Supabase projects table fetch notice:', e);
      }
    };
    fetchProjectsFromDB();
  }, []);

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectFormTitle('');
    setProjectFormCategory('UGC Videos');
    setProjectFormCustomCategory('');
    setProjectFormMediaType('image');
    setProjectFormImageUrl('');
    setProjectFormVideoUrl('');
    setProjectFormClientName('');
    setProjectFormDescription('');
    setProjectFormTags('');
    setProjectFormImpactResult('');
  };

  const handleOpenAddProject = () => {
    resetProjectForm();
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjectFormTitle(proj.title);
    setProjectFormCategory(proj.category);
    setProjectFormCustomCategory('');
    setProjectFormMediaType(proj.mediaType || (proj.videoUrl ? 'video' : 'image'));
    setProjectFormImageUrl(proj.imageUrl || '');
    setProjectFormVideoUrl(proj.videoUrl || '');
    setProjectFormClientName(proj.clientName || '');
    setProjectFormDescription(proj.description || '');
    setProjectFormTags(Array.isArray(proj.tags) ? proj.tags.join(', ') : '');
    setProjectFormImpactResult(proj.impactResult || '');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async () => {
    const title = projectFormTitle.trim();
    const finalCategory = (projectFormCategory === 'Custom...' ? projectFormCustomCategory : projectFormCategory).trim() || 'General';
    const clientName = projectFormClientName.trim() || 'DigiWorku Client';
    const description = projectFormDescription.trim();
    if (!title || !description) {
      triggerToast("⚠️ Please enter Project Title and Description.");
      return;
    }

    const tagsArray = projectFormTags.split(',').map(t => t.trim().toUpperCase()).filter(Boolean);
    const fallbackImage = 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80';

    const newProjItem: ProjectItem = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title,
      category: finalCategory,
      description,
      clientName,
      tags: tagsArray.length > 0 ? tagsArray : [finalCategory.toUpperCase()],
      imageUrl: projectFormImageUrl.trim() || fallbackImage,
      videoUrl: projectFormMediaType === 'video' ? projectFormVideoUrl.trim() : undefined,
      mediaType: projectFormMediaType,
      impactResult: projectFormImpactResult.trim() || undefined,
      created_at: new Date().toISOString()
    };

    if (editingProject) {
      setProjectsList(prev => prev.map(p => p.id === editingProject.id ? newProjItem : p));
      triggerToast(`✨ Updated project "${title}"`);
    } else {
      setProjectsList(prev => [newProjItem, ...prev]);
      triggerToast(`🚀 Added new project "${title}" to Portfolio!`);
    }

    // Database Sync (Supabase)
    try {
      const dbPayload = {
        id: newProjItem.id,
        title: newProjItem.title,
        description: newProjItem.description,
        category: newProjItem.category,
        tags: newProjItem.tags,
        image_url: newProjItem.imageUrl,
        video_url: newProjItem.videoUrl,
        media_type: newProjItem.mediaType,
        client_name: newProjItem.clientName,
        impact_result: newProjItem.impactResult
      };
      await supabase.from('projects').upsert(dbPayload);
    } catch (e) {
      console.log("Supabase project upsert notice:", e);
    }

    setIsProjectModalOpen(false);
    resetProjectForm();
  };

  const handleDeleteProject = async (id: string, title: string) => {
    setProjectsList(prev => prev.filter(p => p.id !== id));
    triggerToast(`🗑️ Deleted project "${title}"`);
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.log("Supabase delete project notice:", e);
    }
  };

  // Service item variables
  const [serviceCategories, setServiceCategories] = useState({
    'Development': true,
    'Design & Branding': true,
    'Video Production': true,
    'Marketing': true
  });
  const [searchServiceQuery, setSearchServiceQuery] = useState<string>('');

  // Interactive metrics state indicators
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean legacy global chat key on load
  useEffect(() => {
    localStorage.removeItem('digiworku-messages');
  }, []);

  // Sync current user chat history whenever currentUser changes (login / signup / logout)
  useEffect(() => {
    const userId = getChatUserId(currentUser);
    const saved = localStorage.getItem(`digiworku-messages-${userId}`);
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        setChatHistory([]);
      }
    } else {
      setChatHistory([]);
    }
  }, [currentUser]);

  useEffect(() => {
    const userId = getChatUserId(currentUser);
    localStorage.setItem(`digiworku-messages-${userId}`, JSON.stringify(chatHistory));
    scrollToBottom();
  }, [chatHistory, currentUser]);

  // Cross-tab real-time sync for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;

      try {
        switch (e.key) {
          case 'digiworku-crm-projects-v2':
            setCrmProjectsList(JSON.parse(e.newValue));
            break;
          case 'digiworku-crm-inquiries-v2':
            setCrmInquiriesList(JSON.parse(e.newValue));
            break;
          case 'digiworku-services-v2':
            setServicesList(JSON.parse(e.newValue));
            break;
          case 'digiworku-crm-threads-v2':
            setChatThreadsList(JSON.parse(e.newValue));
            break;
          case 'digiworku-projects':
            setProjectsList(JSON.parse(e.newValue));
            break;
          case 'digiworku-messages':
          case `digiworku-messages-${getChatUserId(currentUser)}`:
            setChatHistory(JSON.parse(e.newValue));
            break;
          case 'digiworku-broadcast-notification':
            const newNotif = JSON.parse(e.newValue);
            setNotifications(prev => [newNotif, ...prev]);
            break;
          case 'digiworku-user-session':
            setCurrentUser(JSON.parse(e.newValue));
            break;
          case 'digiworku-theme':
            setDarkMode(e.newValue === 'dark');
            break;
        }
      } catch (err) {
        console.error("Storage sync parse error:", err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Synchronize User Chat to their thread — keyed by current user's email
  useEffect(() => {
    const userId = getChatUserId(currentUser);
    setChatThreadsList(prev => {
      const thread = prev.find(t => t.id === userId);
      if (thread) {
        const isDifferent = thread.messages.length !== chatHistory.length ||
          thread.messages.some((m, idx) => m.id !== chatHistory[idx]?.id || m.content !== chatHistory[idx]?.content) ||
          thread.name !== (currentUser?.name || 'Guest User') ||
          thread.email !== (currentUser?.email || '') ||
          thread.phone !== (currentUser?.mobile || '');
        if (isDifferent) {
          const lastMsg = chatHistory[chatHistory.length - 1];
          return prev.map(t => t.id === userId ? {
            ...t,
            messages: chatHistory,
            lastMessageText: lastMsg ? lastMsg.content : t.lastMessageText,
            lastMessageTime: lastMsg ? lastMsg.timestamp : t.lastMessageTime,
            name: currentUser?.name || t.name,
            email: currentUser?.email || t.email,
            phone: currentUser?.mobile || t.phone,
            avatarUrl: currentUser?.avatarUrl || t.avatarUrl
          } : t);
        }
      } else if (currentUser) {
        // Create new thread for this user if it doesn't exist
        const lastMsg = chatHistory[chatHistory.length - 1];
        const newThread: ChatThread = {
          id: userId,
          name: currentUser.name || 'Guest User',
          avatarUrl: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          companyName: 'DigiWorku Client',
          status: 'online',
          lastMessageText: lastMsg ? lastMsg.content : 'No messages yet',
          lastMessageTime: lastMsg ? lastMsg.timestamp : '',
          tag: 'CLIENT',
          unreadCount: chatHistory.filter(m => m.role === 'user').length,
          email: currentUser.email || '',
          phone: currentUser.mobile || '',
          activeProjectName: 'New Engagement',
          activeProjectBudget: '₹0',
          activeProjectProgress: 0,
          adminNotes: '',
          messages: chatHistory
        };
        return [newThread, ...prev.filter(t => t.id !== userId)];
      }
      return prev;
    });
  }, [chatHistory, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync profile details state
  useEffect(() => {
    if (currentUser) {
      setEditProfileName(currentUser.name || '');
      setEditProfileEmail(currentUser.email || '');
      setEditProfileMobile(currentUser.mobile || '');
      setEditProfileAvatar(currentUser.avatarUrl || '');
    } else {
      setEditProfileName('');
      setEditProfileEmail('');
      setEditProfileMobile('');
      setEditProfileAvatar('');
    }
  }, [currentUser, isProfileOpen]);

  // Toggle dark mode classes on page
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('digiworku-theme', !darkMode ? 'dark' : 'light');
  };

  // Toast confirmation feedback trigger
  const triggerToast = (text: string) => {
    // Disabled as requested: no toast popups should show up anywhere on clicking any button or icon
  };

  // Fetch inquiries from Supabase DB and merge with local state
  const fetchInquiriesFromDB = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('fetchInquiriesFromDB error:', error.message);
        return;
      }

      if (data && data.length > 0) {
        // Map DB rows to CRMInquiry format
        const dbInquiries: CRMInquiry[] = data.map((row: any) => {
          // Parse message field: format is "ProjectName: Summary (Budget: X)"
          const msgParts = (row.message || '').split(': ');
          const projectName = msgParts.length > 1 ? msgParts[0] : 'Service Inquiry';
          const summaryRaw = msgParts.slice(1).join(': ');
          const budgetMatch = summaryRaw.match(/\(Budget: (.+?)\)/);
          const budget = budgetMatch ? budgetMatch[1] : undefined;
          const summary = summaryRaw.replace(/\s*\(Budget: .+?\)/, '').trim() || summaryRaw;

          // Calculate timeAgo from created_at
          const createdAt = new Date(row.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);
          const timeAgo = diffDays > 0 ? `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
            : diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
            : diffMins > 1 ? `${diffMins} mins ago` : 'Just now';

          const statusMap: Record<string, CRMInquiry['status']> = {
            'new': 'new', 'New': 'new',
            'reviewed': 'reviewed', 'Reviewed': 'reviewed',
            'converted': 'converted', 'Converted': 'converted'
          };

          return {
            id: row.id,
            clientName: row.name || 'Unknown Client',
            projectName,
            timeAgo,
            summary: summary || 'No summary provided.',
            unread: row.status === 'new' || row.status === 'New',
            budget: budget !== 'N/A' ? budget : undefined,
            status: statusMap[row.status] || 'new',
            email: row.email || '',
            mobile: row.mobile || ''
          };
        });

        // Merge DB inquiries with any local-only ones (avoid duplicates)
        setCrmInquiriesList(prev => {
          const dbIds = new Set(dbInquiries.map(i => i.id));
          const localOnly = prev.filter(i => !dbIds.has(i.id));
          return [...dbInquiries, ...localOnly];
        });
      }
    } catch (err: any) {
      console.warn('fetchInquiriesFromDB catch:', err.message);
    }
  };

  // Fetch live chat messages from Supabase DB (Client isolated history + Admin multi-thread sync)
  const fetchMessagesFromDB = async () => {
    const userId = getChatUserId(currentUser);

    // 1. Fetch current logged in user's chat messages for client workspace
    try {
      const { data: userData, error: userError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (!userError && userData) {
        const dbUserMessages: ChatMessage[] = userData.map((row: any) => ({
          id: row.id,
          role: (row.role === 'admin' || row.role === 'assistant') ? 'assistant' : 'user',
          content: row.content || '',
          timestamp: new Date(row.created_at || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        }));
        setChatHistory(dbUserMessages);
      }
    } catch (err: any) {
      console.warn('fetchMessagesFromDB user error:', err?.message || err);
    }

    // 2. Fetch ALL messages for Admin to isolate and display per-user chat threads
    try {
      const { data: allData, error: allError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!allError && allData && allData.length > 0) {
        const userGroupMap = new Map<string, any[]>();
        allData.forEach((row: any) => {
          const uid = row.user_id || 'unknown_guest';
          if (!userGroupMap.has(uid)) {
            userGroupMap.set(uid, []);
          }
          userGroupMap.get(uid)!.push(row);
        });

        setChatThreadsList(prevThreads => {
          const updatedThreads = [...prevThreads];

          userGroupMap.forEach((rows, uid) => {
            const threadMsgs: ChatMessage[] = rows.map((row: any) => ({
              id: row.id,
              role: (row.role === 'admin' || row.role === 'assistant') ? 'assistant' : 'user',
              content: row.content || '',
              timestamp: new Date(row.created_at || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            }));

            const lastMsg = threadMsgs[threadMsgs.length - 1];
            const existingIndex = updatedThreads.findIndex(t => t.id === uid || t.email === uid);

            const matchingInquiry = crmInquiriesList.find(inq => 
              (inq.clientName && inq.clientName.toLowerCase().includes(uid.toLowerCase())) || 
              (uid.toLowerCase().includes(inq.clientName.toLowerCase()))
            );
            const isCurrentUser = uid === currentUser?.email;

            const resolvedName = isCurrentUser 
              ? (currentUser?.name || uid)
              : (matchingInquiry ? matchingInquiry.clientName : (existingIndex >= 0 ? updatedThreads[existingIndex].name : (uid.includes('@') ? uid.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Client ' + uid)));

            const resolvedEmail = uid.includes('@') ? uid : (matchingInquiry ? (matchingInquiry.clientName.includes('@') ? matchingInquiry.clientName : '') : '');

            if (existingIndex >= 0) {
              updatedThreads[existingIndex] = {
                ...updatedThreads[existingIndex],
                name: resolvedName || updatedThreads[existingIndex].name,
                email: resolvedEmail || updatedThreads[existingIndex].email,
                lastMessageText: lastMsg ? lastMsg.content : updatedThreads[existingIndex].lastMessageText,
                lastMessageTime: lastMsg ? lastMsg.timestamp : updatedThreads[existingIndex].lastMessageTime,
                messages: threadMsgs
              };
            } else {
              updatedThreads.unshift({
                id: uid,
                name: resolvedName,
                avatarUrl: isCurrentUser && currentUser?.avatarUrl ? currentUser.avatarUrl : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
                companyName: matchingInquiry ? matchingInquiry.projectName : 'DigiWorku Client',
                status: 'online',
                lastMessageText: lastMsg ? lastMsg.content : 'No messages yet',
                lastMessageTime: lastMsg ? lastMsg.timestamp : '',
                tag: 'CLIENT',
                unreadCount: threadMsgs.filter(m => m.role === 'user').length > 0 ? 1 : 0,
                email: resolvedEmail,
                phone: currentUser?.mobile || '+91 98765 43210',
                activeProjectName: matchingInquiry ? matchingInquiry.projectName : 'Digital Engagement',
                activeProjectBudget: matchingInquiry ? (matchingInquiry.budget || '₹45,000') : '₹45,000',
                activeProjectProgress: 25,
                adminNotes: '',
                messages: threadMsgs
              });
            }
          });

          return updatedThreads;
        });
      }
    } catch (err: any) {
      console.warn('fetchMessagesFromDB admin error:', err?.message || err);
    }
  };

  // Validate Supabase Connection on Component Mount & start Chat Polling
  useEffect(() => {
    async function checkSupabase() {
      try {
        setSupabaseStatus('checking');
        const { error } = await supabase.from('inquiries').select('count').limit(1);
        if (error) {
          setSupabaseStatus('error');
          setSupabaseMessage(`Connection failed: ${error.message}`);
        } else {
          setSupabaseStatus('connected');
          setSupabaseMessage('Securely linked to Supabase project rjxbdjgagizjmjwnlbxx ✅');
          await fetchInquiriesFromDB();
          await fetchMessagesFromDB();
        }
      } catch (err: any) {
        setSupabaseStatus('error');
        setSupabaseMessage(`Connection error: ${err?.message || 'Failed to ping Supabase API endpoint. Verify credentials.'}`);
      }
    }
    checkSupabase();

    // Live Chat polling interval every 2.5 seconds
    const interval = setInterval(() => {
      fetchMessagesFromDB();
    }, 2500);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Manual Supabase connection check trigger
  const handleCheckSupabaseConnection = async () => {
    try {
      setSupabaseStatus('checking');
      triggerToast("🔄 Pinging Supabase endpoint...");
      const { error } = await supabase.auth.getSession();
      if (error) {
        setSupabaseStatus('error');
        setSupabaseMessage(`Connection failed: ${error.message}`);
        triggerToast("❌ Supabase connection failed.");
      } else {
        setSupabaseStatus('connected');
        setSupabaseMessage('Securely linked to Supabase project rjxbdjgagizjmjwnlbxx ✅');
        triggerToast("✅ Supabase connection verified!");
      }
    } catch (err: any) {
      setSupabaseStatus('error');
      setSupabaseMessage(`Connection error: ${err?.message || 'Failed to contact Supabase.'}`);
      triggerToast("❌ Supabase connection failed.");
    }
  };

  // Synchronize all local storage / memory states to Supabase real backend tables
  const handleSyncToSupabase = async () => {
    if (isSupabaseSyncing) return;
    setIsSupabaseSyncing(true);
    triggerToast("⏳ Commencing Supabase synchronization...");

    let successCount = 0;
    let errors: string[] = [];

    try {
      // 1. Sync Inquiries (to inquiries table)
      if (crmInquiriesList && crmInquiriesList.length > 0) {
        try {
          const formattedInquiries = crmInquiriesList.map(inq => ({
            id: inq.id,
            name: inq.clientName || 'Anonymous Client',
            email: inq.clientName.includes('@') ? inq.clientName : '',
            mobile: '',
            message: `${inq.projectName}: ${inq.summary} (Budget: ${inq.budget || 'N/A'})`,
            status: inq.status || 'new',
            created_at: new Date().toISOString()
          }));

          const { error } = await supabase
            .from('inquiries')
            .upsert(formattedInquiries, { onConflict: 'id' });

          if (error) {
            errors.push(`Inquiries upsert failed: ${error.message}`);
          } else {
            successCount += formattedInquiries.length;
          }
        } catch (err: any) {
          errors.push(`Inquiries upsert failed: ${err.message || err}`);
        }
      }

      // 2. Sync Projects (to projects table)
      if (projectsList && projectsList.length > 0) {
        try {
          const formattedProjects = projectsList.map(proj => ({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            category: proj.category,
            tags: proj.tags || [],
            image_url: proj.imageUrl,
            client_name: proj.clientName,
            impact_result: proj.impactResult || '',
            created_at: new Date().toISOString()
          }));

          const { error } = await supabase
            .from('projects')
            .upsert(formattedProjects, { onConflict: 'id' });

          if (error) {
            errors.push(`Projects upsert failed: ${error.message}`);
          } else {
            successCount += formattedProjects.length;
          }
        } catch (err: any) {
          errors.push(`Projects upsert failed: ${err.message || err}`);
        }
      }

      // 3. Sync Messages (to messages table)
      if (chatHistory && chatHistory.length > 0) {
        try {
          const formattedMessages = chatHistory.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            created_at: new Date().toISOString()
          }));

          const { error } = await supabase
            .from('messages')
            .upsert(formattedMessages, { onConflict: 'id' });

          if (error) {
            errors.push(`Messages upsert failed: ${error.message}`);
          } else {
            successCount += formattedMessages.length;
          }
        } catch (err: any) {
          errors.push(`Messages upsert failed: ${err.message || err}`);
        }
      }

      if (errors.length > 0) {
        console.error("Supabase sync errors:", errors);
        alert(
          "⚠️ Schema Sync Partially Incomplete\n\n" +
          "Could not write to all tables in Supabase.\n" +
          "This is usually because the tables 'inquiries', 'projects', or 'messages' do not exist yet in your database.\n\n" +
          "Please scroll down in the Settings tab, click 'Show SQL Schema', copy the SQL block, and execute it inside your Supabase Project's SQL Editor to set up the tables!"
        );
        triggerToast("⚠️ Sync partially failed. Check tables schema.");
      } else {
        triggerToast(`🎉 Successfully synchronized ${successCount} entries to Supabase!`);
      }
    } catch (globalErr: any) {
      alert(`Sync failure: ${globalErr.message || globalErr}`);
      triggerToast("❌ Supabase synchronization failed.");
    } finally {
      setIsSupabaseSyncing(false);
    }
  };

  // Live Chat PM handling with AI API integration & intelligent fallbacks
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage.trim();
    const timeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newUserMsg: ChatMessage = {
      id: `msg_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: userText,
      timestamp: timeFormatted
    };

    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setInputMessage('');

    // Save message to Supabase DB 'messages' table with user_id for per-user isolation
    const userId = getChatUserId(currentUser);
    try {
      await supabase.from('messages').insert([{
        id: newUserMsg.id,
        role: 'user',
        content: userText,
        user_id: userId,
        created_at: new Date().toISOString()
      }]);
    } catch (err: any) {
      console.warn("Failed saving user message to Supabase:", err?.message || err);
    }

    // Update Admin thread list state for this specific user
    setChatThreadsList(prev => prev.map(t => {
      if (t.id === userId) {
        return {
          ...t,
          lastMessageText: userText,
          lastMessageTime: timeFormatted,
          messages: [...t.messages, newUserMsg],
          unreadCount: t.unreadCount + 1
        };
      }
      return t;
    }));

    // First-time Admin auto-reply trigger if enabled
    if (autoReplyEnabled && !hasAutoReplied) {
      setHasAutoReplied(true);
      localStorage.setItem('digiworku-has-auto-replied', 'true');
      setIsChatLoading(true);

      setTimeout(() => {
        const replyText = autoReplyText || "Thank you for reaching out to DigiWorku! Our team has received your message and will update your project details shortly.";
        const newBotMsg: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setChatHistory(prev => [...prev, newBotMsg]);
        setIsChatLoading(false);
      }, 1500);
      return;
    }

    // AI Response generation via /api/chat or fallback engine
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: updatedHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
          systemInstruction: "You are the DigiWorku Lead Client Partner and AI Assistant. Provide helpful, concise, professional answers about engineering, design, video editing, branding, and digital workforce services."
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = data.text || "Thank you for your message! Our engineering leads have updated your request context.";
        const newBotMsg: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          role: 'assistant',
          content: botReply,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setChatHistory(prev => [...prev, newBotMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Intelligent local fallback response
      let fallbackText = "Understood! I have logged this requirement in your DigiWorku project workspace. Our team lead will review and respond shortly.";
      const lower = userText.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('pricing')) {
        fallbackText = "Our core packages start at ₹8,000 for Graphic Design, ₹12,500 for Video Editing, ₹30,000 for Branding, and ₹45,000 for Web Application Development. We also offer custom enterprise billing!";
      } else if (lower.includes('team') || lower.includes('engineer') || lower.includes('developer') || lower.includes('who')) {
        fallbackText = "DigiWorku pairs you with dedicated senior developers, UI/UX designers, and project managers operating in a high-speed agile sprint pipeline.";
      } else if (lower.includes('service') || lower.includes('web') || lower.includes('app') || lower.includes('design')) {
        fallbackText = "We specialize in Web Development (React/Next.js), UI/UX Graphic Design, Video Production, Branding, and AI Automation Systems. You can explore complete specs under the Services tab!";
      }

      const newBotMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setChatHistory(prev => [...prev, newBotMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Attachment upload and Drive Selectors
  const triggerLocalFileInput = (acceptType: string) => {
    setFileInputAccept(acceptType);
    setIsAttachmentMenuOpen(false);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Determine attachment category
    let type: 'pdf' | 'image' | 'video' | 'zip' | 'voice' | 'drive' | 'archive' | 'other' = 'other';
    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (mime.startsWith('image/')) {
      type = 'image';
    } else if (mime.startsWith('video/')) {
      type = 'video';
    } else if (mime === 'application/pdf') {
      type = 'pdf';
    } else if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.tar') || name.endsWith('.gz') || name.endsWith('.7z')) {
      type = 'zip';
    } else if (mime.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.ogg') || name.endsWith('.m4a')) {
      type = 'voice';
    } else {
      type = 'other';
    }

    // Determine formatted file size
    let sizeStr = '';
    if (file.size > 1024 * 1024) {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
    }

    // Capture/Create a real local blob URL that the browser can render/display locally!
    let blobUrl = '';
    try {
      blobUrl = URL.createObjectURL(file);
    } catch (err) {
      console.error("Local object URL creation failed: ", err);
    }

    const timeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newAttachMsg: ChatMessage = {
      id: `msg-user-upload-${Date.now()}`,
      role: 'user',
      content: `📁 Attached file: **${file.name}**`,
      timestamp: timeFormatted,
      attachment: {
        filename: file.name,
        size: sizeStr,
        type: type,
        url: blobUrl
      }
    };

    setChatHistory(prev => [...prev, newAttachMsg]);
    triggerToast(`📎 Successfully attached ${file.name} (${sizeStr})`);

    // Intelligent automated response
    setIsChatLoading(true);
    setTimeout(() => {
      let replyContent = '';
      if (type === 'image') {
        replyContent = `Got your shared image! This visual snapshot looks extremely neat. Let me review and share this with the design leads for direct integration.`;
      } else if (type === 'video') {
        replyContent = `Highly useful video screencast! Analyzing the recorded interaction. I see the specific flow; preparing a prompt hot-fix now.`;
      } else if (type === 'pdf') {
        replyContent = `Document received. I have downloaded and indexed this PDF. Parsing requirements to match DigiWorku standards.`;
      } else if (type === 'zip') {
        replyContent = `Successfully uploaded ZIP file! Extracting archive assets. I am reviewing the encapsulated codebase files.`;
      } else if (type === 'voice') {
        replyContent = `Got the audio snippet! Transcribing your voice briefing now to adjust our daily milestones.`;
      } else {
        replyContent = `Upload complete. I have successfully received the file: **${file.name}** (${sizeStr}). Adding this to our live sandbox directory.`;
      }

      const replyMsg: ChatMessage = {
        id: `msg-admin-reply-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setChatHistory(prev => [...prev, replyMsg]);
      setIsChatLoading(false);
    }, 1800);

    // Reset file input value to allow selecting same file again
    e.target.value = '';
  };

  // Request Service Directly by opening Chat Workspace & initiating conversation
  const handleRequestServiceDirectly = (serviceInput: ServiceItem | string) => {
    const title = typeof serviceInput === 'string' ? serviceInput : serviceInput.title;
    const priceStr = typeof serviceInput === 'string' ? '' : ` (Starting from ${serviceInput.price})`;

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Append User Service Request message
    const userMsg: ChatMessage = {
      id: `msg-user-req-${Date.now()}`,
      role: 'user',
      content: `Hello DigiWorku Team, I want to request the **${title}** service${priceStr}. Please guide me on project onboarding and scope execution.`,
      timestamp: time
    };

    setChatHistory(prev => [...prev, userMsg]);
    setActiveWorkflowsCount(prev => prev + 1);

    // 2. Register Inquiry in CRM
    const newInquiry: CRMInquiry = {
      id: `inq-${Date.now()}`,
      clientName: currentUser?.name ? `${currentUser.name} (${title})` : `Client (${title})`,
      projectName: title,
      timeAgo: 'Just now',
      summary: `Requested service: ${title}${priceStr}. Initial chat channel established.`,
      unread: true,
      budget: typeof serviceInput === 'string' ? '₹45,000' : serviceInput.price,
      status: 'new'
    };
    setCrmInquiriesList(prev => [newInquiry, ...prev]);

    // 3. Switch active tab to 'chat' and inform user
    setActiveTab('chat');
    triggerToast(`💬 Opening Chat Workspace for "${title}" request...`);

    // 4. Automated PM Lead Confirmation reply in Chat
    setIsChatLoading(true);
    setTimeout(() => {
      const confirmMsg: ChatMessage = {
        id: `msg-bot-req-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Welcome to your Dedicated Project Workspace!**\n\nWe have registered your request for **${title}**${priceStr}.\n\nAnanya Sharma (Lead PM) and our engineering squad have been assigned to your project. Feel free to describe your project goals, share attachments, or ask any questions below!`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setChatHistory(prev => [...prev, confirmMsg]);
      setIsChatLoading(false);
    }, 1000);
  };

  // Auto-Generate Detailed Page Sections Helper
  const autoGenerateDetailedSections = () => {
    const title = serviceFormTitle.trim() || 'Custom Service';
    const category = serviceFormCategory;

    setServiceFormOverview(`In today's competitive landscape, ${title} is critical to brand positioning and operational efficiency. At DigiWorku, we design and engineer end-to-end digital solutions that engage users, optimize conversions, and scale effortlessly with your business growth.`);
    
    setServiceFormOfferings([
      { title: `${title} Architecture`, desc: 'Custom strategic blueprint and core technical implementation.', icon: 'Globe' },
      { title: 'Responsive Design & UX', desc: 'Flawless presentation tailored for mobile, tablet, and desktop.', icon: 'Palette' },
      { title: 'Speed & Optimization', desc: 'High-speed performance tuning, security suite, and scalability.', icon: 'Zap' },
      { title: 'Analytics & Monitoring', desc: 'Integrated dashboards for real-time tracking and metrics.', icon: 'BarChart3' }
    ]);

    setServiceFormProcess([
      { step: 1, title: 'Requirement Discovery', desc: 'In-depth consultation to clarify business goals, tech stack, and scope.' },
      { step: 2, title: 'Strategic Architecture', desc: 'Designing wireframes, visual style guides, and project roadmaps.' },
      { step: 3, title: 'Agile Execution', desc: 'Iterative design and engineering with staging preview updates.' },
      { step: 4, title: 'QA & Final Deployment', desc: 'Cross-platform testing, production launch, and complete asset handoff.' }
    ]);

    setServiceFormFeatures([
      { title: 'Enterprise Standard Engineering', desc: `Built with industry best practices for ${title} to ensure long-term stability.` },
      { title: 'Dedicated Partner Support', desc: 'Direct line of communication with DigiWorku project managers and leads.' },
      { title: '100% Full Intellectual Ownership', desc: 'Complete copyright and source file transfer upon project delivery.' },
      { title: '30-Day Support Warranty', desc: 'Comprehensive post-launch technical support included.' }
    ]);

    setServiceFormWhyUs([
      'Top-Tier Engineering & Creative Talent',
      'Transparent Milestone Pricing & Fast Turnaround',
      'Focus on High Conversion & User ROI',
      'Agile Communication & Staging Previews',
      '100% Source Code & Asset Transfer',
      '30-Day Free Post-Launch Support'
    ].join('\n'));

    setServiceFormDeliverables([
      `Complete ${title} production package`,
      'Full source code repository / vector design files',
      'Production deployment and server setup',
      'Technical documentation and admin user guide',
      '30-day post-launch technical warranty'
    ].join('\n'));

    setServiceFormFaqs([
      { q: `What is the estimated delivery timeframe for ${title}?`, a: 'Standard delivery takes between 2 to 4 weeks depending on required features and feedback speed.' },
      { q: 'Will I own full copyright to the work?', a: 'Yes, 100% intellectual property ownership and source files are transferred upon completion.' },
      { q: 'Is ongoing maintenance available?', a: 'Yes, we provide 30 days of free support after launch, as well as monthly maintenance packages.' }
    ]);

    triggerToast('⚡ Auto-filled rich detailed page content!');
  };

  // Service Management actions
  const handleAddNewService = () => {
    if (!serviceFormTitle.trim() || !serviceFormDescription.trim() || !serviceFormPrice.trim()) {
      triggerToast("⚠️ Please fill in Service Title, Short Description, and Price.");
      return;
    }

    const whyUsArray = serviceFormWhyUs.split('\n').map(s => s.trim()).filter(Boolean);
    const deliverablesArray = serviceFormDeliverables.split('\n').map(s => s.trim()).filter(Boolean);

    const newService: ServiceItem = {
      id: `serv-custom-${Date.now()}`,
      title: serviceFormTitle,
      description: serviceFormDescription,
      category: serviceFormCategory,
      price: serviceFormPrice,
      icon: serviceFormIcon,
      content: serviceFormContent.trim() || undefined,
      intro: serviceFormDescription,
      overview: serviceFormOverview.trim() || serviceFormContent.trim() || undefined,
      offerings: serviceFormOfferings.length > 0 ? serviceFormOfferings : undefined,
      process: serviceFormProcess.length > 0 ? serviceFormProcess : undefined,
      features: serviceFormFeatures.length > 0 ? serviceFormFeatures : undefined,
      whyUs: whyUsArray.length > 0 ? whyUsArray : undefined,
      deliverables: deliverablesArray.length > 0 ? deliverablesArray : undefined,
      faqs: serviceFormFaqs.length > 0 ? serviceFormFaqs : undefined
    };

    setServicesList(prev => [...prev, newService]);
    setIsAddingService(false);
    resetServiceForm();
    triggerToast(`🚀 Added new service "${serviceFormTitle}" successfully!`);
  };

  const handleUpdateService = () => {
    if (!editingServiceId) return;
    if (!serviceFormTitle.trim() || !serviceFormDescription.trim() || !serviceFormPrice.trim()) {
      triggerToast("⚠️ Please fill in Service Title, Short Description, and Price.");
      return;
    }

    const whyUsArray = serviceFormWhyUs.split('\n').map(s => s.trim()).filter(Boolean);
    const deliverablesArray = serviceFormDeliverables.split('\n').map(s => s.trim()).filter(Boolean);

    setServicesList(prev => prev.map(s => {
      if (s.id === editingServiceId) {
        return {
          ...s,
          title: serviceFormTitle,
          description: serviceFormDescription,
          category: serviceFormCategory,
          price: serviceFormPrice,
          icon: serviceFormIcon,
          content: serviceFormContent.trim() || undefined,
          intro: serviceFormDescription,
          overview: serviceFormOverview.trim() || serviceFormContent.trim() || undefined,
          offerings: serviceFormOfferings.length > 0 ? serviceFormOfferings : undefined,
          process: serviceFormProcess.length > 0 ? serviceFormProcess : undefined,
          features: serviceFormFeatures.length > 0 ? serviceFormFeatures : undefined,
          whyUs: whyUsArray.length > 0 ? whyUsArray : undefined,
          deliverables: deliverablesArray.length > 0 ? deliverablesArray : undefined,
          faqs: serviceFormFaqs.length > 0 ? serviceFormFaqs : undefined
        };
      }
      return s;
    }));

    setEditingServiceId(null);
    resetServiceForm();
    triggerToast(`✨ Service updated successfully!`);
  };

  const handleDeleteService = (id: string, title: string) => {
    setServicesList(prev => prev.filter(s => s.id !== id));
    triggerToast(`🗑️ Deleted service "${title}"`);
  };

  const startEditingService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setIsAddingService(false);
    setServiceFormTitle(service.title);
    setServiceFormDescription(service.description);
    setServiceFormCategory(service.category);
    setServiceFormPrice(service.price);
    setServiceFormIcon(service.icon);
    setServiceFormContent(service.content || '');
    setServiceFormOverview(service.overview || service.content || '');
    setServiceFormOfferings(service.offerings || []);
    setServiceFormProcess(service.process || []);
    setServiceFormFeatures(service.features || []);
    setServiceFormWhyUs(service.whyUs ? service.whyUs.join('\n') : '');
    setServiceFormDeliverables(service.deliverables ? service.deliverables.join('\n') : '');
    setServiceFormFaqs(service.faqs || []);
  };

  const resetServiceForm = () => {
    setServiceFormTitle('');
    setServiceFormDescription('');
    setServiceFormCategory('Development');
    setServiceFormPrice('');
    setServiceFormIcon('Globe');
    setServiceFormContent('');
    setServiceFormOverview('');
    setServiceFormOfferings([]);
    setServiceFormProcess([]);
    setServiceFormFeatures([]);
    setServiceFormWhyUs('');
    setServiceFormDeliverables('');
    setServiceFormFaqs([]);
  };


  // Dynamic categories list from projectsList + defaults
  const portfolioCategoriesList = Array.from(new Set([
    'All',
    'UGC Videos',
    'Graphics Design',
    'UI/UX Design',
    'Web Development',
    'App Development',
    'Video Editing',
    'Branding & Media',
    'Marketing',
    'AI & Automation',
    ...projectsList.map(p => p.category)
  ]));

  // Filter projects by search and top buttons
  const filteredProjects = projectsList.filter(proj => {
    const matchesCategory = portfolioFilter === 'All' || proj.category.toLowerCase() === portfolioFilter.toLowerCase();
    const matchesSearch = proj.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      proj.clientName.toLowerCase().includes(searchProjectQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter services list
  const filteredServices = servicesList.filter(service => {
    const matchesCategory = serviceCategories[service.category as keyof typeof serviceCategories];
    const matchesSearch = service.title.toLowerCase().includes(searchServiceQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchServiceQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="digiworku-root" className={`${activeTab === 'chat' ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'} font-sans flex text-[#1f2937] transition-colors duration-200 ${darkMode ? 'dark bg-[#111111] text-[#f1f5f9]' : 'bg-[#fafafc] text-[#1f2937]'} relative overflow-x-hidden w-full max-w-full min-w-0`}>
      {/* WCAG 2.1 Accessible Skip to Content Link */}
      <a
        href="#main-content-canvas"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#00c853] focus:text-slate-950 focus:font-black focus:rounded-xl focus:shadow-2xl"
      >
        Skip to main content
      </a>

      {/* Network Offline Alert Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold shadow-lg flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>You are currently offline. Changes will automatically sync when connection is restored.</span>
        </div>
      )}

      <AnimatedGridBackground darkMode={darkMode} />

      {/* Toast popup */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            id="global-toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#00c853] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold"
          >
            <Check className="w-5.5 h-5.5 shrink-0" />
            <span>{copiedText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs z-50 transition-all cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar Drawer - Toggled by Hamburger Menu Button on all screen widths */}
      <aside
        id="side-bar-navigation"
        className={`fixed inset-y-0 left-0 z-50 w-66 flex flex-col shrink-0 justify-between border-r transition-all duration-300 ease-out p-0 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-[#94a3b8] border-slate-200/80 dark:border-slate-800 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col p-5 space-y-6">
          {/* Brand Header Logo block */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex flex-col cursor-pointer" onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                Digi<span className="text-[#00c853]">Worku</span>
              </div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">
                Digital Workforce
              </span>
            </div>

            {/* Close button for sliding out menu */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Navigation Items split by panelMode */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[55vh] pr-1">
            {panelMode === 'user' ? (
              // USER/CLIENT PORTAL NAV
              <>
                <button
                  onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'home'
                    ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'chat'
                    ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat/Request</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00c853] animate-pulse"></span>
                </button>

                <button
                  onClick={() => { setActiveTab('portfolio'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'portfolio'
                    ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5" />
                    <span>Portfolio</span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('services'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'services'
                    ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5" />
                    <span>Services</span>
                  </div>
                </button>
              </>
            ) : (
              // CRM ADMIN PANEL NAV
              <>
                {!isAdmin ? (
                  <div className="p-3 text-center space-y-3 bg-red-500/5 rounded-xl border border-red-500/10">
                    <Lock className="w-6 h-6 text-red-500 mx-auto" />
                    <span className="text-xs text-slate-500 font-bold block">Console Locked</span>
                    <button
                      onClick={exitAdminPanelMode}
                      className="w-full py-2 bg-slate-850 text-slate-250 rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                    >
                      ← Back to Website
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'home'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>CRM Overview</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('clients'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'clients'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <span>Client Database</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'projects'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5" />
                        <span>Projects pipeline</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'inquiries'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5" />
                        <span>Inbound Leads</span>
                      </div>
                      <span className="bg-[#00c853] text-[10px] font-black text-white px-2 py-0.5 rounded-full">
                        {crmInquiriesList.length}
                      </span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'chat'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5" />
                        <span>Chat Support Hub</span>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'team'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5" />
                        <span>Workforce Team</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'analytics'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5" />
                        <span>Growth Analytics</span>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('services'); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between p-3 px-4 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === 'services'
                        ? 'bg-[#00c853] text-white shadow-lg shadow-[#00c853]/15 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#00c853] dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5" />
                        <span>Manage Services</span>
                      </div>
                    </button>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                      <button
                        onClick={() => {
                          exitAdminPanelMode();
                          triggerToast("🌎 Returned to Client Services Portal.");
                        }}
                        className="w-full flex items-center gap-3 p-3 px-4 rounded-xl text-sm font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer"
                      >
                        <Globe className="w-5 h-5 shrink-0 text-blue-400" />
                        <span>View Client Portal</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Action Button & Account Session controls */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4">

          {panelMode === 'admin' ? (
            isAdmin ? (
              <button
                onClick={() => {
                  setIsNewProjectModalOpen(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full py-3 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-black text-white bg-[#00c853] hover:bg-[#00af48] shadow-md shadow-[#00c853]/15 transition-all select-none cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>POST NEW TASK</span>
              </button>
            ) : (
              <div className="text-center py-2 text-[10px] uppercase font-black tracking-wider text-slate-500">
                🔒 Console Secured
              </div>
            )
          ) : (
            currentUser ? (
              <button
                onClick={() => {
                  setActiveTab('services');
                  setIsSidebarOpen(false);
                  triggerToast("📦 Select from our digital work unit matrices!");
                }}
                className="w-full py-3 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-black text-white bg-[#00c853] hover:bg-[#00af48] shadow-md shadow-[#00c853]/15 transition-all select-none cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>HIRE DIGIWORKU</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full py-3 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-black text-white bg-[#00c853] hover:bg-[#00af48] shadow-md shadow-[#00c853]/15 transition-all select-none cursor-pointer"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>CLIENT GET STARTED</span>
              </button>
            )
          )}

          {/* Horizontal Divider */}
          <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

          {/* Profile area & controls */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                setIsProfileOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-2.5 min-w-0 hover:opacity-80 active:scale-98 transition-all text-left cursor-pointer"
              title="View Profile"
            >
              <img
                src={currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Guest Client')}&background=00c853&color=fff&bold=true`}
                alt="User Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/10"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {currentUser?.name || "Guest Client"}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                  {currentUser ? "Client" : "user"}
                </span>
              </div>
            </button>

            {/* Action icons row */}
            <div className="flex items-center gap-1">
              {/* Theme switcher button */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Toggle theme style"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Session logout/login action */}
              {panelMode === 'admin' ? (
                isAdmin ? (
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      localStorage.removeItem('digiworku-is-admin');
                      exitAdminPanelMode();
                      triggerToast("🔓 Admin session closed safely.");
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Logout Admin"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Locked</span>
                )
              ) : (
                currentUser ? (
                  <button
                    onClick={() => {
                      triggerToast("🔓 Client Session ended safely.");
                      localStorage.removeItem('digiworku-user-session');
                      setCurrentUser(null);
                      setIsSidebarOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthMode('signin');
                      setIsSidebarOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Sign In"
                  >
                    <LogIn className="w-4 h-4" />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main
        id="main-content-canvas"
        className={`flex-1 flex flex-col relative z-10 w-full max-w-full min-w-0 overflow-x-hidden ${activeTab === 'chat'
          ? 'h-screen max-h-screen overflow-hidden'
          : 'min-h-screen overflow-y-auto'
          }`}
      >

        {/* Top Navbar Header */}
        <header className={`relative z-20 px-3 sm:px-4 md:px-8 py-2 md:py-3 border-b flex items-center justify-between gap-2 sm:gap-4 shrink-0 transition-colors w-full max-w-full overflow-hidden ${darkMode ? 'bg-[#111111] border-slate-800/80' : 'bg-[#FFF7E6] border-slate-200/80'}`}>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            {/* Hamburger / Three-line Menu Button */}
            <button
              id="header-sidebar-toggle"
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 sm:p-2 -ml-1 rounded-xl text-slate-500 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>

            {/* Logo Brand with click action to return Home */}
            <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}>
              <img
                src="/logo.jpg"
                alt="DigiWorku Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md border border-slate-200/40 dark:border-slate-800/40 hover:scale-105 transition-transform duration-200 shrink-0"
              />
              <span className="font-black text-slate-900 dark:text-white text-lg sm:text-xl md:text-2xl tracking-tight shrink-0 whitespace-nowrap">
                Digi<span className="text-[#00c853]">Worku</span>
              </span>
            </div>
          </div>

          {/* Header Right Interactive Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Notification badge */}
            <button
              id="header-notification-bell"
              onClick={() => {
                setIsNotificationsOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer relative shrink-0"
              title="Notifications"
            >
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-white dark:border-slate-900 animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              id="header-theme-toggle"
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
              title="Toggle visual style"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Context-Sensitive Profile Widget */}
            <button
              id="header-profile-widget"
              onClick={() => {
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3 hover:opacity-90 active:scale-98 transition-all text-left cursor-pointer focus:outline-none shrink-0"
              title="Profile Details"
            >
              {panelMode === 'admin' ? (
                isAdmin ? (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Ananya Sharma"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#00c853] shrink-0"
                    />
                    <div className="hidden xl:block min-w-0">
                      <span className="block text-xs font-black text-slate-900 dark:text-slate-100 leading-none">Ananya Sharma</span>
                      <span className="block text-[9.5px] text-[#00c853] font-bold uppercase tracking-tight mt-0.5">Console Operator</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-red-500/30">
                      <Lock className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="hidden xl:block min-w-0">
                      <span className="block text-xs font-black text-slate-400 leading-none">Unauthorized</span>
                      <span className="block text-[9.5px] text-red-400 font-bold uppercase tracking-tight mt-0.5">Secure Gated</span>
                    </div>
                  </>
                )
              ) : (
                currentUser ? (
                  <>
                    <img
                      src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=00c853&color=fff&bold=true`}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#00c853]/45 shrink-0"
                    />
                    <div className="hidden xl:block min-w-0">
                      <span className="block text-sm font-black text-slate-900 dark:text-slate-100 leading-none truncate max-w-[100px]">{currentUser.name}</span>
                      <span className="block text-[9.5px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-0.5">Active Client</span>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src="https://ui-avatars.com/api/?name=Guest+Client&background=00c853&color=fff&bold=true"
                      alt="Guest Client"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#00c853]/45 shrink-0"
                    />
                    <div className="hidden xl:block min-w-0">
                      <span className="block text-xs font-bold text-slate-900 dark:text-slate-200 leading-none truncate max-w-[100px]">Guest Client</span>
                      <span className="block text-[9.5px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight text-left mt-0.5">
                        User
                      </span>
                    </div>
                  </>
                )
              )}
            </button>
          </div>

        </header>

        {/* Tab Selection Frame */}
        <div id="active-viewport-area" className="flex-1 flex flex-col min-h-0 relative w-full max-w-full min-w-0 overflow-x-hidden">

          <AnimatePresence mode="wait">

            {panelMode === 'admin' && !isAdmin ? (
              <motion.div
                key="admin-auth-intercept"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex items-center justify-center p-4 md:p-8 bg-slate-50/50 dark:bg-[#161616]/20 backdrop-blur-xs"
              >
                <div className="w-full max-w-md p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#1a1a1a] shadow-2xl relative overflow-hidden">
                  {/* Visual Glow Ornament */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

                  <div className="text-center space-y-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-[#00c853]/20 flex items-center justify-center mx-auto shadow-inner text-[#00c853]">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Admin Credentials</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">DigiWorku CRM Entry Node</p>
                    </div>
                  </div>

                  {adminAuthError && (
                    <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{adminAuthError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8] mb-1.5">EMAIL ID</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="digiworku55@gmail.com"
                          value={adminEmailInput}
                          onChange={(e) => setAdminEmailInput(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-55 dark:bg-[#202020]/40 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#94a3b8] mb-1.5">PASSPHRASE</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={adminPasswordInput}
                          onChange={(e) => setAdminPasswordInput(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-55 dark:bg-[#202020]/40 text-sm focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853] focus:outline-none transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAdminAuthLoading}
                      className="w-full h-11 rounded-xl bg-[#00c853] hover:bg-[#00af48] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00c853]/15 transition-all cursor-pointer select-none active:scale-98 disabled:opacity-50 mt-2"
                    >
                      {isAdminAuthLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>UNLOCK CRM CONSOLE</span>
                        </>
                      )}
                    </button>
                  </form>



                  <div className="text-center mt-5">
                    <button
                      onClick={() => {
                        exitAdminPanelMode();
                        triggerToast("🌍 Returned to Public Client Portal.");
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
                    >
                      ← Back to Client Website Portal
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>

                {/* VIEW 1: LANDING PAGE & LIVE DASHBOARD (Image 1) */}
                {activeTab === 'home' && (
                  <motion.div
                    key="tab-home"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex-1 px-4 md:px-8 py-3 md:py-4 space-y-6 w-full"
                  >

                    {/* Hero section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center w-full mx-auto pt-1 md:pt-2">

                      {/* Left Column Text details */}
                      <div className="lg:col-span-7 space-y-6">

                        {/* Top status flag block */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/45 border border-[#00c853]/20 text-xs font-bold text-[#00c853]">
                          <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse"></span>
                          <span>India's Top 1% Digital Talent</span>
                        </div>

                        {/* Massive Bold Header matching Image 1 */}
                        <h1 className={`text-4xl md:text-5xl lg:text-5.5xl font-black tracking-tight leading-[1.08] font-display ${darkMode ? 'text-white' : 'text-[#00311F]'}`}>
                          Top IT & AI Agency in India: Build Faster With <span className="text-[#00c853] underline decoration-[#00c853]/20 decoration-wavy">DigiWorku</span>
                        </h1>

                        {/* Paragraph */}
                        <p className={`text-sm md:text-md leading-relaxed max-w-xl font-medium ${darkMode ? 'text-slate-400' : 'text-[#00311F]/75'}`}>
                          India's Digital Workforce Platform for Startups, Businesses & Creators. Scale your operations with specialized teams built for speed and engineered for outstanding growth.
                        </p>

                        {/* Action button rows */}
                        <div className="flex flex-wrap items-center gap-4 pt-1.5">
                          <button
                            id="start-project-hero-btn"
                            onClick={() => handleRequestServiceDirectly('Custom Project Build')}
                            className="bg-[#00c853] hover:bg-[#00b047] active:scale-98 text-white px-7 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-xl shadow-[#00c853]/20 cursor-pointer flex items-center gap-2"
                          >
                            <span>Start a Project</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            id="join-us-hero-btn"
                            onClick={() => setIsFreelancerModalOpen(true)}
                            className="bg-[#00311F] hover:bg-[#002517] dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 dark:text-emerald-300 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98 flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4 text-emerald-400" />
                            <span>Join Us (Freelancer)</span>
                          </button>
                        </div>



                      </div>

                      {/* Right Column: Live Project Dashboard Container Block matching Image 1 */}
                      <div className="lg:col-span-5 relative">

                        <div className="absolute -inset-1.5 bg-[#00c853] rounded-3xl opacity-[0.06] blur-xl"></div>

                        <div className={`p-6 rounded-2xl border transition-all shadow-xl relative ${darkMode ? 'bg-[#202020]/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>

                          {/* Premium Tech Agency Branding Hero Image */}
                          <div className="mb-5 rounded-xl overflow-hidden h-40 relative group border border-slate-100 dark:border-slate-800">
                            <img
                              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=70"
                              alt="Tech Agency Team Collaboration"
                              referrerPolicy="no-referrer"
                              fetchPriority="high"
                              className="w-full h-full object-cover group-hover:scale-102 duration-300 filter brightness-95 dark:brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3.5">
                              <span className="text-[10px] font-black text-white bg-[#00c853] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                                DigiWorku Tech Hub
                              </span>
                            </div>
                          </div>

                          {/* Live project dashboard banner */}
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#e8fcf0] dark:bg-emerald-950/50 flex items-center justify-center text-[#00c853]">
                                <LineChart className="w-5.5 h-5.5" />
                              </div>
                              <div>
                                <span className="block text-xs font-black text-slate-900 dark:text-slate-100">Live Project Dashboard</span>
                                <span className="block text-[9px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">REAL-TIME STATUS</span>
                              </div>
                            </div>

                            <span className="bg-[#e8fcf0] dark:bg-emerald-950 text-[#00c853] text-[9.5px] font-black px-2.5 py-1.5 rounded-md uppercase tracking-wider scale-95 border border-[#00c853]/15">
                              LIVE UPDATES
                            </span>
                          </div>

                          {/* Active components metrics split grid */}
                          <div className="grid grid-cols-3 gap-2.5 mb-3">

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Active</span>
                              {isEditingHomeMetrics ? (
                                <input
                                  type="text"
                                  value={editActiveVal}
                                  onChange={(e) => setEditActiveVal(e.target.value)}
                                  className="w-full text-base font-black text-[#00c853] bg-white dark:bg-slate-900 border border-[#00c853] rounded px-1 py-0.5 mt-1 focus:outline-none"
                                />
                              ) : (
                                <span className="block text-lg md:text-xl font-black text-[#00c853] mt-0.5">{homeMetrics.active}</span>
                              )}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Completed</span>
                              {isEditingHomeMetrics ? (
                                <input
                                  type="text"
                                  value={editCompletedVal}
                                  onChange={(e) => setEditCompletedVal(e.target.value)}
                                  className="w-full text-base font-black text-blue-500 bg-white dark:bg-slate-900 border border-blue-500 rounded px-1 py-0.5 mt-1 focus:outline-none"
                                />
                              ) : (
                                <span className="block text-lg md:text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{homeMetrics.completed}</span>
                              )}
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
                              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pending</span>
                              {isEditingHomeMetrics ? (
                                <input
                                  type="text"
                                  value={editPendingVal}
                                  onChange={(e) => setEditPendingVal(e.target.value)}
                                  className="w-full text-base font-black text-amber-500 bg-white dark:bg-slate-900 border border-amber-500 rounded px-1 py-0.5 mt-1 focus:outline-none"
                                />
                              ) : (
                                <span className="block text-lg md:text-xl font-black text-amber-500 mt-0.5">{homeMetrics.pending}</span>
                              )}
                            </div>

                          </div>

                          {/* Quick Edit Metrics Trigger Button */}
                          <div className="flex justify-end mb-4">
                            {isEditingHomeMetrics ? (
                              <button
                                onClick={() => {
                                  const newMetrics = { active: editActiveVal, completed: editCompletedVal, pending: editPendingVal };
                                  setHomeMetrics(newMetrics);
                                  localStorage.setItem('digiworku-home-metrics', JSON.stringify(newMetrics));
                                  setIsEditingHomeMetrics(false);
                                }}
                                className="px-3 py-1 bg-[#00c853] hover:bg-[#00b047] text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save Metrics</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditActiveVal(homeMetrics.active);
                                  setEditCompletedVal(homeMetrics.completed);
                                  setEditPendingVal(homeMetrics.pending);
                                  setIsEditingHomeMetrics(true);
                                }}
                                className="px-2.5 py-1 text-[10px] font-extrabold text-slate-500 hover:text-[#00c853] bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit Metrics</span>
                              </button>
                            )}
                          </div>

                          {/* Interactive Revenue growth widget chart simulation */}
                          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">

                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Revenue Growth</span>
                              <span className="text-xs font-black text-[#00c853] flex items-center gap-1 bg-[#e8fcf0] dark:bg-emerald-950/50 px-2 py-1 rounded-sm">
                                <TrendingUp className="w-3 h-3" />
                                <span>+24%</span>
                              </span>
                            </div>

                            {/* Interactive Bar graph diagram matching Image 1 layout */}
                            <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                              <div className="w-full bg-[#e8fcf0] dark:bg-slate-800 rounded-sm h-[35%] hover:scale-105 duration-200" title="Week 1: 35%"></div>
                              <div className="w-full bg-[#e8fcf0] dark:bg-slate-800 rounded-sm h-[55%] hover:scale-105 duration-200" title="Week 2: 55%"></div>
                              <div className="w-full bg-[#e8fcf0] dark:bg-slate-800 rounded-sm h-[40%] hover:scale-105 duration-200" title="Week 3: 40%"></div>
                              <div className="w-full bg-[#e8fcf0] dark:bg-slate-800 rounded-sm h-[75%] hover:scale-105 duration-200" title="Week 4: 75%"></div>
                              <div className="w-full bg-[#00c853] rounded-sm h-[95%] shadow-[0_4px_10px_rgba(0,200,83,0.3)] hover:scale-105 duration-200" title="Current Sprint Week: 95%"></div>
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Metric Bento grid matching Image 1 Bottom cards */}
                    <div className="w-full mx-auto pt-2 md:pt-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* CARD 1: ACTIVE PROJECTS WITH PROGRESS BAR */}
                        <div
                          onClick={() => triggerToast("⚡ Interactive Dashboard Active: Adjust your operational range instantly!")}
                          className={`p-5 rounded-2xl border cursor-pointer hover:border-[#00c853] transition-all group ${darkMode ? 'bg-[#202020]/70 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'}`}
                        >
                          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-4">
                            <div className="p-2 rounded-lg bg-[#e8fcf0] dark:bg-emerald-950/50 text-[#00c853]">
                              <Zap className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-bold text-[#00c853] bg-[#e8fcf0] dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">+12%</span>
                          </div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIVE PROJECTS</span>

                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{activeProjectsCount}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">In development</span>
                          </div>

                          {/* Animated Progress Bar */}
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                            <motion.div
                              className="bg-[#00c853] h-1.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(activeProjectsCount / 8) * 100}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-bold">
                            <span>Min range</span>
                            <span>Interactive parameter</span>
                          </div>
                        </div>

                        {/* CARD 2: COMPLETED PROJECTS */}
                        <div
                          className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-[#202020]/70 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'}`}
                        >
                          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-4">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-500">
                              <Check className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-990/40 px-2.5 py-1 rounded-full">+8%</span>
                          </div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">COMPLETED PROJECTS</span>
                          <span className="block text-3xl font-black text-slate-900 dark:text-white mt-1">{completedProjectsCount}</span>

                          <span className="inline-block mt-4.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-extrabold px-2 py-1 rounded-sm">
                            +2 since last week
                          </span>
                        </div>

                        {/* CARD 3: PENDING TASKS WITH ACTIVE INDICATORS */}
                        <div
                          className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-[#202020]/70 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'}`}
                        >
                          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-4">
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500">
                              <Clock className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full">↘ 4%</span>
                          </div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">PENDING TASKS</span>
                          <span className="block text-3xl font-black text-slate-900 dark:text-white mt-1">{pendingTasksCount}</span>

                          {/* Active Paginations Dots Indicator matching Image 1 card */}
                          <div className="flex items-center gap-1.5 mt-5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-300 dark:bg-slate-600"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-red-200 dark:bg-slate-700"></span>
                          </div>
                        </div>

                        {/* CARD 4: TOTAL CLIENTS WITH AVATARS */}
                        <div
                          className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-[#202020]/70 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'}`}
                        >
                          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-4">
                            <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-500">
                              <User className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/45 px-2.5 py-1 rounded-full">+24%</span>
                          </div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">TOTAL CLIENTS</span>
                          <span className="block text-3xl font-black text-slate-900 dark:text-white mt-1">{totalClientsCount}+</span>

                          <div className="flex items-center gap-1.5 mt-4">
                            <div className="flex -space-x-2">
                              <span className="w-5.5 h-5.5 rounded-full bg-slate-300 dark:bg-slate-700 border border-white dark:border-slate-800 block"></span>
                              <span className="w-5.5 h-5.5 rounded-full bg-slate-400 dark:bg-slate-600 border border-white dark:border-slate-800 block"></span>
                              <span className="w-5.5 h-5.5 rounded-full bg-slate-500 dark:bg-slate-500 border border-white dark:border-slate-800 block"></span>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#00c853] bg-[#e8fcf0] dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-sm line-height-none">+12</span>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Active Projects Table & Live Inquiries Grid from Image 1 */}
                    {panelMode === 'admin' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mx-auto pt-2">

                        {/* Left: Active Projects Table Component */}
                        <div className={`lg:col-span-8 p-5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                            <div>
                              <h3 className="text-md font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span>Active Projects Pipeline</span>
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-405 mt-0.5">Click any project row status state to cycle current milestones instantly.</p>
                            </div>

                            {/* Search Bar for Live Project Filtration */}
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Search pipeline..."
                                value={searchCrmProjectQuery}
                                onChange={(e) => setSearchCrmProjectQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-48 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-705 dark:text-slate-205 outline-none focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853]/20 transition-all"
                              />
                            </div>
                          </div>

                          {/* Table element */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-850 text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                                  <th className="py-2.5">ID</th>
                                  <th className="py-2.5">Project Name</th>
                                  <th className="py-2.5">Project Lead</th>
                                  <th className="py-2.5">Work Status</th>
                                  <th className="py-2.5 text-center">Health Score</th>
                                  <th className="py-2.5 text-right font-black">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 pb-2">
                                {crmProjectsList
                                  .filter(p => p.name.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()) || p.leadName.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()))
                                  .map((project) => {
                                    const isStable = project.status === 'STABLE';
                                    const isReview = project.status === 'IN REVIEW';
                                    const isOffTrack = project.status === 'OFF TRACK';
                                    return (
                                      <tr
                                        key={project.id}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs text-slate-705 dark:text-slate-305"
                                      >
                                        <td className="py-3 font-mono font-bold text-slate-400 dark:text-slate-500">
                                          {project.id}
                                        </td>
                                        <td className="py-3">
                                          <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-[#00c853]">
                                            {project.name}
                                          </div>
                                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                                            Budget: {project.budget}
                                          </div>
                                        </td>
                                        <td className="py-3">
                                          <div className="flex items-center gap-2">
                                            <img
                                              src={project.leadAvatar}
                                              alt={project.leadName}
                                              className="w-6 h-6 rounded-full border border-slate-100 dark:border-slate-700 object-cover"
                                            />
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{project.leadName}</span>
                                          </div>
                                        </td>
                                        <td className="py-3">
                                          <button
                                            onClick={() => {
                                              // Cycle statuses
                                              const statuses: Array<'ON TRACK' | 'IN REVIEW' | 'STABLE' | 'OFF TRACK'> = ['ON TRACK', 'IN REVIEW', 'STABLE', 'OFF TRACK'];
                                              const currentIdx = statuses.indexOf(project.status);
                                              const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                                              setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: nextStatus } : p));
                                              triggerToast(`🔄 Milestone status cycle: ${project.name} set to ${nextStatus}!`);
                                            }}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer uppercase select-none ${isStable
                                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/10'
                                              : isReview
                                                ? 'bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 border border-amber-500/10'
                                                : isOffTrack
                                                  ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border border-red-500/10'
                                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00c853] dark:text-emerald-400 border border-[#00c853]/10'
                                              }`}
                                          >
                                            <span className={`w-1.5 h-1.5 rounded-full ${isStable ? 'bg-blue-500' : isReview ? 'bg-amber-500' : isOffTrack ? 'bg-red-500' : 'bg-[#00c853]'
                                              }`} />
                                            <span>{project.status}</span>
                                          </button>
                                        </td>
                                        <td className="py-3">
                                          <div className="flex flex-col items-center justify-center">
                                            <span className="font-mono font-extrabold text-[#00c853]">{project.healthScore}%</span>
                                            <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                                              <div
                                                className="bg-[#00c853] h-1 rounded-full"
                                                style={{ width: `${project.healthScore}%` }}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-3 text-right">
                                          <div className="flex items-center justify-end gap-1.5">
                                            <button
                                              onClick={() => {
                                                const matchThread = chatThreadsList.find(t => t.email === project.email || t.id === project.email || t.name === project.leadName);
                                                setActiveThreadId(matchThread ? matchThread.id : (project.email || getChatUserId(null)));
                                                setActiveTab('chat');
                                              }}
                                              className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-700 dark:hover:bg-emerald-600 text-slate-500 dark:text-slate-404 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                                              title="Chat Center"
                                            >
                                              <MessageSquare className="w-3.5 h-3.5" />
                                              <span>Chat</span>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right: Live Inquiries Widget */}
                        <div className={`lg:col-span-4 p-5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                          <div>
                            <h3 className="text-md font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-[#00c853]" />
                                <span>Live Inquiries</span>
                              </span>
                              <span className="bg-red-500 text-white text-[9.5px] px-2 py-0.5 rounded-full font-black tracking-wide animate-pulse">NEW</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-404 mt-0.5">Approve requests to instantly convert them into active pipeline projects!</p>
                          </div>

                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {crmInquiriesList.map((inq) => (
                              <div
                                key={inq.id}
                                className={`p-3.5 rounded-xl border transition-all relative group ${inq.unread
                                  ? 'border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]'
                                  : 'border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/30'
                                  }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                                    {inq.clientName}
                                  </span>
                                  <span className="text-[9.5px] text-slate-404 font-bold font-mono">
                                    {inq.timeAgo}
                                  </span>
                                </div>

                                <div className="text-[10.5px] text-emerald-500 dark:text-emerald-404 font-bold mt-1 uppercase tracking-tight">
                                  {inq.projectName}
                                </div>

                                <p className="text-[11px] text-slate-500 dark:text-slate-404 mt-1 line-clamp-2">
                                  {inq.summary}
                                </p>

                                <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-2.5 mt-2.5">
                                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-emerald-404">
                                    Est: {inq.budget}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    {inq.unread && (
                                      <button
                                        onClick={() => {
                                          setCrmInquiriesList(prev => prev.map(i => i.id === inq.id ? { ...i, unread: false } : i));
                                          triggerToast(`🔍 Marked inquiry from ${inq.clientName} as read.`);
                                        }}
                                        className="text-[9.5px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer px-1 py-0.5"
                                      >
                                        Read
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        // Add to Active Projects
                                        const keyId = `#PJ-${Math.floor(4000 + Math.random() * 999)}`;
                                        const newProj: CRMProject = {
                                          id: keyId,
                                          name: inq.projectName,
                                          leadName: inq.clientName.replace(" Team", "").replace(" Marketing", "").replace(" Tech", ""),
                                          leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                          status: 'ON TRACK',
                                          healthScore: 90,
                                          budget: inq.budget || '₹3,00,000',
                                          description: inq.summary,
                                          progress: 10
                                        };
                                        setCrmProjectsList(prev => [newProj, ...prev]);
                                        setCrmInquiriesList(prev => prev.filter(i => i.id !== inq.id));
                                        setActiveProjectsCount(prev => prev + 1);
                                        triggerToast(`🎉 Dynamic Activation: Inquiry from ${inq.clientName} is now active under pipeline project ID ${keyId}!`);
                                      }}
                                      className="px-2 py-1 text-[9.5px] font-black text-white bg-[#00c853] hover:bg-[#00af48] rounded-lg shadow-xs transition-all cursor-pointer uppercase flex items-center gap-1"
                                    >
                                      <Check className="w-2.5 h-2.5" />
                                      <span>Approve</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Secure Workspace Disclaimer */}
                    <div className="text-center pt-8 pb-2 max-w-3xl mx-auto">
                      <span className="block text-[9.5px] tracking-widest text-slate-400 dark:text-slate-500 font-extrabold uppercase select-none">
                        DigiWorku CRM Node Server Connected Securely • 256-bit SSL TLS Encryption Active
                      </span>
                    </div>

                    {/* Platform Footer with Legal Links */}
                    <footer className="border-t border-slate-200 dark:border-slate-800 mt-4 pt-6 pb-8 px-4">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
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
                              onClick={() => { setActiveLegalSlug(slug); setActiveTab('legal'); }}
                              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#00c853] dark:hover:text-[#00c853] transition-colors cursor-pointer underline-offset-2 hover:underline"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-medium">
                          © {new Date().getFullYear()} DigiWorku. All rights reserved. · India's Digital Workforce Platform
                        </p>
                      </div>
                    </footer>

                  </motion.div>
                )}

                {/* VIEW 1.1: CLIENTS DIRECTORY TAB */}
                {activeTab === 'clients' && (
                  <motion.div
                    key="tab-clients"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Users className="w-5.5 h-5.5 text-emerald-500" />
                          <span>Corporate Client Directory</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Directory of enterprise partners with interactive session mapping.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search clients..."
                            value={chatSearchQuery}
                            onChange={(e) => setChatSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-56 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-705 dark:text-slate-205 outline-none focus:border-[#00c853] transition-all"
                          />
                        </div>
                        <button
                          onClick={() => {
                            triggerToast("👤 Creating simulated clients requires corporate identity tokens.");
                          }}
                          className="px-3 py-2 text-xs font-black text-white bg-[#00c853] hover:bg-emerald-600 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>+ Create Client</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {chatThreadsList
                        .filter(t => t.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) || t.companyName.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                        .map((client) => (
                          <div
                            key={client.id}
                            className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="relative inline-block">
                                  <img
                                    src={client.avatarUrl}
                                    alt={client.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                                  />
                                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${client.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                </span>
                                <div>
                                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{client.name}</h3>
                                  <p className="text-[11px] text-[#00c853] font-bold mt-0.5">{client.companyName}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setActiveThreadId(client.id);
                                  setActiveTab('chat');
                                  triggerToast(`💬 Connecting directly with ${client.name} via Chat Hub...`);
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#00c853] hover:bg-[#e8fcf0] dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
                                title="Direct Slack Link"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex justify-between">
                                <span className="font-medium">Direct Line:</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer" onClick={() => {
                                  triggerToast(`📞 Simulated Dialing: ${client.phone}`);
                                }}>{client.phone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Work Email:</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer" onClick={() => {
                                  triggerToast("📋 Copied email address to clipboard!");
                                }}>{client.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Active Contract:</span>
                                <span className="font-bold text-[#00c853]">{client.activeProjectName}</span>
                              </div>
                            </div>

                            {/* Client Progress Tracker inside details */}
                            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between text-[11px] mb-1 font-bold">
                                <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">Contract Progress</span>
                                <span className="text-[#00c853]">{client.activeProjectProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#00c853] h-1.5 rounded-full" style={{ width: `${client.activeProjectProgress}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* VIEW 1.2: PROJECTS MANAGER KANBAN TAB */}
                {activeTab === 'projects' && (
                  <motion.div
                    key="tab-projects"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Folder className="w-5.5 h-5.5 text-emerald-500" />
                          <span>Projects Control pipeline</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Interactive scrum workspace. Toggle views to manage milestones or drag sliders to scale progress.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* View Switcher Segmented Control */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                          <button
                            onClick={() => setProjectsViewMode('kanban')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${projectsViewMode === 'kanban'
                              ? 'bg-[#00c853] text-white shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Kanban Board</span>
                          </button>
                          <button
                            onClick={() => setProjectsViewMode('timeline')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${projectsViewMode === 'timeline'
                              ? 'bg-[#00c853] text-white shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                              }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Milestones Timeline</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setIsAddProjectModalOpen(true)}
                          className="px-3.5 py-2 text-xs font-black text-white bg-[#00c853] hover:bg-emerald-600 rounded-xl cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <span>+ Add New Project</span>
                        </button>
                      </div>
                    </div>

                    {projectsViewMode === 'kanban' ? (
                      /* Status Column Kanban Boards */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* COLUMN 1: ON TRACK */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2.5">
                            <span className="text-xs font-black uppercase text-emerald-500 tracking-wider">ON TRACK</span>
                            <span className="bg-[#e8fcf0] dark:bg-emerald-950/60 text-[#00c853] text-[10px] px-2.5 py-0.5 rounded-full font-black">
                              {crmProjectsList.filter(p => p.status === 'ON TRACK').length}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {crmProjectsList.filter(p => p.status === 'ON TRACK').map((project) => (
                              <div
                                key={project.id}
                                className={`p-4.5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="text-[10px] font-mono text-slate-400 font-extrabold">{project.id}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10.5px] font-extrabold text-[#00c853]">{project.budget}</span>
                                    <button onClick={() => setCrmProjectsList(prev => prev.filter(p => p.id !== project.id))} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors" title="Delete Project">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{project.description || "Digital workforce operational milestone."}</p>

                                <div className="flex items-center gap-2 mb-3.5 bg-slate-55 dark:bg-slate-800 p-2 rounded-xl">
                                  <img src={project.leadAvatar} alt={project.leadName} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{project.leadName}</span>
                                </div>

                                {/* Dynamic slider */}
                                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  <div className="flex justify-between text-[10.5px] font-extrabold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">MOD PROGRESS</span>
                                    <span className="text-[#00c853]">{project.progress ?? 45}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={project.progress ?? 45}
                                    onChange={(e) => {
                                      const nextVal = Number(e.target.value);
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: nextVal } : p));
                                    }}
                                    className="w-full accent-[#00c853] cursor-pointer"
                                  />
                                </div>

                                {/* Column Mover Trigger */}
                                <div className="flex justify-end gap-1 mt-3">
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'IN REVIEW' } : p));
                                      triggerToast("🚀 Shifted project to In Review column.");
                                    }}
                                    className="text-[9.5px] uppercase font-black tracking-wider text-slate-400 hover:text-[#00c853] cursor-pointer"
                                  >
                                    In Review →
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COLUMN 2: IN REVIEW */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b-2 border-amber-500 pb-2.5">
                            <span className="text-xs font-black uppercase text-amber-500 tracking-wider">IN REVIEW</span>
                            <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-500 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                              {crmProjectsList.filter(p => p.status === 'IN REVIEW').length}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {crmProjectsList.filter(p => p.status === 'IN REVIEW').map((project) => (
                              <div
                                key={project.id}
                                className={`p-4.5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-205 shadow-xs'}`}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="text-[10px] font-mono text-slate-400 font-extrabold">{project.id}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10.5px] font-extrabold text-[#00c853]">{project.budget}</span>
                                    <button onClick={() => setCrmProjectsList(prev => prev.filter(p => p.id !== project.id))} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors" title="Delete Project">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{project.description || "Digital workforce operational milestone."}</p>

                                <div className="flex items-center gap-2 mb-3.5 bg-slate-55 dark:bg-slate-800 p-2 rounded-xl">
                                  <img src={project.leadAvatar} alt={project.leadName} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{project.leadName}</span>
                                </div>

                                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  <div className="flex justify-between text-[10.5px] font-extrabold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">MOD PROGRESS</span>
                                    <span className="text-amber-500">{project.progress ?? 80}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={project.progress ?? 80}
                                    onChange={(e) => {
                                      const nextVal = Number(e.target.value);
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: nextVal } : p));
                                    }}
                                    className="w-full accent-amber-500 cursor-pointer"
                                  />
                                </div>

                                <div className="flex justify-between mt-3 text-[9.5px] uppercase font-black tracking-wider text-slate-400">
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'ON TRACK' } : p));
                                      triggerToast("⏪ Shifted project back to Active pipeline.");
                                    }}
                                    className="hover:text-emerald-500 cursor-pointer"
                                  >
                                    ← Active
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'STABLE' } : p));
                                      triggerToast("🚀 Milestone Stable: Live parameters verified!");
                                    }}
                                    className="hover:text-blue-500 cursor-pointer"
                                  >
                                    Stable →
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COLUMN 3: STABLE */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b-2 border-blue-500 pb-2.5">
                            <span className="text-xs font-black uppercase text-blue-500 tracking-wider">STABLE (STAGED)</span>
                            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-500 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                              {crmProjectsList.filter(p => p.status === 'STABLE').length}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {crmProjectsList.filter(p => p.status === 'STABLE').map((project) => (
                              <div
                                key={project.id}
                                className={`p-4.5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-250 shadow-xs'}`}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="text-[10px] font-mono text-slate-400 font-extrabold">{project.id}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10.5px] font-extrabold text-[#00c853]">{project.budget}</span>
                                    <button onClick={() => setCrmProjectsList(prev => prev.filter(p => p.id !== project.id))} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors" title="Delete Project">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{project.description || "Digital workforce operational milestone."}</p>

                                <div className="flex items-center gap-2 mb-3.5 bg-slate-55 dark:bg-slate-800 p-2 rounded-xl">
                                  <img src={project.leadAvatar} alt={project.leadName} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{project.leadName}</span>
                                </div>

                                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  <div className="flex justify-between text-[10.5px] font-extrabold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">MOD PROGRESS</span>
                                    <span className="text-blue-500">{project.progress ?? 100}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={project.progress ?? 100}
                                    onChange={(e) => {
                                      const nextVal = Number(e.target.value);
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: nextVal } : p));
                                    }}
                                    className="w-full accent-blue-500 cursor-pointer"
                                  />
                                </div>

                                <div className="flex justify-between mt-3 text-[9.5px] uppercase font-black tracking-wider text-slate-400">
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'IN REVIEW' } : p));
                                      triggerToast("⏪ Shifted project back to Review stage.");
                                    }}
                                    className="hover:text-amber-500 cursor-pointer"
                                  >
                                    ← Review
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'OFF TRACK' } : p));
                                      triggerToast("🚨 Project flagged as Off Track.");
                                    }}
                                    className="hover:text-red-500 cursor-pointer"
                                  >
                                    Off Track →
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COLUMN 4: OFF TRACK */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b-2 border-red-500 pb-2.5">
                            <span className="text-xs font-black uppercase text-red-500 tracking-wider">OFF TRACK</span>
                            <span className="bg-red-50 dark:bg-red-950/60 text-red-500 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                              {crmProjectsList.filter(p => p.status === 'OFF TRACK').length}
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {crmProjectsList.filter(p => p.status === 'OFF TRACK').map((project) => (
                              <div
                                key={project.id}
                                className={`p-4.5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}
                              >
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="text-[10px] font-mono text-slate-400 font-extrabold">{project.id}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10.5px] font-extrabold text-[#00c853]">{project.budget}</span>
                                    <button onClick={() => setCrmProjectsList(prev => prev.filter(p => p.id !== project.id))} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors" title="Delete Project">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{project.name}</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">{project.description || "Digital workforce operational milestone."}</p>

                                <div className="flex items-center gap-2 mb-3.5 bg-slate-55 dark:bg-slate-800 p-2 rounded-xl">
                                  <img src={project.leadAvatar} alt={project.leadName} className="w-5 h-5 rounded-full object-cover" />
                                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{project.leadName}</span>
                                </div>

                                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  <div className="flex justify-between text-[10.5px] font-extrabold">
                                    <span className="text-slate-400 uppercase tracking-widest text-[9.5px]">MOD PROGRESS</span>
                                    <span className="text-red-500">{project.progress ?? 20}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={project.progress ?? 20}
                                    onChange={(e) => {
                                      const nextVal = Number(e.target.value);
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: nextVal } : p));
                                    }}
                                    className="w-full accent-red-500 cursor-pointer"
                                  />
                                </div>

                                <div className="flex justify-start gap-1 mt-3">
                                  <button
                                    onClick={() => {
                                      setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: 'ON TRACK' } : p));
                                      triggerToast("⏪ Shifted project back to Active pipeline.");
                                    }}
                                    className="text-[9.5px] uppercase font-black tracking-wider text-[#00c853] cursor-pointer hover:underline"
                                  >
                                    ← Move On Track
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Visual Timeline View of Project Milestones */
                      <div className="space-y-6">
                        {/* Visual Search Filter for Timeline view */}
                        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-[#202020]/30 border-slate-800' : 'bg-slate-100/50 border-slate-200'} flex flex-wrap items-center justify-between gap-4`}>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Active Delivery Timelines</span>
                            <p className="text-[11px] text-slate-400">Track key milestones, adjust target progress levels, and set execution status instantly.</p>
                          </div>
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Filter timelines..."
                              value={searchCrmProjectQuery}
                              onChange={(e) => setSearchCrmProjectQuery(e.target.value)}
                              className="pl-9 pr-4 py-2 w-56 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-[#00c853] transition-all text-slate-800 dark:text-slate-100 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {crmProjectsList
                            .filter(project =>
                              project.name.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()) ||
                              project.leadName.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()) ||
                              project.id.toLowerCase().includes(searchCrmProjectQuery.toLowerCase())
                            )
                            .map((project) => {
                              const currentProgress = project.progress ?? 0;

                              // Defined milestones with target progresses
                              const milestones = [
                                { percentage: 25, label: "Milestone 1", title: "Discovery & Kickoff", desc: "Scope alignment & tech stack signoff" },
                                { percentage: 50, label: "Milestone 2", title: "UI/UX Prototype", desc: "Interactive mockups & layout design" },
                                { percentage: 75, label: "Milestone 3", title: "Core Architecture", desc: "Service integration & feature sprint" },
                                { percentage: 100, label: "Milestone 4", title: "QA & Client Signoff", desc: "Deployment & production handoff" }
                              ];

                              const isStable = project.status === 'STABLE';
                              const isReview = project.status === 'IN REVIEW';
                              const isOffTrack = project.status === 'OFF TRACK';

                              return (
                                <div
                                  key={project.id}
                                  className={`p-6 rounded-2xl border transition-all ${darkMode
                                    ? 'bg-[#202020]/45 border-slate-800/80 hover:bg-[#202020]/60 hover:border-slate-700'
                                    : 'bg-white border-slate-200/90 shadow-xs hover:shadow-sm hover:border-slate-300'
                                    } space-y-6`}
                                >
                                  {/* Timeline Project Info Header */}
                                  <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <div className="p-3 bg-emerald-500/10 rounded-xl text-[#00c853]">
                                        <Folder className="w-5.5 h-5.5" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{project.name}</h3>
                                          <span className="text-[10px] font-mono text-slate-400 font-extrabold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{project.id}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{project.description || "Digital workforce operational milestone."}</p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                      <div className="text-right">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Allocated Budget</span>
                                        <span className="text-xs font-black text-[#00c853]">{project.budget}</span>
                                      </div>
                                      <button onClick={() => setCrmProjectsList(prev => prev.filter(p => p.id !== project.id))} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer" title="Delete Project">
                                        <Trash2 className="w-4 h-4" />
                                      </button>

                                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <img src={project.leadAvatar} alt={project.leadName} className="w-6 h-6 rounded-full object-cover" />
                                        <div className="text-left">
                                          <span className="text-[9px] text-slate-400 font-bold block leading-none">Lead Operator</span>
                                          <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{project.leadName}</span>
                                        </div>
                                      </div>

                                      {/* Status Trigger */}
                                      <button
                                        onClick={() => {
                                          const statuses: Array<'ON TRACK' | 'IN REVIEW' | 'STABLE' | 'OFF TRACK'> = ['ON TRACK', 'IN REVIEW', 'STABLE', 'OFF TRACK'];
                                          const currentIdx = statuses.indexOf(project.status);
                                          const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                                          setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, status: nextStatus } : p));
                                          triggerToast(`🔄 Status changed: ${project.name} is now ${nextStatus}!`);
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black cursor-pointer uppercase select-none flex items-center gap-1.5 transition-all ${isStable
                                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/15'
                                          : isReview
                                            ? 'bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400 border border-amber-500/15'
                                            : isOffTrack
                                              ? 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border border-red-500/15'
                                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00c853] dark:text-emerald-400 border border-[#00c853]/15'
                                          }`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${isStable ? 'bg-blue-500' : isReview ? 'bg-amber-500' : isOffTrack ? 'bg-red-500' : 'bg-[#00c853]'
                                          }`} />
                                        <span>{project.status}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Progress bar and slider slider component */}
                                  <div className="space-y-3 bg-slate-55 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/45">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">Project Delivery Progress</span>
                                        <span className="px-2.5 py-0.5 bg-[#00c853]/15 text-[#00c853] text-[10px] font-mono font-black rounded-md">{currentProgress}%</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-bold hidden sm:block">Drag slider or click milestones below to modify progress percentage</span>
                                    </div>

                                    {/* Progress Track */}
                                    <div className="relative pt-2 pb-2">
                                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                        <div
                                          className="bg-gradient-to-r from-emerald-500 to-[#00c853] h-full rounded-full transition-all duration-300 relative"
                                          style={{ width: `${currentProgress}%` }}
                                        >
                                          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] opacity-10" />
                                        </div>
                                      </div>

                                      {/* Range Slider Input laid on top of the progress bar track for dynamic updating */}
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={currentProgress}
                                        onChange={(e) => {
                                          const nextVal = Number(e.target.value);
                                          setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: nextVal } : p));
                                        }}
                                        className="w-full h-3 absolute top-2 left-0 opacity-0 cursor-pointer accent-[#00c853] z-10"
                                      />
                                    </div>
                                  </div>

                                  {/* Milestones Horizontal Line Timeline */}
                                  <div className="relative pt-4 pb-2">
                                    {/* Connector horizontal line */}
                                    <div className="absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                                    <div
                                      className="absolute top-9 left-[12.5%] h-0.5 bg-[#00c853] transition-all duration-300 z-0"
                                      style={{ width: `${Math.min(75, Math.max(0, ((currentProgress - 25) / 75) * 75))}%` }}
                                    />

                                    <div className="grid grid-cols-4 relative z-10">
                                      {milestones.map((milestone, idx) => {
                                        const isCompleted = currentProgress >= milestone.percentage;
                                        // Determine if this is the active milestone (i.e. the next milestone we are currently working towards)
                                        const isActive = !isCompleted && (idx === 0 || currentProgress >= milestones[idx - 1].percentage);

                                        return (
                                          <div key={idx} className="flex flex-col items-center text-center px-1">
                                            {/* Milestone dot */}
                                            <button
                                              onClick={() => {
                                                setCrmProjectsList(prev => prev.map(p => p.id === project.id ? { ...p, progress: milestone.percentage } : p));
                                                triggerToast(`🎯 Set progress to ${milestone.percentage}% (${milestone.title})!`);
                                              }}
                                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${isCompleted
                                                ? 'bg-[#00c853] text-white ring-4 ring-[#00c853]/15'
                                                : isActive
                                                  ? 'bg-amber-500 text-white ring-4 ring-amber-500/15 animate-pulse'
                                                  : 'bg-slate-150 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-[#00c853]/40'
                                                }`}
                                            >
                                              {isCompleted ? (
                                                <Check className="w-5 h-5 font-black" />
                                              ) : (
                                                <span className="text-[11px] font-black">{milestone.percentage}%</span>
                                              )}
                                            </button>

                                            {/* Milestone info text */}
                                            <div className="mt-3.5 space-y-0.5">
                                              <span className={`block text-[10px] font-black uppercase tracking-wider ${isCompleted ? 'text-[#00c853]' : isActive ? 'text-amber-500' : 'text-slate-400'
                                                }`}>
                                                {milestone.label}
                                              </span>
                                              <h5 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                                {milestone.title}
                                              </h5>
                                              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[130px] mx-auto leading-normal hidden md:block">
                                                {milestone.desc}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                          {crmProjectsList.filter(project =>
                            project.name.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()) ||
                            project.leadName.toLowerCase().includes(searchCrmProjectQuery.toLowerCase()) ||
                            project.id.toLowerCase().includes(searchCrmProjectQuery.toLowerCase())
                          ).length === 0 && (
                              <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <span className="text-xs text-slate-500 font-bold block">No active project timelines found matching "{searchCrmProjectQuery}"</span>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* VIEW 1.3: INBOUND INQUIRIES WORKSPACE TAB */}
                {activeTab === 'inquiries' && (
                  <motion.div
                    key="tab-inquiries"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Phone className="w-5 h-5 text-emerald-500" />
                          <span>Inbound Leads Inquiries Feed</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accept corporate proposals to immediately allocate system resources. Data synced live from Supabase.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => fetchInquiriesFromDB()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00c853] bg-[#00c853]/10 hover:bg-[#00c853]/20 border border-[#00c853]/30 rounded-lg transition-all cursor-pointer"
                          title="Refresh from Supabase DB"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Refresh DB
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">Total En-route:</span>
                          <span className="p-1 px-3 bg-red-500 text-white rounded-full text-xs font-black">{crmInquiriesList.length} leads</span>
                        </div>
                      </div>
                    </div>

                    {/* DB Status indicator */}
                    <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg w-fit ${
                      supabaseStatus === 'connected'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : supabaseStatus === 'checking'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        supabaseStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                        supabaseStatus === 'checking' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'
                      }`} />
                      {supabaseStatus === 'connected' ? '🟢 Live — Connected to Supabase DB (inquiries table)' :
                       supabaseStatus === 'checking' ? '🟡 Connecting to database...' :
                       '🔴 DB Disconnected — showing local data only'}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {crmInquiriesList.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                          <div className="w-16 h-16 bg-[#00c853]/10 rounded-2xl flex items-center justify-center mb-4">
                            <Phone className="w-8 h-8 text-[#00c853]" />
                          </div>
                          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">No Inbound Leads Yet</h3>
                          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                            When clients submit service requests on the public-facing site, their inquiries will appear here in real-time from the Supabase database.
                          </p>
                          <button
                            onClick={() => fetchInquiriesFromDB()}
                            className="mt-5 px-4 py-2 bg-[#00c853]/10 hover:bg-[#00c853]/20 text-[#00c853] font-bold text-xs rounded-lg transition-all cursor-pointer border border-[#00c853]/30"
                          >
                            🔄 Refresh from DB
                          </button>
                        </div>
                      )}
                      {crmInquiriesList.map((inq) => {
                        const isFreelancerApp = inq.projectName.includes('Freelancer') || inq.clientName.includes('Freelancer') || inq.summary.includes('Primary Skill');
                        // Extract portfolio URL if available
                        const portfolioMatch = inq.summary.match(/Portfolio:\s*(https?:\/\/[^\s|]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s|]*)/);
                        const portfolioUrl = portfolioMatch && portfolioMatch[1] !== 'N/A' ? (portfolioMatch[1].startsWith('http') ? portfolioMatch[1] : `https://${portfolioMatch[1]}`) : null;

                        return (
                        <div
                          key={inq.id}
                          className={`p-6 rounded-2xl border ${
                            inq.unread
                              ? darkMode ? 'bg-[#1a2a1e] border-[#00c853]/30' : 'bg-[#f0fff6] border-[#00c853]/25 shadow-sm'
                              : darkMode ? 'bg-[#202020]/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                          } space-y-4 relative overflow-hidden`}
                        >
                          {/* Unread indicator stripe */}
                          {inq.unread && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#00c853] rounded-l-2xl" />
                          )}
                          
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono text-slate-400 font-black">{inq.id.slice(0, 18)}</span>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  inq.status === 'new'
                                    ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                                    : inq.status === 'reviewed'
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                                }`}>
                                  {inq.status === 'new' ? '🔴 New' : inq.status === 'reviewed' ? '🟡 Reviewed' : '🟢 Converted'}
                                </span>
                                {isFreelancerApp && (
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300/40 flex items-center gap-1">
                                    👨‍💻 Freelancer Candidate
                                  </span>
                                )}
                              </div>
                              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                {inq.clientName}
                              </h3>
                              <span className="text-[11px] text-[#00c853] font-bold tracking-tight">{inq.projectName}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{inq.timeAgo}</span>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="block text-[9.5px] uppercase font-black text-slate-400 tracking-widest mb-1">
                              {isFreelancerApp ? 'FREELANCER PROFILE & EXPERIENCE' : 'PROPOSAL SUMMARY'}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                              {inq.summary}
                            </p>
                          </div>

                          {/* Contact info from DB */}
                          {(inq.email || inq.mobile || portfolioUrl) && (
                            <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              {inq.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#00c853]" />
                                  {inq.email}
                                </span>
                              )}
                              {inq.mobile && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#00c853]" />
                                  {inq.mobile}
                                </span>
                              )}
                              {portfolioUrl && (
                                <a
                                  href={portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-bold"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View Portfolio
                                </a>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">Budget: {inq.budget || "₹3,50,000"}</span>

                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  // Remove from local state immediately
                                  setCrmInquiriesList(prev => prev.filter(i => i.id !== inq.id));
                                  // Delete from Supabase DB
                                  try {
                                    const { error } = await supabase.from('inquiries').delete().eq('id', inq.id);
                                    if (error) console.warn('Dismiss DB delete error:', error.message);
                                  } catch (err: any) {
                                    console.warn('Dismiss DB delete catch:', err.message);
                                  }
                                  triggerToast("🗑️ Dismissed inquiry successfully.");
                                }}
                                className="px-3 py-1.5 text-xs font-extrabold text-slate-500 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                              >
                                Dismiss
                              </button>

                              <button
                                onClick={async () => {
                                  const keyId = `#PJ-${Math.floor(4000 + Math.random() * 999)}`;
                                  const newProj: CRMProject = {
                                    id: keyId,
                                    name: inq.projectName,
                                    leadName: inq.clientName.replace(" Team", "").replace(" Marketing", "").replace(" Tech", ""),
                                    leadAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                    status: 'ON TRACK',
                                    healthScore: 95,
                                    budget: inq.budget || '₹3,00,000',
                                    description: inq.summary,
                                    progress: 5
                                  };
                                  // Update local state
                                  setCrmProjectsList(prev => [newProj, ...prev]);
                                  setCrmInquiriesList(prev => prev.filter(i => i.id !== inq.id));
                                  setActiveProjectsCount(prev => prev + 1);
                                  // Update DB: mark inquiry as 'converted' then insert into projects
                                  try {
                                    await supabase.from('inquiries').update({ status: 'converted' }).eq('id', inq.id);
                                    await supabase.from('projects').insert({
                                      id: keyId,
                                      title: inq.projectName,
                                      description: inq.summary,
                                      category: 'Consulting',
                                      tags: ['LEAD', 'CONVERTED'],
                                      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
                                      client_name: inq.clientName,
                                      budget: inq.budget || '₹3,00,000',
                                      status: 'ON TRACK',
                                      progress: 5,
                                      health_score: 95
                                    });
                                  } catch (dbErr: any) {
                                    console.warn('Activate Contract DB error:', dbErr.message);
                                  }
                                  triggerToast(`🎉 Converted leads: Appended active pipeline project ${keyId}!`);
                                }}
                                className="px-3 py-1.5 text-xs font-black text-white bg-[#00c853] hover:bg-[#00af48] rounded-lg shadow-sm cursor-pointer transition-all uppercase"
                              >
                                ✓ Activate Contract
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </motion.div>
                )}


                {/* VIEW 1.4: REVIEWS & PRAISES FEEDBACK TAB */}
                {activeTab === 'reviews' && (
                  <motion.div
                    key="tab-reviews"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Star className="w-5.5 h-5.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                          <span>Active Client Praises Feed</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review feedback ratings registered by partners globally.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                      {/* Reviews List */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-[#00c853] rounded-xl font-extrabold text-sm">99%</div>
                          <div>
                            <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight">Corporate CSAT Delivery index</span>
                            <span className="text-[10px] text-slate-400 font-bold">Calculated dynamically across 150+ operational reviews.</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {reviewsList.map((rev) => (
                            <div key={rev.id} className={`p-5 rounded-xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
                              <div className="flex items-center gap-1 text-amber-500 mb-2">
                                {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                                  <Star key={idx} className="w-4 h-4 fill-current" />
                                ))}
                              </div>
                              <p className="text-xs font-semibold text-slate-705 dark:text-slate-205 italic leading-relaxed">
                                "{rev.text}"
                              </p>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-[#00c853]/15 text-[#00c853] font-black text-[10px] flex items-center justify-center">
                                    {rev.avatarInitials}
                                  </span>
                                  <span className="text-[11px] font-bold text-[#00c853]">{rev.name} <span className="text-slate-400 font-normal">({rev.role})</span></span>
                                </div>
                                <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submission Form */}
                      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4 h-fit`}>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Submit New Praise Log</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Simulate partner feedback inputs live on console dashboard.</p>
                        </div>

                        <div className="space-y-3 font-semibold text-xs text-slate-700 dark:text-slate-300">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">PARTNER REPRESENTATIVE</label>
                            <input type="text" placeholder="e.g. Ramesh Singh, CTO" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200" id="review-partner-name" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">RATING STARS</label>
                            <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200" id="review-partner-stars">
                              <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                              <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">FEEDBACK ESSAY</label>
                            <textarea placeholder="Write review..." className="w-full h-20 p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200" id="review-partner-text" />
                          </div>

                          <button
                            onClick={() => {
                              const nameEl = document.getElementById('review-partner-name') as HTMLInputElement;
                              const starEl = document.getElementById('review-partner-stars') as HTMLSelectElement;
                              const textEl = document.getElementById('review-partner-text') as HTMLTextAreaElement;
                              if (nameEl && textEl && nameEl.value && textEl.value) {
                                const initials = nameEl.value.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) || 'PR';
                                const newReview: ReviewItem = {
                                  id: `rev-${Date.now()}`,
                                  name: nameEl.value.trim(),
                                  role: 'Partner Client',
                                  rating: Number(starEl ? starEl.value : 5),
                                  text: textEl.value.trim(),
                                  avatarInitials: initials,
                                  createdAt: 'Just now'
                                };
                                setReviewsList(prev => [newReview, ...prev]);
                                triggerToast(`🌟 Feedback Log Approved: Thank you ${nameEl.value}!`);
                                nameEl.value = '';
                                textEl.value = '';
                              } else {
                                triggerToast("⚠️ Ensure representative name and description are filled!");
                              }
                            }}
                            className="w-full py-2 bg-[#00c853] hover:bg-emerald-600 font-black text-white rounded-lg cursor-pointer transition-all text-xs"
                          >
                            Submit Feedback
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* VIEW 1.5: ACTIVE TEAM GRID TAB */}
                {activeTab === 'team' && (
                  <motion.div
                    key="tab-team"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <UserCheck className="w-5.5 h-5.5 text-emerald-500" />
                          <span>DigiWorku Digital Workforce Team</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">India's leading specialized talent pool assigned to current client blocks.</p>
                      </div>
                      <button
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>New Team Member</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                      {teamMembers.map((member) => {
                        const isBlocked = !!member.blocked;
                        return (
                          <div
                            key={member.id}
                            className={`relative p-5 rounded-2xl border text-center transition-all duration-300 group ${isBlocked
                              ? 'bg-red-500/5 dark:bg-red-950/10 border-red-500/20'
                              : darkMode
                                ? 'bg-[#202020]/50 border-slate-800 hover:border-slate-700 hover:shadow-lg'
                                : 'bg-white border-slate-200 shadow-sm hover:shadow-lg'
                              } space-y-3 overflow-hidden`}
                          >
                            {/* ABSOLUTE OVERLAY FOR DELETE CONFIRMATION */}
                            {deleteConfirmId === member.id && (
                              <div className="absolute inset-0 bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center z-30 space-y-3">
                                <Trash2 className="w-8 h-8 text-red-500 animate-bounce" />
                                <div>
                                  <p className="text-xs font-black text-white">Delete Member?</p>
                                  <p className="text-[10px] text-slate-400 mt-1">This will remove {member.name} permanently.</p>
                                </div>
                                <div className="flex gap-2 w-full pt-1">
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      setTeamMembers(prev => prev.filter(m => m.id !== member.id));
                                      triggerToast(`🗑️ Erased team member: ${member.name}`);
                                      setDeleteConfirmId(null);
                                    }}
                                    className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* ABSOLUTE OVERLAY FOR PROFILE PICTURE UPDATE */}
                            {editingPicMemberId === member.id && (
                              <div className="absolute inset-0 bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center z-30 space-y-2">
                                <Camera className="w-7 h-7 text-emerald-400" />
                                <div>
                                  <p className="text-xs font-black text-white">Update Profile Photo</p>
                                  <p className="text-[9px] text-slate-400">Enter direct image URL below</p>
                                </div>
                                <input
                                  type="text"
                                  value={newPicUrl}
                                  onChange={(e) => setNewPicUrl(e.target.value)}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-center"
                                />
                                <div className="flex gap-2 w-full pt-1">
                                  <button
                                    onClick={() => {
                                      setEditingPicMemberId(null);
                                      setNewPicUrl('');
                                    }}
                                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (newPicUrl.trim()) {
                                        setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...m, avatarUrl: newPicUrl.trim() } : m));
                                        triggerToast(`📸 Updated profile photo of ${member.name}`);
                                      } else {
                                        triggerToast(`⚠️ Please enter a valid URL`);
                                      }
                                      setEditingPicMemberId(null);
                                      setNewPicUrl('');
                                    }}
                                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg transition-colors cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Top-right management icons (hover effects on desktop) */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {/* Block / Unblock Toggle Button */}
                              <button
                                onClick={() => {
                                  setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...m, blocked: !m.blocked } : m));
                                  triggerToast(isBlocked ? `🔓 Unblocked workforce partner: ${member.name}` : `🔒 Blocked workforce partner: ${member.name}`);
                                }}
                                className={`p-1.5 rounded-lg border text-[10px] transition-colors cursor-pointer ${isBlocked
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/25'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/25'
                                  }`}
                                title={isBlocked ? "Unblock Member" : "Block Member"}
                              >
                                {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                              </button>

                              {/* Delete Button Trigger */}
                              <button
                                onClick={() => {
                                  setDeleteConfirmId(member.id);
                                }}
                                className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/25 transition-colors cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Avatar block with dynamic camera overlay trigger */}
                            <div className="relative w-18 h-18 mx-auto">
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className={`w-18 h-18 rounded-full mx-auto object-cover border transition-transform duration-300 group-hover:scale-105 ${isBlocked
                                  ? 'border-red-500/50 filter grayscale opacity-60'
                                  : member.id === 'team-1'
                                    ? 'border-emerald-500/50'
                                    : 'border-slate-200 dark:border-slate-800'
                                  }`}
                              />

                              {/* Hover Overlay Camera Button */}
                              <button
                                onClick={() => {
                                  setNewPicUrl(member.avatarUrl);
                                  setEditingPicMemberId(member.id);
                                }}
                                className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-250 cursor-pointer text-white"
                                title="Change profile picture"
                              >
                                <Camera className="w-4 h-4 text-emerald-400" />
                              </button>
                            </div>

                            {/* Metadata Details */}
                            <div>
                              <h4 className={`font-black text-sm transition-colors ${isBlocked
                                ? 'text-slate-400 dark:text-slate-500 line-through'
                                : member.id === 'team-1'
                                  ? 'text-emerald-500 dark:text-emerald-400'
                                  : 'text-slate-900 dark:text-white'
                                }`}>
                                {member.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-extrabold block tracking-wide uppercase mt-0.5">{member.role}</span>
                            </div>

                            {/* Status / Blocked Indicator with custom mobile interactive strip */}
                            <div className="pt-1 flex flex-col items-center gap-2">
                              {isBlocked ? (
                                <span className="inline-block px-2.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-[9px] font-black tracking-widest animate-pulse">
                                  BLOCKED
                                </span>
                              ) : (
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider ${member.status === 'ONLINE'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 animate-pulse'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 select-none'
                                  }`}>
                                  {member.status}
                                </span>
                              )}

                              {/* Quick interactive actions on mobile (where hover is absent) */}
                              <div className="flex md:hidden items-center justify-center gap-1 mt-1">
                                <button
                                  onClick={() => {
                                    setTeamMembers(prev => prev.map(m => m.id === member.id ? { ...m, blocked: !m.blocked } : m));
                                    triggerToast(isBlocked ? `🔓 Unblocked: ${member.name}` : `🔒 Blocked: ${member.name}`);
                                  }}
                                  className="text-[9px] font-extrabold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                >
                                  {isBlocked ? '🔓 Unblock' : '🔒 Block'}
                                </button>
                                <button
                                  onClick={() => {
                                    setNewPicUrl(member.avatarUrl);
                                    setEditingPicMemberId(member.id);
                                  }}
                                  className="text-[9px] font-extrabold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                >
                                  📸 Pic
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirmId(member.id);
                                  }}
                                  className="text-[9px] font-extrabold px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-500 hover:bg-red-200 rounded transition-colors cursor-pointer"
                                >
                                  🗑️ Delete
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}

                    </div>
                  </motion.div>
                )}

                {/* VIEW 1.6: GROWTH METRICS ANALYTICS TAB */}
                {activeTab === 'analytics' && (() => {
                  const months = analyticsTimeframe === '6months'
                    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                    : analyticsTimeframe === 'ytd'
                      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                      : ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

                  // Helper to parse budget strings like "₹3,50,000" to number in Rupees
                  const parseBudgetToRupees = (budgetStr?: string): number => {
                    if (!budgetStr || budgetStr.toUpperCase() === 'TBD') return 0;
                    const digits = budgetStr.replace(/[^0-9]/g, '');
                    return digits ? parseInt(digits, 10) : 0;
                  };

                  // Helper to parse budget strings to lakhs
                  const parseBudgetToLakhs = (budgetStr?: string): number => {
                    return parseBudgetToRupees(budgetStr) / 100000;
                  };

                  // Dynamic statistics from crmProjectsList (the database/state)
                  const totalRevenueVal = crmProjectsList.reduce((sum, p) => sum + parseBudgetToRupees(p.budget), 0);
                  const totalRevenueLakhs = totalRevenueVal / 100000;

                  // CSAT is based on project healthScores (0-100 mapped to 0-5)
                  const averageCsatScore = crmProjectsList.length > 0
                    ? (crmProjectsList.reduce((sum, p) => sum + (p.healthScore || 100), 0) / crmProjectsList.length / 100) * 5
                    : 0;

                  // Account Retention rate: projects not "OFF TRACK"
                  const retentionValue = crmProjectsList.length > 0
                    ? (crmProjectsList.filter(p => p.status !== 'OFF TRACK').length / crmProjectsList.length) * 100
                    : 0;

                  // Active Deliveries count
                  const activeDeliveries = crmProjectsList.filter(p => p.status === 'ON TRACK' || p.status === 'IN REVIEW' || p.status === 'STABLE').length;

                  // Projects average progress
                  const averageProjectProgress = crmProjectsList.length > 0
                    ? Math.round(crmProjectsList.reduce((sum, p) => sum + (p.progress || 0), 0) / crmProjectsList.length)
                    : 0;

                  const datasets: Record<typeof analyticsChartMetric, {
                    current: number[];
                    previous: number[];
                    min: number;
                    max: number;
                    unit: string;
                    prefix: string;
                    title: string;
                  }> = {
                    revenue: {
                      current: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => (totalRevenueLakhs * (i + 1)) / months.length),
                      previous: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => (totalRevenueLakhs * 0.7 * (i + 1)) / months.length),
                      min: 0,
                      max: Math.max(10, Math.ceil(totalRevenueLakhs * 1.2)),
                      unit: ' L',
                      prefix: '₹',
                      title: 'Revenue Stream Volume'
                    },
                    csat: {
                      current: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.min(5.0, averageCsatScore - 0.2 + (i * 0.4 / months.length))),
                      previous: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.min(5.0, (averageCsatScore * 0.9) - 0.3 + (i * 0.4 / months.length))),
                      min: 0,
                      max: 5,
                      unit: '',
                      prefix: '',
                      title: 'Average CSAT Score'
                    },
                    retention: {
                      current: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.min(100, retentionValue - 5 + (i * 10 / months.length))),
                      previous: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.min(100, (retentionValue * 0.9) - 10 + (i * 10 / months.length))),
                      min: 0,
                      max: 100,
                      unit: '%',
                      prefix: '',
                      title: 'Account Retention Rate'
                    },
                    projects: {
                      current: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.round((crmProjectsList.length * (i + 1)) / months.length)),
                      previous: crmProjectsList.length === 0
                        ? Array(months.length).fill(0)
                        : months.map((_, i) => Math.round((crmProjectsList.length * 0.7 * (i + 1)) / months.length)),
                      min: 0,
                      max: Math.max(10, Math.ceil(crmProjectsList.length * 1.3)),
                      unit: ' Proj',
                      prefix: '',
                      title: 'Active Pipeline Deliveries'
                    }
                  };

                  const activeData = datasets[analyticsChartMetric];
                  const chartWidth = 720;
                  const chartHeight = 280;
                  const paddingLeft = 45;
                  const paddingRight = 20;
                  const paddingTop = 30;
                  const paddingBottom = 40;

                  const graphWidth = chartWidth - paddingLeft - paddingRight;
                  const graphHeight = chartHeight - paddingTop - paddingBottom;

                  const points = activeData.current.map((val, idx) => {
                    const x = paddingLeft + (idx / Math.max(1, activeData.current.length - 1)) * graphWidth;
                    const range = activeData.max - activeData.min;
                    const ratio = range > 0 ? (val - activeData.min) / range : 0;
                    const y = chartHeight - paddingBottom - ratio * graphHeight;
                    return { x, y, val };
                  });

                  const prevPoints = activeData.previous.map((val, idx) => {
                    const x = paddingLeft + (idx / Math.max(1, activeData.previous.length - 1)) * graphWidth;
                    const range = activeData.max - activeData.min;
                    const ratio = range > 0 ? (val - activeData.min) / range : 0;
                    const y = chartHeight - paddingBottom - ratio * graphHeight;
                    return { x, y, val };
                  });

                  const currentLinePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
                  const prevLinePath = prevPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

                  const currentAreaPath = points.length > 0
                    ? `${currentLinePath} L ${points[points.length - 1].x.toFixed(1)} ${(chartHeight - paddingBottom).toFixed(1)} L ${points[0].x.toFixed(1)} ${(chartHeight - paddingBottom).toFixed(1)} Z`
                    : '';

                  // Dynamic grouping of active projects into sectors
                  const sectorDistribution = {
                    uiux: { name: 'UI/UX Engineering & Styling', budget: 0, count: 0 },
                    react: { name: 'React Frontend Orchestration', budget: 0, count: 0 },
                    ai: { name: 'AI & Backend Integration Labs', budget: 0, count: 0 },
                    marketing: { name: 'Performance Marketing Sprints', budget: 0, count: 0 }
                  };

                  crmProjectsList.forEach(p => {
                    const budgetVal = parseBudgetToRupees(p.budget);
                    const descLower = (p.description + ' ' + p.name).toLowerCase();
                    if (descLower.includes('react') || descLower.includes('frontend')) {
                      sectorDistribution.react.budget += budgetVal;
                      sectorDistribution.react.count += 1;
                    } else if (descLower.includes('ai') || descLower.includes('backend') || descLower.includes('database')) {
                      sectorDistribution.ai.budget += budgetVal;
                      sectorDistribution.ai.count += 1;
                    } else if (descLower.includes('marketing') || descLower.includes('seo') || descLower.includes('growth')) {
                      sectorDistribution.marketing.budget += budgetVal;
                      sectorDistribution.marketing.count += 1;
                    } else {
                      sectorDistribution.uiux.budget += budgetVal;
                      sectorDistribution.uiux.count += 1;
                    }
                  });

                  const formatSectorBudget = (val: number): string => {
                    if (val === 0) return '₹0';
                    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
                    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
                    return `₹${val.toLocaleString('en-IN')}`;
                  };

                  const sectorBreakdown = Object.values(sectorDistribution).map(sec => {
                    const growthPercent = sec.count > 0 ? `+${10 + (sec.count * 5)}%` : '+0%';
                    return {
                      name: sec.name,
                      revenue: formatSectorBudget(sec.budget),
                      squads: sec.count,
                      growth: growthPercent
                    };
                  });

                  return (
                    <motion.div
                      key="tab-analytics"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full font-semibold"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                            <span>Console Growth Analytics</span>
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live interactive tracking of corporate delivery milestones, active volumes, and customer sentiments.</p>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-805 p-1 rounded-2xl border border-slate-250/60 dark:border-slate-700 self-start sm:self-center">
                          <button
                            onClick={() => setAnalyticsTimeframe('6months')}
                            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer ${analyticsTimeframe === '6months' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                          >
                            6 Months
                          </button>
                          <button
                            onClick={() => setAnalyticsTimeframe('12months')}
                            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer ${analyticsTimeframe === '12months' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                          >
                            12 Months
                          </button>
                          <button
                            onClick={() => setAnalyticsTimeframe('ytd')}
                            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl transition-all cursor-pointer ${analyticsTimeframe === 'ytd' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                          >
                            YTD
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-semibold">
                        <div
                          onClick={() => setAnalyticsChartMetric('revenue')}
                          className={`p-5 rounded-3xl border cursor-pointer transition-all ${analyticsChartMetric === 'revenue' ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'} space-y-3 relative overflow-hidden`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-bold">REVENUE VOLUME</span>
                            <div className={`p-1.5 rounded-lg ${analyticsChartMetric === 'revenue' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              <DollarSign className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                              ₹{totalRevenueVal >= 10000000 ? (totalRevenueVal / 10000000).toFixed(2) + ' Cr' : totalRevenueVal >= 100000 ? (totalRevenueVal / 100000).toFixed(2) + ' L' : totalRevenueVal.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10.5px] font-black text-emerald-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              {crmProjectsList.length > 0 ? '+18.4%' : '+0.0%'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-[#00c853] h-full transition-all duration-500" style={{ width: `${crmProjectsList.length > 0 ? Math.min(100, (totalRevenueLakhs / 175) * 100) : 0}%` }}></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">TARGET CAP: ₹1.75 Cr (17.5M)</span>
                        </div>

                        <div
                          onClick={() => setAnalyticsChartMetric('csat')}
                          className={`p-5 rounded-3xl border cursor-pointer transition-all ${analyticsChartMetric === 'csat' ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'} space-y-3 relative overflow-hidden`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-bold">AVERAGE CSAT SCORE</span>
                            <div className={`p-1.5 rounded-lg ${analyticsChartMetric === 'csat' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              <Award className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                              {averageCsatScore.toFixed(2)} <span className="text-xs text-slate-400 font-bold">/ 5.00</span>
                            </span>
                            <span className="text-[10.5px] font-black text-amber-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              {crmProjectsList.length > 0 ? '+2.1%' : '+0.0%'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${(averageCsatScore / 5) * 100}%` }}></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">INDUSTRY STD: 4.50</span>
                        </div>

                        <div
                          onClick={() => setAnalyticsChartMetric('retention')}
                          className={`p-5 rounded-3xl border cursor-pointer transition-all ${analyticsChartMetric === 'retention' ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'} space-y-3 relative overflow-hidden`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-bold">ACCOUNT RETENTION</span>
                            <div className={`p-1.5 rounded-lg ${analyticsChartMetric === 'retention' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              <Zap className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{retentionValue.toFixed(1)}%</span>
                            <span className="text-[10.5px] font-black text-blue-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              {crmProjectsList.length > 0 ? '+0.8%' : '+0.0%'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${retentionValue}%` }}></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">ENTERPRISE CHURN: {crmProjectsList.length > 0 ? '0.8%' : '0.0%'}</span>
                        </div>

                        <div
                          onClick={() => setAnalyticsChartMetric('projects')}
                          className={`p-5 rounded-3xl border cursor-pointer transition-all ${analyticsChartMetric === 'projects' ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'} space-y-3 relative overflow-hidden`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-bold">ACTIVE DELIVERIES</span>
                            <div className={`p-1.5 rounded-lg ${analyticsChartMetric === 'projects' ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                              <Folder className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{activeDeliveries} Active</span>
                            <span className="text-[10.5px] font-black text-purple-500 flex items-center">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              {crmProjectsList.length > 0 ? '+12%' : '+0%'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${crmProjectsList.length > 0 ? (activeDeliveries / crmProjectsList.length) * 100 : 0}%` }}></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wider">COMPLETED SESSIONS: {crmProjectsList.filter(p => p.progress === 100).length}</span>
                        </div>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block font-semibold">
                              {activeData.title} Trend Line
                            </span>
                            <p className="text-[11px] text-slate-450 font-medium">Hover over any month node point to view detailed telemetry metrics.</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => setAnalyticsShowComparison(!analyticsShowComparison)}
                              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${analyticsShowComparison ? 'bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${analyticsShowComparison ? 'bg-slate-400' : 'bg-slate-300'}`} />
                              Previous Period Overlay
                            </button>

                            <button
                              onClick={() => {
                                const headers = ['Month', 'MetricValue', 'PreviousYearValue'];
                                const rows = months.map((m, i) => [m, activeData.current[i], activeData.previous[i]]);
                                const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.setAttribute('href', url);
                                link.setAttribute('download', `digiworku_growth_${analyticsChartMetric}_report.csv`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-3 py-1.5 text-[10.5px] font-black text-white bg-[#00c853] hover:bg-emerald-600 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Export CSV</span>
                            </button>
                          </div>
                        </div>

                        <div className="relative pt-2">
                          <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-none">
                            <div className="min-w-[650px] relative">
                              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none overflow-visible">
                                <defs>
                                  <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00c853" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#00c853" stopOpacity="0.00" />
                                  </linearGradient>
                                  <linearGradient id="chartPrevGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#64748b" stopOpacity="0.10" />
                                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.00" />
                                  </linearGradient>
                                </defs>

                                {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, index) => {
                                  const y = paddingTop + ratio * graphHeight;
                                  const val = activeData.max - ratio * (activeData.max - activeData.min);
                                  return (
                                    <g key={index} className="opacity-40 dark:opacity-20">
                                      <line
                                        x1={paddingLeft}
                                        y1={y}
                                        x2={chartWidth - paddingRight}
                                        y2={y}
                                        stroke={darkMode ? '#334155' : '#cbd5e1'}
                                        strokeWidth="1"
                                        strokeDasharray="4,4"
                                      />
                                      <text
                                        x={paddingLeft - 8}
                                        y={y + 3.5}
                                        textAnchor="end"
                                        className="fill-slate-400 dark:fill-slate-500 font-mono text-[9px] font-bold"
                                      >
                                        {activeData.prefix}{val.toFixed(analyticsChartMetric === 'csat' ? 2 : 1)}{activeData.unit}
                                      </text>
                                    </g>
                                  );
                                })}

                                {analyticsHoveredPoint !== null && points[analyticsHoveredPoint] && (
                                  <line
                                    x1={points[analyticsHoveredPoint].x}
                                    y1={paddingTop}
                                    x2={points[analyticsHoveredPoint].x}
                                    y2={chartHeight - paddingBottom}
                                    stroke="#00c853"
                                    strokeWidth="1.5"
                                    strokeDasharray="2,2"
                                    className="opacity-80 dark:opacity-60"
                                  />
                                )}

                                {analyticsShowComparison && (
                                  <>
                                    <path
                                      d={prevPoints.length > 0 ? `${prevLinePath} L ${prevPoints[prevPoints.length - 1].x.toFixed(1)} ${(chartHeight - paddingBottom).toFixed(1)} L ${prevPoints[0].x.toFixed(1)} ${(chartHeight - paddingBottom).toFixed(1)} Z` : ''}
                                      fill="url(#chartPrevGradient)"
                                      className="transition-all duration-300"
                                    />
                                    <path
                                      d={prevLinePath}
                                      fill="none"
                                      stroke="#94a3b8"
                                      strokeWidth="1.5"
                                      strokeDasharray="4,4"
                                      className="transition-all duration-300 opacity-60 dark:opacity-40"
                                    />
                                  </>
                                )}

                                <path
                                  d={currentAreaPath}
                                  fill="url(#chartAreaGradient)"
                                  className="transition-all duration-300"
                                />

                                <path
                                  d={currentLinePath}
                                  fill="none"
                                  stroke="#00c853"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transition-all duration-300"
                                />

                                {points.map((pt, idx) => (
                                  <g key={idx} className="cursor-pointer">
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r="16"
                                      fill="transparent"
                                      onMouseEnter={() => setAnalyticsHoveredPoint(idx)}
                                      onMouseLeave={() => setAnalyticsHoveredPoint(null)}
                                    />
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r={analyticsHoveredPoint === idx ? 7 : 4.5}
                                      fill={darkMode ? "#111111" : "#ffffff"}
                                      stroke="#00c853"
                                      strokeWidth={analyticsHoveredPoint === idx ? 3.5 : 2}
                                      className="transition-all duration-150"
                                      pointerEvents="none"
                                    />
                                    {analyticsHoveredPoint === idx && (
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="12"
                                        fill="none"
                                        stroke="#00c853"
                                        strokeWidth="1"
                                        className="animate-ping opacity-30"
                                        pointerEvents="none"
                                      />
                                    )}
                                  </g>
                                ))}

                                {months.map((m, idx) => {
                                  const x = paddingLeft + (idx / Math.max(1, months.length - 1)) * graphWidth;
                                  return (
                                    <text
                                      key={idx}
                                      x={x}
                                      y={chartHeight - paddingBottom + 18}
                                      textAnchor="middle"
                                      className={`font-mono font-black text-[10px] transition-colors ${analyticsHoveredPoint === idx ? 'fill-emerald-500 font-extrabold' : 'fill-slate-400 dark:fill-slate-500'}`}
                                    >
                                      {m.toUpperCase()}
                                    </text>
                                  );
                                })}
                              </svg>

                              {analyticsHoveredPoint !== null && points[analyticsHoveredPoint] && (() => {
                                const pt = points[analyticsHoveredPoint];
                                const prevPt = prevPoints[analyticsHoveredPoint];
                                const currentVal = pt.val;
                                const previousVal = prevPt ? prevPt.val : currentVal;
                                const increase = previousVal > 0 ? ((currentVal - previousVal) / previousVal) * 105 - 100 : 0;

                                return (
                                  <div
                                    className="absolute pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-1.5 transition-all z-20"
                                    style={{
                                      left: `${(pt.x / chartWidth) * 100}%`,
                                      top: `${(pt.y / chartHeight) * 100 - 30}%`,
                                      transform: 'translate(-50%, -100%)'
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-6">
                                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">
                                        {months[analyticsHoveredPoint]} Metrics
                                      </span>
                                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${increase >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'}`}>
                                        {increase >= 0 ? '+' : ''}{increase.toFixed(1)}% YoY
                                      </span>
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-black text-slate-950 dark:text-white">
                                          {activeData.prefix}{currentVal.toFixed(analyticsChartMetric === 'csat' ? 2 : 1)}{activeData.unit}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">Current</span>
                                      </div>
                                      {analyticsShowComparison && (
                                        <div className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                                          <span>Prev. Period:</span>
                                          <span className="text-slate-600 dark:text-slate-300 font-extrabold">
                                            {activeData.prefix}{previousVal.toFixed(analyticsChartMetric === 'csat' ? 2 : 1)}{activeData.unit}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-semibold">
                        <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Top Performing Growth Sectors</h3>
                              <p className="text-[11px] text-slate-400 mt-0.5">Contribution breakdown of active specialized squads.</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">Q2 Contribution</span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-semibold">
                              <thead>
                                <tr className="text-[10px] text-slate-400 font-black border-b border-slate-100 dark:border-slate-800 uppercase tracking-widest">
                                  <th className="py-2.5">Squad Category Sector</th>
                                  <th className="py-2.5 text-right">Revenue Share</th>
                                  <th className="py-2.5 text-right">Active Staff</th>
                                  <th className="py-2.5 text-right">Traction Growth</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {sectorBreakdown.map((sec, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-3 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      {sec.name}
                                    </td>
                                    <td className="py-3 text-right font-black text-slate-900 dark:text-white">{sec.revenue}</td>
                                    <td className="py-3 text-right text-slate-500 dark:text-slate-400 font-mono">{sec.squads} devs</td>
                                    <td className="py-3 text-right">
                                      <span className="text-emerald-500 font-black inline-flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                                        <TrendingUp className="w-3 h-3" />
                                        {sec.growth}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className={`p-5 sm:p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} flex flex-col justify-between space-y-4`}>
                          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Annual Delivery Goal Progress</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Tracking against operational milestone completion.</p>
                          </div>

                          <div className="flex flex-col items-center justify-center py-2 space-y-3">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="54"
                                  className="stroke-slate-100 dark:stroke-slate-800"
                                  strokeWidth="8"
                                  fill="transparent"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="54"
                                  className="stroke-[#00c853]"
                                  strokeWidth="10"
                                  strokeDasharray={(2 * Math.PI * 54).toString()}
                                  strokeDashoffset={((1 - (averageProjectProgress / 100)) * (2 * Math.PI * 54)).toString()}
                                  strokeLinecap="round"
                                  fill="transparent"
                                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                />
                              </svg>
                              <div className="text-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white block">{averageProjectProgress}%</span>
                                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block mt-0.5">Average Progress</span>
                              </div>
                            </div>

                            <div className="text-center">
                              <span className="text-xs font-black text-slate-850 dark:text-slate-200 block">Operational Milestones</span>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                                {formatSectorBudget(totalRevenueVal)} realized of target cap
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                            <div className="p-1.5 bg-[#e8fcf0] dark:bg-emerald-950/40 text-[#00c853] rounded-lg shrink-0">
                              <Rocket className="w-4 h-4" />
                            </div>
                            <div className="text-[10.5px]">
                              <span className="font-extrabold text-slate-800 dark:text-white block">Accelerating Traction!</span>
                              <span className="text-slate-400 font-medium block">You are on pace to beat the annual corporate benchmark.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* VIEW 1.7: ADMINISTRATIVE SYSTEM SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="tab-settings"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full font-semibold"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Settings className="w-5.5 h-5.5 text-slate-500 animate-spin" style={{ animationDuration: '10s' }} />
                          <span>Console System Settings</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure global variables and purge persistent database parameters.</p>
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>

                      {/* Parameter Fields */}
                      <div className="space-y-4 text-xs font-semibold">
                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Administrative Workspace Name</span>
                          <input type="text" defaultValue="DigiWorku Corporate Suite" className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border dark:border-slate-705 rounded-lg text-slate-700 dark:text-slate-200" id="settings-company-name" />
                        </div>

                        <div>
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Emergency System Status Toggles</span>

                          <div className="space-y-3 pt-1">
                            <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl">
                              <div>
                                <span className="block text-xs font-extrabold text-slate-900 dark:text-white leading-tight">Emergency Maintenance State</span>
                                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Locks client logins globally</span>
                              </div>
                              <input type="checkbox" defaultChecked={false} onChange={(e) => {
                                triggerToast(e.target.checked ? "🚨 Maintenance Mode Enabled! All client tunnels locked." : "✅ Maintenance Mode Dissolved: Client tunnels active.");
                              }} className="w-4 h-4 accent-[#00c853] cursor-pointer" />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl">
                              <div>
                                <span className="block text-xs font-extrabold text-slate-900 dark:text-white leading-tight">Verbose Developer Debug Tunnels</span>
                                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Outputs telemetry logs inside browser consoles</span>
                              </div>
                              <input type="checkbox" defaultChecked={true} onChange={(e) => {
                                triggerToast(e.target.checked ? "🤖 Developer logs streaming active." : "🔇 Telemetry silent.");
                              }} className="w-4 h-4 accent-[#00c853] cursor-pointer" />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                        <div>
                          <span className="block text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Danger Zone Tasks</span>
                          <p className="text-[11px] text-slate-405 dark:text-slate-405">Purging persistent local registers cannot be undone.</p>
                        </div>

                        <button
                          onClick={() => {
                            localStorage.clear();
                            triggerToast("🧹 Purged local records! Reloading workspace parameters in 1.5 seconds...");
                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-650 text-xs font-black text-white rounded-lg cursor-pointer transition-all"
                        >
                          Purge Local Cache & Refresh
                        </button>
                      </div>

                    </div>

                    {/* Supabase Backend Integration Card */}
                    <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-6 mt-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-[#00c853] rounded-xl">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Supabase Cloud Backend</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Project: rjxbdjgagizjmjwnlbxx</p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${supabaseStatus === 'connected' ? 'bg-[#00c853]' :
                            supabaseStatus === 'checking' ? 'bg-amber-400' : 'bg-red-500'
                            }`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${supabaseStatus === 'connected' ? 'text-[#00c853]' :
                            supabaseStatus === 'checking' ? 'text-amber-400' : 'text-red-500'
                            }`}>
                            {supabaseStatus === 'connected' ? 'Connected' :
                              supabaseStatus === 'checking' ? 'Checking' : 'Error'}
                          </span>
                        </div>
                      </div>

                      {/* Status Banner */}
                      <div className={`p-3.5 rounded-xl border text-[11px] font-semibold leading-relaxed ${supabaseStatus === 'connected' ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/15 text-emerald-600 dark:text-[#00c853]' :
                        supabaseStatus === 'checking' ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-red-500/5 dark:bg-red-500/10 border-red-500/15 text-red-600 dark:text-red-400'
                        }`}>
                        {supabaseMessage}
                      </div>

                      {/* Supabase details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">API URL Connection Endpoint</span>
                          <code className="text-[10px] text-slate-700 dark:text-slate-300 font-mono break-all select-all">https://rjxbdjgagizjmjwnlbxx.supabase.co</code>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Publishable Public Key</span>
                          <code className="text-[10px] text-slate-700 dark:text-slate-300 font-mono break-all select-all text-ellipsis overflow-hidden block">sb_publishable_v-Wt6Skez4RmaQOUq-faCA_zHG-H8Au</code>
                        </div>
                      </div>

                      {/* Sync Controls */}
                      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Database Tools & Utilities</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                            Push client project sheets, customer inquiries, and conversation logs securely into your live Supabase cloud database.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 pt-2">
                          <button
                            onClick={handleCheckSupabaseConnection}
                            disabled={supabaseStatus === 'checking'}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:opacity-90 disabled:opacity-50 text-xs font-black rounded-xl cursor-pointer text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
                          >
                            Ping Database
                          </button>

                          <button
                            onClick={handleSyncToSupabase}
                            disabled={isSupabaseSyncing || supabaseStatus !== 'connected'}
                            className="px-4 py-2 bg-[#00c853] hover:bg-[#00b54b] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black text-white rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#00c853]/10 transition-all"
                          >
                            {isSupabaseSyncing ? (
                              <>
                                <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block"></span>
                                <span>Syncing Workspace...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5 rotate-180" />
                                <span>Push Workspace to Supabase</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* VIEW 2: DEDICATED CHAT WORKSPACE (DigiWorku Brand Theme) */}
                {activeTab === 'chat' && (
                  panelMode === 'admin' ? renderAdminChatConsole() : (
                    <motion.div
                      key="tab-chat"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col min-h-0 bg-[#FFF7E6] dark:bg-[#111111] grid-mesh"
                    >

                      {/* Chat header area */}
                      <div className={`px-4 md:px-6 py-3.5 border-b flex items-center justify-between shrink-0 transition-colors ${darkMode ? 'bg-[#1a1a1a] border-slate-800' : 'bg-[#FFFDF0] border-slate-200 shadow-xs'}`}>

                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00c853] rounded-full border-2 border-white dark:border-[#1a1a1a] z-10 animate-pulse"></span>
                            <img
                              src="/logo.jpg"
                              alt="DigiWorku Logo"
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                              Digi<span className="text-[#00c853]">Worku</span> Team Support
                            </h4>
                            <span className="text-[10px] text-[#00c853] font-bold mt-1 block tracking-wider uppercase">🟢 LIVE CONNECTED</span>
                          </div>
                        </div>

                        {/* Header Actions: Call and Video Call buttons */}
                        <div className="flex items-center gap-1.5 md:gap-3">
                          <button
                            onClick={() => {
                              window.location.href = "tel:9521207156";
                            }}
                            className="p-2.5 text-slate-500 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all active:scale-95"
                            title="Voice Call"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { }}
                            className="p-2.5 text-slate-500 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-all active:scale-95"
                            title="Video Call"
                          >
                            <Video className="w-4.5 h-4.5" />
                          </button>
                        </div>

                      </div>

                      {/* Chat Area Scroll block */}
                      <div
                        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative"
                        style={{ contentVisibility: 'auto' }}
                      >

                        {/* Static Today label banner */}
                        <div className="flex justify-center my-2 select-none relative z-10">
                          <span className="bg-[#FFFDF0]/90 dark:bg-[#1a1a1a]/90 shadow-xs border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold tracking-widest px-3.5 py-1 rounded-full uppercase">
                            TODAY
                          </span>
                        </div>

                        {chatHistory.map((msg) => {
                          const isUser = msg.role === 'user';
                          return (
                            <div
                              key={msg.id}
                              className={`flex w-full relative z-10 ${isUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[85%] md:max-w-[70%] flex flex-col space-y-0.5`}>

                                {/* Inside chat body container bubble (DigiWorku Theme) */}
                                <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text transition-all ${isUser
                                  ? 'bg-[#00311F] text-[#FFF7E6] dark:bg-[#00c853] dark:text-[#0d0d0d] rounded-tr-none shadow-sm font-semibold'
                                  : 'bg-[#FFFDF0] text-[#00311F] dark:bg-[#222222] dark:text-[#e8e8e8] rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-xs font-semibold'
                                  }`}>

                                  {/* Sender Name */}
                                  {!isUser && (
                                    <span className="block text-[10px] font-black text-[#00c853] mb-1 tracking-tight">
                                      DigiWorku Team
                                    </span>
                                  )}

                                  {/* Rich Attachment display element supporting all requested upload categories */}
                                  {msg.attachment && (
                                    <div className="mb-3 max-w-sm rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/40 p-2 sm:p-3">

                                      {/* 1. Image preview */}
                                      {msg.attachment.type === 'image' && (
                                        <div className="mb-2.5 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                                          <img
                                            src={msg.attachment.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"}
                                            alt={msg.attachment.filename}
                                            className="max-h-48 w-full object-cover select-none hover:scale-102 transition-all cursor-pointer"
                                            onClick={() => triggerToast(`🔍 Opened image: ${msg.attachment?.filename}`)}
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                      )}

                                      {/* 2. Video preview */}
                                      {msg.attachment.type === 'video' && (
                                        <div className="mb-2.5 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                                          {msg.attachment.url ? (
                                            <video
                                              src={msg.attachment.url}
                                              controls
                                              className="max-h-48 w-full object-contain"
                                            />
                                          ) : (
                                            <div className="h-28 flex flex-col items-center justify-center text-slate-400">
                                              <Video className="w-8 h-8 animate-pulse text-emerald-500 mb-1" />
                                              <span className="text-[10px]">Embedded video trailer</span>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* 3. Voice / Audio player */}
                                      {msg.attachment.type === 'voice' && (
                                        <div className="mb-2 p-2 bg-[#dcf8c6]/40 dark:bg-slate-800/40 rounded-lg flex items-center gap-2 border border-emerald-500/10">
                                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-[#00c853] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                                            🎙️
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            {msg.attachment.url ? (
                                              <audio
                                                src={msg.attachment.url}
                                                controls
                                                className="w-full max-w-[200px] h-8 cursor-pointer select-none"
                                              />
                                            ) : (
                                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Voice Note (Simulation)</span>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Attachment Details Pill footer */}
                                      <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          {/* Icon Selector based on type */}
                                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 select-none ${msg.attachment.type === 'pdf' ? 'bg-red-50 dark:bg-red-950/40 text-red-500' :
                                            msg.attachment.type === 'zip' || msg.attachment.type === 'archive' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500' :
                                              msg.attachment.type === 'image' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-500' :
                                                msg.attachment.type === 'video' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-500' :
                                                  msg.attachment.type === 'voice' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' :
                                                    msg.attachment.type === 'drive' ? 'bg-sky-50 dark:bg-sky-950/30 text-[#0066da] font-extrabold text-lg' :
                                                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            {msg.attachment.type === 'pdf' && <FileText className="w-4.5 h-4.5" />}
                                            {(msg.attachment.type === 'zip' || msg.attachment.type === 'archive') && <FolderArchive className="w-4.5 h-4.5" />}
                                            {msg.attachment.type === 'image' && <Image className="w-4.5 h-4.5" />}
                                            {msg.attachment.type === 'video' && <Video className="w-4.5 h-4.5" />}
                                            {msg.attachment.type === 'voice' && <Music className="w-4.5 h-4.5" />}
                                            {msg.attachment.type === 'drive' && <HardDrive className="w-4.5 h-4.5 text-blue-500 animate-pulse" />}
                                            {msg.attachment.type === 'other' && <FileUp className="w-4.5 h-4.5" />}
                                          </div>

                                          <div className="min-w-0">
                                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[180px]" title={msg.attachment.filename}>
                                              {msg.attachment.filename}
                                            </span>
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                              {msg.attachment.size} • {
                                                msg.attachment.type === 'drive' ? 'Google Drive Live' :
                                                  msg.attachment.type === 'voice' ? 'Audio briefing' :
                                                    msg.attachment.type.toUpperCase()
                                              }
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            if (msg.attachment?.type === 'drive') {
                                              triggerToast(`⚡ Opening live Google Drive doc: ${msg.attachment.filename} in secure container...`);
                                            } else {
                                              triggerToast(`📥 Downloading file asset: ${msg.attachment?.filename}...`);
                                            }
                                          }}
                                          className="p-1.5 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#00c853] transition-all cursor-pointer shrink-0"
                                          title={msg.attachment.type === 'drive' ? "Open Cloud File" : `Download ${msg.attachment.filename}`}
                                        >
                                          {msg.attachment.type === 'drive' ? (
                                            <ArrowUpRight className="w-4.5 h-4.5 text-[#0066da]" />
                                          ) : (
                                            <Download className="w-4.5 h-4.5 text-[#00c853]" />
                                          )}
                                        </button>
                                      </div>

                                    </div>
                                  )}

                                  {/* Main message text */}
                                  <div className="break-words">
                                    {msg.content}
                                  </div>

                                  {/* Nested timestamp & blue double checkmarks like WhatsApp */}
                                  <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-medium select-none ${isUser ? 'text-[#111b21]/60 dark:text-[#e9edef]/60' : 'text-slate-400 dark:text-slate-400'
                                    }`}>
                                    <span>{msg.timestamp}</span>
                                    {isUser && <span className="text-[#34b7f1] text-[11px] font-bold">✓✓</span>}
                                  </div>

                                </div>

                              </div>
                            </div>
                          );
                        })}

                        {/* Typing placeholder loader */}
                        {isChatLoading && (
                          <div className="flex justify-start w-full">
                            <div className="max-w-[50%] flex flex-col space-y-1">
                              <span className="block text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 px-1">
                                DigiWorku Team
                              </span>
                              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#202c33] rounded-tl-none text-xs flex items-center gap-1.5 shadow-xs border border-slate-200/30 dark:border-slate-800/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Panel footer area (DigiWorku Theme) */}
                      <div className={`p-3.5 sm:p-4 border-t transition-colors ${darkMode ? 'bg-[#1a1a1a] border-slate-800' : 'bg-[#FFFDF0] border-slate-200'}`}>

                        <form onSubmit={handleSendChatMessage} className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">

                          {/* Paperclip attachment icon */}
                          <div ref={attachmentMenuRef} className="relative shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                              className={`p-2 transition-all cursor-pointer shrink-0 rounded-xl ${isAttachmentMenuOpen
                                ? 'text-white bg-[#00c853]'
                                : 'text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                              title="Attach Files & Docs"
                            >
                              <Paperclip className={`w-5 h-5 transform transition-transform ${isAttachmentMenuOpen ? 'rotate-45' : ''} select-none`} />
                            </button>

                            {/* Hidden native input for seamless uploading of image, video, pdf, zip, audio, etc. */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept={fileInputAccept}
                              onChange={handleFileChange}
                            />

                            {/* Animated Attachment Picker Popover */}
                            <AnimatePresence>
                              {isAttachmentMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                  transition={{ duration: 0.15, ease: 'easeOut' }}
                                  className="absolute bottom-14 left-0 z-50 bg-white dark:bg-[#222222] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700 p-4.5 w-64 md:w-72"
                                >
                                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
                                    <span>Upload or Share Asset</span>
                                    <span className="text-[9px] bg-[#00c853]/10 text-[#00c853] px-1.5 py-0.5 rounded-md font-extrabold animate-pulse">Active</span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-3">

                                    {/* 1. Document (PDF, docx) */}
                                    <button
                                      type="button"
                                      onClick={() => triggerLocalFileInput('.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt')}
                                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                                        <FileText className="w-5 h-5 stroke-[2.2px]" />
                                      </div>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold group-hover:text-violet-500 transition-colors">
                                        PDF/Doc
                                      </span>
                                    </button>

                                    {/* 2. Photos & Videos */}
                                    <button
                                      type="button"
                                      onClick={() => triggerLocalFileInput('image/*,video/*')}
                                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-full bg-[#00c853] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                                        <Image className="w-5 h-5 stroke-[2.2px]" />
                                      </div>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold group-hover:text-[#00c853] transition-colors">
                                        Media
                                      </span>
                                    </button>

                                    {/* 3. Zip / Archives */}
                                    <button
                                      type="button"
                                      onClick={() => triggerLocalFileInput('.zip,.rar,.tar,.gz,.7z')}
                                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                                        <FolderArchive className="w-5 h-5 stroke-[2.2px]" />
                                      </div>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold group-hover:text-amber-500 transition-colors">
                                        ZIP / Rar
                                      </span>
                                    </button>

                                    {/* 4. Audio / Voice */}
                                    <button
                                      type="button"
                                      onClick={() => triggerLocalFileInput('audio/*,.mp3,.wav,.ogg,.m4a')}
                                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                                        <Music className="w-5 h-5 stroke-[2.2px]" />
                                      </div>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold group-hover:text-orange-500 transition-colors">
                                        Audio
                                      </span>
                                    </button>

                                    {/* 6. Standard file explorer */}
                                    <button
                                      type="button"
                                      onClick={() => triggerLocalFileInput('*/*')}
                                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                                    >
                                      <div className="w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
                                        <FileUp className="w-5 h-5 stroke-[2.2px]" />
                                      </div>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold group-hover:text-teal-550 transition-colors">
                                        Upload
                                      </span>
                                    </button>

                                  </div>

                                  <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[9px] text-center text-slate-400 font-semibold select-none">
                                    Powered by DigiWorku asset pipeline
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Chat Text Input - DigiWorku styling */}
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              placeholder="Type your message to DigiWorku team..."
                              className="w-full px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#00c853] focus:ring-1 focus:ring-[#00c853] bg-[#FFF7E6] dark:bg-[#222222] text-[#00311F] dark:text-white placeholder-[#00311F]/40 dark:placeholder-slate-500 font-medium transition-all"
                            />
                          </div>

                          {/* Send circle button */}
                          <button
                            type="submit"
                            disabled={!inputMessage.trim() || isChatLoading}
                            className="w-10 h-10 sm:w-11 sm:h-11 bg-[#00c853] hover:bg-[#00b047] text-white rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:hover:bg-[#00c853] shrink-0 border-none shadow-md shadow-[#00c853]/20"
                          >
                            <Send className="w-4 h-4 text-white" />
                          </button>

                        </form>

                      </div>
                    </motion.div>
                  )
                )}

                {/* VIEW 3: PORTFOLIO SHOWCASE PANEL (Image 3) */}
                {activeTab === 'portfolio' && (
                  <motion.div
                    key="tab-portfolio"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-8"
                  >

                    {/* Search / Header block inside view matches Image 3 header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                      <div>
                        <span className="block text-[11px] font-black uppercase text-[#00c853] tracking-wider">WORK PORTFOLIO</span>
                        <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mt-1 leading-none font-display">
                          UGC Videos, Graphics Design & Tech <span className="text-[#00c853]">Showcase</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
                          Explore our wide range of delivered projects across UGC Reels, Graphics Design, Web & App Engineering, Branding, and AI Solutions.
                        </p>
                      </div>

                      {/* Interactive Search & Admin Add Project Button */}
                      <div className="flex items-center gap-3 shrink-0 flex-wrap">

                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={searchProjectQuery}
                            onChange={(e) => setSearchProjectQuery(e.target.value)}
                            placeholder="Search projects..."
                            className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] w-56 bg-slate-100/30 dark:bg-slate-900/30"
                          />
                        </div>

                        {(isAdmin || panelMode === 'admin') && (
                          <button
                            onClick={handleOpenAddProject}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                          </button>
                        )}

                      </div>

                    </div>

                    {/* Filter tags buttons dynamically populated from active portfolio categories */}
                    <div className="flex items-center gap-2 flex-wrap pb-1 border-b border-slate-200 dark:border-slate-800">
                      {portfolioCategoriesList.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPortfolioFilter(cat)}
                          className={`px-4.5 py-2 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer ${portfolioFilter === cat
                            ? 'bg-[#00c853] text-white shadow-md'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-[#fafafa]'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Bento-style Grid of Project Cards with Video & Image support */}
                    <div id="project-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pt-2">

                      {filteredProjects.map((proj, idx) => {
                        const isLargeCard = idx === 0;
                        const isVideo = proj.mediaType === 'video' || Boolean(proj.videoUrl);

                        return (
                          <div
                            key={proj.id}
                            className={`group border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#00c853] transition-all hover:-translate-y-1.5 hover:shadow-2xl relative ${isLargeCard ? 'lg:col-span-8' : 'lg:col-span-4'
                              } ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}
                          >

                            {/* Media banner block */}
                            <div
                              onClick={() => setSelectedProjectDetail(proj)}
                              className="aspect-video relative overflow-hidden bg-slate-900 cursor-pointer group/media"
                            >
                              {isVideo && proj.videoUrl ? (
                                <div className="relative w-full h-full">
                                  <video
                                    src={proj.videoUrl}
                                    poster={proj.imageUrl}
                                    muted
                                    loop
                                    playsInline
                                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                                    onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                                    className="w-full h-full object-cover group-hover:scale-103 duration-500 filter brightness-95"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center group-hover/media:bg-slate-950/10 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-[#00c853] text-white flex items-center justify-center shadow-xl group-hover/media:scale-110 transition-transform">
                                      <Play className="w-5 h-5 fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={proj.imageUrl}
                                  alt={proj.title}
                                  className="w-full h-full object-cover group-hover:scale-103 duration-500 filter brightness-95"
                                  referrerPolicy="no-referrer"
                                />
                              )}

                              {/* Category Badge & Tags */}
                              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                                <span className="bg-[#00c853] text-white text-[9px] font-black px-2.5 py-1 rounded-sm tracking-widest uppercase shadow-xs">
                                  {proj.category}
                                </span>
                                {proj.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="bg-slate-950/70 text-white text-[9px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Arrow right locator */}
                              <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#00c853]/90 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <ArrowUpRight className="w-5 h-5" />
                              </div>
                            </div>

                            {/* Title details description block */}
                            <div className="p-5 space-y-3">

                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#00c853] truncate">{proj.clientName}</span>
                                
                                {(isAdmin || panelMode === 'admin') && (
                                  <div className="flex items-center gap-1.5 shrink-0 z-20">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleOpenEditProject(proj); }}
                                      className="p-1 rounded-md text-slate-400 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                      title="Edit Project"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj.id, proj.title); }}
                                      className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                      title="Delete Project"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <h3
                                onClick={() => setSelectedProjectDetail(proj)}
                                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-normal cursor-pointer hover:text-[#00c853] transition-colors"
                              >
                                {proj.title}
                              </h3>

                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {proj.description}
                              </p>

                              {proj.impactResult && (
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-[#00c853] font-bold">
                                  <TrendingUp className="w-4 h-4 shrink-0" />
                                  <span className="truncate">Outcome: {proj.impactResult}</span>
                                </div>
                              )}

                            </div>

                          </div>
                        );
                      })}

                      {filteredProjects.length === 0 && (
                        <div className="col-span-12 py-16 text-center max-w-sm mx-auto space-y-4">
                          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">No Projects Found</h4>
                          <p className="text-xs text-slate-400">
                            We could not find matching projects under category "{portfolioFilter}".
                          </p>
                          {(isAdmin || panelMode === 'admin') && (
                            <button
                              onClick={handleOpenAddProject}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00c853] text-white font-bold text-xs shadow-md"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add First Project</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Bottom CTA block */}
                    <div className="text-center py-6 mt-4 border-t border-slate-200/50 dark:border-slate-800 space-y-4">
                      <h4 className="text-sm md:text-[16px] font-black text-slate-900 dark:text-white">Aapka project next showcase ho sakta hai.</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ready to transform your business with premium digital solutions?</p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveTab('services')}
                          className="bg-[#00c853] text-white hover:bg-[#00b047] px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Start a Conversation
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* VIEW 4: OUR PROFESSIONAL SERVICES MATRIX (Image 4) / SERVICES ADMIN MANAGER */}
                {activeTab === 'services' && (
                  <motion.div
                    key="tab-services"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 p-6 md:p-8 space-y-8"
                  >

                    {panelMode === 'admin' ? (
                      /* SERVICES ADMIN MANAGEMENT PANEL */
                      <div className="space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                          <div className="space-y-1">
                            <span className="block text-[11px] font-black uppercase text-[#00c853] tracking-wider">ADMIN PLATFORM</span>
                            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mt-1 font-display">
                              Manage Platform <span className="text-[#00c853]">Services</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                              Add, edit, or remove professional services offered by DigiWorku. All changes are saved to persistent cloud storage and synchronized to clients in real-time.
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {(!isAddingService && !editingServiceId) && (
                              <button
                                onClick={() => {
                                  resetServiceForm();
                                  setIsAddingService(true);
                                }}
                                className="bg-[#00c853] hover:bg-[#00b047] text-white px-5 py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#00c853]/10"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add New Service</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Add / Edit Form Card */}
                        {(isAddingService || editingServiceId) && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
                              } space-y-6 max-w-4xl`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 gap-3">
                              <div>
                                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                                  <span>{editingServiceId ? '✏️ Edit Existing Service' : '🚀 Add New Service Offering'}</span>
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">Customize all 7 detailed sections of the public service detail page.</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={autoGenerateDetailedSections}
                                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00c853] border border-[#00c853]/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                  title="Auto-fill sample overview, process, offerings, features & FAQs"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Auto-Fill Rich Page Template ⚡</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setIsAddingService(false);
                                    setEditingServiceId(null);
                                    resetServiceForm();
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* SECTION 1: BASIC INFORMATION */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
                                1. Basic Details & Pricing
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Name *</label>
                                  <input
                                    type="text"
                                    value={serviceFormTitle}
                                    onChange={(e) => setServiceFormTitle(e.target.value)}
                                    placeholder="e.g. Mobile Application Development"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Starting Price *</label>
                                  <input
                                    type="text"
                                    value={serviceFormPrice}
                                    onChange={(e) => setServiceFormPrice(e.target.value)}
                                    placeholder="e.g. ₹50,000"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Category *</label>
                                  <select
                                    value={serviceFormCategory}
                                    onChange={(e) => setServiceFormCategory(e.target.value as any)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950"
                                  >
                                    <option value="Development">Development (Web / Core)</option>
                                    <option value="Design & Branding">Design & Branding Assets</option>
                                    <option value="Video Production">Video Production post-edit</option>
                                    <option value="Marketing">Marketing Campaign metrics</option>
                                  </select>
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lucide Icon Aspect *</label>
                                  <select
                                    value={serviceFormIcon}
                                    onChange={(e) => setServiceFormIcon(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950"
                                  >
                                    {AVAILABLE_SERVICE_ICONS.map(ic => (
                                      <option key={ic} value={ic}>{ic}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Short Description (Card Subtitle) *</label>
                                <textarea
                                  value={serviceFormDescription}
                                  onChange={(e) => setServiceFormDescription(e.target.value)}
                                  rows={2}
                                  placeholder="Provide summary overview of this service..."
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950 leading-relaxed"
                                />
                              </div>
                            </div>

                            {/* SECTION 2: OVERVIEW */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
                                2. Overview Section
                              </h4>
                              <textarea
                                value={serviceFormOverview}
                                onChange={(e) => setServiceFormOverview(e.target.value)}
                                rows={3}
                                placeholder="Detailed overview paragraph explaining the value proposition of this service..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950 leading-relaxed"
                              />
                            </div>

                            {/* SECTION 3: WHAT WE OFFER */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                                <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider">
                                  3. What We Offer (Offering Cards)
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setServiceFormOfferings(prev => [...prev, { title: '', desc: '', icon: 'Globe' }])}
                                  className="text-[10px] font-bold text-[#00c853] bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                >
                                  + Add Offering Item
                                </button>
                              </div>
                              {serviceFormOfferings.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormOfferings(prev => prev.map((o, i) => i === idx ? { ...o, title: val } : o));
                                      }}
                                      placeholder="Offering Title (e.g. Custom APIs)"
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                    <input
                                      type="text"
                                      value={item.desc}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormOfferings(prev => prev.map((o, i) => i === idx ? { ...o, desc: val } : o));
                                      }}
                                      placeholder="Description (e.g. High speed REST endpoints)"
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setServiceFormOfferings(prev => prev.filter((_, i) => i !== idx))}
                                    className="p-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* SECTION 4: OUR PROCESS */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                                <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider">
                                  4. Our Process Steps
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setServiceFormProcess(prev => [...prev, { step: prev.length + 1, title: '', desc: '' }])}
                                  className="text-[10px] font-bold text-[#00c853] bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                >
                                  + Add Process Step
                                </button>
                              </div>
                              {serviceFormProcess.map((step, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <span className="w-6 h-6 rounded-full bg-[#00c853] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={step.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormProcess(prev => prev.map((p, i) => i === idx ? { ...p, title: val } : p));
                                      }}
                                      placeholder="Step Title (e.g. Discovery)"
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                    <input
                                      type="text"
                                      value={step.desc}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormProcess(prev => prev.map((p, i) => i === idx ? { ...p, desc: val } : p));
                                      }}
                                      placeholder="Step Description..."
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setServiceFormProcess(prev => prev.filter((_, i) => i !== idx))}
                                    className="p-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* SECTION 5: KEY CAPABILITIES */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                                <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider">
                                  5. Key Capabilities (Features)
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setServiceFormFeatures(prev => [...prev, { title: '', desc: '' }])}
                                  className="text-[10px] font-bold text-[#00c853] bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                >
                                  + Add Capability Card
                                </button>
                              </div>
                              {serviceFormFeatures.map((feat, idx) => (
                                <div key={idx} className="flex gap-2 items-start bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      value={feat.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormFeatures(prev => prev.map((f, i) => i === idx ? { ...f, title: val } : f));
                                      }}
                                      placeholder="Capability Title"
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                    <input
                                      type="text"
                                      value={feat.desc}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setServiceFormFeatures(prev => prev.map((f, i) => i === idx ? { ...f, desc: val } : f));
                                      }}
                                      placeholder="Capability Details..."
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setServiceFormFeatures(prev => prev.filter((_, i) => i !== idx))}
                                    className="p-1.5 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* SECTION 6: DELIVERABLES & WHY CHOOSE US */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deliverables Included (1 per line)</label>
                                <textarea
                                  value={serviceFormDeliverables}
                                  onChange={(e) => setServiceFormDeliverables(e.target.value)}
                                  rows={4}
                                  placeholder="Full Source Code&#10;Production Deployment&#10;Admin Documentation"
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950 leading-relaxed"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why Choose DigiWorku (1 per line)</label>
                                <textarea
                                  value={serviceFormWhyUs}
                                  onChange={(e) => setServiceFormWhyUs(e.target.value)}
                                  rows={4}
                                  placeholder="Top Engineering Talent&#10;Agile Daily Updates&#10;30-Day Support Warranty"
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-950 leading-relaxed"
                                />
                              </div>
                            </div>

                            {/* SECTION 7: FAQS */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                                <h4 className="text-xs font-black uppercase text-[#00c853] tracking-wider">
                                  7. Frequently Asked Questions (FAQs)
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setServiceFormFaqs(prev => [...prev, { q: '', a: '' }])}
                                  className="text-[10px] font-bold text-[#00c853] bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                                >
                                  + Add FAQ Question
                                </button>
                              </div>
                              {serviceFormFaqs.map((faq, idx) => (
                                <div key={idx} className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 relative">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-[#00c853]">FAQ #{idx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => setServiceFormFaqs(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={faq.q}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setServiceFormFaqs(prev => prev.map((f, i) => i === idx ? { ...f, q: val } : f));
                                    }}
                                    placeholder="Question (e.g. How long does development take?)"
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                  />
                                  <textarea
                                    value={faq.a}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setServiceFormFaqs(prev => prev.map((f, i) => i === idx ? { ...f, a: val } : f));
                                    }}
                                    rows={2}
                                    placeholder="Answer details..."
                                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium bg-white dark:bg-slate-900"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                              <button
                                onClick={() => {
                                  setIsAddingService(false);
                                  setEditingServiceId(null);
                                  resetServiceForm();
                                }}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={editingServiceId ? handleUpdateService : handleAddNewService}
                                className="bg-[#00c853] hover:bg-[#00b047] text-white px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#00c853]/20"
                              >
                                <Check className="w-4 h-4" />
                                <span>{editingServiceId ? 'Update Service' : 'Create Detailed Service'}</span>
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* Active Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {servicesList.map((service) => {
                            const IconComponent = getIconComponent(service.icon);
                            return (
                              <div
                                key={service.id}
                                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:border-[#00c853] hover:shadow-lg ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                                  }`}
                              >
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 text-[#00c853] shrink-0">
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                                      {service.category}
                                    </span>
                                  </div>

                                  <div className="space-y-1.5 cursor-pointer group" onClick={() => {
                                      const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                                      window.history.pushState({}, '', '/services/' + slug);
                                      window.dispatchEvent(new PopStateEvent('popstate'));
                                  }}>
                                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-[#00c853] transition-colors flex items-center justify-between">
                                      <span>{service.title}</span>
                                      <span className="text-[10px] font-bold text-[#00c853] bg-emerald-500/10 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Read Blog ➔</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                      {service.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between mt-5">
                                  <div>
                                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Starting from</span>
                                    <strong className="text-md font-black text-[#00c853]">{service.price}</strong>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => startEditingService(service)}
                                      className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                                      title="Edit Service"
                                    >
                                      <Sliders className="w-3.5 h-3.5" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete the "${service.title}" service?`)) {
                                          handleDeleteService(service.id, service.title);
                                        }
                                      }}
                                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                                      title="Delete Service"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {servicesList.length === 0 && (
                            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-sm font-bold text-slate-500">No services exist in your matrix directory.</p>
                              <button
                                onClick={() => setIsAddingService(true)}
                                className="mt-3 bg-[#00c853] hover:bg-[#00b047] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                + Add Service
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* ORIGINAL CLIENT PROFESSIONAL SERVICES MATRIX */
                      <div className="space-y-8">
                        {/* Header title elements matching design */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                          <div className="space-y-1">
                            <span className="block text-[11px] font-black uppercase text-[#00c853] tracking-wider">WORKSPACE MENU</span>
                            <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white mt-1 font-display">
                              Our IT & Digital Marketing <span className="text-[#00c853]">Services</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                              Scale your business with high-quality digital solutions tailored to your unique requirements. Explore our specialized offerings below.
                            </p>
                          </div>

                          <div className="flex items-center gap-6 shrink-0 bg-slate-100 dark:bg-slate-800/80 px-5 py-3 rounded-xl">
                            <div className="text-center border-r border-slate-300 dark:border-slate-700/60 pr-4">
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Workflows</span>
                              <strong className="block text-md text-[#00c853] mt-0.5">{activeWorkflowsCount} Active</strong>
                            </div>
                            <div className="text-center pl-1">
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Satisfaction Rate</span>
                              <strong className="block text-md text-emerald-500 mt-0.5">99.8%</strong>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Layout: Categories filter list on left, Grid of service unit cards on right matches Image 4 */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                          {/* Left Column: Filter checkboxes & Custom package promocards */}
                          <div className="lg:col-span-4 space-y-6">

                            {/* Checkbox controls block */}
                            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#202020]/50 border-slate-800' : 'bg-white border-slate-200/95 shadow-md'}`}>
                              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Service Categories</h3>

                              <div className="space-y-3">
                                <label className="flex items-center gap-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={serviceCategories['Development']}
                                    onChange={() => setServiceCategories(prev => ({ ...prev, 'Development': !prev['Development'] }))}
                                    className="w-4.5 h-4.5 accent-[#00c853] rounded-sm bg-slate-100"
                                  />
                                  <span>Development (Web / Core)</span>
                                </label>

                                <label className="flex items-center gap-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={serviceCategories['Design & Branding']}
                                    onChange={() => setServiceCategories(prev => ({ ...prev, 'Design & Branding': !prev['Design & Branding'] }))}
                                    className="w-4.5 h-4.5 accent-[#00c853] rounded-sm bg-slate-100"
                                  />
                                  <span>Design & Branding Assets</span>
                                </label>

                                <label className="flex items-center gap-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={serviceCategories['Video Production']}
                                    onChange={() => setServiceCategories(prev => ({ ...prev, 'Video Production': !prev['Video Production'] }))}
                                    className="w-4.5 h-4.5 accent-[#00c853] rounded-sm bg-slate-100"
                                  />
                                  <span>Video Production post-edit</span>
                                </label>

                                <label className="flex items-center gap-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={serviceCategories['Marketing']}
                                    onChange={() => setServiceCategories(prev => ({ ...prev, 'Marketing': !prev['Marketing'] }))}
                                    className="w-4.5 h-4.5 accent-[#00c853] rounded-sm bg-slate-100"
                                  />
                                  <span>Marketing Campaign metrics</span>
                                </label>
                              </div>

                            </div>

                          </div>

                          {/* Right Column: Grid of Service cards */}
                          <div className="lg:col-span-8 space-y-4">

                            {/* Inline Search for services */}
                            <div className="relative">
                              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                              <input
                                type="text"
                                value={searchServiceQuery}
                                onChange={(e) => setSearchServiceQuery(e.target.value)}
                                placeholder="Search services directory..."
                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#00c853] bg-slate-100/30 dark:bg-slate-900/40"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                              {filteredServices.map((service) => {
                                const IconComponent = getIconComponent(service.icon);

                                return (
                                  <div
                                    key={service.id}
                                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-[#00c853] hover:shadow-lg group ${darkMode ? 'bg-[#202020]/65 border-slate-800' : 'bg-white border-slate-200'
                                      }`}
                                  >
                                    <div className="space-y-3.5 cursor-pointer" onClick={() => {
                                      const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                                      window.history.pushState({}, '', '/services/' + slug);
                                      window.dispatchEvent(new PopStateEvent('popstate'));
                                    }}>

                                      <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-[#e8fcf0] dark:bg-emerald-950/60 text-[#00c853] shrink-0">
                                          <IconComponent className="w-4.5 h-4.5" />
                                        </div>
                                        <span className="text-[10px] text-[#00c853] bg-emerald-500/10 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                          {service.category}
                                        </span>
                                      </div>

                                      <h3 className="text-md font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00c853] transition-colors flex items-center justify-between">
                                        <span>{service.title}</span>
                                        <span className="text-[10px] font-extrabold text-[#00c853] underline">Read Info Page ➔</span>
                                      </h3>

                                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                        {service.description}
                                      </p>

                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between mt-4">

                                      <div className="space-y-0.5 cursor-pointer" onClick={() => {
                                        const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                                        window.history.pushState({}, '', '/services/' + slug);
                                        window.dispatchEvent(new PopStateEvent('popstate'));
                                      }}>
                                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Starting from</span>
                                        <strong className="block text-sm text-[#00c853]">{service.price}</strong>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            const slug = service.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                                            window.history.pushState({}, '', '/services/' + slug);
                                            window.dispatchEvent(new PopStateEvent('popstate'));
                                          }}
                                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                        >
                                          View Details
                                        </button>
                                        <button
                                          onClick={() => handleRequestServiceDirectly(service)}
                                          className="bg-[#00c853] hover:bg-[#00b047] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00c853]/20"
                                        >
                                          Request Service
                                        </button>
                                      </div>

                                    </div>

                                  </div>
                                );
                              })}

                              {filteredServices.length === 0 && (
                                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                  <p className="text-sm font-bold text-slate-500">No active services match your filters or search.</p>
                                </div>
                              )}

                            </div>

                          </div>

                        </div>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* Render Full Page Service Detail Route */}
                {activeTab === 'serviceDetail' && activeServiceSlug && (
                  <motion.div
                    key="tab-service-detail"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-[#0d0d0d] z-50 pb-20"
                  >
                    <ServiceDetailPage 
                      slug={activeServiceSlug}
                      service={servicesList.find(s => s.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') === activeServiceSlug)}
                      darkMode={darkMode} 
                      onBack={() => {
                        window.history.pushState({}, '', '/services');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      onRequestService={() => {
                        const found = servicesList.find(s => s.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') === activeServiceSlug);
                        handleRequestServiceDirectly(found ? found : (activeServiceSlug || 'Website Development'));
                      }}
                    />
                  </motion.div>
                )}

                {/* Legal Pages */}
                {activeTab === 'legal' && activeLegalSlug && (
                  <motion.div
                    key={`tab-legal-${activeLegalSlug}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden z-50"
                  >
                    <LegalPages
                      slug={activeLegalSlug}
                      darkMode={darkMode}
                      onBack={() => {
                        setActiveTab('home');
                        setActiveLegalSlug(null);
                        window.history.pushState({}, '', '/');
                      }}
                    />
                  </motion.div>
                )}

              </>
            )}
          </AnimatePresence>

        </div>

        {/* Interactive Service Blog / Detailed Information Modal */}
        <AnimatePresence>
          {selectedServiceDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25 }}
                className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${darkMode ? 'bg-[#111111] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                  }`}
              >
                {/* Banner Header */}
                <div className="relative p-6 md:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    {React.createElement(getIconComponent(selectedServiceDetail.icon), { className: 'w-48 h-48 text-emerald-400' })}
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-emerald-500/20 text-[#00c853] border border-emerald-500/30">
                          {React.createElement(getIconComponent(selectedServiceDetail.icon), { className: 'w-5 h-5' })}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">
                          {selectedServiceDetail.category}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedServiceDetail(null)}
                        className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <h2 className="text-2xl md:text-3.5xl font-black font-display tracking-tight text-white">
                        {selectedServiceDetail.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-300 font-medium">
                        <span>By DigiWorku Engineering Team</span>
                        <span>•</span>
                        <span className="text-[#00c853] font-bold">Starting from {selectedServiceDetail.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog / Info Body Content */}
                <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto leading-relaxed">
                  {/* Summary Callout */}
                  <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'} text-xs font-medium leading-relaxed`}>
                    <strong className="block text-slate-900 dark:text-white font-bold mb-1">Executive Summary</strong>
                    {selectedServiceDetail.description}
                  </div>

                  {/* Detailed Content */}
                  <div className="prose dark:prose-invert max-w-none text-xs md:text-sm space-y-4 font-sans leading-relaxed">
                    {(selectedServiceDetail.content || selectedServiceDetail.description).split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={idx} className="text-base md:text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mt-4">{paragraph.replace('### ', '')}</h3>;
                      } else if (paragraph.startsWith('#### ')) {
                        return <h4 key={idx} className="text-xs md:text-sm font-bold text-[#00c853] uppercase tracking-wider mt-3">{paragraph.replace('#### ', '')}</h4>;
                      } else if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').filter(i => i.trim());
                        return (
                          <ul key={idx} className="space-y-2 my-2">
                            {items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-[#00c853] shrink-0 mt-0.5" />
                                <span dangerouslySetInnerHTML={{ __html: item.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                              </li>
                            ))}
                          </ul>
                        );
                      } else if (/^\d+\./.test(paragraph)) {
                        const items = paragraph.split('\n').filter(i => i.trim());
                        return (
                          <ol key={idx} className="space-y-2 my-2">
                            {items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-[#00c853] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{iIdx + 1}</span>
                                <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                              </li>
                            ))}
                          </ol>
                        );
                      } else {
                        return <p key={idx} className="text-slate-600 dark:text-slate-300">{paragraph}</p>;
                      }
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={`p-4 md:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Interested in this service?</span>
                    <strong className="text-sm font-black text-[#00c853]">Estimated Price: {selectedServiceDetail.price}</strong>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedServiceDetail(null)}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const serv = selectedServiceDetail;
                        setSelectedServiceDetail(null);
                        handleRequestServiceDirectly(serv);
                      }}
                      className="flex-1 sm:flex-none bg-[#00c853] hover:bg-[#00b047] text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#00c853]/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Quote Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Freelancer Candidate Application Modal ("Join Us") */}
        <AnimatePresence>
          {isFreelancerModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFreelancerModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border relative z-10 p-6 md:p-8 space-y-6 ${darkMode ? 'bg-[#141414] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#00c853] flex items-center justify-center border border-emerald-500/20">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Join DigiWorku Freelancer Network</h3>
                      <p className="text-xs text-slate-400 font-medium">Apply as a top 1% digital specialist candidate</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFreelancerModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleFreelancerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={freelancerFormName}
                        onChange={(e) => setFreelancerFormName(e.target.value)}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={freelancerFormEmail}
                        onChange={(e) => setFreelancerFormEmail(e.target.value)}
                        placeholder="e.g. vikram@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={freelancerFormPhone}
                        onChange={(e) => setFreelancerFormPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Primary Expertise *</label>
                      <select
                        value={freelancerFormSkill}
                        onChange={(e) => setFreelancerFormSkill(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="Full Stack Developer (React / Node / Next.js)">Full Stack Developer (React / Node)</option>
                        <option value="UI/UX Specialist & Figma Designer">UI/UX Specialist & Figma Designer</option>
                        <option value="Senior Video Editor & Motion Designer">Senior Video Editor & Motion Graphics</option>
                        <option value="Graphic Designer & Brand Illustrator">Graphic Designer & Brand Specialist</option>
                        <option value="SEO & Performance Growth Specialist">SEO & Performance Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Portfolio / GitHub / Behance Link *</label>
                    <input
                      type="url"
                      required
                      value={freelancerFormPortfolio}
                      onChange={(e) => setFreelancerFormPortfolio(e.target.value)}
                      placeholder="e.g. https://behance.net/vikram or https://github.com/vikram"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Experience & Brief Bio *</label>
                    <textarea
                      rows={3}
                      required
                      value={freelancerFormBio}
                      onChange={(e) => setFreelancerFormBio(e.target.value)}
                      placeholder="Tell us briefly about your years of experience, top tools, and key client achievements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFreelancerModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingFreelancer}
                      className="bg-[#00c853] hover:bg-[#00b047] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#00c853]/20"
                    >
                      {isSubmittingFreelancer ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Submit Freelancer Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Admin Project Add/Edit Modal */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProjectModalOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className={`w-full max-w-lg rounded-2xl shadow-2xl border relative z-10 overflow-hidden ${
                  darkMode ? 'bg-[#1a1a1a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00c853]" />
                    <span>{editingProject ? 'Edit Portfolio Project' : 'Upload New Portfolio Project'}</span>
                  </h3>
                  <button
                    onClick={() => setIsProjectModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Project Title *</label>
                    <input
                      type="text"
                      value={projectFormTitle}
                      onChange={(e) => setProjectFormTitle(e.target.value)}
                      placeholder="e.g. Viral D2C E-Commerce UGC Reel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category *</label>
                      <select
                        value={projectFormCategory}
                        onChange={(e) => setProjectFormCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                      >
                        <option value="UGC Videos">UGC Videos</option>
                        <option value="Graphics Design">Graphics Design</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Branding & Media">Branding & Media</option>
                        <option value="Marketing">Marketing</option>
                        <option value="AI & Automation">AI & Automation</option>
                        <option value="Custom...">Custom Category...</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Media Type</label>
                      <select
                        value={projectFormMediaType}
                        onChange={(e) => setProjectFormMediaType(e.target.value as 'image' | 'video')}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00c853]"
                      >
                        <option value="image">Image Banner</option>
                        <option value="video">Video Reel / Player</option>
                      </select>
                    </div>
                  </div>

                  {projectFormCategory === 'Custom...' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Custom Category Name</label>
                      <input
                        type="text"
                        value={projectFormCustomCategory}
                        onChange={(e) => setProjectFormCustomCategory(e.target.value)}
                        placeholder="e.g. Motion Graphics, 3D Rendering"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Image Thumbnail URL</label>
                    <input
                      type="text"
                      value={projectFormImageUrl}
                      onChange={(e) => setProjectFormImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or /logo.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                    />
                  </div>

                  {projectFormMediaType === 'video' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Video Stream URL (MP4 / WebM)</label>
                      <input
                        type="text"
                        value={projectFormVideoUrl}
                        onChange={(e) => setProjectFormVideoUrl(e.target.value)}
                        placeholder="https://assets.mixkit.co/... or MP4 video URL"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client / Brand Name</label>
                      <input
                        type="text"
                        value={projectFormClientName}
                        onChange={(e) => setProjectFormClientName(e.target.value)}
                        placeholder="e.g. GlowSkin Organics"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={projectFormTags}
                        onChange={(e) => setProjectFormTags(e.target.value)}
                        placeholder="UGC, REELS, D2C"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description *</label>
                    <textarea
                      rows={3}
                      value={projectFormDescription}
                      onChange={(e) => setProjectFormDescription(e.target.value)}
                      placeholder="Detailed project summary..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact Result / Metric</label>
                    <input
                      type="text"
                      value={projectFormImpactResult}
                      onChange={(e) => setProjectFormImpactResult(e.target.value)}
                      placeholder="e.g. 2.4M Views & +58% Purchase Conversion"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 text-xs font-semibold text-[#00c853]"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                  <button
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveProject}
                    className="px-5 py-2.5 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {editingProject ? 'Update Project' : 'Save Project to Database'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Project Detail Lightbox Modal */}
        <AnimatePresence>
          {selectedProjectDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProjectDetail(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border relative z-10 max-h-[90vh] flex flex-col ${
                  darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Media Container */}
                <div className="relative aspect-video bg-black shrink-0">
                  {selectedProjectDetail.mediaType === 'video' || selectedProjectDetail.videoUrl ? (
                    <video
                      src={selectedProjectDetail.videoUrl}
                      poster={selectedProjectDetail.imageUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={selectedProjectDetail.imageUrl}
                      alt={selectedProjectDetail.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <button
                    onClick={() => setSelectedProjectDetail(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-900 transition-colors shadow-lg z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <span className="absolute bottom-4 left-4 bg-[#00c853] text-white text-[10px] font-black px-3 py-1 rounded-md tracking-widest uppercase">
                    {selectedProjectDetail.category}
                  </span>
                </div>

                {/* Details Container */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#00c853] tracking-widest">
                      {selectedProjectDetail.clientName}
                    </span>
                    <div className="flex gap-1.5">
                      {selectedProjectDetail.tags.map(t => (
                        <span key={t} className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight">{selectedProjectDetail.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedProjectDetail.description}
                  </p>

                  {selectedProjectDetail.impactResult && (
                    <div className="p-3.5 rounded-xl bg-[#00c853]/10 border border-[#00c853]/20 flex items-center gap-2 text-xs text-[#00c853] font-bold">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>Outcome Metric: {selectedProjectDetail.impactResult}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const projTitle = selectedProjectDetail.title;
                        setSelectedProjectDetail(null);
                        handleRequestServiceDirectly(`Portfolio Project Inquiry: ${projTitle}`);
                      }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00c853] hover:bg-[#00b04a] text-white font-bold text-xs shadow-lg shadow-[#00c853]/20 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Request Similar Project</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* High Fidelity Interactive Sign In & Sign Up Modal (Get Started) */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              {/* Backdrop with a premium subtle blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              />

              {/* Modal Body: Sleek, Borderless look, High Contrast */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border relative z-10 p-1 ${darkMode ? 'bg-[#111111] border-slate-850 text-white' : 'bg-white border-slate-100 text-slate-800'
                  }`}
              >

                {/* Premium Minimal Header with Close button */}
                <div className="relative pt-8 pb-4 px-6 text-center">

                  {/* Floating Close Button */}
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Centered Minimal Brand Logo */}
                  <div className="flex justify-center mb-4">
                    <img
                      src="/logo.jpg"
                      alt="DigiWorku Logo"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-slate-100 dark:border-slate-800"
                    />
                  </div>

                  {/* Elegant Minimal Typography */}
                  <h3 className="text-lg font-black tracking-tight leading-snug font-display">
                    {authMode === 'signin' ? 'Welcome Back' : 'Create Client Account'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                    {authMode === 'signin' ? 'Sign in to access your digital workspace' : 'Join the cloud workspace matrix'}
                  </p>
                </div>

                {/* iOS-Style Sliding Pill Toggles */}
                <div className="grid grid-cols-2 p-1 bg-slate-100/60 dark:bg-slate-900/40 mx-6 mb-3 rounded-2xl border border-slate-200/10 dark:border-slate-800/20">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'signin'
                      ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${authMode === 'signup'
                      ? 'bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Live Form with Auth actions */}
                <AuthForm
                  authMode={authMode}
                  darkMode={darkMode}
                  onSuccess={(user) => {
                    setCurrentUser(user);
                    setIsAuthModalOpen(false);
                    triggerToast(`🎉 Welcome back, ${user.name}! Workspace synchronized successfully.`);
                  }}
                />

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* High Fidelity Right Sliding Notification Drawer */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">

              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotificationsOpen(false)}
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
              />

              {/* Drawer Body */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 ${darkMode ? 'bg-[#182025] text-white border-l border-slate-800' : 'bg-white text-slate-800 border-l border-slate-200'
                  }`}
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#00c853]/10 text-[#00c853] rounded-lg">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight">Notification Center</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {notifications.filter(n => !n.read).length} Unread Updates
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Action Toolbar */}
                <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-900/20 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-500 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        triggerToast("✨ All notifications marked as read!");
                      }}
                      className="hover:text-[#00c853] dark:hover:text-[#00c853] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Mark all as read
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <button
                      onClick={() => {
                        setNotifications([]);
                        triggerToast("🗑️ All notifications cleared!");
                      }}
                      className="hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  {isAdmin && panelMode === 'admin' && (
                    <button
                      onClick={() => {
                        const title = prompt("Enter Broadcast Title:");
                        if (!title) return;
                        const msg = prompt("Enter Broadcast Message:");
                        if (!msg) return;
                        const newNotif = {
                          id: `broadcast-${Date.now()}`,
                          title: `📢 ${title}`,
                          description: msg,
                          time: 'Just now',
                          type: 'success',
                          read: false,
                          category: 'Admin Broadcast'
                        };
                        setNotifications(prev => [newNotif, ...prev]);
                        localStorage.setItem('digiworku-broadcast-notification', JSON.stringify(newNotif));
                        triggerToast("📢 Broadcast sent to all active users!");
                      }}
                      className="text-[#00c853] hover:text-[#00a845] flex items-center gap-1 cursor-pointer transition-colors border border-[#00c853]/20 bg-[#00c853]/10 px-2 py-1 rounded-md"
                    >
                      <Rocket className="w-3.5 h-3.5" /> Broadcast
                    </button>
                  )}
                </div>

                {/* Notification Content Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                        <Bell className="w-8 h-8 opacity-40 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Notifications Yet</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          You've cleared your feed! Wait for live developer team and CRM events, or reset the default feed below.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setNotifications([
                            {
                              id: 'notif-1',
                              title: '🚀 AI Agent Initialized',
                              description: 'DigiWorku AI Operator is ready. Smart routing has been updated for high-speed indexing.',
                              time: 'Just now',
                              type: 'success',
                              read: false,
                              category: 'System'
                            },
                            {
                              id: 'notif-2',
                              title: '💬 Team Member Assigned',
                              description: 'Ananya Sharma has been linked as your Lead PM for DigiWorku workspace.',
                              time: '20 mins ago',
                              type: 'message',
                              read: false,
                              category: 'Team'
                            }
                          ]);
                          triggerToast("🔄 Default notification feed restored.");
                        }}
                        className="text-xs text-[#00c853] font-bold underline cursor-pointer"
                      >
                        Reset Default Feed
                      </button>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      // Decide type specific styling
                      let iconColor = "text-blue-500 bg-blue-500/10";
                      let IconComponent = FileText;

                      if (notif.type === 'success') {
                        iconColor = "text-[#00c853] bg-[#00c853]/10";
                        IconComponent = CheckCircle2;
                      } else if (notif.type === 'message') {
                        iconColor = "text-indigo-500 bg-indigo-500/10";
                        IconComponent = MessageSquare;
                      } else if (notif.type === 'warning' || notif.type === 'alert') {
                        iconColor = "text-amber-500 bg-amber-500/10";
                        IconComponent = AlertCircle;
                      }

                      return (
                        <div
                          key={notif.id}
                          className={`p-3.5 rounded-xl border transition-all relative group flex items-start gap-3 ${notif.read
                            ? (darkMode ? 'bg-slate-900/30 border-slate-800 text-slate-400' : 'bg-slate-50/50 border-slate-100 text-slate-500')
                            : (darkMode ? 'bg-slate-800/45 border-[#00c853]/35 text-white shadow-xs' : 'bg-[#00c853]/5 dark:bg-[#00c853]/10 border-[#00c853]/25 text-slate-800 shadow-xs')
                            }`}
                        >
                          {/* Unread pulsing dot */}
                          {!notif.read && (
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#00c853] rounded-full" />
                          )}

                          {/* Icon */}
                          <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          {/* Title and details */}
                          <div className="min-w-0 flex-1 pr-4">
                            <div className="flex items-center gap-1.5">
                              <h4 className={`text-xs font-bold leading-snug ${notif.read ? 'text-slate-700 dark:text-slate-350' : 'text-slate-900 dark:text-white font-black'}`}>
                                {notif.title}
                              </h4>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
                              {notif.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-slate-400 font-bold">
                                {notif.time}
                              </span>
                              <span className="text-[10px] text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                {notif.category}
                              </span>
                            </div>
                          </div>

                          {/* Actions drawer hover panel */}
                          <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-[#182025] rounded-lg shadow-md p-1 border border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => {
                                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: !n.read } : n));
                                triggerToast(notif.read ? "Marked as unread" : "Marked as read");
                              }}
                              className="p-1 text-slate-400 hover:text-[#00c853] rounded-md"
                              title={notif.read ? "Mark Unread" : "Mark Read"}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                triggerToast("Notification deleted");
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-md"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Secure Footer Status Block */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center text-[10px] text-slate-400 font-bold">
                  🔒 DigiWorku Notification Service Secured by End-to-End Encryption
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* High Fidelity Right Sliding Profile Drawer */}
        <AnimatePresence>
          {isProfileOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">

              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProfileOpen(false)}
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
              />

              {/* Drawer Body */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 ${darkMode ? 'bg-[#182025] text-white border-l border-slate-800' : 'bg-white text-slate-800 border-l border-slate-200'
                  }`}
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#00c853]/10 text-[#00c853] rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-tight">
                        {panelMode === 'admin' ? "Operator Command Console" : "Profile"}
                      </h3>
                      {(!currentUser || panelMode === 'admin') && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {panelMode === 'admin' ? "Active Administrator" : "Guest Client Session"}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                  {panelMode === 'admin' ? (
                    /* Admin Operator Panel */
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-3">
                        <div className="relative">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Ananya Sharma"
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#00c853] shadow-md"
                          />
                          <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00c853] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">Ananya Sharma</h4>
                          <p className="text-xs text-slate-400 mt-0.5">ananya.sharma@digiworku.com</p>
                          <span className="inline-block text-[9px] px-2 py-0.5 rounded-full bg-[#00c853]/10 text-[#00c853] font-bold uppercase tracking-wider mt-2">
                            Lead PM & Operator Console Admin
                          </span>
                        </div>
                      </div>

                      {/* Operational Details Card */}
                      <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-3">
                        <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">System Permissions</h5>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" /> Full Access
                          </div>
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Decryption Key
                          </div>
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Zap className="w-3.5 h-3.5 text-emerald-500" /> Fast Routing
                          </div>
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" /> Server Node
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentUser ? (
                    /* Logged-In Client Profile */
                    <div className="space-y-6">
                      {/* Avatar Card */}
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-3">
                        <div
                          className="relative group cursor-pointer"
                          title="Click to upload custom photo"
                          onClick={() => document.getElementById('profile-avatar-file-input')?.click()}
                        >
                          <img
                            src={editProfileAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=00c853&color=fff&bold=true`}
                            alt={currentUser.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#00c853] shadow-md transition-all group-hover:scale-105 group-hover:opacity-90"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black">
                            UPLOAD
                          </div>
                          <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#00c853] rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <UserCheck className="w-3 h-3 text-white" />
                          </span>
                        </div>

                        <input
                          type="file"
                          id="profile-avatar-file-input"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                triggerToast("⚠️ Image size should be less than 2MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setEditProfileAvatar(event.target.result as string);
                                  triggerToast("📸 Custom profile photo loaded! Click Save to apply changes.");
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        <div className="w-full">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Workspace Avatar Themes</span>
                          <div className="flex items-center justify-center gap-2">
                            {[
                              `https://unavatar.io/${encodeURIComponent(editProfileEmail.trim().toLowerCase())}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`,
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`,
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=1e293b&color=fff&bold=true&size=256`,
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=3b82f6&color=fff&bold=true&size=256`
                            ].map((av, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setEditProfileAvatar(av);
                                  triggerToast(`Selected Avatar Preset #${idx + 1}`);
                                }}
                                className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-110 ${editProfileAvatar === av ? 'border-[#00c853] ring-2 ring-[#00c853]/20 scale-105' : 'border-slate-200 dark:border-slate-700'
                                  }`}
                              >
                                <img src={av} alt={`Preset ${idx}`} className="w-full h-full object-cover animate-fade-in" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Editable Input Fields */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={editProfileName}
                              onChange={(e) => setEditProfileName(e.target.value)}
                              placeholder="Guest Client"
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              value={editProfileEmail}
                              onChange={(e) => setEditProfileEmail(e.target.value)}
                              placeholder="alex.rivera@gmail.com"
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={editProfileMobile}
                              onChange={(e) => setEditProfileMobile(e.target.value)}
                              placeholder="+1 555-0199"
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs font-bold focus:outline-none focus:border-[#00c853] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={() => {
                            if (!editProfileName.trim() || !editProfileEmail.trim()) {
                              triggerToast("⚠️ Name and Email cannot be empty.");
                              return;
                            }
                            const cleanEmail = editProfileEmail.trim().toLowerCase();
                            const fallbackAvatarUrl = `https://unavatar.io/${encodeURIComponent(cleanEmail)}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(editProfileName)}&background=00c853&color=fff&bold=true&size=256`;
                            const updatedUser = {
                              ...currentUser,
                              name: editProfileName,
                              email: editProfileEmail,
                              mobile: editProfileMobile,
                              avatarUrl: editProfileAvatar || fallbackAvatarUrl
                            };
                            setCurrentUser(updatedUser);
                            localStorage.setItem('digiworku-user-session', JSON.stringify(updatedUser));
                            triggerToast("✨ Profile updated successfully!");
                          }}
                          className="w-full py-3 rounded-xl bg-[#00c853] hover:bg-[#00b54b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#00c853]/10 active:scale-98"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Workspace Profile</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Guest Client Profile Panel */
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col items-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Lock className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">Guest Client Account</h4>
                          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs">
                            You are currently exploring DigiWorku in public preview mode. Registering locks in premium client workspace matrices.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAuthModalOpen(true);
                            setAuthMode('signup');
                            triggerToast("🚀 Loading Client Registration Portal...");
                          }}
                          className="w-full py-3.5 rounded-xl bg-[#00c853] hover:bg-[#00af48] text-white font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#00c853]/15 active:scale-98"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>CREATE CLIENT ACCOUNT</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsAuthModalOpen(true);
                            setAuthMode('signin');
                            triggerToast("🔑 Loading Secure Client Login...");
                          }}
                          className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>SIGN IN TO MY WORKSPACE</span>
                        </button>
                      </div>
                    </div>
                  )}



                  {/* Log Out Block */}
                  {currentUser && (
                    <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5">
                      <button
                        onClick={() => {
                          localStorage.removeItem('digiworku-user-session');
                          setCurrentUser(null);
                          setIsProfileOpen(false);
                          triggerToast("🔒 Logged out securely. Client session terminated.");
                        }}
                        className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>SECURE LOG OUT SESSION</span>
                      </button>
                    </div>
                  )}

                </div>


              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ADD PROJECT MODAL */}
        <AnimatePresence>
          {isAddProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddProjectModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Folder className="w-4 h-4 text-emerald-500" />
                    Add New Pipeline Project
                  </h3>
                  <button onClick={() => setIsAddProjectModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Project Name</label>
                    <input
                      type="text"
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                      placeholder="e.g. Website Redesign"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Client / Lead Name</label>
                    <input
                      type="text"
                      value={newProjectForm.client}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Budget (Optional)</label>
                    <input
                      type="text"
                      value={newProjectForm.budget}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, budget: e.target.value })}
                      placeholder="e.g. ₹50,000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Description</label>
                    <textarea
                      value={newProjectForm.desc}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, desc: e.target.value })}
                      placeholder="Project requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                  <button
                    onClick={() => setIsAddProjectModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newProjectForm.name || !newProjectForm.client) return;

                      const newProj: CRMProject = {
                        id: `#PJ-${Math.floor(5000 + Math.random() * 999)}`,
                        name: newProjectForm.name,
                        leadName: newProjectForm.client,
                        leadAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newProjectForm.client)}&background=random`,
                        status: 'ON TRACK',
                        healthScore: 100,
                        budget: newProjectForm.budget || 'TBD',
                        description: newProjectForm.desc || 'New operational milestone.',
                        progress: 0
                      };

                      setCrmProjectsList(prev => [newProj, ...prev]);
                      setIsAddProjectModalOpen(false);
                      setNewProjectForm({ name: '', client: '', budget: '', desc: '' });
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ADD MEMBER MODAL */}
        <AnimatePresence>
          {isAddMemberModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddMemberModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-500" />
                    Add Digital Workforce Member
                  </h3>
                  <button onClick={() => setIsAddMemberModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={newMemberForm.name}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                      placeholder="e.g. Vikram Aditya"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Role / Specialization</label>
                    <input
                      type="text"
                      value={newMemberForm.role}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                      placeholder="e.g. Next.js Developer"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Avatar Image URL (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMemberForm.avatarUrl}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, avatarUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or blank"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const randoms = [
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                          ];
                          const chosen = randoms[Math.floor(Math.random() * randoms.length)];
                          setNewMemberForm({ ...newMemberForm, avatarUrl: chosen });
                          triggerToast("🎲 Assigned randomized stock portrait URL!");
                        }}
                        className="px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-xs font-black text-slate-700 dark:text-slate-300 transition-colors"
                        title="Generate random profile image"
                      >
                        🎲 Random
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Shift Status</label>
                    <select
                      value={newMemberForm.status}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, status: e.target.value as 'ONLINE' | 'OFF SHIFT' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white"
                    >
                      <option value="ONLINE">ONLINE</option>
                      <option value="OFF SHIFT">OFF SHIFT</option>
                    </select>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                  <button
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newMemberForm.name || !newMemberForm.role) {
                        triggerToast("⚠️ Name and Role are required fields.");
                        return;
                      }

                      const finalAvatar = newMemberForm.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberForm.name)}&background=00c853&color=fff`;

                      const newMember: TeamMember = {
                        id: `team-${Date.now()}`,
                        name: newMemberForm.name,
                        role: newMemberForm.role,
                        avatarUrl: finalAvatar,
                        status: newMemberForm.status,
                        blocked: false
                      };

                      setTeamMembers(prev => [...prev, newMember]);
                      setIsAddMemberModalOpen(false);
                      setNewMemberForm({ name: '', role: '', avatarUrl: '', status: 'ONLINE' });
                      triggerToast(`👥 Team Joined: ${newMemberForm.name} is now in workforce database!`);
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  >
                    Join Team
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AUTO-REPLY MANAGEMENT MODAL */}
        <AnimatePresence>
          {isAutoReplyModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAutoReplyModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5 text-[#00c853]" />
                    Auto-Reply Configuration (10s Delay)
                  </h3>
                  <button onClick={() => setIsAutoReplyModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${autoReplyEnabled ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${autoReplyEnabled ? 'bg-[#00c853] animate-pulse' : 'bg-red-500'}`} />
                      <div>
                        <span className="block text-xs font-black text-slate-800 dark:text-white">
                          Auto-Reply Status: {autoReplyEnabled ? 'ACTIVE' : 'DISABLED / REMOVED'}
                        </span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                          ⏱️ Response Delay: 10 Seconds
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const nextState = !autoReplyEnabled;
                        setAutoReplyEnabled(nextState);
                        localStorage.setItem('digiworku-auto-reply-enabled', String(nextState));
                        triggerToast(nextState ? "🟢 Auto-Reply enabled!" : "🗑️ Auto-Reply disabled & removed!");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${autoReplyEnabled
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-[#00c853] text-white hover:bg-emerald-600'
                      }`}
                    >
                      {autoReplyEnabled ? 'Remove Auto-Reply' : 'Enable Auto-Reply'}
                    </button>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Auto-Reply Message Content
                    </label>
                    <textarea
                      rows={4}
                      value={autoReplyText}
                      onChange={(e) => setAutoReplyText(e.target.value)}
                      placeholder="Enter the automated reply message..."
                      disabled={!autoReplyEnabled}
                      className="w-full p-3.5 text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-[#00c853] outline-none disabled:opacity-50 transition-all leading-relaxed"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      💡 Users sending a message will receive this text exactly 10 seconds after sending.
                    </span>
                  </div>
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                  <button
                    onClick={() => {
                      const defMsg = "Thank you for reaching out to DigiWorku! Our team has received your message and will update your project details shortly.";
                      setAutoReplyText(defMsg);
                      localStorage.setItem('digiworku-auto-reply-text', defMsg);
                      triggerToast("↺ Reset to default message.");
                    }}
                    className="py-2.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs transition-colors"
                  >
                    Reset Default
                  </button>

                  <button
                    onClick={() => {
                      localStorage.setItem('digiworku-auto-reply-text', autoReplyText);
                      localStorage.setItem('digiworku-auto-reply-enabled', String(autoReplyEnabled));
                      setIsAutoReplyModalOpen(false);
                      triggerToast("⚡ Auto-Reply settings saved successfully!");
                    }}
                    className="flex-1 py-2.5 rounded-xl font-black text-white bg-[#00c853] hover:bg-emerald-600 text-xs transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Interactive Service Request / Booking Modal */}
        <AnimatePresence>
          {isServiceRequestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl relative ${darkMode ? 'bg-[#181818] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              >
                <button
                  onClick={() => setIsServiceRequestModalOpen(false)}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#e8fcf0] dark:bg-emerald-950/80 text-[#00c853] rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight font-display">Request Project Service</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Submit project requirements to launch a sprint with DigiWorku.</p>
                  </div>
                </div>

                <form onSubmit={handleServiceRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Select Service Category
                    </label>
                    <select
                      value={selectedRequestServiceTitle}
                      onChange={(e) => {
                        setSelectedRequestServiceTitle(e.target.value);
                        const found = servicesList.find(s => s.title === e.target.value);
                        if (found) setRequestFormBudget(found.price);
                      }}
                      className={`w-full p-3 rounded-xl border text-xs font-bold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    >
                      {servicesList.map(s => (
                        <option key={s.id} value={s.title}>{s.title} ({s.price})</option>
                      ))}
                      <option value="Custom Software & AI Architecture">Custom Software & AI Architecture (Custom Quote)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Singh"
                        value={requestFormClientName}
                        onChange={(e) => setRequestFormClientName(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ramesh@company.com"
                        value={requestFormEmail}
                        onChange={(e) => setRequestFormEmail(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={requestFormPhone}
                        onChange={(e) => setRequestFormPhone(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹45,000"
                        value={requestFormBudget}
                        onChange={(e) => setRequestFormBudget(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Project Goals & Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your goals, tech preferences, or desired launch timeline..."
                      value={requestFormDescription}
                      onChange={(e) => setRequestFormDescription(e.target.value)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold focus:outline-hidden focus:border-[#00c853] ${darkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsServiceRequestModalOpen(false)}
                      className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingServiceRequest}
                      className="flex-1 py-3.5 rounded-xl text-xs font-extrabold tracking-wider uppercase text-white bg-[#00c853] hover:bg-[#00b047] active:scale-98 transition-all shadow-lg shadow-[#00c853]/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmittingServiceRequest ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>



    </div>
  );
}
