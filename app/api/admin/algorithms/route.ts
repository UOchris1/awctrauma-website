import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - List all algorithms
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('algorithms')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ algorithms: data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch algorithms' }, { status: 500 })
  }
}

// POST - Create new algorithm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, short_title, icon_type, image_url, sort_order, is_active } = body

    if (!title || !short_title) {
      return NextResponse.json({ error: 'Title and short title are required' }, { status: 400 })
    }

    // Get max sort_order if not provided
    let finalSortOrder = sort_order
    if (finalSortOrder === undefined) {
      const { data: maxData } = await supabase
        .from('algorithms')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)

      finalSortOrder = maxData && maxData.length > 0 ? maxData[0].sort_order + 1 : 1
    }

    const { data, error } = await supabase
      .from('algorithms')
      .insert({
        title,
        short_title,
        icon_type: icon_type || 'default',
        image_url: image_url || null,
        sort_order: finalSortOrder,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ algorithm: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create algorithm' }, { status: 500 })
  }
}
