// src/components/admin/PendingApprovals.tsx - Fixed admin access error

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Mail, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthService, User } from '@/lib/auth';

interface PendingApprovalsProps {
  onRefresh?: () => void;
}

export default function PendingApprovals({ onRefresh }: PendingApprovalsProps) {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    setLoading(true);
    try {
      const pending = AuthService.getPendingUsers();
      setPendingUsers(pending);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fixed function to get admin user information properly
  const getAdminUser = () => {
    // First try to get current user from AuthService (real admin accounts)
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      return {
        id: currentUser.id,
        email: currentUser.email,
        role: 'admin',
        isDemoAccount: false
      };
    }

    // If not found, check localStorage for demo admin account
    try {
      const storedAdmin = localStorage.getItem('adminUser');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        // Check for all possible admin role variations from AdminLogin.tsx
        const isAdminRole = adminData.role && (
          adminData.role === 'Super Admin' ||
          adminData.role === 'Content Manager' ||
          adminData.role === 'Moderator' ||
          adminData.role === 'Administrator' ||
          adminData.role.toLowerCase().includes('admin') ||
          adminData.role.toLowerCase().includes('moderator')
        );
        
        if (isAdminRole && adminData.email) {
          return {
            id: adminData.email, // Use email as ID for demo accounts
            email: adminData.email,
            role: 'admin',
            isDemoAccount: true
          };
        }
      }
    } catch (error) {
      console.error('Error reading admin user from localStorage:', error);
    }

    return null;
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    const adminUser = getAdminUser();
    
    if (!adminUser) {
      toast({
        title: "Error",
        description: "Admin access required. Please log in as an administrator.",
        variant: "destructive",
      });
      return;
    }

    console.log('🔍 Admin user found for approval:', adminUser);
    console.log('🚀 Calling approveUser with:', selectedUser.id, adminUser.id);

    try {
      const success = await AuthService.approveUser(selectedUser.id, adminUser.id);
      
      if (success) {
        toast({
          title: "Success",
          description: `User ${selectedUser.name} has been approved`,
        });
        
        // Refresh the list
        loadPendingUsers();
        if (onRefresh) onRefresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to approve user. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: "An error occurred while approving the user.",
        variant: "destructive",
      });
    }

    setShowApprovalDialog(false);
    setSelectedUser(null);
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    const adminUser = getAdminUser();
    
    if (!adminUser) {
      toast({
        title: "Error",
        description: "Admin access required. Please log in as an administrator.",
        variant: "destructive",
      });
      return;
    }

    console.log('🔍 Admin user found for rejection:', adminUser);
    console.log('🚀 Calling rejectUser with:', selectedUser.id, adminUser.id);

    try {
      const success = await AuthService.rejectUser(selectedUser.id, adminUser.id, rejectionReason);
      
      if (success) {
        toast({
          title: "Success",
          description: `User ${selectedUser.name} has been rejected`,
        });
        
        // Refresh the list
        loadPendingUsers();
        if (onRefresh) onRefresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to reject user. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the user.",
        variant: "destructive",
      });
    }

    setShowRejectionDialog(false);
    setSelectedUser(null);
    setRejectionReason('');
  };

  const openApprovalDialog = (user: User) => {
    setSelectedUser(user);
    setShowApprovalDialog(true);
  };

  const openRejectionDialog = (user: User) => {
    setSelectedUser(user);
    setShowRejectionDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending User Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Pending User Approvals
            <Badge variant="outline" className="ml-auto">
              {pendingUsers.length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500">No pending user approvals at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.created_at)}
                        </span>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openApprovalDialog(user)}
                      className="text-green-600 hover:text-green-700 hover:border-green-300"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openRejectionDialog(user)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              Approve User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this user account? They will be able to access the platform immediately.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback>{selectedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <Badge variant="secondary" className="mt-1">{selectedUser.role}</Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <UserCheck className="w-4 h-4 mr-2" />
              Approve User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-500" />
              Reject User Account
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this user account. This will be communicated to the user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback>{selectedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <Badge variant="secondary" className="mt-1">{selectedUser.role}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for rejection *</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a clear reason for rejecting this account..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject} 
              variant="destructive"
              disabled={!rejectionReason.trim()}
            >
              <UserX className="w-4 h-4 mr-2" />
              Reject User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}