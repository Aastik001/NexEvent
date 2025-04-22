
import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
// For development purposes, we'll use hardcoded values
// In a production app, these would be set in the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Check if we're using the fallback values and warn the developer
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'environment variables for proper functionality.'
  );
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
