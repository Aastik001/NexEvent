const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing required env vars: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
}

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
