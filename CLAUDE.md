# Claude Code Instructions

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

---

## AWC Trauma Website - Project Context

### Project Overview
Medical resource website for Abrazo West Campus Level 1 Trauma Center. Built with Next.js 15.5.2, Supabase, and Tailwind CSS.

**Live URL**: Deployed on Vercel (auto-deploys from main branch)

### Tech Stack
- **Framework**: Next.js 15.5.2 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom color palette
- **Deployment**: Vercel
- **MCP Servers**: Supabase MCP, Vercel MCP (configured in `.mcp.json`)

### Key Database Tables
1. **`files`** - Document storage (PDFs, DOCX) with categories
2. **`algorithms`** - Flowchart/algorithm/chart management with image URLs

### File Categories (FileCategory type in `lib/supabase.ts`)
- `cpgs` - Clinical Practice Guidelines
- `resident_guidelines` - Resident Guidelines
- `trauma_policies` - Trauma Policies
- `medical_student` - Medical Student Resources
- `resources` - General Resources

### Icon Types (IconType type in `lib/supabase.ts`)
`ribs`, `pelvis`, `vascular`, `spleen`, `liver`, `kidney`, `airway`, `brain`, `endocrine`, `heme`, `ortho`, `default`

### Current Algorithms (as of 2025-11-28)
1. Rib Fracture (CWITS)
2. Pelvic Fracture
3. BCVI Screening
4. Spleen Injury
5. Liver Injury
6. Kidney Injury
7. Difficult Airway
8. Adrenal Insufficiency (was "Brain" - needs DB update)

### Color Palette
Using muted slate-blue/navy tones in `tailwind.config.ts`. Navy palette with values from #f0f4f8 (50) to #102a43 (900).

---

## Key Files Reference

### Core Types
- `lib/supabase.ts` - Supabase client, FileCategory, IconType, FileRecord, AlgorithmRecord types

### Components
- `components/Header.tsx` - Site header (white text on navy gradient)
- `components/Footer.tsx` - Site footer
- `components/AlgorithmsSection.tsx` - Algorithm/chart cards with icons
- `components/TabbedDocuments.tsx` - Tabbed document navigation (5 tabs)
- `components/GlobalSearch.tsx` - Hero search component
- `components/DocumentViewer.tsx` - PDF/DOCX viewer wrapper
- `components/PDFViewer.tsx` - PDF rendering (uses react-pdf)
- `components/DocxViewer.tsx` - DOCX rendering (uses mammoth)

### Pages
- `app/page.tsx` - Homepage with algorithms section titled "Quick Reference Algorithms & Charts"
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/manage/page.tsx` - File management
- `app/admin/algorithms/page.tsx` - Algorithm management
- `app/viewer/[id]/page.tsx` - Document viewer

### Configuration
- `.mcp.json` - MCP servers (Supabase, Vercel)
- `tailwind.config.ts` - Custom color palette
- `vercel.json` - Vercel deployment config
- `.env.local` - Environment variables (Supabase keys)

---

## Pending Database Migrations

### Rename "Brain" to "Adrenal Insufficiency"
Run this in Supabase SQL Editor:
```sql
UPDATE algorithms
SET
  title = 'Adrenal Insufficiency / Stress Dose Steroids',
  short_title = 'Adrenal Insufficiency',
  icon_type = 'endocrine'
WHERE short_title = 'Brain';
```

---

## Design Notes
- Professional medical/healthcare aesthetic
- Muted slate-blue/navy color scheme
- White text on dark backgrounds
- Section: "Quick Reference Algorithms & Charts" (not just algorithms - will include tables/charts)
- Future content: TBI Management, VTE Prophylaxis Chart
- **Visual feedback**: Current design is "too monotone" - needs subtle color accents for freshness

---

## Recovery Commands
If styling breaks:
```bash
git stash        # Stash all changes
git checkout main -- .  # Restore all files from main
```
