import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all algorithms
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('algorithms')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching algorithms:', error)
      return NextResponse.json({ error: 'Failed to fetch algorithms' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new algorithm
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, short_title, icon_type, card_color, image_url, sort_order } = body

    if (!title || !short_title) {
      return NextResponse.json({ error: 'Title and short_title are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('algorithms')
      .insert({
        title,
        short_title,
        icon_type: icon_type || 'default',
        card_color: card_color || 'auto',
        image_url: image_url || null,
        sort_order: sort_order || 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating algorithm:', error)
      return NextResponse.json({ error: 'Failed to create algorithm' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
