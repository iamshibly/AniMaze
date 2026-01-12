import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Book, Star, Search, TrendingUp, Loader2 } from 'lucide-react';
import { type Manga } from '@/lib/mockData';
import { MangaSearchEngine, type MangaSearchResult } from '@/components/manga/MangaSearchEngine';
import MangaFilters from '@/components/manga/MangaFilters';

// MangaDex API functions
const MANGADEX_API = 'https://api.mangadex.org';

async function fetchMangaDexData(limit = 100, offset = 0): Promise<Manga[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API}/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe&contentRating[]=suggestive&order[followedCount]=desc&hasAvailableChapters=true`
    );
    
    if (!response.ok) throw new Error('Failed to fetch from MangaDex');
    
    const data = await response.json();
    
    return data.data.map((manga: any) => {
      const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
      const author = manga.relationships.find((rel: any) => rel.type === 'author');
      
      const coverUrl = coverArt 
        ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
        : '/placeholder-manga.jpg';
      
      const title = manga.attributes.title.en || 
                   manga.attributes.title.ja || 
                   manga.attributes.title['ja-ro'] ||
                   Object.values(manga.attributes.title)[0] as string || 
                   'Unknown Title';
      
      const description = manga.attributes.description.en || 
                         manga.attributes.description.ja || 
                         Object.values(manga.attributes.description)[0] as string || 
                         'No description available';
      
      // Generate a realistic rating based on followed count
      const followedCount = manga.attributes.followedCount || 0;
      const rating = Math.min(10, 6 + (followedCount / 10000) * 4);
      
      return {
        id: manga.id,
        title: title,
        titlebn: title, // You may want to add translation later
        description: description.slice(0, 200) + '...',
        descriptionbn: description.slice(0, 200) + '...', // You may want to add translation later
        cover: coverUrl,
        year: new Date(
          manga.attributes.year ? manga.attributes.year :
          manga.attributes.publicationDate ? manga.attributes.publicationDate :
          Date.now()
        ).getFullYear(),
        author: author?.attributes?.name || 'Unknown Author',
        publisher: manga.attributes.publicationDemographic || 'Unknown', 
        publicationDate: manga.attributes.year ? new Date(manga.attributes.year, 0, 1).toISOString() : new Date().toISOString(),
        genres: manga.attributes.tags
          .filter((tag: any) => tag.attributes.group === 'genre')
          .map((tag: any) => tag.attributes.name.en),
        tags: manga.attributes.tags
          .filter((tag: any) => tag.attributes.group === 'theme')
          .map((tag: any) => tag.attributes.name.en),
        rating: Math.round(rating * 10) / 10,
        status: manga.attributes.status,
        volumes: manga.attributes.lastVolume || 0,
        chapters: Array.from({ length: manga.attributes.lastChapter || 0 }, (_, i) => ({
          id: `${i + 1}`,
          mangaId: manga.id,
          number: i + 1,
          title: `Chapter ${i + 1}`,
          titlebn: `অধ্যায় ${i + 1}`,
          publishDate: new Date().toISOString(),
          pages: []
        }))
      } as Manga;
    });
  } catch (error) {
    console.error('Error fetching from MangaDex:', error);
    return [];
  }
}

export default function MangaPage() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [volumeRange, setVolumeRange] = useState<[number, number]>([0, 200]);
  const [chapterRange, setChapterRange] = useState<[number, number]>([0, 1500]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [yearRange, setYearRange] = useState<[number, number]>([1950, 2024]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [language] = useState<'en' | 'bn'>('en');

  // Fetch data from MangaDex on component mount
  useEffect(() => {
    const loadMangaData = async () => {
      setIsLoading(true);
      try {
        const mangaDexData = await fetchMangaDexData(100, 0);
        if (mangaDexData.length > 0) {
          setMangas(mangaDexData);
          setApiError(false);
        } else {
          setApiError(true);
        }
      } catch (error) {
        console.error('Failed to load manga data:', error);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMangaData();
  }, []);

  const allGenres = useMemo(() => 
    Array.from(new Set(mangas.flatMap(manga => manga.genres))).sort(), 
    [mangas]
  );
  
  const allCategories = useMemo(() => 
    ['Shounen', 'Shoujo', 'Seinen', 'Josei', 'Kodomomuke'], 
    []
  );
  
  const allAuthors = useMemo(() => 
    Array.from(new Set(mangas.map(manga => manga.author))).sort(), 
    [mangas]
  );
  
  const allPublishers = useMemo(() => 
    Array.from(new Set(mangas.map(manga => manga.publisher))).sort(), 
    [mangas]
  );
  
  const allStatuses = useMemo(() => 
    Array.from(new Set(mangas.map(manga => manga.status))).sort(), 
    [mangas]
  );

  const searchResults = useMemo((): MangaSearchResult[] => {
    return MangaSearchEngine.searchMangas(mangas, searchQuery);
  }, [mangas, searchQuery]);

  const filteredMangas = useMemo(() => {
    let results = searchQuery.trim() 
      ? searchResults.map(result => result.manga)
      : mangas;

    // Apply filters
    results = results.filter(manga => {
      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.every(genre => manga.genres.includes(genre));
      
      const matchesCategories = selectedCategories.length === 0 || 
        selectedCategories.some(category => manga.genres.includes(category));
      
      const matchesAuthors = selectedAuthors.length === 0 || 
        selectedAuthors.includes(manga.author);
      
      const matchesPublishers = selectedPublishers.length === 0 || 
        selectedPublishers.includes(manga.publisher);
      
      const matchesStatus = selectedStatus === 'all' || manga.status === selectedStatus;
      
      const matchesVolumeRange = manga.volumes >= volumeRange[0] && manga.volumes <= volumeRange[1];
      
      const matchesChapterRange = manga.chapters.length >= chapterRange[0] && manga.chapters.length <= chapterRange[1];
      
      const matchesRating = manga.rating >= ratingRange[0] && manga.rating <= ratingRange[1];
      
      const mangaYear = new Date(manga.publicationDate).getFullYear();
      const matchesYear = mangaYear >= yearRange[0] && mangaYear <= yearRange[1];
      
      return matchesGenres && matchesCategories && matchesAuthors && matchesPublishers && 
             matchesStatus && matchesVolumeRange && matchesChapterRange && matchesRating && matchesYear;
    });

    // Apply sorting
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.rating - a.rating; // Using rating as popularity proxy
        case 'year':
          return new Date(b.publicationDate).getFullYear() - new Date(a.publicationDate).getFullYear();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recently-added':
          return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        case 'chapters':
          return b.chapters.length - a.chapters.length;
        default:
          return 0;
      }
    });
  }, [mangas, searchResults, searchQuery, selectedGenres, selectedCategories, selectedAuthors, 
      selectedPublishers, selectedStatus, volumeRange, chapterRange, ratingRange, yearRange, sortBy]);

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setSelectedPublishers([]);
    setSelectedStatus('all');
    setVolumeRange([0, 200]);
    setChapterRange([0, 1500]);
    setRatingRange([0, 10]);
    setYearRange([1950, 2024]);
    setSearchQuery('');
  };

  const MangaCard = ({ manga }: { manga: Manga }) => (
    <Card className="card-hover overflow-hidden">
      <div className="relative">
        <img 
          src={manga.cover} 
          alt={manga.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-manga.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {new Date(manga.publicationDate).getFullYear()}
            </Badge>
            <Badge 
              variant={manga.status === 'completed' ? 'secondary' : 
                     manga.status === 'ongoing' ? 'default' : 'destructive'}
              className="bg-black/50 text-white"
            >
              {manga.status}
            </Badge>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-white text-sm ml-1">{manga.rating}</span>
          </div>
        </div>
        <Button 
          size="icon" 
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
        >
          <Book className="w-4 h-4" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">
          {language === 'bn' ? manga.titlebn : manga.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {language === 'bn' ? manga.descriptionbn : manga.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {manga.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {manga.genres.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{manga.genres.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {manga.chapters.length} {language === 'bn' ? 'অধ্যায়' : 'Chapters'}
          </span>
          <Link to={`/manga/${manga.id}`}>
            <Button className="btn-manga">
              <Book className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'পড়ুন' : 'Read'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const MangaListItem = ({ manga }: { manga: Manga }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <img 
            src={manga.cover} 
            alt={manga.title}
            className="w-24 h-32 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-manga.jpg';
            }}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {language === 'bn' ? manga.titlebn : manga.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 mt-1">
                  {language === 'bn' ? manga.descriptionbn : manga.description}
                </p>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm ml-1">{manga.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {manga.genres.slice(0, 4).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{new Date(manga.publicationDate).getFullYear()}</span>
                <span>{manga.chapters.length} {language === 'bn' ? 'অধ্যায়' : 'Chapters'}</span>
                <span>{manga.volumes} {language === 'bn' ? 'খণ্ড' : 'Volumes'}</span>
              </div>
              <Link to={`/manga/${manga.id}`}>
                <Button className="btn-manga">
                  <Book className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'পড়ুন' : 'Read'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            {language === 'bn' ? 'মাঙ্গা কালেকশন' : 'Manga Collection'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আপনার প্রিয় মাঙ্গা আবিষ্কার করুন, পড়ুন এবং আপনার রিডিং তালিকা তৈরি করুন। সেমান্টিক সার্চ এবং AI সুপারিশ সহ।'
              : 'Discover, read, and build your reading list with your favorite manga. Featuring semantic search and AI recommendations.'
            }
          </p>
          {apiError && (
            <p className="text-sm text-red-600 mt-2">
              {language === 'bn' 
                ? 'ডেটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।'
                : 'Failed to load data. Please try again later.'
              }
            </p>
          )}
        </div>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={language === 'bn' ? 'মাঙ্গা খুঁজুন... (যেমন: "নারুতো", "ওয়ান পিস")' : 'Search manga... (e.g., "Naruto", "One Piece")'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 rounded-xl shadow-lg focus:shadow-xl transition-shadow"
              disabled={isLoading}
            />
          </div>
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'bn' 
                  ? `"${searchQuery}" এর জন্য ${filteredMangas.length} টি ফলাফল পাওয়া গেছে`
                  : `Found ${filteredMangas.length} results for "${searchQuery}"`
                }
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              {language === 'bn' ? 'মাঙ্গা লোড হচ্ছে...' : 'Loading manga...'}
            </span>
          </div>
        )}

        {/* Popular Manga Section - only show when no search query and data is loaded */}
        {!searchQuery.trim() && !isLoading && mangas.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-3xl font-bold text-gradient">
                    {language === 'bn' ? 'জনপ্রিয় মাঙ্গা' : 'Popular Manga'}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {language === 'bn' 
                      ? 'সর্বাধিক রেটিং সহ মাঙ্গা সিরিজ'
                      : 'Top-rated manga series loved by readers worldwide'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mangas
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 8)
                .map((manga) => (
                  <Card key={manga.id} className="group relative overflow-hidden card-hover h-full">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img 
                        src={manga.cover} 
                        alt={manga.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-manga.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/70 text-white border-none">
                          <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                          {manga.rating}
                        </Badge>
                      </div>

                      {/* Popular badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-primary/90 text-white border-none">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                        </Badge>
                      </div>

                      {/* Hover overlay content */}
                      <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                          {language === 'bn' ? manga.titlebn : manga.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-3 line-clamp-2">
                          {language === 'bn' ? manga.descriptionbn : manga.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {manga.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs border-white/30 text-white">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        <Link to={`/manga/${manga.id}`}>
                          <Button size="sm" className="w-full">
                            <Book className="w-4 h-4 mr-2" />
                            {language === 'bn' ? 'পড়ুন' : 'Read Now'}
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {language === 'bn' ? manga.titlebn : manga.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {manga.author} • {new Date(manga.publicationDate).getFullYear()}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {manga.chapters.length} {language === 'bn' ? 'অধ্যায়' : 'chapters'}
                          </span>
                          <Badge 
                            variant={manga.status === 'completed' ? 'secondary' : 
                                   manga.status === 'ongoing' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {manga.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Advanced Filters */}
        {!isLoading && mangas.length > 0 && (
          <MangaFilters
            selectedGenres={selectedGenres}
            selectedCategories={selectedCategories}
            selectedAuthors={selectedAuthors}
            selectedPublishers={selectedPublishers}
            selectedStatus={selectedStatus}
            volumeRange={volumeRange}
            chapterRange={chapterRange}
            ratingRange={ratingRange}
            yearRange={yearRange}
            sortBy={sortBy}
            viewMode={viewMode}
            allGenres={allGenres}
            allCategories={allCategories}
            allAuthors={allAuthors}
            allPublishers={allPublishers}
            allStatuses={allStatuses}
            onGenresChange={setSelectedGenres}
            onCategoriesChange={setSelectedCategories}
            onAuthorsChange={setSelectedAuthors}
            onPublishersChange={setSelectedPublishers}
            onStatusChange={setSelectedStatus}
            onVolumeRangeChange={setVolumeRange}
            onChapterRangeChange={setChapterRange}
            onRatingRangeChange={setRatingRange}
            onYearRangeChange={setYearRange}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
            onClearFilters={handleClearFilters}
            language={language}
            totalResults={filteredMangas.length}
          />
        )}

        {/* Content */}
        {!isLoading && (
          filteredMangas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'bn' ? 'কোন মাঙ্গা পাওয়া যায়নি' : 'No manga found'}
              </h3>
              <p className="text-muted-foreground">
                {apiError ? (
                  language === 'bn' 
                    ? 'API থেকে ডেটা লোড করতে ব্যর্থ। পরে আবার চেষ্টা করুন।'
                    : 'Failed to load data from API. Please try again later.'
                ) : (
                  language === 'bn' 
                    ? 'আপনার অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।'
                    : 'Try changing your search criteria and try again.'
                )}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }>
              {filteredMangas.map((manga) => (
                viewMode === 'grid' 
                  ? <MangaCard key={manga.id} manga={manga} />
                  : <MangaListItem key={manga.id} manga={manga} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
