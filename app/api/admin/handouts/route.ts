import { NextRequest, NextResponse } from 'next/server'
import { sicuHandouts } from '@/lib/sicuHandouts'
import { getDocxAssetPath, getMarkdownAssetPath, getPublicFileStats } from '@/lib/handoutAdmin'

function isAuthorized(request: NextRequest): boolean {
  const authCookie = request.cookies.get('admin-auth')
  return authCookie?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const handouts = await Promise.all(
      sicuHandouts.map(async (handout) => {
        const markdownPath = getMarkdownAssetPath(handout)
        const docxPath = getDocxAssetPath(handout)
        const previewStats = await getPublicFileStats(handout.previewPath)
        const markdownStats = markdownPath ? await getPublicFileStats(markdownPath) : null
        const docxStats = docxPath ? await getPublicFileStats(docxPath) : null

        const assets = await Promise.all(
          handout.assets.map(async (asset) => ({
            ...asset,
            ...(await getPublicFileStats(asset.path))
          }))
        )

        return {
          slug: handout.slug,
          group: handout.group,
          title: handout.title,
          summary: handout.summary,
          previewType: handout.previewType,
          previewPath: handout.previewPath,
          markdownPath,
          docxPath,
          previewStats,
          markdownStats,
          docxStats,
          assets
        }
      })
    )

    return NextResponse.json({ handouts })
  } catch (error) {
    console.error('Failed to list handouts', error)
    return NextResponse.json({ error: 'Failed to list handouts' }, { status: 500 })
  }
}
