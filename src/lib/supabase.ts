import { createClient } from '@supabase/supabase-js';

let rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
// Automatically sanitize URL: strip trailing /rest/v1 or slashes if user pasted REST endpoint
rawUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  rawUrl && 
  supabaseAnonKey && 
  rawUrl.startsWith('https://') &&
  !rawUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, supabaseAnonKey)
  : null;
