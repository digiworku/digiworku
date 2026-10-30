import type React from 'react';

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

export interface ServiceItem {
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

export interface ChatMessage {
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

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarInitials: string;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  avatarUrl?: string;
}
