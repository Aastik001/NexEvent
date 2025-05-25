import { createClient } from '@supabase/supabase-js';

// Use your Supabase service role key here (keep it secret and do not expose in frontend)
const supabaseUrl = 'https://mvttoajminrdidvhxrgc.supabase.co';

const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dHRvYWptaW5yZGlkdmh4cmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMjA1MzcsImV4cCI6MjA2MDc5NjUzN30.6MfYdW_fIzhPJVcUYoYBpbc2NMEn-N1gAjyRorLUNfI';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function initializeEventsTable() {
  try {
    const { error } = await supabaseAdmin.rpc('initialize_events_table');
    if (error) {
      console.error('Initialization error:', error);
      throw error;
    }

    const { error: rlsError } = await supabaseAdmin.rpc('enable_rls_and_policies');
    if (rlsError) {
      console.error('RLS setup error:', rlsError);
      throw rlsError;
    }

    console.log('Events table initialized and RLS policies enabled successfully.');
  } catch (error) {
    console.error('Failed to initialize events table:', error);
  }
}

// Run the initialization
initializeEventsTable();
