import { notFound } from 'next/navigation'
import GuestScriptView from '@/components/guest/GuestScriptView'

async function getScript(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/guion/${token}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function GuestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const script = await getScript(token)

  if (!script || script.error) {
    notFound()
  }

  return (
    <GuestScriptView script={script} />
  )
}
