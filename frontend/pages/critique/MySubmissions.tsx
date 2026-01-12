// src/pages/critique/MySubmissions.tsx - Enhanced version with proper status display
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  FileText, 
  Star, 
  Youtube, 
  BookOpen,
  Eye,
  Edit,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  TrendingUp,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubmissions } from '@/hooks/useCritique';
import type { Submission, SubmissionStatus, SubmissionType } from '@/types/critique';

// Status configuration with proper styling - DEFINE IT HERE
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    icon: <Clock className="h-3 w-3" />,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Your submission is awaiting admin review'
  },
  approved: {
    label: 'Approved',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Your content is now live on the platform'
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="h-3 w-3" />,
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Changes needed - check admin feedback'
  }
};

const SUBMISSION_TYPE_LABELS = {
  anime_review: 'Anime Review',
  manga_review: 'Manga Review', 
  episode_review: 'Episode Review',
  vlog: 'Vlog Content'
};

interface EditFormData {
  title: string;
  content: string;
  type: SubmissionType;
  star_rating?: number;
  youtube_link?: string;
  anime_manga_id?: string;
}

export default function MySubmissions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: '',
    content: '',
    type: 'anime_review'
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { 
    submissions, 
    loading, 
    error, 
    total, 
    page, 
    totalPages, 
    setPage, 
    setFilters,
    refresh
  } = useSubmissions({
    search: searchQuery,
    status: statusFilter,
    page: 1,
    limit: 10
  });

  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query, status: statusFilter, page: 1 });
  };

  const handleStatusFilter = (status: SubmissionStatus | 'all') => {
    setStatusFilter(status);
    setFilters({ search: searchQuery, status: status, page: 1 });
  };

  const openEditDialog = (submission: Submission) => {
    setEditingSubmission(submission);
    setEditFormData({
      title: submission.title,
      content: submission.content,
      type: submission.type,
      star_rating: submission.star_rating,
      youtube_link: submission.youtube_link || '',
      anime_manga_id: submission.anime_manga_id || ''
    });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingSubmission(null);
    setEditFormData({
      title: '',
      content: '',
      type: 'anime_review'
    });
    setIsEditDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editingSubmission) return;

    try {
      // Simulate API call to update submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Submission Updated",
        description: "Your submission has been successfully updated and will be reviewed again.",
      });
      
      closeEditDialog();
      refresh(); // Refresh the submissions list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const config = STATUS_CONFIG[status];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
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

  const canEdit = (submission: Submission) => {
    return submission.status === 'pending' || submission.status === 'rejected';
  };

  const getSubmissionStats = (submission: Submission) => {
    if (submission.status !== 'approved') {
      return null;
    }
    
    return (
      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {submission.views.toLocaleString()} views
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          {submission.likes.toLocaleString()} likes
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {submission.comments.toLocaleString()} comments
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with Back Button */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/critique')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="text-sm text-gray-500">
            <Link to="/critique" className="hover:text-blue-600">Critique Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">My Submissions</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
        <p className="text-gray-600">
          Track and manage your submitted content
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = submissions.filter(s => s.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{config.label}</p>
                  </div>
                  <div className={`p-2 rounded-full ${config.color}`}>
                    {config.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/critique/submit">
              <Plus className="h-4 w-4 mr-2" />
              New Submission
            </Link>
          </Button>
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

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No submissions found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : "You haven't submitted any content yet. Create your first submission!"}
            </p>
            <Button asChild>
              <Link to="/critique/submit">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Content
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(submission.type)}
                      <h3 className="text-xl font-semibold text-gray-900">
                        {submission.title}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {SUBMISSION_TYPE_LABELS[submission.type]}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      {submission.star_rating && (
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {submission.star_rating}/5 stars
                        </span>
                      )}
                    </div>

                    {/* Content Preview */}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {submission.content.substring(0, 200)}
                      {submission.content.length > 200 && '...'}
                    </p>

                    {/* Status Description */}
                    <div className={`p-3 rounded-lg mb-4 ${STATUS_CONFIG[submission.status].color.replace('text-', 'bg-').replace('800', '50')}`}>
                      <p className="text-sm">
                        <strong>{STATUS_CONFIG[submission.status].label}:</strong> {STATUS_CONFIG[submission.status].description}
                      </p>
                    </div>

                    {/* Admin Notes/Feedback */}
                    {submission.admin_notes && (
                      <div className={`p-3 rounded-lg mb-4 ${
                        submission.status === 'rejected' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <h4 className="font-medium text-sm mb-1 text-gray-800">
                          {submission.status === 'rejected' ? 'Rejection Reason:' : 'Admin Notes:'}
                        </h4>
                        <p className={`text-sm ${
                          submission.status === 'rejected' ? 'text-red-800' : 'text-blue-800'
                        }`}>
                          {submission.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Statistics for approved content */}
                    {getSubmissionStats(submission)}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    {submission.status === 'approved' && submission.youtube_link && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={submission.youtube_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Live
                        </a>
                      </Button>
                    )}

                    {canEdit(submission) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(submission)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}

                    <div className="text-xs text-gray-500 text-right">
                      {submission.status === 'approved' && submission.approved_at
                        ? `Approved ${new Date(submission.approved_at).toLocaleDateString()}`
                        : `Updated ${new Date(submission.updated_at).toLocaleDateString()}`
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages} ({total} submissions)
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Submission
            </DialogTitle>
            <DialogDescription>
              Make changes to your submission. It will be reviewed again after updates.
            </DialogDescription>
          </DialogHeader>

          {editingSubmission && (
            <div className="space-y-4">
              {/* Submission Type */}
              <div>
                <Label htmlFor="type">Content Type</Label>
                <Select
                  value={editFormData.type}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, type: value as SubmissionType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anime_review">Anime Review</SelectItem>
                    <SelectItem value="manga_review">Manga Review</SelectItem>
                    <SelectItem value="episode_review">Episode Review</SelectItem>
                    <SelectItem value="vlog">Vlog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter your submission title..."
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your review or content..."
                  rows={10}
                  className="resize-none"
                />
              </div>

              {/* Star Rating for Reviews */}
              {(editFormData.type === 'anime_review' || editFormData.type === 'manga_review' || editFormData.type === 'episode_review') && (
                <div>
                  <Label htmlFor="rating">Star Rating</Label>
                  <Select
                    value={editFormData.star_rating?.toString() || ''}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, star_rating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rating..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">⭐ 1 Star</SelectItem>
                      <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* YouTube Link for Vlogs */}
              {editFormData.type === 'vlog' && (
                <div>
                  <Label htmlFor="youtube_link">YouTube Link</Label>
                  <Input
                    id="youtube_link"
                    value={editFormData.youtube_link}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, youtube_link: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}