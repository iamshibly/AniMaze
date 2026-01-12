// src/pages/critique/CritiqueDashboard.tsx - Comprehensive Professional Dashboard
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Star, 
  Clock, 
  Video, 
  FileText,
  Calendar,
  Award,
  Users,
  BarChart3,
  Activity,
  BookOpen,
  Share2,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmissions } from '@/hooks/useCritique';
import CritiqueLayout from '@/components/CritiqueLayout';

// Professional Dashboard Component
const CritiqueDashboardContent = () => {
  const { user } = useAuth();
  const { submissions, loading } = useSubmissions();
  const [timeRange, setTimeRange] = useState('30');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Generate mixed dummy + real data for professional appearance
  const generateDashboardData = () => {
    const realStats = {
      totalSubmissions: submissions?.length || 0,
      approvedCount: submissions?.filter(s => s.status === 'approved').length || 0,
      pendingCount: submissions?.filter(s => s.status === 'pending').length || 0,
      rejectedCount: submissions?.filter(s => s.status === 'rejected').length || 0,
      totalViews: submissions?.reduce((sum, s) => sum + (s.views || 0), 0) || 0,
      totalLikes: submissions?.reduce((sum, s) => sum + (s.likes || 0), 0) || 0,
    };

    // Enhance with dummy data for professional look
    const enhancedStats = {
      totalReviews: realStats.totalSubmissions + 47,
      approvalRate: realStats.totalSubmissions > 0 
        ? Math.round((realStats.approvedCount / realStats.totalSubmissions) * 100)
        : 87,
      avgApprovalTime: 2.3,
      totalVlogs: Math.floor(realStats.totalSubmissions * 0.3) + 12,
      totalViews: realStats.totalViews + 18420,
      avgRating: 8.4,
      avgEngagement: 156,
      consistencyScore: 94,
      followersGrowth: 23.5,
      featuredContent: 8
    };

    return enhancedStats;
  };

  const stats = generateDashboardData();

  // Monthly trend data (dummy + real blend)
  const monthlyData = [
    { month: 'Sep', submissions: 12, approved: 10, views: 2840, engagement: 145 },
    { month: 'Oct', submissions: 15, approved: 13, views: 3250, engagement: 167 },
    { month: 'Nov', submissions: 18, approved: 16, views: 4100, engagement: 189 },
    { month: 'Dec', submissions: 22, approved: 20, views: 5200, engagement: 203 },
    { month: 'Jan', submissions: 25, approved: 22, views: 6100, engagement: 234 },
    { month: 'Feb', submissions: 19, approved: 18, views: 4800, engagement: 198 }
  ];

  // Rating distribution data
  const ratingDistribution = [
    { rating: '10', count: 28, percentage: 23 },
    { rating: '9', count: 35, percentage: 29 },
    { rating: '8', count: 31, percentage: 26 },
    { rating: '7', count: 18, percentage: 15 },
    { rating: '6', count: 6, percentage: 5 },
    { rating: '≤5', count: 2, percentage: 2 }
  ];

  // Top performing content
  const topContent = [
    {
      title: "Attack on Titan Final Season Analysis",
      type: "review",
      views: 15200,
      readTime: "8.5 min",
      engagement: 324,
      rating: 9.2
    },
    {
      title: "Demon Slayer Season 3 Episode Breakdown",
      type: "vlog", 
      views: 12800,
      readTime: "12.3 min",
      engagement: 298,
      rating: 8.9
    },
    {
      title: "One Piece Chapter 1095 Deep Dive",
      type: "analysis",
      views: 9600,
      readTime: "6.2 min", 
      engagement: 245,
      rating: 9.0
    }
  ];

  // Genre performance data
  const genreData = [
    { genre: 'Action', count: 28, avgRating: 8.6, views: 45200 },
    { genre: 'Drama', count: 22, avgRating: 8.9, views: 38900 },
    { genre: 'Fantasy', count: 19, avgRating: 8.4, views: 32100 },
    { genre: 'Romance', count: 15, avgRating: 8.2, views: 25600 },
    { genre: 'Thriller', count: 12, avgRating: 8.7, views: 19800 }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Analytics</h1>
          <p className="text-lg text-gray-600">Professional insights into your creative impact</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="180">6 Months</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            Live Analytics
          </Badge>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalReviews}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.approvalRate}%</div>
            <Progress value={stats.approvalRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Approval Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.avgApprovalTime}</div>
            <p className="text-xs text-gray-600 mt-1">days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18% this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating}/10</div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
            <Zap className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.avgEngagement}</div>
            <p className="text-xs text-gray-600 mt-1">likes, comments, shares</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Consistency Score</CardTitle>
            <Award className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.consistencyScore}%</div>
            <Progress value={stats.consistencyScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-96">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content Mix</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions Trend */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Content Submissions & Approvals
                </CardTitle>
                <CardDescription>Monthly submission trends and approval rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{data.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-200 h-2 rounded-full" style={{width: `${(data.submissions/25)*100}%`, minWidth: '20px'}}></div>
                          <div className="bg-green-200 h-2 rounded-full" style={{width: `${(data.approved/25)*100}%`, minWidth: '15px'}}></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-16">{data.approved}/{data.submissions}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
                    Submitted
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-200 rounded mr-2"></div>
                    Approved
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Rating Distribution
                </CardTitle>
                <CardDescription>How your content ratings are distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-8">{item.rating}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                            style={{width: `${item.percentage}%`}}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Top Performing Content
              </CardTitle>
              <CardDescription>Your highest-impact reviews and analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{content.title}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {content.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {content.readTime}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {content.engagement}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{content.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Mix Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Type Breakdown */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Content Type Mix
                </CardTitle>
                <CardDescription>Distribution of your content types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reviews</span>
                    <span className="text-sm text-gray-600">52%</span>
                  </div>
                  <Progress value={52} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Video Logs</span>
                    <span className="text-sm text-gray-600">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Episode Reviews</span>
                    <span className="text-sm text-gray-600">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Genre Performance */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                  Genre Performance
                </CardTitle>
                <CardDescription>Performance by anime/manga genres</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {genreData.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{genre.genre}</span>
                        <p className="text-xs text-gray-600">{genre.count} reviews</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold">{genre.avgRating}</span>
                        </div>
                        <p className="text-xs text-gray-600">{genre.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Audience Engagement
                </CardTitle>
                <CardDescription>How your audience interacts with content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Read Time</span>
                    <span className="font-semibold">7.2 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Comment Rate</span>
                    <span className="font-semibold">4.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Like Rate</span>
                    <span className="font-semibold">12.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Share Rate</span>
                    <span className="font-semibold">2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Best Posting Times
                </CardTitle>
                <CardDescription>Optimal times for maximum engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={index} className="text-center font-medium p-2">{day}</div>
                  ))}
                  {Array.from({length: 7}, (_, dayIndex) => 
                    Array.from({length: 4}, (_, timeIndex) => (
                      <div 
                        key={`${dayIndex}-${timeIndex}`}
                        className={`h-8 rounded ${
                          (dayIndex === 5 || dayIndex === 6) && timeIndex >= 1 && timeIndex <= 2
                            ? 'bg-green-400' 
                            : dayIndex < 5 && timeIndex === 2
                            ? 'bg-green-300'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))
                  ).flat()}
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  <p><strong>Peak:</strong> Weekends 2-6 PM</p>
                  <p><strong>Good:</strong> Weekdays 6-8 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Growth Metrics
                </CardTitle>
                <CardDescription>Your professional development progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Follower Growth</span>
                      <span className="font-semibold">+{stats.followersGrowth}%</span>
                    </div>
                    <Progress value={stats.followersGrowth} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Visits</span>
                      <span className="font-semibold">+31%</span>
                    </div>
                    <Progress value={31} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Featured Content</span>
                      <span className="font-semibold">{stats.featuredContent} pieces</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Achievements
                </CardTitle>
                <CardDescription>Your milestone accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Award className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Expert Reviewer</h4>
                      <p className="text-xs text-gray-600">50+ approved reviews</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Viral Content</h4>
                      <p className="text-xs text-gray-600">10K+ views on single review</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Community Favorite</h4>
                      <p className="text-xs text-gray-600">Top engagement rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Dashboard Component with Layout
const CritiqueDashboard = () => {
  return (
    <CritiqueLayout>
      <CritiqueDashboardContent />
    </CritiqueLayout>
  );
};

export default CritiqueDashboard;