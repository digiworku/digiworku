import { supabase } from '../supabase';

export interface UserProfileData {
  id: string;
  name?: string;
  email?: string;
  mobile?: string;
  avatar_url?: string | null;
}

/**
 * Persists user profile to Supabase database.
 * Attempts to write to 'users' table (supported in live schema)
 * with graceful fallback to 'user_profiles'.
 */
export async function saveUserProfileToDB(profile: UserProfileData): Promise<boolean> {
  if (!profile.id) return false;

  const payload: Record<string, any> = {
    id: profile.id
  };
  if (profile.name !== undefined) payload.name = profile.name;
  if (profile.email !== undefined) payload.email = profile.email;
  if (profile.mobile !== undefined) payload.mobile = profile.mobile;
  if (profile.avatar_url !== undefined) payload.avatar_url = profile.avatar_url;

  try {
    const { error } = await supabase.from('users').upsert(payload);
    if (!error) return true;
    
    // If 'users' table errored, try 'user_profiles'
    const fallback = await supabase.from('user_profiles').upsert(payload);
    return !fallback.error;
  } catch (err) {
    console.warn('saveUserProfileToDB notice:', err);
    return false;
  }
}

/**
 * Fetches user profile from Supabase database by user UUID.
 * Checks 'users' table first, falling back to 'user_profiles'.
 */
export async function fetchUserProfileFromDB(userId: string): Promise<UserProfileData | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        avatar_url: data.avatar_url
      };
    }

    // Fallback attempt to user_profiles
    const fallback = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!fallback.error && fallback.data) {
      return {
        id: fallback.data.id,
        name: fallback.data.name,
        email: fallback.data.email,
        mobile: fallback.data.mobile,
        avatar_url: fallback.data.avatar_url
      };
    }

    return null;
  } catch (err) {
    console.warn('fetchUserProfileFromDB notice:', err);
    return null;
  }
}
