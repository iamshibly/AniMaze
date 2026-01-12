// src/hooks/useQuiz.ts - COMPLETE FIXED VERSION WITH EVENT DISPATCH
import { useState, useCallback } from 'react';
import { Quiz, Question, QuizResult, User, QuizAttempt } from '../types/quiz';
import { generateMockQuiz } from '../data/mockQuizzes';
import { quizAPI } from '../services/quizAPI';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Array<string | number | number[]>>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const startQuiz = useCallback(async (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsLoading(true);
    try {
      console.log(`Starting ${difficulty} quiz with AI generation...`);
      
      // Try to use API service first
      try {
        const apiQuiz = await quizAPI.generateQuiz({
          difficulty,
          questionCount: 5,
          topics: []
        });

        setCurrentQuiz(apiQuiz);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setQuizResult(null);
        setTimeRemaining(apiQuiz.questions[0]?.timeLimit || 30);
        setIsQuizActive(true);
        
        toast({
          title: "Quiz Ready!",
          description: `🎌 AI-generated ${difficulty} quiz loaded successfully!`,
        });
      } catch (apiError) {
        console.error('AI quiz generation failed:', apiError);
        
        // Fallback to mock data
        console.log('Falling back to mock quiz data...');
        const mockQuiz = generateMockQuiz(difficulty, 5);
        
        setCurrentQuiz(mockQuiz);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setQuizResult(null);
        setTimeRemaining(mockQuiz.questions[0]?.timeLimit || 30);
        setIsQuizActive(true);
        
        toast({
          title: "Quiz Ready!",
          description: `📚 ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} quiz loaded successfully!`,
        });
      }
    } catch (error) {
      console.error('Quiz loading failed:', error);
      toast({
        title: "Error Loading Quiz",
        description: "Failed to load quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const submitAnswer = useCallback((answer: string | number | number[]) => {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    // Move to next question or finish quiz
    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(currentQuiz.questions[currentQuestionIndex + 1]?.timeLimit || 30);
    } else {
      // Use newAnswers directly to finish the quiz
      finishQuizWithAnswers(newAnswers);
    }
  }, [currentQuiz, currentQuestionIndex, userAnswers]);

  const finishQuizWithAnswers = useCallback((answers: Array<string | number | number[]>) => {
    if (!currentQuiz) return;

    setIsQuizActive(false);
    
    // Calculate score using proper type checking
    let score = 0;
    const resultAnswers = currentQuiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = checkAnswer(question, userAnswer);
      
      if (isCorrect) {
        score = score + 1; // Safe numeric addition
      }
      
      return {
        questionId: question.id,
        userAnswer: userAnswer || '',
        isCorrect
      };
    });

    const totalQuestions = currentQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Calculate time taken safely
    const totalTimeAllowed = totalQuestions * 30; // 30 seconds per question default
    const timeTaken = Math.max(0, totalTimeAllowed - timeRemaining);
    
    // Calculate XP based on performance
    let xpEarned = 20; // Base XP for participation
    if (percentage >= 90) xpEarned = 200;
    else if (percentage >= 80) xpEarned = 100;
    else if (percentage >= 70) xpEarned = 50;
    
    // Calculate grade
    const grade = getGrade(percentage);

    const result: QuizResult = {
      quizId: currentQuiz.id,
      userId: getCurrentUser().id,
      score,
      totalQuestions,
      timeTaken,
      answers: resultAnswers,
      completedAt: new Date(),
      xpEarned,
      difficulty: currentQuiz.difficulty,
      percentage,
      grade
    };

    setQuizResult(result);
    
    // Update user stats and store detailed quiz history
    updateUserStats(result, currentQuiz);
    
    toast({
      title: "Quiz Complete!",
      description: `Final Score: ${score}/${totalQuestions} (${percentage}%) • +${xpEarned} XP`,
    });
  }, [currentQuiz, timeRemaining, toast]);

  const finishQuiz = useCallback(() => {
    finishQuizWithAnswers(userAnswers);
  }, [userAnswers, finishQuizWithAnswers]);

  const timeUp = useCallback(() => {
    if (isQuizActive) {
      finishQuiz();
      toast({
        title: "Time's Up!",
        description: "Quiz has been auto-submitted.",
        variant: "destructive"
      });
    }
  }, [isQuizActive, finishQuiz, toast]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsQuizActive(false);
    setTimeRemaining(0);
    setQuizResult(null);
  }, []);

  return {
    currentQuiz,
    currentQuestion: currentQuiz?.questions[currentQuestionIndex] || null,
    currentQuestionIndex,
    userAnswers,
    isQuizActive,
    timeRemaining,
    setTimeRemaining,
    quizResult,
    isLoading,
    startQuiz,
    submitAnswer,
    finishQuiz,
    timeUp,
    resetQuiz
  };
};

// Helper functions
const getCurrentUser = (): User => {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    return JSON.parse(userData);
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: `Player${Math.floor(Math.random() * 1000)}`,
    totalXP: 0,
    quizzesCompleted: 0,
    averageScore: 0,
    rank: 0
  };
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

const checkAnswer = (question: Question, userAnswer: string | number | number[]): boolean => {
  if (userAnswer === undefined || userAnswer === null) return false;
  
  // Handle multiple choice questions
  if (question.type === 'mcq' && Array.isArray(question.options)) {
    const correctOptionIndex = Number(question.correctAnswer);
    const correctOption = question.options[correctOptionIndex];
    
    // If user answer is a number (option index), compare directly
    if (typeof userAnswer === 'number') {
      return userAnswer === correctOptionIndex;
    }
    
    // If user answer is a string (option text), compare with correct option text
    const userAnswerStr = String(userAnswer).toLowerCase().trim();
    const correctAnswerStr = String(correctOption || '').toLowerCase().trim();
    return userAnswerStr === correctAnswerStr;
  }
  
  // Handle true/false questions
  if (question.type === 'true-false') {
    const userAnswerStr = String(userAnswer).toLowerCase().trim();
    const correctAnswerStr = String(question.correctAnswer).toLowerCase().trim();
    return userAnswerStr === correctAnswerStr;
  }
  
  // Handle multiple select questions
  if (question.type === 'multiple-select' && Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
    if (userAnswer.length !== question.correctAnswer.length) return false;
    const sortedUser = [...userAnswer].sort();
    const sortedCorrect = [...question.correctAnswer].sort();
    return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
  }
  
  // Handle number questions
  if (question.type === 'number') {
    const userNum = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer));
    const correctNum = typeof question.correctAnswer === 'number' 
      ? question.correctAnswer 
      : parseFloat(String(question.correctAnswer));
    return !isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum;
  }
  
  // Default comparison for other question types (fill-blank, ranking, etc.)
  const userAnswerStr = String(userAnswer).toLowerCase().trim();
  const correctAnswerStr = String(question.correctAnswer).toLowerCase().trim();
  return userAnswerStr === correctAnswerStr;
};

const getGrade = (percentage: number): string => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
};

const generateQuizTitle = (difficulty: string): string => {
  const titles = {
    easy: ['Anime Basics', 'Getting Started', 'Anime 101', 'Beginner Quest', 'Starter Challenge'],
    medium: ['Anime Knowledge', 'Otaku Test', 'Series Mastery', 'Character Challenge', 'Plot Puzzle'],
    hard: ['Ultimate Challenge', 'Expert Level', 'Master Quest', 'Legend Trial', 'Hardcore Quiz']
  };
  
  const titleList = titles[difficulty as keyof typeof titles] || titles.medium;
  return titleList[Math.floor(Math.random() * titleList.length)];
};

const updateUserStats = (result: QuizResult, quiz: Quiz) => {
  const user = getCurrentUser();
  const scorePercentage = result.percentage;
  
  // Create quiz attempt record
  const quizAttempt: QuizAttempt = {
    id: `attempt-${Date.now()}`,
    quizTitle: quiz.title || generateQuizTitle(result.difficulty),
    difficulty: result.difficulty,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    xpEarned: result.xpEarned,
    timeTaken: result.timeTaken,
    completedAt: result.completedAt,
    grade: result.grade,
    category: quiz.category || 'anime'
  };

  // Update user stats safely
  const newQuizzesCompleted = user.quizzesCompleted + 1;
  const currentTotal = user.averageScore * user.quizzesCompleted;
  const newTotal = currentTotal + scorePercentage;
  const newAverageScore = newTotal / newQuizzesCompleted;
  
  const updatedUser: User = {
    ...user,
    totalXP: user.totalXP + result.xpEarned,
    quizzesCompleted: newQuizzesCompleted,
    averageScore: newAverageScore
  };
  
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  // Store detailed quiz history
  const historyKey = 'userQuizHistory';
  const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '{}');
  
  if (!existingHistory[user.id]) {
    existingHistory[user.id] = [];
  }
  
  existingHistory[user.id].push(quizAttempt);
  
  // Keep only last 20 attempts per user
  if (existingHistory[user.id].length > 20) {
    existingHistory[user.id] = existingHistory[user.id].slice(-20);
  }
  
  localStorage.setItem(historyKey, JSON.stringify(existingHistory));

  // Update leaderboard
  updateLeaderboard(updatedUser);
  
  // Check for achievements
  checkAchievements(updatedUser, existingHistory[user.id]);

  // 🔥 FIXED: Dispatch custom event to notify dashboard to refresh
  window.dispatchEvent(new CustomEvent('quizCompleted', {
    detail: {
      quizAttempt,
      updatedUser
    }
  }));
};

const updateLeaderboard = (user: User, xpGained?: number) => {
  const leaderboardData = localStorage.getItem('leaderboard');
  let leaderboard: User[] = leaderboardData ? JSON.parse(leaderboardData) : [];
  
  const existingUserIndex = leaderboard.findIndex(u => u.id === user.id);
  if (existingUserIndex >= 0) {
    leaderboard[existingUserIndex] = user;
  } else {
    leaderboard.push(user);
  }
  
  leaderboard.sort((a, b) => b.totalXP - a.totalXP);
  leaderboard = leaderboard.slice(0, 10); // Keep only top 10 real users
  
  // Update ranks for real users only
  leaderboard.forEach((leaderboardUser, index) => {
    leaderboardUser.rank = index + 1;
  });
  
  // Bot users (same as in Leaderboard component)
  const botUsers: User[] = [
    { id: 'bot-1', name: 'OtakuMaster', totalXP: 15420, quizzesCompleted: 87, averageScore: 94.5, rank: 1 },
    { id: 'bot-2', name: 'AnimeExpert', totalXP: 12850, quizzesCompleted: 76, averageScore: 91.2, rank: 2 },
    { id: 'bot-3', name: 'MangaKing', totalXP: 10950, quizzesCompleted: 63, averageScore: 88.7, rank: 3 },
    { id: 'bot-4', name: 'TokyoFan', totalXP: 8750, quizzesCompleted: 52, averageScore: 85.3, rank: 4 },
    { id: 'bot-5', name: 'NinjaWiz', totalXP: 7320, quizzesCompleted: 41, averageScore: 82.1, rank: 5 }
  ];
  
  // Calculate user's real rank against combined leaderboard (real users + bots)
  const combinedUsers = [...leaderboard, ...botUsers]
    .sort((a, b) => b.totalXP - a.totalXP);
  
  // Find current user's actual rank in combined leaderboard
  const currentUserRankInCombined = combinedUsers.findIndex(u => u.id === user.id) + 1;
  const updatedCurrentUser = {
    ...user,
    rank: currentUserRankInCombined > 0 ? currentUserRankInCombined : combinedUsers.length + 1
  };
  
  // Update current user's record with correct rank (calculated against combined leaderboard)
  localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
};

const checkAchievements = (user: User, quizHistory: QuizAttempt[]) => {
  // Achievement system - can be expanded
  const level = Math.floor(user.totalXP / 1000) + 1;
  
  const achievements = [];
  
  if (level >= 5) achievements.push({ 
    id: 'level-5', 
    title: 'Rising Star', 
    description: 'Reached Level 5',
    icon: '⭐',
    unlockedAt: new Date(),
    xpBonus: 50
  });
  
  if (level >= 10) achievements.push({ 
    id: 'level-10', 
    title: 'Quiz Veteran', 
    description: 'Reached Level 10',
    icon: '⚡',
    unlockedAt: new Date(),
    xpBonus: 100
  });
  
  if (level >= 25) achievements.push({ 
    id: 'level-25', 
    title: 'Manga Master', 
    description: 'Reached Level 25',
    icon: '🔥',
    unlockedAt: new Date(),
    xpBonus: 250
  });
  
  // Store achievements
  if (achievements.length > 0) {
    localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
  }
};