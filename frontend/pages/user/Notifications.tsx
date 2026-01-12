// src/pages/user/Notifications.tsx - Fixed imports with valid Lucide icons only
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  Bell, 
  BellRing,
  Crown,
  Trophy,
  Zap,
  Calendar,
  Info,
  CheckCircle,
  Trash2,
  Settings,
  Search,
  Filter,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserNotificationService, type UserNotification } from '@/lib/userServices';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<UserNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Notification preferences
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    in_app_notifications: true,
    sound_enabled: true,
    premium_notifications: true,
    quiz_notifications: true,
    platform_updates: true,
    subscription_reminders: true,
    system_notices: true
  });

  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  // ONLY REPLACE the loadNotifications function in your existing Notifications.tsx file
// Find this function around lines 65-72 and replace it with this:

  const loadNotifications = () => {
    let userNotifications = UserNotificationService.getUserNotifications();
    
    // ADDED: Demo data if no real notifications exist
    if (userNotifications.length === 0) {
      userNotifications = [
        {
          id: 'demo-1',
          user_id: 'current_user',
          type: 'premium_purchased',
          title: '🎉 Welcome to Premium!',
          message: 'Thank you for upgrading to Premium! You now have access to exclusive content, ad-free experience, and priority support.',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: 'demo-2',
          user_id: 'current_user',
          type: 'quiz_achievement',
          title: '🏆 New Badge Unlocked!',
          message: 'Congratulations! You\'ve earned the "Anime Expert" badge by scoring 90%+ on 5 consecutive quizzes.',
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        {
          id: 'demo-3',
          user_id: 'current_user',
          type: 'platform_update',
          title: '✨ New Features Available',
          message: 'Check out our new manga reader with enhanced zoom controls and bookmark syncing across devices!',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: 'demo-4',
          user_id: 'current_user',
          type: 'quiz_achievement',
          title: '🔥 7-Day Streak!',
          message: 'Amazing! You\'ve maintained a 7-day login streak. Keep it up to unlock special rewards!',
          is_read: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        },
        {
          id: 'demo-5',
          user_id: 'current_user',
          type: 'platform_update',
          title: '📱 Mobile App Update',
          message: 'Our mobile app has been updated with faster loading times and improved offline reading capabilities.',
          is_read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        },
        {
          id: 'demo-6',
          user_id: 'current_user',
          type: 'subscription_reminder',
          title: '💳 Payment Successful',
          message: 'Your Premium subscription has been renewed successfully. Next billing date: April 15, 2025.',
          is_read: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
        },
        {
          id: 'demo-7',
          user_id: 'current_user',
          type: 'system_notice',
          title: '🛠️ Scheduled Maintenance',
          message: 'We\'ll be performing system maintenance on Sunday, March 24th from 2:00 AM to 4:00 AM UTC. Minimal disruption expected.',
          is_read: true,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
        },
        {
          id: 'demo-8',
          user_id: 'current_user',
          type: 'quiz_achievement',
          title: '🎯 Perfect Score!',
          message: 'Incredible! You scored 100% on the "Shonen Anime Trivia" quiz. You\'re truly an expert!',
          is_read: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks ago
        }
      ];
    }
    
    setNotifications(userNotifications);
    setUnreadCount(UserNotificationService.getUnreadCount() || userNotifications.filter(n => !n.is_read).length);
    setLoading(false);
  };

  const loadPreferences = () => {
    const savedPreferences = localStorage.getItem('notification_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  };

  const savePreferences = (newPreferences: typeof preferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('notification_preferences', JSON.stringify(newPreferences));
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notif => notif.type === typeFilter);
    }

    // Status filter
    if (statusFilter === 'unread') {
      filtered = filtered.filter(notif => !notif.is_read);
    } else if (statusFilter === 'read') {
      filtered = filtered.filter(notif => notif.is_read);
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = (notificationId: string) => {
    UserNotificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    UserNotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    toast({
      title: "All notifications marked as read",
      description: "Your notification center has been cleared.",
    });
  };

  // Using the correct service methods
  const deleteNotification = (notificationId: string) => {
    const success = UserNotificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Notification deleted",
        description: "The notification has been removed.",
      });
    }
  };

  const clearAllNotifications = () => {
    const success = UserNotificationService.clearAllNotifications();
    if (success) {
      setNotifications([]);
      setUnreadCount(0);
      toast({
        title: "All notifications cleared",
        description: "Your notification history has been cleared.",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'premium_purchased':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'quiz_achievement':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'platform_update':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'subscription_reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'system_notice':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'premium_purchased':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'quiz_achievement':
        return 'border-l-blue-500 bg-blue-50/50';
      case 'platform_update':
        return 'border-l-purple-500 bg-purple-50/50';
      case 'subscription_reminder':
        return 'border-l-orange-500 bg-orange-50/50';
      case 'system_notice':
        return 'border-l-gray-500 bg-gray-50/50';
      default:
        return 'border-l-gray-300 bg-gray-50/50';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'premium_purchased':
        return 'Premium';
      case 'quiz_achievement':
        return 'Quiz Achievement';
      case 'platform_update':
        return 'Platform Update';
      case 'subscription_reminder':
        return 'Subscription';
      case 'system_notice':
        return 'System Notice';
      default:
        return 'General';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-500" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your notifications and stay updated with the latest news.
            </p>
          </div>
          
          {unreadCount > 0 && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {unreadCount} unread
              </Badge>
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="premium_purchased">Premium</SelectItem>
                    <SelectItem value="quiz_achievement">Quiz Achievement</SelectItem>
                    <SelectItem value="platform_update">Platform Update</SelectItem>
                    <SelectItem value="subscription_reminder">Subscription</SelectItem>
                    <SelectItem value="system_notice">System Notice</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600 text-center max-w-md">
                  {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                    ? "Try adjusting your filters to see more notifications."
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={`
                  transition-all duration-200 hover:shadow-md border-l-4 
                  ${getNotificationColor(notification.type)}
                  ${!notification.is_read ? 'bg-blue-50/30' : ''}
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold truncate ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                            <span>{format(new Date(notification.created_at), 'MMM d, yyyy • h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Mark as read"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this notification? This action cannot be undone.
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Clear All Button */}
          {notifications.length > 0 && (
            <div className="text-center pt-6 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Notifications
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Notifications</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear all notifications? This will permanently delete your notification history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearAllNotifications}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, email_notifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.push_notifications}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, push_notifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="font-medium">In-App Notifications</Label>
                        <p className="text-sm text-gray-600">Show notifications within the app</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.in_app_notifications}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, in_app_notifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {preferences.sound_enabled ? 
                        <Volume2 className="h-5 w-5 text-gray-500" /> : 
                        <VolumeX className="h-5 w-5 text-gray-500" />
                      }
                      <div>
                        <Label className="font-medium">Sound Effects</Label>
                        <p className="text-sm text-gray-600">Play sound when receiving notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.sound_enabled}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, sound_enabled: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Types */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <div>
                        <Label className="font-medium">Premium Notifications</Label>
                        <p className="text-sm text-gray-600">Updates about premium features and subscriptions</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.premium_notifications}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, premium_notifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="font-medium">Quiz Achievements</Label>
                        <p className="text-sm text-gray-600">Notifications about quiz results and achievements</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.quiz_notifications}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, quiz_notifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label className="font-medium">Platform Updates</Label>
                        <p className="text-sm text-gray-600">News about new features and improvements</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.platform_updates}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, platform_updates: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <div>
                        <Label className="font-medium">Subscription Reminders</Label>
                        <p className="text-sm text-gray-600">Reminders about subscription renewals</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.subscription_reminders}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, subscription_reminders: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Info className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="font-medium">System Notices</Label>
                        <p className="text-sm text-gray-600">Important system announcements and maintenance</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.system_notices}
                      onCheckedChange={(checked) => 
                        savePreferences({ ...preferences, system_notices: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}