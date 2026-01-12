// src/hooks/useUserProgress.ts - Fixed missing methods
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserProgressService, 
  UserNotificationService,
  type UserProgress, 
  type AnimeProgress, 
  type MangaProgress,
  type UserStats,
  type UserNotification
} from '@/lib/userServices';

// Hook for user progress management
export const useUserProgress = () => {
  const { user, isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProgress = useCallback(() => {
    if (!isAuthenticated) {
      setUserProgress(null);
      setLoading(false);
      return;
    }

    const progress = UserProgressService.getUserProgress();
    setUserProgress(progress);
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const updateAnimeProgress = useCallback((animeId: string, progressData: Partial<AnimeProgress>) => {
    UserProgressService.updateAnimeProgress(animeId, progressData);
    loadUserProgress();
  }, [loadUserProgress]);

  const updateMangaProgress = useCallback((mangaId: string, progressData: Partial<MangaProgress>) => {
    UserProgressService.updateMangaProgress(mangaId, progressData);
    loadUserProgress();
  }, [loadUserProgress]);

  const addToWatchlist = useCallback((animeId: string) => {
    UserProgressService.addToWatchlist(animeId);
    loadUserProgress();
  }, [loadUserProgress]);

  const removeFromWatchlist = useCallback((animeId: string) => {
    UserProgressService.removeFromWatchlist(animeId);
    loadUserProgress();
  }, [loadUserProgress]);

  const addToBookmarks = useCallback((mangaId: string) => {
    UserProgressService.addToBookmarks(mangaId);
    loadUserProgress();
  }, [loadUserProgress]);

  const removeFromBookmarks = useCallback((mangaId: string) => {
    UserProgressService.removeFromBookmarks(mangaId);
    loadUserProgress();
  }, [loadUserProgress]);

  const isInWatchlist = useCallback((animeId: string): boolean => {
    return userProgress?.watchlist.includes(animeId) || false;
  }, [userProgress]);

  const isInBookmarks = useCallback((mangaId: string): boolean => {
    return userProgress?.bookmarks.includes(mangaId) || false;
  }, [userProgress]);

  const getAnimeProgress = useCallback((animeId: string): AnimeProgress | null => {
    return userProgress?.anime_progress.find(p => p.anime_id === animeId) || null;
  }, [userProgress]);

  const getMangaProgress = useCallback((mangaId: string): MangaProgress | null => {
    return userProgress?.manga_progress.find(p => p.manga_id === mangaId) || null;
  }, [userProgress]);

  // FIXED: Added missing updateUserStats method
  const updateUserStats = useCallback(() => {
    UserProgressService.updateUserStats();
  }, []);

  // FIXED: Added missing getUserStats method
  const getUserStats = useCallback((): UserStats | null => {
    return UserProgressService.getUserStats();
  }, []);

  return {
    userProgress,
    loading,
    updateAnimeProgress,
    updateMangaProgress,
    addToWatchlist,
    removeFromWatchlist,
    addToBookmarks,
    removeFromBookmarks,
    isInWatchlist,
    isInBookmarks,
    getAnimeProgress,
    getMangaProgress,
    updateUserStats, // FIXED: Now available
    getUserStats,    // FIXED: Now available
    refresh: loadUserProgress
  };
};

// Hook for user statistics
export const useUserStats = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(() => {
    if (!isAuthenticated) {
      setStats(null);
      setLoading(false);
      return;
    }

    UserProgressService.updateUserStats();
    const userStats = UserProgressService.getUserStats();
    setStats(userStats);
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return {
    stats,
    loading,
    refresh: loadStats
  };
};

// Hook for notifications
export const useUserNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const userNotifications = UserNotificationService.getUserNotifications();
    const count = UserNotificationService.getUnreadCount();
    
    setNotifications(userNotifications);
    setUnreadCount(count);
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30 * 1000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    UserNotificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    UserNotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const createNotification = useCallback((data: Omit<UserNotification, 'id' | 'created_at'>) => {
    UserNotificationService.createNotification(data);
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    refresh: loadNotifications
  };
};

// Hook for watchlist management
export const useWatchlist = () => {
  const { userProgress, addToWatchlist, removeFromWatchlist, isInWatchlist, getAnimeProgress, loading } = useUserProgress();

  const watchlistItems = userProgress?.watchlist || [];
  const watchlistProgress = userProgress?.anime_progress || [];

  const toggleWatchlist = useCallback((animeId: string) => {
    if (isInWatchlist(animeId)) {
      removeFromWatchlist(animeId);
      return false;
    } else {
      addToWatchlist(animeId);
      return true;
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  return {
    watchlistItems,
    watchlistProgress,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getAnimeProgress,
    toggleWatchlist
  };
};

// Hook for bookmarks management
export const useBookmarks = () => {
  const { userProgress, addToBookmarks, removeFromBookmarks, isInBookmarks, getMangaProgress, loading } = useUserProgress();

  const bookmarkItems = userProgress?.bookmarks || [];
  const bookmarkProgress = userProgress?.manga_progress || [];

  const toggleBookmarks = useCallback((mangaId: string) => {
    if (isInBookmarks(mangaId)) {
      removeFromBookmarks(mangaId);
      return false;
    } else {
      addToBookmarks(mangaId);
      return true;
    }
  }, [isInBookmarks, addToBookmarks, removeFromBookmarks]);

  return {
    bookmarkItems,
    bookmarkProgress,
    loading,
    addToBookmarks,
    removeFromBookmarks,
    isInBookmarks,
    getMangaProgress,
    toggleBookmarks
  };
};

// Hook for episode tracking
export const useEpisodeTracking = (animeId: string) => {
  const { getAnimeProgress, updateAnimeProgress } = useUserProgress();
  const progress = getAnimeProgress(animeId);

  const updateEpisodeProgress = useCallback((episodeNumber: number, watchTime: number = 0) => {
    const currentProgress = getAnimeProgress(animeId);
    
    updateAnimeProgress(animeId, {
      current_episode: episodeNumber,
      episodes_watched: Math.max(currentProgress?.episodes_watched || 0, episodeNumber),
      watch_time: (currentProgress?.watch_time || 0) + watchTime,
      status: episodeNumber >= (currentProgress?.total_episodes || 12) ? 'completed' : 'watching'
    });
  }, [animeId, getAnimeProgress, updateAnimeProgress]);

  const markEpisodeWatched = useCallback((episodeNumber: number) => {
    updateEpisodeProgress(episodeNumber, 1440); // Assume 24 minutes per episode
  }, [updateEpisodeProgress]);

  const setCurrentEpisode = useCallback((episodeNumber: number) => {
    updateAnimeProgress(animeId, {
      current_episode: episodeNumber
    });
  }, [animeId, updateAnimeProgress]);

  return {
    progress,
    currentEpisode: progress?.current_episode || 1,
    episodesWatched: progress?.episodes_watched || 0,
    totalEpisodes: progress?.total_episodes || 12,
    watchTime: progress?.watch_time || 0,
    status: progress?.status || 'watching',
    rating: progress?.rating,
    updateEpisodeProgress,
    markEpisodeWatched,
    setCurrentEpisode
  };
};

// Hook for chapter tracking
export const useChapterTracking = (mangaId: string) => {
  const { getMangaProgress, updateMangaProgress } = useUserProgress();
  const progress = getMangaProgress(mangaId);

  const updateChapterProgress = useCallback((chapterNumber: number, pageNumber: number = 1) => {
    const currentProgress = getMangaProgress(mangaId);
    
    updateMangaProgress(mangaId, {
      current_chapter: chapterNumber,
      current_page: pageNumber,
      chapters_read: Math.max(currentProgress?.chapters_read || 0, chapterNumber),
      status: chapterNumber >= (currentProgress?.total_chapters || 50) ? 'completed' : 'reading'
    });
  }, [mangaId, getMangaProgress, updateMangaProgress]);

  const markChapterRead = useCallback((chapterNumber: number) => {
    updateChapterProgress(chapterNumber, 1);
  }, [updateChapterProgress]);

  const setCurrentPage = useCallback((chapterNumber: number, pageNumber: number) => {
    updateMangaProgress(mangaId, {
      current_chapter: chapterNumber,
      current_page: pageNumber
    });
  }, [mangaId, updateMangaProgress]);

  return {
    progress,
    currentChapter: progress?.current_chapter || 1,
    currentPage: progress?.current_page || 1,
    chaptersRead: progress?.chapters_read || 0,
    totalChapters: progress?.total_chapters || 50,
    status: progress?.status || 'reading',
    rating: progress?.rating,
    updateChapterProgress,
    markChapterRead,
    setCurrentPage
  };
};