import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// POST - Persist a new display order for algorithms.
// Body: { ids: string[] } in the desired order; each row's sort_order is set to its index.
export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const ids = body?.ids

    if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== 'string')) {
      return NextResponse.json({ error: 'ids must be a non-empty array of strings' }, { status: 400 })
    }

    const results = await Promise.all(
      ids.map((id: string, index: number) =>
        supabaseAdmin.from('algorithms').update({ sort_order: index }).eq('id', id)
      )
    )

    const failed = results.find((r) => r.error)
    if (failed?.error) {
      console.error('Error reordering algorithms:', failed.error)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
