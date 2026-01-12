// src/pages/user/Dashboard.tsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Clock,
  Play,
  Book,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Crown,
  Zap,
  Award,
  Eye,
  Heart,
  Bookmark,
  BarChart3,
  Activity,
  Users,
  Timer,
  BookOpen,
  Gamepad2,
  Flame,
  Medal,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Gauge,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProgressService, UserNotificationService, type UserStats } from '@/lib/userServices';
import { Link } from 'react-router-dom';

// FIXED: Updated generateRealisticData function to properly sort quiz results
const generateRealisticData = (user: any) => {
  
  // Get real quiz history from localStorage
  const historyKey = 'userQuizHistory';
  const currentUser = localStorage.getItem('currentUser');
  let realQuizData = null;
  
  if (user && currentUser) {
    try {
      const parsedCurrentUser = JSON.parse(currentUser);
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '{}');
      realQuizData = existingHistory[parsedCurrentUser.id] || [];
      
      // FIX: Ensure we sort by completion time to get the most recent results first
      if (realQuizData && realQuizData.length > 0) {
        realQuizData = realQuizData.sort((a: any, b: any) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    }
  }

  // If we have real quiz data, use it; otherwise fall back to mock data
  if (realQuizData && realQuizData.length > 0) {
    // Calculate real stats from actual quiz results
    const totalQuizzes = realQuizData.length;
    const totalXPFromQuizzes = realQuizData.reduce((sum: number, quiz: any) => sum + (quiz.xpEarned || 0), 0);
    const averageScore = realQuizData.reduce((sum: number, quiz: any) => sum + (quiz.percentage || 0), 0) / totalQuizzes;
    const currentXP = user?.totalXP || totalXPFromQuizzes;
    
    // FIX: Get the most recent quiz results (already sorted above)
    const recentQuizzes = realQuizData.slice(0, 5); // Get top 5 most recent
    
    // Calculate this month's activity
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthQuizzes = realQuizData.filter((quiz: any) => {
      const quizDate = new Date(quiz.completedAt);
      return quizDate.getMonth() === currentMonth && quizDate.getFullYear() === currentYear;
    });
    
    const episodesThisMonth = thisMonthQuizzes.length * 2; // Estimate 2 episodes per quiz
    const chaptersThisMonth = thisMonthQuizzes.length * 5; // Estimate 5 chapters per quiz
    
    // Calculate total watch time estimate (30 minutes per quiz)
    const totalWatchTime = totalQuizzes * 0.5; // 30 minutes = 0.5 hours
    
    // Calculate streak (simplified - based on recent activity)
    let streakDays = 1;
    const sortedQuizzes = realQuizData; // Already sorted above
    
    if (sortedQuizzes.length > 1) {
      const lastQuizDate = new Date(sortedQuizzes[0].completedAt);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        streakDays = Math.min(7, sortedQuizzes.length);
      }
    }

    // FIX: Calculate best quiz score from actual data
    const bestQuizScore = Math.max(...realQuizData.map((quiz: any) => quiz.percentage || 0));

    return {
      totalWatchTime: Math.floor(totalWatchTime),
      episodesThisMonth: episodesThisMonth,
      chaptersThisMonth: chaptersThisMonth,
      currentXP: currentXP,
      nextLevelXP: Math.ceil(currentXP / 1000) * 1000,
      streakDays: streakDays,
      avgSessionLength: 35, // Average quiz time
      // FIX: Use properly sorted recent quizzes
      totalQuizzes: totalQuizzes,
      averageQuizScore: Math.round(averageScore),
      thisMonthQuizzes: thisMonthQuizzes.length,
      bestQuizScore: Math.round(bestQuizScore),
      recentQuizzes: recentQuizzes // FIXED: Use sorted recent quizzes
    };
  } else {
    // Fall back to original mock data if no real quiz data exists
    const baseHours = Math.random() * 50 + 30; // 30-80 hours
    const baseEpisodes = Math.floor(Math.random() * 100 + 50); // 50-150 episodes
    const baseChapters = Math.floor(Math.random() * 200 + 100); // 100-300 chapters
    const currentXP = user?.xp || Math.floor(Math.random() * 2000 + 500);
    const streakDays = Math.floor(Math.random() * 15 + 5); // 5-20 days
    const avgSession = Math.floor(Math.random() * 60 + 30); // 30-90 minutes

    return {
      totalWatchTime: Math.floor(baseHours),
      episodesThisMonth: Math.floor(baseEpisodes * 0.3),
      chaptersThisMonth: Math.floor(baseChapters * 0.25),
      currentXP,
      nextLevelXP: Math.ceil(currentXP / 1000) * 1000,
      streakDays,
      avgSessionLength: avgSession,
      // Default quiz stats for users with no quiz history
      totalQuizzes: 0,
      averageQuizScore: 0,
      thisMonthQuizzes: 0,
      bestQuizScore: 0,
      recentQuizzes: []
    };
  }
};


const generateWeeklyActivity = () => [
  { day: 'Mon', anime: Math.floor(Math.random() * 4), manga: Math.floor(Math.random() * 8), quiz: Math.floor(Math.random() * 3) },
  { day: 'Tue', anime: Math.floor(Math.random() * 5), manga: Math.floor(Math.random() * 6), quiz: Math.floor(Math.random() * 2) },
  { day: 'Wed', anime: Math.floor(Math.random() * 3), manga: Math.floor(Math.random() * 10), quiz: Math.floor(Math.random() * 1) },
  { day: 'Thu', anime: Math.floor(Math.random() * 6), manga: Math.floor(Math.random() * 4), quiz: Math.floor(Math.random() * 4) },
  { day: 'Fri', anime: Math.floor(Math.random() * 4), manga: Math.floor(Math.random() * 7), quiz: Math.floor(Math.random() * 2) },
  { day: 'Sat', anime: Math.floor(Math.random() * 8), manga: Math.floor(Math.random() * 12), quiz: Math.floor(Math.random() * 3) },
  { day: 'Sun', anime: Math.floor(Math.random() * 6), manga: Math.floor(Math.random() * 9), quiz: Math.floor(Math.random() * 2) }
];

const generateMonthlyProgress = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    episodes: Math.floor(Math.random() * 30 + 10),
    chapters: Math.floor(Math.random() * 50 + 20)
  }));
};

const generateHeatmapData = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return days.map(day => ({
    day,
    data: hours.map(hour => ({
      hour,
      value: Math.floor(Math.random() * 5)
    }))
  }));
};

const generateGenreRadar = () => [
  { genre: 'Shonen', score: Math.floor(Math.random() * 40 + 60) },
  { genre: 'Seinen', score: Math.floor(Math.random() * 30 + 50) },
  { genre: 'Romance', score: Math.floor(Math.random() * 35 + 45) },
  { genre: 'Thriller', score: Math.floor(Math.random() * 25 + 35) },
  { genre: 'Comedy', score: Math.floor(Math.random() * 45 + 40) },
  { genre: 'Horror', score: Math.floor(Math.random() * 20 + 30) }
];

// FIX: Updated generateRecentActivity to handle real quiz data properly
const generateRecentActivity = (stats: any) => {
  const activities = [];
  
  // Add real quiz activities if available - FIXED
  if (stats.recentQuizzes && stats.recentQuizzes.length > 0) {
    stats.recentQuizzes.slice(0, 3).forEach((quiz: any) => {
      const completedDate = new Date(quiz.completedAt);
      const now = new Date();
      const timeDiff = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let timeText = 'Today';
      if (timeDiff === 1) {
        timeText = 'Yesterday';
      } else if (timeDiff > 1) {
        timeText = `${timeDiff} days ago`;
      }

      // Calculate hours/minutes ago for same day
      if (timeDiff === 0) {
        const hoursDiff = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60));
        if (hoursDiff === 0) {
          const minutesDiff = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60));
          timeText = minutesDiff <= 1 ? 'Just now' : `${minutesDiff} minutes ago`;
        } else {
          timeText = hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`;
        }
      }

      activities.push({
        type: 'quiz',
        action: 'Completed quiz',
        title: quiz.quizTitle || 'Anime Knowledge Quiz',
        time: timeText,
        score: quiz.percentage,
        xp: quiz.xpEarned
      });
    });
  }
  
  // Add some default activities if no quiz history
  if (activities.length === 0) {
    activities.push(
      { type: 'anime', action: 'Added to watchlist', title: 'Demon Slayer', time: '2 days ago' },
      { type: 'manga', action: 'Finished reading', title: 'Death Note', time: '3 days ago' }
    );
  }
  
  return activities;
};

const badges = [
  { name: 'First Steps', description: 'Watched your first anime', unlocked: true, date: '2024-01-15' },
  { name: 'Bookworm', description: 'Read 50 manga chapters', unlocked: true, date: '2024-02-20' },
  { name: 'Quiz Master', description: 'Scored 90%+ on 5 quizzes', unlocked: true, date: '2024-03-10' },
  { name: 'Streak Warrior', description: '7-day login streak', unlocked: true, date: '2024-04-05' },
  { name: 'Explorer', description: 'Tried 10 different genres', unlocked: false, progress: 70 },
  { name: 'Completionist', description: 'Finished 25 anime series', unlocked: false, progress: 45 }
];

export default function Dashboard() {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [genreData, setGenreData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadUserProfile();
  }, [user]);

  // Listen for profile updates from localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `user_profile_${user?.id}`) {
        loadUserProfile();
      }
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for updates (for same-tab updates)
    const interval = setInterval(loadUserProfile, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  // NEW: Listen for quiz completion events and storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userQuizHistory' || e.key === 'currentUser') {
        // Refresh stats when quiz history or user data changes
        if (user) {
          const newStats = generateRealisticData(user);
          setStats(newStats);
          setRecentActivity(generateRecentActivity(newStats));
        }
      }
    };

    // Custom event for same-tab changes
    const handleQuizComplete = () => {
      if (user) {
        setTimeout(() => { // Small delay to ensure data is saved
          const newStats = generateRealisticData(user);
          setStats(newStats);
          setRecentActivity(generateRecentActivity(newStats));
        }, 100);
      }
    };

    // Listen to localStorage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for quiz completion events
    window.addEventListener('quizCompleted', handleQuizComplete);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('quizCompleted', handleQuizComplete);
    };
  }, [user]);
  

  const loadUserProfile = () => {
    if (user) {
      const savedProfile = localStorage.getItem(`user_profile_${user.id}`);
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    }
  };

  // FIXED: Updated loadDashboardData function
  const loadDashboardData = () => {
    if (!user) return;

    // Generate realistic stats based on user
    const userStats = generateRealisticData(user);
    setStats(userStats);

    // Generate all chart data
    setWeeklyData(generateWeeklyActivity());
    setMonthlyData(generateMonthlyProgress());
    setHeatmapData(generateHeatmapData());
    setRadarData(generateGenreRadar());
    setRecentActivity(generateRecentActivity(userStats));

    // Generate genre preference data
    const mockGenreData = [
      { name: 'Shonen', value: 40, color: '#FF6B6B' },
      { name: 'Seinen', value: 25, color: '#4ECDC4' },
      { name: 'Romance', value: 20, color: '#45B7D1' },
      { name: 'Thriller', value: 10, color: '#96CEB4' },
      { name: 'Comedy', value: 5, color: '#FFEAA7' }
    ];
    setGenreData(mockGenreData);

    setLoading(false);
  };

  const getXPProgress = () => {
    if (!stats) return 0;
    return Math.round((stats.currentXP / stats.nextLevelXP) * 100);
  };

  const getBadgeLevel = () => {
    if (!stats) return 1;
    return Math.floor(stats.currentXP / 1000) + 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'Otaku'}!
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Track your anime journey and discover new adventures
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            Level {getBadgeLevel()}
          </Badge>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>

      {/* User Bio Section - CLEAN VERSION */}
      {userProfile?.bio && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-primary">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            About Me
          </h3>
          <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
        </div>
      )}

      {/* Favorite Genres Section - CLEAN VERSION */}
      {userProfile?.favorite_genres && userProfile.favorite_genres.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Favorite Genres
            </CardTitle>
            <CardDescription>
              The anime and manga genres you love most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.favorite_genres.map((genre: string, index: number) => (
                <Badge 
                  key={genre} 
                  variant="outline" 
                  className="px-3 py-1 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20 hover:border-primary/40 transition-colors"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Your favorite genres help us recommend content you'll love! 
                You can update them in your <Link to="/user/profile" className="text-primary hover:underline">Profile Settings</Link>.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Watch Time</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalWatchTime}h</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Episodes This Month</p>
                <p className="text-3xl font-bold text-green-600">{stats.episodesThisMonth}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chapters This Month</p>
                <p className="text-3xl font-bold text-purple-600">{stats.chaptersThisMonth}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +15% from last month
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak Days</p>
                <p className="text-3xl font-bold text-orange-600">{stats.streakDays}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Flame className="w-3 h-3 mr-1" />
                  Keep it up!
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

                {/* XP and Badge Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              XP Progress
            </CardTitle>
            <CardDescription>Your journey to the next level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Level {getBadgeLevel()}</span>
                <span className="text-sm text-muted-foreground">
                  {stats.currentXP} / {stats.nextLevelXP} XP
                </span>
              </div>
              <Progress value={getXPProgress()} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {stats.nextLevelXP - stats.currentXP} XP until next level
              </p>
              
              {/* FIXED: Show consistent stats from same data source */}
              <div className="grid grid-cols-3 gap-2 pt-2 mt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{stats?.totalQuizzes || 0}</p>
                  <p className="text-xs text-muted-foreground">Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{stats?.averageQuizScore || 0}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">#{user?.rank || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Rank</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Recent Achievement
            </CardTitle>
            <CardDescription>Latest badge unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Streak Warrior</p>
                <p className="text-sm text-muted-foreground">7-day login streak achieved!</p>
                <p className="text-xs text-muted-foreground">Unlocked 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="progress">Progress & Activity</TabsTrigger>
          <TabsTrigger value="habits">Time & Habits</TabsTrigger>
          <TabsTrigger value="xp">XP & Badges</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes & Skills</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Progress & Activity Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Episodes watched and chapters read over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="episodes" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="chapters" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your activity breakdown for this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="anime" fill="#FF6B6B" />
                    <Bar dataKey="manga" fill="#4ECDC4" />
                    <Bar dataKey="quiz" fill="#45B7D1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'anime' ? 'bg-red-100 text-red-600' :
                      activity.type === 'manga' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'anime' ? <Play className="w-4 h-4" /> :
                       activity.type === 'manga' ? <BookOpen className="w-4 h-4" /> :
                       <Gamepad2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">{activity.action}</span>
                        <span className="font-medium ml-1">{activity.title}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      {activity.score && (
                        <p className="text-xs text-green-600">Score: {activity.score}% | +{activity.xp} XP</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time & Habits Tab */}
        <TabsContent value="habits" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Usage Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Pattern</CardTitle>
                <CardDescription>When you're most active (past 30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {heatmapData.map((day, dayIndex) => (
                    <div key={day.day} className="flex items-center gap-2">
                      <span className="text-xs w-8 text-muted-foreground">{day.day}</span>
                      <div className="flex gap-1">
                        {day.data.map((hour, hourIndex) => (
                          <div
                            key={hourIndex}
                            className={`w-3 h-3 rounded-sm ${
                              hour.value === 0 ? 'bg-muted' :
                              hour.value === 1 ? 'bg-green-200' :
                              hour.value === 2 ? 'bg-green-300' :
                              hour.value === 3 ? 'bg-green-400' :
                              hour.value === 4 ? 'bg-green-500' : 'bg-green-600'
                            }`}
                            title={`${hour.hour}:00 - Activity level: ${hour.value}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>How you spend your time on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Session Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Timer className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{stats.avgSessionLength}m</p>
                  <p className="text-sm text-muted-foreground">Avg Session Length</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Active Days This Month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">+18%</p>
                  <p className="text-sm text-muted-foreground">Activity Increase</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* XP & Badges Tab */}
        <TabsContent value="xp" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* XP Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>XP Breakdown</CardTitle>
                <CardDescription>XP earned by activity type this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { activity: 'Watching Anime', xp: 450 },
                    { activity: 'Reading Manga', xp: 380 },
                    { activity: 'Taking Quizzes', xp: 220 },
                    { activity: 'Daily Login', xp: 150 },
                    { activity: 'Completing Series', xp: 300 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="xp" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Badge Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Collection</CardTitle>
                <CardDescription>Your achievement journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-muted'
                      }`}>
                        {badge.unlocked ? (
                          <Medal className="w-5 h-5 text-white" />
                        ) : (
                          <Medal className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {badge.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        {badge.unlocked ? (
                          <p className="text-xs text-green-600">Unlocked {badge.date}</p>
                        ) : (
                          <Progress value={badge.progress} className="h-2 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quizzes & Skills Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quiz Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your quiz statistics and improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats?.totalQuizzes || 0}</p>
                      <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats?.averageQuizScore || 0}%</p>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{stats?.bestQuizScore || 0}%</p>
                      <p className="text-sm text-muted-foreground">Best Score</p>
                    </div>
                  </div>
                  
                  {/* Recent Quiz Results */}
                  {stats?.recentQuizzes && stats.recentQuizzes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        Recent Quiz Results
                      </h4>
                      <div className="space-y-2">
                        {stats.recentQuizzes.slice(0, 3).map((quiz: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{quiz.quizTitle || 'Quiz'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(quiz.completedAt).toLocaleDateString()} - {new Date(quiz.completedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant={quiz.percentage >= 80 ? 'default' : quiz.percentage >= 60 ? 'secondary' : 'destructive'}>
                                {quiz.percentage}%
                              </Badge>
                              <div className="text-right">
                                <p className="text-sm font-medium text-yellow-600">+{quiz.xpEarned} XP</p>
                                <p className="text-xs text-muted-foreground">{quiz.difficulty}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Link to Quiz page */}
                      <div className="mt-4 text-center">
                        <Link to="/quiz">
                          <Button variant="outline" className="w-full">
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Take Another Quiz
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Show message when no quiz history */}
                  {(!stats?.recentQuizzes || stats.recentQuizzes.length === 0) && (
                    <div className="mt-6 text-center p-6 bg-muted/20 rounded-lg">
                      <Trophy className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-medium mb-2">No Quiz History Yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take your first quiz to see your performance stats here!
                      </p>
                      <Link to="/quiz">
                        <Button>
                          <Gamepad2 className="w-4 h-4 mr-2" />
                          Start Your First Quiz
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Genre Knowledge Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Genre Knowledge</CardTitle>
                <CardDescription>Your expertise across different anime genres</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="genre" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Knowledge Score"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">Likes Given</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">38</p>
                <p className="text-sm text-muted-foreground">Comments Posted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Bookmark className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">Items Shared</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">#127</p>
                <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Mini Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See how you rank among other users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 125, name: 'AnimeFan2024', xp: 4250, change: '+2' },
                  { rank: 126, name: 'MangaLover', xp: 4180, change: '-1' },
                  { rank: 127, name: 'You', xp: stats.currentXP, change: '+5', isUser: true },
                  { rank: 128, name: 'OtakuMaster', xp: 4050, change: '+1' },
                  { rank: 129, name: 'AnimeExplorer', xp: 3980, change: '-3' }
                ].map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    player.isUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">#{player.rank}</span>
                      <span className={`font-medium ${player.isUser ? 'text-primary' : ''}`}>
                        {player.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{player.xp} XP</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        player.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {player.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/leaderboard">
                  <Button variant="outline" size="sm">
                    View Full Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates on badges, reviews, and new releases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: 'badge', title: 'New Badge Unlocked!', message: 'You earned the "Streak Warrior" badge', time: '2 hours ago' },
                  { type: 'review', title: 'New Review Available', message: 'Attack on Titan Season 4 review by CriticMaster', time: '5 hours ago' },
                  { type: 'release', title: 'New Episode Alert', message: 'Demon Slayer Episode 12 is now available', time: '1 day ago' }
                ].map((notification, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'review' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {notification.type === 'badge' ? <Award className="w-4 h-4" /> :
                       notification.type === 'review' ? <Star className="w-4 h-4" /> :
                       <Eye className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}