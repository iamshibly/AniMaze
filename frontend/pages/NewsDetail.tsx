import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  User, 
  Share2, 
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: 'anime' | 'manga' | 'games';
  publishDate: string;
  source: string;
  views?: number;
  trending?: boolean;
  tags: string[];
  author: string;
  externalUrl?: string;
  hasExternalLink?: boolean;
}

interface TopStory {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  publishDate: string;
  source: string;
  category: string;
  views: number;
  featured: boolean;
  tags: string[];
  author: string;
  externalUrl?: string;
  hasExternalLink?: boolean;
}

// All news data with real external links - matches the News.tsx data
const allNewsData: (NewsItem | TopStory)[] = [
  // Anime News
  {
    id: '1',
    title: 'Attack on Titan Final Season Receives Critical Acclaim Worldwide',
    description: 'The epic conclusion of Hajime Isayama\'s masterpiece has been praised worldwide for its stunning animation and emotional storytelling that brings the decade-long journey to a satisfying close.',
    content: `The highly anticipated final season of Attack on Titan has concluded, marking the end of one of anime's most influential series. Studio WIT and MAPPA's collaboration has resulted in breathtaking animation that perfectly captures the intensity and emotional depth of Hajime Isayama's original manga.

Critics and fans alike have praised the series finale for its mature handling of complex themes including war, freedom, and the cycle of hatred. The animation quality has been consistently outstanding, with particular praise for the ODM gear sequences and titan transformations.

Voice actors Yuki Kaji (Eren), Marina Inoue (Armin), and Yui Ishikawa (Mikasa) delivered career-defining performances in the final episodes, bringing emotional depth to their characters' concluding arcs.

The series has left an indelible mark on the anime industry, influencing countless other productions and proving that anime can tackle serious, philosophical themes while maintaining mass appeal.

Box office numbers for the compilation films have already exceeded expectations, with international screenings selling out within hours of tickets going on sale.

The finale has been trending on social media platforms worldwide, with fans expressing their emotional reactions to the conclusion of Eren's journey. Many are calling it one of the greatest anime endings of all time.

Studio MAPPA has announced plans for a special exhibition celebrating the series, featuring original artwork, behind-the-scenes content, and exclusive merchandise for fans to commemorate this monumental achievement in anime history.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    category: 'anime' as const,
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    source: 'Anime News Network',
    views: 28420,
    trending: true,
    tags: ['Attack on Titan', 'Final Season', 'MAPPA', 'Studio WIT'],
    author: 'Sarah Johnson',
    externalUrl: 'https://www.animenewsnetwork.com',
    hasExternalLink: true
  },
  {
    id: '2',
    title: 'Studio MAPPA Announces Ambitious New Original Anime Series "Ethereal Bonds"',
    description: 'The renowned animation studio behind Jujutsu Kaisen and Chainsaw Man reveals their latest ambitious project, an original sci-fi series set to premiere in 2025.',
    content: `Studio MAPPA has officially announced "Ethereal Bonds," an original anime series that promises to push the boundaries of both storytelling and animation. Set in a near-future world where human consciousness can be transferred between bodies, the series explores themes of identity, mortality, and what it truly means to be human.

The project is being directed by Sunghoo Park, known for his exceptional work on Jujutsu Kaisen, with character designs by acclaimed artist Tadashi Hiramatsu. The series will feature a 24-episode run and is scheduled to premiere in Spring 2025.

According to producer Makoto Kimura, "Ethereal Bonds represents our studio's commitment to creating original content that challenges viewers intellectually while delivering the high-octane action sequences MAPPA is known for."

The voice cast includes several industry veterans, with Mamoru Miyano and Kana Hanazawa leading the ensemble. Music will be composed by Hiroyuki Sawano, promising an epic soundtrack to accompany the series' ambitious narrative.

Pre-production began over two years ago, with the studio investing heavily in new animation technologies to bring the futuristic world to life. Early concept art suggests a blend of traditional 2D animation with cutting-edge CGI elements.

The series will explore philosophical questions about consciousness and identity while maintaining the studio's signature dynamic action sequences. Early screenings for industry professionals have received overwhelmingly positive responses.`,
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=400&fit=crop',
    category: 'anime' as const,
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    source: 'Anime News Network',
    views: 15890,
    trending: false,
    tags: ['MAPPA', 'Original Series', 'Sci-Fi', 'Sunghoo Park'],
    author: 'Michael Chen',
    externalUrl: 'https://www.animenewsnetwork.com',
    hasExternalLink: true
  },
  {
    id: '3',
    title: 'Demon Slayer Movie Breaks Box Office Records in International Markets',
    description: 'The latest Demon Slayer film has shattered previous records, becoming the highest-grossing anime film internationally with over $400 million worldwide.',
    content: `"Demon Slayer: Kimetsu no Yaiba – To the Hashira Training" has achieved unprecedented success in international box offices, surpassing all previous anime films in global earnings. The film has grossed over $400 million worldwide, with particularly strong performances in North America, Europe, and Southeast Asia.

The success can be attributed to several factors: the film's stunning animation by Studio Ufotable, the compelling story continuation from the Entertainment District Arc, and the global fanbase built up over the previous seasons and films.

Theater chains reported that many screenings sold out weeks in advance, with fans traveling hundreds of miles to attend premieres. The film's IMAX and 4DX presentations have been particularly popular, offering immersive experiences that showcase Ufotable's exceptional animation work.

Critical reception has been overwhelmingly positive, with reviewers praising the emotional depth of the story and the breathtaking fight sequences. The film maintains the series' signature blend of humor, heart, and spectacular action.

Distributor Funimation reports that this success is paving the way for more anime films to receive wide theatrical releases in Western markets, potentially changing how anime content is distributed globally.

The film's soundtrack, featuring contributions from LiSA and Go Shiina, has also topped music charts in multiple countries, further demonstrating anime's growing cultural influence.`,
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=400&fit=crop',
    category: 'anime' as const,
    publishDate: new Date(Date.now() - 259200000).toISOString(),
    source: 'Box Office Report',
    views: 34520,
    trending: true,
    tags: ['Demon Slayer', 'Box Office', 'Ufotable', 'International'],
    author: 'Emma Rodriguez',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  },
  // Add all other news items with real external URLs...
  {
    id: '9',
    title: 'One Piece Manga Breaks Sales Records Again, Surpasses 500 Million Copies',
    description: 'Eiichiro Oda\'s legendary manga continues to dominate global sales charts with over 500 million copies sold worldwide, setting new records for manga distribution.',
    content: `Eiichiro Oda's One Piece has achieved another milestone, becoming the first manga series to surpass 500 million copies sold worldwide. This achievement cements its position as not only the best-selling manga of all time but one of the best-selling comic series in any medium.

The announcement came during Jump Festa 2024, where Shueisha revealed that the series has maintained consistent sales growth despite being in publication for over 25 years. Recent volumes have continued to break individual sales records, with Volume 105 selling over 2 million copies in its first week.

The series' success can be attributed to its expansive world-building, complex character development, and Oda's masterful storytelling that has kept readers engaged through multiple story arcs. The ongoing Final Saga has particularly resonated with fans, as long-running mysteries begin to unfold.

International sales have been a major contributor to this milestone, with the series available in over 60 languages. Digital sales have also seen unprecedented growth, particularly in markets where physical manga distribution was previously limited.

Oda commented on the achievement, saying, "This milestone belongs to all the fans who have supported Luffy's journey. The adventure is far from over, and I promise to deliver a conclusion worthy of everyone's patience and love."

The success has also boosted sales of related merchandise, with One Piece remaining one of the most valuable media franchises globally. The recent live-action Netflix adaptation has introduced the series to new audiences, further driving manga sales.

Publishers worldwide have reported that One Piece continues to attract new readers, with many bookstores creating dedicated sections for the series due to sustained demand.`,
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=400&fit=crop',
    category: 'manga' as const,
    publishDate: new Date(Date.now() - 345600000).toISOString(),
    source: 'Manga Plus',
    views: 41200,
    trending: true,
    tags: ['One Piece', 'Sales Record', 'Eiichiro Oda', 'Shueisha'],
    author: 'Lisa Wang',
    externalUrl: 'https://mangaplus.shueisha.co.jp/updates',
    hasExternalLink: true
  },
  // Top Stories with real URLs
  {
    id: 'top1',
    title: 'Anime Industry Revenue Hits Record $31 Billion as Global Demand Soars',
    description: 'The anime industry achieved unprecedented growth in 2024, driven by streaming platforms, international licensing, and merchandise sales across all demographics.',
    content: `The global anime industry has reached a historic milestone, generating over $31 billion in revenue for 2024, representing a 23% increase from the previous year. This growth is attributed to the explosive expansion of streaming services, increased international licensing deals, and the diversification of anime content appealing to broader demographics.

Streaming platforms have been the primary driver of this growth, with services like Crunchyroll, Netflix, and Disney+ investing heavily in anime content. Original anime productions by these platforms have also contributed significantly to the industry's expansion.

The merchandise segment has seen particular strength, with anime-related products ranging from figures to fashion collaborating with luxury brands. The global reach of anime has enabled licensing deals in markets previously untapped by Japanese content creators.

According to the Japan Animation Association, international sales now represent 67% of total anime industry revenue, marking a significant shift from the domestic-focused model of previous decades. This internationalization has led to increased investment in dubbing and localization services.

The industry's growth has also created new opportunities for creators, with more studios expanding internationally and establishing partnerships with global content producers. This trend is expected to continue as anime becomes increasingly mainstream in Western entertainment markets.

Mobile gaming tie-ins and virtual reality experiences represent emerging revenue streams that could drive further growth in the coming years. The success of anime-inspired games like Genshin Impact has shown the potential for cross-media expansion.

Industry analysts predict that the $50 billion milestone could be reached by 2027 if current growth trends continue, making anime one of Japan's most valuable cultural exports.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    publishDate: new Date(Date.now() - 86400000).toISOString(),
    source: 'Japan Animation Association',
    category: 'industry',
    views: 52640,
    featured: true,
    tags: ['Industry Growth', 'Revenue', 'Streaming', 'Global Market'],
    author: 'Jennifer Kim',
    externalUrl: 'https://aja.gr.jp/english',
    hasExternalLink: true
  },
  {
    id: 'top2',
    title: 'Crunchyroll Announces Massive Expansion to 15 New Countries and Regions',
    description: 'The streaming giant plans to bring anime content to 15 new countries, making anime more accessible globally while investing in local language dubbing.',
    content: `Crunchyroll has announced its most ambitious expansion yet, planning to launch services in 15 new countries and regions throughout 2025. This expansion will bring the total number of territories served by Crunchyroll to over 200, making it the most globally accessible anime streaming platform.

The new territories include several African and South American countries where anime has been growing in popularity but has had limited official distribution channels. Crunchyroll plans to offer both subtitled and dubbed content in local languages, with initial support for Portuguese, Spanish, French, and Arabic.

"This expansion represents our commitment to making anime accessible to fans everywhere," said Rahul Purini, President of Crunchyroll. "We've seen incredible demand from these regions, and we're excited to finally serve these passionate communities officially."

The expansion will include partnerships with local telecom providers to ensure optimal streaming quality and competitive pricing structures adapted to each market's economic conditions. Crunchyroll is also planning to establish local offices in key regions to better serve these communities.

Content strategy will be tailored to regional preferences, with Crunchyroll conducting extensive market research to understand viewing patterns and popular genres in each territory. The platform will also explore opportunities for co-productions with local creators.

The announcement has been welcomed by international anime communities, many of whom have been requesting official access for years. The expansion is expected to add over 50 million potential subscribers to Crunchyroll's global user base.

Investment in local content creation is also planned, with Crunchyroll announcing partnerships with studios in several new markets to produce region-specific anime content that reflects local cultures and stories.`,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
    publishDate: new Date(Date.now() - 172800000).toISOString(),
    source: 'Crunchyroll',
    category: 'streaming',
    views: 38230,
    featured: true,
    tags: ['Crunchyroll', 'Expansion', 'Global Access', 'Streaming'],
    author: 'Alex Thompson',
    externalUrl: 'https://www.crunchyroll.com/news',
    hasExternalLink: true
  }
];

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsItem, setNewsItem] = useState<NewsItem | TopStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const item = allNewsData.find(news => news.id === id);
      if (item) {
        setNewsItem(item);
        setLikes(Math.floor(Math.random() * 500) + 50); // Random likes for demo
        
        // Check if bookmarked (demo - would normally check user data)
        const bookmarked = localStorage.getItem(`bookmarked_${id}`);
        setIsBookmarked(!!bookmarked);
        
        // Check if liked (demo)
        const liked = localStorage.getItem(`liked_${id}`);
        setIsLiked(!!liked);
      }
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'anime': return 'Anime';
      case 'manga': return 'Manga';
      case 'games': return 'Games';
      case 'industry': return 'Industry';
      case 'streaming': return 'Streaming';
      case 'events': return 'Events';
      default: return category;
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      localStorage.removeItem(`bookmarked_${id}`);
      setIsBookmarked(false);
      toast({
        title: "Removed from bookmarks",
        description: "This article has been removed from your bookmarks.",
      });
    } else {
      localStorage.setItem(`bookmarked_${id}`, 'true');
      setIsBookmarked(true);
      toast({
        title: "Added to bookmarks",
        description: "This article has been saved to your bookmarks.",
      });
    }
  };

  const handleLike = () => {
    if (isLiked) {
      localStorage.removeItem(`liked_${id}`);
      setIsLiked(false);
      setLikes(prev => prev - 1);
    } else {
      localStorage.setItem(`liked_${id}`, 'true');
      setIsLiked(true);
      setLikes(prev => prev + 1);
    }
  };

  const handleShare = async () => {
    if (navigator.share && newsItem) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Article link has been copied to clipboard.",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link has been copied to clipboard.",
      });
    }
  };

  const handleExternalLink = () => {
    if (newsItem?.externalUrl) {
      window.open(newsItem.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/news')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Button>

      {/* Article Header */}
      <Card className="mb-8">
        <div className="relative">
          <img 
            src={newsItem.image} 
            alt={newsItem.title}
            className="w-full h-64 md:h-96 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-500 text-white">
              {getCategoryLabel('category' in newsItem ? newsItem.category : newsItem.category)}
            </Badge>
          </div>
          {'trending' in newsItem && newsItem.trending && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white">
                Trending
              </Badge>
            </div>
          )}
          {'featured' in newsItem && newsItem.featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gold text-black font-bold">
                ⭐ Featured
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {newsItem.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {newsItem.description}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {newsItem.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(newsItem.publishDate)}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {newsItem.views?.toLocaleString()} views
              </span>
              <span className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                {newsItem.source}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {newsItem.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="mb-6" />

          {/* Article Actions */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <Button 
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {likes}
            </Button>
            
            <Button 
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>

            {/* External Link Button */}
            {newsItem.hasExternalLink && newsItem.externalUrl && (
              <Button 
                variant="default"
                size="sm"
                onClick={handleExternalLink}
                className="bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Source
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="prose prose-lg max-w-none">
            {newsItem.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* External Source Call-to-Action */}
          {newsItem.hasExternalLink && newsItem.externalUrl && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Read More at Source</h4>
                  <p className="text-sm text-blue-700">
                    Visit {newsItem.source} for additional coverage and updates on this story.
                  </p>
                </div>
                <Button 
                  onClick={handleExternalLink}
                  className="bg-blue-600 hover:bg-blue-700 ml-4"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit {newsItem.source}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Articles Section */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allNewsData
              .filter(item => 
                item.id !== newsItem.id && 
                item.tags.some(tag => newsItem.tags.includes(tag))
              )
              .slice(0, 4)
              .map((relatedItem) => (
                <div 
                  key={relatedItem.id}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/news/${relatedItem.id}`)}
                >
                  <img 
                    src={relatedItem.image} 
                    alt={relatedItem.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {relatedItem.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDate(relatedItem.publishDate)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {relatedItem.source}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {allNewsData.filter(item => 
            item.id !== newsItem.id && 
            item.tags.some(tag => newsItem.tags.includes(tag))
          ).length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No related articles found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}