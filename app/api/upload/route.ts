import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FileType } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Allowed MIME types and their corresponding file types
const ALLOWED_TYPES: Record<string, FileType> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc'
}

// File extensions for each type
const FILE_EXTENSIONS: Record<FileType, string> = {
  'pdf': '.pdf',
  'docx': '.docx',
  'doc': '.doc'
}

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    // Validate inputs
    if (!file || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate file type
    const fileType = ALLOWED_TYPES[file.type]
    if (!fileType) {
      return NextResponse.json(
        { error: 'Only PDF and Word documents (.pdf, .docx, .doc) are allowed' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename with correct extension
    const extension = FILE_EXTENSIONS[fileType]
    const fileName = `${uuidv4()}${extension}`
    const filePath = `${category}/${fileName}`

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('guidelines')
      .upload(filePath, fileData, {
        contentType: file.type,
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('guidelines')
      .getPublicUrl(filePath)

    // Create database record with file metadata
    const { data: dbData, error: dbError } = await supabase
      .from('files')
      .insert({
        title,
        description: description || null,
        file_url: publicUrl,
        category,
        file_type: fileType,
        file_size: file.size,
        original_filename: file.name
      })
      .select()
      .single()

    if (dbError) {
      // Rollback: delete uploaded file
      await supabase.storage.from('guidelines').remove([filePath])
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save file record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      file: dbData
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
