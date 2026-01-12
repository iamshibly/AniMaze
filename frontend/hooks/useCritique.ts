// src/hooks/useCritique.ts - Custom hooks for critique system
import { useState, useEffect, useCallback } from 'react';
import { submissionService, notificationService, dashboardService } from '@/lib/critiqueServices';
import { getFromStorage } from '@/lib/localStorage';
import type { 
  Submission, 
  SubmissionStatus, 
  SubmissionType, 
  Notification, 
  DashboardData 
} from '@/types/critique';

// =====================================
// PUBLIC SUBMISSIONS HOOK (for public reviews page)
// =====================================

interface UsePublicSubmissionsResult {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<{ search?: string; type?: SubmissionType | 'all'; page?: number; limit?: number }>) => void;
  refresh: () => void;
}

export function usePublicSubmissions(initialFilters: {
  search?: string;
  type?: SubmissionType | 'all';
  page?: number;
  limit?: number;
} = {}): UsePublicSubmissionsResult {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [filters, setFiltersState] = useState(initialFilters);

  const fetchPublicSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get only approved submissions for public viewing
      const allSubmissions = getFromStorage<Submission[]>('anime_submissions', []);
      let publicSubmissions = allSubmissions.filter(s => s.status === 'approved');

      // Apply filters
      if (filters.search) {
        const search = filters.search.toLowerCase();
        publicSubmissions = publicSubmissions.filter(s =>
          s.title.toLowerCase().includes(search) ||
          s.content.toLowerCase().includes(search) ||
          s.critic?.name?.toLowerCase().includes(search)
        );
      }

      if (filters.type && filters.type !== 'all') {
        publicSubmissions = publicSubmissions.filter(s => s.type === filters.type);
      }

      // Sort by creation date (newest first)
      publicSubmissions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Pagination
      const limit = filters.limit || 12;
      const totalPages = Math.ceil(publicSubmissions.length / limit);
      const startIndex = (page - 1) * limit;
      const paginatedSubmissions = publicSubmissions.slice(startIndex, startIndex + limit);
      
      setSubmissions(paginatedSubmissions);
      setTotal(publicSubmissions.length);
      setTotalPages(totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load public submissions');
      console.error('Error fetching public submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchPublicSubmissions();
  }, [fetchPublicSubmissions]);

  const setFilters = useCallback((newFilters: Partial<{ search?: string; type?: SubmissionType | 'all'; page?: number; limit?: number }>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    if (newFilters.page !== undefined) {
      setPage(newFilters.page);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchPublicSubmissions();
  }, [fetchPublicSubmissions]);

  return {
    submissions,
    loading,
    error,
    total,
    page,
    totalPages,
    setPage,
    setFilters,
    refresh
  };
}

// =====================================
// SUBMISSIONS HOOK
// =====================================

interface SubmissionFilters {
  search?: string;
  status?: SubmissionStatus | 'all';
  page?: number;
  limit?: number;
}

interface UseSubmissionsResult {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<SubmissionFilters>) => void;
  refresh: () => void;
}

export function useSubmissions(initialFilters: SubmissionFilters = {}): UseSubmissionsResult {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [filters, setFiltersState] = useState<SubmissionFilters>(initialFilters);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await submissionService.getMySubmissions({
        ...filters,
        page
      });
      
      setSubmissions(result.submissions);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const setFilters = useCallback((newFilters: Partial<SubmissionFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    if (newFilters.page !== undefined) {
      setPage(newFilters.page);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    total,
    page,
    totalPages,
    setPage,
    setFilters,
    refresh
  };
}

// =====================================
// ADMIN SUBMISSIONS HOOK
// =====================================

interface AdminSubmissionFilters {
  search?: string;
  status?: SubmissionStatus | 'all';
  type?: SubmissionType | 'all';
  page?: number;
  limit?: number;
}

interface UseAdminSubmissionsResult {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<AdminSubmissionFilters>) => void;
  approveSubmission: (id: string, notes?: string) => Promise<void>;
  rejectSubmission: (id: string, reason: string) => Promise<void>;
  refresh: () => void;
  filters: AdminSubmissionFilters;
}

// src/hooks/useCritique.ts - TARGETED FIX for useAdminSubmissions hook only

// Find the useAdminSubmissions function and replace the return statement (around lines 150-170) with this:

export const useAdminSubmissions = (initialFilters: SubmissionFilters = {}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SubmissionFilters>(initialFilters);

  const fetchSubmissions = useCallback(async (newFilters?: SubmissionFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || { ...filters, page };
      const response = await submissionService.getAllSubmissions(filtersToUse);
      
      // FIXED: Handle the correct response structure from getAllSubmissions
      setSubmissions(response.submissions);  // Changed from response.data
      setTotal(response.total);
      setTotalPages(response.totalPages);    // Changed from response.total_pages
      
      if (newFilters) {
        setFilters(newFilters);
        setPage(newFilters.page || 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      console.error('Error fetching admin submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const approveSubmission = useCallback(async (id: string, notes?: string) => {
    try {
      await submissionService.approveSubmission(id, notes);
      await fetchSubmissions(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to approve submission');
    }
  }, [fetchSubmissions]);

  const rejectSubmission = useCallback(async (id: string, reason: string) => {
    try {
      await submissionService.rejectSubmission(id, reason);
      await fetchSubmissions(); // Refresh the list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reject submission');
    }
  }, [fetchSubmissions]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    fetchSubmissions({ ...filters, page: newPage });
  };

  const changeFilters = (newFilters: SubmissionFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    setPage(1);
    fetchSubmissions(updatedFilters);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // FIXED: Return fetchSubmissions instead of refresh
  return {
    submissions,
    loading,
    error,
    total,
    page,
    totalPages,
    filters,
    fetchSubmissions,    // <-- This was missing/named differently
    approveSubmission,
    rejectSubmission,
    setPage: changePage,
    setFilters: changeFilters,
    refresh: () => fetchSubmissions()  // Keep refresh as alias
  };
};
// =====================================
// NOTIFICATIONS HOOK
// =====================================

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user ID (you'll need to implement this based on your auth system)
      const currentUser = JSON.parse(localStorage.getItem('anime_app_current_user') || '{}');
      if (!currentUser.id) {
        throw new Error('User not authenticated');
      }
      
      const userNotifications = await notificationService.getUserNotifications(currentUser.id);
      setNotifications(userNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('anime_app_current_user') || '{}');
      if (!currentUser.id) return;
      
      await notificationService.markAllAsRead(currentUser.id);
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  };
}

// =====================================
// DASHBOARD HOOK
// =====================================

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh
  };
}

// =====================================
// SUBMISSION FORM HOOK
// =====================================

interface UseSubmissionFormResult {
  submitting: boolean;
  error: string | null;
  submitSubmission: (formData: any) => Promise<void>;
}

export function useSubmissionForm(): UseSubmissionFormResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitSubmission = useCallback(async (formData: any) => {
    try {
      setSubmitting(true);
      setError(null);
      
      await submissionService.createSubmission(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit content');
      throw err; // Re-throw so calling component can handle it
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    submitting,
    error,
    submitSubmission
  };
}

// =====================================
// SUBMISSION ACTIONS HOOK
// =====================================

interface UseSubmissionActionsResult {
  updating: boolean;
  deleting: boolean;
  error: string | null;
  updateSubmission: (id: string, updates: any) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
}

export function useSubmissionActions(): UseSubmissionActionsResult {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubmission = useCallback(async (id: string, updates: any) => {
    try {
      setUpdating(true);
      setError(null);
      
      await submissionService.updateSubmission(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update submission');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteSubmission = useCallback(async (id: string) => {
    try {
      setDeleting(true);
      setError(null);
      
      await submissionService.deleteSubmission(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission');
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    updating,
    deleting,
    error,
    updateSubmission,
    deleteSubmission
  };
}

// =====================================
// ANALYTICS HOOK
// =====================================

interface UseAnalyticsResult {
  analytics: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageEngagement: number;
    topPerformingContent: Submission[];
  } | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAnalytics(userId?: string): UseAnalyticsResult {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let targetUserId = userId;
      if (!targetUserId) {
        const currentUser = JSON.parse(localStorage.getItem('anime_app_current_user') || '{}');
        targetUserId = currentUser.id;
      }
      
      if (!targetUserId) {
        throw new Error('User ID required for analytics');
      }
      
      // Import analyticsService when needed
      const { analyticsService } = await import('@/lib/critiqueServices');
      const analyticsData = await analyticsService.getUserAnalytics(targetUserId);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh
  };
}