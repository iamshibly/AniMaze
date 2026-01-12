import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types/quiz';
import { Zap, Award } from 'lucide-react';

export const XPTracker = () => {
  const [user, setUser] = useState<User | null>(null);
  const [xpProgress, setXPProgress] = useState(0);

  useEffect(() => {
    loadUser();
    const interval = setInterval(loadUser, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = () => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      
      // Calculate user's rank if not set
      if (!currentUser.rank || currentUser.rank === 0) {
        const leaderboardData = localStorage.getItem('leaderboard');
        const leaderboard: User[] = leaderboardData ? JSON.parse(leaderboardData) : [];
        
        // Find user's position in leaderboard
        const userRankIndex = leaderboard.findIndex(u => u.id === currentUser.id);
        const calculatedRank = userRankIndex >= 0 ? userRankIndex + 1 : null;
        
        if (calculatedRank) {
          currentUser.rank = calculatedRank;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      }
      
      setUser(currentUser);
      calculateProgress(currentUser.totalXP);
    }
  };

  const calculateProgress = (xp: number) => {
    const currentLevel = Math.floor(xp / 1000);
    const xpInCurrentLevel = xp % 1000;
    const progressPercentage = (xpInCurrentLevel / 1000) * 100;
    setXPProgress(progressPercentage);
  };

  const getLevel = (xp: number) => Math.floor(xp / 1000) + 1;
  const getXPToNextLevel = (xp: number) => 1000 - (xp % 1000);

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Anime Legend';
    if (level >= 25) return 'Manga Master';
    if (level >= 15) return 'Otaku Expert';
    if (level >= 10) return 'Quiz Veteran';
    if (level >= 5) return 'Rising Star';
    return 'Anime Newbie';
  };

  const getLevelIcon = (level: number) => {
    if (level >= 50) return '👑';
    if (level >= 25) return '🌟';
    if (level >= 15) return '🔥';
    if (level >= 10) return '⚡';
    if (level >= 5) return '🚀';
    return '👶';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading XP tracker...</p>
        </CardContent>
      </Card>
    );
  }

  const currentLevel = getLevel(user.totalXP);
  const xpToNext = getXPToNextLevel(user.totalXP);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          XP Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level and XP Display */}
        <div className="text-center">
          <div className="text-3xl mb-1">{getLevelIcon(currentLevel)}</div>
          <div className="text-lg font-bold">Level {currentLevel}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {getLevelTitle(currentLevel)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {user.totalXP} XP • {xpToNext} XP to next level
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
            <div className="text-lg font-bold text-green-600">{user.quizzesCompleted}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Quizzes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
            <div className="text-lg font-bold text-yellow-600">{user.averageScore.toFixed(0)}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Score</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800">
            <div className="text-lg font-bold text-purple-600">
              #{user.rank && user.rank > 0 ? user.rank : '--'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rank</div>
          </div>
        </div>

        {/* Achievement Hint */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Next Milestone</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentLevel < 5 && 'Complete 5 more quizzes to become a Rising Star! 🚀'}
            {currentLevel >= 5 && currentLevel < 10 && 'Keep going to become a Quiz Veteran! ⚡'}
            {currentLevel >= 10 && currentLevel < 15 && 'You\'re on your way to Otaku Expert! 🔥'}
            {currentLevel >= 15 && currentLevel < 25 && 'Almost a Manga Master! 🌟'}
            {currentLevel >= 25 && currentLevel < 50 && 'Legend status awaits! 👑'}
            {currentLevel >= 50 && 'You are a true Anime Legend! 👑'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};