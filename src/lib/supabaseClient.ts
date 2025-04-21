
// This file is necessary for the Supabase integration
// The actual Supabase client is injected by Lovable's Supabase integration
// so this file is a placeholder to avoid import errors

// Mock user state for development
const localStorageKey = 'supabase.auth.token';
const mockUsers = [
  { email: 'test@example.com', password: 'password123', id: 'user-1' },
  { email: 'user@test.com', password: 'test123', id: 'user-2' }
];

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
      // Check if the user exists and password matches
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const session = { access_token: 'mock-token-' + Date.now() };
        setUserInStorage(user, session);
        return { 
          data: { user, session }, 
          error: null 
        };
      }
      
      // Return error if credentials don't match
      return {
        data: { user: null, session: null },
        error: {
          message: 'Invalid email or password'
        }
      };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        return {
          data: { user: null, session: null },
          error: {
            message: 'User already exists'
          }
        };
      }
      
      // Create new user
      const newUser = { email, password, id: 'mock-id-' + Date.now() };
      mockUsers.push(newUser);
      
      const session = { access_token: 'mock-token-' + Date.now() };
      setUserInStorage(newUser, session);
      
      return { 
        data: { user: newUser, session }, 
        error: null 
      };
    }
  }
};
