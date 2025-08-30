import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// CORRECTED: The 'params' object is a plain object, not a Promise.
type Props = {
  params: {
    id: string;
  };
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

export default async function PDFViewer({ params }: Props) {
  // CORRECTED: Removed "await params" and now using "params.id" directly.
  const file = await getFile(params.id)

  if (!file) {
    notFound()
  }

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
              <h1 className="text-lg font-semibold text-silver-200">{file.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={file.file_url}
                download
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span>Download PDF</span>
              </a>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <iframe
            src={`${file.file_url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full"
            style={{ height: 'calc(100vh - 200px)' }}
            title={file.title}
          >
            <p className="p-8 text-center">
              Your browser doesn't support PDF viewing. 
              <a href={file.file_url} className="text-primary-600 hover:underline ml-2">
                Click here to download the PDF.
              </a>
            </p>
          </iframe>
        </div>
        
        {/* File Info */}
        {file.description && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary-900 mb-2">Description</h2>
            <p className="text-primary-700">{file.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}