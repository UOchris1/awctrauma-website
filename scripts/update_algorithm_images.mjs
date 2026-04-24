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

const updates = [
  { id: '86320e9c-722b-4bce-adb6-4c2e1a08b0f8', short_title: 'Rib Fracture',         image_url: '/flowcharts/v2/cwits_rib_fracture.png' },
  { id: '72fbcb59-ef1d-4bc6-b69e-ad959ae3ec9a', short_title: 'VTE Prophylaxis',      image_url: '/flowcharts/v2/vte_chart.png' },
  { id: 'a94b0d43-5cee-442e-828e-93af585a128f', short_title: 'Pelvic Fracture',      image_url: '/flowcharts/v2/pelvic_fracture.png' },
  { id: 'b7905cca-7393-463e-a3ee-59b753dd7407', short_title: 'BCVI',                 image_url: '/flowcharts/v2/bcvi_screening.png' },
  { id: 'e6a8abce-cc96-44fe-bec1-5dba7ad37c9b', short_title: 'Spleen',               image_url: '/flowcharts/v2/splenic_nom.png' },
  { id: 'd32eedab-97a6-4d47-8fbd-3a991cb7e772', short_title: 'Liver',                image_url: '/flowcharts/v2/hepatic_nom.png' },
  { id: 'f7affe1f-0860-41b9-b623-35d8643bdcfc', short_title: 'Kidney',               image_url: '/flowcharts/v2/renal_management.png' },
  { id: '837537ec-084e-41d8-b3ce-0a4142b4ac7a', short_title: 'Airway',               image_url: '/flowcharts/v2/difficult_airway.png' },
  { id: 'd5d1fb8f-ce70-435f-ac45-6ccc5d3d7417', short_title: 'Adrenal Insufficiency',image_url: '/flowcharts/v2/circi_algorithm.png' },
  { id: 'e42fb601-6237-4394-b5e9-45c230b7d46e', short_title: 'Brain Injury (BIG)',   image_url: '/flowcharts/v2/big_classification.png' },
  { id: '7e9b7225-6edb-4f74-95f6-fb1de313fef9', short_title: 'Spinal Cord Injury',   image_url: '/flowcharts/v2/sci_algorithm.png' },
  { id: 'f2b73229-5870-41fa-b0a4-dab23bd4c6e6', short_title: 'Older Adult Trauma',   image_url: '/flowcharts/v2/geriatric_algorithm.png' },
  { id: '93530fa9-7bdb-4a99-b050-9ec0265fd29c', short_title: 'Open Fracture ABx',    image_url: '/flowcharts/v2/open_fracture_abx.png' },
];

let ok = 0, fail = 0;
for (const u of updates) {
  const { error } = await db.from('algorithms').update({ image_url: u.image_url }).eq('id', u.id);
  if (error) {
    console.log(`FAIL  ${u.short_title.padEnd(24)} ${error.message}`);
    fail++;
  } else {
    console.log(`OK    ${u.short_title.padEnd(24)} -> ${u.image_url}`);
    ok++;
  }
}
console.log(`\nDone: ${ok} OK, ${fail} failed.`);
process.exit(fail ? 1 : 0);
