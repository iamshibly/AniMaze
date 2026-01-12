import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import {
  Users,
  TrendingUp,
  DollarSign,
  Trophy,
  BookOpen,
  Play,
  Brain,
  Star,
  UserCheck,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Globe,
  Zap,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Shield,
  Gauge
} from 'lucide-react';
import { AuthService } from '@/lib/auth'; // ADD THIS IMPORT
import PendingApprovals from '@/components/admin/PendingApprovals'; // ADD THIS IMPORT

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      setAdminUser(JSON.parse(stored));
    }
  }, []);

  // Generate comprehensive mixed data (dummy + real blended seamlessly)
  const generateDashboardData = () => {
    const baseUsers = 1238;
    const activeDaily = 42;
    const activeWeekly = 932;
    const activeMonthly = 5456;
    const critics = 234;
    const activeCritics = 156;
    const revenue = 894750; // BDT
    const arpu = Math.floor(revenue / baseUsers * 12); // Monthly ARPU
    const churnRate = 3.2;
    const uptime = 99.97;
    const avgLoadTime = 1.42;
    
    // ADD THIS: Get pending approvals from real auth system
    const pendingUsers = AuthService.getPendingUsers();
    const pendingApprovals = pendingUsers.length;

    return {
      // Top KPIs
      totalUsers: baseUsers,
      activeDaily,
      activeWeekly,
      activeMonthly,
      totalCritics: critics,
      activeCritics,
      totalRevenue: revenue,
      revenueGrowth: 18.4,
      arpu,
      churnRate,
      serverUptime: uptime,
      avgPageLoad: avgLoadTime,
      pendingApprovals, // ADD THIS LINE
      
      // Growth trends
      userGrowthData: [
        { month: 'Jan', signups: 847, active: 3200, paying: 180 },
        { month: 'Feb', signups: 923, active: 3650, paying: 210 },
        { month: 'Mar', signups: 1156, active: 4100, paying: 245 },
        { month: 'Apr', signups: 1034, active: 4350, paying: 267 },
        { month: 'May', signups: 1289, active: 4650, paying: 289 },
        { month: 'Jun', signups: 1456, active: 4832, paying: 312 }
      ],
      
      // User funnel
      funnelData: [
        { name: 'Visitors', value: 45670, fill: '#8884d8' },
        { name: 'Registered', value: baseUsers, fill: '#82ca9d' },
        { name: 'Active', value: activeMonthly, fill: '#ffc658' },
        { name: 'Paying', value: 3247, fill: '#ff7300' }
      ],
      
      // Cohort retention
      retentionData: [
        { period: 'Day 1', users: 100, retained: 87 },
        { period: 'Day 7', users: 100, retained: 65 },
        { period: 'Day 30', users: 100, retained: 42 },
        { period: 'Day 90', users: 100, retained: 28 }
      ],
      
      // Critic submissions
      criticSubmissions: [
        { month: 'Jan', pending: 45, approved: 123, rejected: 23 },
        { month: 'Feb', pending: 52, approved: 134, rejected: 18 },
        { month: 'Mar', pending: 38, approved: 156, rejected: 15 },
        { month: 'Apr', pending: 61, approved: 142, rejected: 21 },
        { month: 'May', pending: 47, approved: 167, rejected: 19 },
        { month: 'Jun', pending: 55, approved: 178, rejected: 12 }
      ],
      
      // Top critics
      topCritics: [
        { name: 'Ahmed Rahman', submissions: 45, approvals: 42, views: 15420, engagement: 8.9 },
        { name: 'Sarah Khan', submissions: 38, approvals: 35, views: 12890, engagement: 8.7 },
        { name: 'Rahul Das', submissions: 41, approvals: 36, views: 11654, engagement: 8.5 },
        { name: 'Nisha Aktar', submissions: 33, approvals: 31, views: 9876, engagement: 8.3 },
        { name: 'Tanvir Islam', submissions: 29, approvals: 27, views: 8543, engagement: 8.1 }
      ],
      
      // Revenue breakdown
      subscriptionTiers: [
        { tier: 'Bronze', users: 1234, revenue: 185100, color: '#CD7F32' },
        { tier: 'Silver', users: 1567, revenue: 391750, color: '#C0C0C0' },
        { tier: 'Gold', users: 892, revenue: 267600, color: '#FFD700' },
        { tier: 'Diamond', users: 234, revenue: 105300, color: '#B9F2FF' }
      ],
      
      // Platform usage
      platformActivity: [
        { activity: 'Anime Watched', count: 234567, growth: 12.4 },
        { activity: 'Manga Read', count: 156789, growth: 8.7 },
        { activity: 'Quizzes Played', count: 45623, growth: 15.2 },
        { activity: 'Reviews Posted', count: 23456, growth: 22.1 }
      ],
      
      // Activity heatmap data
      heatmapData: Array.from({ length: 7 }, (_, day) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          value: Math.floor(Math.random() * 100) + 20
        }))
      })),
      
      // Geographic data
      geoData: [
        { country: 'Bangladesh', users: 8947, percentage: 71.8 },
        { country: 'India', users: 1823, percentage: 14.6 },
        { country: 'Pakistan', users: 734, percentage: 5.9 },
        { country: 'Nepal', users: 456, percentage: 3.7 },
        { country: 'Others', users: 498, percentage: 4.0 }
      ],
      
      // System health
      systemAlerts: [
        { type: 'info', message: 'Database optimization completed', time: '2 hours ago' },
        { type: 'warning', message: 'High memory usage on server-02', time: '4 hours ago' },
        { type: 'success', message: 'Backup completed successfully', time: '6 hours ago' },
        { type: 'error', message: 'Failed payment webhook resolved', time: '8 hours ago' }
      ],
      
      // Recent activity
      recentActivity: [
        { action: 'New anime added', item: 'Demon Slayer: Infinity Castle', time: '1 hour ago', type: 'content' },
        { action: 'Quiz created', item: 'Naruto Character Quiz Advanced', time: '3 hours ago', type: 'quiz' },
        { action: 'User reported', item: 'Inappropriate review flagged and removed', time: '5 hours ago', type: 'moderation' },
        { action: 'Premium subscriptions', item: '23 new Diamond tier subscriptions', time: '7 hours ago', type: 'revenue' },
        { action: 'Critic approved', item: 'New critic application accepted', time: '9 hours ago', type: 'critic' }
      ]
    };
  };

  const data = generateDashboardData();

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // ADD THIS: Handle refresh from PendingApprovals component
  const handleRefresh = () => {
    refreshData();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'content': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <Brain className="h-4 w-4" />;
      case 'moderation': return <Shield className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'critic': return <UserCheck className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Welcome back, {adminUser?.role || 'Admin'} • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={refreshData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* ADD THIS: Priority Alert - Pending Approvals */}
      {data.pendingApprovals > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">
                    Pending User Approvals
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {data.pendingApprovals} users waiting for account approval
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                Action Required
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Registered Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.totalUsers.toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12.4%</span>
              <span className="text-sm text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* ADD THIS: Pending Approvals Card */}
        <Card className={data.pendingApprovals > 0 ? "border-yellow-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            <Clock className={`h-5 w-5 ${data.pendingApprovals > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${data.pendingApprovals > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
              {data.pendingApprovals}
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Awaiting review</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.activeMonthly.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Daily: {data.activeDaily.toLocaleString()} • Weekly: {data.activeWeekly.toLocaleString()}
            </div>
            <Progress value={(data.activeMonthly / data.totalUsers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        {/* Critics */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Critics</CardTitle>
            <UserCheck className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.totalCritics}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Active: {data.activeCritics} ({Math.round((data.activeCritics / data.totalCritics) * 100)}%)
            </div>
            <Progress value={(data.activeCritics / data.totalCritics) * 100} className="mt-2" />
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue (MTD)</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">৳{(data.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">+{data.revenueGrowth}%</span>
              <span className="text-sm text-muted-foreground ml-1">YTD growth</span>
            </div>
          </CardContent>
        </Card>

        {/* ARPU */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ARPU (Monthly)</CardTitle>
            <Target className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">৳{data.arpu}</div>
            <div className="text-sm text-muted-foreground mt-1">Average revenue per user</div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Churn Rate (30d)</CardTitle>
            <Percent className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.churnRate}%</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">-0.8%</span>
              <span className="text-sm text-muted-foreground ml-1">improved</span>
            </div>
          </CardContent>
        </Card>

        {/* Server Uptime */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Server Uptime</CardTitle>
            <Server className="h-5 w-5 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.serverUptime}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              Avg load: {data.avgPageLoad}s
            </div>
          </CardContent>
        </Card>

        {/* Page Load Performance */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Page Load</CardTitle>
            <Gauge className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.avgPageLoad}s</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">-0.3s</span>
              <span className="text-sm text-muted-foreground ml-1">faster</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ADD THIS: Pending Approvals Section */}
      <PendingApprovals onRefresh={handleRefresh} />

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="critics">Critic Activity</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Platform Usage</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        {/* User Growth & Retention Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Daily, weekly, and monthly user signups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="signups" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="active" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="paying" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Funnel */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  User Conversion Funnel
                </CardTitle>
                <CardDescription>Visitor to subscriber conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.funnelData.map((stage, index) => {
                    const percentage = index === 0 ? 100 : (stage.value / data.funnelData[0].value) * 100;
                    return (
                      <div key={stage.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{stage.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {stage.value.toLocaleString()} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-3" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cohort Retention */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-600" />
                  Cohort Retention Analysis
                </CardTitle>
                <CardDescription>User retention at key intervals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.retentionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                    <Line 
                      type="monotone" 
                      dataKey="retained" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Critic Activity Tab */}
        <TabsContent value="critics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critic Submissions Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
                  Critic Submissions Over Time
                </CardTitle>
                <CardDescription>Pending, approved, and rejected submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.criticSubmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                    <Bar dataKey="approved" stackId="a" fill="#10b981" name="Approved" />
                    <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Approval Time Trend */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Average Approval Time
                </CardTitle>
                <CardDescription>Time taken to review submissions (hours)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', hours: 48 },
                    { month: 'Feb', hours: 36 },
                    { month: 'Mar', hours: 24 },
                    { month: 'Apr', hours: 18 },
                    { month: 'May', hours: 12 },
                    { month: 'Jun', hours: 8 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Critics Table */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                  Top Critics Rankings
                </CardTitle>
                <CardDescription>Critics ranked by engagement and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Critic Name</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Approval Rate</TableHead>
                      <TableHead>Total Views</TableHead>
                      <TableHead>Engagement Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topCritics.map((critic, index) => (
                      <TableRow key={critic.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">#{index + 1}</Badge>
                            {critic.name}
                          </div>
                        </TableCell>
                        <TableCell>{critic.submissions}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {Math.round((critic.approvals / critic.submissions) * 100)}%
                            <Progress 
                              value={(critic.approvals / critic.submissions) * 100} 
                              className="ml-2 w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{critic.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {critic.engagement}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Tiers */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                  Revenue by Subscription Tier
                </CardTitle>
                <CardDescription>Distribution across Bronze, Silver, Gold, Diamond</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.subscriptionTiers}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tier, users }) => `${tier}: ${users}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {data.subscriptionTiers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Recurring Revenue */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Monthly Recurring Revenue
                </CardTitle>
                <CardDescription>MRR growth trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', mrr: 67800, growth: 12 },
                    { month: 'Feb', mrr: 72400, growth: 15 },
                    { month: 'Mar', mrr: 78900, growth: 18 },
                    { month: 'Apr', mrr: 84200, growth: 16 },
                    { month: 'May', mrr: 91600, growth: 22 },
                    { month: 'Jun', mrr: 98700, growth: 19 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, 'MRR']} />
                    <Area 
                      type="monotone" 
                      dataKey="mrr" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue KPI Cards */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
                <CardDescription>Key revenue metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">XP Redemptions</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Failed Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ArrowDownRight className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">Refunds Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Usage & Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Platform Activity Overview
                </CardTitle>
                <CardDescription>Anime watched, manga read, quizzes played</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.platformActivity} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="activity" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  Users by Country
                </CardTitle>
                <CardDescription>Geographic distribution of active users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.geoData.map((country, index) => (
                    <div key={country.country} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{country.country}</span>
                        <span className="text-sm text-muted-foreground">
                          {country.users.toLocaleString()} ({country.percentage}%)
                        </span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Heatmap */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Peak Activity Hours Heatmap
                </CardTitle>
                <CardDescription>User activity patterns by day and time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Days</span>
                    <div className="flex items-center space-x-2">
                      <span>Low</span>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-gray-100 rounded"></div>
                        <div className="w-3 h-3 bg-blue-200 rounded"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                        <div className="w-3 h-3 bg-blue-800 rounded"></div>
                      </div>
                      <span>High</span>
                    </div>
                  </div>
                  
                  {data.heatmapData.map((day) => (
                    <div key={day.day} className="flex items-center space-x-2">
                      <div className="w-12 text-sm font-medium">{day.day}</div>
                      <div className="flex space-x-1">
                        {day.hours.map((hour) => (
                          <div
                            key={hour.hour}
                            className={`w-4 h-4 rounded ${
                              hour.value < 30 ? 'bg-gray-100' :
                              hour.value < 50 ? 'bg-blue-200' :
                              hour.value < 70 ? 'bg-blue-400' :
                              hour.value < 90 ? 'bg-blue-600' : 'bg-blue-800'
                            }`}
                            title={`${day.day} ${hour.hour}:00 - Activity: ${hour.value}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health KPIs */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-cyan-600" />
                  System Performance
                </CardTitle>
                <CardDescription>Real-time system health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Server Uptime</span>
                      <span className="text-sm text-green-600 font-medium">{data.serverUptime}%</span>
                    </div>
                    <Progress value={data.serverUptime} className="h-3" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Average Response Time</span>
                      <span className="text-sm text-blue-600 font-medium">{data.avgPageLoad}s</span>
                    </div>
                    <Progress value={100 - (data.avgPageLoad * 20)} className="h-3" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Concurrent Sessions</span>
                      <span className="text-sm text-purple-600 font-medium">2,847</span>
                    </div>
                    <Progress value={71} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  System Alerts & Notifications
                </CardTitle>
                <CardDescription>Recent system events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Rate Trend */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Error Rate Trend
                </CardTitle>
                <CardDescription>System error rates and downtime events over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={[
                    { time: '00:00', errors: 2, downtime: 0 },
                    { time: '04:00', errors: 1, downtime: 0 },
                    { time: '08:00', errors: 4, downtime: 2 },
                    { time: '12:00', errors: 3, downtime: 1 },
                    { time: '16:00', errors: 6, downtime: 0 },
                    { time: '20:00', errors: 2, downtime: 0 },
                    { time: '24:00', errors: 1, downtime: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="errors" 
                      stackId="1" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.6}
                      name="Errors"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="downtime" 
                      stackId="2" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.6}
                      name="Downtime (min)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Platform Activity
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
          <CardDescription>Latest updates and activities across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.item}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}