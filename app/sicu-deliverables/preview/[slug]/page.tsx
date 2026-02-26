import path from 'path'
import { readFile } from 'fs/promises'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DocumentViewer from '@/components/DocumentViewer'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { FileRecord } from '@/lib/supabase'
import { getSICUHandoutBySlug } from '@/lib/sicuHandouts'

type Props = {
  params: Promise<{
    slug: string
  }>
}

function getFileType(filePath: string): 'pdf' | 'docx' | 'doc' | undefined {
  const ext = filePath.split('.').pop()?.toLowerCase()
  if (ext === 'pdf' || ext === 'docx' || ext === 'doc') return ext
  return undefined
}

export default async function HandoutPreviewPage({ params }: Props) {
  const { slug } = await params
  const handout = getSICUHandoutBySlug(slug)

  if (!handout) {
    notFound()
  }

  if (handout.previewType === 'markdown') {
    const absPath = path.join(process.cwd(), 'public', handout.previewPath.replace(/^\//, ''))
    let content = ''

    try {
      content = await readFile(absPath, 'utf-8')
    } catch {
      notFound()
    }

    return (
      <div className="min-h-screen bg-silver-100">
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white">
          <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-white">{handout.title}</h1>
              <p className="text-sm text-silver-300">Markdown Preview</p>
            </div>
            <Link
              href="/sicu-deliverables"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              Back to Handouts
            </Link>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="bg-white rounded-lg border border-silver-200 p-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {handout.assets.map((asset) => (
                <a
                  key={asset.path}
                  href={asset.path}
                  download
                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors text-sm font-medium"
                >
                  Download {asset.label}
                </a>
              ))}
            </div>
          </div>

          <article className="bg-white rounded-xl shadow-md border border-silver-200 p-6 sm:p-8">
            <MarkdownRenderer content={content} />
          </article>
        </div>
      </div>
    )
  }

  const fileType = getFileType(handout.previewPath)
  if (!fileType) {
    notFound()
  }

  const fileForViewer: FileRecord = {
    id: handout.slug,
    created_at: new Date().toISOString(),
    title: handout.title,
    description: handout.summary,
    file_url: handout.previewPath,
    category: 'resources',
    file_type: fileType
  }

  return (
    <div className="min-h-screen bg-silver-100">
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white">{handout.title}</h1>
            <p className="text-sm text-silver-300">Document Preview</p>
          </div>
          <Link
            href="/sicu-deliverables"
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            Back to Handouts
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="bg-white rounded-lg border border-silver-200 p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {handout.assets.map((asset) => (
              <a
                key={asset.path}
                href={asset.path}
                download
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors text-sm font-medium"
              >
                Download {asset.label}
              </a>
            ))}
          </div>
        </div>
        <DocumentViewer file={fileForViewer} />
      </div>
    </div>
  )
}
