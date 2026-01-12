// src/types/quiz.ts - Enhanced with detailed quiz tracking
export interface Question {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'image-based' | 'multiple-select' | 'ranking' | 'number';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string | number | number[];
  explanation?: string;
  imageUrl?: string;
  timeLimit: number; // in seconds
}

export interface Quiz {
  id: string;
  title?: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // Total time limit in seconds
  createdAt: Date;
  category?: string;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  answers: Array<{
    questionId: string;
    userAnswer: string | number | number[];
    isCorrect: boolean;
  }>;
  completedAt: Date;
  xpEarned: number;
  difficulty: 'easy' | 'medium' | 'hard';
  percentage: number;
  grade: string;
}

// NEW: Detailed quiz history for enhanced leaderboard
export interface QuizAttempt {
  id: string;
  quizTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  xpEarned: number;
  timeTaken: number;
  completedAt: Date;
  grade: string;
  category?: string;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  totalXP: number;
  highestStreak: number;
  currentStreak: number;
  bestPerformance: {
    percentage: number;
    quizTitle: string;
    date: Date;
  };
  recentAttempts: QuizAttempt[];
  categoryBreakdown: {
    [category: string]: {
      count: number;
      averageScore: number;
      totalXP: number;
    };
  };
}

export interface User {
  id: string;
  name: string;
  totalXP: number;
  quizzesCompleted: number;
  averageScore: number;
  rank: number;
  level?: number;
  stats?: UserStats;
  recentQuizzes?: QuizAttempt[];
  achievements?: Achievement[];
}

// NEW: Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  xpBonus: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  recentPerformance: number; // Average of last 5 quizzes
  trend: 'up' | 'down' | 'stable';
}

// API Request/Response types
export interface GenerateQuizRequest {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  topics?: string[];
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}