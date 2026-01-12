# Supabase Setup Guide

This guide will help you set up Supabase to replace SQLite for the Anime Quiz backend.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "anime-quiz")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This will create:
- `quiz_submissions` - Stores quiz results
- `leaderboard` - Stores user rankings and stats
- `api_usage` - Tracks API usage
- `quiz_cache` - Caches generated quizzes

## Step 4: Configure Environment Variables

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 5: Test the Connection

1. Start your backend:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ Supabase connection successful
   🚀 Anime Quiz API Server Started
   📡 Port: 5000
   🗄️ Database: Supabase
   ```

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the SQL schema in Step 3
- Check that all tables were created in the Supabase dashboard (Table Editor)

### "Invalid API key" error
- Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Make sure you're using the **anon/public** key, not the service_role key
- Check for any extra spaces or quotes in your .env file

### Connection timeout
- Check your internet connection
- Verify the Supabase project is active (not paused)
- Check if your firewall is blocking the connection

## Migration from SQLite

If you have existing data in SQLite:

1. Export your SQLite data:
   ```bash
   sqlite3 quiz.db .dump > data_export.sql
   ```

2. Convert the SQL to PostgreSQL format (Supabase uses PostgreSQL)

3. Import into Supabase using the SQL Editor

**Note**: The schema has been updated for PostgreSQL, so you may need to adjust column types and syntax.

## Security Notes

- The `anon` key is safe to use in client-side code
- Never commit your `.env` file to version control
- For production, consider using Row Level Security (RLS) policies in Supabase
- The service_role key has admin access - keep it secret!

## Next Steps

- Set up Row Level Security policies if needed
- Configure backups in Supabase dashboard
- Monitor usage in Supabase dashboard
- Set up database functions/triggers for advanced features
