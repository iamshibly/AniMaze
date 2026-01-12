// src/lib/adminServices.ts - Fixed admin services with proper types
import type { User } from '@/lib/auth'; // Fixed import path

// Fixed AdminUserStatus interface
export interface AdminUserStatus {
  is_suspended: boolean;
  is_banned: boolean;
  warnings: number;
  suspension_end?: string; // Fixed from suspension_until
  ban_reason?: string;
  suspension_reason?: string;
  last_warning_date?: string;
}

// Fixed AdminManagedUser interface with all required properties
export interface AdminManagedUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'critique';
  avatar_url?: string;
  is_premium: boolean;
  premium_until?: string;
  xp: number;
  level: number;
  created_at: string;
  last_login_at?: string;
  admin_status: AdminUserStatus;
  activity_stats: {
    total_quizzes_taken: number;
    total_score: number;
    average_score: number;
    streak_days: number;
    submissions_count: number;
    reviews_count: number;
    total_logins: number;
    last_login_at?: string;
    anime_watched: number;
    manga_read: number;
    quiz_participations: number; // FIXED: Added missing property
    comments_made: number; // FIXED: Added missing property
    reports_received: number; // FIXED: Added missing property
    reviews_submitted?: number; // FIXED: Added missing property for critique users
  };
  subscription_info: {
    subscription_type: 'free' | 'premium' | 'premium_plus' | 'Free' | 'Bronze' | 'Silver' | 'Gold' | 'Premium';
    auto_renewal: boolean;
    payment_method?: string;
    subscription_start?: string;
    total_spent?: number;
  };
}

// Storage keys
const ADMIN_STATUS_KEY = 'anime_quiz_admin_status';
const USERS_KEY = 'anime_quiz_users';

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Admin notification templates
export const ADMIN_NOTIFICATION_TEMPLATES = {
  platform_update: {
    title: 'Platform Update',
    message: 'New features and improvements have been added to the platform.'
  },
  maintenance: {
    title: 'Scheduled Maintenance',
    message: 'The platform will undergo maintenance. Please save your work.'
  },
  policy_update: {
    title: 'Policy Update',
    message: 'Our terms of service and privacy policy have been updated.'
  },
  feature_announcement: {
    title: 'New Feature',
    message: 'Exciting new features are now available!'
  },
  security_alert: {
    title: 'Security Alert',
    message: 'Important security information for your account.'
  }
} as const;

// Get admin status for a user
export const getAdminStatus = (userId: string): AdminUserStatus => {
  const adminStatuses = getFromStorage<Record<string, AdminUserStatus>>(ADMIN_STATUS_KEY, {});
  
  return adminStatuses[userId] || {
    is_suspended: false,
    is_banned: false,
    warnings: 0
  };
};

// Update admin status for a user
export const updateAdminStatus = (userId: string, status: Partial<AdminUserStatus>): void => {
  const adminStatuses = getFromStorage<Record<string, AdminUserStatus>>(ADMIN_STATUS_KEY, {});
  
  adminStatuses[userId] = {
    ...getAdminStatus(userId),
    ...status
  };
  
  saveToStorage(ADMIN_STATUS_KEY, adminStatuses);
};

// Convert User to AdminManagedUser with proper typing
export const getUserWithAdminStatus = (user: User): AdminManagedUser => {
  const adminStatus = getAdminStatus(user.id);
  
  // Generate subscription type based on premium status
  const getSubscriptionType = () => {
    if (user.is_premium) {
      const subscriptionTypes = ['Bronze', 'Silver', 'Gold', 'Premium'];
      return subscriptionTypes[Math.floor(Math.random() * subscriptionTypes.length)] as 'Bronze' | 'Silver' | 'Gold' | 'Premium';
    }
    return 'Free' as const;
  };

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar_url: user.avatar_url,
    is_premium: user.is_premium || false,
    premium_until: user.premium_until,
    xp: user.xp || 0,
    level: user.level || 1,
    created_at: user.created_at,
    last_login_at: user.last_login_at,
    admin_status: adminStatus,
    activity_stats: {
      total_quizzes_taken: Math.floor(Math.random() * 100),
      total_score: Math.floor(Math.random() * 10000),
      average_score: Math.floor(Math.random() * 100),
      streak_days: Math.floor(Math.random() * 30),
      submissions_count: Math.floor(Math.random() * 20),
      reviews_count: Math.floor(Math.random() * 50),
      total_logins: Math.floor(Math.random() * 200) + 10,
      last_login_at: user.last_login_at,
      anime_watched: Math.floor(Math.random() * 100),
      manga_read: Math.floor(Math.random() * 50),
      quiz_participations: Math.floor(Math.random() * 100), // FIXED: Added missing property
      comments_made: Math.floor(Math.random() * 200), // FIXED: Added missing property
      reports_received: Math.floor(Math.random() * 5), // FIXED: Added missing property
      reviews_submitted: user.role === 'critique' ? Math.floor(Math.random() * 30) : undefined // FIXED: Added missing property
    },
    subscription_info: {
      subscription_type: getSubscriptionType(),
      auto_renewal: user.is_premium || false,
      subscription_start: user.is_premium ? user.created_at : undefined,
      total_spent: user.is_premium ? Math.floor(Math.random() * 5000) + 500 : undefined
    }
  };
};

// AdminService class with all methods
export class AdminServiceClass {
  // Get all users with admin status
  getAllManagedUsers(): AdminManagedUser[] {
    const users = getFromStorage<User[]>(USERS_KEY, []);
    return users.map(getUserWithAdminStatus);
  }

  // Send notification to specific user
  async sendNotificationToUser(userId: string, type: keyof typeof ADMIN_NOTIFICATION_TEMPLATES, customMessage?: string): Promise<void> {
    const template = ADMIN_NOTIFICATION_TEMPLATES[type];
    const message = customMessage || template.message;
    
    // In a real app, this would send via API
    console.log(`📧 Sending notification to ${userId}:`, { title: template.title, message });
  }

  // Warn user
  async warnUser(userId: string, reason: string): Promise<void> {
    const currentStatus = getAdminStatus(userId);
    updateAdminStatus(userId, {
      warnings: currentStatus.warnings + 1,
      last_warning_date: new Date().toISOString()
    });

    await this.sendNotificationToUser(
      userId, 
      'security_alert', 
      `You have received a warning. Reason: ${reason}`
    );
    
    console.log(`⚠️ User ${userId} warned: ${reason}`);
  }

  // Suspend user
  async suspendUser(userId: string, reason: string, days: number = 7): Promise<void> {
    const suspensionEnd = new Date();
    suspensionEnd.setDate(suspensionEnd.getDate() + days);
    
    updateAdminStatus(userId, {
      is_suspended: true,
      suspension_end: suspensionEnd.toISOString(), // FIXED: Using suspension_end instead of suspension_until
      suspension_reason: reason
    });

    await this.sendNotificationToUser(
      userId, 
      'security_alert', 
      `Your account has been suspended for ${days} days. Reason: ${reason}`
    );
    
    console.log(`🚫 User ${userId} suspended for ${days} days`);
  }

  // Ban user
  async banUser(userId: string, reason: string): Promise<void> {
    updateAdminStatus(userId, {
      is_banned: true,
      ban_reason: reason
    });

    await this.sendNotificationToUser(
      userId, 
      'security_alert', 
      `Your account has been permanently banned. Reason: ${reason}`
    );
    
    console.log(`⛔ User ${userId} banned permanently`);
  }

  // Restore user account
  async restoreUser(userId: string): Promise<void> {
    updateAdminStatus(userId, {
      is_suspended: false,
      is_banned: false,
      suspension_end: undefined,
      suspension_reason: undefined,
      ban_reason: undefined
    });

    await this.sendNotificationToUser(
      userId, 
      'platform_update', 
      'Your account has been restored and you can now access all features.'
    );
    
    console.log(`✅ User ${userId} account restored`);
  }

  // Get user statistics
  getUserStatistics(): {
    total: number;
    active: number;
    suspended: number;
    banned: number;
    premium: number;
  } {
    const users = this.getAllManagedUsers();
    
    return {
      total: users.length,
      active: users.filter(u => !u.admin_status.is_suspended && !u.admin_status.is_banned).length,
      suspended: users.filter(u => u.admin_status.is_suspended).length,
      banned: users.filter(u => u.admin_status.is_banned).length,
      premium: users.filter(u => u.is_premium).length
    };
  }

  // Send bulk notification
  async sendBulkNotifications(
    userIds: string[], 
    type: keyof typeof ADMIN_NOTIFICATION_TEMPLATES, 
    customMessage?: string
  ): Promise<void> {
    const promises = userIds.map(userId => 
      this.sendNotificationToUser(userId, type, customMessage)
    );
    
    await Promise.all(promises);
    console.log(`📧 Bulk notification sent to ${userIds.length} users`);
  }
}

// Export singleton instance
export const AdminService = new AdminServiceClass();