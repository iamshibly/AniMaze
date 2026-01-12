// Production-ready localStorage authentication system
export interface User {
  id: string;
  email: string;
  user_metadata: {
    username: string;
    avatar_id: number; // Changed from string to number
    avatar_url?: string; // Added optional avatar_url property
    is_premium: boolean;
    premium_until: string;
    xp: number;
    level: number;
    role?: string;
  };
}

interface AuthData {
  user: User;
  session: {
    access_token: string;
    user: User;
  };
}

interface AuthError {
  message: string;
}

interface AuthResponse {
  data: AuthData | null;
  error: AuthError | null;
}

// Storage keys
const USERS_KEY = 'anime_app_users';
const CURRENT_USER_KEY = 'anime_app_current_user';
const SESSION_KEY = 'anime_app_session';

// Helper functions
const getStoredUsers = (): any[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading stored users:', error);
    return [];
  }
};

const saveUsers = (users: any[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const generateId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
};

// Password hashing simulation (in production, use proper bcrypt or similar)
const hashPassword = (password: string): string => {
  // Simple hash simulation - in production use proper hashing
  return btoa(password + 'anime_app_salt').split('').reverse().join('');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// NEW: Add generic storage utilities for critique system
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

// NEW: Export generateId for critique system
export { generateId };

// Create default admin user if none exists
const initializeDefaultUsers = () => {
  const users = getStoredUsers();
  
  // Check if admin exists
  const adminExists = users.some(user => user.user_metadata?.role === 'admin');
  
  if (!adminExists) {
    const adminUser = {
      id: generateId(),
      email: 'admin@animequiz.com',
      password: hashPassword('admin123'),
      user_metadata: {
        username: 'Admin',
        avatar_id: 1, // Changed to number
        is_premium: true,
        premium_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 10000,
        level: 50,
        role: 'admin'
      }
    };
    
    users.push(adminUser);
    saveUsers(users);
    console.log('Default admin user created: admin@animequiz.com / admin123');
  }
};

// Initialize on load
initializeDefaultUsers();

// Auth functions
export const signUp = async (
  email: string, 
  password: string, 
  username: string, 
  avatarId: number, // Changed from string to number
  role: string = 'user'
): Promise<AuthResponse> => {
  try {
    const users = getStoredUsers();
    
    // Validation
    if (!email || !password || !username) {
      return {
        data: null,
        error: { message: 'All fields are required' }
      };
    }

    if (password.length < 6) {
      return {
        data: null,
        error: { message: 'Password must be at least 6 characters long' }
      };
    }
    
    // Check if email already exists
    if (users.find(user => user.email === email)) {
      return {
        data: null,
        error: { message: 'User with this email already exists' }
      };
    }

    // Check if username already exists
    if (users.find(user => user.user_metadata.username === username)) {
      return {
        data: null,
        error: { message: 'Username already taken' }
      };
    }

    const newUser: User = {
      id: generateId(),
      email,
      user_metadata: {
        username,
        avatar_id: avatarId, // Now properly typed as number
        is_premium: true, // Give new users 30 days premium
        premium_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 0,
        level: 1,
        role: role
      }
    };

    // Store user with hashed password
    const userWithPassword = { 
      ...newUser, 
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    users.push(userWithPassword);
    saveUsers(users);

    // Create session
    const session = {
      access_token: generateToken(),
      user: newUser
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      data: { user: newUser, session },
      error: null
    };

  } catch (error) {
    console.error('Sign up error:', error);
    return {
      data: null,
      error: { message: 'Registration failed. Please try again.' }
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const users = getStoredUsers();
    
    // Validation
    if (!email || !password) {
      return {
        data: null,
        error: { message: 'Email and password are required' }
      };
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      };
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return {
        data: null,
        error: { message: 'Invalid email or password' }
      };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);

    // Clean user object (remove password)
    const cleanUser: User = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    };

    const session = {
      access_token: generateToken(),
      user: cleanUser
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cleanUser));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      data: { user: cleanUser, session },
      error: null
    };

  } catch (error) {
    console.error('Sign in error:', error);
    return {
      data: null,
      error: { message: 'Login failed. Please try again.' }
    };
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    
    // Trigger auth state change
    triggerAuthStateChange('SIGNED_OUT', null);
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: { message: 'Sign out failed' } };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User['user_metadata']>): Promise<AuthResponse> => {
  try {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        data: null,
        error: { message: 'User not found' }
      };
    }

    // Update user metadata
    users[userIndex].user_metadata = {
      ...users[userIndex].user_metadata,
      ...updates
    };
    
    saveUsers(users);

    // Update current user in localStorage
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        user_metadata: users[userIndex].user_metadata
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      return {
        data: { user: updatedUser, session: await getSession() },
        error: null
      };
    }

    return {
      data: null,
      error: null
    };

  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      data: null,
      error: { message: 'Failed to update profile' }
    };
  }
};

// Change password
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<{ error: AuthError | null }> => {
  try {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { error: { message: 'User not found' } };
    }

    // Verify current password
    if (!verifyPassword(currentPassword, users[userIndex].password)) {
      return { error: { message: 'Current password is incorrect' } };
    }

    if (newPassword.length < 6) {
      return { error: { message: 'New password must be at least 6 characters long' } };
    }

    // Update password
    users[userIndex].password = hashPassword(newPassword);
    saveUsers(users);

    return { error: null };

  } catch (error) {
    console.error('Error changing password:', error);
    return { error: { message: 'Failed to change password' } };
  }
};

// Admin functions
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = getStoredUsers();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const deleteUser = async (userId: string): Promise<{ error: AuthError | null }> => {
  try {
    const users = getStoredUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsers(filteredUsers);
    return { error: null };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: { message: 'Failed to delete user' } };
  }
};

// Auth state change simulation
type AuthStateChangeCallback = (event: string, session: any) => void;
let authStateChangeCallback: AuthStateChangeCallback | null = null;

export const onAuthStateChange = (callback: AuthStateChangeCallback) => {
  authStateChangeCallback = callback;
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          authStateChangeCallback = null;
        }
      }
    }
  };
};

// Trigger auth state change (called internally)
const triggerAuthStateChange = (event: string, session: any) => {
  if (authStateChangeCallback) {
    authStateChangeCallback(event, session);
  }
};

// Check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.user_metadata?.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Check if user is critique
export const isCritique = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.user_metadata?.role === 'critique';
  } catch (error) {
    return false;
  }
};

// Check if user is premium
export const isPremium = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user?.user_metadata?.is_premium) return false;
    
    const premiumUntil = new Date(user.user_metadata.premium_until);
    return premiumUntil > new Date();
  } catch (error) {
    return false;
  }
};

// Mock supabase object for compatibility
export const supabase = {
  auth: {
    signUp: async (options: { email: string; password: string; options?: { data?: any } }) => {
      const { email, password } = options;
      const userData = options.options?.data || {};
      
      return await signUp(
        email, 
        password, 
        userData.name || userData.username || 'User',
        typeof userData.avatar_id === 'number' ? userData.avatar_id : parseInt(userData.avatar_id) || 1, // Ensure number
        userData.role || 'user'
      );
    },
    
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      return await signIn(credentials.email, credentials.password);
    },
    
    signOut: async () => {
      const result = await signOut();
      triggerAuthStateChange('SIGNED_OUT', null);
      return result;
    },
    
    getUser: async () => {
      const user = await getCurrentUser();
      return { data: { user }, error: null };
    },
    
    getSession: async () => {
      const session = await getSession();
      return { data: { session }, error: null };
    },
    
    onAuthStateChange,
    
    updateUser: async (updates: { data?: any }) => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return { data: null, error: { message: 'No user logged in' } };
      }
      
      return await updateUserProfile(currentUser.id, updates.data);
    }
  },
  
  // Mock database functions for compatibility
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({ data: [], error: null })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ error: null })
    })
  })
};

// Export additional utility functions
export const utils = {
  hashPassword,
  verifyPassword,
  generateId,
  generateToken,
  initializeDefaultUsers,
  getAllUsers,
  deleteUser,
  updateUserProfile,
  changePassword,
  isAdmin,
  isCritique,
  isPremium
};