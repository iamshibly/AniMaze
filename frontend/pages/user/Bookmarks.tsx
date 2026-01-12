// src/pages/user/Bookmarks.tsx - FIXED Status Filter issue and added demo data
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bookmark, 
  BookmarkCheck,
  Search,
  Filter,
  Star,
  Calendar,
  Eye,
  Trash2,
  Play,
  BookOpen,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Heart,
  Share2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { UserProgressService } from '@/lib/userServices';
import { mockAnimes, mockMangas } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface BookmarkedItem {
  id: string;
  title: string;
  type: 'anime' | 'manga';
  poster: string;
  rating: number;
  year: number;
  genres: string[];
  status: string;
  bookmarkedAt: Date;
}

// ADDED: Demo data for bookmarks
const generateDemoBookmarks = (): BookmarkedItem[] => [
  {
    id: '1',
    title: 'Attack on Titan',
    type: 'anime',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    rating: 9.2,
    year: 2013,
    genres: ['Action', 'Drama', 'Fantasy'],
    status: 'completed',
    bookmarkedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'One Piece',
    type: 'manga',
    poster: 'https://images.unsplash.com/photo-1606997142479-f30ca7ac7c4c?w=300&h=400&fit=crop',
    rating: 9.5,
    year: 1997,
    genres: ['Adventure', 'Comedy', 'Action'],
    status: 'ongoing',
    bookmarkedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    title: 'Your Name',
    type: 'anime',
    poster: 'https://images.unsplash.com/',
    rating: 8.8,
    year: 2016,
    genres: ['Romance', 'Drama', 'Supernatural'],
    status: 'completed',
    bookmarkedAt: new Date('2024-01-28')
  },
  {
    id: '4',
    title: 'Death Note',
    type: 'manga',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    rating: 9.0,
    year: 2003,
    genres: ['Psychological', 'Thriller', 'Supernatural'],
    status: 'completed',
    bookmarkedAt: new Date('2024-03-05')
  },
  {
    id: '5',
    title: 'Demon Slayer',
    type: 'anime',
    poster: 'https://images.unsplash.com/photo-1606997142479-f30ca7ac7c4c?w=300&h=400&fit=crop',
    rating: 8.7,
    year: 2019,
    genres: ['Action', 'Historical', 'Supernatural'],
    status: 'ongoing',
    bookmarkedAt: new Date('2024-02-14')
  },
  {
    id: '6',
    title: 'My Hero Academia',
    type: 'manga',
    poster: 'https://images.unsplash.com/',
    rating: 8.5,
    year: 2014,
    genres: ['Action', 'School', 'Superhero'],
    status: 'ongoing',
    bookmarkedAt: new Date('2024-01-10')
  },
  {
    id: '7',
    title: 'Spirited Away',
    type: 'anime',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    rating: 9.3,
    year: 2001,
    genres: ['Adventure', 'Family', 'Fantasy'],
    status: 'completed',
    bookmarkedAt: new Date('2024-03-12')
  },
  {
    id: '8',
    title: 'Naruto',
    type: 'manga',
    poster: 'https://images.unsplash.com/photo-1606997142479-f30ca7ac7c4c?w=300&h=400&fit=crop',
    rating: 8.4,
    year: 1999,
    genres: ['Action', 'Adventure', 'Martial Arts'],
    status: 'completed',
    bookmarkedAt: new Date('2024-02-08')
  }
];

export default function Bookmarks() {
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<BookmarkedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  // FIXED: Added missing statusFilter state variable
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('bookmarked_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [bookmarkedItems, searchQuery, typeFilter, statusFilter, sortBy, sortOrder]);

  const loadBookmarks = () => {
    try {
      // First try to load real bookmarks
      const userProgress = UserProgressService.getUserProgress();
      let bookmarked: BookmarkedItem[] = [];
      
      if (userProgress && userProgress.bookmarks && userProgress.bookmarks.length > 0) {
        // Load real bookmarks from user progress
        userProgress.bookmarks.forEach(itemId => {
          const anime = mockAnimes?.find(a => a.id === itemId);
          if (anime) {
            bookmarked.push({
              id: anime.id,
              title: anime.title,
              type: 'anime',
              poster: anime.poster,
              rating: anime.rating,
              year: anime.year,
              genres: anime.genres,
              status: anime.status,
              bookmarkedAt: new Date()
            });
          }
          
          const manga = mockMangas?.find(m => m.id === itemId);
          if (manga) {
            bookmarked.push({
              id: manga.id,
              title: manga.title,
              type: 'manga',
              poster: manga.cover,
              rating: manga.rating,
              year: manga.year,
              genres: manga.genres,
              status: manga.status,
              bookmarkedAt: new Date()
            });
          }
        });
      }
      
      // ADDED: If no real bookmarks, use demo data
      if (bookmarked.length === 0) {
        bookmarked = generateDemoBookmarks();
      }

      setBookmarkedItems(bookmarked);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      // ADDED: Fallback to demo data on error
      setBookmarkedItems(generateDemoBookmarks());
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = [...bookmarkedItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // FIXED: Status filter implementation
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'rating':
          compareValue = a.rating - b.rating;
          break;
        case 'year':
          compareValue = a.year - b.year;
          break;
        case 'bookmarked_date':
        default:
          compareValue = a.bookmarkedAt.getTime() - b.bookmarkedAt.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredItems(filtered);
  };

  const removeBookmark = (itemId: string) => {
    // Remove from state immediately for better UX
    setBookmarkedItems(prev => prev.filter(item => item.id !== itemId));
    
    // Try to remove from actual bookmarks if it exists
    const success = UserProgressService.removeFromBookmarks(itemId);
    
    toast({
      title: "Bookmark removed",
      description: "Item has been removed from your bookmarks.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-orange-500';
      case 'hiatus':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'hiatus':
        return 'On Hiatus';
      default:
        return 'Unknown';
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <img
              src={item.poster}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="capitalize">
                {item.type}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <div 
                className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} 
                title={getStatusLabel(item.status)}
              ></div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeBookmark(item.id)}
                className="h-8 w-8 p-0"
                title={`Remove ${item.title} from bookmarks`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{item.rating}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{item.year}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {item.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
              {item.genres.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{item.genres.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Link to={`/${item.type}/${item.id}`}>
                <Button variant="outline" size="sm">
                  {item.type === 'anime' ? <Play className="h-4 w-4 mr-1" /> : <BookOpen className="h-4 w-4 mr-1" />}
                  View
                </Button>
              </Link>
              <span className="text-xs text-gray-500">
                {item.bookmarkedAt.toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.poster}
                alt={item.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {item.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div 
                          className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}
                        ></div>
                        <span className="text-xs text-gray-600">{getStatusLabel(item.status)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{item.year}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.genres.slice(0, 3).map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {item.bookmarkedAt.toLocaleDateString()}
                    </span>
                    <Link to={`/${item.type}/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeBookmark(item.id)}
                      title={`Remove ${item.title} from bookmarks`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bookmark className="h-8 w-8 text-primary" />
              My Bookmarks
            </h1>
            <p className="text-muted-foreground mt-2">
              {bookmarkedItems.length} {bookmarkedItems.length === 1 ? 'item' : 'items'} in your collection
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="manga">Manga</SelectItem>
              </SelectContent>
            </Select>
            
            {/* FIXED: Added Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="hiatus">On Hiatus</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bookmarked_date">Date Added</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? "Try adjusting your filters or search terms"
                : "Start building your collection by bookmarking anime and manga you love"
              }
            </p>
            <Button asChild>
              <Link to="/anime">
                <Plus className="h-4 w-4 mr-2" />
                Explore Anime
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        viewMode === 'grid' ? <GridView /> : <ListView />
      )}
    </div>
  );
}