-- FIX FOR PRODUCTION YOUTUBE LINKS SAVE ISSUE
-- =============================================
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- 
-- Problem: Row Level Security (RLS) is blocking INSERT/UPDATE operations
-- when using the anon key in production.
--
-- Solution: Either disable RLS OR create permissive policies.

-- OPTION 1: Disable RLS (Simplest - allows all operations)
-- =========================================================
-- Use this if you don't need row-level access control
ALTER TABLE anime_youtube_links DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Enable RLS with permissive policies (More secure)
-- ============================================================
-- Use this if you want to enable RLS but allow public access
-- Uncomment the lines below if you want to use this approach instead of Option 1

-- -- First, enable RLS
-- ALTER TABLE anime_youtube_links ENABLE ROW LEVEL SECURITY;
-- 
-- -- Allow anyone to SELECT (read) links
-- CREATE POLICY "Allow public read access" ON anime_youtube_links
--     FOR SELECT USING (true);
-- 
-- -- Allow anyone to INSERT (create) links
-- CREATE POLICY "Allow public insert access" ON anime_youtube_links
--     FOR INSERT WITH CHECK (true);
-- 
-- -- Allow anyone to UPDATE (modify) links
-- CREATE POLICY "Allow public update access" ON anime_youtube_links
--     FOR UPDATE USING (true) WITH CHECK (true);
-- 
-- -- Allow anyone to DELETE links
-- CREATE POLICY "Allow public delete access" ON anime_youtube_links
--     FOR DELETE USING (true);

-- VERIFY THE TABLE EXISTS AND HAS CORRECT STRUCTURE
-- ==================================================
-- Run this to check your table structure:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'anime_youtube_links';

-- CHECK CURRENT RLS STATUS
-- ========================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'anime_youtube_links';

-- TEST INSERT (should work after running Option 1 or 2)
-- =====================================================
-- INSERT INTO anime_youtube_links (anime_id, youtube_url, video_id) 
-- VALUES ('test-123', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ')
-- ON CONFLICT (anime_id) DO UPDATE SET youtube_url = EXCLUDED.youtube_url, video_id = EXCLUDED.video_id;
--
-- Then delete the test:
-- DELETE FROM anime_youtube_links WHERE anime_id = 'test-123';
