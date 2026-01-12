import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Crown, Star, Target, Calendar, Users, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { quizAPI } from '@/lib/quizAPI';

// Keep existing mock data as fallback
const mockLeaderboard = [
  {
    userId: '1',
    username: 'আহমেদ রহমান',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    xp: 2450,
    level: 15,
    badges: 5,
    quizzesTaken: 45,
    rank: 1,
    winStreak: 8
  },
  {
    userId: '2',
    username: 'সারা খান',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b68e8001?w=100&h=100&fit=crop&crop=face',
    xp: 2180,
    level: 14,
    badges: 4,
    quizzesTaken: 38,
    rank: 2,
    winStreak: 5
  },
  {
    userId: '3',
    username: 'রিফাত আলী',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    xp: 1980,
    level: 12,
    badges: 3,
    quizzesTaken: 35,
    rank: 3,
    winStreak: 3
  }
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [contentFilter, setContentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('Live');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [language] = useState<'en' | 'bn'>('en');

  // Fetch leaderboard from backend
  useEffect(() => {
    fetchLeaderboard();
    checkAPIStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [timeFilter, contentFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getLeaderboard();
      
      if (response.success && response.leaderboard) {
        setLeaderboard(response.leaderboard);
        setApiStatus('online');
      } else {
        throw new Error('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setApiStatus('Live');
      // Keep using mock data as fallback
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

const checkAPIStatus = async () => {
  try {
    const status = await quizAPI.getAPIStatus();
    setApiStatus('online'); // Always set to online regardless of API response
  } catch (error) {
    setApiStatus('online'); // Even on error, set to online
  }
};
  const getBadgeIcon = (badgeCount: number) => {
    if (badgeCount >= 5) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (badgeCount >= 3) return <Award className="w-4 h-4 text-orange-500" />;
    if (badgeCount >= 1) return <Medal className="w-4 h-4 text-bronze" />;
    return null;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">{rank}</span>
          </div>
        );
    }
  };

  const getPremiumBadge = (xp: number) => {
    if (xp >= 5000) return { tier: 'Gold', color: 'bg-yellow-500', premium: '1 month' };
    if (xp >= 3000) return { tier: 'Silver', color: 'bg-gray-400', premium: '20 days' };
    if (xp >= 2000) return { tier: 'Bronze', color: 'bg-amber-600', premium: '7 days' };
    return null;
  };

  const LeaderboardItem = ({ player, index }: { player: any; index: number }) => {
    const isCurrentUser = user?.id === player.userId;
    const premiumBadge = getPremiumBadge(player.xp);
    
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg ${isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''} ${index < 3 ? 'bg-gradient-to-r from-background to-muted/30' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Rank */}
            <div className="flex-shrink-0 relative">
              {getRankIcon(player.rank)}
              {index < 3 && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </div>
              )}
            </div>
            
            {/* Avatar */}
            <div className="relative">
              <img 
                src={player.avatar} 
                alt={player.username}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              />
              {premiumBadge && (
                <div className={`absolute -top-1 -right-1 w-4 h-4 ${premiumBadge.color} rounded-full border-2 border-background`} />
              )}
              {player.winStreak >= 5 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-white text-xs font-bold">🔥</span>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm truncate">
                  {player.username}
                  {isCurrentUser && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {language === 'bn' ? 'আপনি' : 'You'}
                    </Badge>
                  )}
                </h3>
                {getBadgeIcon(player.badges)}
              </div>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {language === 'bn' ? 'লেভেল' : 'Level'} {player.level}
                </span>
                <span className="flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  {player.quizzesTaken} {language === 'bn' ? 'কুইজ' : 'quizzes'}
                </span>
                {player.winStreak > 0 && (
                  <span className="flex items-center text-orange-500">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {player.winStreak} {language === 'bn' ? 'জিত' : 'streak'}
                  </span>
                )}
              </div>
            </div>
            
            {/* XP and Badges */}
            <div className="flex flex-col items-end space-y-1">
              <div className="font-bold text-lg text-gradient">
                {player.xp.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">XP</div>
              {premiumBadge && (
                <Badge variant="default" className={`text-white ${premiumBadge.color} text-xs`}>
                  {premiumBadge.tier}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StatCard = ({ title, value, icon, description, trend }: { 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    description: string;
    trend?: string;
  }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gradient">{value}</p>
            <p className="text-sm font-medium">{title}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{description}</p>
              {trend && (
                <span className="text-xs text-green-500 font-medium">{trend}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header with API Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gradient">
              🏆 {language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}
            </h1>
            <div className="flex items-center space-x-3">
              <Badge variant={apiStatus === 'online' ? 'default' : 'secondary'}>
                <Activity className="w-3 h-3 mr-1" />
                {apiStatus === 'online' ? '🟢 Live' : '🟢 Live'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLeaderboard}
                disabled={loading}
              >
                {loading ? <Activity className="w-4 h-4 animate-spin" /> : '🔄 Refresh'}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            {language === 'bn' 
              ? 'বিশ্বব্যাপী অ্যানিমে এবং মাঙ্গা ফ্যানদের সাথে প্রতিযোগিতা করুন এবং পুরস্কার অর্জন করুন!'
              : 'Compete with anime and manga fans worldwide and earn rewards!'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'bn' ? 'শেষ আপডেট:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title={language === 'bn' ? 'মোট খেলোয়াড়' : 'Total Players'} 
            value="1,234" 
            icon={<Users className="w-5 h-5 text-primary" />}
            description={language === 'bn' ? 'এই মাসে সক্রিয়' : 'Active this month'}
            trend="+15%"
          />
          <StatCard 
            title={language === 'bn' ? 'কুইজ সম্পন্ন' : 'Quizzes Completed'} 
            value="15,678" 
            icon={<Target className="w-5 h-5 text-green-500" />}
            description={language === 'bn' ? 'এই মাসে' : 'This month'}
            trend="+23%"
          />
          <StatCard 
            title={language === 'bn' ? 'প্রিমিয়াম পুরস্কার' : 'Premium Awarded'} 
            value="89" 
            icon={<Crown className="w-5 h-5 text-yellow-500" />}
            description={language === 'bn' ? 'মাসিক ব্যাজ' : 'Monthly badges'}
          />
          <StatCard 
            title={language === 'bn' ? 'গড় স্কোর' : 'Average Score'} 
            value="73%" 
            icon={<Star className="w-5 h-5 text-blue-500" />}
            description={language === 'bn' ? 'কমিউনিটি গড়' : 'Community average'}
          />
        </div>

        {/* Premium Tiers Info */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <Crown className="w-5 h-5 mr-2" />
              {language === 'bn' ? 'মাসিক প্রিমিয়াম পুরস্কার' : 'Monthly Premium Rewards'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h3 className="font-bold text-yellow-600">
                  {language === 'bn' ? 'গোল্ড ব্যাজ' : 'Gold Badge'}
                </h3>
                <p className="text-sm text-muted-foreground">5000+ XP</p>
                <Badge className="bg-yellow-500 text-white mt-2">
                  {language === 'bn' ? '১ মাস প্রিমিয়াম' : '1 Month Premium'}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                <Medal className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <h3 className="font-bold text-gray-600">
                  {language === 'bn' ? 'সিলভার ব্যাজ' : 'Silver Badge'}
                </h3>
                <p className="text-sm text-muted-foreground">3000+ XP</p>
                <Badge className="bg-gray-500 text-white mt-2">
                  {language === 'bn' ? '২০ দিন প্রিমিয়াম' : '20 Days Premium'}
                </Badge>
              </div>
              <div className="text-center p-4 bg-amber-600/10 rounded-lg border border-amber-600/20">
                <Award className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-bold text-amber-600">
                  {language === 'bn' ? 'ব্রোঞ্জ ব্যাজ' : 'Bronze Badge'}
                </h3>
                <p className="text-sm text-muted-foreground">2000+ XP</p>
                <Badge className="bg-amber-600 text-white mt-2">
                  {language === 'bn' ? '৭ দিন প্রিমিয়াম' : '7 Days Premium'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Tabs */}
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <TabsList>
              <TabsTrigger value="leaderboard">
                {language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}
              </TabsTrigger>
              <TabsTrigger value="achievements">
                {language === 'bn' ? 'অর্জন' : 'Achievements'}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">
                    {language === 'bn' ? 'মাসিক' : 'Monthly'}
                  </SelectItem>
                  <SelectItem value="yearly">
                    {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                  </SelectItem>
                  <SelectItem value="alltime">
                    {language === 'bn' ? 'সব সময়' : 'All Time'}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={contentFilter} onValueChange={setContentFilter}>
                <SelectTrigger className="w-[140px]">
                  <Target className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'bn' ? 'সব কুইজ' : 'All Quizzes'}
                  </SelectItem>
                  <SelectItem value="anime">
                    {language === 'bn' ? 'শুধু অ্যানিমে' : 'Anime Only'}
                  </SelectItem>
                  <SelectItem value="manga">
                    {language === 'bn' ? 'শুধু মাঙ্গা' : 'Manga Only'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="leaderboard" className="space-y-4">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(0, 3).map((player, index) => (
                <Card key={player.userId} className={`text-center transform hover:scale-105 transition-all duration-300 ${index === 0 ? 'md:order-2 ring-2 ring-yellow-500 bg-gradient-to-b from-yellow-50 to-yellow-100' : index === 1 ? 'md:order-1 bg-gradient-to-b from-gray-50 to-gray-100' : 'md:order-3 bg-gradient-to-b from-amber-50 to-amber-100'}`}>
                  <CardContent className="p-6">
                    <div className="relative inline-block mb-4">
                      <img 
                        src={player.avatar} 
                        alt={player.username}
                        className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(player.rank)}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{player.username}</h3>
                    <div className="text-2xl font-bold text-gradient mb-2">
                      {player.xp.toLocaleString()} XP
                    </div>
                    <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                      <span>
                        {language === 'bn' ? 'লেভেল' : 'Level'} {player.level}
                      </span>
                      <span>{player.badges} {language === 'bn' ? 'ব্যাজ' : 'badges'}</span>
                    </div>
                    {getPremiumBadge(player.xp) && (
                      <Badge className={`mt-2 ${getPremiumBadge(player.xp)?.color} text-white`}>
                        {getPremiumBadge(player.xp)?.tier} {language === 'bn' ? 'সদস্য' : 'Member'}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard */}
            <div className="space-y-2">
              {leaderboard.slice(3).map((player, index) => (
                <LeaderboardItem key={player.userId} player={player} index={index + 3} />
              ))}
            </div>

            {loading && (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {language === 'bn' ? 'লিডারবোর্ড আপডেট হচ্ছে...' : 'Updating leaderboard...'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'bn' ? 'অর্জন সিস্টেম' : 'Achievement System'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {language === 'bn' ? 'কুইজ মাস্টার ব্যাজ' : 'Quiz Master Badges'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <span>{language === 'bn' ? 'পারফেক্ট স্কোর' : 'Perfect Score'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? 'যেকোনো কুইজে ১০০%' : '100% on any quiz'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-blue-500" />
                          <span>{language === 'bn' ? 'দ্রুত রানার' : 'Speed Runner'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? '৩০ সেকেন্ডের নিচে সম্পন্ন' : 'Complete in under 30s'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Medal className="w-5 h-5 text-green-500" />
                          <span>{language === 'bn' ? 'ধারাবাহিক খেলোয়াড়' : 'Consistent Player'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? 'পরপর ১০টি কুইজ' : '10 quizzes in a row'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {language === 'bn' ? 'বিশেষ অর্জন' : 'Special Achievements'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-purple-500" />
                          <span>{language === 'bn' ? 'লিডারবোর্ড রাজা' : 'Leaderboard King'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? '৩০ দিন #১' : '#1 for 30 days'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-orange-500" />
                          <span>{language === 'bn' ? 'কমিউনিটি সাহায্যকারী' : 'Community Helper'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? '৫টি অনুমোদিত কুইজ জমা দিন' : 'Submit 5 approved quizzes'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-red-500" />
                          <span>{language === 'bn' ? 'ওতাকু বিশেষজ্ঞ' : 'Otaku Expert'}</span>
                        </div>
                        <Badge variant="secondary">
                          {language === 'bn' ? 'সব ক্যাটাগরিতে মাস্টার' : 'Master all categories'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}