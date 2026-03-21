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
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/scripts')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setScripts(data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function deleteScript(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Borrar este guion? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    try {
      await fetch(`/api/scripts/${id}`, { method: 'DELETE' })
      setScripts((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setDeleting(null)
    }
  }

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
            <div
              key={s.id}
              style={{
                position: 'relative',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Link
                href={`/studio/guion/${s.id}`}
                style={{
                  display: 'block',
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                <div style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                  {`T${s.season_number ?? 1}`}{s.episode_number ? ` · Ep. ${s.episode_number}` : ''}
                </div>
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
              <button
                onClick={(e) => deleteScript(s.id, e)}
                disabled={deleting === s.id}
                title="Borrar guion"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.625rem',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: deleting === s.id ? 'not-allowed' : 'pointer',
                  color: 'var(--text-ter)',
                  fontSize: '0.9rem',
                  padding: '4px',
                  lineHeight: 1,
                  opacity: deleting === s.id ? 0.4 : 0.5,
                  transition: 'opacity 150ms, color 150ms',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.5'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-ter)' }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
