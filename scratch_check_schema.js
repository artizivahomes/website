const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function checkSchema() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=').map(s => s.trim())));
  
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log("Checking columns for 'orders' table...");
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'orders' });
  
  if (error) {
    // If RPC doesn't exist, try a simple select to see keys
    console.log("RPC failed, trying a simple select...");
    const { data: sample, error: selectError } = await supabase.from('orders').select('*').limit(1);
    if (selectError) {
      console.error("Error fetching sample:", selectError.message);
    } else if (sample && sample.length > 0) {
      console.log("Columns found in existing record:", Object.keys(sample[0]));
    } else {
      console.log("No records found to check columns.");
      // Last resort: check information_schema via a trick if possible, or just assume mismatch
    }
  } else {
    console.log("Columns:", data);
  }
}

checkSchema();
