import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FileCategory } from '@/lib/supabase'

type SortField = 'created_at' | 'title' | 'updated_at'
type SortOrder = 'asc' | 'desc'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = (page - 1) * limit

    // Filter parameters
    const category = searchParams.get('category') as FileCategory | null

    // Sort parameters
    const sortBy = (searchParams.get('sortBy') || 'created_at') as SortField
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as SortOrder

    // Build query
    let query = supabase
      .from('files')
      .select('*', { count: 'exact' })

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      files: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
