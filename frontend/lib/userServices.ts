// src/lib/userServices.ts - User progress and interaction services - FIXED export conflicts
import { AuthService } from './auth';

// =====================================
// TYPE DEFINITIONS
// =====================================

export interface UserProgress {
  user_id: string;
  anime_progress: AnimeProgress[];
  manga_progress: MangaProgress[];
  watchlist: string[];
  bookmarks: string[];
  created_at: string;
  updated_at: string;
}

export interface AnimeProgress {
  anime_id: string;
  episodes_watched: number;
  total_episodes: number;
  current_episode: number;
  watch_time: number; // in seconds
  last_watched_at: string;
  status: 'watching' | 'completed' | 'paused' | 'dropped';
  rating?: number; // 1-5 stars
}

export interface MangaProgress {
  manga_id: string;
  chapters_read: number;
  total_chapters: number;
  current_chapter: number;
  current_page: number;
  last_read_at: string;
  status: 'reading' | 'completed' | 'paused' | 'dropped';
  rating?: number; // 1-5 stars
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: 'premium_purchased' | 'quiz_achievement' | 'platform_update' | 'subscription_reminder' | 'system_notice';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any; // Additional data for the notification
}

export interface UserStats {
  total_watch_time: number; // in minutes
  anime_episodes_watched: number;
  manga_pages_read: number;
  quizzes_completed: number;
  total_xp: number;
  level: number;
  premium_status: boolean;
  premium_days_remaining?: number;
}

// =====================================
// STORAGE UTILITIES
// =====================================

// Storage keys
const USER_PROGRESS_KEY = 'anime_user_progress';
const USER_NOTIFICATIONS_KEY = 'anime_user_notifications';
const USER_STATS_KEY = 'anime_user_stats';

// Utility functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
};

// =====================================
// USER PROGRESS SERVICE
// =====================================

export const UserProgressService = {
  // Get user progress
  getUserProgress: (userId?: string): UserProgress | null => {
    const currentUser = AuthService.getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) return null;
    
    const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
    return allProgress[targetUserId] || null;
  },

  // Initialize progress for new user
  initializeUserProgress: (userId: string): UserProgress => {
    const progress: UserProgress = {
      user_id: userId,
      anime_progress: [],
      manga_progress: [],
      watchlist: [],
      bookmarks: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
    allProgress[userId] = progress;
    saveToStorage(USER_PROGRESS_KEY, allProgress);
    
    return progress;
  },

  // Update anime progress
  updateAnimeProgress: (animeId: string, progressData: Partial<AnimeProgress>): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) {
        userProgress = UserProgressService.initializeUserProgress(currentUser.id);
      }

      const existingIndex = userProgress.anime_progress.findIndex(p => p.anime_id === animeId);
      
      if (existingIndex >= 0) {
        userProgress.anime_progress[existingIndex] = {
          ...userProgress.anime_progress[existingIndex],
          ...progressData,
          last_watched_at: new Date().toISOString()
        };
      } else {
        const newProgress: AnimeProgress = {
          anime_id: animeId,
          episodes_watched: progressData.episodes_watched || 0,
          total_episodes: progressData.total_episodes || 0,
          current_episode: progressData.current_episode || 1,
          watch_time: progressData.watch_time || 0,
          last_watched_at: new Date().toISOString(),
          status: progressData.status || 'watching',
          ...progressData
        };
        userProgress.anime_progress.push(newProgress);
      }

      userProgress.updated_at = new Date().toISOString();
      
      const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
      allProgress[currentUser.id] = userProgress;
      saveToStorage(USER_PROGRESS_KEY, allProgress);
      
      return true;
    } catch (error) {
      console.error('Error updating anime progress:', error);
      return false;
    }
  },

  // Update manga progress
  updateMangaProgress: (mangaId: string, progressData: Partial<MangaProgress>): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) {
        userProgress = UserProgressService.initializeUserProgress(currentUser.id);
      }

      const existingIndex = userProgress.manga_progress.findIndex(p => p.manga_id === mangaId);
      
      if (existingIndex >= 0) {
        userProgress.manga_progress[existingIndex] = {
          ...userProgress.manga_progress[existingIndex],
          ...progressData,
          last_read_at: new Date().toISOString()
        };
      } else {
        const newProgress: MangaProgress = {
          manga_id: mangaId,
          chapters_read: progressData.chapters_read || 0,
          total_chapters: progressData.total_chapters || 0,
          current_chapter: progressData.current_chapter || 1,
          current_page: progressData.current_page || 1,
          last_read_at: new Date().toISOString(),
          status: progressData.status || 'reading',
          ...progressData
        };
        userProgress.manga_progress.push(newProgress);
      }

      userProgress.updated_at = new Date().toISOString();
      
      const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
      allProgress[currentUser.id] = userProgress;
      saveToStorage(USER_PROGRESS_KEY, allProgress);
      
      return true;
    } catch (error) {
      console.error('Error updating manga progress:', error);
      return false;
    }
  },

  // Add to watchlist
  addToWatchlist: (contentId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) {
        userProgress = UserProgressService.initializeUserProgress(currentUser.id);
      }

      if (!userProgress.watchlist.includes(contentId)) {
        userProgress.watchlist.push(contentId);
        userProgress.updated_at = new Date().toISOString();
        
        const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
        allProgress[currentUser.id] = userProgress;
        saveToStorage(USER_PROGRESS_KEY, allProgress);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  },

  // Remove from watchlist
  removeFromWatchlist: (contentId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) return false;

      userProgress.watchlist = userProgress.watchlist.filter(id => id !== contentId);
      userProgress.updated_at = new Date().toISOString();
      
      const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
      allProgress[currentUser.id] = userProgress;
      saveToStorage(USER_PROGRESS_KEY, allProgress);
      
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  },

  // Add to bookmarks
  addToBookmarks: (contentId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) {
        userProgress = UserProgressService.initializeUserProgress(currentUser.id);
      }

      if (!userProgress.bookmarks.includes(contentId)) {
        userProgress.bookmarks.push(contentId);
        userProgress.updated_at = new Date().toISOString();
        
        const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
        allProgress[currentUser.id] = userProgress;
        saveToStorage(USER_PROGRESS_KEY, allProgress);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to bookmarks:', error);
      return false;
    }
  },

  // Remove from bookmarks
  removeFromBookmarks: (contentId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      let userProgress = UserProgressService.getUserProgress();
      if (!userProgress) return false;

      userProgress.bookmarks = userProgress.bookmarks.filter(id => id !== contentId);
      userProgress.updated_at = new Date().toISOString();
      
      const allProgress = getFromStorage<Record<string, UserProgress>>(USER_PROGRESS_KEY, {});
      allProgress[currentUser.id] = userProgress;
      saveToStorage(USER_PROGRESS_KEY, allProgress);
      
      return true;
    } catch (error) {
      console.error('Error removing from bookmarks:', error);
      return false;
    }
  }
};

// =====================================
// USER NOTIFICATION SERVICE
// =====================================

export const UserNotificationService = {
  // Get all notifications for user
  getUserNotifications: (userId?: string): UserNotification[] => {
    const currentUser = AuthService.getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) return [];
    
    const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
    return allNotifications[targetUserId] || [];
  },

  // Create notification
  createNotification: (notification: Omit<UserNotification, 'id' | 'created_at'>): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const newNotification: UserNotification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };

      const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
      if (!allNotifications[currentUser.id]) {
        allNotifications[currentUser.id] = [];
      }
      
      allNotifications[currentUser.id].unshift(newNotification);
      saveToStorage(USER_NOTIFICATIONS_KEY, allNotifications);
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  },

  // Delete notification
  deleteNotification: (notificationId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
      if (!allNotifications[currentUser.id]) return false;

      allNotifications[currentUser.id] = allNotifications[currentUser.id].filter(
        notif => notif.id !== notificationId
      );
      
      saveToStorage(USER_NOTIFICATIONS_KEY, allNotifications);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },

  // Clear all notifications
  clearAllNotifications: (): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
      allNotifications[currentUser.id] = [];
      
      saveToStorage(USER_NOTIFICATIONS_KEY, allNotifications);
      return true;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      return false;
    }
  },

  // Mark notification as read
  markAsRead: (notificationId: string): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
      if (!allNotifications[currentUser.id]) return false;

      const notification = allNotifications[currentUser.id].find(notif => notif.id === notificationId);
      if (notification) {
        notification.is_read = true;
        saveToStorage(USER_NOTIFICATIONS_KEY, allNotifications);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Mark all notifications as read
  markAllAsRead: (): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const allNotifications = getFromStorage<Record<string, UserNotification[]>>(USER_NOTIFICATIONS_KEY, {});
      if (!allNotifications[currentUser.id]) return false;

      allNotifications[currentUser.id].forEach(notif => {
        notif.is_read = true;
      });
      
      saveToStorage(USER_NOTIFICATIONS_KEY, allNotifications);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Get unread count
  getUnreadCount: (userId?: string): number => {
    const notifications = UserNotificationService.getUserNotifications(userId);
    return notifications.filter(notif => !notif.is_read).length;
  },

  // Initialize sample notifications for new users
  initializeSampleNotifications: (userId: string): void => {
    const sampleNotifications: Omit<UserNotification, 'id' | 'created_at'>[] = [
      {
        user_id: userId,
        type: 'platform_update',
        title: 'Welcome to Bangla Anime Verse!',
        message: 'Explore thousands of anime and manga, take quizzes, and connect with fellow fans.',
        is_read: false
      },
      {
        user_id: userId,
        type: 'quiz_achievement',
        title: 'Ready to Test Your Knowledge?',
        message: 'Try our anime and manga quizzes to earn XP and climb the leaderboard!',
        is_read: false
      },
      {
        user_id: userId,
        type: 'system_notice',
        title: 'Customize Your Experience',
        message: 'Set your language preference and explore content in both English and Bengali.',
        is_read: false
      }
    ];

    sampleNotifications.forEach(notification => {
      UserNotificationService.createNotification(notification);
    });
  }
};

// =====================================
// USER STATS SERVICE
// =====================================

export const UserStatsService = {
  // Get user stats
  getUserStats: (userId?: string): UserStats => {
    const currentUser = AuthService.getCurrentUser();
    const targetUserId = userId || currentUser?.id;
    
    if (!targetUserId) {
      return {
        total_watch_time: 0,
        anime_episodes_watched: 0,
        manga_pages_read: 0,
        quizzes_completed: 0,
        total_xp: 0,
        level: 1,
        premium_status: false
      };
    }
    
    const allStats = getFromStorage<Record<string, UserStats>>(USER_STATS_KEY, {});
    return allStats[targetUserId] || {
      total_watch_time: 0,
      anime_episodes_watched: 0,
      manga_pages_read: 0,
      quizzes_completed: 0,
      total_xp: 0,
      level: 1,
      premium_status: false
    };
  },

  // Update stats
  updateStats: (updates: Partial<UserStats>): boolean => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return false;

      const allStats = getFromStorage<Record<string, UserStats>>(USER_STATS_KEY, {});
      const currentStats = allStats[currentUser.id] || {
        total_watch_time: 0,
        anime_episodes_watched: 0,
        manga_pages_read: 0,
        quizzes_completed: 0,
        total_xp: 0,
        level: 1,
        premium_status: false
      };

      allStats[currentUser.id] = { ...currentStats, ...updates };
      saveToStorage(USER_STATS_KEY, allStats);
      
      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  },

  // Add XP and calculate level
  addXP: (xpAmount: number): boolean => {
    try {
      const stats = UserStatsService.getUserStats();
      const newXP = stats.total_xp + xpAmount;
      const newLevel = Math.floor(newXP / 100) + 1; // Simple level calculation
      
      return UserStatsService.updateStats({
        total_xp: newXP,
        level: newLevel
      });
    } catch (error) {
      console.error('Error adding XP:', error);
      return false;
    }
  },

  // Increment episodes watched
  incrementEpisodesWatched: (count: number = 1): boolean => {
    const stats = UserStatsService.getUserStats();
    return UserStatsService.updateStats({
      anime_episodes_watched: stats.anime_episodes_watched + count
    });
  },

  // Add watch time
  addWatchTime: (minutes: number): boolean => {
    const stats = UserStatsService.getUserStats();
    return UserStatsService.updateStats({
      total_watch_time: stats.total_watch_time + minutes
    });
  },

  // Increment pages read
  incrementPagesRead: (count: number = 1): boolean => {
    const stats = UserStatsService.getUserStats();
    return UserStatsService.updateStats({
      manga_pages_read: stats.manga_pages_read + count
    });
  },

  // Increment quizzes completed
  incrementQuizzesCompleted: (): boolean => {
    const stats = UserStatsService.getUserStats();
    return UserStatsService.updateStats({
      quizzes_completed: stats.quizzes_completed + 1
    });
  }
};