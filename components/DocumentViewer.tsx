'use client'
import { FileRecord } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// Dynamic imports for code splitting - viewers only load when needed
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  loading: () => (
    <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-navy-800 border-t-transparent"></div>
      <span className="ml-3 text-gray-600">Loading PDF viewer...</span>
    </div>
  ),
  ssr: false // PDF.js requires browser APIs
})

const DocxViewer = dynamic(() => import('./DocxViewer'), {
  loading: () => (
    <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-navy-800 border-t-transparent"></div>
      <span className="ml-3 text-gray-600">Loading document viewer...</span>
    </div>
  ),
  ssr: false // Mammoth requires browser APIs
})

interface Props {
  file: FileRecord
}

/**
 * Unified document viewer that selects the appropriate viewer
 * based on file type (from database or URL extension)
 */
export default function DocumentViewer({ file }: Props) {
  const fileType = file.file_type || detectFileType(file.file_url)

  switch (fileType) {
    case 'pdf':
      return <PDFViewer url={file.file_url} title={file.title} />
    case 'docx':
    case 'doc':
      return <DocxViewer url={file.file_url} title={file.title} />
    default:
      return <UnknownTypeViewer file={file} />
  }
}

/**
 * Detects file type from URL extension as fallback
 */
function detectFileType(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const extension = pathname.split('.').pop()?.toLowerCase()

    if (extension === 'pdf') return 'pdf'
    if (extension === 'docx') return 'docx'
    if (extension === 'doc') return 'doc'

    return 'unknown'
  } catch {
    // If URL parsing fails, try simple extension extraction
    const extension = url.split('.').pop()?.toLowerCase()?.split('?')[0]

    if (extension === 'pdf') return 'pdf'
    if (extension === 'docx') return 'docx'
    if (extension === 'doc') return 'doc'

    return 'unknown'
  }
}

/**
 * Fallback component for unsupported file types
 */
function UnknownTypeViewer({ file }: { file: FileRecord }) {
  const extension = file.file_url.split('.').pop()?.toUpperCase() || 'FILE'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center py-8">
        {/* File Icon */}
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {file.title}
        </h3>

        <p className="text-gray-600 mb-6">
          Preview is not available for {extension} files.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={file.file_url}
            download={file.title}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download File
          </a>
          <a
            href={file.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  )
}
