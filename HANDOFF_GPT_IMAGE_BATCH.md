# HANDOFF — gpt-image-2 Flowchart Batch (in-progress)

**Read this first if you're a new Claude session resuming this work.** Today's date when this was written: **2026-04-24**.

## Mission

The user wants all 13 trauma flowcharts run through OpenAI's `gpt-image-2` to make them look more polished/publication-ready, while **strictly preserving every piece of clinical text** (drug names, doses, thresholds, grades, time windows). After every chart is reviewed and approved, push the new PNGs live on the website.

## Workflow (per chart)

```bash
node scripts/test_gpt_image.mjs <chart_basename>
```

- Source: `public/flowcharts/d2/<basename>_render.png`
- Output: `public/flowcharts/gpt_image_test/<basename>__gpt-image-2.png`
- Cost: ~$0.30/chart, 60–155 seconds
- Then `Read` both PNGs and audit **every** label/dose/threshold against the original. Report **GREENLIGHT** or **FLAGGED** with specifics.

The script tries `gpt-image-2` first and falls back to `gpt-image-1.5`/`gpt-image-1`. **Always confirm "using gpt-image-2"** in the script output — older versions hallucinate clinical text badly (see "Lessons learned" below).

## Status of the 13 charts

| # | Chart | Status | Notes |
|---|---|---|---|
| 1 | vte_chart | ✅ GREENLIGHT | Clean. All BIG categories, dosing table, anti-Xa target intact. |
| 2 | big_classification | ✅ GREENLIGHT | Clean. Levetiracetam dose, PCC thrombosis 3.8%, all step-down criteria intact. |
| 3 | splenic_nom | ✅ GREENLIGHT | Clean. AAST grades, vaccinations (PCV13/MenACWY/Hib), discharge windows intact. |
| 4 | hepatic_nom | ✅ GREENLIGHT | Clean. One `→` became `-` (cosmetic). Pringle, atriocaval shunt, biliary 3-20% intact. |
| 5 | renal_management | ✅ GREENLIGHT | Clean. AAST 2018 grading, urinoma management, BP monitoring intact. |
| 6 | pelvic_fracture | ⚠️ FLAGGED — typos | "VTE **prophlyaxis**" (missing y) and "**biood** at meatus" in Definitive Management box. Clinical intent preserved. **User accepts**: catalog typos, still push live, user will fix them in image editor later. |
| 7 | cwits_rib_fracture | ✅ GREENLIGHT | Clean. CWITS 2.0 scoring, Tier 1-3 pain pathway (acetaminophen 1g, ketorolac 15–30mg, gabapentin 300mg), SSRF criteria intact. |
| 8 | bcvi_screening | ✅ GREENLIGHT | Clean. Biffl Grades I–V, Denver criteria, ASA 325mg / heparin drip dosing intact. Two `→` became `—` in Follow-Up (cosmetic). |
| 9 | sci_algorithm | ⚠️ FLAGGED — typo | One casing typo in Respiratory Monitoring: "FVC < 15 mL/kg **oR** NIF weaker than −20" (lowercase o). MPSS dosing (30 mg/kg bolus, 5.4 mg/kg/hr × 23h), MAP 85–90 × 5–7 days, all phases intact. User can fix in image editor. |
| 10 | geriatric_algorithm | ✅ GREENLIGHT | Clean. Rockwood CFS 1–9, reversal target 60 min, CWITS-25-IS modifier intact. Two `→` became `—` in CWITS modifier (cosmetic). |
| 11 | open_fracture_abx | ✅ GREENLIGHT | Clean. Cefazolin 2g/3g, gentamicin 5mg/kg, clindamycin 900mg, levofloxacin 750mg, vancomycin 15–20 mg/kg, metronidazole 500mg, doxycycline 100mg, full Gustilo-Anderson table intact. |
| 12 | difficult_airway | ✅ GREENLIGHT | Clean. Ketamine 1.5–2 mg/kg, succinylcholine 1.5 mg/kg, rocuronium 1.2 mg/kg, 6.0 cuffed ETT, scalpel-bougie-tube technique intact. One "*or*" lost italics (cosmetic). |
| 13 | circi_algorithm | ✅ GREENLIGHT | Clean. Cosyntropin 250mcg, delta cortisol < 9 mcg/dL, hydrocortisone 50mg q6h, fludrocortisone 50mcg, taper schedule q6h→q8h→q12h intact. "Phase 3:  Taper" has double-space (cosmetic). |

**Total spent: ~$3.90 (13 charts). Generation phase complete.**
**Approval rate: 11/13 GREENLIGHT, 2/13 FLAGGED (minor typos only, user accepts).**

## Typo catalog (track every one — user will fix manually after publish)

| Chart | Box | Typo | Should be |
|---|---|---|---|
| pelvic_fracture | Definitive Management | "prophlyaxis" | "prophylaxis" |
| pelvic_fracture | Definitive Management | "biood at meatus" | "blood at meatus" |
| sci_algorithm | Respiratory Monitoring (Intubate if) | "FVC < 15 mL/kg oR NIF weaker than −20" | "FVC < 15 mL/kg OR NIF weaker than −20" (casing) |

Add new typos here as you find them. The user will hand-correct these in an image editor later, then send to you to upload.

## Upload pipeline (NOT done — do this AFTER all 13 charts are approved)

**The current Supabase `algorithms` table points to OLD images at paths like `/flowcharts/rib_fracture.png` — NOT the `d2/*_render.png` files. So even the existing HTML renders aren't live yet.**

To swap in the gpt-image-2 versions:

1. Copy approved `*__gpt-image-2.png` files to a permanent location, e.g. `public/flowcharts/v2/<basename>.png`
2. For each algorithm, update `algorithms.image_url` in Supabase to the new path
   - Either via admin UI at `/admin` (one at a time)
   - Or via a small script using `SUPABASE_SERVICE_KEY` (more efficient for a batch of 13)
3. Commit + push to `main` — Vercel auto-deploys

**Aspect ratio caveat**: gpt-image-2 outputs are 1536×1024 landscape. Card thumbnails in `components/AlgorithmsSection.tsx` expect portrait — they'll render smaller but won't break. Lightbox handles either fine.

## Key files

- `scripts/test_gpt_image.mjs` — the runner. Uses `OPENAI_API_KEY` from `.env.local` (gitignored). Already has the strict "preserve every character" prompt.
- `public/flowcharts/d2/*.html` — source HTML/SVG flowcharts (built last session via D2/Puppeteer)
- `public/flowcharts/d2/*_render.png` — current Puppeteer renders (the SOURCE for gpt-image-2)
- `public/flowcharts/gpt_image_test/*__gpt-image-2.png` — output destination
- `lib/supabase.ts` — `AlgorithmRecord` type (`image_url` is the field to update)
- `app/admin/page.tsx` — algorithm CRUD UI
- `.env.local` — now contains `OPENAI_API_KEY` (do NOT commit, it's gitignored)

## Lessons learned (do NOT repeat)

1. **Never use gpt-image-1.5 or gpt-image-1 for medical content.** Both hallucinate clinical text wildly: "BIG" → "BIO", made-up doses, "Viral Crissingod" instead of "CrCl 15-29 mL/min", deleted boxes, fake citations. Only `gpt-image-2` preserves dense medical text reliably.
2. **OpenAI org IS verified.** User completed Persona ID upload during this session. `gpt-image-2` access is live. Don't ask them to re-verify.
3. **The `openai` SDK's `images.edit` defaults to dall-e-2 format and rejects gpt-image models.** The script uses raw `fetch` with multipart `image[]` — don't switch back to the SDK helper.
4. **Don't use `quality` param** — it's not accepted on `/v1/images/edits`.
5. **Audit EVERY character** — gpt-image-2 is good but not perfect. pelvic_fracture had two single-letter typos that are easy to miss at a glance.
6. **Process one at a time.** User explicitly asked for sequential, not batch. They review each verdict.

## User preferences (durable)

- **No Abrazo branding anywhere** — generic "Level 1 Trauma" only. Hospital doesn't want association.
- Keep git in sync with `main` — Vercel auto-deploys.
- User's source content lives in Dropbox: `C:\Users\socra\Dropbox\Attending\Goodyear\SICU director\Meetings\2026\Research`
- User is a medical professional (trauma) — speak at clinician level, don't over-explain medicine.
- Cost-conscious — don't burn API credits on rework if avoidable.

## Pickup instructions

**Generation phase is COMPLETE (2026-04-24).** All 13 charts generated, all 13 audited. 11 GREENLIGHT, 2 FLAGGED (minor typos in pelvic_fracture and sci_algorithm).

Next steps for the incoming session:

1. Wait for user to hand-fix typos in image editor (pelvic_fracture + sci_algorithm) OR get user approval to ship as-is.
2. Execute **Upload pipeline** (see section above):
   - Copy the 13 approved `*__gpt-image-2.png` files to a permanent location (e.g. `public/flowcharts/v2/<basename>.png`).
   - Update each `algorithms.image_url` in Supabase to the new path (13 rows).
   - Commit + push to `main` — Vercel auto-deploys.
3. After deploy, spot-check each live card + lightbox in a browser.
