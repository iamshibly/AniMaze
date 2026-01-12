// src/pages/admin/CriticManagement.tsx - New admin page for managing critics and submissions
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
  CheckCircle, 
  XCircle, 
  Eye,
  Edit,
  Star,
  Calendar,
  TrendingUp,
  FileText,
  Video,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { AdminService, AdminManagedUser } from '@/lib/adminServices';
import { useAdminSubmissions } from '@/hooks/useCritique';
import { Submission, SubmissionStatus, SubmissionType } from '@/types/critique';

export default function CriticManagement() {
  const [critics, setCritics] = useState<AdminManagedUser[]>([]);
  const [selectedCritic, setSelectedCritic] = useState<AdminManagedUser | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_edit' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Use critique hook for submissions
  const {
    submissions,
    loading: submissionsLoading,
    approveSubmission,
    rejectSubmission,
    fetchSubmissions,
    filters,
    setFilters
  } = useAdminSubmissions();

  useEffect(() => {
    loadCritics();
    fetchSubmissions();
  }, []);

  const loadCritics = async () => {
    try {
      setLoading(true);
      const allUsers = AdminService.getAllManagedUsers();
      const criticUsers = allUsers.filter(user => user.role === 'critique');
      setCritics(criticUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load critics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionAction = async () => {
    if (!selectedSubmission || !actionType) return;

    try {
      switch (actionType) {
        case 'approve':
          await approveSubmission(selectedSubmission.id);
          toast({
            title: "Success",
            description: "Submission approved and published",
          });
          break;

        case 'reject':
          if (!adminNotes.trim()) {
            toast({
              title: "Error",
              description: "Please provide a reason for rejection",
              variant: "destructive",
            });
            return;
          }
          await rejectSubmission(selectedSubmission.id, adminNotes);
          toast({
            title: "Success",
            description: "Submission rejected with feedback",
          });
          break;

        case 'request_edit':
          if (!adminNotes.trim()) {
            toast({
              title: "Error",
              description: "Please provide edit instructions",
              variant: "destructive",
            });
            return;
          }
          await rejectSubmission(selectedSubmission.id, `Edit Request: ${adminNotes}`);
          toast({
            title: "Success",
            description: "Edit request sent to critic",
          });
          break;
      }

      // Reset form and refresh data
      setSelectedSubmission(null);
      setActionType(null);
      setAdminNotes('');
      await fetchSubmissions();

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const variants: Record<SubmissionStatus, "default" | "destructive" | "outline" | "secondary"> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getTypeBadge = (type: SubmissionType) => {
    const typeLabels = {
      anime_review: 'Anime Review',
      manga_review: 'Manga Review',
      episode_review: 'Episode Review',
      vlog: 'Vlog'
    };
    return <Badge variant="outline">{typeLabels[type]}</Badge>;
  };

  const getTypeIcon = (type: SubmissionType) => {
    const icons = {
      anime_review: Star,
      manga_review: BookOpen,
      episode_review: Video,
      vlog: MessageSquare
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getCriticStats = (critic: AdminManagedUser) => {
    const criticSubmissions = submissions.filter(s => s.critic_id === critic.id);
    const approved = criticSubmissions.filter(s => s.status === 'approved').length;
    const pending = criticSubmissions.filter(s => s.status === 'pending').length;
    const rejected = criticSubmissions.filter(s => s.status === 'rejected').length;
    const totalViews = criticSubmissions.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = criticSubmissions.reduce((sum, s) => sum + s.likes, 0);

    return {
      total: criticSubmissions.length,
      approved,
      pending,
      rejected,
      totalViews,
      totalLikes,
      approvalRate: criticSubmissions.length > 0 ? Math.round((approved / criticSubmissions.length) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading critics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Critic Management</h1>
          <p className="text-muted-foreground">
            Manage critic accounts and review submissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Submissions Review</TabsTrigger>
          <TabsTrigger value="critics">Critics Overview</TabsTrigger>
        </TabsList>

        {/* Submissions Review Tab */}
        <TabsContent value="submissions" className="space-y-6">
          {/* Submission Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={filters.status || 'all'} 
                    onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value as SubmissionStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select 
                    value={filters.type || 'all'} 
                    onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? undefined : value as SubmissionType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="anime_review">Anime Review</SelectItem>
                      <SelectItem value="manga_review">Manga Review</SelectItem>
                      <SelectItem value="episode_review">Episode Review</SelectItem>
                      <SelectItem value="vlog">Vlog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      value={filters.search || ''}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => fetchSubmissions()}
                    className="w-full"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submissions ({submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissionsLoading ? (
                  <div className="text-center py-8">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No submissions found</p>
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTypeIcon(submission.type)}
                            <h3 className="font-semibold">{submission.title}</h3>
                            {getTypeBadge(submission.type)}
                            {getStatusBadge(submission.status)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {submission.content.substring(0, 150)}...
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {submission.critic?.name || 'Unknown'}</span>
                            <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              <span>{submission.views}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-3 w-3" />
                              <span>{submission.likes}</span>
                            </div>
                            {submission.star_rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{submission.star_rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubmission(submission);
                                  setActionType('approve');
                                  handleSubmissionAction();
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                Approve
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedSubmission(submission)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1 text-red-600" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Review Submission</DialogTitle>
                                    <DialogDescription>
                                      Review and take action on this submission
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedSubmission && (
                                    <div className="space-y-4">
                                      {/* Submission Details */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="flex items-center gap-2">
                                            {getTypeIcon(selectedSubmission.type)}
                                            {selectedSubmission.title}
                                          </CardTitle>
                                          <div className="flex items-center gap-2">
                                            {getTypeBadge(selectedSubmission.type)}
                                            {getStatusBadge(selectedSubmission.status)}
                                          </div>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Critic:</span>
                                              <span>{selectedSubmission.critic?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Submitted:</span>
                                              <span>{new Date(selectedSubmission.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {selectedSubmission.star_rating && (
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Rating:</span>
                                                <span>{selectedSubmission.star_rating}/5 stars</span>
                                              </div>
                                            )}
                                          </div>
                                          
                                          <div className="mt-4">
                                            <Label className="text-sm font-medium">Content:</Label>
                                            <div className="mt-2 p-3 bg-muted rounded-md text-sm max-h-40 overflow-y-auto">
                                              {selectedSubmission.content}
                                            </div>
                                          </div>

                                          {selectedSubmission.youtube_link && (
                                            <div className="mt-4">
                                              <Label className="text-sm font-medium">YouTube Link:</Label>
                                              <p className="text-sm text-blue-600 mt-1">
                                                {selectedSubmission.youtube_link}
                                              </p>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>

                                      {/* Action Form */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Take Action</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div>
                                            <Label>Action Type</Label>
                                            <Select 
                                              value={actionType || ''} 
                                              onValueChange={(value) => setActionType(value as any)}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select action..." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="approve">✅ Approve & Publish</SelectItem>
                                                <SelectItem value="reject">❌ Reject Submission</SelectItem>
                                                <SelectItem value="request_edit">✏️ Request Edits</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {(actionType === 'reject' || actionType === 'request_edit') && (
                                            <div>
                                              <Label>
                                                {actionType === 'reject' ? 'Rejection Reason' : 'Edit Instructions'}
                                              </Label>
                                              <Textarea
                                                placeholder={
                                                  actionType === 'reject' 
                                                    ? "Explain why this submission is being rejected..."
                                                    : "Provide specific instructions for what needs to be edited..."
                                                }
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                rows={4}
                                              />
                                            </div>
                                          )}

                                          <div className="flex gap-2">
                                            <Button 
                                              onClick={handleSubmissionAction}
                                              disabled={!actionType || ((actionType === 'reject' || actionType === 'request_edit') && !adminNotes.trim())}
                                              className="flex-1"
                                            >
                                              {actionType === 'approve' && 'Approve & Publish'}
                                              {actionType === 'reject' && 'Reject Submission'}
                                              {actionType === 'request_edit' && 'Send Edit Request'}
                                              {!actionType && 'Select Action First'}
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>View Submission</DialogTitle>
                              </DialogHeader>
                              {selectedSubmission && (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(selectedSubmission.type)}
                                    <h3 className="text-lg font-semibold">{selectedSubmission.title}</h3>
                                    {getTypeBadge(selectedSubmission.type)}
                                    {getStatusBadge(selectedSubmission.status)}
                                  </div>
                                  
                                  <div className="prose prose-sm max-w-none">
                                    <p>{selectedSubmission.content}</p>
                                  </div>

                                  {selectedSubmission.admin_notes && (
                                    <div className="p-3 bg-muted rounded-md">
                                      <Label className="text-sm font-medium">Admin Notes:</Label>
                                      <p className="text-sm mt-1">{selectedSubmission.admin_notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critics Overview Tab */}
        <TabsContent value="critics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Critics Overview ({critics.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {critics.map((critic) => {
                  const stats = getCriticStats(critic);
                  return (
                    <div key={critic.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {critic.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{critic.name}</h3>
                              <Badge variant="outline">Critic</Badge>
                              {critic.admin_status.is_suspended && <Badge variant="secondary">Suspended</Badge>}
                              {critic.admin_status.is_banned && <Badge variant="destructive">Banned</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{critic.email}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Level {critic.level}</span>
                              <span>{critic.xp} XP</span>
                              <span>Joined {new Date(critic.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Stats */}
                          <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold">{stats.total}</div>
                              <div className="text-muted-foreground text-xs">Total</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-green-600">{stats.approved}</div>
                              <div className="text-muted-foreground text-xs">Approved</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-orange-600">{stats.pending}</div>
                              <div className="text-muted-foreground text-xs">Pending</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-red-600">{stats.rejected}</div>
                              <div className="text-muted-foreground text-xs">Rejected</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{stats.approvalRate}%</div>
                              <div className="text-muted-foreground text-xs">Approval</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedCritic(critic)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Critic Details: {critic.name}</DialogTitle>
                                <DialogDescription>
                                  View detailed statistics and manage critic account
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedCritic && (
                                <div className="space-y-6">
                                  {/* Overview Stats */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                      <CardContent className="pt-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold">{stats.total}</div>
                                          <div className="text-sm text-muted-foreground">Total Submissions</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                                          <div className="text-sm text-muted-foreground">Approved</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold">{stats.totalViews}</div>
                                          <div className="text-sm text-muted-foreground">Total Views</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-4">
                                        <div className="text-center">
                                          <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                                          <div className="text-sm text-muted-foreground">Approval Rate</div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Recent Submissions */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle>Recent Submissions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {submissions
                                          .filter(s => s.critic_id === selectedCritic.id)
                                          .slice(0, 5)
                                          .map(submission => (
                                            <div key={submission.id} className="flex items-center justify-between p-2 rounded border">
                                              <div className="flex items-center gap-2">
                                                {getTypeIcon(submission.type)}
                                                <span className="font-medium">{submission.title}</span>
                                                {getStatusBadge(submission.status)}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                {new Date(submission.created_at).toLocaleDateString()}
                                              </div>
                                            </div>
                                          ))}
                                        {submissions.filter(s => s.critic_id === selectedCritic.id).length === 0 && (
                                          <p className="text-muted-foreground text-center py-4">No submissions yet</p>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {critics.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No critics found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}