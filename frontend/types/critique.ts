// src/types/critique.ts
// =====================================
// TYPESCRIPT TYPES FOR CRITIQUE SYSTEM
// =====================================

// User role types
export type UserRole = 'user' | 'admin' | 'critique';

// Submission types
export type SubmissionType = 'anime_review' | 'manga_review' | 'episode_review' | 'vlog';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

// Notification types
export type NotificationType = 'submission_approved' | 'submission_rejected' | 'admin_message';

// Extended User interface
export interface ExtendedUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    avatar_id?: number;
  };
  profile?: UserProfile;
}

// User Profile interface
export interface UserProfile {
  id: string;
  role: UserRole;
  bio?: string;
  favorite_genres: string[];
  notification_preferences: {
    email: boolean;
    in_app: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Submission interface
export interface Submission {
  id: string;
  critic_id: string;
  type: SubmissionType;
  title: string;
  content: string;
  anime_manga_id?: string;
  youtube_link?: string;
  star_rating?: number;
  cover_image?: string;
  status: SubmissionStatus;
  admin_notes?: string;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  critic?: {
    name: string;
    avatar_url?: string;
  };
}

// Notification interface
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  submission_id?: string;
  is_read: boolean;
  created_at: string;
  submission?: {
    title: string;
    type: SubmissionType;
  };
}

// Dashboard statistics
export interface DashboardStats {
  total_submissions: number;
  approved: number;
  rejected: number;
  pending: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
}

// Monthly data for charts
export interface MonthlyData {
  month: string;
  submissions: number;
  approved: number;
}

// Dashboard data
export interface DashboardData {
  stats: DashboardStats;
  recent_submissions: Submission[];
  monthly_data: MonthlyData[];
}

// Form data interfaces
export interface SubmissionFormData {
  type: SubmissionType | '';
  title: string;
  content: string;
  anime_manga_id?: string;
  youtube_link?: string;
  star_rating?: number;
  cover_image?: File;
}

export interface ProfileFormData {
  name: string;
  bio: string;
  favorite_genres: string[];
  notification_preferences: {
    email: boolean;
    in_app: boolean;
  };
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Submission filters
export interface SubmissionFilters {
  status?: SubmissionStatus | 'all';
  type?: SubmissionType | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

// Genre options
export const GENRE_OPTIONS = [
  'Action',
  'Adventure', 
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
  'Mecha',
  'School',
  'Magic'
] as const;

export type Genre = typeof GENRE_OPTIONS[number];

// Submission type labels
export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  anime_review: 'Anime Review',
  manga_review: 'Manga Review', 
  episode_review: 'Episode Review',
  vlog: 'Vlog'
};

// Status labels and colors
export const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; icon: string }> = {
  pending: {
    label: 'Pending',
    color: 'yellow',
    icon: '⏳'
  },
  approved: {
    label: 'Approved', 
    color: 'green',
    icon: '✅'
  },
  rejected: {
    label: 'Rejected',
    color: 'red', 
    icon: '❌'
  }
};

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}