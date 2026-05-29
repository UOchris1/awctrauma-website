import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Usage: node scripts/set_rib_image.mjs /flowcharts/v2/cts_rib_fracture_v3.png
// Revert: node scripts/set_rib_image.mjs /flowcharts/v2/cts_rib_fracture.png
const image_url = process.argv[2];
if (!image_url) {
  console.error('Usage: node scripts/set_rib_image.mjs <image_url>');
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

const id = '86320e9c-722b-4bce-adb6-4c2e1a08b0f8'; // Rib Fracture
const { data, error } = await db.from('algorithms').update({ image_url }).eq('id', id).select('short_title,image_url').single();
if (error) {
  console.log('FAIL', error.message);
  process.exit(1);
}
console.log('OK', data.short_title, '->', data.image_url);
