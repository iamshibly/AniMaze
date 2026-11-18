import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Book, Star, Search, TrendingUp, Loader2 } from 'lucide-react';
import { mockMangas, type Manga } from '@/lib/mockData';
import { pdfMangas } from '@/data/pdfMangas';
import { localImageFallback, showLocalImageFallback } from '@/utils/imageUtils';
import { MangaSearchEngine, type MangaSearchResult } from '@/components/manga/MangaSearchEngine';
import MangaFilters, { latestMangaYear } from '@/components/manga/MangaFilters';

type CatalogManga = Manga & { readUrl?: string; chapterCount?: number };

const localMangas: CatalogManga[] = [
  ...pdfMangas.map(manga => ({
    ...manga,
    image: manga.cover,
    publisher: 'Unknown',
    genres: manga.genre.split(', '),
    tags: [],
    status: 'completed' as const,
    volumes: 0,
    chapters: [],
    publicationDate: new Date(manga.year, 0, 1),
    readUrl: manga.pdfPath,
  })),
  ...mockMangas,
];

const mangaDexList = import.meta.env.DEV
  ? '/mangadex-api/manga'
  : 'https://api.mangadex.org/manga';

async function fetchMangaDexData(signal: AbortSignal): Promise<CatalogManga[]> {
  const params = new URLSearchParams([
    ['limit', '100'],
    ['includes[]', 'cover_art'],
    ['includes[]', 'author'],
    ['contentRating[]', 'safe'],
    ['contentRating[]', 'suggestive'],
    ['order[followedCount]', 'desc'],
    ['hasAvailableChapters', 'true'],
  ]);
  const response = await fetch(`${mangaDexList}?${params}`, { signal });
  if (!response.ok) throw new Error(`MangaDex returned HTTP ${response.status}`);

  const { data } = await response.json();
  return data.map((manga: any): CatalogManga => {
    const { attributes, relationships } = manga;
    const coverFile = relationships.find((entry: any) => entry.type === 'cover_art')?.attributes?.fileName;
    const author = relationships.find((entry: any) => entry.type === 'author')?.attributes?.name;
    const title = attributes.title.en || attributes.title['ja-ro'] || attributes.title.ja ||
      String(Object.values(attributes.title)[0] || 'Unknown Title');
    const description = attributes.description?.en || attributes.description?.ja ||
      String(Object.values(attributes.description ?? {})[0] || 'No description available');
    const cover = coverFile
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}.256.jpg`
      : localImageFallback;
    const year = attributes.year ?? 0;
    const tags = attributes.tags ?? [];
    const followedCount = attributes.followedCount ?? 0;
    const rating = Math.min(10, Math.round((6 + followedCount / 2500) * 10) / 10);
    const chapterCount = Number(attributes.lastChapter) || 0;

    return {
      id: manga.id,
      title,
      titlebn: title,
      description,
      descriptionbn: description,
      cover,
      image: cover,
      year,
      author: author || 'Unknown Author',
      publisher: attributes.publicationDemographic || 'Unknown',
      publicationDate: year ? new Date(year, 0, 1) : new Date(0),
      genres: tags.filter((tag: any) => tag.attributes.group === 'genre').map((tag: any) => tag.attributes.name.en),
      tags: tags.filter((tag: any) => tag.attributes.group === 'theme').map((tag: any) => tag.attributes.name.en),
      rating,
      status: attributes.status,
      volumes: Number(attributes.lastVolume) || 0,
      chapters: [],
      chapterCount,
      readUrl: `https://mangadex.org/title/${manga.id}`,
    };
  });
}

function getChapterCount(manga: CatalogManga) {
  return manga.chapterCount ?? manga.chapters.length;
}

function MangaReadButton({ manga, children, ...props }: React.ComponentProps<typeof Button> & { manga: CatalogManga }) {
  return (
    <Button {...props} asChild>
      {manga.readUrl
        ? <a href={manga.readUrl} target="_blank" rel="noreferrer">{children}</a>
        : <Link to={`/manga/${manga.id}`}>{children}</Link>}
    </Button>
  );
}

export default function MangaPage() {
  const [mangas, setMangas] = useState<CatalogManga[]>(localMangas);
  const [isLoading, setIsLoading] = useState(true);
  const [usingLocalCatalog, setUsingLocalCatalog] = useState(false);
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
  const [yearRange, setYearRange] = useState<[number, number]>([1950, latestMangaYear]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [language] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let active = true;

    fetchMangaDexData(controller.signal)
      .then(data => {
        if (!active) return;
        setMangas(data.length ? data : localMangas);
        setUsingLocalCatalog(data.length === 0);
      })
      .catch(() => {
        if (active) setUsingLocalCatalog(true);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
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
      
      const matchesChapterRange = getChapterCount(manga) >= chapterRange[0] && getChapterCount(manga) <= chapterRange[1];
      
      const matchesRating = manga.rating >= ratingRange[0] && manga.rating <= ratingRange[1];
      
      const mangaYear = manga.year;
      const matchesYear = !mangaYear || (mangaYear >= yearRange[0] && mangaYear <= yearRange[1]);
      
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
          return getChapterCount(b) - getChapterCount(a);
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
    setYearRange([1950, latestMangaYear]);
    setSearchQuery('');
  };

  const MangaCard = ({ manga }: { manga: CatalogManga }) => (
    <Card className="card-hover overflow-hidden">
      <div className="relative">
        <img 
          src={manga.cover} 
          alt={manga.title}
          className="w-full h-64 object-cover"
          onError={showLocalImageFallback}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {manga.year || '—'}
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
            {getChapterCount(manga)} {language === 'bn' ? 'অধ্যায়' : 'Chapters'}
          </span>
          <MangaReadButton manga={manga} className="btn-manga">
            <Book className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'পড়ুন' : 'Read'}
          </MangaReadButton>
        </div>
      </CardContent>
    </Card>
  );

  const MangaListItem = ({ manga }: { manga: CatalogManga }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <img 
            src={manga.cover} 
            alt={manga.title}
            className="w-24 h-32 object-cover rounded-lg"
            onError={showLocalImageFallback}
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
                <span>{manga.year || '—'}</span>
                <span>{getChapterCount(manga)} {language === 'bn' ? 'অধ্যায়' : 'Chapters'}</span>
                <span>{manga.volumes} {language === 'bn' ? 'খণ্ড' : 'Volumes'}</span>
              </div>
              <MangaReadButton manga={manga} className="btn-manga">
                <Book className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'পড়ুন' : 'Read'}
              </MangaReadButton>
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
          {usingLocalCatalog && (
            <p className="text-sm text-muted-foreground mt-2" role="status">
              {language === 'bn' 
                ? 'লাইভ ক্যাটালগ পাওয়া যাচ্ছে না। সংরক্ষিত সংগ্রহ দেখানো হচ্ছে।'
                : 'The live catalog is unavailable. Showing the local collection.'
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
              {[...mangas]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 8)
                .map((manga) => (
                  <Card key={manga.id} className="group relative overflow-hidden card-hover h-full">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img 
                        src={manga.cover} 
                        alt={manga.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={showLocalImageFallback}
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
                        <MangaReadButton manga={manga} size="sm" className="w-full">
                          <Book className="w-4 h-4 mr-2" />
                          {language === 'bn' ? 'পড়ুন' : 'Read Now'}
                        </MangaReadButton>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {language === 'bn' ? manga.titlebn : manga.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {manga.author} • {manga.year || '—'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {getChapterCount(manga)} {language === 'bn' ? 'অধ্যায়' : 'chapters'}
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
                {language === 'bn'
                  ? 'আপনার অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন।'
                  : 'Try adjusting your search or filters.'}
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
