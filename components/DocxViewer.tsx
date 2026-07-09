'use client'
import { useEffect, useState, useRef } from 'react'
import mammoth from 'mammoth'

interface Props {
  url: string
  title: string
}

export default function DocxViewer({ url, title }: Props) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function convertDocument() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()

        // Convert Word document to HTML with custom style mappings
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "p[style-name='Title'] => h1.doc-title:fresh",
              "b => strong",
              "i => em",
              "u => u",
              "p[style-name='Quote'] => blockquote:fresh",
              "p[style-name='List Paragraph'] => li:fresh"
            ]
          }
        )

        setHtml(result.value)

        // Log conversion warnings for debugging
        if (result.messages.length > 0) {
          console.warn('Mammoth conversion warnings:', result.messages)
        }
      } catch (err) {
        console.error('Error converting document:', err)
        setError(err instanceof Error ? err.message : 'Failed to load document')
      } finally {
        setLoading(false)
      }
    }

    convertDocument()
  }, [url])

  const handlePrint = () => {
    if (!contentRef.current) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print the document')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3 { margin-top: 24px; color: #1a365d; }
            h1 { font-size: 24px; border-bottom: 2px solid #1a365d; padding-bottom: 8px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            p { margin: 12px 0; }
            table { border-collapse: collapse; width: 100%; margin: 16px 0; }
            td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            ul, ol { margin: 12px 0; padding-left: 24px; }
            blockquote { border-left: 4px solid #1a365d; margin: 16px 0; padding-left: 16px; color: #666; }
            img { max-width: 100%; height: auto; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>${contentRef.current.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-navy-800 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading document...</span>
      </div>
    )
  }

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
          Download Document Instead
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium truncate text-sm sm:text-base">{title}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 p-2 sm:px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Print document"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Print</span>
          </button>
          <a
            href={url}
            download={title}
            className="flex items-center gap-2 p-2 sm:px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Download document"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Document Content — flows with the page on mobile, scrolls in place on desktop */}
      <div className="overflow-auto p-4 sm:p-8 md:max-h-[calc(100vh-240px)]">
        <article
          ref={contentRef}
          className="docx-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
