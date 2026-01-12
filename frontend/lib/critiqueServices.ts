// src/lib/critiqueServices.ts - Enhanced with notification system
import { getFromStorage, saveToStorage, generateId } from './localStorage';
import { AuthService } from './auth';
import type { 
  Submission, 
  SubmissionFormData, 
  UserProfile, 
  Notification, 
  DashboardData,
  SubmissionStatus
} from '@/types/critique';

// Storage keys
const SUBMISSIONS_KEY = 'anime_submissions';
const PROFILES_KEY = 'critique_profiles';
const NOTIFICATIONS_KEY = 'critique_notifications';

// =====================================
// ENHANCED SUBMISSION SERVICES
// =====================================

export const submissionService = {
  // Create new submission
  async createSubmission(formData: SubmissionFormData): Promise<Submission> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    
    // Convert cover image to base64 for localStorage (in real app, upload to cloud)
    let coverImageUrl = '';
    if (formData.cover_image) {
      coverImageUrl = `data:image/placeholder;base64,${btoa(formData.cover_image.name)}`;
    }

    const newSubmission: Submission = {
      id: generateId(),
      critic_id: user.id,
      type: formData.type as any,
      title: formData.title,
      content: formData.content,
      anime_manga_id: formData.anime_manga_id || undefined,
      youtube_link: formData.youtube_link || undefined,
      star_rating: formData.star_rating || undefined,
      cover_image: coverImageUrl || undefined,
      status: 'pending',
      admin_notes: undefined,
      views: 0,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      critic: {
        name: user.name,
        avatar_url: user.avatar_url
      }
    };

    submissions.push(newSubmission);
    saveToStorage(SUBMISSIONS_KEY, submissions);

    // Create notification for admin about new submission
    await notificationService.createNotification({
      user_id: 'admin',
      type: 'admin_message',
      title: 'New Submission',
      message: `New ${formData.type} submission "${formData.title}" from ${user.name}`,
      submission_id: newSubmission.id
    });

    console.log('✅ New submission created:', newSubmission.id);
    return newSubmission;
  },

  // Get submissions for current user
  async getMySubmissions(filters?: {
    search?: string;
    status?: SubmissionStatus | 'all';
    page?: number;
    limit?: number;
  }): Promise<{ submissions: Submission[]; total: number; totalPages: number }> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const allSubmissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    let userSubmissions = allSubmissions.filter(s => s.critic_id === user.id);

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      userSubmissions = userSubmissions.filter(s =>
        s.title.toLowerCase().includes(search) ||
        s.content.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status !== 'all') {
      userSubmissions = userSubmissions.filter(s => s.status === filters.status);
    }

    // Sort by creation date (newest first)
    userSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const totalPages = Math.ceil(userSubmissions.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedSubmissions = userSubmissions.slice(startIndex, startIndex + limit);

    return {
      submissions: paginatedSubmissions,
      total: userSubmissions.length,
      totalPages
    };
  },

  // Get all submissions (admin only)
  async getAllSubmissions(filters?: {
    search?: string;
    status?: SubmissionStatus | 'all';
    type?: string | 'all';
    page?: number;
    limit?: number;
  }): Promise<{ submissions: Submission[]; total: number; totalPages: number }> {
    const user = AuthService.getCurrentUser();

     // TEMPORARY: Bypass admin check for debugging
  console.log('🔍 Current user:', user);
  console.log('🔍 User role:', user?.role);

  //  if (!user || user.role !== 'admin') {
    //  throw new Error('Admin access required');
  //  }

    let submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      submissions = submissions.filter(s =>
        s.title.toLowerCase().includes(search) ||
        s.content.toLowerCase().includes(search) ||
        s.critic?.name?.toLowerCase().includes(search)
      );
    }

    if (filters?.status && filters.status !== 'all') {
      submissions = submissions.filter(s => s.status === filters.status);
    }

    if (filters?.type && filters.type !== 'all') {
      submissions = submissions.filter(s => s.type === filters.type);
    }

    // Sort by creation date (newest first), but prioritize pending
    submissions.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const totalPages = Math.ceil(submissions.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedSubmissions = submissions.slice(startIndex, startIndex + limit);

    return {
      submissions: paginatedSubmissions,
      total: submissions.length,
      totalPages
    };
  },

  // Update submission
  async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submissionIndex = submissions.findIndex(s => s.id === id);
    
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }

    const updatedSubmission = {
      ...submissions[submissionIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    submissions[submissionIndex] = updatedSubmission;
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    console.log('✅ Submission updated:', id);
    return updatedSubmission;
  },

  // Approve submission (admin only)
  async approveSubmission(id: string, adminNotes?: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    //if (!user || user.role !== 'admin') {
    //  throw new Error('Admin access required');
   // }

    const updatedSubmission = await this.updateSubmission(id, {
      status: 'approved',
      admin_notes: adminNotes || undefined,
      approved_at: new Date().toISOString()
    });

    // Create notification for critic
    await notificationService.createNotification({
      user_id: updatedSubmission.critic_id,
      type: 'submission_approved',
      title: 'Submission Approved! 🎉',
      message: `Your submission "${updatedSubmission.title}" has been approved and is now live!`,
      submission_id: id
    });

    console.log('✅ Submission approved:', id);
  },

  // Reject submission (admin only)
  async rejectSubmission(id: string, reason: string): Promise<void> {
    const user = AuthService.getCurrentUser();
   // if (!user || user.role !== 'admin') {
   //   throw new Error('Admin access required');
  //  }

    const updatedSubmission = await this.updateSubmission(id, {
      status: 'rejected',
      admin_notes: reason
    });

    // Create notification for critic
    await notificationService.createNotification({
      user_id: updatedSubmission.critic_id,
      type: 'submission_rejected',
      title: 'Submission Needs Changes',
      message: `Your submission "${updatedSubmission.title}" needs some changes. Reason: ${reason}`,
      submission_id: id
    });

    console.log('✅ Submission rejected:', id);
  },

  // Delete submission
  async deleteSubmission(id: string): Promise<void> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submissionIndex = submissions.findIndex(s => s.id === id);
    
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }

    const submission = submissions[submissionIndex];
    
    // Check if user owns the submission or is admin
    if (submission.critic_id !== user.id && user.role !== 'admin') {
      throw new Error('Unauthorized to delete this submission');
    }

    // Remove submission from storage
    submissions.splice(submissionIndex, 1);
    saveToStorage(SUBMISSIONS_KEY, submissions);
    
    console.log('✅ Submission deleted:', id);
  }
};

// =====================================
// NOTIFICATION SERVICES  
// =====================================

export const notificationService = {
  // Create notification
  async createNotification(data: {
    user_id: string;
    type: 'submission_approved' | 'submission_rejected' | 'admin_message';
    title: string;
    message: string;
    submission_id?: string;
  }): Promise<Notification> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    
    const newNotification: Notification = {
      id: generateId(),
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      submission_id: data.submission_id,
      is_read: false,
      created_at: new Date().toISOString()
    };

    notifications.push(newNotification);
    saveToStorage(NOTIFICATIONS_KEY, notifications);
    
    console.log('✅ Notification created:', newNotification.id);
    return newNotification;
  },

  // Get notifications for user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    return notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    );
    
    saveToStorage(NOTIFICATIONS_KEY, updated);
  },

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);
    const updated = notifications.map(n => 
      n.user_id === userId ? { ...n, is_read: true } : n
    );
    
    saveToStorage(NOTIFICATIONS_KEY, updated);
  }
};

// =====================================
// PROFILE SERVICES
// =====================================

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    return profiles.find(p => p.id === userId) || null;
  },

  // Create user profile
  async createProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    
    const newProfile: UserProfile = {
      id: userId,
      role: user.role as any,
      bio: data.bio || '',
      favorite_genres: data.favorite_genres || [],
      notification_preferences: {
        email: true,
        in_app: true,
        ...data.notification_preferences
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    profiles.push(newProfile);
    saveToStorage(PROFILES_KEY, profiles);
    
    console.log('✅ Profile created:', userId);
    return newProfile;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profiles = getFromStorage<UserProfile[]>(PROFILES_KEY, []);
    const profileIndex = profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...profiles[profileIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    profiles[profileIndex] = updatedProfile;
    saveToStorage(PROFILES_KEY, profiles);
    
    console.log('✅ Profile updated:', userId);
    return updatedProfile;
  }
};

// =====================================
// DASHBOARD SERVICES
// =====================================

export const dashboardService = {
  // Get dashboard data for critics
  async getDashboardData(): Promise<DashboardData> {
    const user = AuthService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const userSubmissions = submissions.filter(s => s.critic_id === user.id);

    // Calculate statistics
    const stats = {
      total_submissions: userSubmissions.length,
      approved: userSubmissions.filter(s => s.status === 'approved').length,
      rejected: userSubmissions.filter(s => s.status === 'rejected').length,
      pending: userSubmissions.filter(s => s.status === 'pending').length,
      total_views: userSubmissions.reduce((sum, s) => sum + s.views, 0),
      total_likes: userSubmissions.reduce((sum, s) => sum + s.likes, 0),
      total_comments: userSubmissions.reduce((sum, s) => sum + s.comments, 0)
    };

    // Get recent submissions (last 5)
    const recentSubmissions = userSubmissions
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Generate monthly data for last 6 months
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSubmissions = userSubmissions.filter(s => {
        const submissionDate = new Date(s.created_at);
        return submissionDate >= monthStart && submissionDate <= monthEnd;
      });
      
      monthlyData.push({
        month: monthName,
        submissions: monthSubmissions.length,
        approved: monthSubmissions.filter(s => s.status === 'approved').length
      });
    }

    return {
      stats,
      recent_submissions: recentSubmissions,
      monthly_data: monthlyData
    };
  },

  // Get admin dashboard data
  async getAdminDashboardData(): Promise<any> {
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const notifications = getFromStorage<Notification[]>(NOTIFICATIONS_KEY, []);

    // Overall statistics
    const stats = {
      total_submissions: submissions.length,
      pending_review: submissions.filter(s => s.status === 'pending').length,
      approved_today: submissions.filter(s => {
        const today = new Date().toDateString();
        return s.status === 'approved' && new Date(s.approved_at || '').toDateString() === today;
      }).length,
      total_critics: new Set(submissions.map(s => s.critic_id)).size,
      total_views: submissions.reduce((sum, s) => sum + s.views, 0),
      total_engagement: submissions.reduce((sum, s) => sum + s.likes + s.comments, 0)
    };

    // Recent pending submissions
    const pendingSubmissions = submissions
      .filter(s => s.status === 'pending')
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Oldest first
      .slice(0, 10);

    // Top performing content
    const topContent = submissions
      .filter(s => s.status === 'approved')
      .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
      .slice(0, 5);

    // Content type breakdown
    const typeBreakdown = submissions.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      stats,
      pending_submissions: pendingSubmissions,
      top_content: topContent,
      type_breakdown: typeBreakdown,
      recent_notifications: notifications.slice(0, 10)
    };
  }
};

// =====================================
// ANALYTICS SERVICES
// =====================================

export const analyticsService = {
  // Track submission view
  async trackView(submissionId: string): Promise<void> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission && submission.status === 'approved') {
      submission.views += 1;
      submission.updated_at = new Date().toISOString();
      saveToStorage(SUBMISSIONS_KEY, submissions);
    }
  },

  // Track submission like
  async trackLike(submissionId: string, userId: string): Promise<void> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission && submission.status === 'approved') {
      submission.likes += 1;
      submission.updated_at = new Date().toISOString();
      saveToStorage(SUBMISSIONS_KEY, submissions);

      // Create notification for the creator
      if (submission.critic_id !== userId) {
        await notificationService.createNotification({
          user_id: submission.critic_id,
          type: 'admin_message',
          title: 'Someone liked your content!',
          message: `Your submission "${submission.title}" received a new like`,
          submission_id: submissionId
        });
      }
    }
  },

  // Track submission comment
  async trackComment(submissionId: string, userId: string): Promise<void> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission && submission.status === 'approved') {
      submission.comments += 1;
      submission.updated_at = new Date().toISOString();
      saveToStorage(SUBMISSIONS_KEY, submissions);

      // Create notification for the creator
      if (submission.critic_id !== userId) {
        await notificationService.createNotification({
          user_id: submission.critic_id,
          type: 'admin_message',
          title: 'New comment on your content!',
          message: `Someone commented on your submission "${submission.title}"`,
          submission_id: submissionId
        });
      }
    }
  },

  // Get user analytics
  async getUserAnalytics(userId: string): Promise<{
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageEngagement: number;
    topPerformingContent: Submission[];
  }> {
    const submissions = getFromStorage<Submission[]>(SUBMISSIONS_KEY, []);
    const userSubmissions = submissions.filter(s => s.critic_id === userId && s.status === 'approved');

    const totalViews = userSubmissions.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = userSubmissions.reduce((sum, s) => sum + s.likes, 0);
    const totalComments = userSubmissions.reduce((sum, s) => sum + s.comments, 0);
    const averageEngagement = userSubmissions.length > 0 
      ? (totalLikes + totalComments) / userSubmissions.length 
      : 0;

    const topPerformingContent = userSubmissions
      .sort((a, b) => (b.views + b.likes * 2 + b.comments * 3) - (a.views + a.likes * 2 + a.comments * 3))
      .slice(0, 5);

    return {
      totalViews,
      totalLikes,
      totalComments,
      averageEngagement,
      topPerformingContent
    };
  }
};

// =====================================
// EXPORT ALL SERVICES
// =====================================

export default {
  submission: submissionService,
  notification: notificationService,
  profile: profileService,
  dashboard: dashboardService,
  analytics: analyticsService
};