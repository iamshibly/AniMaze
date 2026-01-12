// src/pages/PublicReviews.tsx - FIXED to use CritiqueLayout instead of main Layout
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  Calendar,
  User
} from 'lucide-react';
import { usePublicSubmissions } from '@/hooks/useCritique';
import { SUBMISSION_TYPE_LABELS } from '@/types/critique';
import type { SubmissionType } from '@/types/critique';
import CritiqueLayout from '@/components/CritiqueLayout'; // CHANGED: Use CritiqueLayout instead of Layout

const PublicReviewsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SubmissionType | 'all'>('all');
  
  const { 
    submissions, 
    loading, 
    total, 
    page, 
    totalPages, 
    setPage, 
    setFilters 
  } = usePublicSubmissions({
    search: searchQuery,
    type: typeFilter,
    page: 1,
    limit: 12
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query, type: typeFilter, page: 1 });
  };

  const handleTypeFilter = (type: SubmissionType | 'all') => {
    setTypeFilter(type);
    setFilters({ search: searchQuery, type, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews and vlogs..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={typeFilter}
                onValueChange={(value) => handleTypeFilter(value as SubmissionType | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="anime_review">Anime Reviews</SelectItem>
                  <SelectItem value="manga_review">Manga Reviews</SelectItem>
                  <SelectItem value="episode_review">Episode Reviews</SelectItem>
                  <SelectItem value="vlog">Vlogs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && submissions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-500">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Be the first to share your thoughts!'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews Grid */}
      {!loading && submissions.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">
                      {SUBMISSION_TYPE_LABELS[submission.type]}
                    </Badge>
                    {submission.star_rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{submission.star_rating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="line-clamp-2 text-lg">
                    {submission.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3">
                    {submission.content.substring(0, 150)}...
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={submission.critic?.avatar_url} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {submission.critic?.name || 'Anonymous'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {submission.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {submission.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {submission.comments}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                Page {page} of {totalPages} ({total} reviews)
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
        </>
      )}
    </div>
  );
};

// Main component with CritiqueLayout wrapper
export default function PublicReviews() {
  return (
    <CritiqueLayout>
      <PublicReviewsContent />
    </CritiqueLayout>
  );
}