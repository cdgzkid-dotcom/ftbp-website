import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ scriptId: string }> }
) {
  const { scriptId } = await params
  const { data, error } = await getSupabaseAdmin()
    .from('comments')
    .select('*')
    .eq('script_id', scriptId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
