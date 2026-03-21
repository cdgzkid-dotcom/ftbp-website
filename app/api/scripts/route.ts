import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const share_token = randomBytes(16).toString('hex')

  const { data, error } = await getSupabaseAdmin()
    .from('scripts')
    .insert({
      ...body,
      share_token,
      status: body.status ?? 'draft',
    })
    .select('id, share_token')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
