// src/services/quizAPI.ts
import { Quiz, Question, GenerateQuizRequest, APIResponse } from '../types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com' 
    : 'http://localhost:3001');

class QuizAPIService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making API request to: ${url}`);
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the server on port 3001.');
      }
      
      throw error;
    }
  }

  async generateQuiz(request: GenerateQuizRequest): Promise<Quiz> {
    console.log('Generating quiz with request:', request);
    
    const quiz = await this.makeRequest<Quiz>('/api/quiz', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    // Validate quiz structure
    this.validateQuizData(quiz);
    
    return quiz;
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/api/health');
  }

  async getLeaderboard(): Promise<any[]> {
    try {
      return await this.makeRequest<any[]>('/api/leaderboard');
    } catch (error) {
      // Return local leaderboard if API fails
      const localData = localStorage.getItem('leaderboard');
      return localData ? JSON.parse(localData) : [];
    }
  }

  async submitQuizResult(result: any): Promise<void> {
    try {
      await this.makeRequest('/api/quiz/result', {
        method: 'POST',
        body: JSON.stringify(result),
      });
    } catch (error) {
      console.warn('Failed to submit quiz result to server:', error);
      // Continue silently - results are saved locally
    }
  }

  private validateQuizData(quiz: any): asserts quiz is Quiz {
    if (!quiz || typeof quiz !== 'object') {
      throw new Error('Invalid quiz data: not an object');
    }

    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      throw new Error('Invalid quiz data: questions must be an array');
    }

    if (quiz.questions.length === 0) {
      throw new Error('Invalid quiz data: no questions provided');
    }

    // Validate each question
    quiz.questions.forEach((question: any, index: number) => {
      if (!question.id || !question.type || !question.question) {
        throw new Error(`Invalid question at index ${index}: missing required fields`);
      }

      if (!['mcq', 'true-false', 'fill-blank', 'image-based', 'multiple-select', 'ranking', 'number'].includes(question.type)) {
        throw new Error(`Invalid question type at index ${index}: ${question.type}`);
      }

      if (question.type === 'mcq' && (!question.options || !Array.isArray(question.options))) {
        throw new Error(`Invalid MCQ question at index ${index}: options must be an array`);
      }

      if (question.correctAnswer === undefined || question.correctAnswer === null) {
        throw new Error(`Invalid question at index ${index}: correctAnswer is required`);
      }
    });

    console.log('Quiz validation passed');
  }
}

export const quizAPI = new QuizAPIService();

// Export types for easier imports
export type { Quiz, Question };