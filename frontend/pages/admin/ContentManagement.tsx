// src/pages/admin/ContentManagement.tsx - Proper content management for submissions
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  FileText,
  User,
  Star,
  Youtube,
  AlertCircle,
  BookOpen,
  MessageSquare,
  Clock,
  TrendingUp,
  BarChart3,
  Send,
  Trash2,
  Edit
} from 'lucide-react';
import { useAdminSubmissions } from '@/hooks/useCritique';
import type { SubmissionStatus, SubmissionType, Submission } from '@/types/critique';
import { useToast } from '@/hooks/use-toast';

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: <Clock className="h-3 w-3" />,
    color: 'bg-yellow-100 text-yellow-800',
    badgeColor: 'secondary'
  },
  approved: {
    label: 'Published',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'bg-green-100 text-green-800',
    badgeColor: 'default'
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="h-3 w-3" />,
    color: 'bg-red-100 text-red-800',
    badgeColor: 'destructive'
  }
};

const SUBMISSION_TYPE_LABELS = {
  anime_review: 'Anime Review',
  manga_review: 'Manga Review',
  episode_review: 'Episode Review',
  vlog: 'Vlog Content'
};

interface ActionModalProps {
  submission: Submission | null;
  actionType: 'approve' | 'reject' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  submission,
  actionType,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes('');
    onClose();
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {actionType === 'approve' ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Publish Content
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                Reject Content
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'approve' 
              ? 'This content will be published and visible to all users.'
              : 'This content will be rejected and returned to the creator for revision.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Submission Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{submission.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{SUBMISSION_TYPE_LABELS[submission.type]}</Badge>
                {submission.star_rating && (
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="h-4 w-4 mr-1" />
                    {submission.star_rating}/5
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-3">
                {submission.content.substring(0, 200)}...
              </p>
            </CardContent>
          </Card>

          {/* Notes/Feedback */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {actionType === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason (Required)'}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                actionType === 'approve' 
                  ? 'Add any notes for the creator (optional)...'
                  : 'Explain why this content needs changes...'
              }
              rows={4}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={actionType === 'reject' && !notes.trim()}
            >
              {actionType === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish Content
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Content
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<SubmissionType | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const { 
    submissions, 
    loading, 
    error, 
    total, 
    page, 
    totalPages, 
    setPage, 
    setFilters,
    approveSubmission,
    rejectSubmission,
    refresh
  } = useAdminSubmissions({
    search: searchQuery,
    status: statusFilter,
    type: typeFilter,
    page: 1,
    limit: 20
  });

  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query, status: statusFilter, type: typeFilter, page: 1 });
  };

  const handleStatusFilter = (status: SubmissionStatus | 'all') => {
    setStatusFilter(status);
    setFilters({ search: searchQuery, status, type: typeFilter, page: 1 });
  };

  const handleTypeFilter = (type: SubmissionType | 'all') => {
    setTypeFilter(type);
    setFilters({ search: searchQuery, status: statusFilter, type, page: 1 });
  };

  const openActionModal = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const openViewModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewModalOpen(true);
  };

  const handleActionConfirm = async (notes?: string) => {
    if (!selectedSubmission || !actionType) return;

    try {
      if (actionType === 'approve') {
        await approveSubmission(selectedSubmission.id, notes);
        toast({
          title: "Content Published",
          description: `"${selectedSubmission.title}" has been published and is now live.`,
        });
      } else {
        await rejectSubmission(selectedSubmission.id, notes || 'No reason provided');
        toast({
          title: "Content Rejected",
          description: `"${selectedSubmission.title}" has been rejected. The creator has been notified.`,
        });
      }
      
      refresh();
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const config = STATUS_CONFIG[status];
    return (
      <Badge variant={config.badgeColor as any} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: SubmissionType) => {
    const icons = {
      anime_review: <Star className="h-4 w-4 text-orange-500" />,
      manga_review: <BookOpen className="h-4 w-4 text-blue-500" />,
      episode_review: <FileText className="h-4 w-4 text-green-500" />,
      vlog: <Youtube className="h-4 w-4 text-red-500" />
    };
    return icons[type];
  };

  const getPriorityBadge = (submission: Submission) => {
    const daysSinceSubmission = Math.floor(
      (Date.now() - new Date(submission.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (submission.status === 'pending' && daysSinceSubmission > 7) {
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    } else if (submission.status === 'pending' && daysSinceSubmission > 3) {
      return <Badge variant="secondary" className="text-xs">Due Soon</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-sm text-gray-600">Total Content</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending content */}
      {pendingCount > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have <strong>{pendingCount}</strong> content submission{pendingCount > 1 ? 's' : ''} waiting for review.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Review, approve, and manage all content submissions
              </CardDescription>
            </div>
            <Button onClick={refresh} variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Search content by title, creator, or content..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
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
          </div>

          {/* Error State */}
          {error && (
            <Alert className="mb-6 border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Content List */}
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No content found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'No content submissions available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {getTypeIcon(submission.type)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {submission.title}
                          </h3>
                          {getStatusBadge(submission.status)}
                          {getPriorityBadge(submission)}
                        </div>
                        
                        {/* Creator and Metadata */}
                        <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {submission.critic?.name || 'Unknown Creator'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {SUBMISSION_TYPE_LABELS[submission.type]}
                          </span>
                          {submission.star_rating && (
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {submission.star_rating}/5
                            </span>
                          )}
                        </div>

                        {/* Content Preview */}
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {submission.content.substring(0, 150)}
                          {submission.content.length > 150 && '...'}
                        </p>

                        {/* Links */}
                        {submission.youtube_link && (
                          <div className="mb-3">
                            <a 
                              href={submission.youtube_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <Youtube className="h-4 w-4 mr-1" />
                              View Video Content
                            </a>
                          </div>
                        )}

                        {/* Performance Stats for Published Content */}
                        {submission.status === 'approved' && (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {submission.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {submission.likes.toLocaleString()} likes
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {submission.comments.toLocaleString()} comments
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        {submission.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openActionModal(submission, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Publish
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openActionModal(submission, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openViewModal(submission)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Full
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages} ({total} total)
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      <ActionModal
        submission={selectedSubmission}
        actionType={actionType}
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setSelectedSubmission(null);
          setActionType(null);
        }}
        onConfirm={handleActionConfirm}
      />

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              View Content
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b">
                {getTypeIcon(selectedSubmission.type)}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedSubmission.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{SUBMISSION_TYPE_LABELS[selectedSubmission.type]}</Badge>
                    {getStatusBadge(selectedSubmission.status)}
                    {selectedSubmission.star_rating && (
                      <div className="flex items-center text-sm text-yellow-600">
                        <Star className="h-4 w-4 mr-1" />
                        {selectedSubmission.star_rating}/5
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Creator and Date */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {selectedSubmission.critic?.name || 'Unknown Creator'}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(selectedSubmission.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                <div className="whitespace-pre-wrap">{selectedSubmission.content}</div>
              </div>

              {/* YouTube Link */}
              {selectedSubmission.youtube_link && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Video Content:</h4>
                  <a 
                    href={selectedSubmission.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Youtube className="h-4 w-4 mr-2" />
                    {selectedSubmission.youtube_link}
                  </a>
                </div>
              )}

              {/* Admin Notes */}
              {selectedSubmission.admin_notes && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Admin Notes:</h4>
                  <p className="text-gray-700">{selectedSubmission.admin_notes}</p>
                </div>
              )}

              {/* Performance Stats */}
              {selectedSubmission.status === 'approved' && (
                <div className="flex items-center gap-6 text-sm text-gray-500 p-4 bg-green-50 rounded-lg">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedSubmission.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {selectedSubmission.likes.toLocaleString()} likes
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {selectedSubmission.comments.toLocaleString()} comments
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}