import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, Star, Heart, Share2, Calendar, Clock, Users, Award,
  Facebook, MessageCircle, Instagram, Bookmark, BookmarkCheck,
  ThumbsUp, ThumbsDown, MoreHorizontal, Eye
} from 'lucide-react';
import { mockAnimes, type Anime } from '@/lib/mockData';

// Add this helper function at the top of AnimeDetail.tsx
const getAnimeById = (id: string): Anime | undefined => {
  return mockAnimes.find(anime => anime.id === id);
};
import { AnimeSearchEngine } from '@/components/anime/SearchEngine';
import { useToast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [relatedAnimes, setRelatedAnimes] = useState<Anime[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [language] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    if (id) {
      const foundAnime = getAnimeById(id);
      setAnime(foundAnime || null);
      
      if (foundAnime) {
        const related = AnimeSearchEngine.getRecommendations(foundAnime, mockAnimes, 6);
        setRelatedAnimes(related);
        
        // Load mock reviews
        setReviews([
          {
            id: '1',
            userId: '1',
            userName: 'আহমেদ রহমান',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
            rating: 9,
            comment: 'অসাধারণ অ্যানিমে! গল্প, চরিত্র, অ্যানিমেশন সবকিছুই পারফেক্ট।',
            date: new Date('2024-01-15'),
            likes: 24,
            dislikes: 2,
            isLiked: false,
            isDisliked: false
          },
          {
            id: '2',
            userId: '2',
            userName: 'সারা খান',
            userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b68e8001?w=100&h=100&fit=crop&crop=face',
            rating: 8,
            comment: 'Really enjoyed this series. The character development is amazing!',
            date: new Date('2024-01-10'),
            likes: 18,
            dislikes: 1,
            isLiked: true,
            isDisliked: false
          }
        ]);
      }
    }
  }, [id]);

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    toast({
      title: isInWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist',
      description: isInWatchlist 
        ? `${anime?.title} has been removed from your watchlist.`
        : `${anime?.title} has been added to your watchlist.`,
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${anime?.title} - ${anime?.description}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so copy to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: 'Link Copied',
          description: 'The link has been copied to your clipboard. You can share it on Instagram.',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleSubmitReview = () => {
    if (!userReview.trim() || userRating === 0) {
      toast({
        title: 'Incomplete Review',
        description: 'Please provide both a rating and a comment.',
        variant: 'destructive',
      });
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      rating: userRating,
      comment: userReview,
      date: new Date(),
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false
    };

    setReviews([newReview, ...reviews]);
    setUserReview('');
    setUserRating(0);
    
    toast({
      title: 'Review Submitted',
      description: 'Thank you for your review!',
    });
  };

  const toggleReviewLike = (reviewId: string) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          likes: review.isLiked ? review.likes - 1 : review.likes + 1,
          dislikes: review.isDisliked ? review.dislikes - 1 : review.dislikes,
          isLiked: !review.isLiked,
          isDisliked: false
        };
      }
      return review;
    }));
  };

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
          <Link to="/anime">
            <Button>Back to Anime List</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={anime.poster} 
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Poster */}
              <div className="hidden lg:block">
                <img 
                  src={anime.poster} 
                  alt={anime.title}
                  className="w-64 h-96 object-cover rounded-xl shadow-2xl border-4 border-white/20"
                />
              </div>
              
              {/* Info */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    {anime.status}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {anime.year}
                  </Badge>
                  <div className="flex items-center bg-black/50 px-3 py-1 rounded-full border border-white/20">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white font-semibold">{anime.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {language === 'bn' ? anime.titlebn : anime.title}
                </h1>
                
                {language === 'bn' && anime.titlebn !== anime.title && (
                  <p className="text-xl text-white/80">{anime.title}</p>
                )}
                
                <p className="text-lg text-white/90 max-w-3xl">
                  {language === 'bn' ? anime.descriptionbn : anime.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="btn-anime">
                    <Play className="w-5 h-5 mr-2" />
                    {language === 'bn' ? 'এখনই দেখুন' : 'Watch Now'}
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleAddToWatchlist}
                    className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    {isInWatchlist ? <BookmarkCheck className="w-5 h-5 mr-2" /> : <Bookmark className="w-5 h-5 mr-2" />}
                    {isInWatchlist 
                      ? (language === 'bn' ? 'তালিকায় আছে' : 'In Watchlist')
                      : (language === 'bn' ? 'তালিকায় যোগ করুন' : 'Add to Watchlist')
                    }
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => handleShare('facebook')}
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70 p-3"
                    >
                      <Facebook className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => handleShare('whatsapp')}
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70 p-3"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => handleShare('instagram')}
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70 p-3"
                    >
                      <Instagram className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="details" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="details">
              {language === 'bn' ? 'বিস্তারিত' : 'Details'}
            </TabsTrigger>
            <TabsTrigger value="episodes">
              {language === 'bn' ? 'পর্বসমূহ' : 'Episodes'}
            </TabsTrigger>
            <TabsTrigger value="cast">
              {language === 'bn' ? 'কাস্ট' : 'Cast'}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {language === 'bn' ? 'রিভিউ' : 'Reviews'}
            </TabsTrigger>
            <TabsTrigger value="related" className="hidden lg:block">
              {language === 'bn' ? 'সম্পর্কিত' : 'Related'}
            </TabsTrigger>
            <TabsTrigger value="trailer" className="hidden lg:block">
              {language === 'bn' ? 'ট্রেইলার' : 'Trailer'}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'সম্পূর্ণ বিবরণ' : 'Full Description'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'bn' ? anime.descriptionbn : anime.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map(genre => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                  
                  {anime.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">{language === 'bn' ? 'ট্যাগ' : 'Tags'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {anime.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'তথ্য' : 'Information'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'bn' ? 'মুক্তির বছর' : 'Release Year'}</p>
                      <p className="text-muted-foreground">{anime.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'bn' ? 'স্টুডিও' : 'Studio'}</p>
                      <p className="text-muted-foreground">{anime.studio}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'bn' ? 'পর্ব সংখ্যা' : 'Episodes'}</p>
                      <p className="text-muted-foreground">{anime.episodes.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{language === 'bn' ? 'রেটিং' : 'Rating'}</p>
                      <p className="text-muted-foreground">{anime.rating}/10</p>
                    </div>
                  </div>
                  
                  {anime.awards.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">{language === 'bn' ? 'পুরস্কার' : 'Awards'}</p>
                        <div className="space-y-1">
                          {anime.awards.map((award, index) => (
                            <p key={index} className="text-muted-foreground text-sm">{award}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Episodes Tab */}
          <TabsContent value="episodes">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'পর্বসমূহ' : 'Episodes'}</CardTitle>
              </CardHeader>
              <CardContent>
                {anime.episodes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {anime.episodes.map((episode, index) => (
                      <Card key={episode.id} className="card-hover cursor-pointer">
                        <div className="relative">
                          <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <Badge className="absolute top-2 left-2">
                            {language === 'bn' ? 'পর্ব' : 'Episode'} {episode.number}
                          </Badge>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {episode.duration}m
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold line-clamp-1">
                            {language === 'bn' ? episode.titlebn : episode.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {language === 'bn' ? episode.descriptionbn : episode.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'bn' ? 'কোন পর্ব পাওয়া যায়নি' : 'No episodes available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cast Tab */}
          <TabsContent value="cast">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'কণ্ঠ অভিনেতা' : 'Voice Cast'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anime.cast.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`https://images.unsplash.com/photo-${1535713875002 + index}-d1d0cf377fde?w=100&h=100&fit=crop&crop=face`} />
                          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-sm text-muted-foreground">Voice Actor</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'স্টাফ' : 'Staff'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anime.staff.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`https://images.unsplash.com/photo-${1494790108755 + index}-2616b68e8001?w=100&h=100&fit=crop&crop=face`} />
                          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member}</p>
                          <p className="text-sm text-muted-foreground">
                            {index === 0 ? 'Director' : 'Producer'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Write Review */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'আপনার রিভিউ লিখুন' : 'Write Your Review'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'রেটিং' : 'Rating'}
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setUserRating(rating)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            rating <= userRating 
                              ? 'bg-yellow-400 border-yellow-400 text-white' 
                              : 'border-muted-foreground text-muted-foreground hover:border-yellow-400'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'bn' ? 'মন্তব্য' : 'Comment'}
                    </label>
                    <Textarea
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      placeholder={language === 'bn' ? 'এই অ্যানিমে সম্পর্কে আপনার মতামত...' : 'Share your thoughts about this anime...'}
                      rows={4}
                    />
                  </div>
                  
                  <Button onClick={handleSubmitReview} className="btn-anime">
                    {language === 'bn' ? 'রিভিউ পোস্ট করুন' : 'Post Review'}
                  </Button>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{review.userName}</p>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.date.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <p className="text-muted-foreground">{review.comment}</p>
                          
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleReviewLike(review.id)}
                              className={review.isLiked ? 'text-green-600' : ''}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {review.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              {review.dislikes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Related Tab */}
          <TabsContent value="related">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'সম্পর্কিত অ্যানিমে' : 'Related Anime'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedAnimes.map((relatedAnime) => (
                    <Link key={relatedAnime.id} to={`/anime/${relatedAnime.id}`}>
                      <Card className="card-hover">
                        <div className="relative">
                          <img 
                            src={relatedAnime.poster} 
                            alt={relatedAnime.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            ★ {relatedAnime.rating}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-1">
                            {language === 'bn' ? relatedAnime.titlebn : relatedAnime.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {language === 'bn' ? relatedAnime.descriptionbn : relatedAnime.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {relatedAnime.genres.slice(0, 2).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trailer Tab */}
          <TabsContent value="trailer">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'ট্রেইলার ও প্রিভিউ' : 'Trailer & Previews'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'ট্রেইলার শীঘ্রই আসছে' : 'Trailer coming soon'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}