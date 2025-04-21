
// This file is necessary for the Supabase integration
// The actual Supabase client is injected by Lovable's Supabase integration
// so this file is a placeholder to avoid import errors

// Mock user state for development
const localStorageKey = 'supabase.auth.token';
const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.user;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user from storage:', error);
    return null;
  }
};

const setUserInStorage = (user: any, session: any) => {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify({ user, session }));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem(localStorageKey);
  } catch (error) {
    console.error('Error clearing user from storage:', error);
  }
};

// Mock Supabase client with the methods we're using
export const supabase = {
  auth: {
    getUser: async () => {
      const user = getUserFromStorage();
      return { 
        data: { 
          user: user 
        } 
      };
    },
    onAuthStateChange: (callback: any) => {
      const user = getUserFromStorage();
      if (user) {
        // Simulate an initial session state
        setTimeout(() => callback('SIGNED_IN', { user }), 0);
      }
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signOut: async () => {
      clearUserFromStorage();
      return {};
    },
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Simulate successful login
      const user = { email, id: 'mock-id-' + Date.now() };
      const session = { access_token: 'mock-token-' + Date.now() };
      setUserInStorage(user, session);
      return { 
        data: { user, session }, 
        error: null 
      };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Simulate successful signup
      const user = { email, id: 'mock-id-' + Date.now() };
      const session = { access_token: 'mock-token-' + Date.now() };
      setUserInStorage(user, session);
      return { 
        data: { user, session }, 
        error: null 
      };
    }
  }
};
