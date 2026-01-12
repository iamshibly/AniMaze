// Semantic search engine with typo correction and fuzzy matching
import { Anime } from '@/lib/mockData';

export interface SearchResult {
  anime: Anime;
  score: number;
  matchType: 'exact' | 'fuzzy' | 'semantic';
}

export class AnimeSearchEngine {
  private static commonTypos: Record<string, string> = {
    'nuruto': 'naruto',
    'bleech': 'bleach',
    'dragball': 'dragon ball',
    'attak': 'attack',
    'deamon': 'demon',
    'fullmetall': 'fullmetal',
    'evangelon': 'evangelion',
    'cowboi': 'cowboy',
    'beboop': 'bebop',
    'gintama': 'gintama',
    'hunterxhunter': 'hunter x hunter',
    'fairytail': 'fairy tail',
    'onepeice': 'one piece',
    'myheroacademia': 'my hero academia',
    'bokunohero': 'my hero academia',
    'shingeki': 'attack on titan',
    'kimetsu': 'demon slayer',
    'yaiba': 'demon slayer',
  };

  private static synonyms: Record<string, string[]> = {
    'attack on titan': ['shingeki no kyojin', 'aot', 'snk'],
    'demon slayer': ['kimetsu no yaiba', 'kny'],
    'my hero academia': ['boku no hero academia', 'mha', 'bnha'],
    'fullmetal alchemist': ['fma', 'fullmetal alchemist brotherhood'],
    'dragon ball': ['dbz', 'dragon ball z', 'dragon ball super'],
    'hunter x hunter': ['hxh'],
    'jujutsu kaisen': ['jjk'],
    'tokyo ghoul': ['tg'],
    'one piece': ['op'],
  };

  static correctTypos(query: string): string {
    const words = query.toLowerCase().split(' ');
    const corrected = words.map(word => {
      // Check for direct typo correction
      if (this.commonTypos[word]) {
        return this.commonTypos[word];
      }
      
      // Check for partial matches in typos
      for (const [typo, correct] of Object.entries(this.commonTypos)) {
        if (this.levenshteinDistance(word, typo) <= 1) {
          return correct;
        }
      }
      
      return word;
    });
    
    return corrected.join(' ');
  }

  static expandSynonyms(query: string): string[] {
    const normalized = query.toLowerCase().trim();
    const expansions = [normalized];
    
    // Check for exact synonym matches
    for (const [key, synonyms] of Object.entries(this.synonyms)) {
      if (normalized.includes(key)) {
        synonyms.forEach(synonym => {
          expansions.push(normalized.replace(key, synonym));
        });
      }
      
      // Check if query matches any synonym
      synonyms.forEach(synonym => {
        if (normalized.includes(synonym)) {
          expansions.push(normalized.replace(synonym, key));
        }
      });
    }
    
    return [...new Set(expansions)];
  }

  static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  static searchAnimes(animes: Anime[], query: string): SearchResult[] {
    if (!query.trim()) return animes.map(anime => ({ anime, score: 1, matchType: 'exact' as const }));
    
    const correctedQuery = this.correctTypos(query);
    const expandedQueries = this.expandSynonyms(correctedQuery);
    const results: SearchResult[] = [];
    
    animes.forEach(anime => {
      let bestScore = 0;
      let bestMatchType: 'exact' | 'fuzzy' | 'semantic' = 'semantic';
      
      expandedQueries.forEach(searchQuery => {
        // Exact match in title
        if (anime.title.toLowerCase().includes(searchQuery) || 
            anime.titlebn.toLowerCase().includes(searchQuery)) {
          bestScore = Math.max(bestScore, 1.0);
          bestMatchType = 'exact';
        }
        
        // Fuzzy match in title
        const titleDistance = this.levenshteinDistance(
          searchQuery, 
          anime.title.toLowerCase()
        );
        const titlebnDistance = this.levenshteinDistance(
          searchQuery, 
          anime.titlebn.toLowerCase()
        );
        
        const minTitleDistance = Math.min(titleDistance, titlebnDistance);
        if (minTitleDistance <= 2) {
          const fuzzyScore = 1 - (minTitleDistance / Math.max(searchQuery.length, anime.title.length));
          if (fuzzyScore > bestScore) {
            bestScore = fuzzyScore;
            bestMatchType = 'fuzzy';
          }
        }
        
        // Semantic match in description and genres
        const descriptionMatch = anime.description.toLowerCase().includes(searchQuery) ||
                               anime.descriptionbn.toLowerCase().includes(searchQuery);
        const genreMatch = anime.genres.some(genre => 
          genre.toLowerCase().includes(searchQuery) ||
          searchQuery.includes(genre.toLowerCase())
        );
        const tagsMatch = anime.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery) ||
          searchQuery.includes(tag.toLowerCase())
        );
        
        if (descriptionMatch || genreMatch || tagsMatch) {
          bestScore = Math.max(bestScore, 0.7);
        }
        
        // Studio and cast match
        const studioMatch = anime.studio.toLowerCase().includes(searchQuery);
        const castMatch = anime.cast.some(member => 
          member.toLowerCase().includes(searchQuery)
        );
        
        if (studioMatch || castMatch) {
          bestScore = Math.max(bestScore, 0.5);
        }
      });
      
      if (bestScore > 0) {
        results.push({ anime, score: bestScore, matchType: bestMatchType });
      }
    });
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit results
  }

  static getRecommendations(anime: Anime, allAnimes: Anime[], limit: number = 6): Anime[] {
    const scores = allAnimes
      .filter(a => a.id !== anime.id)
      .map(otherAnime => {
        let score = 0;
        
        // Genre similarity
        const commonGenres = anime.genres.filter(g => otherAnime.genres.includes(g));
        score += commonGenres.length * 0.3;
        
        // Studio similarity
        if (anime.studio === otherAnime.studio) score += 0.2;
        
        // Rating similarity
        const ratingDiff = Math.abs(anime.rating - otherAnime.rating);
        score += (1 - ratingDiff / 10) * 0.2;
        
        // Year similarity (prefer recent anime)
        const yearDiff = Math.abs(anime.year - otherAnime.year);
        score += Math.max(0, 1 - yearDiff / 20) * 0.1;
        
        // Tags similarity
        const commonTags = anime.tags.filter(t => otherAnime.tags.includes(t));
        score += commonTags.length * 0.2;
        
        return { anime: otherAnime, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return scores.map(s => s.anime);
  }
}