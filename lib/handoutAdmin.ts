import path from 'path'
import { stat } from 'fs/promises'
import type { SICUHandout } from '@/lib/sicuHandouts'

const PUBLIC_ROOT = path.resolve(process.cwd(), 'public')

function normalizePublicPath(publicPath: string): string {
  return publicPath.replace(/^\/+/, '')
}

export function resolvePublicAssetAbsolute(publicPath: string): string {
  const absolutePath = path.resolve(PUBLIC_ROOT, normalizePublicPath(publicPath))
  const publicRootWithSep = `${PUBLIC_ROOT}${path.sep}`

  if (absolutePath !== PUBLIC_ROOT && !absolutePath.startsWith(publicRootWithSep)) {
    throw new Error('Invalid public asset path')
  }

  return absolutePath
}

export function getMarkdownAssetPath(handout: SICUHandout): string | null {
  if (handout.previewType === 'markdown' && handout.previewPath.toLowerCase().endsWith('.md')) {
    return handout.previewPath
  }

  const markdownAsset = handout.assets.find((asset) => asset.path.toLowerCase().endsWith('.md'))
  return markdownAsset?.path ?? null
}

export function getDocxAssetPath(handout: SICUHandout): string | null {
  if (handout.previewType === 'docx' && handout.previewPath.toLowerCase().endsWith('.docx')) {
    return handout.previewPath
  }

  const docxAsset = handout.assets.find((asset) => asset.path.toLowerCase().endsWith('.docx'))
  return docxAsset?.path ?? null
}

export interface PublicFileStats {
  exists: boolean
  sizeBytes: number | null
  lastModified: string | null
}

export async function getPublicFileStats(publicPath: string): Promise<PublicFileStats> {
  try {
    const absolutePath = resolvePublicAssetAbsolute(publicPath)
    const fileStats = await stat(absolutePath)
    return {
      exists: true,
      sizeBytes: fileStats.size,
      lastModified: fileStats.mtime.toISOString()
    }
  } catch {
    return {
      exists: false,
      sizeBytes: null,
      lastModified: null
    }
  }
}
