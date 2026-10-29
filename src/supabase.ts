import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://rjxbdjgagizjmjwnlbxx.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v-Wt6Skez4RmaQOUq-faCA_zHG-H8Au';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type StorageBucket = 'projects-media' | 'chat-attachments' | 'digiworku-uploads';

/**
 * Uploads a file to Supabase Storage with client-side file size and MIME-type validation.
 * Eliminates storing heavy Base64 data strings in PostgreSQL columns.
 */
export async function uploadMediaToStorage(
  file: File,
  bucket: StorageBucket = 'projects-media'
): Promise<{ url: string | null; error: string | null }> {
  try {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    // File size constraints: Max 5MB for images, 50MB for videos, 10MB for documents
    const maxSizeBytes = isVideo ? 50 * 1024 * 1024 : (isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024);

    if (file.size > maxSizeBytes) {
      const maxMb = isVideo ? '50MB' : (isImage ? '5MB' : '10MB');
      return { url: null, error: `File size exceeds the allowed limit of ${maxMb}.` };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const sanitizedCleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const filePath = `${Date.now()}_${sanitizedCleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn(`[Supabase Storage] Upload error to bucket ${bucket}:`, uploadError.message);
      // If bucket policy rejected or bucket missing, return error
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('[Supabase Storage] Unexpected upload failure:', err);
    return { url: null, error: err.message || 'File upload failed' };
  }
}
