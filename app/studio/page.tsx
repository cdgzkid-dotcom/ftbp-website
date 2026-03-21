'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ScriptCard from '@/components/studio/ScriptCard'

interface Script {
  id: string
  share_token: string
  guest_name?: string
  company?: string
  episode_number?: number | string
  season_number?: number | string
  status?: string
  created_at?: string
}

export default function StudioPage() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scripts')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setScripts(data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#F2F0ED', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Guiones
          </h1>
          <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: '0.875rem' }}>
            {loading
              ? 'Cargando…'
              : scripts.length === 0
              ? 'No hay guiones todavía.'
              : `${scripts.length} guion${scripts.length !== 1 ? 'es' : ''} en total`}
          </p>
        </div>

        <Link href="/studio/nuevo" className="btn-primary">
          + Nuevo guion
        </Link>
      </div>

      {/* Scripts grid */}
      {!loading && scripts.length === 0 ? (
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
