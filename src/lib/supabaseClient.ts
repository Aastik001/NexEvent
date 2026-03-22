
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper type for Supabase user
export type SupabaseUser = {
  email: string;
  id: string;
};

// Helper function to convert Supabase user to our app's user format
export const formatUser = (user: any): SupabaseUser | null => {
  if (!user) return null;
  
  return {
    email: user.email || '',
    id: user.id || '',
  };
};

