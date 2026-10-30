import { supabase } from '../supabase';
import type { ServiceItem, TeamMember, ReviewItem, ProjectItem, CRMProject, CRMInquiry } from '../types';
import { DEFAULT_SERVICES, DEFAULT_TEAM, DEFAULT_REVIEWS } from '../data/defaults';

/**
 * Service to handle clean database hydration and mutations directly with Supabase.
 */

export async function fetchTeamFromDB(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('fetchTeamFromDB error:', error.message);
      return DEFAULT_TEAM;
    }

    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        avatarUrl: r.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=00c853&color=fff&bold=true&size=256`,
        status: r.status || 'ONLINE',
        blocked: r.blocked || false
      }));
    }
  } catch (err: any) {
    console.warn('fetchTeamFromDB exception:', err.message);
  }
  return DEFAULT_TEAM;
}

export async function fetchServicesFromDB(): Promise<ServiceItem[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('fetchServicesFromDB error:', error.message);
      return DEFAULT_SERVICES;
    }

    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description || '',
        category: r.category || 'Development',
        price: r.price || '',
        icon: r.icon || 'Globe',
        content: r.content || '',
        overview: r.overview || '',
        offerings: r.offerings || [],
        process: r.process || [],
        features: r.features || [],
        whyUs: r.why_us || [],
        deliverables: r.deliverables || [],
        faqs: r.faqs || []
      }));
    }
  } catch (err: any) {
    console.warn('fetchServicesFromDB exception:', err.message);
  }
  return DEFAULT_SERVICES;
}

export async function fetchReviewsFromDB(): Promise<ReviewItem[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchReviewsFromDB error:', error.message);
      return DEFAULT_REVIEWS;
    }

    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role || '',
        rating: r.rating || 5,
        text: r.text,
        avatarInitials: r.avatar_initials || r.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
        createdAt: (() => {
          const d = new Date(r.created_at);
          const now = new Date();
          const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
          return diff === 0 ? 'Today' : diff === 1 ? '1 day ago' : `${diff} days ago`;
        })()
      }));
    }
  } catch (err: any) {
    console.warn('fetchReviewsFromDB exception:', err.message);
  }
  return DEFAULT_REVIEWS;
}

export async function fetchProjectsFromDB(): Promise<ProjectItem[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchProjectsFromDB error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',') : []),
        imageUrl: item.image_url || item.imageUrl || '',
        videoUrl: item.video_url || item.videoUrl || undefined,
        mediaType: item.media_type || item.mediaType || (item.video_url || item.videoUrl ? 'video' : 'image'),
        clientName: item.client_name || item.clientName || 'DigiWorku Client',
        impactResult: item.impact_result || item.impactResult || undefined,
        created_at: item.created_at
      }));
    }
  } catch (err: any) {
    console.warn('fetchProjectsFromDB exception:', err.message);
  }
  return [];
}

export async function fetchInquiriesFromDB(): Promise<CRMInquiry[]> {
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchInquiriesFromDB error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((row: any) => {
        const msgParts = (row.message || '').split(': ');
        const projectName = msgParts.length > 1 ? msgParts[0] : 'Service Inquiry';
        const summaryRaw = msgParts.slice(1).join(': ');
        const budgetMatch = summaryRaw.match(/\(Budget: (.+?)\)/);
        const budget = budgetMatch ? budgetMatch[1] : undefined;
        const summary = summaryRaw.replace(/\s*\(Budget: .+?\)/, '').trim() || summaryRaw;

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
    }
  } catch (err: any) {
    console.warn('fetchInquiriesFromDB exception:', err.message);
  }
  return [];
}

export async function fetchCrmProjectsFromDB(): Promise<CRMProject[]> {
  try {
    const { data, error } = await supabase
      .from('crm_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('fetchCrmProjectsFromDB error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        leadName: r.lead_name || '',
        leadAvatar: r.lead_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.lead_name || 'Lead')}&background=00c853&color=fff&bold=true&size=256`,
        status: r.status || 'ON TRACK',
        healthScore: r.health_score || 100,
        budget: r.budget || '',
        description: r.description || '',
        progress: r.progress || 0,
        email: r.email || ''
      }));
    }
  } catch (err: any) {
    console.warn('fetchCrmProjectsFromDB exception:', err.message);
  }
  return [];
}
