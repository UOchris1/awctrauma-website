'use client'
import { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Bundle the PDF.js worker with the app (same-origin, no CDN dependency)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface Props {
  url: string
  title: string
}

// Horizontal padding around the rendered page (matches the p-4 wrapper below)
const PAGE_PADDING = 32
// Cap the fit-to-width size so desktop renders stay a comfortable reading width
const MAX_FIT_WIDTH = 900

export default function PDFViewer({ url, title }: Props) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  // zoom is relative to "fit to width": 1.0 fills the container
  const [zoom, setZoom] = useState<number>(1.0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // Track the container width so the page always renders fit-to-width by default
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setContainerWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }, [])

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error)
    setError('Failed to load PDF document')
    setLoading(false)
  }, [])

  const goToPrevPage = () => setPageNumber(p => Math.max(1, p - 1))
  const goToNextPage = () => setPageNumber(p => Math.min(numPages, p + 1))
  const zoomIn = () => setZoom(z => Math.min(3, z + 0.25))
  const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.25))
  const resetZoom = () => setZoom(1.0)

  const fitWidth = Math.max(240, Math.min(containerWidth - PAGE_PADDING, MAX_FIT_WIDTH))
  const pageWidth = Math.round(fitWidth * zoom)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-700 mb-4">{error}</p>
        <a
          href={url}
          download={title}
          className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors"
        >
          Download PDF Instead
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white px-2 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        {/* Page Navigation (hidden for single-page documents) */}
        {numPages > 1 ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs sm:text-sm font-medium min-w-[56px] sm:min-w-[100px] text-center tabular-nums">
              <span className="hidden sm:inline">Page {pageNumber} of {numPages}</span>
              <span className="sm:hidden">{pageNumber} / {numPages}</span>
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <span className="text-xs sm:text-sm font-medium text-white/70 px-1">{numPages === 1 ? '1 page' : ''}</span>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            title="Reset to fit width"
            className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors min-w-[48px] sm:min-w-[60px] tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Download Button */}
        <a
          href={url}
          download={title}
          className="flex items-center gap-2 p-2 sm:px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Download PDF"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>

      {/* PDF Document Container — fit-to-width; scrolls in place on desktop, flows with the page on mobile */}
      <div
        ref={containerRef}
        className="overflow-auto bg-gray-100 md:max-h-[calc(100vh-240px)]"
      >
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-navy-800 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading PDF...</span>
          </div>
        )}
        {containerWidth > 0 && (
          <div className="w-max mx-auto p-4">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                className="shadow-xl"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}
