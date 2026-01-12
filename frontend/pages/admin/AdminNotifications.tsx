// src/pages/admin/AdminNotifications.tsx - Enhanced with real-time features
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Bell, 
  Send,
  Users,
  Crown,
  Trophy,
  Zap,
  Info,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  Wifi,
  RefreshCw,
  AlertTriangle,
  Target,
  Megaphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { realtimeService } from '@/lib/realtimeService';
import type { RealtimeEvent, LiveNotificationStatus } from '@/lib/realtimeService';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'maintenance' | 'feature' | 'announcement';
  target_audience: 'all_users' | 'premium_users' | 'free_users' | 'critics' | 'admins';
  status: 'draft' | 'sent' | 'scheduled' | 'sending' | 'failed';
  created_at: string;
  sent_at?: string;
  scheduled_for?: string;
  total_recipients: number;
  read_count: number;
  created_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationForm {
  title: string;
  message: string;
  type: 'system' | 'maintenance' | 'feature' | 'announcement';
  target_audience: 'all_users' | 'premium_users' | 'free_users' | 'critics' | 'admins';
  schedule_type: 'immediate' | 'scheduled';
  scheduled_date?: string;
  scheduled_time?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const defaultForm: NotificationForm = {
  title: '',
  message: '',
  type: 'announcement',
  target_audience: 'all_users',
  schedule_type: 'immediate',
  priority: 'medium'
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<AdminNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<NotificationForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState<Map<string, LiveNotificationStatus>>(new Map());
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [liveStats, setLiveStats] = useState({
    total_sent_today: 0,
    avg_open_rate: 0,
    active_campaigns: 0,
    pending_notifications: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    initializeRealtimeService();
    
    return () => {
      realtimeService.destroy();
    };
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, statusFilter, typeFilter]);

  const initializeRealtimeService = () => {
    realtimeService.init();
    setRealtimeConnected(true);

    // Subscribe to notification sending updates
    const unsubscribeNotifications = realtimeService.subscribe('notification_sent', (event: RealtimeEvent) => {
      if (event.data.status) {
        const status: LiveNotificationStatus = event.data.status;
        setSendingNotifications(prev => new Map(prev.set(status.id, status)));
        
        // Update notification status in list
        if (status.status === 'sent') {
          setNotifications(prev => prev.map(notif => 
            notif.id === status.id 
              ? { ...notif, status: 'sent', sent_at: status.completed_at }
              : notif
          ));
          
          toast({
            title: "Notification sent successfully",
            description: `"${status.title}" was delivered to ${status.sent_count} recipients.`,
          });
        }
      }
    });

    // Subscribe to system updates for live stats
    const unsubscribeStats = realtimeService.subscribe('system_alert', (event: RealtimeEvent) => {
      if (event.data.metrics) {
        setLiveStats(prev => ({
          ...prev,
          total_sent_today: prev.total_sent_today + Math.floor(Math.random() * 3),
          avg_open_rate: 72 + Math.floor(Math.random() * 15),
          active_campaigns: sendingNotifications.size,
          pending_notifications: notifications.filter(n => n.status === 'scheduled').length
        }));
      }
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeStats();
    };
  };

  const loadNotifications = () => {
    const saved = localStorage.getItem('admin_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
    } else {
      // Initialize with enhanced sample data
      const sampleNotifications: AdminNotification[] = [
        {
          id: '1',
          title: 'Platform Maintenance Scheduled',
          message: 'We will be performing scheduled maintenance on our servers this weekend. Expect brief downtime.',
          type: 'maintenance',
          target_audience: 'all_users',
          status: 'sent',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          total_recipients: 1250,
          read_count: 890,
          created_by: 'admin',
          priority: 'high'
        },
        {
          id: '2',
          title: 'New Quiz System Available',
          message: 'Try our enhanced quiz system with new question types and improved scoring!',
          type: 'feature',
          target_audience: 'all_users',
          status: 'sent',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          sent_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          total_recipients: 1250,
          read_count: 1120,
          created_by: 'admin',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Weekend Anime Marathon Event',
          message: 'Join our special weekend marathon featuring the best anime series of 2024!',
          type: 'announcement',
          target_audience: 'premium_users',
          status: 'scheduled',
          created_at: new Date().toISOString(),
          scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          total_recipients: 320,
          read_count: 0,
          created_by: 'admin',
          priority: 'medium'
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('admin_notifications', JSON.stringify(sampleNotifications));
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    if (searchQuery) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(notif => notif.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notif => notif.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  };

  const createNotification = async () => {
    if (!form.title || !form.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newNotification: AdminNotification = {
        id: Date.now().toString(),
        title: form.title,
        message: form.message,
        type: form.type,
        target_audience: form.target_audience,
        status: form.schedule_type === 'immediate' ? 'sending' : 'scheduled',
        created_at: new Date().toISOString(),
        sent_at: form.schedule_type === 'immediate' ? new Date().toISOString() : undefined,
        scheduled_for: form.schedule_type === 'scheduled' && form.scheduled_date && form.scheduled_time 
          ? new Date(`${form.scheduled_date}T${form.scheduled_time}`).toISOString() 
          : undefined,
        total_recipients: getTargetAudienceCount(form.target_audience),
        read_count: 0,
        created_by: 'admin',
        priority: form.priority
      };

      const updated = [...notifications, newNotification];
      setNotifications(updated);
      localStorage.setItem('admin_notifications', JSON.stringify(updated));
      
      // If immediate, start real-time sending process
      if (form.schedule_type === 'immediate') {
        realtimeService.sendNotificationWithProgress(newNotification);
      }
      
      setForm(defaultForm);
      setIsCreating(false);
      
      toast({
        title: "Notification created",
        description: `Notification has been ${form.schedule_type === 'immediate' ? 'queued for sending' : 'scheduled'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendNotification = async (notification: AdminNotification) => {
    setLoading(true);
    try {
      const updatedNotification = {
        ...notification,
        status: 'sending' as const,
        sent_at: new Date().toISOString(),
        read_count: 0
      };

      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? updatedNotification : n
      ));

      // Start real-time sending process
      await realtimeService.sendNotificationWithProgress(updatedNotification);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend notification.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
    
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const duplicateNotification = (notification: AdminNotification) => {
    const duplicate: AdminNotification = {
      ...notification,
      id: Date.now().toString(),
      title: `Copy of ${notification.title}`,
      status: 'draft',
      created_at: new Date().toISOString(),
      sent_at: undefined,
      read_count: 0
    };

    const updated = [duplicate, ...notifications];
    setNotifications(updated);
    localStorage.setItem('admin_notifications', JSON.stringify(updated));
    
    toast({
      title: "Notification duplicated",
      description: "A copy has been created as a draft.",
    });
  };

  const getTargetAudienceCount = (audience: string): number => {
    const counts = {
      all_users: 1250,
      premium_users: 320,
      free_users: 930,
      critics: 45,
      admins: 8
    };
    return counts[audience as keyof typeof counts] || 0;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Info className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      case 'feature': return <Zap className="h-4 w-4" />;
      case 'announcement': return <Megaphone className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sending': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'draft': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      low: { variant: 'outline', className: 'text-gray-600 border-gray-300' },
      medium: { variant: 'default', className: 'bg-blue-100 text-blue-800' },
      high: { variant: 'default', className: 'bg-orange-100 text-orange-800' },
      urgent: { variant: 'destructive', className: 'bg-red-100 text-red-800' }
    };
    
    return variants[priority] || variants.medium;
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all_users': return <Users className="h-4 w-4" />;
      case 'premium_users': return <Crown className="h-4 w-4" />;
      case 'critics': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    drafts: notifications.filter(n => n.status === 'draft').length,
    sending: notifications.filter(n => n.status === 'sending').length
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header with Real-time Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-500" />
              Notification Management
              <Badge variant="outline" className={realtimeConnected ? "text-green-600 border-green-300" : "text-red-600 border-red-300"}>
                <Wifi className="h-3 w-3 mr-1" />
                {realtimeConnected ? 'Live' : 'Offline'}
              </Badge>
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage system notifications with real-time delivery tracking
            </p>
          </div>
          
          <Button onClick={() => setIsCreating(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </div>
      </div>

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center justify-between">
              Today's Sent
              <TrendingUp className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{liveStats.total_sent_today}</div>
            <p className="text-xs text-blue-600 mt-1">+{Math.floor(Math.random() * 5)} from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center justify-between">
              Open Rate
              <BarChart3 className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{liveStats.avg_open_rate}%</div>
            <Progress value={liveStats.avg_open_rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center justify-between">
              Active Campaigns
              <Activity className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.sending}</div>
            <p className="text-xs text-purple-600 mt-1">Currently sending</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center justify-between">
              Scheduled
              <Calendar className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.scheduled}</div>
            <p className="text-xs text-orange-600 mt-1">Pending delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Sending Progress */}
      {sendingNotifications.size > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Live Delivery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(sendingNotifications.values()).map((status) => (
                <div key={status.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{status.title}</h4>
                    <Badge variant={status.status === 'sent' ? 'default' : 'secondary'}>
                      {status.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{status.sent_count} / {status.total_recipients}</span>
                    <Progress value={status.progress} className="flex-1 h-2" />
                    <span>{status.progress}%</span>
                  </div>
                  {status.status === 'sent' && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Completed at {format(new Date(status.completed_at!), 'HH:mm:ss')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications">All Notifications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sending">Sending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications List */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications ({filteredNotifications.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications found</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-gray-100">
                                  {getTypeIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge {...getPriorityBadge(notification.priority)}>
                                      {notification.priority}
                                    </Badge>
                                    <Badge variant="outline">
                                      {getAudienceIcon(notification.target_audience)}
                                      <span className="ml-1">
                                        {notification.target_audience.replace('_', ' ')}
                                      </span>
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(notification.status)}
                                  <span className="capitalize">{notification.status}</span>
                                </div>
                                <span>•</span>
                                <span>{notification.total_recipients.toLocaleString()} recipients</span>
                                {notification.status === 'sent' && (
                                  <>
                                    <span>•</span>
                                    <span>{notification.read_count.toLocaleString()} opened</span>
                                    <span>•</span>
                                    <span>
                                      {Math.round((notification.read_count / notification.total_recipients) * 100)}% rate
                                    </span>
                                  </>
                                )}
                                <span>•</span>
                                <span>{format(new Date(notification.created_at), 'MMM dd, HH:mm')}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {/* View details */}}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {notification.status === 'failed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resendNotification(notification)}
                                  disabled={loading}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => duplicateNotification(notification)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{notification.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => deleteNotification(notification.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <p className="text-sm text-gray-600">Total Notifications</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {notifications.reduce((acc, n) => acc + n.total_recipients, 0).toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">Total Recipients</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(
                          (notifications.reduce((acc, n) => acc + n.read_count, 0) / 
                           notifications.reduce((acc, n) => acc + n.total_recipients, 0)) * 100
                        ) || 0}%
                      </div>
                      <p className="text-sm text-gray-600">Average Open Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">
                    Notification templates feature coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Notification
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Broadcast Alert
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Campaign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Maintenance alert sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>New feature announcement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Campaign scheduled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Notification Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
            <DialogDescription>
              Send a notification to your users with real-time delivery tracking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value: any) => setForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(value: any) => setForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Select
                value={form.target_audience}
                onValueChange={(value: any) => setForm(prev => ({ ...prev, target_audience: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_users">All Users ({getTargetAudienceCount('all_users').toLocaleString()})</SelectItem>
                  <SelectItem value="premium_users">Premium Users ({getTargetAudienceCount('premium_users').toLocaleString()})</SelectItem>
                  <SelectItem value="free_users">Free Users ({getTargetAudienceCount('free_users').toLocaleString()})</SelectItem>
                  <SelectItem value="critics">Critics ({getTargetAudienceCount('critics').toLocaleString()})</SelectItem>
                  <SelectItem value="admins">Admins ({getTargetAudienceCount('admins').toLocaleString()})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Delivery</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="immediate"
                    name="schedule_type"
                    value="immediate"
                    checked={form.schedule_type === 'immediate'}
                    onChange={(e) => setForm(prev => ({ ...prev, schedule_type: e.target.value as 'immediate' | 'scheduled' }))}
                    className="h-4 w-4"
                    aria-label="Send notification immediately"
                    title="Send notification immediately"
                  />
                  <Label htmlFor="immediate" className="cursor-pointer">Send immediately</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="scheduled"
                    name="schedule_type"
                    value="scheduled"
                    checked={form.schedule_type === 'scheduled'}
                    onChange={(e) => setForm(prev => ({ ...prev, schedule_type: e.target.value as 'immediate' | 'scheduled' }))}
                    className="h-4 w-4"
                    aria-label="Schedule notification for later"
                    title="Schedule notification for later"
                  />
                  <Label htmlFor="scheduled" className="cursor-pointer">Schedule for later</Label>
                </div>
              </div>
              
              {form.schedule_type === 'scheduled' && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={form.scheduled_date}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    aria-label="Select scheduled date"
                    title="Select the date to send the notification"
                  />
                  <Input
                    type="time"
                    value={form.scheduled_time}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                    aria-label="Select scheduled time"
                    title="Select the time to send the notification"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createNotification} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {form.schedule_type === 'immediate' ? 'Send Now' : 'Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get feature descriptions for form tooltips
function getAudienceDescription(audience: string): string {
  const descriptions: Record<string, string> = {
    all_users: 'Send to all registered users on the platform',
    premium_users: 'Send only to users with active premium subscriptions',
    free_users: 'Send only to users without premium subscriptions',
    critics: 'Send only to approved critics and reviewers',
    admins: 'Send only to administrative users'
  };
  
  return descriptions[audience] || 'Target audience for this notification';
}

// Helper function to validate notification scheduling
function isValidScheduleTime(date?: string, time?: string): boolean {
  if (!date || !time) return false;
  
  const scheduled = new Date(`${date}T${time}`);
  const now = new Date();
  
  return scheduled > now;
}