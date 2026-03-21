import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password === process.env.STUDIO_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('studio-auth', password, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 30 })
    return res
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}
