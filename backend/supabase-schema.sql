-- Supabase Database Schema for Anime Quiz App
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Quiz submissions table
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  quiz_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  correct_answers JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  response_time INTEGER,
  error_message TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz cache table
CREATE TABLE IF NOT EXISTS quiz_cache (
  id BIGSERIAL PRIMARY KEY,
  difficulty TEXT NOT NULL,
  topic TEXT,
  quiz_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_user_id ON quiz_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_submitted_at ON quiz_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_xp ON leaderboard(xp DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_cache_expires_at ON quiz_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_quiz_cache_difficulty_topic ON quiz_cache(difficulty, topic);

-- Enable Row Level Security (RLS) - optional, can be disabled if you want public access
-- ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quiz_cache ENABLE ROW LEVEL SECURITY;

-- Create a function to automatically update last_active on leaderboard
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leaderboard SET last_active = NOW() WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_active when quiz is submitted
CREATE TRIGGER update_leaderboard_last_active
AFTER INSERT ON quiz_submissions
FOR EACH ROW
EXECUTE FUNCTION update_last_active();

-- Anime YouTube links table
CREATE TABLE IF NOT EXISTS anime_youtube_links (
  id BIGSERIAL PRIMARY KEY,
  anime_id TEXT UNIQUE NOT NULL,
  youtube_url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_anime_youtube_links_anime_id ON anime_youtube_links(anime_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_anime_youtube_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at when row is modified
CREATE TRIGGER update_anime_youtube_links_timestamp
BEFORE UPDATE ON anime_youtube_links
FOR EACH ROW
EXECUTE FUNCTION update_anime_youtube_links_updated_at();
