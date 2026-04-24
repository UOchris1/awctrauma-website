// Test gpt-image-2 (ChatGPT Images 2.0) on a flowchart PNG.
// Usage: node scripts/test_gpt_image.mjs <chart_basename>
//   e.g. node scripts/test_gpt_image.mjs vte_chart
// Reads OPENAI_API_KEY from .env.local. Writes result to public/flowcharts/gpt_image_test/.

import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// Load .env.local explicitly (Next.js convention; dotenv defaults to .env)
dotenv.config({ path: path.join(projectRoot, '.env.local') })

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY missing from .env.local')
  process.exit(1)
}

const arg = process.argv[2] || 'vte_chart'
const baseName = arg.replace(/_render(\.png)?$/, '').replace(/\.png$/, '')
const inputPath = path.join(projectRoot, 'public', 'flowcharts', 'd2', `${baseName}_render.png`)

if (!fs.existsSync(inputPath)) {
  console.error(`Source PNG not found: ${inputPath}`)
  process.exit(1)
}

const outDir = path.join(projectRoot, 'public', 'flowcharts', 'gpt_image_test')
fs.mkdirSync(outDir, { recursive: true })

const prompt = [
  'Make this medical clinical algorithm flowchart look more professional and polished.',
  '',
  'CRITICAL ACCURACY REQUIREMENTS (do NOT violate any of these):',
  '- Reproduce EVERY piece of text EXACTLY as it appears in the source — letter for letter, number for number',
  '- Do NOT change any drug name, dose, weight band, time window, threshold, grade, or abbreviation',
  '- Do NOT invent or "improve" any clinical content — this is a hospital protocol, errors can harm patients',
  '- If you cannot read a piece of text clearly, copy it as-is rather than guessing a substitute',
  '- Do NOT remove any boxes, arrows, decision diamonds, table rows, or labels',
  '- Preserve the YES / NO branch labels on every decision diamond',
  '',
  'WHAT TO IMPROVE (style only, never content):',
  '- Cleaner typography with better hierarchy',
  '- More consistent spacing and alignment',
  '- Crisper arrow lines and rounded box corners',
  '- Slightly more generous whitespace for a print-ready medical poster look',
  '- Same color palette: dark navy headers, slate connectors, red for warnings, green for safe path, purple for monitoring'
].join('\n')

console.log(`Source: ${inputPath}`)
console.log(`Prompt length: ${prompt.length} chars`)

async function tryEdit(model, size) {
  console.log(`\nAttempting edit with model=${model} size=${size}...`)
  const t0 = Date.now()
  const fileBuf = fs.readFileSync(inputPath)
  const fileBlob = new Blob([fileBuf], { type: 'image/png' })
  const form = new FormData()
  form.append('model', model)
  form.append('prompt', prompt)
  form.append('size', size)
  form.append('image[]', fileBlob, path.basename(inputPath))
  const r = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
    body: form
  })
  const ms = Date.now() - t0
  if (!r.ok) {
    const text = await r.text()
    throw new Error(`HTTP ${r.status}: ${text.slice(0, 400)}`)
  }
  const json = await r.json()
  console.log(`  Returned in ${(ms / 1000).toFixed(1)}s`)
  return json
}

const candidates = [
  { model: 'gpt-image-2', size: '1536x1024' },
  { model: 'gpt-image-1.5', size: '1536x1024' },
  { model: 'gpt-image-1', size: '1536x1024' }
]

let result, usedModel
let lastError
for (const c of candidates) {
  try {
    result = await tryEdit(c.model, c.size)
    usedModel = c.model
    break
  } catch (e) {
    lastError = e
    const msg = e?.response?.data?.error?.message || e?.error?.message || e?.message || String(e)
    console.warn(`  ${c.model} failed: ${msg}`)
  }
}

if (!result) {
  console.error('\nAll model attempts failed.')
  console.error(lastError)
  process.exit(1)
}

const b64 = result.data?.[0]?.b64_json
if (!b64) {
  console.error('No b64_json in response:', JSON.stringify(result, null, 2).slice(0, 1000))
  process.exit(1)
}

const outPath = path.join(outDir, `${baseName}__${usedModel}.png`)
fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1)
console.log(`\nWrote ${outPath} (${sizeKb} KB) using ${usedModel}`)
