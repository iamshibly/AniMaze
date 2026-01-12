import { Manga } from '@/lib/mockData';

export interface MangaSearchResult {
  manga: Manga;
  score: number;
  matchType: 'exact' | 'typo' | 'partial' | 'semantic';
  matchedField: string;
}

export class MangaSearchEngine {
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return 1 - (distance / maxLength);
  }

  private static getSemanticMatches(query: string): string[] {
    const synonymMap: Record<string, string[]> = {
      // Common misspellings and alternatives
      'nuruto': ['naruto'],
      'narutoo': ['naruto'],
      'naroto': ['naruto'],
      'bleech': ['bleach'],
      'bleach': ['bleach'],
      'hunterxhunter': ['hunter x hunter'],
      'hunter hunter': ['hunter x hunter'],
      'deathnote': ['death note'],
      'death note': ['death note'],
      'attackontitan': ['attack on titan'],
      'shingekinokyojin': ['attack on titan'],
      'onepiece': ['one piece'],
      'one piece': ['one piece'],
      'dragonball': ['dragon ball'],
      'dragon ball': ['dragon ball'],
      'myheroacademia': ['my hero academia'],
      'bokunoheroacademia': ['my hero academia'],
      'demonslayer': ['demon slayer'],
      'kimetsu': ['demon slayer'],
      'kimetsu no yaiba': ['demon slayer'],
      'jujutsu': ['jujutsu kaisen'],
      'jjk': ['jujutsu kaisen'],
      'chainsaw': ['chainsaw man'],
      'csm': ['chainsaw man'],
      'fma': ['fullmetal alchemist'],
      'fullmetal': ['fullmetal alchemist'],
      'hxh': ['hunter x hunter'],
      
      // Genre synonyms
      'action': ['action', 'adventure', 'shounen'],
      'romance': ['romance', 'shoujo', 'josei'],
      'horror': ['horror', 'supernatural', 'thriller'],
      'comedy': ['comedy', 'slice of life'],
      'school': ['school', 'academy', 'student'],
      'ninja': ['ninja', 'martial arts', 'action'],
      'pirate': ['adventure', 'shounen', 'epic'],
      'demon': ['supernatural', 'action', 'horror'],
      'hero': ['superhero', 'action', 'school'],
      'magic': ['fantasy', 'supernatural', 'adventure']
    };

    const normalizedQuery = query.toLowerCase().trim();
    const matches: string[] = [];
    
    // Direct matches
    if (synonymMap[normalizedQuery]) {
      matches.push(...synonymMap[normalizedQuery]);
    }
    
    // Partial matches
    Object.keys(synonymMap).forEach(key => {
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        matches.push(...synonymMap[key]);
      }
    });
    
    return [...new Set(matches)];
  }

  public static searchMangas(mangas: Manga[], query: string): MangaSearchResult[] {
    if (!query.trim()) return [];

    const results: MangaSearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();
    const semanticMatches = this.getSemanticMatches(normalizedQuery);

    for (const manga of mangas) {
      const searchFields = [
        { field: 'title', value: manga.title },
        { field: 'titlebn', value: manga.titlebn },
        { field: 'author', value: manga.author },
        { field: 'description', value: manga.description },
        { field: 'descriptionbn', value: manga.descriptionbn },
        { field: 'genres', value: manga.genres.join(' ') },
        { field: 'tags', value: manga.tags.join(' ') }
      ];

      let bestMatch: MangaSearchResult | null = null;

      for (const { field, value } of searchFields) {
        const normalizedValue = value.toLowerCase();
        
        // Exact match
        if (normalizedValue === normalizedQuery) {
          bestMatch = {
            manga,
            score: 1.0,
            matchType: 'exact',
            matchedField: field
          };
          break;
        }
        
        // Contains match
        if (normalizedValue.includes(normalizedQuery)) {
          const score = normalizedQuery.length / normalizedValue.length;
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              manga,
              score: Math.max(score, 0.7),
              matchType: 'partial',
              matchedField: field
            };
          }
        }
        
        // Semantic matches
        for (const semanticMatch of semanticMatches) {
          if (normalizedValue.includes(semanticMatch.toLowerCase())) {
            const score = 0.8;
            if (!bestMatch || score > bestMatch.score) {
              bestMatch = {
                manga,
                score,
                matchType: 'semantic',
                matchedField: field
              };
            }
          }
        }
        
        // Fuzzy matching for typos
        const similarity = this.calculateSimilarity(normalizedQuery, normalizedValue);
        if (similarity > 0.6) {
          const score = similarity * 0.6; // Lower score for fuzzy matches
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              manga,
              score,
              matchType: 'typo',
              matchedField: field
            };
          }
        }
      }

      if (bestMatch && bestMatch.score > 0.3) {
        results.push(bestMatch);
      }
    }

    // Sort by score (descending) and then by rating
    return results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.manga.rating - a.manga.rating;
    });
  }

  public static getSuggestions(mangas: Manga[], query: string): string[] {
    const normalizedQuery = query.toLowerCase().trim();
    const suggestions: Set<string> = new Set();

    // Add semantic suggestions
    const semanticMatches = this.getSemanticMatches(normalizedQuery);
    semanticMatches.forEach(match => suggestions.add(match));

    // Add popular titles that partially match
    mangas
      .filter(manga => manga.rating > 8.5)
      .forEach(manga => {
        if (manga.title.toLowerCase().includes(normalizedQuery) ||
            manga.titlebn.toLowerCase().includes(normalizedQuery)) {
          suggestions.add(manga.title);
        }
      });

    return Array.from(suggestions).slice(0, 5);
  }
}