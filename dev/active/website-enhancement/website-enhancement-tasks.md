# Website Enhancement - Task Checklist
Last Updated: 2025-11-26

## Phase 1: Document Viewer Enhancement - COMPLETE

### 1.1 Install Dependencies
- [x] Run `npm install react-pdf pdfjs-dist mammoth`
- [x] Verify build succeeds

### 1.2 Create PDF Viewer Component
- [x] Create `components/PDFViewer.tsx`
- [x] Implement document loading with react-pdf
- [x] Add page navigation (prev/next buttons)
- [x] Add page number display
- [x] Add zoom controls (+/- buttons)
- [x] Add download button
- [x] Handle loading state
- [x] Handle error state

### 1.3 Create Word Document Viewer
- [x] Create `components/DocxViewer.tsx`
- [x] Fetch document as ArrayBuffer
- [x] Convert with mammoth.convertToHtml
- [x] Apply Tailwind prose styling
- [x] Add download fallback button
- [x] Handle loading state
- [x] Handle error state

### 1.4 Create Unified Document Viewer
- [x] Create `components/DocumentViewer.tsx`
- [x] Detect file type from file record
- [x] Dynamic import PDFViewer
- [x] Dynamic import DocxViewer
- [x] Fallback for unknown types
- [x] Update `app/viewer/[id]/page.tsx`

---

## Phase 2: Multi-Format Upload Support - COMPLETE

### 2.1 Database Schema Update
- [x] Create migration SQL (`supabase/migrations/20251126_add_file_metadata.sql`)
- [x] Add `file_type TEXT DEFAULT 'pdf'`
- [x] Add `file_size INTEGER`
- [x] Add `updated_at TIMESTAMP WITH TIME ZONE`
- [x] Create update trigger
- [ ] Run migration in Supabase dashboard (USER ACTION REQUIRED)

### 2.2 Update Upload API
- [x] Update ALLOWED_TYPES constant
- [x] Detect file type from MIME type
- [x] Store file_type in insert
- [x] Store file_size in insert

### 2.3 Update Upload Form
- [x] Update accept attribute for file input
- [x] Update drag-drop accepted types
- [x] Show file type badge on selection
- [x] Update validation messages

### 2.4 Update TypeScript Types
- [x] Add FileType to lib/supabase.ts
- [x] Update FileRecord interface
- [x] Update any type assertions

---

## Phase 3: File Management Dashboard - COMPLETE

### 3.1 Create Admin Files API
- [x] Create `app/api/admin/files/route.ts`
- [x] Implement GET with pagination
- [x] Add category filter
- [x] Add sort options

### 3.2 Create File CRUD API
- [x] Create `app/api/files/[id]/route.ts`
- [x] Implement GET single file
- [x] Implement PUT for metadata update
- [x] Implement DELETE with storage cleanup

### 3.3 Create Management Page
- [x] Create `app/admin/manage/page.tsx`
- [x] Create file listing table
- [x] Add category filter dropdown
- [x] Add sort controls
- [x] Create EditModal component
- [x] Create DeleteConfirmModal component
- [x] Wire up API calls

### 3.4 Add Admin Navigation
- [x] Create `components/AdminNav.tsx`
- [x] Add to admin layout
- [x] Style navigation links

---

## Phase 4: Search Functionality

### 4.1 Create Search API
- [ ] Create `app/api/search/route.ts`
- [ ] Implement ilike search on title
- [ ] Implement ilike search on description
- [ ] Add category filter parameter
- [ ] Limit results to 20

### 4.2 Create Search Component
- [ ] Create `components/SearchBar.tsx`
- [ ] Add search input with icon
- [ ] Implement debounced API call
- [ ] Display results dropdown
- [ ] Handle empty state
- [ ] Handle loading state

### 4.3 Integrate Search
- [ ] Add SearchBar to Header.tsx
- [ ] Style for desktop (expanded)
- [ ] Style for mobile (collapsible)
- [ ] Handle result click navigation

---

## Testing Checklist

### Document Viewer
- [ ] PDF renders correctly
- [ ] Word doc renders correctly
- [ ] Page navigation works
- [ ] Zoom works
- [ ] Download works
- [ ] Error states display properly

### Upload
- [ ] PDF upload works
- [ ] DOCX upload works
- [ ] Invalid file rejected
- [ ] File size limit enforced

### File Management
- [ ] Files list loads
- [ ] Edit modal saves changes
- [ ] Delete removes file and record
- [ ] Filter by category works
- [ ] Sort by title works
- [ ] Sort by date works
- [ ] Pagination works

### Search
- [ ] Search returns results
- [ ] No results handled
- [ ] Category filter works
- [ ] Results link to viewer

---

## Notes

- Priority: Phase 1 > Phase 2 > Phase 3 > Phase 4
- Each phase can be deployed independently
- Test with real trauma documents before production
- **USER ACTION**: Run migration SQL in Supabase dashboard before testing Phase 2 & 3
