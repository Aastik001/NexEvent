
// This file is necessary for the Supabase integration
// The actual Supabase client is injected by Lovable's Supabase integration
// so this file is a placeholder to avoid import errors

// Mock Supabase client with the methods we're using
export const supabase = {
  auth: {
    getUser: async () => ({ 
      data: { 
        user: null 
      } 
    }),
    onAuthStateChange: (callback: any) => ({
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }),
    signOut: async () => ({}),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => ({ 
      data: null, 
      error: null 
    }),
    signUp: async ({ email, password }: { email: string; password: string }) => ({ 
      data: null, 
      error: null 
    })
  }
};
