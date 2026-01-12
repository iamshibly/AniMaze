import { NewsArticle } from '@/types/news';

// Generic logo patterns that should be filtered out
const GENERIC_LOGO_PATTERNS = [
  'logo.png',
  'logo.jpg',
  'logo.jpeg',
  'site-logo',
  'brand-logo',
  '/images/logo',
  'common/logo',
  'default-image'
];

// Fallback images for different categories
const FALLBACK_IMAGES = {
  anime: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
  manga: 'https://images.unsplash.com/photo-1606662516734-8ca96103cc5a?w=400&h=200&fit=crop',
  industry: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
  reviews: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
  gaming: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop',
  other: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop'
};

// Image usage tracking for deduplication
const imageUsageCount: Map<string, number> = new Map();

export const isGenericLogo = (url: string): boolean => {
  return GENERIC_LOGO_PATTERNS.some(pattern => 
    url.toLowerCase().includes(pattern.toLowerCase())
  );
};

export const getFallbackImage = (category: string): string => {
  return FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.other;
};

// Simple hash function for consistent image rotation
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export const getValidImageUrl = (
  primaryUrl: string | undefined,
  articleId: string,
  imageUrls?: string[],
  maxUsagePerImage: number = 3
): string => {
  // If no primary URL provided, try to find from imageUrls
  if (!primaryUrl && (!imageUrls || imageUrls.length === 0)) {
    return getFallbackImage('other');
  }

  // Build candidate list
  const candidates: string[] = [];
  if (primaryUrl) candidates.push(primaryUrl);
  if (imageUrls) candidates.push(...imageUrls);

  // Filter out generic logos
  const validCandidates = candidates.filter(url => url && !isGenericLogo(url));

  if (validCandidates.length === 0) {
    return getFallbackImage('other');
  }

  // Find the first image under the usage quota
  for (const url of validCandidates) {
    const usageCount = imageUsageCount.get(url) || 0;
    if (usageCount < maxUsagePerImage) {
      imageUsageCount.set(url, usageCount + 1);
      return url;
    }
  }

  // If all images are over quota, use hash-based rotation
  const hash = simpleHash(articleId);
  const selectedIndex = hash % validCandidates.length;
  return validCandidates[selectedIndex];
};

export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  articleId: string,
  category?: string
) => {
  const img = event.currentTarget;
  if (!img.dataset.fallbackUsed) {
    img.dataset.fallbackUsed = 'true';
    img.src = getFallbackImage(category || 'other');
  }
};

export const dedupeImagesAdvanced = (
  articles: NewsArticle[],
  maxUsagePerImage: number = 2
): NewsArticle[] => {
  // Reset usage tracking
  imageUsageCount.clear();

  return articles.map(article => {
    const validImageUrl = getValidImageUrl(
      article.imageUrl,
      article.id,
      article.imageUrls,
      maxUsagePerImage
    );

    return {
      ...article,
      imageUrl: validImageUrl,
      imageHash: simpleHash(article.id).toString()
    };
  });
};

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
};

export const getImageDominantColor = async (imageUrl: string): Promise<string> => {
  // This is a simplified version - in production you might want to use a library
  // like color-thief or implement actual color extraction
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
  const hash = simpleHash(imageUrl);
  return colors[hash % colors.length];
};