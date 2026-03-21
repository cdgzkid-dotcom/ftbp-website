'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Script {
  id: string
  share_token: string
  title?: string
  guest_name?: string
  guest_company?: string
  episode_number?: number | string
  season_number?: number | string
  status?: string
  created_at?: string
}

export default function ScriptList() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/scripts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setScripts(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const STATUS_LABELS: Record<string, string> = {
    draft: 'Borrador',
    review: 'Revisión',
    approved: 'Aprobado',
  }

  const STATUS_COLORS: Record<string, string> = {
    draft: 'var(--text-ter)',
    review: 'var(--gold)',
    approved: '#4ade80',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%' }}>
      <div style={{ padding: '0 1rem 1rem' }}>
        <button
          onClick={() => router.push('/studio/nuevo')}
          className="btn-primary"
          style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
        >
          + Nuevo guion
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <p style={{ color: 'var(--text-ter)', fontSize: '0.8125rem', padding: '0 1rem' }}>
            Cargando guiones…
          </p>
        )}

        {!loading && scripts.length === 0 && (
          <p style={{ color: 'var(--text-ter)', fontSize: '0.8125rem', padding: '0 1rem' }}>
            Sin guiones todavía.
          </p>
        )}

        {scripts.map((s) => {
          const status = s.status ?? 'draft'
          return (
            <Link
              key={s.id}
              href={`/studio/guion/${s.id}`}
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
            >
              {(s.season_number || s.episode_number) && (
                <div style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  {s.season_number ? `T${s.season_number}` : ''}{s.season_number && s.episode_number ? ' · ' : ''}{s.episode_number ? `Ep. ${s.episode_number}` : ''}
                </div>
              )}
              <div style={{ color: 'var(--text-pri)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1px' }}>
                {s.guest_name ?? 'Sin invitado'}
              </div>
              {s.title && (
                <div style={{ color: 'var(--text-sec)', fontSize: '0.775rem', marginBottom: '2px', lineHeight: '1.3' }}>
                  {s.title}
                </div>
              )}
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: STATUS_COLORS[status] ?? 'var(--text-ter)',
              }}>
                {STATUS_LABELS[status] ?? status}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
