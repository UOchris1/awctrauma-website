import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DocumentViewer from '@/components/DocumentViewer'

// Updated for Next.js 15: params is now a Promise in dynamic routes
type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getFile(id: string) {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function ViewerPage({ params }: Props) {
  // Await the params Promise to get the actual values
  const { id } = await params;

  const file = await getFile(id)

  if (!file) {
    notFound()
  }

  // Detect file type from URL if not stored in database
  const fileType = file.file_type || detectFileType(file.file_url)
  const fileTypeLabel = getFileTypeLabel(fileType)

  return (
    <div className="min-h-screen bg-silver-100">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white shadow-lg">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:text-silver-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Resources</span>
              </Link>
              <span className="text-silver-400">|</span>
              <h1 className="text-lg font-semibold text-silver-200 truncate max-w-md">{file.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* File Type Badge */}
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
                {fileTypeLabel}
              </span>
              {/* File Size (if available) */}
              {file.file_size && (
                <span className="text-silver-300 text-sm hidden sm:inline">
                  {formatFileSize(file.file_size)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <DocumentViewer file={file} />

        {/* File Info */}
        {file.description && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-navy-900 mb-2">Description</h2>
            <p className="text-gray-700">{file.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function detectFileType(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const extension = pathname.split('.').pop()?.toLowerCase()
    return extension || 'unknown'
  } catch {
    const extension = url.split('.').pop()?.toLowerCase()?.split('?')[0]
    return extension || 'unknown'
  }
}

function getFileTypeLabel(fileType: string): string {
  switch (fileType) {
    case 'pdf': return 'PDF'
    case 'docx': return 'Word Document'
    case 'doc': return 'Word Document'
    default: return fileType.toUpperCase()
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
