// src/lib/auth.ts - Updated with Account Approval System

import { generateId, hashPassword, verifyPassword, generateToken } from './utils/crypto';

// UPDATED: Added account_status to User interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_id: number;
  avatar_url: string;
  role: 'user' | 'admin' | 'critique';
  is_premium: boolean;
  premium_until: string;
  xp: number;
  level: number;
  created_at: string;
  last_login_at?: string;
  // NEW: Account approval status
  account_status: 'pending' | 'approved' | 'rejected';
  approval_date?: string;
  approved_by?: string;
  rejection_reason?: string;
}

export interface AuthSession {
  access_token: string;
  user: User;
  expires_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  user: User | null;
  session: AuthSession | null;
  error: AuthError | null;
}

// Storage keys
const USERS_KEY = 'anime_quiz_users';
const CURRENT_USER_KEY = 'anime_quiz_current_user';
const SESSION_KEY = 'anime_quiz_session';

const dispatchAuthStateChange = () => {
  window.dispatchEvent(new CustomEvent('auth-state-changed'));
};

// Storage utilities
class AuthStorage {
  private static getUsers(): Array<User & { password: string }> {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  }

  private static saveUsers(users: Array<User & { password: string }>): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  }

  static setCurrentUser(user: User | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      dispatchAuthStateChange();
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  static getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading session:', error);
      return null;
    }
  }

  static setSession(session: AuthSession | null): void {
    try {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
      dispatchAuthStateChange();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(SESSION_KEY);
      dispatchAuthStateChange();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  static findUserByEmail(email: string): (User & { password: string }) | null {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static findUserById(id: string): (User & { password: string }) | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static addUser(user: User & { password: string }): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  static updateUser(id: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return false;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser({ ...currentUser, ...updates });
    }
    
    return true;
  }

  static deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) return false;
    
    this.saveUsers(filteredUsers);
    
    // Clear session if deleting current user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.clearSession();
    }
    
    return true;
  }

  static getAllUsers(): User[] {
    return this.getUsers().map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

// Auth service class
export class AuthService {
  // Initialize with default admin user
  static initialize(): void {
    const users = AuthStorage.getAllUsers();
    
    if (users.length === 0) {
      console.log('🔧 Initializing authentication system with default admin user...');
      
      const adminUser: User & { password: string } = {
        id: generateId(),
        email: 'admin@animequiz.com',
        name: 'Administrator',
        avatar_id: 1,
        avatar_url: '/avatars/avatar-1.png',
        role: 'admin',
        is_premium: true,
        premium_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 10000,
        level: 50,
        created_at: new Date().toISOString(),
        // Admin accounts are automatically approved
        account_status: 'approved',
        approval_date: new Date().toISOString(),
        password: hashPassword('admin123')
      };
      
      AuthStorage.addUser(adminUser);
      console.log('✅ Default admin user created: admin@animequiz.com / admin123');
    }
  }

  // UPDATED: Sign up new user - accounts now require approval
  static async signUp(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'critique';
    avatar_id?: number;
  }): Promise<AuthResponse> {
    try {
      const { name, email, password, role = 'user', avatar_id = 1 } = userData;

      // Validation
      if (!name || !email || !password) {
        return {
          user: null,
          session: null,
          error: { message: 'All fields are required' }
        };
      }

      if (password.length < 6) {
        return {
          user: null,
          session: null,
          error: { message: 'Password must be at least 6 characters long' }
        };
      }

      // Check if user already exists
      if (AuthStorage.findUserByEmail(email)) {
        return {
          user: null,
          session: null,
          error: { message: 'An account with this email already exists' }
        };
      }

      // UPDATED: Create new user with pending status
      const user: User = {
        id: generateId(),
        email: email.toLowerCase(),
        name,
        avatar_id,
        avatar_url: `/avatars/avatar-${avatar_id}.png`,
        role,
        is_premium: role === 'critique' ? true : false,
        premium_until: new Date(Date.now() + (role === 'critique' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
        // NEW: Set account status to pending for approval
        account_status: 'pending'
      };

      // Store user with hashed password
      AuthStorage.addUser({ ...user, password: hashPassword(password) });

      console.log('✅ User registration successful (pending approval):', user.email);

      // Return success but no session (user cannot login yet)
      return {
        user,
        session: null,
        error: null
      };

    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        user: null,
        session: null,
        error: { 
          message: error instanceof Error ? error.message : 'Registration failed. Please try again.'
        }
      };
    }
  }

  // UPDATED: Sign in existing user - check account approval status
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validation
      if (!email || !password) {
        return {
          user: null,
          session: null,
          error: { message: 'Email and password are required' }
        };
      }

      // Find user
      const storedUser = AuthStorage.findUserByEmail(email);
      if (!storedUser) {
        return {
          user: null,
          session: null,
          error: { message: 'Invalid email or password' }
        };
      }

      // Verify password
      if (!verifyPassword(password, storedUser.password)) {
        return {
          user: null,
          session: null,
          error: { message: 'Invalid email or password' }
        };
      }

      // NEW: Check account approval status
      if (storedUser.account_status === 'pending') {
        return {
          user: null,
          session: null,
          error: { 
            message: 'Your account is pending approval. Please wait for admin approval.',
            code: 'ACCOUNT_PENDING'
          }
        };
      }

      if (storedUser.account_status === 'rejected') {
        return {
          user: null,
          session: null,
          error: { 
            message: `Your account has been rejected. ${storedUser.rejection_reason || ''}`,
            code: 'ACCOUNT_REJECTED'
          }
        };
      }

      // Only approved users can proceed
      if (storedUser.account_status !== 'approved') {
        return {
          user: null,
          session: null,
          error: { message: 'Account access denied.' }
        };
      }

      // Update last login
      const updatedUser: User = {
        ...storedUser,
        last_login_at: new Date().toISOString()
      };
      delete (updatedUser as any).password; // Remove password from user object

      AuthStorage.updateUser(updatedUser.id, { last_login_at: updatedUser.last_login_at });

      // Create session
      const session: AuthSession = {
        access_token: generateToken(),
        user: updatedUser,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      // Set current session
      AuthStorage.setCurrentUser(updatedUser);
      AuthStorage.setSession(session);

      console.log('✅ User login successful:', updatedUser.email);

      return {
        user: updatedUser,
        session,
        error: null
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        user: null,
        session: null,
        error: { 
          message: error instanceof Error ? error.message : 'Login failed. Please try again.'
        }
      };
    }
  }

  // FIXED: Admin function to approve user account
  static async approveUser(userId: string, adminId: string): Promise<boolean> {
    console.log('🔍 Attempting to approve user:', userId, 'by admin:', adminId);
    
    // Check if admin exists in real user storage
    let isValidAdmin = false;
    let adminIdentifier = adminId;
    
    const realAdminUser = AuthStorage.findUserById(adminId);
    if (realAdminUser && realAdminUser.role === 'admin') {
      isValidAdmin = true;
      adminIdentifier = realAdminUser.id;
      console.log('✅ Real admin user validated:', realAdminUser.email);
    } else {
      // Check localStorage for demo admin
      console.log('🔍 Checking localStorage for demo admin session...');
      const storedAdmin = localStorage.getItem('adminUser');
      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);
        console.log('📝 Found localStorage admin:', parsedAdmin);
        
        // FIXED: Check for all possible admin role variations
        const isAdminRole = parsedAdmin.role && (
          parsedAdmin.role === 'Super Admin' ||
          parsedAdmin.role === 'Content Manager' ||
          parsedAdmin.role === 'Moderator' ||
          parsedAdmin.role === 'Administrator' ||
          parsedAdmin.role === 'admin' ||
          parsedAdmin.role.toLowerCase().includes('admin') ||
          parsedAdmin.role.toLowerCase().includes('moderator')
        );
        
        console.log('🔐 Admin role check result:', isAdminRole, 'for role:', parsedAdmin.role);
        
        if (isAdminRole && parsedAdmin.email) {
          isValidAdmin = true;
          adminIdentifier = parsedAdmin.email;
          console.log('✅ Demo admin validated:', parsedAdmin.email);
        }
      } else {
        console.log('❌ No admin session found in localStorage');
      }
    }
    
    if (!isValidAdmin) {
      console.error('❌ No valid admin user found for approval');
      return false;
    }

    console.log('🚀 Proceeding with approval using admin:', adminIdentifier);
    
    try {
      const success = AuthStorage.updateUser(userId, {
        account_status: 'approved',
        approval_date: new Date().toISOString(),
        approved_by: adminIdentifier
      });

      if (success) {
        console.log('✅ User approved successfully:', userId, 'by admin:', adminIdentifier);
      } else {
        console.error('❌ Failed to update user status in storage');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error during user approval:', error);
      return false;
    }
  }

  // FIXED: Admin function to reject user account
  static async rejectUser(userId: string, adminId: string, reason?: string): Promise<boolean> {
    console.log('🔍 Attempting to reject user:', userId, 'by admin:', adminId);
    
    // Check if admin exists in real user storage
    let isValidAdmin = false;
    let adminIdentifier = adminId;
    
    const realAdminUser = AuthStorage.findUserById(adminId);
    if (realAdminUser && realAdminUser.role === 'admin') {
      isValidAdmin = true;
      adminIdentifier = realAdminUser.id;
      console.log('✅ Real admin user validated:', realAdminUser.email);
    } else {
      // Check localStorage for demo admin
      console.log('🔍 Checking localStorage for demo admin session...');
      const storedAdmin = localStorage.getItem('adminUser');
      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);
        console.log('📝 Found localStorage admin:', parsedAdmin);
        
        // FIXED: Check for all possible admin role variations
        const isAdminRole = parsedAdmin.role && (
          parsedAdmin.role === 'Super Admin' ||
          parsedAdmin.role === 'Content Manager' ||
          parsedAdmin.role === 'Moderator' ||
          parsedAdmin.role === 'Administrator' ||
          parsedAdmin.role === 'admin' ||
          parsedAdmin.role.toLowerCase().includes('admin') ||
          parsedAdmin.role.toLowerCase().includes('moderator')
        );
        
        console.log('🔐 Admin role check result:', isAdminRole, 'for role:', parsedAdmin.role);
        
        if (isAdminRole && parsedAdmin.email) {
          isValidAdmin = true;
          adminIdentifier = parsedAdmin.email;
          console.log('✅ Demo admin validated:', parsedAdmin.email);
        }
      } else {
        console.log('❌ No admin session found in localStorage');
      }
    }
    
    if (!isValidAdmin) {
      console.error('❌ No valid admin user found for rejection');
      return false;
    }

    console.log('🚀 Proceeding with rejection using admin:', adminIdentifier);
    
    try {
      const success = AuthStorage.updateUser(userId, {
        account_status: 'rejected',
        rejection_reason: reason || 'Account rejected by admin'
      });

      if (success) {
        console.log('❌ User rejected successfully:', userId, 'by admin:', adminIdentifier);
      } else {
        console.error('❌ Failed to update user status in storage');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Error during user rejection:', error);
      return false;
    }
  }

  // NEW: Get pending users for admin approval
  static getPendingUsers(): User[] {
    return AuthStorage.getAllUsers().filter(user => user.account_status === 'pending');
  }

  // Get current user
  static getCurrentUser(): User | null {
    return AuthStorage.getCurrentUser();
  }

  // Get current session
  static getCurrentSession(): AuthSession | null {
    return AuthStorage.getSession();
  }

  // Sign out
  static signOut(): void {
    AuthStorage.clearSession();
    console.log('✅ User signed out');
  }

  // Get all users (admin only)
  static getAllUsers(): User[] {
    return AuthStorage.getAllUsers();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const session = AuthStorage.getSession();
    if (!session) return false;
    
    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      AuthStorage.clearSession();
      return false;
    }
    
    return true;
  }

  // Check if current user is admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || false;
  }
}

export default AuthService;