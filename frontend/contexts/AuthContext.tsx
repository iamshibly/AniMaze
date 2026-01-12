// src/contexts/AuthContext.tsx - Fixed to update state immediately on login
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, User, AuthSession } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCritique: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'critique';
    avatar_id?: number;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 Initializing authentication context...');
    refreshAuth();

    // FIXED: Add storage event listener to detect auth changes across tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anime_quiz_current_user' || e.key === 'anime_quiz_session') {
        console.log('🔄 Storage changed, refreshing auth state...');
        refreshAuth();
      }
    };

    // FIXED: Add custom event listener for auth state changes within the same tab
    const handleAuthChange = () => {
      console.log('🔄 Auth state change event detected, refreshing...');
      refreshAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  const refreshAuth = () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const currentSession = AuthService.getCurrentSession();
      
      setUser(currentUser);
      setSession(currentSession);
      
      console.log('🔍 Auth state refreshed:', {
        hasUser: !!currentUser,
        hasSession: !!currentSession,
        userId: currentUser?.id,
        userEmail: currentUser?.email
      });
    } catch (error) {
      console.error('❌ Error refreshing auth state:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      const { user, session, error } = await AuthService.signIn(email, password);
      
      if (error) {
        return { error: error.message };
      }
      
      // FIXED: Immediately update the context state after successful login
      setUser(user);
      setSession(session);
      
      // FIXED: Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      console.log('✅ Sign in successful, context updated immediately');
      
      return {};
    } catch (error) {
      console.error('Context signIn error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'critique';
    avatar_id?: number;
  }): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      const { user, session, error } = await AuthService.signUp(userData);
      
      if (error) {
        return { error: error.message };
      }
      
      // FIXED: Immediately update the context state after successful signup
      setUser(user);
      setSession(session);
      
      // FIXED: Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      console.log('✅ Sign up successful, context updated immediately');
      
      return {};
    } catch (error) {
      console.error('Context signUp error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await AuthService.signOut();
      
      // FIXED: Immediately clear context state
      setUser(null);
      setSession(null);
      
      // FIXED: Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      console.log('✅ Sign out successful, context cleared immediately');
    } catch (error) {
      console.error('Context signOut error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ error?: string }> => {
    try {
      const { error } = await AuthService.updateProfile(updates);
      
      if (error) {
        return { error: error.message };
      }

      // FIXED: Refresh auth state to get updated user data
      refreshAuth();
      
      return {};
    } catch (error) {
      console.error('Context updateProfile error:', error);
      return { error: error instanceof Error ? error.message : 'Update failed' };
    }
  };

  // Computed values
  const isAuthenticated = !!user && !!session;
  const isAdmin = user?.role === 'admin';
  const isCritique = user?.role === 'critique';
  const isPremium = user?.is_premium && user?.premium_until ? new Date(user.premium_until) > new Date() : false;

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    isAdmin,
    isCritique,
    isPremium,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};