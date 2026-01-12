import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { AnimeSearchEngine } from './SearchEngine';

interface AnimeFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedStudios: string[];
  setSelectedStudios: (studios: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  allGenres: string[];
  allStudios: string[];
  allStatuses: string[];
  resultCount: number;
  language: 'en' | 'bn';
  onClearFilters: () => void;
}

export default function AnimeFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedGenres,
  setSelectedGenres,
  selectedStudios,
  setSelectedStudios,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  yearRange,
  setYearRange,
  ratingRange,
  setRatingRange,
  allGenres,
  allStudios,
  allStatuses,
  resultCount,
  language,
  onClearFilters
}: AnimeFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [correctedQuery, setCorrectedQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const corrected = AnimeSearchEngine.correctTypos(value);
      if (corrected !== value.toLowerCase()) {
        setCorrectedQuery(corrected);
      } else {
        setCorrectedQuery('');
      }
    } else {
      setCorrectedQuery('');
    }
  };

  const applyCorrectedQuery = () => {
    setSearchQuery(correctedQuery);
    setCorrectedQuery('');
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  const toggleStudio = (studio: string) => {
    setSelectedStudios(
      selectedStudios.includes(studio)
        ? selectedStudios.filter(s => s !== studio)
        : [...selectedStudios, studio]
    );
  };

  const hasActiveFilters = selectedGenres.length > 0 || 
                          selectedStudios.length > 0 || 
                          selectedStatus !== 'all' || 
                          selectedType !== 'all' ||
                          yearRange[0] !== 1960 || 
                          yearRange[1] !== 2024 ||
                          ratingRange[0] !== 0 || 
                          ratingRange[1] !== 10;

  return (
    <div className="space-y-6">
      {/* Main Search Bar - Centered */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder={language === 'bn' ? 'অ্যানিমে খুঁজুন... (যেমন: নারুতো, অ্যাটাক অন টাইটান)' : 'Search anime... (e.g., Naruto, Attack on Titan)'}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg bg-card border-2 border-border focus:border-primary rounded-xl shadow-card"
          />
        </div>
        
        {/* Typo Correction Suggestion */}
        {correctedQuery && (
          <div className="mt-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {language === 'bn' ? 'আপনি কি এটি খুঁজছিলেন:' : 'Did you mean:'}
            </p>
            <Button 
              variant="link" 
              onClick={applyCorrectedQuery}
              className="text-accent font-semibold p-0 h-auto"
            >
              {correctedQuery}
            </Button>
          </div>
        )}
      </div>

      {/* Quick Filters & Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'bn' ? 'সাজান' : 'Sort by'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">
                {language === 'bn' ? 'রেটিং (উচ্চ থেকে নিম্ন)' : 'Rating (High to Low)'}
              </SelectItem>
              <SelectItem value="popularity">
                {language === 'bn' ? 'জনপ্রিয়তা' : 'Popularity'}
              </SelectItem>
              <SelectItem value="year">
                {language === 'bn' ? 'বছর (নতুন থেকে পুরানো)' : 'Year (Newest)'}
              </SelectItem>
              <SelectItem value="title">
                {language === 'bn' ? 'নাম (ক-য)' : 'Title (A-Z)'}
              </SelectItem>
              <SelectItem value="recently-added">
                {language === 'bn' ? 'সম্প্রতি যোগ করা' : 'Recently Added'}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={language === 'bn' ? 'স্ট্যাটাস' : 'Status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}
              </SelectItem>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'ongoing' ? (language === 'bn' ? 'চলমান' : 'Ongoing') :
                   status === 'completed' ? (language === 'bn' ? 'সম্পন্ন' : 'Completed') :
                   status === 'upcoming' ? (language === 'bn' ? 'আসছে' : 'Upcoming') : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Production Type */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={language === 'bn' ? 'ধরন' : 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'bn' ? 'সব ধরন' : 'All Types'}
              </SelectItem>
              <SelectItem value="tv">{language === 'bn' ? 'টিভি সিরিজ' : 'TV Series'}</SelectItem>
              <SelectItem value="movie">{language === 'bn' ? 'মুভি' : 'Movie'}</SelectItem>
              <SelectItem value="ova">{language === 'bn' ? 'ওভিএ' : 'OVA'}</SelectItem>
              <SelectItem value="special">{language === 'bn' ? 'স্পেশাল' : 'Special'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {resultCount} {language === 'bn' ? 'টি ফলাফল' : 'results'}
          </span>
          
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                {language === 'bn' ? 'আরও ফিল্টার' : 'Advanced Filters'}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-2">
              <X className="w-4 h-4" />
              {language === 'bn' ? 'পরিষ্কার করুন' : 'Clear'}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map(genre => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleGenre(genre)}
              />
            </Badge>
          ))}
          {selectedStudios.map(studio => (
            <Badge key={studio} variant="secondary" className="gap-1">
              {studio}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => toggleStudio(studio)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-card rounded-xl border">
            {/* Genres */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === 'bn' ? 'জেনার' : 'Genres'}
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {allGenres.map(genre => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <label htmlFor={genre} className="text-sm cursor-pointer">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Studios */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === 'bn' ? 'স্টুডিও' : 'Studios'}
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {allStudios.map(studio => (
                  <div key={studio} className="flex items-center space-x-2">
                    <Checkbox
                      id={studio}
                      checked={selectedStudios.includes(studio)}
                      onCheckedChange={() => toggleStudio(studio)}
                    />
                    <label htmlFor={studio} className="text-sm cursor-pointer">
                      {studio}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Year Range */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === 'bn' ? 'বছর' : 'Release Year'}
              </h3>
              <div className="space-y-3">
                <Slider
                  value={yearRange}
                  onValueChange={(value) => setYearRange(value as [number, number])}
                  min={1960}
                  max={2024}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Range */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === 'bn' ? 'রেটিং' : 'Rating'}
              </h3>
              <div className="space-y-3">
                <Slider
                  value={ratingRange}
                  onValueChange={(value) => setRatingRange(value as [number, number])}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{ratingRange[0].toFixed(1)}</span>
                  <span>{ratingRange[1].toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}