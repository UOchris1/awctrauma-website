import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const envRaw = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const env = Object.fromEntries(envRaw.split('\n').filter(l => l.includes('=')).map(l => {
  const i = l.indexOf('=');
  return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
}));

const mcpRaw = JSON.parse(fs.readFileSync(path.resolve('.mcp.json'), 'utf8'));
const SERVICE_KEY = mcpRaw.mcpServers.supabase.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = env.NEXT_PUBLIC_SUPABASE_URL;

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const { data, error } = await db.from('algorithms').select('id, title, short_title, image_url, sort_order, is_active').order('sort_order');
if (error) { console.error(error); process.exit(1); }
console.log(JSON.stringify(data, null, 2));
