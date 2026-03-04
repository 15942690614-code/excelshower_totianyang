import { createClient } from '@supabase/supabase-js'

// Try to get env vars, fallback to empty string
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

// If URL is invalid (e.g. empty or placeholder), use a dummy valid URL to prevent crash
// But auth calls will still fail gracefully instead of crashing the app
const validUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-key';

export const isSupabaseConfigured = () => {
  return isValidUrl(supabaseUrl) && supabaseAnonKey.length > 0;
};

export const supabase = createClient(validUrl, validKey)
