import { createClient } from '@supabase/supabase-js';

// Safe environment variable resolution for both Vite and Node.js testing environments
const globalProcess = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (globalProcess && globalProcess.env) 
    ? globalProcess.env 
    : {};

const supabaseUrl = (env as any).VITE_SUPABASE_URL || '';
const supabaseAnonKey = (env as any).VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project-id')
);

// We export the Supabase client when configured, or null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;
