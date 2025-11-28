# Claude Code Instructions

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

---

## AWC Trauma Website - Project Context

### Project Overview
Medical resource website for Level 1 Trauma Center. Built with Next.js 15.5.2, Supabase, and Tailwind CSS.

**Branding Note**: Currently branded as "Level 1 Trauma" (generic). Awaiting approval to use "Abrazo West Campus" branding.

**Live URL**: Deployed on Vercel (auto-deploys from main branch)

### Tech Stack
- **Framework**: Next.js 15.5.2 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom color palette
- **Deployment**: Vercel
- **MCP Servers**: Supabase MCP, Vercel MCP (configured in `.mcp.json`)

### Key Database Tables
1. **`files`** - Document storage (PDFs, DOCX) with categories
2. **`algorithms`** - Flowchart/algorithm/chart management with image URLs and optional `card_color`

### File Categories (FileCategory type in `lib/supabase.ts`)
- `cpgs` - Clinical Practice Guidelines
- `resident_guidelines` - Resident Guidelines
- `trauma_policies` - Trauma Policies
- `medical_student` - Medical Student Resources
- `resources` - General Resources

### Icon Types (IconType type in `lib/supabase.ts`)
`ribs`, `pelvis`, `vascular`, `spleen`, `liver`, `kidney`, `airway`, `brain`, `endocrine`, `heme`, `ortho`, `default`

### Card Colors (CardColor type in `lib/supabase.ts`)
`auto`, `blue`, `rose`, `emerald`, `amber`, `sky`, `indigo`, `purple`, `teal`, `orange`
- `auto` = color determined by icon_type (default behavior)
- Other values = manual color override for algorithm cards

### Current Algorithms (as of 2025-11-28)
1. Rib Fracture (CWITS)
2. Pelvic Fracture
3. BCVI Screening
4. Spleen Injury
5. Liver Injury
6. Kidney Injury
7. Difficult Airway
8. Adrenal Insufficiency

### Color Palette
Using muted slate-blue/navy tones in `tailwind.config.ts`. Navy palette with values from #f0f4f8 (50) to #102a43 (900).

---

## Key Files Reference

### Core Types
- `lib/supabase.ts` - Supabase client, FileCategory, IconType, CardColor, FileRecord, AlgorithmRecord types

### Components
- `components/Header.tsx` - Site header displaying "Level 1 Trauma" (white text on navy gradient)
- `components/Footer.tsx` - Site footer with subtle admin link
- `components/AlgorithmsSection.tsx` - Algorithm/chart cards with icons and color support
- `components/TabbedDocuments.tsx` - Tabbed document navigation (5 tabs)
- `components/GlobalSearch.tsx` - Hero search component
- `components/DocumentViewer.tsx` - PDF/DOCX viewer wrapper
- `components/PDFViewer.tsx` - PDF rendering (uses react-pdf)
- `components/DocxViewer.tsx` - DOCX rendering (uses mammoth)

### Pages
- `app/page.tsx` - Homepage with algorithms section titled "Quick Reference Algorithms & Charts"
- `app/admin/page.tsx` - Admin dashboard with tabs for Files and Algorithms management
- `app/viewer/[id]/page.tsx` - Document viewer

### Configuration
- `.mcp.json` - MCP servers (Supabase, Vercel)
- `tailwind.config.ts` - Custom color palette
- `vercel.json` - Vercel deployment config
- `.env.local` - Environment variables (Supabase keys, ADMIN_PASSWORD) - NOT committed to git

### Database Migrations (run in Supabase SQL Editor if needed)
- `supabase/migrations/20251128_add_card_color.sql` - Adds card_color column to algorithms
- `supabase/migrations/20251128_fix_files_rls.sql` - Fixes RLS policies for file updates

---

## Admin Portal Features

### File Management Tab
- Upload PDF/DOCX files to categories
- Change file categories via dropdown
- Delete files

### Algorithm Management Tab
- Add new algorithms with title, icon type, and optional card color
- Upload flowchart images (stored in Supabase Storage)
- Edit existing algorithms (title, icon, color, image)
- Color picker: "Auto" uses icon-based color, or manually select a color

---

## Pending Tasks

### Database Migration (if card_color not added yet)
Run in Supabase SQL Editor:
```sql
-- Add card_color column to algorithms table
ALTER TABLE algorithms
ADD COLUMN IF NOT EXISTS card_color TEXT DEFAULT 'auto';

-- Add constraint for valid values
ALTER TABLE algorithms
ADD CONSTRAINT valid_card_color
CHECK (card_color IN ('auto', 'blue', 'rose', 'emerald', 'amber', 'sky', 'indigo', 'purple', 'teal', 'orange'));
```

### Future Branding Update
When approval is received to use "Abrazo West Campus":
1. Update `components/Header.tsx` - change "Level 1 Trauma" to "Abrazo West Campus"
2. Update `app/layout.tsx` - change metadata title/description
3. Optionally add subtitle "Level 1 Trauma Center Resources"

---

## Design Notes
- Professional medical/healthcare aesthetic
- Muted slate-blue/navy color scheme
- White text on dark backgrounds
- Algorithm cards now support custom colors for visual variety
- Section: "Quick Reference Algorithms & Charts" (includes tables/charts, not just algorithms)
- Future content: TBI Management, VTE Prophylaxis Chart

---

## Security Notes
- `.env.local` contains sensitive credentials - NEVER commit this file
- ADMIN_PASSWORD is set via environment variable (Vercel has its own env vars)
- Previous credential exposure was cleaned up in commit b9300b7

---

## Recovery Commands
If styling breaks:
```bash
git stash        # Stash all changes
git checkout main -- .  # Restore all files from main
```

## Dev Server
```bash
npm run dev -- -p 3010  # Run on port 3010
```
