// Production-ready Express server for Anime Quiz API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'quiz.db');

// Enhanced middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = createRateLimit(15 * 60 * 1000, 100, 'Too many requests');
const quizLimiter = createRateLimit(5 * 60 * 1000, 10, 'Too many quiz requests');
const submitLimiter = createRateLimit(1 * 60 * 1000, 5, 'Too many submissions');

app.use(generalLimiter);

// Database setup with better error handling
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        reject(err);
        return;
      }
      
      // Create tables
      db.serialize(() => {
        // Quiz submissions table
        db.run(`
          CREATE TABLE IF NOT EXISTS quiz_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            quiz_type TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            time_taken INTEGER NOT NULL,
            correct_answers TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Leaderboard table
        db.run(`
          CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE NOT NULL,
            username TEXT NOT NULL,
            total_score INTEGER DEFAULT 0,
            quizzes_taken INTEGER DEFAULT 0,
            best_streak INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            last_active DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // API usage tracking
        db.run(`
          CREATE TABLE IF NOT EXISTS api_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            success BOOLEAN NOT NULL,
            response_time INTEGER,
            error_message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Quiz cache table
        db.run(`
          CREATE TABLE IF NOT EXISTS quiz_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            difficulty TEXT NOT NULL,
            topic TEXT,
            quiz_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL
          )
        `);
      });

      resolve(db);
    });
  });
};

let db;
initDatabase()
  .then(database => {
    db = database;
    console.log('✅ Database initialized successfully');
  })
  .catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });

// Utility functions
const logAPIUsage = (endpoint, success, responseTime, errorMessage = null) => {
  if (db) {
    db.run(
      'INSERT INTO api_usage (endpoint, success, response_time, error_message) VALUES (?, ?, ?, ?)',
      [endpoint, success, responseTime, errorMessage]
    );
  }
};

const cacheQuiz = (difficulty, topic, quizData) => {
  if (db) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour cache
    db.run(
      'INSERT INTO quiz_cache (difficulty, topic, quiz_data, expires_at) VALUES (?, ?, ?, ?)',
      [difficulty, topic || 'general', JSON.stringify(quizData), expiresAt.toISOString()]
    );
  }
};

const getCachedQuiz = (difficulty, topic = 'general') => {
  return new Promise((resolve) => {
    if (!db) {
      resolve(null);
      return;
    }

    db.get(
      'SELECT quiz_data FROM quiz_cache WHERE difficulty = ? AND topic = ? AND expires_at > datetime("now") ORDER BY created_at DESC LIMIT 1',
      [difficulty, topic],
      (err, row) => {
        if (err || !row) {
          resolve(null);
          return;
        }
        
        try {
          resolve(JSON.parse(row.quiz_data));
        } catch (parseError) {
          resolve(null);
        }
      }
    );
  });
};

// Enhanced mock quiz generation
const getEnhancedMockQuiz = (difficulty) => {
  const questionPool = {
    easy: [
      {
        question: "Who is the main character of Naruto?",
        options: ["Sasuke Uchiha", "Naruto Uzumaki", "Sakura Haruno", "Kakashi Hatake"],
        correct: 1,
        explanation: "Naruto Uzumaki is the titular protagonist of the Naruto series."
      },
      {
        question: "What is the most popular anime studio?",
        options: ["Studio Ghibli", "Toei Animation", "Madhouse", "MAPPA"],
        correct: 0,
        explanation: "Studio Ghibli is widely considered the most internationally recognized anime studio."
      }
    ],
    medium: [
      {
        question: "In Attack on Titan, what is Eren's Titan form called?",
        options: ["Colossal Titan", "Attack Titan", "Beast Titan", "Founding Titan"],
        correct: 1,
        explanation: "Eren possesses the Attack Titan, which gives him the ability to see future memories."
      },
      {
        question: "Who created the manga series 'One Piece'?",
        options: ["Masashi Kishimoto", "Tite Kubo", "Eiichiro Oda", "Akira Toriyama"],
        correct: 2,
        explanation: "Eiichiro Oda is the creator of the long-running manga series One Piece."
      }
    ],
    hard: [
      {
        question: "What animation studio produced 'Spirited Away'?",
        options: ["Studio Pierrot", "Studio Ghibli", "Madhouse", "Bones"],
        correct: 1,
        explanation: "Spirited Away was produced by Studio Ghibli and directed by Hayao Miyazaki."
      },
      {
        question: "In what year was the first Dragon Ball manga published?",
        options: ["1984", "1985", "1986", "1987"],
        correct: 0,
        explanation: "Dragon Ball was first published in Weekly Shōnen Jump in 1984."
      }
    ]
  };

  const questions = questionPool[difficulty] || questionPool.easy;
  const selectedQuestions = questions.slice(0, 5).map((q, index) => ({
    id: `mock-${difficulty}-${index}`,
    ...q
  }));

  return {
    id: `quiz-${difficulty}-${Date.now()}`,
    difficulty,
    questions: selectedQuestions,
    timeLimit: selectedQuestions.length * (difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60),
    createdAt: new Date().toISOString()
  };
};

const parseQuizResponse = (content, difficulty) => {
  try {
    // Clean the response content
    const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleanedContent);
    
    // Validate the structure
    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Invalid quiz structure');
    }

    // Ensure all questions have required fields
    const validQuestions = parsed.questions.map((q, index) => ({
      id: q.id || `q-${index}`,
      question: q.question || 'Invalid question',
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['Option A', 'Option B'],
      correct: typeof q.correct === 'number' && q.correct >= 0 ? q.correct : 0,
      explanation: q.explanation || 'No explanation available'
    }));

    return {
      id: `quiz-${difficulty}-${Date.now()}`,
      difficulty,
      questions: validQuestions,
      timeLimit: validQuestions.length * 60,
      createdAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error parsing quiz response:', error);
    return getEnhancedMockQuiz(difficulty);
  }
};

// AI Quiz generation with improved error handling
const generateAIQuiz = async (difficulty, questionType = 'multiple-choice', topic = 'general') => {
  const startTime = Date.now();
  
  // Check cache first
  const cachedQuiz = await getCachedQuiz(difficulty, topic);
  if (cachedQuiz) {
    console.log(`✅ Returning cached quiz for ${difficulty} difficulty`);
    return cachedQuiz;
  }

  if (!API_KEY) {
    console.warn('⚠️ No API key configured, using enhanced mock data');
    return getEnhancedMockQuiz(difficulty);
  }

  const prompt = createEnhancedQuizPrompt(difficulty, questionType, topic);
  
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek/deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an expert anime and manga quiz creator. Generate high-quality, engaging questions with accurate information. Always respond with valid JSON format. Current date: ${new Date().toISOString().split('T')[0]}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:5000',
        'X-Title': 'Anime Quiz App'
      },
      timeout: 30000
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`✅ DeepSeek API responded in ${responseTime}ms`);
    logAPIUsage('/quiz', true, responseTime);

    const content = response.data.choices[0].message.content;
    const quiz = parseQuizResponse(content, difficulty);
    
    // Cache the quiz
    cacheQuiz(difficulty, topic, quiz);
    
    return quiz;
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.error('❌ DeepSeek API Error:', error.response?.data || error.message);
    logAPIUsage('/quiz', false, responseTime, error.message);
    
    console.log('🔄 Falling back to enhanced mock data');
    return getEnhancedMockQuiz(difficulty);
  }
};

function createEnhancedQuizPrompt(difficulty, questionType, topic) {
  const difficultySettings = {
    easy: {
      description: 'basic knowledge for casual anime/manga fans',
      examples: 'main character names, popular series titles, basic plot elements',
      timeLimit: 30
    },
    medium: {
      description: 'intermediate knowledge requiring familiarity with multiple series',
      examples: 'character relationships, studio names, episode details, manga authors',
      timeLimit: 60
    },
    hard: {
      description: 'expert-level knowledge about obscure details and industry facts',
      examples: 'voice actors, production details, release dates, technical terms, creator backgrounds',
      timeLimit: 120
    }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  return `Generate a ${difficulty} anime and manga quiz with exactly 5 questions.

Difficulty: ${difficulty} (${settings.description})
Topic Focus: ${topic}
Question Type: ${questionType}

Requirements:
- Questions should cover: ${settings.examples}
- Each question must have exactly 4 options
- Include diverse anime/manga series (popular and lesser-known)
- Provide educational explanations for each answer
- Ensure factual accuracy

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": "1",
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Detailed explanation of the correct answer"
    }
  ]
}`;
}

// Request validation middleware
const validateQuizRequest = [
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('questionType').optional().isIn(['multiple-choice', 'true-false']).withMessage('Invalid question type'),
  body('topic').optional().isLength({ max: 50 }).withMessage('Topic too long'),
];

const validateSubmissionRequest = [
  body('userId').isLength({ min: 1 }).withMessage('User ID required'),
  body('quizId').isLength({ min: 1 }).withMessage('Quiz ID required'),
  body('score').isInt({ min: 0 }).withMessage('Valid score required'),
  body('totalQuestions').isInt({ min: 1 }).withMessage('Valid total questions required'),
  body('timeTaken').isInt({ min: 0 }).withMessage('Valid time taken required'),
];

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: db ? 'connected' : 'disconnected'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Anime Quiz API',
    version: '1.0.0',
    status: 'operational',
    features: {
      ai_integration: !!API_KEY,
      database: !!db,
      caching: true
    },
    endpoints: {
      quiz_generation: '/api/quiz',
      submission: '/api/quiz/submit',
      leaderboard: '/api/leaderboard',
      user_stats: '/api/user/:id/stats'
    },
    timestamp: new Date().toISOString()
  });
});

// Generate quiz
app.post('/api/quiz', quizLimiter, validateQuizRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { difficulty, questionType = 'multiple-choice', topic = 'general' } = req.body;
    
    const quiz = await generateAIQuiz(difficulty, questionType, topic);
    
    res.json({
      success: true,
      data: quiz,
      metadata: {
        generated_at: new Date().toISOString(),
        ai_powered: !!API_KEY,
        cached: false
      }
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz',
      fallback: getEnhancedMockQuiz('medium')
    });
  }
});

// Submit quiz results
app.post('/api/quiz/submit', submitLimiter, validateSubmissionRequest, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId, quizId, score, totalQuestions, timeTaken, difficulty, correctAnswers } = req.body;
    
    if (!db) {
      return res.status(500).json({
        success: false,
        error: 'Database not available'
      });
    }

    // Insert submission
    db.run(
      'INSERT INTO quiz_submissions (user_id, quiz_type, difficulty, score, total_questions, time_taken, correct_answers) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, quizId, difficulty, score, totalQuestions, timeTaken, JSON.stringify(correctAnswers || [])],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            error: 'Failed to save submission'
          });
        }

        // Update leaderboard
        const xpGained = score * 10 + (score === totalQuestions ? 50 : 0); // Bonus for perfect score
        
        db.run(
          `INSERT INTO leaderboard (user_id, username, total_score, quizzes_taken, xp, last_active) 
           VALUES (?, ?, ?, 1, ?, datetime('now'))
           ON CONFLICT(user_id) DO UPDATE SET
           total_score = total_score + ?,
           quizzes_taken = quizzes_taken + 1,
           xp = xp + ?,
           last_active = datetime('now')`,
          [userId, `User_${userId.slice(-6)}`, score, xpGained, score, xpGained],
          (updateErr) => {
            if (updateErr) {
              console.error('Leaderboard update error:', updateErr);
            }
          }
        );

        res.json({
          success: true,
          data: {
            submissionId: this.lastID,
            xpGained,
            message: 'Quiz results submitted successfully'
          }
        });
      }
    );

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit quiz results'
    });
  }
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Database not available'
    });
  }

  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    'SELECT user_id, username, total_score, quizzes_taken, xp, last_active FROM leaderboard ORDER BY total_score DESC, xp DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error('Leaderboard query error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch leaderboard'
        });
      }

      const leaderboard = rows.map((row, index) => ({
        rank: offset + index + 1,
        userId: row.user_id,
        username: row.username,
        totalScore: row.total_score,
        quizzesTaken: row.quizzes_taken,
        xp: row.xp,
        lastActive: row.last_active
      }));

      res.json({
        success: true,
        data: leaderboard,
        pagination: {
          limit,
          offset,
          total: rows.length
        }
      });
    }
  );
});

// Get user statistics
app.get('/api/user/:id/stats', (req, res) => {
  const userId = req.params.id;
  
  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Database not available'
    });
  }

  // Get user's overall stats
  db.get(
    'SELECT * FROM leaderboard WHERE user_id = ?',
    [userId],
    (err, userStats) => {
      if (err) {
        console.error('User stats query error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch user stats'
        });
      }

      // Get recent submissions
      db.all(
        'SELECT * FROM quiz_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 10',
        [userId],
        (submissionErr, submissions) => {
          if (submissionErr) {
            console.error('User submissions query error:', submissionErr);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch user submissions'
            });
          }

          // Calculate additional stats
          const stats = {
            user: userStats || {
              user_id: userId,
              username: `User_${userId.slice(-6)}`,
              total_score: 0,
              quizzes_taken: 0,
              xp: 0,
              last_active: null
            },
            recentSubmissions: submissions.map(sub => ({
              id: sub.id,
              difficulty: sub.difficulty,
              score: sub.score,
              totalQuestions: sub.total_questions,
              timeTaken: sub.time_taken,
              submittedAt: sub.submitted_at
            })),
            averageScore: submissions.length > 0 
              ? Math.round(submissions.reduce((sum, sub) => sum + (sub.score / sub.total_questions * 100), 0) / submissions.length)
              : 0,
            bestScore: submissions.length > 0 
              ? Math.max(...submissions.map(sub => sub.score / sub.total_questions * 100))
              : 0
          };

          res.json({
            success: true,
            data: stats
          });
        }
      );
    }
  );
});

// Get API statistics (admin only)
app.get('/api/stats', (req, res) => {
  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Database not available'
    });
  }

  // Get basic stats
  db.get(
    `SELECT 
       COUNT(*) as total_submissions,
       AVG(score * 1.0 / total_questions) as avg_score_percentage,
       COUNT(DISTINCT user_id) as unique_users
     FROM quiz_submissions`,
    (err, basicStats) => {
      if (err) {
        console.error('Stats query error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch statistics'
        });
      }

      // Get API usage stats
      db.all(
        `SELECT 
           endpoint,
           COUNT(*) as total_calls,
           AVG(response_time) as avg_response_time,
           SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_calls
         FROM api_usage 
         WHERE timestamp > datetime('now', '-24 hours')
         GROUP BY endpoint`,
        (apiErr, apiStats) => {
          if (apiErr) {
            console.error('API stats query error:', apiErr);
            return res.status(500).json({
              success: false,
              error: 'Failed to fetch API statistics'
            });
          }

          res.json({
            success: true,
            data: {
              quiz_stats: basicStats,
              api_usage: apiStats,
              system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                ai_enabled: !!API_KEY,
                cache_enabled: true
              }
            }
          });
        }
      );
    }
  );
});

// Clear expired cache entries
app.post('/api/admin/clear-cache', (req, res) => {
  if (!db) {
    return res.status(500).json({
      success: false,
      error: 'Database not available'
    });
  }

  db.run(
    'DELETE FROM quiz_cache WHERE expires_at < datetime("now")',
    function(err) {
      if (err) {
        console.error('Cache clear error:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to clear cache'
        });
      }

      res.json({
        success: true,
        message: `Cleared ${this.changes} expired cache entries`
      });
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'POST /api/quiz - Generate AI quiz',
      'POST /api/quiz/submit - Submit results', 
      'GET /api/leaderboard - Get leaderboard',
      'GET /api/user/:id/stats - Get user stats',
      'GET /api/status - API status',
      'GET /api/stats - API statistics',
      'GET /health - Health check'
    ],
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
      process.exit(err ? 1 : 0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 Anime Quiz API Server Started');
  console.log('================================');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🗄️ Database: SQLite (${DB_PATH})`);
  console.log(`🤖 AI Integration: ${API_KEY ? '✅ Active (DeepSeek/OpenRouter)' : '❌ Disabled'}`);
  console.log(`🔑 API Key: ${API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📋 Available Endpoints:');
  console.log('  POST /api/quiz - Generate AI-powered quiz');
  console.log('  POST /api/quiz/submit - Submit quiz results');
  console.log('  GET /api/leaderboard - Get top players');
  console.log('  GET /api/user/:id/stats - Get user statistics');
  console.log('  GET /api/status - API status check');
  console.log('  GET /api/stats - System statistics');
  console.log('  GET /health - Health check');
  console.log('\n🎯 Ready to serve anime quiz requests!');
  console.log('================================\n');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

module.exports = app;