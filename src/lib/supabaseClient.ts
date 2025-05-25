
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvttoajminrdidvhxrgc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dHRvYWptaW5yZGlkdmh4cmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjA1MzcsImV4cCI6MjA2MDc5NjUzN30.6MfYdW_fIzhPJVcUYoYBpbc2NMEn-N1gAjyRorLUNfI';

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

