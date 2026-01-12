import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Book, 
  Star, 
  Calendar, 
  User, 
  Building2, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  Heart,
  MessageSquare,
  ThumbsUp,
  ChevronLeft,
  Play,
  Download,
  Eye,
  FileText,
  Users
} from 'lucide-react';
import { getMangaById, mockMangas, type Manga } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [manga, setManga] = useState<Manga | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [language] = useState<'en' | 'bn'>('en');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (id) {
      const foundManga = getMangaById(id);
      setManga(foundManga || null);
      setIsLoading(false);
      
      // Check if bookmarked (simulate with localStorage)
      const bookmarks = JSON.parse(localStorage.getItem('mangaBookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(id));
    }
  }, [id]);

  const handleBookmark = () => {
    if (!id) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('mangaBookmarks') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((bookmarkId: string) => bookmarkId !== id);
      localStorage.setItem('mangaBookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast({
        title: language === 'bn' ? 'বুকমার্ক সরানো হয়েছে' : 'Removed from bookmarks',
        description: language === 'bn' ? 'মাঙ্গাটি আপনার বুকমার্ক থেকে সরিয়ে দেওয়া হয়েছে' : 'Manga removed from your reading list'
      });
    } else {
      const updatedBookmarks = [...bookmarks, id];
      localStorage.setItem('mangaBookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      toast({
        title: language === 'bn' ? 'বুকমার্ক যোগ করা হয়েছে' : 'Added to bookmarks',
        description: language === 'bn' ? 'মাঙ্গাটি আপনার পড়ার তালিকায় যোগ করা হয়েছে' : 'Manga added to your reading list'
      });
    }
  };

  const handleShare = async () => {
    if (!manga) return;
    
    const shareData = {
      title: manga.title,
      text: manga.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: language === 'bn' ? 'লিঙ্ক কপি হয়েছে' : 'Link copied',
        description: language === 'bn' ? 'মাঙ্গার লিঙ্ক ক্লিপবোর্ডে কপি হয়েছে' : 'Manga link copied to clipboard'
      });
    }
  };

  const getRelatedMangas = () => {
    if (!manga) return [];
    
    return mockMangas
      .filter(m => m.id !== manga.id)
      .filter(m => m.genres.some(genre => manga.genres.includes(genre)) || m.author === manga.author)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  const mockReviews = [
    {
      id: '1',
      userId: '1',
      userName: 'আহমেদ রহমান',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'অসাধারণ একটি মাঙ্গা! গল্প, চরিত্র, শিল্পকর্ম সবকিছুই দুর্দান্ত।',
      date: new Date('2024-01-15'),
      likes: 24,
      helpful: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'সারা খান',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b68e8001?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      comment: 'Very engaging story with great character development. The art style is beautiful.',
      date: new Date('2024-01-10'),
      likes: 18,
      helpful: true
    },
    {
      id: '3',
      userId: '3',
      userName: 'করিম উল্লাহ',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'একবার পড়া শুরু করলে আর থামা যায় না। প্রতিটি অধ্যায় আরও উত্তেজনাপূর্ণ।',
      date: new Date('2024-01-08'),
      likes: 31,
      helpful: true
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 850, percentage: 68 },
    { stars: 4, count: 280, percentage: 22 },
    { stars: 3, count: 80, percentage: 6 },
    { stars: 2, count: 30, percentage: 3 },
    { stars: 1, count: 10, percentage: 1 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'bn' ? 'মাঙ্গা লোড হচ্ছে...' : 'Loading manga...'}
          </p>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            {language === 'bn' ? 'মাঙ্গা পাওয়া যায়নি' : 'Manga not found'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === 'bn' 
              ? 'আপনি যে মাঙ্গাটি খুঁজছেন তা পাওয়া যায়নি।'
              : 'The manga you are looking for could not be found.'
            }
          </p>
          <Link to="/manga">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'মাঙ্গা তালিকায় ফিরুন' : 'Back to Manga List'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedMangas = getRelatedMangas();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link to="/manga" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'মাঙ্গা তালিকায় ফিরুন' : 'Back to Manga List'}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              <div className="relative">
                <img 
                  src={manga.cover} 
                  alt={manga.title}
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                    {manga.rating}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Manga Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  {language === 'bn' ? manga.titlebn : manga.title}
                </h1>
                {language === 'en' && manga.titlebn && (
                  <p className="text-xl text-muted-foreground mb-2">{manga.titlebn}</p>
                )}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {language === 'bn' ? manga.descriptionbn : manga.description}
                </p>
              </div>

              {/* Manga Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{manga.rating}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'রেটিং' : 'Rating'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{manga.chapters.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'অধ্যায়' : 'Chapters'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{manga.volumes}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'খণ্ড' : 'Volumes'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Badge 
                    variant={manga.status === 'completed' ? 'secondary' : 
                           manga.status === 'ongoing' ? 'default' : 'destructive'}
                    className="text-lg py-2"
                  >
                    {manga.status}
                  </Badge>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h3 className="font-semibold mb-3">
                  {language === 'bn' ? 'জেনার' : 'Genres'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="flex-1 md:flex-none">
                  <Book className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'পড়া শুরু করুন' : 'Start Reading'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBookmark}
                  className="flex-1 md:flex-none"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 mr-2" />
                  ) : (
                    <Bookmark className="w-5 h-5 mr-2" />
                  )}
                  {language === 'bn' 
                    ? (isBookmarked ? 'বুকমার্ক করা' : 'বুকমার্ক') 
                    : (isBookmarked ? 'Bookmarked' : 'Bookmark')
                  }
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="w-5 h-5 mr-2" />
                  {language === 'bn' ? 'শেয়ার' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">
              {language === 'bn' ? 'ওভারভিউ' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="chapters">
              {language === 'bn' ? 'অধ্যায়' : 'Chapters'}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {language === 'bn' ? 'রিভিউ' : 'Reviews'}
            </TabsTrigger>
            <TabsTrigger value="related">
              {language === 'bn' ? 'সম্পর্কিত' : 'Related'}
            </TabsTrigger>
            <TabsTrigger value="info">
              {language === 'bn' ? 'তথ্য' : 'Info'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Detailed Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'bn' ? 'গল্পের সারসংক্ষেপ' : 'Story Synopsis'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'bn' ? manga.descriptionbn : manga.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'bn' ? 'ট্যাগ' : 'Tags'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {manga.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Publication Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'bn' ? 'প্রকাশনার তথ্য' : 'Publication Info'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{language === 'bn' ? 'লেখক' : 'Author'}</div>
                        <div className="text-sm text-muted-foreground">{manga.author}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{language === 'bn' ? 'প্রকাশক' : 'Publisher'}</div>
                        <div className="text-sm text-muted-foreground">{manga.publisher}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{language === 'bn' ? 'প্রকাশের তারিখ' : 'Publication Date'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(manga.publicationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rating Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'bn' ? 'রেটিং বিবরণ' : 'Rating Breakdown'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ratingDistribution.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm">{rating.stars}</span>
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                        </div>
                        <Progress value={rating.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {rating.count}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {language === 'bn' ? 'অধ্যায় তালিকা' : 'Chapter List'}
                  <Badge variant="secondary" className="ml-auto">
                    {manga.chapters.length} {language === 'bn' ? 'অধ্যায়' : 'chapters'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {manga.chapters.slice(0, 20).map((chapter) => (
                    <div key={chapter.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {chapter.number}
                        </div>
                        <div>
                          <div className="font-medium">
                            {language === 'bn' ? chapter.titlebn : chapter.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(chapter.publishDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        {language === 'bn' ? 'পড়ুন' : 'Read'}
                      </Button>
                    </div>
                  ))}
                  {manga.chapters.length > 20 && (
                    <div className="text-center p-4">
                      <Button variant="outline">
                        {language === 'bn' ? 'আরও দেখুন' : 'Load More'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-current text-yellow-500'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {review.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {language === 'bn' ? 'জবাব' : 'Reply'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'bn' ? 'রিভিউ লিখুন' : 'Write a Review'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'রিভিউ যোগ করুন' : 'Add Review'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMangas.map((relatedManga) => (
                <Card key={relatedManga.id} className="card-hover">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={relatedManga.cover} 
                      alt={relatedManga.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/70 text-white">
                        <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                        {relatedManga.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 mb-2">
                      {language === 'bn' ? relatedManga.titlebn : relatedManga.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {language === 'bn' ? relatedManga.descriptionbn : relatedManga.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {relatedManga.chapters.length} {language === 'bn' ? 'অধ্যায়' : 'chapters'}
                      </span>
                      <Link to={`/manga/${relatedManga.id}`}>
                        <Button size="sm">
                          <Book className="w-4 h-4 mr-2" />
                          {language === 'bn' ? 'পড়ুন' : 'Read'}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'bn' ? 'মাঙ্গার তথ্য' : 'Manga Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'শিরোনাম' : 'Title'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.title}</span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'বাংলা শিরোনাম' : 'Bangla Title'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.titlebn}</span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'লেখক' : 'Author'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.author}</span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'প্রকাশক' : 'Publisher'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.publisher}</span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'প্রকাশের তারিখ' : 'Publication Date'}:</span>
                    <span className="ml-2 text-muted-foreground">
                      {new Date(manga.publicationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}:</span>
                    <Badge className="ml-2" variant={manga.status === 'completed' ? 'secondary' : 'default'}>
                      {manga.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'খণ্ড' : 'Volumes'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.volumes}</span>
                  </div>
                  <div>
                    <span className="font-medium">{language === 'bn' ? 'অধ্যায়' : 'Chapters'}:</span>
                    <span className="ml-2 text-muted-foreground">{manga.chapters.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'bn' ? 'পরিসংখ্যান' : 'Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language === 'bn' ? 'রেটিং' : 'Rating'}:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{manga.rating}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language === 'bn' ? 'জনপ্রিয়তা' : 'Popularity'}:</span>
                    <span>#{Math.floor(Math.random() * 100) + 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language === 'bn' ? 'পাঠক' : 'Readers'}:</span>
                    <span>{Math.floor(Math.random() * 900000) + 100000}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language === 'bn' ? 'বুকমার্ক' : 'Bookmarks'}:</span>
                    <span>{Math.floor(Math.random() * 50000) + 10000}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}