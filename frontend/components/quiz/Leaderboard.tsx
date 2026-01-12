// src/components/quiz/Leaderboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { User } from '@/types/quiz';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Bot users for populating leaderboard
  const botUsers: User[] = [
    { id: 'bot-1', name: 'OtakuMaster', totalXP: 15420, quizzesCompleted: 87, averageScore: 94.5, rank: 1 },
    { id: 'bot-2', name: 'AnimeExpert', totalXP: 12850, quizzesCompleted: 76, averageScore: 91.2, rank: 2 },
    { id: 'bot-3', name: 'MangaKing', totalXP: 10950, quizzesCompleted: 63, averageScore: 88.7, rank: 3 },
    { id: 'bot-4', name: 'TokyoFan', totalXP: 8750, quizzesCompleted: 52, averageScore: 85.3, rank: 4 },
    { id: 'bot-5', name: 'NinjaWiz', totalXP: 7320, quizzesCompleted: 41, averageScore: 82.1, rank: 5 }
  ];

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUser();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = () => {
    const data = localStorage.getItem('leaderboard');
    let realUsers: User[] = data ? JSON.parse(data) : [];
    
    const combinedUsers = [...realUsers, ...botUsers]
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 10);
    
    combinedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    setLeaderboard(combinedUsers);
  };

  const loadCurrentUser = () => {
    const data = localStorage.getItem('currentUser');
    if (data) {
      setCurrentUser(JSON.parse(data));
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-500" />;
      case 3: return <Award className="w-5 h-5 text-yellow-600" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatXP = (xp: number) => {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current User Status */}
        {currentUser && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{currentUser.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your Stats</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {formatXP(currentUser.totalXP)} XP
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Rank #{currentUser.rank || 'Unranked'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-gray-500 text-sm">Loading leaderboard...</p>
            </div>
          ) : (
            leaderboard.slice(0, 5).map((user) => {
              const isCurrentUser = user.id === currentUser?.id;
              const isBot = user.id.startsWith('bot-');
              
              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrentUser
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6">
                        {user.rank <= 3 ? getRankIcon(user.rank) : <span className="text-sm font-bold">#{user.rank}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          isBot ? 'bg-gray-500' : 'bg-blue-600'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-sm">{user.name}</h3>
                            {isBot && <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">BOT</span>}
                            {isCurrentUser && <span className="text-xs bg-blue-500 text-white px-1 rounded">YOU</span>}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {user.quizzesCompleted} quizzes • {user.averageScore.toFixed(1)}% avg
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">
                        {formatXP(user.totalXP)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">XP</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* XP Rewards Info */}
        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-sm mb-2">🎖️ XP Rewards</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>🥇 90%+ Score: <span className="font-bold text-yellow-600">200 XP</span></div>
            <div>🥈 80%+ Score: <span className="font-bold text-gray-600">100 XP</span></div>
            <div>🥉 70%+ Score: <span className="font-bold text-yellow-600">50 XP</span></div>
            <div>📝 Completion: <span className="font-bold text-blue-600">20 XP</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};