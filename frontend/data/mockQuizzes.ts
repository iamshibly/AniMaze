// src/data/mockQuizzes.ts
import { Question, Quiz } from '../types/quiz';

export const mockQuestions: Question[] = [
  // Easy Questions
  {
    id: '1',
    type: 'mcq',
    difficulty: 'easy',
    question: "Who is the main protagonist of the anime 'One Piece'?",
    options: ['Monkey D. Luffy', 'Roronoa Zoro', 'Nami', 'Sanji'],
    correctAnswer: 0,
    explanation: "Monkey D. Luffy is the main character and captain of the Straw Hat Pirates.",
    timeLimit: 30
  },
  {
    id: '2',
    type: 'true-false',
    difficulty: 'easy',
    question: "Naruto Uzumaki wants to become the Hokage of the Hidden Leaf Village.",
    correctAnswer: 1,
    explanation: "True! Naruto's dream is to become Hokage and be acknowledged by everyone.",
    timeLimit: 20
  },
  {
    id: '3',
    type: 'mcq',
    difficulty: 'easy',
    question: "What color is Luffy's straw hat in One Piece?",
    options: ['Brown', 'Yellow', 'Blue', 'Red'],
    correctAnswer: 1,
    explanation: "Luffy's iconic straw hat is yellow/blonde in color.",
    timeLimit: 20
  },
  {
    id: '4',
    type: 'true-false',
    difficulty: 'easy',
    question: "In My Hero Academia, Deku's real name is Izuku Midoriya.",
    correctAnswer: 1,
    explanation: "True! Deku is the hero name of Izuku Midoriya.",
    timeLimit: 20
  },
  {
    id: '5',
    type: 'mcq',
    difficulty: 'easy',
    question: "What type of food does Goku love most in Dragon Ball?",
    options: ['Ramen', 'Sushi', 'Rice', 'Any food'],
    correctAnswer: 3,
    explanation: "Goku loves all types of food and has an enormous appetite!",
    timeLimit: 25
  },

  // Medium Questions
  {
    id: '6',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of Light Yagami's Shinigami in Death Note?",
    options: ['Rem', 'Ryuk', 'Misa', 'L'],
    correctAnswer: 1,
    explanation: "Ryuk is the Shinigami who dropped his Death Note into the human world.",
    timeLimit: 30
  },
  {
    id: '7',
    type: 'fill-blank',
    difficulty: 'medium',
    question: "In Tokyo Ghoul, the main character Ken Kaneki becomes a half-_____.",
    correctAnswer: "ghoul",
    explanation: "Ken Kaneki becomes a half-ghoul after an encounter with Rize Kamishiro.",
    timeLimit: 30
  },
  {
    id: '8',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of the organization that Itachi belongs to in Naruto?",
    options: ['Akatsuki', 'Root', 'ANBU', 'Sound Four'],
    correctAnswer: 0,
    explanation: "Itachi is a member of the Akatsuki organization.",
    timeLimit: 30
  },
  {
    id: '9',
    type: 'true-false',
    difficulty: 'medium',
    question: "In Dragon Ball Z, Goku is originally from planet Earth.",
    correctAnswer: 0,
    explanation: "False! Goku is a Saiyan from planet Vegeta, sent to Earth as a baby.",
    timeLimit: 25
  },
  {
    id: '10',
    type: 'number',
    difficulty: 'medium',
    question: "How many Titan Shifters are there in Attack on Titan?",
    correctAnswer: 9,
    explanation: "There are nine Titan Shifters known as the Nine Titans in Attack on Titan.",
    timeLimit: 30
  },

  // Hard Questions
  {
    id: '11',
    type: 'fill-blank',
    difficulty: 'hard',
    question: "In Attack on Titan, the main character Eren Yeager lives in the _____ District of Wall Maria.",
    correctAnswer: "Shiganshina",
    explanation: "Eren lives in Shiganshina District, which was breached by the Colossal Titan.",
    timeLimit: 45
  },
  {
    id: '12',
    type: 'mcq',
    difficulty: 'hard',
    question: "In Jujutsu Kaisen, what is Yuji Itadori's cursed technique called?",
    options: ['Divergent Fist', 'Black Flash', 'Shrine', 'Blood Manipulation'],
    correctAnswer: 2,
    explanation: "Yuji inherits Sukuna's cursed technique called 'Shrine' which includes Cleave and Dismantle.",
    timeLimit: 35
  },
  {
    id: '13',
    type: 'fill-blank',
    difficulty: 'hard',
    question: "In Fullmetal Alchemist, the first law of alchemy is: 'To obtain something, something of _____ value must be lost.'",
    correctAnswer: "equal",
    explanation: "The Law of Equivalent Exchange states that to obtain something, something of equal value must be lost.",
    timeLimit: 45
  },
  {
    id: '14',
    type: 'mcq',
    difficulty: 'hard',
    question: "In Hunter x Hunter, what is Gon's father's name?",
    options: ['Ging Freecss', 'Silva Zoldyck', 'Isaac Netero', 'Leorio Paradinight'],
    correctAnswer: 0,
    explanation: "Ging Freecss is Gon's father and a legendary Hunter.",
    timeLimit: 30
  },
  {
    id: '15',
    type: 'multiple-select',
    difficulty: 'hard',
    question: "Which of these characters can use the Sharingan? (Select all that apply)",
    options: ['Sasuke Uchiha', 'Naruto Uzumaki', 'Itachi Uchiha', 'Sakura Haruno', 'Kakashi Hatake'],
    correctAnswer: [0, 2, 4], // Sasuke, Itachi, Kakashi
    explanation: "Sasuke and Itachi are Uchiha clan members with natural Sharingan, while Kakashi received his from Obito.",
    timeLimit: 35
  },

  // Additional variety questions
  {
    id: '16',
    type: 'ranking',
    difficulty: 'hard',
    question: "Rank these anime by their release year (earliest to latest):",
    options: ['Dragon Ball', 'Naruto', 'Attack on Titan', 'Demon Slayer'],
    correctAnswer: [0, 1, 2, 3], // Dragon Ball (1986), Naruto (2002), AoT (2013), Demon Slayer (2019)
    explanation: "Dragon Ball started in 1986, Naruto in 2002, Attack on Titan in 2013, and Demon Slayer in 2019.",
    timeLimit: 45
  },
  {
    id: '17',
    type: 'multiple-select',
    difficulty: 'medium',
    question: "Which of these are Studio Ghibli films? (Select all that apply)",
    options: ['Spirited Away', 'Your Name', 'Princess Mononoke', 'Akira', 'My Neighbor Totoro'],
    correctAnswer: [0, 2, 4], // Spirited Away, Princess Mononoke, My Neighbor Totoro
    explanation: "Studio Ghibli created Spirited Away, Princess Mononoke, and My Neighbor Totoro. Your Name was by CoMix Wave Films, and Akira by TMS Entertainment.",
    timeLimit: 40
  },
  {
    id: '18',
    type: 'number',
    difficulty: 'hard',
    question: "How many Dragon Balls are needed to summon Shenron?",
    correctAnswer: 7,
    explanation: "Seven Dragon Balls are required to summon the eternal dragon Shenron.",
    timeLimit: 25
  },
  {
    id: '19',
    type: 'mcq',
    difficulty: 'medium',
    question: "What is the name of the virtual reality game in Sword Art Online?",
    options: ['ALfheim Online', 'Sword Art Online', 'Gun Gale Online', 'Underworld'],
    correctAnswer: 1,
    explanation: "The first virtual reality MMORPG that trapped players was called Sword Art Online.",
    timeLimit: 25
  },
  {
    id: '20',
    type: 'fill-blank',
    difficulty: 'easy',
    question: "In Pokémon, Pikachu is an _____ type Pokémon.",
    correctAnswer: "electric",
    explanation: "Pikachu is an Electric-type Pokémon known for its lightning attacks.",
    timeLimit: 20
  }
];

// Track used questions to prevent repetition across sessions
const getUsedQuestionIds = (): Set<string> => {
  const stored = localStorage.getItem('usedQuestionIds');
  return stored ? new Set(JSON.parse(stored)) : new Set();
};

const saveUsedQuestionIds = (usedIds: Set<string>) => {
  localStorage.setItem('usedQuestionIds', JSON.stringify(Array.from(usedIds)));
};

export const generateMockQuiz = (difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Quiz => {
  const usedQuestionIds = getUsedQuestionIds();
  
  // Filter questions by difficulty and availability
  let availableQuestions = mockQuestions.filter(q => 
    q.difficulty === difficulty && !usedQuestionIds.has(q.id)
  );
  
  // If we don't have enough unused questions of the target difficulty, 
  // include other difficulties or reset the used questions
  if (availableQuestions.length < count) {
    console.log(`Not enough unused ${difficulty} questions, including other difficulties`);
    
    // Try to get more questions from other difficulties
    const otherDifficultyQuestions = mockQuestions.filter(q => 
      q.difficulty !== difficulty && !usedQuestionIds.has(q.id)
    );
    
    availableQuestions = [...availableQuestions, ...otherDifficultyQuestions];
    
    // If still not enough, reset the used questions for this difficulty
    if (availableQuestions.length < count) {
      console.log('Resetting used questions to provide fresh content');
      const resetQuestions = mockQuestions.filter(q => q.difficulty === difficulty);
      availableQuestions = [...availableQuestions, ...resetQuestions];
      
      // Clear used IDs for this difficulty
      mockQuestions.forEach(q => {
        if (q.difficulty === difficulty) {
          usedQuestionIds.delete(q.id);
        }
      });
    }
  }
  
  // Shuffle and select questions
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length)).map((question, index) => {
    // Mark this question as used
    usedQuestionIds.add(question.id);
    
    return {
      ...question,
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    };
  });
  
  // Save updated used questions
  saveUsedQuestionIds(usedQuestionIds);
  
  // If we still don't have enough questions, pad with random ones
  while (selectedQuestions.length < count && mockQuestions.length > 0) {
    const randomQuestion = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
    selectedQuestions.push({
      ...randomQuestion,
      id: `${Date.now()}-extra-${selectedQuestions.length}-${Math.random().toString(36).substr(2, 9)}`
    });
  }
  
  return {
    id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    questions: selectedQuestions,
    difficulty,
    timeLimit: selectedQuestions.reduce((total, q) => total + q.timeLimit, 0),
    createdAt: new Date()
  };
};

// Export additional utility functions
export const getRandomQuestion = (difficulty?: 'easy' | 'medium' | 'hard'): Question => {
  const filtered = difficulty 
    ? mockQuestions.filter(q => q.difficulty === difficulty)
    : mockQuestions;
  
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getQuestionsByType = (type: Question['type']): Question[] => {
  return mockQuestions.filter(q => q.type === type);
};

export const getQuestionStats = () => {
  const stats = {
    total: mockQuestions.length,
    byDifficulty: {
      easy: mockQuestions.filter(q => q.difficulty === 'easy').length,
      medium: mockQuestions.filter(q => q.difficulty === 'medium').length,
      hard: mockQuestions.filter(q => q.difficulty === 'hard').length
    },
    byType: {
      mcq: mockQuestions.filter(q => q.type === 'mcq').length,
      'true-false': mockQuestions.filter(q => q.type === 'true-false').length,
      'fill-blank': mockQuestions.filter(q => q.type === 'fill-blank').length,
      'multiple-select': mockQuestions.filter(q => q.type === 'multiple-select').length,
      'ranking': mockQuestions.filter(q => q.type === 'ranking').length,
      'number': mockQuestions.filter(q => q.type === 'number').length,
      'image-based': mockQuestions.filter(q => q.type === 'image-based').length
    }
  };
  
  return stats;
};