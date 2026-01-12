import { type Quiz } from '@/lib/mockData';

export interface QuizSearchResult {
  quiz: Quiz;
  score: number;
  matchedFields: string[];
  reason: string;
}

export class QuizSearchEngine {
  private static readonly synonyms: Record<string, string[]> = {
    'naruto': ['নারুতো', 'hokage', 'ninja', 'konoha', 'uzumaki'],
    'onepiece': ['one piece', 'ওয়ান পিস', 'luffy', 'straw hat', 'pirate', 'monkey d luffy'],
    'attackontitan': ['attack on titan', 'aot', 'eren', 'titan', 'shingeki', 'survey corps'],
    'demonslayer': ['demon slayer', 'kimetsu', 'tanjiro', 'hashira', 'breathing'],
    'dragonball': ['dragon ball', 'goku', 'saiyan', 'kamehameha', 'vegeta'],
    'myheroacademia': ['my hero academia', 'boku no hero', 'deku', 'quirk', 'ua'],
    'jujutsukaisen': ['jujutsu kaisen', 'yuji', 'gojo', 'curse', 'sukuna'],
    'deathnote': ['death note', 'light', 'l', 'kira', 'ryuk'],
    'fullmetalalchemist': ['fullmetal alchemist', 'edward', 'alphonse', 'alchemy'],
    'hunterxhunter': ['hunter x hunter', 'gon', 'killua', 'nen', 'chimera'],
    'tokyoghoul': ['tokyo ghoul', 'kaneki', 'ghoul', 'ccg', 'kagune'],
    'mobpsycho': ['mob psycho', 'shigeo', 'reigen', 'esper', 'psychic'],
    'onepunchman': ['one punch man', 'saitama', 'genos', 'hero', 'bald'],
    'bleach': ['ichigo', 'soul reaper', 'hollow', 'zanpakuto'],
    'evangelion': ['neon genesis', 'shinji', 'rei', 'asuka', 'angel'],
    'cowboybebop': ['cowboy bebop', 'spike', 'faye', 'jet', 'bebop'],
    'spiritedaway': ['spirited away', 'chihiro', 'haku', 'no face', 'studio ghibli'],
    'yourname': ['your name', 'kimi no na wa', 'taki', 'mitsuha', 'makoto shinkai'],
    'akira': ['kaneda', 'tetsuo', 'neo tokyo', 'motorcycle'],
    'ghostintheshell': ['ghost in the shell', 'kusanagi', 'motoko', 'tachikoma'],
    'sailormoon': ['sailor moon', 'usagi', 'tuxedo mask', 'sailor scout'],
    'pokemon': ['pikachu', 'ash', 'pokemon', 'pokeball', 'gym leader'],
    'digimon': ['digital monster', 'tai', 'agumon', 'digital world'],
    'cardcaptorsakura': ['cardcaptor sakura', 'sakura', 'kero', 'clow cards'],
    'inuyasha': ['kagome', 'feudal japan', 'jewel shards', 'sesshomaru'],
    'yugioh': ['yu-gi-oh', 'yugi', 'kaiba', 'duel monsters', 'pharaoh'],
    'dragonballz': ['dragon ball z', 'dbz', 'gohan', 'cell', 'frieza'],
    'onepiececharacters': ['luffy', 'zoro', 'sanji', 'nami', 'chopper', 'robin', 'franky', 'brook', 'jinbe'],
    'narutocharacters': ['sasuke', 'sakura', 'kakashi', 'itachi', 'gaara', 'hinata', 'shikamaru'],
    'attackontitancharacters': ['mikasa', 'armin', 'levi', 'erwin', 'annie', 'reiner', 'bertholdt'],
    'anime': ['অ্যানিমে', 'japanese animation', 'manga adaptation', 'otaku'],
    'manga': ['মাঙ্গা', 'japanese comic', 'manhwa', 'webtoon'],
    'easy': ['সহজ', 'beginner', 'basic', 'simple'],
    'medium': ['মধ্যম', 'intermediate', 'moderate'],
    'hard': ['কঠিন', 'difficult', 'advanced', 'expert', 'challenging']
  };

  private static readonly typoCorrections: Record<string, string> = {
    'narutoo': 'naruto',
    'naroto': 'naruto',
    'narto': 'naruto',
    'one peice': 'one piece',
    'onepeice': 'one piece',
    'lufy': 'luffy',
    'atack on titan': 'attack on titan',
    'attck on titan': 'attack on titan',
    'deth note': 'death note',
    'fullmetal alchimist': 'fullmetal alchemist',
    'dragonbal': 'dragon ball',
    'dragn ball': 'dragon ball',
    'my hero acadmia': 'my hero academia',
    'boku no hro': 'boku no hero',
    'jujutsu kaisan': 'jujutsu kaisen',
    'jujutsu kaisn': 'jujutsu kaisen',
    'demon slayar': 'demon slayer',
    'kimetsu no yaiba': 'demon slayer',
    'tokyo goul': 'tokyo ghoul',
    'huntr x hunter': 'hunter x hunter',
    'hunter hunter': 'hunter x hunter',
    'mob psyco': 'mob psycho',
    'one puch man': 'one punch man',
    'onepunch man': 'one punch man',
    'cowboy bebp': 'cowboy bebop',
    'cowby bebop': 'cowboy bebop',
    'spirted away': 'spirited away',
    'your nam': 'your name',
    'kimi no nawa': 'your name',
    'sailor mon': 'sailor moon',
    'pokmon': 'pokemon',
    'digmon': 'digimon',
    'yu gi oh': 'yu-gi-oh',
    'yugi oh': 'yu-gi-oh'
  };

  // AI Integration flag - will use backend API when available
  private static useAI: boolean = false;

  public static setAIMode(enabled: boolean): void {
    this.useAI = enabled;
  }

  /**
   * Intelligent search with AI enhancement capabilities
   */
  public static async searchQuizzes(
    quizzes: Quiz[], 
    query: string,
    useAIEnhancement: boolean = false
  ): Promise<QuizSearchResult[]> {
    if (!query?.trim()) return [];

    // If AI mode is enabled and backend is available, enhance search
    if (useAIEnhancement && this.useAI) {
      try {
        return await this.searchWithAI(quizzes, query);
      } catch (error) {
        console.warn('AI search failed, falling back to semantic search:', error);
        // Fall back to semantic search
      }
    }

    // Use semantic search as default/fallback
    return this.semanticSearch(quizzes, query);
  }

  /**
   * AI-Enhanced search using backend
   */
  private static async searchWithAI(quizzes: Quiz[], query: string): Promise<QuizSearchResult[]> {
    // This would call the backend API for AI-powered search
    const response = await fetch('/api/quiz/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        quizzes: quizzes.map(q => ({ id: q.id, title: q.title, description: q.description }))
      })
    });

    if (!response.ok) {
      throw new Error('AI search API failed');
    }

    const aiResults = await response.json();
    
    // Map AI results back to full quiz objects
    return aiResults.results.map((result: any) => ({
      quiz: quizzes.find(q => q.id === result.quizId)!,
      score: result.relevanceScore,
      matchedFields: result.matchedFields,
      reason: result.aiReasoning
    })).filter((result: any) => result.quiz);
  }

  /**
   * Semantic search with typo correction and synonyms
   */
  private static semanticSearch(quizzes: Quiz[], query: string): Promise<QuizSearchResult[]> {
    return new Promise((resolve) => {
      const normalizedQuery = this.normalizeQuery(query);
      const correctedQuery = this.correctTypos(normalizedQuery);
      const expandedTerms = this.expandWithSynonyms(correctedQuery);

      const results: QuizSearchResult[] = [];

      for (const quiz of quizzes) {
        const matchResult = this.calculateMatch(quiz, expandedTerms, correctedQuery);
        if (matchResult.score > 0) {
          results.push(matchResult);
        }
      }

      // Sort by relevance score
      results.sort((a, b) => b.score - a.score);
      
      // Limit to top 20 results
      resolve(results.slice(0, 20));
    });
  }

  /**
   * Calculate match score between quiz and search terms
   */
  private static calculateMatch(quiz: Quiz, searchTerms: string[], originalQuery: string): QuizSearchResult {
    let totalScore = 0;
    const matchedFields: string[] = [];
    const reasons: string[] = [];

    const title = this.normalizeQuery(quiz.title + ' ' + quiz.titlebn);
    const description = this.normalizeQuery(quiz.description + ' ' + quiz.descriptionbn);
    const tags = quiz.tags?.join(' ').toLowerCase() || '';
    const difficulty = quiz.difficulty.toLowerCase();

    // Exact phrase match (highest priority)
    if (title.includes(originalQuery)) {
      totalScore += 100;
      matchedFields.push('title');
      reasons.push('Exact title match');
    }

    if (description.includes(originalQuery)) {
      totalScore += 60;
      matchedFields.push('description');
      reasons.push('Exact description match');
    }

    // Individual term matching
    for (const term of searchTerms) {
      if (title.includes(term)) {
        totalScore += 50;
        if (!matchedFields.includes('title')) matchedFields.push('title');
        reasons.push(`Title contains "${term}"`);
      }

      if (description.includes(term)) {
        totalScore += 30;
        if (!matchedFields.includes('description')) matchedFields.push('description');
        reasons.push(`Description contains "${term}"`);
      }

      if (tags.includes(term)) {
        totalScore += 40;
        if (!matchedFields.includes('tags')) matchedFields.push('tags');
        reasons.push(`Tagged with "${term}"`);
      }

      if (difficulty.includes(term)) {
        totalScore += 20;
        if (!matchedFields.includes('difficulty')) matchedFields.push('difficulty');
        reasons.push(`Difficulty level match`);
      }
    }

    // Fuzzy matching for partial words
    for (const term of searchTerms) {
      if (term.length > 3) {
        const fuzzyScore = this.fuzzyMatch(term, title) + this.fuzzyMatch(term, description);
        if (fuzzyScore > 0.7) {
          totalScore += Math.floor(fuzzyScore * 20);
          reasons.push(`Fuzzy match for "${term}"`);
        }
      }
    }

    // Bonus for multiple matches
    if (matchedFields.length > 1) {
      totalScore += 15;
      reasons.push('Multiple field matches');
    }

    // Character/anime specific bonuses
    totalScore += this.getCharacterBonus(quiz, searchTerms);
    totalScore += this.getAnimeSpecificBonus(quiz, searchTerms);

    return {
      quiz,
      score: Math.max(0, totalScore),
      matchedFields,
      reason: reasons.join(', ') || 'Partial match'
    };
  }

  private static getCharacterBonus(quiz: Quiz, searchTerms: string[]): number {
    let bonus = 0;
    const content = (quiz.title + ' ' + quiz.description + ' ' + quiz.tags?.join(' ')).toLowerCase();

    // Character name detection
    const characterKeywords = ['character', 'protagonist', 'hero', 'villain', 'main'];
    const hasCharacterContext = characterKeywords.some(keyword => content.includes(keyword));

    if (hasCharacterContext) {
      for (const term of searchTerms) {
        if (this.isCharacterName(term)) {
          bonus += 25;
        }
      }
    }

    return bonus;
  }

  private static getAnimeSpecificBonus(quiz: Quiz, searchTerms: string[]): number {
    let bonus = 0;
    const content = (quiz.title + ' ' + quiz.description).toLowerCase();

    // Anime title matching
    for (const term of searchTerms) {
      for (const [anime, synonyms] of Object.entries(this.synonyms)) {
        if (synonyms.includes(term) && content.includes(anime)) {
          bonus += 30;
        }
      }
    }

    return bonus;
  }

  private static isCharacterName(term: string): boolean {
    const characterNames = [
      'luffy', 'zoro', 'sanji', 'nami', 'naruto', 'sasuke', 'sakura', 'kakashi',
      'eren', 'mikasa', 'armin', 'levi', 'goku', 'vegeta', 'gohan', 'tanjiro',
      'nezuko', 'inosuke', 'zenitsu', 'yuji', 'megumi', 'nobara', 'gojo',
      'ichigo', 'rukia', 'uryu', 'light', 'l', 'ryuk', 'edward', 'alphonse'
    ];
    return characterNames.includes(term.toLowerCase());
  }

  private static fuzzyMatch(needle: string, haystack: string): number {
    if (needle.length === 0) return 0;
    if (haystack.length === 0) return 0;
    
    let matchCount = 0;
    let j = 0;
    
    for (let i = 0; i < needle.length && j < haystack.length; i++) {
      while (j < haystack.length && haystack[j] !== needle[i]) {
        j++;
      }
      if (j < haystack.length) {
        matchCount++;
        j++;
      }
    }
    
    return matchCount / needle.length;
  }

  private static normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF]/g, ' ') // Keep Bengali characters
      .replace(/\s+/g, ' ')
      .trim();
  }

  public static correctTypos(query: string): string {
    const words = query.toLowerCase().split(' ');
    const correctedWords = words.map(word => {
      return this.typoCorrections[word] || word;
    });
    return correctedWords.join(' ');
  }

  private static expandWithSynonyms(query: string): string[] {
    const words = query.split(' ');
    const expandedTerms = new Set(words);

    for (const word of words) {
      for (const [key, synonyms] of Object.entries(this.synonyms)) {
        if (synonyms.includes(word) || key.includes(word)) {
          synonyms.forEach(synonym => expandedTerms.add(synonym));
          expandedTerms.add(key);
        }
      }
    }

    return Array.from(expandedTerms);
  }

  /**
   * Get quiz recommendations based on user preferences and AI
   */
  public static async getRecommendations(
    quizzes: Quiz[], 
    userPreferences: any,
    useAI: boolean = false
  ): Promise<Quiz[]> {
    if (useAI && this.useAI) {
      try {
        return await this.getAIRecommendations(quizzes, userPreferences);
      } catch (error) {
        console.warn('AI recommendations failed, using fallback:', error);
      }
    }

    return this.getStaticRecommendations(quizzes, userPreferences);
  }

  private static async getAIRecommendations(quizzes: Quiz[], userPreferences: any): Promise<Quiz[]> {
    const response = await fetch('/api/quiz/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userPreferences,
        availableQuizzes: quizzes.map(q => ({ 
          id: q.id, 
          title: q.title, 
          difficulty: q.difficulty,
          tags: q.tags 
        }))
      })
    });

    if (!response.ok) {
      throw new Error('AI recommendations API failed');
    }

    const recommendations = await response.json();
    
    return recommendations.quizIds
      .map((id: string) => quizzes.find(q => q.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }

  private static getStaticRecommendations(quizzes: Quiz[], userPreferences: any): Quiz[] {
    // Simple recommendation based on difficulty and recent quizzes
    const difficulty = userPreferences?.preferredDifficulty || 'Medium';
    const recentTopics = userPreferences?.recentTopics || [];

    return quizzes
      .filter(quiz => quiz.difficulty === difficulty)
      .filter(quiz => !recentTopics.includes(quiz.id))
      .sort((a, b) => Math.random() - 0.5) // Random shuffle
      .slice(0, 6);
  }

  /**
   * Advanced filtering with multiple criteria
   */
  public static filterQuizzes(
    quizzes: Quiz[],
    filters: {
      difficulty?: string[];
      tags?: string[];
      minRating?: number;
      maxDuration?: number;
      type?: string[];
    }
  ): Quiz[] {
    return quizzes.filter(quiz => {
      if (filters.difficulty && !filters.difficulty.includes(quiz.difficulty)) {
        return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => 
          quiz.tags?.some(quizTag => 
            quizTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }

      if (filters.type && !filters.type.includes(quiz.type)) {
        return false;
      }

      if (filters.maxDuration && quiz.timeLimit > filters.maxDuration) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get search suggestions based on partial input
   */
  public static getSearchSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) return [];

    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    // Check synonyms for suggestions
    for (const [key, synonyms] of Object.entries(this.synonyms)) {
      if (key.includes(normalizedQuery)) {
        suggestions.add(key);
      }
      
      for (const synonym of synonyms) {
        if (synonym.includes(normalizedQuery)) {
          suggestions.add(synonym);
        }
      }
    }

    // Popular search terms
    const popularTerms = [
      'naruto quiz', 'one piece quiz', 'attack on titan quiz', 
      'demon slayer quiz', 'dragon ball quiz', 'anime character quiz',
      'hard anime quiz', 'easy anime quiz', 'manga quiz'
    ];

    for (const term of popularTerms) {
      if (term.includes(normalizedQuery)) {
        suggestions.add(term);
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }
}