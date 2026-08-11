import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://rjxbdjgagizjmjwnlbxx.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v-Wt6Skez4RmaQOUq-faCA_zHG-H8Au';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
