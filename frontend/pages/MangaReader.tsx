// src/pages/MangaReader.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Book, 
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { mockMangas } from '@/lib/mockData';
import { useChapterTracking } from '@/hooks/useUserProgress';
import { toast } from '@/hooks/use-toast';

const MangaReader: React.FC = () => {
  const { id, chapterNumber } = useParams<{ id: string; chapterNumber?: string }>();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [language] = useState<'en' | 'bn'>('en');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [readingMode, setReadingMode] = useState<'single' | 'double'>('single');

  // Find the manga
  const manga = mockMangas.find(m => m.id === id);
  
  // Use chapter tracking hook
  const {
    progress,
    updateChapterProgress,
    markChapterRead,
    setCurrentPage: updateCurrentPage
  } = useChapterTracking(id || '');

  useEffect(() => {
    if (chapterNumber) {
      const chapterNum = parseInt(chapterNumber);
      if (!isNaN(chapterNum)) {
        setCurrentChapter(chapterNum);
      }
    } else if (progress?.current_chapter) {
      setCurrentChapter(progress.current_chapter);
      setCurrentPage(progress.current_page);
    }
  }, [chapterNumber, progress]);

  // Update progress when page changes
  useEffect(() => {
    if (manga && currentChapter && currentPage) {
      updateCurrentPage(currentChapter, currentPage);
    }
  }, [currentChapter, currentPage, manga, updateCurrentPage]);

  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'bn' ? 'ম্যাঙ্গা পাওয়া যায়নি' : 'Manga not found'}
          </h1>
          <Link to="/manga">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'ম্যাঙ্গা তালিকায় ফিরুন' : 'Back to Manga List'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentChapterData = manga.chapters.find(c => c.number === currentChapter);
  const totalPages = 20; // Mock data - in real app, this would come from chapter data
  const maxChapter = manga.chapters.length;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (currentChapter > 1) {
      // Go to previous chapter, last page
      setCurrentChapter(prev => prev - 1);
      setCurrentPage(totalPages);
      navigate(`/manga/${id}/chapter/${currentChapter - 1}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (currentChapter < maxChapter) {
      // Go to next chapter, first page
      markChapterRead(currentChapter);
      setCurrentChapter(prev => prev + 1);
      setCurrentPage(1);
      navigate(`/manga/${id}/chapter/${currentChapter + 1}`);
      
      toast({
        title: language === 'bn' ? 'অধ্যায় সম্পন্ন' : 'Chapter completed',
        description: language === 'bn' 
          ? `অধ্যায় ${currentChapter} সম্পন্ন হয়েছে!`
          : `Chapter ${currentChapter} completed!`
      });
    }
  };

  const handleChapterChange = (chapterNum: number) => {
    if (chapterNum >= 1 && chapterNum <= maxChapter) {
      setCurrentChapter(chapterNum);
      setCurrentPage(1);
      navigate(`/manga/${id}/chapter/${chapterNum}`);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  // Mock page image URLs - in real app, these would come from your manga data
  const getPageImageUrl = (chapter: number, page: number) => {
    return `https://picsum.photos/800/1200?random=${chapter * 100 + page}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              <Link to={`/manga/${id}`}>
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                </Button>
              </Link>
              
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <span className="font-medium">
                  {language === 'bn' ? manga.titlebn : manga.title}
                </span>
              </div>
            </div>

            {/* Center: Chapter/Page Info */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-white border-gray-600">
                {language === 'bn' ? 'অধ্যায়' : 'Chapter'} {currentChapter}/{maxChapter}
              </Badge>
              <Badge variant="outline" className="text-white border-gray-600">
                {language === 'bn' ? 'পৃষ্ঠা' : 'Page'} {currentPage}/{totalPages}
              </Badge>
            </div>

            {/* Right: Settings */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm">{zoomLevel}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetZoom}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reader */}
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">
              {language === 'bn' ? 'পৃষ্ঠা লোড হচ্ছে...' : 'Loading page...'}
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {readingMode === 'single' ? (
              <img
                src={getPageImageUrl(currentChapter, currentPage)}
                alt={`Page ${currentPage}`}
                className="max-w-full h-auto cursor-pointer transition-transform"
                style={{ transform: `scale(${zoomLevel / 100})` }}
                onClick={handleNextPage}
                onError={(e) => {
                  // Fallback for failed images
                  e.currentTarget.src = '/placeholder-manga-page.jpg';
                }}
              />
            ) : (
              // Double page mode
              <div className="flex gap-4">
                {currentPage > 1 && (
                  <img
                    src={getPageImageUrl(currentChapter, currentPage - 1)}
                    alt={`Page ${currentPage - 1}`}
                    className="max-w-[48%] h-auto"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  />
                )}
                <img
                  src={getPageImageUrl(currentChapter, currentPage)}
                  alt={`Page ${currentPage}`}
                  className="max-w-[48%] h-auto cursor-pointer"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                  onClick={handleNextPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <Card className="bg-black/90 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center gap-4 p-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={currentChapter === 1 && currentPage === 1}
              className="text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {language === 'bn' ? 'আগের' : 'Previous'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newChapter = Math.max(1, currentChapter - 1);
                  handleChapterChange(newChapter);
                }}
                disabled={currentChapter === 1}
                className="text-white border-gray-600"
              >
                Ch {currentChapter - 1}
              </Button>
              
              <select
                value={currentChapter}
                onChange={(e) => handleChapterChange(parseInt(e.target.value))}
                className="bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm"
              >
                {manga.chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.number}>
                    Chapter {chapter.number}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newChapter = Math.min(maxChapter, currentChapter + 1);
                  handleChapterChange(newChapter);
                }}
                disabled={currentChapter === maxChapter}
                className="text-white border-gray-600"
              >
                Ch {currentChapter + 1}
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextPage}
              disabled={currentChapter === maxChapter && currentPage === totalPages}
              className="text-white hover:text-gray-300"
            >
              {language === 'bn' ? 'পরের' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="fixed top-20 right-4">
        <Card className="bg-black/90 backdrop-blur-sm border-gray-700">
          <CardContent className="p-3">
            <div className="text-xs text-gray-300">
              <div className="font-medium mb-1">Shortcuts:</div>
              <div>← Previous • → Next</div>
              <div>Click image to advance</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add keyboard navigation
React.useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      // handlePrevPage();
    } else if (e.key === 'ArrowRight') {
      // handleNextPage();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);

export default MangaReader;