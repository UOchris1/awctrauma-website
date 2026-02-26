import { execFile } from 'child_process'
import { promisify } from 'util'
import { NextRequest, NextResponse } from 'next/server'
import { getSICUHandoutBySlug } from '@/lib/sicuHandouts'
import { getDocxAssetPath, getMarkdownAssetPath, getPublicFileStats, resolvePublicAssetAbsolute } from '@/lib/handoutAdmin'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

const execFileAsync = promisify(execFile)

function isAuthorized(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth')
  return authCookie?.value === 'true'
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const handout = getSICUHandoutBySlug(slug)
  if (!handout) {
    return NextResponse.json({ error: 'Handout not found' }, { status: 404 })
  }

  const markdownPath = getMarkdownAssetPath(handout)
  const docxPath = getDocxAssetPath(handout)
  if (!markdownPath || !docxPath) {
    return NextResponse.json(
      { error: 'This handout must have both markdown and DOCX paths to generate output' },
      { status: 400 }
    )
  }

  try {
    const markdownAbsolute = resolvePublicAssetAbsolute(markdownPath)
    const docxAbsolute = resolvePublicAssetAbsolute(docxPath)
    await execFileAsync('pandoc', [markdownAbsolute, '-o', docxAbsolute])
    const stats = await getPublicFileStats(docxPath)

    return NextResponse.json({
      success: true,
      slug,
      docxPath,
      stats
    })
  } catch (error) {
    const err = error as Error & { stderr?: string }
    const stderr = err.stderr?.trim()
    return NextResponse.json(
      {
        error: stderr ? `Pandoc failed: ${stderr}` : `Pandoc failed: ${err.message}`
      },
      { status: 500 }
    )
  }
}
