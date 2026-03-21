'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

interface ScriptCardProps {
  script: {
    id: string
    share_token: string
    guest_name?: string
    company?: string
    episode_number?: number | string
    season_number?: number | string
    status?: string
    created_at?: string
  }
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'rgba(160,155,147,0.2)',
  review: 'rgba(224,168,88,0.15)',
  approved: 'rgba(34,197,94,0.15)',
}

const STATUS_TEXT_COLORS: Record<string, string> = {
  draft: 'var(--text-sec)',
  review: 'var(--gold)',
  approved: '#4ade80',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  review: 'En revisión',
  approved: 'Aprobado',
}

export default function ScriptCard({ script }: ScriptCardProps) {
  const [copied, setCopied] = useState(false)
  const [epNum, setEpNum] = useState<string>(script.episode_number != null ? String(script.episode_number) : '')
  const [editingEp, setEditingEp] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function copyLink() {
    const url = `${window.location.origin}/guion/${script.share_token}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function startEdit(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setEditingEp(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function saveEp() {
    setEditingEp(false)
    const val = epNum.trim()
    const num = val ? parseInt(val) : null
    await fetch(`/api/scripts/${script.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode_number: num }),
    })
  }

  function handleEpKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEp()
    if (e.key === 'Escape') setEditingEp(false)
  }

  const status = script.status ?? 'draft'
  const season = script.season_number ?? 1

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Season + Episode row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            T{season}
          </span>
          {editingEp ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700 }}> · Ep.</span>
              <input
                ref={inputRef}
                type="number"
                value={epNum}
                onChange={(e) => setEpNum(e.target.value)}
                onBlur={saveEp}
                onKeyDown={handleEpKey}
                placeholder="N"
                style={{
                  width: 40,
                  background: 'rgba(224,168,88,0.1)',
                  border: '1px solid var(--gold)',
                  borderRadius: 4,
                  color: 'var(--gold)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '1px 4px',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
            </span>
          ) : (
            <button
              onClick={startEdit}
              title="Editar número de episodio"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--gold)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: epNum ? 'none' : 'underline dotted',
                opacity: epNum ? 1 : 0.5,
              }}
            >
              {epNum ? ` · Ep. ${epNum}` : ' · Ep. ?'}
            </button>
          )}
        </div>

        <Link href={`/studio/guion/${script.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ color: 'var(--text-pri)', fontWeight: 600, fontSize: '1rem' }}>
              {script.guest_name ?? 'Sin invitado'}
            </span>
            {script.company && (
              <span style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>
                {script.company}
              </span>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{
                background: STATUS_COLORS[status] ?? STATUS_COLORS.draft,
                color: STATUS_TEXT_COLORS[status] ?? STATUS_TEXT_COLORS.draft,
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>
                {STATUS_LABELS[status] ?? status}
              </span>
              {script.created_at && (
                <span style={{ color: 'var(--text-ter)', fontSize: '0.75rem' }}>
                  {new Date(script.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      <button
        onClick={copyLink}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: copied ? 'var(--gold)' : 'var(--text-sec)',
          fontSize: '0.75rem',
          padding: '6px 10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'color 200ms, border-color 200ms',
          flexShrink: 0,
        }}
      >
        {copied ? 'Copiado' : 'Copiar link'}
      </button>
    </div>
  )
}
