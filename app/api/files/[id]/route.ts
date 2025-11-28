import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FileCategory } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single file
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ file: data })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update file metadata
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const { title, description, category } = body as {
      title?: string
      description?: string
      category?: FileCategory
    }

    if (!title && description === undefined && !category) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: Record<string, unknown> = {}
    if (title) updates.title = title
    if (description !== undefined) updates.description = description || null
    if (category) updates.category = category

    const { data, error } = await supabase
      .from('files')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      )
    }

    return NextResponse.json({ file: data })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE file
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // First, get the file record to find the storage path
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('file_url, category')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
      console.error('Database error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch file' },
        { status: 500 }
      )
    }

    // Extract file path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/guidelines/category/filename.ext
    const urlParts = file.file_url.split('/guidelines/')
    const filePath = urlParts[1] || null

    // Delete from database
    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete file record' },
        { status: 500 }
      )
    }

    // Delete from storage if we have the path
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('guidelines')
        .remove([filePath])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        // Continue even if storage delete fails - record is already deleted
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
