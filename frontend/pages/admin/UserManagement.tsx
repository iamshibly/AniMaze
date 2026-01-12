// src/pages/admin/UserManagement.tsx - Complete fixed version
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Send, 
  AlertTriangle, 
  Ban, 
  CheckCircle,
  Eye,
  Calendar,
  TrendingUp,
  DollarSign,
  User
} from 'lucide-react';
import { AdminService, AdminManagedUser, ADMIN_NOTIFICATION_TEMPLATES } from '@/lib/adminServices';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminManagedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminManagedUser | null>(null);
  const [actionType, setActionType] = useState<'notify' | 'warn' | 'suspend' | 'ban' | 'restore' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [notificationType, setNotificationType] = useState<keyof typeof ADMIN_NOTIFICATION_TEMPLATES>('platform_update');
  const [customMessage, setCustomMessage] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(7);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, statusFilter, subscriptionFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const managedUsers = AdminService.getAllManagedUsers();
      setUsers(managedUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users.filter(user => user.role !== 'admin'); // Don't show admin users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'active':
          filtered = filtered.filter(user => 
            !user.admin_status.is_suspended && 
            !user.admin_status.is_banned
          );
          break;
        case 'suspended':
          filtered = filtered.filter(user => user.admin_status.is_suspended);
          break;
        case 'banned':
          filtered = filtered.filter(user => user.admin_status.is_banned);
          break;
        case 'warned':
          filtered = filtered.filter(user => user.admin_status.warnings > 0);
          break;
      }
    }

    // Subscription filter
    if (subscriptionFilter !== 'all') {
      filtered = filtered.filter(user => user.subscription_info.subscription_type === subscriptionFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      switch (actionType) {
        case 'notify':
          await AdminService.sendNotificationToUser(
            selectedUser.id, 
            notificationType, 
            customMessage || undefined
          );
          toast({
            title: "Success",
            description: "Notification sent successfully",
          });
          break;

        case 'warn':
          if (!actionReason.trim()) {
            toast({
              title: "Error",
              description: "Please provide a reason for the warning",
              variant: "destructive",
            });
            return;
          }
          await AdminService.warnUser(selectedUser.id, actionReason);
          toast({
            title: "Success",
            description: "Warning issued successfully",
          });
          break;

        case 'suspend':
          if (!actionReason.trim()) {
            toast({
              title: "Error",
              description: "Please provide a reason for suspension",
              variant: "destructive",
            });
            return;
          }
          await AdminService.suspendUser(selectedUser.id, actionReason, suspensionDays);
          toast({
            title: "Success",
            description: `User suspended for ${suspensionDays} days`,
          });
          break;

        case 'ban':
          if (!actionReason.trim()) {
            toast({
              title: "Error",
              description: "Please provide a reason for ban",
              variant: "destructive",
            });
            return;
          }
          await AdminService.banUser(selectedUser.id, actionReason);
          toast({
            title: "Success",
            description: "User banned successfully",
          });
          break;

        case 'restore':
          await AdminService.restoreUser(selectedUser.id);
          toast({
            title: "Success",
            description: "User account restored",
          });
          break;
      }

      // Reset form and reload users
      setSelectedUser(null);
      setActionType(null);
      setActionReason('');
      setCustomMessage('');
      await loadUsers();

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed",
        variant: "destructive",
      });
    }
  };

  const handleBulkNotification = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select users to notify",
        variant: "destructive",
      });
      return;
    }

    try {
      await AdminService.sendBulkNotifications(
        selectedUsers, 
        notificationType, 
        customMessage || undefined
      );
      
      toast({
        title: "Success",
        description: `Notification sent to ${selectedUsers.length} users`,
      });
      
      setSelectedUsers([]);
      setCustomMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk notifications",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (user: AdminManagedUser) => {
    if (user.admin_status.is_banned) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (user.admin_status.is_suspended) {
      return <Badge variant="secondary">Suspended</Badge>;
    }
    if (user.admin_status.warnings > 0) {
      return <Badge variant="outline">Warned ({user.admin_status.warnings})</Badge>;
    }
    return <Badge variant="default">Active</Badge>;
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'Free':
        return <Badge variant="secondary">{type}</Badge>;
      case 'Bronze':
        return <Badge variant="outline">{type}</Badge>;
      case 'Silver':
        return <Badge variant="default">{type}</Badge>;
      case 'Gold':
        return <Badge variant="default">{type}</Badge>;
      case 'Premium':
        return <Badge variant="destructive">{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, subscriptions, and send notifications
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search-users">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-users"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="warned">Warned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subscription-filter">Subscription Filter</Label>
              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger id="subscription-filter">
                  <SelectValue placeholder="All subscriptions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Bulk Notify ({selectedUsers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Bulk Notification</DialogTitle>
                    <DialogDescription>
                      Send notification to {selectedUsers.length} selected users
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-notification-type">Notification Type</Label>
                      <Select 
                        value={notificationType} 
                        onValueChange={(value) => setNotificationType(value as keyof typeof ADMIN_NOTIFICATION_TEMPLATES)}
                      >
                        <SelectTrigger id="bulk-notification-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premium_purchase">Premium Purchase Confirmation</SelectItem>
                          <SelectItem value="subscription_expiry">Subscription Expiry Reminder</SelectItem>
                          <SelectItem value="platform_update">Platform Update</SelectItem>
                          <SelectItem value="promotional_offer">Promotional Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bulk-custom-message">Custom Message (Optional)</Label>
                      <Textarea
                        id="bulk-custom-message"
                        placeholder="Leave empty to use default template message..."
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleBulkNotification} className="w-full">
                      Send Notifications
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Label htmlFor={`select-user-${user.id}`} className="flex items-center cursor-pointer">
                      <input
                        id={`select-user-${user.id}`}
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded mr-2"
                        title={`Select ${user.name} for bulk actions`}
                      />
                      <span className="sr-only">Select {user.name}</span>
                    </Label>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {user.role === 'critique' ? 'Critic' : 'User'}
                          </Badge>
                          {getStatusBadge(user)}
                          {getSubscriptionBadge(user.subscription_info.subscription_type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Level {user.level}</span>
                          <span>{user.xp} XP</span>
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                          {user.activity_stats.last_login_at && (
                            <span>Last login {new Date(user.activity_stats.last_login_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground mr-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{user.activity_stats.anime_watched} anime</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>৳{user.subscription_info.total_spent}</span>
                      </div>
                      {user.admin_status.warnings > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{user.admin_status.warnings}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>User Details: {user.name}</DialogTitle>
                          <DialogDescription>
                            Manage user account and view detailed information
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="activity">Activity</TabsTrigger>
                              <TabsTrigger value="subscription">Subscription</TabsTrigger>
                              <TabsTrigger value="actions">Actions</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Account Info</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Email:</span>
                                      <span>{selectedUser.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Role:</span>
                                      <Badge variant="outline">
                                        {selectedUser.role === 'critique' ? 'Critic' : 'User'}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Level:</span>
                                      <span>{selectedUser.level}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">XP:</span>
                                      <span>{selectedUser.xp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Joined:</span>
                                      <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Status</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Account Status:</span>
                                      {getStatusBadge(selectedUser)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Warnings:</span>
                                      <span>{selectedUser.admin_status.warnings}</span>
                                    </div>
                                    {selectedUser.admin_status.suspension_end && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Suspended Until:</span>
                                        <span>{new Date(selectedUser.admin_status.suspension_end).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent value="activity" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Engagement</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
  <span className="text-muted-foreground">Quiz Participations:</span>
  <span>{selectedUser.activity_stats.quiz_participations}</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">Comments Made:</span>
  <span>{selectedUser.activity_stats.comments_made}</span>
</div>
<div className="flex justify-between">
  <span className="text-muted-foreground">Reports Received:</span>
  <span>{selectedUser.activity_stats.reports_received}</span>
</div>
{selectedUser.role === 'critique' && (
  <div className="flex justify-between">
    <span className="text-muted-foreground">Reviews Submitted:</span>
    <span>{selectedUser.activity_stats.reviews_submitted || 0}</span>
  </div>)}
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Last Login:</span>
                                      <span>
                                        {selectedUser.activity_stats.last_login_at 
                                          ? new Date(selectedUser.activity_stats.last_login_at).toLocaleDateString()
                                          : 'Never'
                                        }
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Anime Watched:</span>
                                      <span>{selectedUser.activity_stats.anime_watched}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Manga Read:</span>
                                      <span>{selectedUser.activity_stats.manga_read}</span>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Participation</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Quiz Participations:</span>
                                      <span>{selectedUser.activity_stats.quiz_participations}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Comments Made:</span>
                                      <span>{selectedUser.activity_stats.comments_made}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Reports Received:</span>
                                      <span>{selectedUser.activity_stats.reports_received}</span>
                                    </div>
                                    {selectedUser.role === 'critique' && (
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reviews Submitted:</span>
                                        <span>{selectedUser.activity_stats.reviews_submitted || 0}</span>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent value="subscription" className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Subscription Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    {getSubscriptionBadge(selectedUser.subscription_info.subscription_type)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Spent:</span>
                                    <span>৳{selectedUser.subscription_info.total_spent}</span>
                                  </div>
                                  {selectedUser.subscription_info.subscription_start && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Started:</span>
                                      <span>{new Date(selectedUser.subscription_info.subscription_start).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {(selectedUser.subscription_info as any).subscription_end && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Expires:</span>
                                      <span>
                                        {new Date(
                                          (selectedUser.subscription_info as any).subscription_end
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                  {selectedUser.subscription_info.payment_method && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Payment Method:</span>
                                      <span>{selectedUser.subscription_info.payment_method}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </TabsContent>

                            <TabsContent value="actions" className="space-y-4">
                              <div className="grid grid-cols-1 gap-4">
                                {/* Send Notification */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Send className="h-5 w-5" />
                                      Send Notification
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <Label htmlFor="notification-type">Notification Type</Label>
                                      <Select 
                                        value={notificationType} 
                                        onValueChange={(value) => setNotificationType(value as keyof typeof ADMIN_NOTIFICATION_TEMPLATES)}
                                      >
                                        <SelectTrigger id="notification-type">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="premium_purchase">Premium Purchase Confirmation</SelectItem>
                                          <SelectItem value="subscription_expiry">Subscription Expiry Reminder</SelectItem>
                                          <SelectItem value="platform_update">Platform Update</SelectItem>
                                          <SelectItem value="promotional_offer">Promotional Offer</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                                      <Textarea
                                        id="custom-message"
                                        placeholder="Leave empty to use default template..."
                                        value={customMessage}
                                        onChange={(e) => setCustomMessage(e.target.value)}
                                        rows={3}
                                      />
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        setActionType('notify');
                                        handleUserAction();
                                      }}
                                      className="w-full"
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      Send Notification
                                    </Button>
                                  </CardContent>
                                </Card>

                                {/* Moderation Actions */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5" />
                                      Moderation Actions
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div>
                                      <Label htmlFor="action-reason">Action Reason</Label>
                                      <Textarea
                                        id="action-reason"
                                        placeholder="Provide a reason for this action..."
                                        value={actionReason}
                                        onChange={(e) => setActionReason(e.target.value)}
                                        rows={2}
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setActionType('warn');
                                          handleUserAction();
                                        }}
                                        disabled={!actionReason.trim()}
                                      >
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Warn User
                                      </Button>

                                      {selectedUser.admin_status.is_suspended || selectedUser.admin_status.is_banned ? (
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setActionType('restore');
                                            handleUserAction();
                                          }}
                                        >
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Restore Account
                                        </Button>
                                      ) : (
                                        <>
                                          <div className="col-span-2">
                                            <Label htmlFor="suspension-duration">Suspension Duration (Days)</Label>
                                            <Input
                                              id="suspension-duration"
                                              type="number"
                                              value={suspensionDays}
                                              onChange={(e) => setSuspensionDays(parseInt(e.target.value) || 7)}
                                              min="1"
                                              max="365"
                                              placeholder="Enter number of days"
                                            />
                                          </div>
                                          <Button
                                            variant="secondary"
                                            onClick={() => {
                                              setActionType('suspend');
                                              handleUserAction();
                                            }}
                                            disabled={!actionReason.trim()}
                                          >
                                            <Ban className="mr-2 h-4 w-4" />
                                            Suspend
                                          </Button>

                                          <Button
                                            variant="destructive"
                                            onClick={() => {
                                              setActionType('ban');
                                              handleUserAction();
                                            }}
                                            disabled={!actionReason.trim()}
                                          >
                                            <Ban className="mr-2 h-4 w-4" />
                                            Ban User
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No users found matching your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
