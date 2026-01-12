// src/pages/user/Watchlist.tsx - Fixed accessibility and button type issues
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause,
  BookOpen,
  Clock,
  Calendar,
  Star,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Share2,
  Heart,
  Download
} from 'lucide-react';
import { UserProgressService } from '@/lib/userServices';
import { mockAnimes, mockMangas } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface WatchlistItem {
  id: string;
  title: string;
  type: 'anime' | 'manga';
  poster: string;
  rating: number;
  year: number;
  genres: string[];
  status: 'watching' | 'reading' | 'completed' | 'paused' | 'dropped' | 'plan_to_watch' | 'plan_to_read';
  progress?: {
    current: number;
    total: number;
    lastUpdated: Date;
  };
  addedAt: Date;
}

export default function Watchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    filterItems();
  }, [watchlistItems, searchQuery, statusFilter, typeFilter]);

  // ONLY REPLACE the loadWatchlist function in your existing Watchlist.tsx file
// Replace lines approximately 45-90 (the loadWatchlist function) with this:

  const loadWatchlist = () => {
    try {
      const userProgress = UserProgressService.getUserProgress();
      let watchlist: WatchlistItem[] = [];
      
      // Try to load real watchlist data first
      if (userProgress && userProgress.watchlist && userProgress.watchlist.length > 0) {
        // Load watchlist items from user progress
        userProgress.watchlist.forEach(itemId => {
          const anime = mockAnimes?.find(a => a.id === itemId);
          if (anime) {
            const animeProgress = userProgress.anime_progress?.find(p => p.anime_id === itemId);
            watchlist.push({
              id: anime.id,
              title: anime.title,
              type: 'anime',
              poster: anime.poster,
              rating: anime.rating,
              year: anime.year,
              genres: anime.genres,
              status: animeProgress?.status || 'plan_to_watch',
              progress: animeProgress ? {
                current: animeProgress.episodes_watched,
                total: animeProgress.total_episodes,
                lastUpdated: new Date(animeProgress.last_watched_at)
              } : undefined,
              addedAt: new Date()
            });
          }
          
          const manga = mockMangas?.find(m => m.id === itemId);
          if (manga) {
            const mangaProgress = userProgress.manga_progress?.find(p => p.manga_id === itemId);
            watchlist.push({
              id: manga.id,
              title: manga.title,
              type: 'manga',
              poster: manga.cover,
              rating: manga.rating,
              year: manga.year,
              genres: manga.genres,
              status: mangaProgress?.status || 'plan_to_read',
              progress: mangaProgress ? {
                current: mangaProgress.chapters_read,
                total: mangaProgress.total_chapters,
                lastUpdated: new Date(mangaProgress.last_read_at)
              } : undefined,
              addedAt: new Date()
            });
          }
        });
      }

      // ADDED: Demo data if no real watchlist exists
      if (watchlist.length === 0) {
        watchlist = [
          {
            id: 'demo-1',
            title: 'Attack on Titan',
            type: 'anime',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 9.2,
            year: 2013,
            genres: ['Action', 'Drama', 'Fantasy'],
            status: 'watching',
            progress: {
              current: 15,
              total: 25,
              lastUpdated: new Date('2024-03-10')
            },
            addedAt: new Date('2024-01-15')
          },
          {
            id: 'demo-2',
            title: 'One Piece',
            type: 'manga',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 9.5,
            year: 1997,
            genres: ['Adventure', 'Comedy', 'Action'],
            status: 'reading',
            progress: {
              current: 1098,
              total: 1100,
              lastUpdated: new Date('2024-03-12')
            },
            addedAt: new Date('2024-02-20')
          },
          {
            id: 'demo-3',
            title: 'Demon Slayer',
            type: 'anime',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 8.7,
            year: 2019,
            genres: ['Action', 'Historical', 'Supernatural'],
            status: 'completed',
            progress: {
              current: 26,
              total: 26,
              lastUpdated: new Date('2024-02-28')
            },
            addedAt: new Date('2024-02-14')
          },
          {
            id: 'demo-4',
            title: 'My Hero Academia',
            type: 'manga',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 8.5,
            year: 2014,
            genres: ['Action', 'School', 'Superhero'],
            status: 'paused',
            progress: {
              current: 250,
              total: 400,
              lastUpdated: new Date('2024-02-15')
            },
            addedAt: new Date('2024-01-10')
          },
          {
            id: 'demo-5',
            title: 'Your Name',
            type: 'anime',
            poster: 'https://images.unsplash.com/photo-1606997142479-f30ca7ac7c4c?w=300&h=400&fit=crop',
            rating: 8.8,
            year: 2016,
            genres: ['Romance', 'Drama', 'Supernatural'],
            status: 'plan_to_watch',
            addedAt: new Date('2024-03-01')
          },
          {
            id: 'demo-6',
            title: 'Death Note',
            type: 'manga',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 9.0,
            year: 2003,
            genres: ['Psychological', 'Thriller', 'Supernatural'],
            status: 'plan_to_read',
            addedAt: new Date('2024-03-05')
          },
          {
            id: 'demo-7',
            title: 'Spirited Away',
            type: 'anime',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
            rating: 9.3,
            year: 2001,
            genres: ['Adventure', 'Family', 'Fantasy'],
            status: 'completed',
            progress: {
              current: 1,
              total: 1,
              lastUpdated: new Date('2024-02-20')
            },
            addedAt: new Date('2024-02-18')
          },
          {
            id: 'demo-8',
            title: 'Jujutsu Kaisen',
            type: 'anime',
            poster: 'https://www.pinterest.com/pin/awesome-attack-on-titan-iphone-wallpapers-wallpaperaccess--667729082273465998/',
            rating: 8.6,
            year: 2020,
            genres: ['Action', 'School', 'Supernatural'],
            status: 'watching',
            progress: {
              current: 12,
              total: 24,
              lastUpdated: new Date('2024-03-08')
            },
            addedAt: new Date('2024-03-01')
          }
        ];
      }

      setWatchlistItems(watchlist);
      setLoading(false);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...watchlistItems];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    setFilteredItems(filtered);
  };

  const removeFromWatchlist = (itemId: string) => {
    const success = UserProgressService.removeFromWatchlist(itemId);
    if (success) {
      setWatchlistItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Removed from watchlist",
        description: "Item has been removed from your watchlist.",
      });
    }
  };

  const updateProgress = (itemId: string, newProgress: { current: number; total: number }) => {
    if (newProgress.current < 0 || newProgress.current > newProgress.total) return;

    const item = watchlistItems.find(i => i.id === itemId);
    if (!item) return;

    let newStatus = item.status;
    if (newProgress.current === newProgress.total && newProgress.total > 0) {
      newStatus = 'completed';
    } else if (newProgress.current > 0) {
      newStatus = item.type === 'anime' ? 'watching' : 'reading';
    }

    if (item.type === 'anime') {
      UserProgressService.updateAnimeProgress(itemId, {
        episodes_watched: newProgress.current,
        total_episodes: newProgress.total,
        status: newStatus as any
      });
    } else {
      UserProgressService.updateMangaProgress(itemId, {
        chapters_read: newProgress.current,
        total_chapters: newProgress.total,
        status: newStatus as any
      });
    }

    setWatchlistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: newStatus as any,
            progress: { ...newProgress, lastUpdated: new Date() }
          }
        : item
    ));

    toast({
      title: "Progress updated",
      description: `Updated ${item.type} progress to ${newProgress.current}/${newProgress.total}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watching':
      case 'reading':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'dropped':
        return 'bg-red-500';
      case 'plan_to_watch':
      case 'plan_to_read':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watching':
      case 'reading':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'dropped':
        return <AlertCircle className="h-4 w-4" />;
      case 'plan_to_watch':
      case 'plan_to_read':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'watching':
        return 'Watching';
      case 'reading':
        return 'Reading';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      case 'dropped':
        return 'Dropped';
      case 'plan_to_watch':
        return 'Plan to Watch';
      case 'plan_to_read':
        return 'Plan to Read';
      default:
        return status;
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
              <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                {getStatusIcon(item.status)}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2">
              {/* FIXED: Added type="button" and title attributes */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeFromWatchlist(item.id)}
                className="h-8 w-8 p-0"
                title={`Remove ${item.title} from watchlist`}
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

            <div className="mb-3">
              <Badge variant="outline" className="text-xs mb-2">
                {getStatusLabel(item.status)}
              </Badge>
              
              {item.progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{item.progress.current}/{item.progress.total}</span>
                  </div>
                  <Progress 
                    value={(item.progress.current / item.progress.total) * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(item.id, {
                        current: Math.max(0, item.progress!.current - 1),
                        total: item.progress!.total
                      })}
                      className="h-6 w-6 p-0"
                      title="Decrease progress"
                      disabled={item.progress.current <= 0}
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(item.id, {
                        current: Math.min(item.progress!.total, item.progress!.current + 1),
                        total: item.progress!.total
                      })}
                      className="h-6 w-6 p-0"
                      title="Increase progress"
                      disabled={item.progress.current >= item.progress.total}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
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
                <Button type="button" variant="outline" size="sm">
                  {item.type === 'anime' ? <Play className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                  {item.type === 'anime' ? 'Watch' : 'Read'}
                </Button>
              </Link>
              <Button type="button" variant="ghost" size="sm" title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.poster}
                alt={item.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {item.type}
                  </Badge>
                  <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                    {getStatusIcon(item.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{item.rating}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{item.year}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{getStatusLabel(item.status)}</span>
                </div>

                {item.progress && (
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{item.progress.current}/{item.progress.total}</span>
                    </div>
                    <Progress 
                      value={(item.progress.current / item.progress.total) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {item.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                  {item.genres.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.genres.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {item.progress && (
                  <div className="flex items-center gap-1 mr-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(item.id, {
                        current: Math.max(0, item.progress!.current - 1),
                        total: item.progress!.total
                      })}
                      className="h-8 w-8 p-0"
                      title="Decrease progress"
                      disabled={item.progress.current <= 0}
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(item.id, {
                        current: Math.min(item.progress!.total, item.progress!.current + 1),
                        total: item.progress!.total
                      })}
                      className="h-8 w-8 p-0"
                      title="Increase progress"
                      disabled={item.progress.current >= item.progress.total}
                    >
                      +
                    </Button>
                  </div>
                )}
                
                <Link to={`/${item.type}/${item.id}`}>
                  <Button type="button" variant="outline" size="sm">
                    {item.type === 'anime' ? <Play className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                    {item.type === 'anime' ? 'Watch' : 'Read'}
                  </Button>
                </Link>
                
                <Button type="button" variant="ghost" size="sm" title="Share">
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromWatchlist(item.id)}
                  className="text-red-600 hover:text-red-700"
                  title={`Remove ${item.title} from watchlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: watchlistItems.length,
    watching: watchlistItems.filter(item => item.status === 'watching' || item.status === 'reading').length,
    completed: watchlistItems.filter(item => item.status === 'completed').length,
    paused: watchlistItems.filter(item => item.status === 'paused').length,
    planned: watchlistItems.filter(item => item.status === 'plan_to_watch' || item.status === 'plan_to_read').length
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="h-8 w-8 text-blue-500" />
              My Watchlist
            </h1>
            <p className="text-gray-600 mt-1">
              Track your anime and manga progress ({stats.total} items)
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              type="button"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.watching}</div>
            <div className="text-sm text-gray-600">Current</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.paused}</div>
            <div className="text-sm text-gray-600">Paused</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.planned}</div>
            <div className="text-sm text-gray-600">Planned</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  placeholder="Search watchlist..."
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="watching">Watching</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
                <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                <SelectItem value="plan_to_read">Plan to Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 text-center max-w-md">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? "Try adjusting your filters to see more items."
                : "Start adding anime and manga to your watchlist!"}
            </p>
            {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
              <div className="flex gap-3 mt-4">
                <Link to="/anime">
                  <Button type="button" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Browse Anime
                  </Button>
                </Link>
                <Link to="/manga">
                  <Button type="button" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Manga
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? <GridView /> : <ListView />}
        </>
      )}
    </div>
  );
}