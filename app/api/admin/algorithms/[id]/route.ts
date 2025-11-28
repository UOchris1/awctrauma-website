import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single algorithm
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('algorithms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Algorithm not found' }, { status: 404 })
    }

    return NextResponse.json({ algorithm: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch algorithm' }, { status: 500 })
  }
}

// PUT - Update algorithm
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, short_title, icon_type, image_url, sort_order, is_active } = body

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (short_title !== undefined) updateData.short_title = short_title
    if (icon_type !== undefined) updateData.icon_type = icon_type
    if (image_url !== undefined) updateData.image_url = image_url
    if (sort_order !== undefined) updateData.sort_order = sort_order
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('algorithms')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ algorithm: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update algorithm' }, { status: 500 })
  }
}

// DELETE - Delete algorithm
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get the algorithm first to check for image
    const { data: algorithm } = await supabase
      .from('algorithms')
      .select('image_url')
      .eq('id', id)
      .single()

    // Delete from storage if image exists
    if (algorithm?.image_url) {
      const path = algorithm.image_url.split('/algorithms/')[1]
      if (path) {
        await supabase.storage.from('algorithms').remove([path])
      }
    }

    // Delete the record
    const { error } = await supabase
      .from('algorithms')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete algorithm' }, { status: 500 })
  }
}
