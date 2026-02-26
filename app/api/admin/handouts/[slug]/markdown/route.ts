import { readFile, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { getSICUHandoutBySlug } from '@/lib/sicuHandouts'
import {
  getMarkdownAssetPath,
  getPublicFileStats,
  resolvePublicAssetAbsolute
} from '@/lib/handoutAdmin'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

function isAuthorized(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth')
  return authCookie?.value === 'true'
}

function getMarkdownPathOrError(slug: string): { markdownPath: string } | { error: NextResponse } {
  const handout = getSICUHandoutBySlug(slug)
  if (!handout) {
    return { error: NextResponse.json({ error: 'Handout not found' }, { status: 404 }) }
  }

  const markdownPath = getMarkdownAssetPath(handout)
  if (!markdownPath) {
    return { error: NextResponse.json({ error: 'This handout has no markdown asset' }, { status: 400 }) }
  }

  return { markdownPath }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const result = getMarkdownPathOrError(slug)
  if ('error' in result) {
    return result.error
  }

  try {
    const absolutePath = resolvePublicAssetAbsolute(result.markdownPath)
    const content = await readFile(absolutePath, 'utf-8')
    const stats = await getPublicFileStats(result.markdownPath)

    return NextResponse.json({
      slug,
      markdownPath: result.markdownPath,
      content,
      stats
    })
  } catch (error) {
    console.error('Failed to load markdown', error)
    return NextResponse.json({ error: 'Failed to load markdown content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const result = getMarkdownPathOrError(slug)
  if ('error' in result) {
    return result.error
  }

  try {
    const body = await request.json()
    const content = body?.content
    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid markdown content' }, { status: 400 })
    }

    const absolutePath = resolvePublicAssetAbsolute(result.markdownPath)
    await writeFile(absolutePath, content, 'utf-8')
    const stats = await getPublicFileStats(result.markdownPath)

    return NextResponse.json({
      success: true,
      slug,
      markdownPath: result.markdownPath,
      stats
    })
  } catch (error) {
    console.error('Failed to save markdown', error)
    return NextResponse.json({ error: 'Failed to save markdown content' }, { status: 500 })
  }
}
