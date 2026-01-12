// src/pages/critique/SubmitContent.tsx - Enhanced with proper integration
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Star, 
  Video, 
  BookOpen,
  Upload,
  AlertCircle,
  CheckCircle,
  Eye,
  Sparkles,
  Youtube,
  Link as LinkIcon,
  X,
  Plus
} from 'lucide-react';
import { useSubmissionForm } from '@/hooks/useCritique';
import type { SubmissionFormData, SubmissionType } from '@/types/critique';

// Content type options with enhanced descriptions
const contentTypes = [
  { 
    value: 'anime_review', 
    label: 'Anime Review', 
    description: 'Comprehensive review of an anime series', 
    icon: Star,
    requirements: ['Title', 'Content (min 300 words)', 'Star Rating'],
    color: 'bg-orange-50 border-orange-200 text-orange-800'
  },
  { 
    value: 'manga_review', 
    label: 'Manga Review', 
    description: 'Detailed review of manga series or chapters', 
    icon: BookOpen,
    requirements: ['Title', 'Content (min 300 words)', 'Star Rating'],
    color: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  { 
    value: 'episode_review', 
    label: 'Episode Review', 
    description: 'Episode-by-episode analysis and commentary', 
    icon: FileText,
    requirements: ['Title', 'Content (min 200 words)', 'Star Rating', 'Episode Number'],
    color: 'bg-green-50 border-green-200 text-green-800'
  },
  { 
    value: 'vlog', 
    label: 'Video Content', 
    description: 'Video essays, reactions, and discussions', 
    icon: Video,
    requirements: ['Title', 'Description', 'YouTube Link', 'Content Summary'],
    color: 'bg-red-50 border-red-200 text-red-800'
  }
];

interface FormErrors {
  [key: string]: string;
}

export default function SubmitContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitting, error: submitError, submitSubmission } = useSubmissionForm();

  const [formData, setFormData] = useState<SubmissionFormData>({
    type: '',
    title: '',
    content: '',
    anime_manga_id: '',
    youtube_link: '',
    star_rating: undefined,
    cover_image: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.type) {
      newErrors.type = 'Content type is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else {
      const minWords = formData.type === 'episode_review' ? 200 : 300;
      if (wordCount < minWords) {
        newErrors.content = `Content must be at least ${minWords} words (currently ${wordCount})`;
      }
    }

    // Type-specific validations
    if (formData.type === 'anime_review' || formData.type === 'manga_review' || formData.type === 'episode_review') {
      if (!formData.star_rating) {
        newErrors.star_rating = 'Star rating is required for reviews';
      }
    }

    if (formData.type === 'vlog') {
      if (!formData.youtube_link) {
        newErrors.youtube_link = 'YouTube link is required for video content';
      } else if (!isValidYouTubeUrl(formData.youtube_link)) {
        newErrors.youtube_link = 'Please enter a valid YouTube URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleInputChange = (field: keyof SubmissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update word count for content field
    if (field === 'content') {
      const words = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      setWordCount(words);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 10) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cover_image: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, cover_image: 'Only image files are allowed' }));
        return;
      }

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setFormData(prevData => ({ ...prevData, cover_image: file }));
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Clear any previous errors
      setErrors(prev => ({ ...prev, cover_image: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitSubmission(formData);

      toast({
        title: "Submission Successful! 🎉",
        description: "Your content has been submitted for admin review. You'll be notified once it's reviewed.",
      });

      // Reset form
      setFormData({
        type: '',
        title: '',
        content: '',
        anime_manga_id: '',
        youtube_link: '',
        star_rating: undefined,
        cover_image: undefined
      });
      setTags([]);
      setWordCount(0);

      // Navigate to submissions page
      navigate('/critique/submissions');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please check your content and try again.",
        variant: "destructive"
      });
    }
  };

  const selectedType = contentTypes.find(type => type.value === formData.type);
  const minWords = formData.type === 'episode_review' ? 200 : 300;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Content</h1>
        <p className="text-gray-600">
          Share your anime and manga insights with the community. Your content will be reviewed before publication.
        </p>
      </div>

      {/* Global Error Alert */}
      {submitError && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Content Type
            </CardTitle>
            <CardDescription>
              Choose the type of content you want to submit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('type', type.value)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-900">{type.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {type.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.type && <p className="text-red-600 text-sm mt-2">{errors.type}</p>}
          </CardContent>
        </Card>

        {/* Selected Type Requirements */}
        {selectedType && (
          <Alert className={`${selectedType.color} border-2`}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{selectedType.label}</strong> - {selectedType.description}
              <div className="mt-2 text-sm">
                <strong>Requirements:</strong> {selectedType.requirements.join(', ')}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details for your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a compelling title for your content..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/10 characters
              </p>
            </div>

            {/* Star Rating for Reviews */}
            {(formData.type === 'anime_review' || formData.type === 'manga_review' || formData.type === 'episode_review') && (
              <div>
                <Label htmlFor="rating">Star Rating *</Label>
                <Select
                  value={formData.star_rating?.toString() || ''}
                  onValueChange={(value) => handleInputChange('star_rating', parseInt(value))}
                >
                  <SelectTrigger className={errors.star_rating ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a rating..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ 1 Star - Poor</SelectItem>
                    <SelectItem value="2">⭐⭐ 2 Stars - Fair</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 Stars - Good</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 Stars - Very Good</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.star_rating && <p className="text-red-600 text-sm mt-1">{errors.star_rating}</p>}
              </div>
            )}

            {/* YouTube Link for Vlogs */}
            {formData.type === 'vlog' && (
              <div>
                <Label htmlFor="youtube_link">YouTube Link *</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    id="youtube_link"
                    value={formData.youtube_link}
                    onChange={(e) => handleInputChange('youtube_link', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={`pl-10 ${errors.youtube_link ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.youtube_link && <p className="text-red-600 text-sm mt-1">{errors.youtube_link}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Please provide the full YouTube URL for your video content
                </p>
              </div>
            )}

            {/* Anime/Manga ID (Optional) */}
            <div>
              <Label htmlFor="anime_manga_id">Anime/Manga ID (Optional)</Label>
              <Input
                id="anime_manga_id"
                value={formData.anime_manga_id}
                onChange={(e) => handleInputChange('anime_manga_id', e.target.value)}
                placeholder="e.g., attack-on-titan, one-piece..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Link this content to a specific anime/manga in our database
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>
              Write your {formData.type === 'vlog' ? 'video description and summary' : 'review or analysis'}
              {formData.type && ` (minimum ${minWords} words)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder={
                formData.type === 'vlog' 
                  ? "Provide a detailed description of your video content, key topics discussed, and main insights..."
                  : "Share your thoughts, analysis, and insights. Be detailed and constructive..."
              }
              rows={12}
              className={`resize-none ${errors.content ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
                <span>{wordCount} words</span>
                <div className={`px-2 py-1 rounded text-xs ${
                  wordCount >= minWords 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {wordCount >= minWords ? 'Minimum reached' : `${minWords - wordCount} words needed`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags (Optional)</CardTitle>
            <CardDescription>
              Add relevant tags to help users discover your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline" disabled={tags.length >= 10}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                      title={`Remove tag: ${tag}`}
                      aria-label={`Remove tag: ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              {tags.length}/10 tags used
            </p>
          </CardContent>
        </Card>

        {/* Cover Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Image (Optional)</CardTitle>
            <CardDescription>
              Upload a cover image for your content (max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="cover-upload"
              />
              <label htmlFor="cover-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </label>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}
            
            {formData.cover_image && (
              <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Image uploaded: {formData.cover_image.name}
              </div>
            )}
            
            {errors.cover_image && <p className="text-red-600 text-sm mt-2">{errors.cover_image}</p>}
          </CardContent>
        </Card>

        {/* Submission Guidelines */}
        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription>
            <strong>Before submitting:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Ensure your content is original and follows community guidelines</li>
              <li>Check for spelling and grammar errors</li>
              <li>Your content will be reviewed by our admin team before publication</li>
              <li>You'll receive a notification once your submission is reviewed</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/critique/submissions')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting || !formData.type}
            className="min-w-[120px]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Content
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}