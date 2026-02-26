import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { getSICUHandoutBySlug } from '@/lib/sicuHandouts'
import { getDocxAssetPath, getPublicFileStats, resolvePublicAssetAbsolute } from '@/lib/handoutAdmin'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

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

  const docxPath = getDocxAssetPath(handout)
  if (!docxPath) {
    return NextResponse.json({ error: 'This handout has no DOCX asset to replace' }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const uploaded = formData.get('file')

    if (!(uploaded instanceof File)) {
      return NextResponse.json({ error: 'DOCX file is required' }, { status: 400 })
    }

    if (!uploaded.name.toLowerCase().endsWith('.docx')) {
      return NextResponse.json({ error: 'Only .docx files are supported' }, { status: 400 })
    }

    const absolutePath = resolvePublicAssetAbsolute(docxPath)
    const fileBuffer = Buffer.from(await uploaded.arrayBuffer())
    await writeFile(absolutePath, fileBuffer)
    const stats = await getPublicFileStats(docxPath)

    return NextResponse.json({
      success: true,
      slug,
      docxPath,
      stats
    })
  } catch (error) {
    console.error('Failed to replace DOCX file', error)
    return NextResponse.json({ error: 'Failed to replace DOCX file' }, { status: 500 })
  }
}
