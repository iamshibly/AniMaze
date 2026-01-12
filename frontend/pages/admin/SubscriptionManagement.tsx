// src/pages/admin/SubscriptionManagement.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Search,
  Crown,
  Gem,
  Award,
  Shield,
  CreditCard,
  Coins,
  Eye
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { subscriptionService } from '@/lib/subscriptionService';
import { SubscriptionStats, BadgeType, PaymentGateway, BADGE_PLANS, PAYMENT_GATEWAYS } from '@/types/subscription';

const SubscriptionManagement: React.FC = () => {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState<BadgeType | 'all'>('all');
  const [filterGateway, setFilterGateway] = useState<PaymentGateway | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const subscriptionStats = subscriptionService.getSubscriptionStats();
    setStats(subscriptionStats);
    
    // Load detailed data (in real app, these would be API calls)
    const allSubs = JSON.parse(localStorage.getItem('anime_subscriptions') || '[]');
    const allTxns = JSON.parse(localStorage.getItem('anime_transactions') || '[]');
    const allRedemptions = JSON.parse(localStorage.getItem('anime_xp_redemptions') || '[]');
    
    setSubscriptions(allSubs);
    setTransactions(allTxns);
    setRedemptions(allRedemptions);
  };

  const getBadgeIcon = (badgeType: BadgeType) => {
    switch (badgeType) {
      case 'diamond': return <Gem className="w-4 h-4" />;
      case 'gold': return <Crown className="w-4 h-4" />;
      case 'silver': return <Award className="w-4 h-4" />;
      case 'bronze': return <Shield className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const exportData = (type: 'subscriptions' | 'transactions' | 'redemptions') => {
    let data, filename;
    
    switch (type) {
      case 'subscriptions':
        data = subscriptions;
        filename = 'subscriptions';
        break;
      case 'transactions':
        data = transactions;
        filename = 'transactions';
        break;
      case 'redemptions':
        data = redemptions;
        filename = 'xp_redemptions';
        break;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0] || {}).join(',') + '\n'
      + data.map(row => Object.values(row).join(',')).join('\n');
    
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  if (!stats) {
    return <div className="p-6">Loading subscription data...</div>;
  }

  // Chart data
  const revenueByBadge = Object.entries(stats.subscriptionsByBadge).map(([badge, count]) => ({
    badge: BADGE_PLANS[badge as BadgeType].name,
    count,
    revenue: count * BADGE_PLANS[badge as BadgeType].price,
    color: BADGE_PLANS[badge as BadgeType].color
  }));

  const revenueByGateway = Object.entries(stats.revenueByGateway).map(([gateway, revenue]) => ({
    gateway: PAYMENT_GATEWAYS[gateway as PaymentGateway]?.name || gateway,
    revenue,
    percentage: Math.round((revenue / stats.totalRevenue) * 100)
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Monitor badges, payments, and XP redemptions</p>
        </div>
        <Button onClick={() => exportData('transactions')}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.trialConversions}% trial conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XP Redemptions</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.xpRedemptions}</div>
            <p className="text-xs text-muted-foreground">
              Free badge activations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.averageRevenuePerUser}</div>
            <p className="text-xs text-muted-foreground">
              Per paying user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Badge Type</CardTitle>
            <CardDescription>Income distribution across subscription tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByBadge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="badge" />
                <YAxis />
                <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Distribution</CardTitle>
            <CardDescription>Revenue share by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByGateway}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {revenueByGateway.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`৳${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="redemptions">XP Redemptions</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>All payment gateway transactions</CardDescription>
                </div>
                <Button onClick={() => exportData('transactions')} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterGateway} onValueChange={(value) => setFilterGateway(value as PaymentGateway | 'all')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gateways</SelectItem>
                    {Object.entries(PAYMENT_GATEWAYS).map(([key, gateway]) => (
                      <SelectItem key={key} value={key}>{gateway.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {transactions
                  .filter(txn => 
                    (filterGateway === 'all' || txn.gateway === filterGateway) &&
                    (searchTerm === '' || txn.id.includes(searchTerm) || txn.userId.includes(searchTerm))
                  )
                  .slice(0, 10)
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getBadgeIcon(transaction.badgeType)}
                          <Badge variant="secondary">{BADGE_PLANS[transaction.badgeType].name}</Badge>
                        </div>
                        <div>
                          <p className="font-mono text-sm">{transaction.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()} • 
                            {PAYMENT_GATEWAYS[transaction.gateway]?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">৳{transaction.amount}</p>
                        <Badge 
                          variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Currently active badge subscriptions</CardDescription>
                </div>
                <Button onClick={() => exportData('subscriptions')} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterBadge} onValueChange={(value) => setFilterBadge(value as BadgeType | 'all')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Badge Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Badges</SelectItem>
                    {Object.entries(BADGE_PLANS)
                      .filter(([key]) => key !== 'free' && key !== 'trial')
                      .map(([key, plan]) => (
                        <SelectItem key={key} value={key}>{plan.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {subscriptions
                  .filter(sub => sub.status === 'active')
                  .filter(sub => 
                    (filterBadge === 'all' || sub.badgeType === filterBadge) &&
                    (searchTerm === '' || sub.id.includes(searchTerm) || sub.userId.includes(searchTerm))
                  )
                  .slice(0, 10)
                  .map((subscription) => {
                    const daysLeft = Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
                    const isExpiringSoon = daysLeft <= 7;
                    
                    return (
                      <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getBadgeIcon(subscription.badgeType)}
                            <Badge variant="secondary">{BADGE_PLANS[subscription.badgeType].name}</Badge>
                            {subscription.redemptionMethod === 'xp_redemption' && (
                              <Badge variant="outline" className="text-purple-600">
                                <Coins className="w-3 h-3 mr-1" />
                                XP
                              </Badge>
                            )}
                          </div>
                          <div>
                            <p className="font-mono text-sm">{subscription.userId}</p>
                            <p className="text-xs text-muted-foreground">
                              Started: {new Date(subscription.startDate).toLocaleDateString()}
                              {subscription.paymentMethod && ` • ${PAYMENT_GATEWAYS[subscription.paymentMethod]?.name}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${isExpiringSoon ? 'text-red-600' : ''}`}>
                            {daysLeft} days left
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Until {new Date(subscription.endDate).toLocaleDateString()}
                          </p>
                          {isExpiringSoon && (
                            <Badge variant="destructive" className="mt-1">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redemptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>XP Redemptions</CardTitle>
                  <CardDescription>Badges redeemed using XP instead of payment</CardDescription>
                </div>
                <Button onClick={() => exportData('redemptions')} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search XP redemptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {redemptions
                  .filter(redemption => 
                    searchTerm === '' || redemption.id.includes(searchTerm) || redemption.userId.includes(searchTerm)
                  )
                  .slice(0, 10)
                  .map((redemption) => (
                    <div key={redemption.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getBadgeIcon(redemption.badgeType)}
                          <Badge variant="secondary">{BADGE_PLANS[redemption.badgeType].name}</Badge>
                          <Badge variant="outline" className="text-purple-600">
                            <Coins className="w-3 h-3 mr-1" />
                            XP Redemption
                          </Badge>
                        </div>
                        <div>
                          <p className="font-mono text-sm">{redemption.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(redemption.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">-{redemption.xpSpent.toLocaleString()} XP</p>
                        <p className="text-xs text-muted-foreground">
                          {redemption.xpBalanceBefore.toLocaleString()} → {redemption.xpBalanceAfter.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              
              {redemptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No XP redemptions yet</p>
                  <p className="text-sm">XP redemptions will appear here when users redeem badges</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Administrative tools and bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Run expiry check manually
                subscriptionService.checkExpiringSubscriptions();
                loadData();
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Check Expiring Subscriptions
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              onClick={() => {
                // Generate test data
                const testUser = 'test_user_' + Date.now();
                const transaction = subscriptionService.initiatePayment(testUser, 'silver', 'bkash', '01700000000');
                subscriptionService.confirmPayment(transaction.id, 'admin_test_' + Date.now());
                loadData();
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Create Test Subscription
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear all data (dev only)
                if (confirm('Are you sure you want to clear all subscription data? This cannot be undone.')) {
                  localStorage.removeItem('anime_subscriptions');
                  localStorage.removeItem('anime_transactions');
                  localStorage.removeItem('anime_xp_redemptions');
                  localStorage.removeItem('anime_user_trials');
                  loadData();
                }
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Data (Dev)
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalSubscriptions}</div>
              <div className="text-xs text-green-700">Total Subscriptions</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.activeSubscriptions}</div>
              <div className="text-xs text-blue-700">Active Now</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.xpRedemptions}</div>
              <div className="text-xs text-purple-700">XP Redemptions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.trialConversions}%</div>
              <div className="text-xs text-orange-700">Trial Conversion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;