import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Generic Rib/algorithm image setter.
// Usage:  node scripts/set_algorithm_image.mjs <algorithm_id> <image_url>
// Example (deploy): node scripts/set_algorithm_image.mjs 93530fa9-7bdb-4a99-b050-9ec0265fd29c /flowcharts/v2/open_fracture_abx_v2.png
// Example (revert): node scripts/set_algorithm_image.mjs 93530fa9-7bdb-4a99-b050-9ec0265fd29c /flowcharts/v2/open_fracture_abx.png
const [id, image_url] = process.argv.slice(2);
if (!id || !image_url) {
  console.error('Usage: node scripts/set_algorithm_image.mjs <algorithm_id> <image_url>');
  process.exit(1);
}

const envRaw = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const env = Object.fromEntries(envRaw.split('\n').filter(l => l.includes('=')).map(l => {
  const i = l.indexOf('=');
  return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
}));

const mcpRaw = JSON.parse(fs.readFileSync(path.resolve('.mcp.json'), 'utf8'));
const SERVICE_KEY = mcpRaw.mcpServers.supabase.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = env.NEXT_PUBLIC_SUPABASE_URL;

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const { data, error } = await db.from('algorithms').update({ image_url }).eq('id', id).select('short_title,image_url').single();
if (error) {
  console.log('FAIL', error.message);
  process.exit(1);
}
console.log('OK', data.short_title, '->', data.image_url);
