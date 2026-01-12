// Quick test script to verify Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Required: SUPABASE_URL and SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔗 Testing Supabase connection...');
console.log('📊 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by querying a table
supabase
  .from('leaderboard')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Tables not created yet. Run the SQL schema in Supabase SQL Editor.');
        console.log('   See: backend/supabase-schema.sql');
      } else {
        console.error('❌ Connection error:', error.message);
        console.error('   Code:', error.code);
        process.exit(1);
      }
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Database is ready to use.');
    }
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
