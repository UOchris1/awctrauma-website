import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return unauthorizedResponse()
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const algorithmId = formData.get('algorithmId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!algorithmId) {
      return NextResponse.json({ error: 'Algorithm ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Get file extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${algorithmId}.${ext}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('algorithms')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true // Replace if exists
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('algorithms')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // Update the algorithm record with the new image URL
    const { error: updateError } = await supabaseAdmin
      .from('algorithms')
      .update({ image_url: imageUrl })
      .eq('id', algorithmId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      image_url: imageUrl,
      imageUrl,
      path: uploadData.path
    })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
