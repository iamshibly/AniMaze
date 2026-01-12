// QuizAPI service for backend communication
export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'IMAGE';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  imageDescription?: string;
}

export interface Quiz {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  position: number;
  percentage: number;
}

class QuizAPI {
  private baseURL: string;

  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async generateQuiz(difficulty: string = 'Medium', topic = 'anime and manga'): Promise<{ success: boolean; quiz: Quiz; generated_by: string }> {
    return this.request('/quiz', {
      method: 'POST',
      body: JSON.stringify({ difficulty, topic })
    });
  }

  async submitQuizResult(result: any): Promise<{ success: boolean; result: QuizResult }> {
    return this.request('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(result)
    });
  }

  async getLeaderboard(): Promise<{ success: boolean; leaderboard: any[] }> {
    return this.request('/leaderboard');
  }

  async getUserStats(userId: string): Promise<{ success: boolean; user: any }> {
    return this.request(`/user/${userId}/stats`);
  }

  async getAPIStatus(): Promise<{ api_status: string; deepseek_integration: string }> {
    return this.request('/status');
  }
}

export const quizAPI = new QuizAPI();