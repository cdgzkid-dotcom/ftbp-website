export const dynamic = 'force-dynamic'

import Link from 'next/link'
import ScriptCard from '@/components/studio/ScriptCard'
import { getSupabaseAdmin } from '@/lib/supabase'

async function getScripts() {
  const { data } = await getSupabaseAdmin()
    .from('scripts')
    .select('id, share_token, guest_name, company, episode_number, status, created_at')
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
}

export default async function StudioPage() {
  const scripts = await getScripts()

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1
            style={{
              color: '#F2F0ED',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
            }}
          >
            Guiones
          </h1>
          <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: '0.875rem' }}>
            {scripts.length === 0
              ? 'No hay guiones todavía.'
              : `${scripts.length} guion${scripts.length !== 1 ? 'es' : ''} en total`}
          </p>
        </div>

        <Link href="/studio/nuevo" className="btn-primary">
          + Nuevo guion
        </Link>
      </div>

      {/* Scripts grid */}
      {scripts.length === 0 ? (
        <div
          style={{
            background: '#1A1B1D',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'rgba(242,240,237,0.4)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
            Todavía no hay guiones. Crea el primero para empezar.
          </p>
          <Link href="/studio/nuevo" className="btn-primary">
            Crear primer guion
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {scripts.map((s) => (
            <ScriptCard key={s.id} script={s} />
          ))}
        </div>
      )}
    </div>
  )
}
