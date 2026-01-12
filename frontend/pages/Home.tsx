import { useState, useEffect } from 'react';
import { Play, Plus, Info, Volume2, VolumeX, ChevronLeft, ChevronRight, Star, Eye, Heart, Loader2 } from 'lucide-react';

// AniList API GraphQL endpoint
const ANILIST_API = 'https://graphql.anilist.co';

// GraphQL Queries
const TRENDING_QUERY = `
  query GetTrending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
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
        bannerImage
        averageScore
        seasonYear
        episodes
        genres
        status
        format
        trailer {
          id
          site
          thumbnail
        }
      }
    }
  }
`;

const POPULAR_QUERY = `
  query GetPopular($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        averageScore
        seasonYear
        episodes
        genres
        status
      }
    }
  }
`;

const TOP_RATED_QUERY = `
  query GetTopRated($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        averageScore
        seasonYear
        episodes
        genres
        status
      }
    }
  }
`;

const SEASONAL_QUERY = `
  query GetSeasonal($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        averageScore
        episodes
        genres
        status
      }
    }
  }
`;

// Helper function to make API calls
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

// Get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 'WINTER';
  if (month >= 3 && month <= 5) return 'SPRING';
  if (month >= 6 && month <= 8) return 'SUMMER';
  return 'FALL';
};

export default function Home() {
  const [language] = useState<'en' | 'bn'>('en');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Anime data states
  const [heroAnimes, setHeroAnimes] = useState<any[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [popularAnime, setPopularAnime] = useState<any[]>([]);
  const [topRatedAnime, setTopRatedAnime] = useState<any[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<any[]>([]);

  // Fetch all anime data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      // Fetch different categories in parallel
      const [trending, popular, topRated, seasonal] = await Promise.all([
        fetchAniListData(TRENDING_QUERY, { page: 1, perPage: 20 }),
        fetchAniListData(POPULAR_QUERY, { page: 1, perPage: 10 }),
        fetchAniListData(TOP_RATED_QUERY, { page: 1, perPage: 10 }),
        fetchAniListData(SEASONAL_QUERY, { 
          season: getCurrentSeason(), 
          seasonYear: new Date().getFullYear(),
          page: 1, 
          perPage: 10 
        })
      ]);
      
      // Set hero animes (top 3 trending with banner images)
      const heroData = trending.filter((anime: any) => anime.bannerImage).slice(0, 3);
      setHeroAnimes(heroData.length > 0 ? heroData : trending.slice(0, 3));
      
      setTrendingAnime(trending.slice(0, 10));
      setPopularAnime(popular);
      setTopRatedAnime(topRated);
      setSeasonalAnime(seasonal);
      
      setLoading(false);
    };
    
    fetchAllData();
  }, []);

  // Auto-rotate hero banner
  useEffect(() => {
    if (heroAnimes.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroAnimes.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [heroAnimes.length]);

  const currentHero = heroAnimes[currentHeroIndex];

  const AnimeRow = ({ title, animes, showRank = false }: { title: string; animes: any[]; showRank?: boolean }) => {
    const [rowSlide, setRowSlide] = useState(0);
    const itemsPerSlide = 5;
    const maxSlide = Math.ceil(animes.length / itemsPerSlide) - 1;

    const nextSlide = () => {
      setRowSlide((prev) => (prev < maxSlide ? prev + 1 : 0));
    };

    const prevSlide = () => {
      setRowSlide((prev) => (prev > 0 ? prev - 1 : maxSlide));
    };

    return (
      <div className="relative group/row mb-12">
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        
        <div className="relative overflow-hidden">
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-0 bottom-0 z-10 bg-black/50 px-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div 
            className="flex gap-2 transition-transform duration-500"
            style={{ transform: `translateX(-${rowSlide * 100}%)` }}
          >
            {animes.map((anime, index) => (
              <div 
                key={anime.id} 
                className="flex-shrink-0 w-[19.5%] relative group cursor-pointer"
                onMouseEnter={() => setHoveredCard(anime.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden rounded-md">
                  <img 
                    src={anime.coverImage.large} 
                    alt={anime.title.english || anime.title.romaji}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-black ml-1" fill="black" />
                    </div>
                  </div>
                  
                  {/* Rank badge for top 10 */}
                  {showRank && index < 10 && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white font-bold text-2xl w-12 h-16 flex items-center justify-center">
                      {index + 1}
                    </div>
                  )}
                  
                  {/* Anime info on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                      {language === 'bn' 
                        ? anime.title.native || anime.title.romaji
                        : anime.title.english || anime.title.romaji}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded">
                        {anime.seasonYear || 'TBA'}
                      </span>
                      <div className="flex items-center text-white text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-0 bottom-0 z-10 bg-black/50 px-2 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading anime data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Video/Image Background */}
      <section className="relative h-[85vh] overflow-hidden">
        {currentHero && (
          <>
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={currentHero.bannerImage || currentHero.coverImage.extraLarge} 
                alt={currentHero.title.english || currentHero.title.romaji}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </div>
            
            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-8">
                <div className="max-w-2xl">
                  {/* Title */}
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
                    {language === 'bn' 
                      ? currentHero.title.native || currentHero.title.romaji
                      : currentHero.title.english || currentHero.title.romaji}
                  </h1>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded">
                      {currentHero.status === 'RELEASING' ? 'New Episodes' : currentHero.status}
                    </span>
                    <span className="text-white font-semibold">{currentHero.seasonYear || 'TBA'}</span>
                    <span className="text-white/80">
                      {currentHero.episodes || '?'} Episodes
                    </span>
                    <div className="flex items-center text-white">
                      <Star className="w-5 h-5 mr-1 fill-current text-yellow-400" />
                      <span className="font-semibold">
                        {currentHero.averageScore ? (currentHero.averageScore / 10).toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p 
                    className="text-lg text-white/90 mb-6 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: currentHero.description?.replace(/<[^>]*>/g, '') || 'No description available.' 
                    }}
                  />
                  
                  {/* Genres */}
                  <div className="flex gap-2 mb-8">
                    {currentHero.genres?.slice(0, 3).map((genre: string) => (
                      <span key={genre} className="text-white/80">
                        {genre} {genre !== currentHero.genres[currentHero.genres.length - 1] && '•'}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded flex items-center font-semibold">
                      <Play className="w-5 h-5 mr-2" fill="black" />
                      Watch Now
                    </button>
                    <button className="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-8 py-3 rounded flex items-center font-semibold">
                      <Plus className="w-5 h-5 mr-2" />
                      Add to List
                    </button>
                    <button
                      className="bg-white/20 text-white border border-white/30 hover:bg-white/30 p-3 rounded"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              {heroAnimes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentHeroIndex ? 'w-8 bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Favorite Button */}
            <button className="absolute top-8 right-8 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors">
              <Heart className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </section>

      {/* Content Rows */}
      <div className="relative z-20 -mt-32 pb-20">
        <div className="container mx-auto px-8 space-y-8">
          {/* Trending Anime */}
          <AnimeRow 
            title={language === 'bn' ? 'ট্রেন্ডিং অ্যানিমে' : 'Trending Now'} 
            animes={trendingAnime} 
            showRank={true}
          />
          
          {/* Popular Anime */}
          <AnimeRow 
            title={language === 'bn' ? 'জনপ্রিয় অ্যানিমে' : 'Most Popular'} 
            animes={popularAnime} 
          />
          
          {/* Top Rated */}
          <AnimeRow 
            title={language === 'bn' ? 'সর্বোচ্চ রেটেড' : 'Top Rated'} 
            animes={topRatedAnime} 
          />
          
          {/* Seasonal Anime */}
          <AnimeRow 
            title={language === 'bn' 
              ? `${getCurrentSeason()} ${new Date().getFullYear()} সিজন` 
              : `${getCurrentSeason()} ${new Date().getFullYear()} Anime`} 
            animes={seasonalAnime} 
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-black/90 py-8 px-8">
        <div className="container mx-auto text-center">
          <p className="text-white/60 text-sm">
            {language === 'bn' 
              ? 'AniList API দ্বারা চালিত • রিয়েল-টাইম অ্যানিমে ডেটা'
              : 'Powered by AniList API • Real-time anime data'
            }
          </p>
          <p className="text-white/40 text-xs mt-2">
            {language === 'bn'
              ? 'স্ট্রিমিং লিঙ্কের জন্য Consumet API ইন্টিগ্রেশন প্রয়োজন'
              : 'Streaming links require Consumet API integration'
            }
          </p>
        </div>
      </div>
    </div>
  );
}