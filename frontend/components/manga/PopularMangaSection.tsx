import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockMangas, type Manga } from '@/lib/mockData';

interface PopularMangaSectionProps {
  language?: 'en' | 'bn';
}

export default function PopularMangaSection({ language = 'en' }: PopularMangaSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Get popular manga (rating > 8.5) and sort by rating
  const popularMangas = mockMangas
    .filter(manga => manga.rating > 8.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const slidesToShow = 4;
  const totalSlides = Math.ceil(popularMangas.length / slidesToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideMangas = () => {
    const startIndex = currentSlide * slidesToShow;
    return popularMangas.slice(startIndex, startIndex + slidesToShow);
  };

  return (
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
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            disabled={totalSlides <= 1}
            className="h-10 w-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            disabled={totalSlides <= 1}
            className="h-10 w-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getCurrentSlideMangas().map((manga) => (
          <PopularMangaCard key={manga.id} manga={manga} language={language} />
        ))}
      </div>

      {/* Slide indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface PopularMangaCardProps {
  manga: Manga;
  language: 'en' | 'bn';
}

function PopularMangaCard({ manga, language }: PopularMangaCardProps) {
  return (
    <Card className="group relative overflow-hidden card-hover h-full">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img 
          src={manga.cover} 
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
  );
}