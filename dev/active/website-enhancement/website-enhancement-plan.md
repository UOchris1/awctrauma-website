# AWC Trauma Website Enhancement Plan
Last Updated: 2025-11-26

## Executive Summary

Transform the AWC Trauma Website from a basic PDF upload portal into a comprehensive clinical guidelines resource with enhanced document viewing, file management, and search capabilities.

## Current State

- Next.js 15 + React 19 + TypeScript application
- Supabase for database and file storage
- PDF-only uploads with browser iframe viewer
- Single password authentication
- No file management (edit/delete) capability
- No search functionality

## Proposed Future State

- Multi-format document support (PDF + Word)
- Enhanced document viewers with navigation and zoom
- Admin file management dashboard (CRUD operations)
- Full-text search across documents
- Improved homepage with search and filtering

---

## Phase 1: Document Viewer Enhancement

### 1.1 Install Dependencies
- [ ] Add `react-pdf` for PDF viewing
- [ ] Add `mammoth` for Word document rendering
- [ ] Add `pdfjs-dist` for PDF.js worker

**Acceptance Criteria:**
- Dependencies installed without conflicts
- Build completes successfully

**Effort:** S

### 1.2 Create PDF Viewer Component
- [ ] Create `components/PDFViewer.tsx`
- [ ] Implement page navigation (prev/next)
- [ ] Implement zoom controls
- [ ] Add download button
- [ ] Handle loading and error states

**Acceptance Criteria:**
- PDFs render consistently across browsers
- Navigation controls work smoothly
- Zoom levels from 50% to 200%

**Effort:** M

### 1.3 Create Word Document Viewer
- [ ] Create `components/DocxViewer.tsx`
- [ ] Implement mammoth.js conversion
- [ ] Style rendered HTML with Tailwind prose
- [ ] Add download fallback button

**Acceptance Criteria:**
- .docx files render as styled HTML
- Tables and formatting preserved
- Fallback download available

**Effort:** M

### 1.4 Create Unified Document Viewer
- [ ] Create `components/DocumentViewer.tsx`
- [ ] Detect file type and route to appropriate viewer
- [ ] Use dynamic imports for code splitting
- [ ] Update `/viewer/[id]/page.tsx` to use new component

**Acceptance Criteria:**
- Correct viewer loads based on file type
- Bundle size optimized with code splitting

**Effort:** S

---

## Phase 2: Multi-Format Upload Support

### 2.1 Database Schema Update
- [ ] Add `file_type` column to files table
- [ ] Add `file_size` column
- [ ] Add `updated_at` column with trigger
- [ ] Run migration in Supabase

**Acceptance Criteria:**
- Schema updated without data loss
- Existing records have default values

**Effort:** S

### 2.2 Update Upload API
- [ ] Modify `/api/upload/route.ts` for multi-format
- [ ] Accept PDF and DOCX MIME types
- [ ] Store file_type and file_size in database
- [ ] Update validation logic

**Acceptance Criteria:**
- PDF and DOCX uploads work
- File metadata stored correctly
- Validation rejects invalid types

**Effort:** M

### 2.3 Update Upload Form
- [ ] Modify `/admin/page.tsx` to accept .docx
- [ ] Show file type indicator
- [ ] Update accepted file types in drag-drop

**Acceptance Criteria:**
- UI accepts both file types
- Clear feedback on file type

**Effort:** S

---

## Phase 3: File Management Dashboard

### 3.1 Create Admin Files API
- [ ] Create `/api/admin/files/route.ts` (list with pagination)
- [ ] Create `/api/files/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Implement storage cleanup on delete

**Acceptance Criteria:**
- CRUD operations work correctly
- Storage files deleted with records
- Proper auth checks on all endpoints

**Effort:** M

### 3.2 Create Management Page
- [ ] Create `/admin/manage/page.tsx`
- [ ] Implement file listing table
- [ ] Add sort and filter controls
- [ ] Implement edit modal
- [ ] Implement delete confirmation

**Acceptance Criteria:**
- All files visible in table
- Edit updates metadata
- Delete removes file and record

**Effort:** L

### 3.3 Add Admin Navigation
- [ ] Create `components/AdminNav.tsx`
- [ ] Add navigation between Upload and Manage
- [ ] Include logout functionality

**Acceptance Criteria:**
- Easy navigation between admin pages
- Consistent admin UI

**Effort:** S

---

## Phase 4: Search Functionality

### 4.1 Create Search API
- [ ] Create `/api/search/route.ts`
- [ ] Implement title/description search
- [ ] Add category filtering
- [ ] Return paginated results

**Acceptance Criteria:**
- Search returns relevant results
- Category filter works
- Performance acceptable (<500ms)

**Effort:** M

### 4.2 Create Search Component
- [ ] Create `components/SearchBar.tsx`
- [ ] Implement debounced search input
- [ ] Show search results dropdown
- [ ] Handle empty states

**Acceptance Criteria:**
- Real-time search feedback
- Results link to viewer
- Mobile-friendly

**Effort:** M

### 4.3 Integrate Search in Header
- [ ] Add SearchBar to Header component
- [ ] Style for desktop and mobile
- [ ] Handle search result navigation

**Acceptance Criteria:**
- Search accessible from all pages
- Responsive design

**Effort:** S

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| react-pdf bundle size | Medium | Medium | Dynamic imports, code splitting |
| CORS issues with storage | Low | High | Verify Supabase bucket settings |
| mammoth.js conversion quality | Medium | Medium | Test with real documents, provide download fallback |
| Breaking existing uploads | Low | High | Database migration preserves data |

---

## Success Metrics

1. **Document Viewing**: Users can view PDFs and Word docs without downloading
2. **File Management**: Admins can edit/delete files from UI
3. **Search**: Users find documents in <30 seconds
4. **Upload**: Both PDF and DOCX uploads work reliably

---

## Dependencies

- `react-pdf` ^7.7.0
- `pdfjs-dist` ^3.11.174
- `mammoth` ^1.6.0

---

## Resources

- `.claude/skills/nextjs-supabase-guidelines/` - Development patterns
- `ENHANCEMENT_PLAN.md` - Full enhancement roadmap
- `raw_instruct/redesign` - Implementation artifacts from planning
