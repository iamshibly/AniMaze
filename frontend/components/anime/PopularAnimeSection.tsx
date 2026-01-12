import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star, TrendingUp } from 'lucide-react';
import { getTrendingAnime } from '@/lib/anilist';

import type { Anime } from '@/lib/mockData';

export default function PopularAnimeSection() {
  const [language] = useState<'en' | 'bn'>('en');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const apiData = await getTrendingAnime(8);
        
        const mappedAnimes = apiData.map(anime => ({
          id: anime.id.toString(),
          title: anime.title.english || anime.title.romaji || '',
          titlebn: anime.title.native || '',
          description: anime.description?.replace(/<\/?[^>]+(>|$)/g, "") || 'Description not available',
          descriptionbn: anime.description?.replace(/<\/?[^>]+(>|$)/g, "") || 'বিবরণ নেই',
          poster: anime.coverImage.large,
          trailer: '',
          year: anime.startDate?.year || new Date().getFullYear(),
          studio: 'Studio information', // AniList doesn't provide studio directly
          genres: anime.genres,
          rating: (anime.averageScore ? anime.averageScore / 10 : 0),
          episodes: anime.episodes ? Array.from({length: anime.episodes}, (_, i) => ({
            id: (i + 1).toString(),
            number: i + 1,
            title: `Episode ${i + 1}`,
            titlebn: `পর্ব ${i + 1}`,
            description: '',
            descriptionbn: '',
            duration: anime.duration || 24,
            thumbnail: anime.coverImage.medium,
            videoUrl: '',
            airDate: new Date()
          })) : [],
          status: mapStatus(anime.status),
          tags: [],
          cast: [],
          staff: [],
          awards: []
        }));

        setAnimes(mappedAnimes);
      } catch (err) {
        setError('Failed to load trending anime');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingAnime();
  }, []);

  const mapStatus = (status: string): Anime['status'] => {
    switch(status.toLowerCase()) {
      case 'releasing': return 'ongoing';
      case 'finished': return 'completed';
      case 'not_yet_released': return 'upcoming';
      case 'hiatus': return 'completed';
      default: return 'completed';
    }
  };

  if (loading) return <div className="text-center py-8">Loading trending anime...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  
  const popularAnimes = animes.sort((a, b) => b.rating - a.rating);

  const PopularAnimeCard = ({ anime, index }: { anime: Anime; index: number }) => (
    <Card className="card-hover overflow-hidden relative group">
      <div className="relative">
        <img 
          src={anime.poster} 
          alt={anime.title}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg px-3 py-1">
            #{index + 1}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
              {anime.year}
            </Badge>
            <Badge 
              variant={anime.status === 'completed' ? 'secondary' : 
                     anime.status === 'ongoing' ? 'default' : 'destructive'}
              className="bg-black/50 text-white border-white/20"
            >
              {anime.status}
            </Badge>
            <div className="flex items-center bg-black/50 px-2 py-1 rounded border border-white/20">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm ml-1 font-semibold">{anime.rating}</span>
            </div>
          </div>
          
          <h3 className="text-white text-xl font-bold mb-2 line-clamp-1">
            {language === 'bn' ? anime.titlebn : anime.title}
          </h3>
          
          <p className="text-white/80 text-sm line-clamp-2 mb-4">
            {language === 'bn' ? anime.descriptionbn : anime.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {anime.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs text-white border-white/30 bg-white/10">
                {genre}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              {anime.episodes.length} {language === 'bn' ? 'পর্ব' : 'Episodes'} • {anime.studio}
            </span>
            <Link to={`/anime/${anime.id}`}>
              <Button className="btn-anime bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Play className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'দেখুন' : 'Watch'}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="lg" 
            className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
          >
            <Play className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gradient">
            {language === 'bn' ? 'জনপ্রিয় অ্যানিমে' : 'Popular Anime'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'bn' 
              ? 'সবচেয়ে জনপ্রিয় এবং উচ্চ রেটিং প্রাপ্ত অ্যানিমে'
              : 'Most popular and highly rated anime series'
            }
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {popularAnimes.slice(0, 8).map((anime, index) => (
          <PopularAnimeCard key={anime.id} anime={anime} index={index} />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link to="/anime">
          <Button 
            variant="outline" 
            size="lg"
            className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20"
          >
            {language === 'bn' ? 'সব অ্যানিমে দেখুন' : 'View All Anime'}
          </Button>
        </Link>
      </div>
    </section>
  );
}
