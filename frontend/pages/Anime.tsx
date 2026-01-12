import { useState, useMemo, useEffect } from 'react';
import { Play, Star, Grid, List, TrendingUp, Search, Loader2 } from 'lucide-react';

// Define Anime type
interface Anime {
  id: string;
  title: string;
  titlebn: string;
  description: string;
  descriptionbn: string;
  poster: string;
  trailer: string;
  year: number;
  studio: string;
  genres: string[];
  rating: number;
  episodes: any[];
  status: string;
  tags: string[];
  cast: string[];
  staff: string[];
  awards: string[];
}

// Simple search function
const searchAnimes = (animes: Anime[], query: string) => {
  if (!query.trim()) return animes;
  
  const lowerQuery = query.toLowerCase();
  return animes.filter(anime => 
    anime.title.toLowerCase().includes(lowerQuery) ||
    anime.titlebn.toLowerCase().includes(lowerQuery) ||
    anime.description.toLowerCase().includes(lowerQuery)
  );
};

// AniList API endpoint
const ANILIST_API = 'https://graphql.anilist.co';

// GraphQL Query to fetch anime
const GET_ANIME_QUERY = `
  query GetAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          extraLarge
        }
        averageScore
        seasonYear
        episodes
        genres
        status
        studios {
          nodes {
            name
          }
        }
        startDate {
          year
        }
      }
    }
  }
`;

// Helper function to fetch from AniList
const fetchAniListData = async (query: string, variables: any) => {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });
    
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('Error fetching from AniList:', error);
    return [];
  }
};

// Convert AniList data to match our Anime type
const convertAniListToAnime = (anilistData: any[]): Anime[] => {
  return anilistData.map((anime) => ({
    id: anime.id.toString(),
    title: anime.title.english || anime.title.romaji,
    titlebn: anime.title.native || anime.title.romaji,
    description: anime.description?.replace(/<[^>]*>/g, '') || 'Description not available',
    descriptionbn: anime.description?.replace(/<[^>]*>/g, '') || 'বিবরণ নেই',
    poster: anime.coverImage.extraLarge || anime.coverImage.large,
    trailer: '',
    year: anime.seasonYear || anime.startDate?.year || new Date().getFullYear(),
    studio: anime.studios?.nodes?.[0]?.name || 'Unknown Studio',
    genres: anime.genres || [],
    rating: anime.averageScore ? anime.averageScore / 10 : 0,
    episodes: anime.episodes ? Array.from({length: anime.episodes}, (_, i) => ({
      id: (i + 1).toString(),
      number: i + 1,
      title: `Episode ${i + 1}`,
      titlebn: `পর্ব ${i + 1}`,
      description: '',
      descriptionbn: '',
      duration: 24,
      thumbnail: anime.coverImage.large,
      videoUrl: '',
      airDate: new Date()
    })) : [],
    status: anime.status === 'RELEASING' ? 'ongoing' : 
            anime.status === 'FINISHED' ? 'completed' : 
            anime.status === 'NOT_YET_RELEASED' ? 'upcoming' : 'completed',
    tags: [],
    cast: [],
    staff: [],
    awards: []
  }));
};

export default function AnimePage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStudios, setSelectedStudios] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [yearRange, setYearRange] = useState<[number, number]>([1960, 2024]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [language] = useState<'en' | 'bn'>('en');

  // Fetch anime data from AniList API
  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      // Fetch 50 anime for better filtering
      const anilistData = await fetchAniListData(GET_ANIME_QUERY, { page: 1, perPage: 50 });
      const convertedAnimes = convertAniListToAnime(anilistData);
      setAnimes(convertedAnimes);
      setLoading(false);
    };
    
    fetchAnimes();
  }, []);

  const allGenres = useMemo(() => 
    Array.from(new Set(animes.flatMap(anime => anime.genres))).sort(), 
    [animes]
  );
  
  const allStudios = useMemo(() => 
    Array.from(new Set(animes.map(anime => anime.studio))).sort(), 
    [animes]
  );
  
  const allStatuses = useMemo(() => 
    Array.from(new Set(animes.map(anime => anime.status))).sort(), 
    [animes]
  );

  const searchResults = useMemo(() => {
    return searchAnimes(animes, searchQuery);
  }, [animes, searchQuery]);

  const filteredAnimes = useMemo(() => {
    let results = searchQuery.trim() 
      ? searchResults
      : animes;

    // Apply filters
    results = results.filter(anime => {
      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.every(genre => anime.genres.includes(genre));
      
      const matchesStudios = selectedStudios.length === 0 || 
        selectedStudios.includes(anime.studio);
      
      const matchesStatus = selectedStatus === 'all' || anime.status === selectedStatus;
      
      const matchesYear = anime.year >= yearRange[0] && anime.year <= yearRange[1];
      
      const matchesRating = anime.rating >= ratingRange[0] && anime.rating <= ratingRange[1];
      
      return matchesGenres && matchesStudios && matchesStatus && matchesYear && matchesRating;
    });

    // Apply sorting
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.rating - a.rating; // Using rating as popularity proxy
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recently-added':
          return b.year - a.year; // Using year as recently added proxy
        default:
          return 0;
      }
    });
  }, [animes, searchResults, searchQuery, selectedGenres, selectedStudios, selectedStatus, selectedType, yearRange, ratingRange, sortBy]);

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedStudios([]);
    setSelectedStatus('all');
    setSelectedType('all');
    setYearRange([1960, 2024]);
    setRatingRange([0, 10]);
    setSearchQuery('');
  };

  function AnimeCard({ anime }: { anime: Anime }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="relative">
          <img 
            src={anime.poster} 
            alt={anime.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                {anime.year}
              </span>
              <span 
                className={`text-xs px-2 py-1 rounded text-white ${
                  anime.status === 'completed' ? 'bg-blue-600' : 
                  anime.status === 'ongoing' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {anime.status}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-white text-sm ml-1">{anime.rating}</span>
            </div>
          </div>
          <button 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
            title={language === 'bn' ? 'প্লে করুন' : 'Play'}
          >
            <Play className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 mb-2">
            {language === 'bn' ? anime.titlebn : anime.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {language === 'bn' ? anime.descriptionbn : anime.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {anime.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="text-xs border border-gray-300 rounded px-2 py-1">
                {genre}
              </span>
            ))}
            {anime.genres.length > 3 && (
              <span className="text-xs border border-gray-300 rounded px-2 py-1">
                +{anime.genres.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {anime.episodes.length} {language === 'bn' ? 'পর্ব' : 'Episodes'}
            </span>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
              <Play className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'দেখুন' : 'Watch'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function AnimeListItem({ anime }: { anime: Anime }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow">
        <div className="flex space-x-4">
          <img 
            src={anime.poster} 
            alt={anime.title}
            className="w-24 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {language === 'bn' ? anime.titlebn : anime.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 mt-1">
                  {language === 'bn' ? anime.descriptionbn : anime.description}
                </p>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm ml-1">{anime.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {anime.genres.slice(0, 4).map((genre) => (
                <span key={genre} className="text-xs border border-gray-300 rounded px-2 py-1">
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{anime.year}</span>
                <span>{anime.episodes.length} {language === 'bn' ? 'পর্ব' : 'Episodes'}</span>
                <span>{anime.studio}</span>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                <Play className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'দেখুন' : 'Watch'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient">
              {language === 'bn' ? 'অ্যানিমে' : 'Anime'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আপনার প্রিয় অ্যানিমে আবিষ্কার করুন, বুদ্ধিমান অনুসন্ধান এবং এআই সুপারিশ সহ।'
              : 'Discover your favorite anime with intelligent search and AI recommendations.'
            }
          </p>
        </div>

        {/* Popular Anime Section */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Anime</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {animes.slice(0, 8).map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'অ্যানিমে খুঁজুন...' : 'Search anime...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={language === 'bn' ? 'সাজানোর মানদণ্ড' : 'Sort by'}
            >
                <option value="rating">Rating</option>
                <option value="popularity">Popularity</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
                <option value="recently-added">Recently Added</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={language === 'bn' ? 'অবস্থা নির্বাচন করুন' : 'Select status'}
            >
                <option value="all">All Status</option>
                {allStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Genres */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">
                {allGenres.slice(0, 10).map(genre => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedGenres(prev =>
                        prev.includes(genre)
                          ? prev.filter(g => g !== genre)
                          : [...prev, genre]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Studios */}
            <div>
              <label className="block text-sm font-medium mb-2">Studio</label>
            <select
              value={selectedStudios[0] || ''}
              onChange={(e) => setSelectedStudios(e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label={language === 'bn' ? 'স্টুডিও নির্বাচন করুন' : 'Select studio'}
            >
                <option value="">All Studios</option>
                {allStudios.map(studio => (
                  <option key={studio} value={studio}>{studio}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredAnimes.length} {language === 'bn' ? 'টি ফলাফল' : 'results found'}
            </span>
            {searchQuery && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{language === 'bn' ? 'অনুসন্ধান:' : 'Search:'}</span>
                <span className="bg-gray-200 px-2 py-1 rounded">{searchQuery}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('grid')}
              title={language === 'bn' ? 'গ্রিড ভিউ' : 'Grid view'}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setViewMode('list')}
              title={language === 'bn' ? 'তালিকা ভিউ' : 'List view'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredAnimes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'bn' ? 'কোন অ্যানিমে পাওয়া যায়নি' : 'No anime found'}
            </h3>
            <p className="text-gray-600">
              {language === 'bn' 
                ? 'আপনার অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।'
                : 'Try changing your search criteria and try again.'
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {filteredAnimes.map((anime) => (
              viewMode === 'grid' 
                ? <AnimeCard key={anime.id} anime={anime} />
                : <AnimeListItem key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
