// src/lib/mockData.ts - Fixed interface types and data structure
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  badges: Badge[];
  isPremium: boolean;
  premiumUntil?: Date;
  language: 'en' | 'bn';
  theme: 'light' | 'dark';
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  namebn: string;
  description: string;
  descriptionbn: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

// FIXED: Added missing image property to Anime interface
export interface Anime {
  id: string;
  title: string;
  titlebn: string;
  description: string;
  descriptionbn: string;
  poster: string;
  image: string; // FIXED: Added missing image property
  trailer: string;
  year: number;
  studio: string;
  genres: string[];
  rating: number;
  episodes: Episode[];
  status: 'ongoing' | 'completed' | 'upcoming';
  tags: string[];
  cast: string[];
  staff: string[];
  awards: string[];
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  titlebn: string;
  description: string;
  descriptionbn: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  airDate: Date;
}

// FIXED: Added missing image and year properties to Manga interface
export interface Manga {
  id: string;
  title: string;
  titlebn: string;
  description: string;
  descriptionbn: string;
  cover: string;
  image: string; // FIXED: Added missing image property
  author: string;
  publisher: string;
  genres: string[];
  rating: number;
  year: number; // FIXED: Added missing year property
  chapters: Chapter[];
  status: 'ongoing' | 'completed' | 'hiatus';
  tags: string[];
  publicationDate: Date;
  volumes: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  titlebn: string;
  pages: string[];
  publishDate: Date;
}

export interface Quiz {
  id: string;
  title: string;
  titlebn: string;
  description: string;
  descriptionbn: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'image-based' | 'fill-in-blank' | 'true-false';
  questions: Question[];
  animeId?: string;
  mangaId?: string;
  timeLimit: number;
  xpReward: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  questionbn: string;
  options: string[];
  optionsbn: string[];
  correctAnswer: number;
  explanation: string;
  explanationbn: string;
  image?: string;
  timeLimit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: 'anime' | 'manga' | 'general';
  tags?: string[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  badges: number;
  quizzesTaken: number;
  rank: number;
}

// FIXED: Updated mock data with missing properties
export const mockAnimes: Anime[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    titlebn: 'অ্যাটাক অন টাইটান',
    description: 'Humanity fights for survival against giant humanoid Titans in this dark, intense series that revolutionized anime.',
    descriptionbn: 'মানবতা বিশাল দেয়ালের পিছনে দৈত্যাকার মানবরূপী টাইটানদের বিরুদ্ধে বেঁচে থাকার জন্য লড়াই করে এই অন্ধকার, তীব্র সিরিজে যা অ্যানিমেতে বিপ্লব এনেছে।',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop', // FIXED: Added image property
    trailer: 'https://example.com/aot-trailer',
    year: 2013,
    studio: 'Wit Studio / MAPPA',
    genres: ['Action', 'Drama', 'Horror'],
    rating: 9.0,
    episodes: [],
    status: 'completed',
    tags: ['titans', 'military', 'survival'],
    cast: ['Eren Yeager', 'Mikasa Ackerman', 'Armin Arlert'],
    staff: ['Hajime Isayama', 'Tetsuro Araki'],
    awards: ['Anime of the Year 2013']
  },
  {
    id: '2',
    title: 'One Piece',
    titlebn: 'ওয়ান পিস',
    description: 'Follow Monkey D. Luffy and his Straw Hat Pirates as they search for the ultimate treasure known as One Piece.',
    descriptionbn: 'মাঙ্কি ডি. লুফি এবং তার স্ট্র হ্যাট পাইরেটদের অনুসরণ করুন যখন তারা ওয়ান পিস নামে পরিচিত চূড়ান্ত ধনের সন্ধান করে।',
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop', // FIXED: Added image property
    trailer: 'https://example.com/onepiece-trailer',
    year: 1999,
    studio: 'Toei Animation',
    genres: ['Adventure', 'Comedy', 'Shounen'],
    rating: 8.8,
    episodes: [],
    status: 'ongoing',
    tags: ['pirates', 'adventure', 'friendship'],
    cast: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami'],
    staff: ['Eiichiro Oda'],
    awards: ['Best Manga Series']
  }
];

// FIXED: Updated mock manga data with missing properties
export const mockMangas: Manga[] = [
  {
    id: '1',
    title: 'Demon Slayer',
    titlebn: 'কিমেৎসু নো ইয়াইবা',
    description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
    descriptionbn: 'একটি তরুণ ছেলে তার বোনকে বাঁচাতে এবং তার পরিবারের প্রতিশোধ নিতে একটি দানব ঘাতক হয়ে ওঠে।',
    cover: 'https://images.unsplash.com/photo-1606662516734-8ca96103cc5a?w=400&h=600&fit=crop',
    image: 'https://images.unsplash.com/photo-1606662516734-8ca96103cc5a?w=800&h=450&fit=crop', // FIXED: Added image property
    author: 'Koyoharu Gotouge',
    publisher: 'Shueisha',
    genres: ['Action', 'Supernatural', 'Historical'],
    rating: 8.7,
    year: 2016, // FIXED: Added year property
    chapters: [],
    status: 'completed',
    tags: ['demons', 'swords', 'family'],
    publicationDate: new Date('2016-02-15'),
    volumes: 23
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Attack on Titan Quiz',
    titlebn: 'অ্যাটাক অন টাইটান কুইজ',
    description: 'Test your knowledge about the world of Attack on Titan',
    descriptionbn: 'অ্যাটাক অন টাইটানের জগত সম্পর্কে আপনার জ্ঞান পরীক্ষা করুন',
    difficulty: 'medium',
    type: 'multiple-choice',
    questions: [
      {
        id: '1',
        question: 'Who is the main protagonist of Attack on Titan?',
        questionbn: 'অ্যাটাক অন টাইটানের প্রধান নায়ক কে?',
        options: ['Eren Yeager', 'Mikasa Ackerman', 'Armin Arlert', 'Levi Ackerman'],
        optionsbn: ['এরেন ইয়েগার', 'মিকাসা অ্যাকারম্যান', 'আর্মিন আর্লার্ট', 'লেভি অ্যাকারম্যান'],
        correctAnswer: 0,
        explanation: 'Eren Yeager is the main protagonist of Attack on Titan.',
        explanationbn: 'এরেন ইয়েগার অ্যাটাক অন টাইটানের প্রধান নায়ক।',
        timeLimit: 30,
        difficulty: 'easy',
        category: 'anime',
        tags: ['protagonist', 'main character']
      }
    ],
    animeId: '1',
    timeLimit: 600,
    xpReward: 100,
    createdAt: new Date()
  }
];

// Enhanced question pool with comprehensive coverage
const enhancedQuestionPool: Question[] = [
  // Easy Questions
  {
    id: 'anime_easy_1',
    question: "Who is the main character of Naruto?",
    questionbn: "নারুতোর প্রধান চরিত্র কে?",
    options: ["Sasuke Uchiha", "Naruto Uzumaki", "Sakura Haruno", "Kakashi Hatake"],
    optionsbn: ["সাসুকে উচিহা", "নারুতো উজুমাকি", "সাকুরা হারুনো", "কাকাশি হাতাকে"],
    correctAnswer: 1,
    explanation: "Naruto Uzumaki is the titular protagonist of the Naruto series.",
    explanationbn: "নারুতো উজুমাকি নারুতো সিরিজের প্রধান চরিত্র।",
    timeLimit: 30,
    difficulty: 'easy',
    category: 'anime',
    tags: ['naruto', 'shounen', 'ninja']
  },
  {
    id: 'anime_easy_2',
    question: "What is the name of the most famous anime studio?",
    questionbn: "সবচেয়ে বিখ্যাত অ্যানিমে স্টুডিওর নাম কী?",
    options: ["Studio Ghibli", "Toei Animation", "Madhouse", "Pierrot"],
    optionsbn: ["স্টুডিও গিবলি", "তোয়েই অ্যানিমেশন", "ম্যাডহাউস", "পিয়েরট"],
    correctAnswer: 0,
    explanation: "Studio Ghibli is one of the most internationally recognized anime studios.",
    explanationbn: "স্টুডিও গিবলি আন্তর্জাতিকভাবে সবচেয়ে স্বীকৃত অ্যানিমে স্টুডিওগুলির মধ্যে একটি।",
    timeLimit: 30,
    difficulty: 'easy',
    category: 'anime',
    tags: ['studio', 'ghibli', 'animation']
  }
];

export { enhancedQuestionPool };
// Add this to your existing src/lib/mockData.ts file
// Just add these functions at the end of your mockData.ts file

// Helper functions that were missing
export const getAnimeById = (id: string): Anime | undefined => {
  return mockAnimes.find(anime => anime.id === id);
};

export const getMangaById = (id: string): Manga | undefined => {
  return mockMangas.find(manga => manga.id === id);
};

export const getQuizById = (id: string): Quiz | undefined => {
  return mockQuizzes.find(quiz => quiz.id === id);
};

export const searchAnimes = (query: string): Anime[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockAnimes.filter(anime => 
    anime.title.toLowerCase().includes(lowercaseQuery) ||
    anime.titlebn.toLowerCase().includes(lowercaseQuery) ||
    anime.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery)) ||
    anime.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const searchMangas = (query: string): Manga[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockMangas.filter(manga => 
    manga.title.toLowerCase().includes(lowercaseQuery) ||
    manga.titlebn.toLowerCase().includes(lowercaseQuery) ||
    manga.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery)) ||
    manga.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAnimesByGenre = (genre: string): Anime[] => {
  return mockAnimes.filter(anime => 
    anime.genres.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

export const getMangasByGenre = (genre: string): Manga[] => {
  return mockMangas.filter(manga => 
    manga.genres.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

export const getTrendingAnimes = (limit: number = 10): Anime[] => {
  return mockAnimes
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getTrendingMangas = (limit: number = 10): Manga[] => {
  return mockMangas
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};