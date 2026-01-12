import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Book, Star, Search, Download, FileText } from 'lucide-react';
import Layout from '@/components/Layout'; // Adjust path if needed

// PDF Manga data
const pdfMangas = [
  {
    id: 'pdf-aot-001',
    title: 'Attack on Titan Chapter 001',
    titlebn: 'অ্যাটাক অন টাইটান অধ্যায় ০০১',
    description: 'The beginning of humanity\'s fight against the titans. Witness Eren\'s tragic loss and his vow for revenge.',
    descriptionbn: 'টাইটানদের বিরুদ্ধে মানবতার লড়াইয়ের শুরু। এরেনের মর্মান্তিক ক্ষতি এবং প্রতিশোধের শপথ দেখুন।',
    cover: '/pdf cover/attack on titan 2013.jpeg',
    author: 'Hajime Isayama',
    genre: 'Action, Drama, Horror',
    rating: 9.2,
    pdfPath: '/Attack-on-Titan-CH-001.pdf',
    year: 2009,
    pages: 45,
    size: '12.5 MB'
  },
  {
    id: 'pdf-dragon-ball-1',
    title: 'Dragon Ball Volume 1',
    titlebn: 'ড্রাগন বল ভলিউম ১',
    description: 'Follow young Goku\'s adventures as he begins his quest to find the magical Dragon Balls.',
    descriptionbn: 'তরুণ গোকুর অ্যাডভেঞ্চার অনুসরণ করুন যখন তিনি জাদুকরী ড্রাগন বলগুলি খুঁজে বের করার জন্য তার অনুসন্ধান শুরু করেন।',
    cover: '/pdf cover/d ball.jpg',
    author: 'Akira Toriyama',
    genre: 'Adventure, Comedy, Martial Arts',
    rating: 8.9,
    pdfPath: '/Dragon-Ball-1.pdf',
    year: 1984,
    pages: 192,
    size: '28.3 MB'
  },
  {
    id: 'pdf-mork-sjal',
    title: 'Mork Sjal Manual',
    titlebn: 'মর্ক শাল ম্যানুয়াল',
    description: 'A unique manga featuring mysterious characters and an intricate storyline.',
    descriptionbn: 'রহস্যময় চরিত্র এবং একটি জটিল গল্পের লাইন সহ একটি অনন্য মাঙ্গা।',
    cover: '/pdf cover/gma.jpeg',
    author: 'Unknown Author',
    genre: 'Mystery, Adventure',
    rating: 7.8,
    pdfPath: '/mork-sjal-manual.pdf',
    year: 2020,
    pages: 156,
    size: '19.7 MB'
  },
  {
    id: 'pdf-shinigamis-hollows',
    title: 'Shinigamis Hollows',
    titlebn: 'শিনিগামিস হোলোজ',
    description: 'Enter the world of soul reapers and spiritual battles in this action-packed manga.',
    descriptionbn: 'এই অ্যাকশন-প্যাকড মাঙ্গায় আত্মা রিপার এবং আধ্যাত্মিক যুদ্ধের জগতে প্রবেশ করুন।',
    cover: '/pdf cover/b.jpeg',
    author: 'Independent Creator',
    genre: 'Action, Supernatural, Shounen',
    rating: 8.4,
    pdfPath: '/Shinigamis-Hollows.pdf',
    year: 2021,
    pages: 234,
    size: '31.2 MB'
  }
];

export default function PDFMangaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language] = useState<'en' | 'bn'>('en');

  const handlePDFClick = (pdfPath: string, title: string) => {
    window.open(pdfPath, '_blank');
  };

  const handleDownload = (pdfPath: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = pdfPath.split('/').pop() || title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMangas = pdfMangas.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manga.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manga.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-gradient">
              {language === 'bn' ? 'পিডিএফ মাঙ্গা সংগ্রহ' : 'PDF Manga Collection'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমাদের স্থানীয় মাঙ্গা সংগ্রহ ব্রাউজ করুন। সরাসরি অনলাইনে পড়ুন বা ডাউনলোড করুন।'
              : 'Browse our local manga collection. Read directly online or download for offline reading.'
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={language === 'bn' ? 'মাঙ্গা খুঁজুন...' : 'Search manga...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 rounded-xl shadow-lg focus:shadow-xl transition-shadow"
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center p-6">
            <h3 className="text-2xl font-bold text-primary">{pdfMangas.length}</h3>
            <p className="text-muted-foreground">{language === 'bn' ? 'মোট মাঙ্গা' : 'Total Manga'}</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-2xl font-bold text-primary">
              {pdfMangas.reduce((acc, manga) => acc + manga.pages, 0)}
            </h3>
            <p className="text-muted-foreground">{language === 'bn' ? 'মোট পৃষ্ঠা' : 'Total Pages'}</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-2xl font-bold text-primary">
              {(pdfMangas.reduce((acc, manga) => acc + parseFloat(manga.size.split(' ')[0]), 0)).toFixed(1)} MB
            </h3>
            <p className="text-muted-foreground">{language === 'bn' ? 'মোট সাইজ' : 'Total Size'}</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-2xl font-bold text-primary">
              {(pdfMangas.reduce((acc, manga) => acc + manga.rating, 0) / pdfMangas.length).toFixed(1)}
            </h3>
            <p className="text-muted-foreground">{language === 'bn' ? 'গড় রেটিং' : 'Avg Rating'}</p>
          </Card>
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMangas.map((manga) => (
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

                {/* PDF badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-red-500/90 text-white border-none">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
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
                  <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                    <span>{manga.pages} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                    <span>{manga.size}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePDFClick(manga.pdfPath, manga.title);
                      }}
                    >
                      <Book className="w-3 h-3 mr-1" />
                      {language === 'bn' ? 'পড়ুন' : 'Read'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(manga.pdfPath, manga.title);
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {language === 'bn' ? manga.titlebn : manga.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'bn' ? 'লেখক' : 'Author'}: {manga.author}
                </p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {manga.genre}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{manga.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {manga.year}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{manga.pages} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                  <span>{manga.size}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePDFClick(manga.pdfPath, manga.title)}
                  >
                    <Book className="w-4 h-4 mr-2" />
                    {language === 'bn' ? 'পড়ুন' : 'Read Online'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(manga.pdfPath, manga.title)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredMangas.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'bn' 
                ? 'আপনার অনুসন্ধান শব্দ পরিবর্তন করে আবার চেষ্টা করুন।'
                : 'Try adjusting your search terms and try again.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}