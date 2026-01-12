import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, ExternalLink } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  titlebn: string;
  embedUrl: string;
  description?: string;
  descriptionbn?: string;
}

export default function VideoSection() {
  const [language] = useState<'en' | 'bn'>('en');
  
  // You can modify this array to add more videos
  const videos: VideoItem[] = [
    {
      id: '1',
      title: 'Featured Anime Video',
      titlebn: 'ফিচার্ড অ্যানিমে ভিডিও',
      embedUrl: 'https://www.youtube.com/embed/hn7gY7NXTFA?si=lPXZ4TFOmgu-PIhS',
      description: 'Watch the latest anime content and reviews',
      descriptionbn: 'সর্বশেষ অ্যানিমে বিষয়বস্তু এবং পর্যালোচনা দেখুন'
    }
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
          <PlayCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gradient">
            {language === 'bn' ? 'ফিচার্ড ভিডিওস' : 'Featured Videos'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'bn' 
              ? 'আমাদের সেরা অ্যানিমে ভিডিও সংগ্রহ দেখুন'
              : 'Watch our curated collection of anime videos'
            }
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="card-hover overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative">
                {/* Video Embed */}
                <div className="relative w-full h-64 bg-gray-900 rounded-t-lg overflow-hidden">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={video.embedUrl}
                    title={language === 'bn' ? video.titlebn : video.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="rounded-t-lg"
                  />
                  
                  {/* Overlay for hover effects */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">
                    {language === 'bn' ? video.titlebn : video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {language === 'bn' ? video.descriptionbn : video.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20"
                      onClick={() => window.open(video.embedUrl.replace('embed/', 'watch?v=').split('?')[0], '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {language === 'bn' ? 'YouTube এ দেখুন' : 'Watch on YouTube'}
                    </Button>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Video
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add more videos button - for future expansion */}
      <div className="text-center mt-8">
        <Button 
          variant="outline" 
          size="lg"
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20"
        >
          {language === 'bn' ? 'আরো ভিডিও দেখুন' : 'View More Videos'}
        </Button>
      </div>
    </section>
  );
}