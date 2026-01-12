import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Filter, ChevronDown, X, Grid, List } from 'lucide-react';

interface MangaFiltersProps {
  // Filter state
  selectedGenres: string[];
  selectedCategories: string[];
  selectedAuthors: string[];
  selectedPublishers: string[];
  selectedStatus: string;
  volumeRange: [number, number];
  chapterRange: [number, number];
  ratingRange: [number, number];
  yearRange: [number, number];
  sortBy: string;
  viewMode: 'grid' | 'list';
  
  // Available options
  allGenres: string[];
  allCategories: string[];
  allAuthors: string[];
  allPublishers: string[];
  allStatuses: string[];
  
  // Event handlers
  onGenresChange: (genres: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onAuthorsChange: (authors: string[]) => void;
  onPublishersChange: (publishers: string[]) => void;
  onStatusChange: (status: string) => void;
  onVolumeRangeChange: (range: [number, number]) => void;
  onChapterRangeChange: (range: [number, number]) => void;
  onRatingRangeChange: (range: [number, number]) => void;
  onYearRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onClearFilters: () => void;
  
  // Other props
  language?: 'en' | 'bn';
  totalResults: number;
}

export default function MangaFilters({
  selectedGenres,
  selectedCategories,
  selectedAuthors,
  selectedPublishers,
  selectedStatus,
  volumeRange,
  chapterRange,
  ratingRange,
  yearRange,
  sortBy,
  viewMode,
  allGenres,
  allCategories,
  allAuthors,
  allPublishers,
  allStatuses,
  onGenresChange,
  onCategoriesChange,
  onAuthorsChange,
  onPublishersChange,
  onStatusChange,
  onVolumeRangeChange,
  onChapterRangeChange,
  onRatingRangeChange,
  onYearRangeChange,
  onSortChange,
  onViewModeChange,
  onClearFilters,
  language = 'en',
  totalResults
}: MangaFiltersProps) {
  const [isGenresOpen, setIsGenresOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);
  const [isPublishersOpen, setIsPublishersOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const toggleAuthor = (author: string) => {
    if (selectedAuthors.includes(author)) {
      onAuthorsChange(selectedAuthors.filter(a => a !== author));
    } else {
      onAuthorsChange([...selectedAuthors, author]);
    }
  };

  const togglePublisher = (publisher: string) => {
    if (selectedPublishers.includes(publisher)) {
      onPublishersChange(selectedPublishers.filter(p => p !== publisher));
    } else {
      onPublishersChange([...selectedPublishers, publisher]);
    }
  };

  const hasActiveFilters = selectedGenres.length > 0 || 
                          selectedCategories.length > 0 || 
                          selectedAuthors.length > 0 ||
                          selectedPublishers.length > 0 ||
                          selectedStatus !== 'all' ||
                          volumeRange[0] !== 0 || volumeRange[1] !== 200 ||
                          chapterRange[0] !== 0 || chapterRange[1] !== 1500 ||
                          ratingRange[0] !== 0 || ratingRange[1] !== 10 ||
                          yearRange[0] !== 1950 || yearRange[1] !== 2024;

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'bn' ? 'সাজান' : 'Sort by'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">
                {language === 'bn' ? 'রেটিং' : 'Rating'}
              </SelectItem>
              <SelectItem value="popularity">
                {language === 'bn' ? 'জনপ্রিয়তা' : 'Popularity'}
              </SelectItem>
              <SelectItem value="year">
                {language === 'bn' ? 'প্রকাশের বছর' : 'Publication Year'}
              </SelectItem>
              <SelectItem value="title">
                {language === 'bn' ? 'নাম' : 'Title'}
              </SelectItem>
              <SelectItem value="recently-added">
                {language === 'bn' ? 'সাম্প্রতিক' : 'Recently Added'}
              </SelectItem>
              <SelectItem value="chapters">
                {language === 'bn' ? 'অধ্যায় সংখ্যা' : 'Chapter Count'}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {language === 'bn' ? 'ফিল্টার সাফ করুন' : 'Clear Filters'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Results count */}
          <span className="text-sm text-muted-foreground">
            {totalResults} {language === 'bn' ? 'টি মাঙ্গা পাওয়া গেছে' : 'manga found'}
          </span>

          {/* View mode toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map(genre => (
            <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => toggleGenre(genre)}>
              {genre} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {selectedCategories.map(category => (
            <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => toggleCategory(category)}>
              {category} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {selectedAuthors.map(author => (
            <Badge key={author} variant="secondary" className="cursor-pointer" onClick={() => toggleAuthor(author)}>
              {author} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {selectedPublishers.map(publisher => (
            <Badge key={publisher} variant="secondary" className="cursor-pointer" onClick={() => togglePublisher(publisher)}>
              {publisher} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onStatusChange('all')}>
              Status: {selectedStatus} <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Genres */}
        <Collapsible open={isGenresOpen} onOpenChange={setIsGenresOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'bn' ? 'জেনার' : 'Genres'}
                </span>
                {selectedGenres.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedGenres.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isGenresOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {allGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleGenre(genre)}
                  className="justify-start text-left h-8"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Categories */}
        <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
                </span>
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCategories.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-4">
            <div className="space-y-2">
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="w-full justify-start text-left h-8"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Authors */}
        <Collapsible open={isAuthorsOpen} onOpenChange={setIsAuthorsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'bn' ? 'লেখক' : 'Authors'}
                </span>
                {selectedAuthors.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedAuthors.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAuthorsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allAuthors.map((author) => (
                <Button
                  key={author}
                  variant={selectedAuthors.includes(author) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAuthor(author)}
                  className="w-full justify-start text-left h-8"
                >
                  {author}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'bn' ? 'অ্যাডভান্সড' : 'Advanced'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'bn' ? 'স্ট্যাটাস' : 'Status'}
              </label>
              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}
                  </SelectItem>
                  {allStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Volume Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'bn' ? 'খণ্ড সংখ্যা' : 'Volume Count'}: {volumeRange[0]} - {volumeRange[1]}
              </label>
              <Slider
                value={volumeRange}
                onValueChange={(value) => onVolumeRangeChange(value as [number, number])}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Chapter Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'bn' ? 'অধ্যায় সংখ্যা' : 'Chapter Count'}: {chapterRange[0]} - {chapterRange[1]}
              </label>
              <Slider
                value={chapterRange}
                onValueChange={(value) => onChapterRangeChange(value as [number, number])}
                max={1500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Rating Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'bn' ? 'রেটিং' : 'Rating'}: {ratingRange[0]} - {ratingRange[1]}
              </label>
              <Slider
                value={ratingRange}
                onValueChange={(value) => onRatingRangeChange(value as [number, number])}
                max={10}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Year Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'bn' ? 'প্রকাশের বছর' : 'Publication Year'}: {yearRange[0]} - {yearRange[1]}
              </label>
              <Slider
                value={yearRange}
                onValueChange={(value) => onYearRangeChange(value as [number, number])}
                max={2024}
                min={1950}
                step={1}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
