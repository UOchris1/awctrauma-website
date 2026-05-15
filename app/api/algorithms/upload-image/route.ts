import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminRequest, unauthorizedResponse } from '@/lib/adminAuth'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${algorithmId}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('algorithms')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('algorithms')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    const { error: updateError } = await supabase
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
  } catch (error) {
    console.error('Error uploading algorithm image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
