'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ScriptViewer from '@/components/studio/ScriptViewer'
import ScriptEditor from '@/components/studio/ScriptEditor'
import Link from 'next/link'

interface Comment {
  id: string
  author_name?: string
  block_ref?: string
  content: string
  created_at: string
}

interface Script {
  id: string
  share_token: string
  guest_name?: string
  company?: string
  episode_number?: number | string
  season_number?: number | string
  status?: string
  content: string
  created_at?: string
  comments?: Comment[]
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  review: 'En revisión',
  approved: 'Aprobado',
}

export default function ScriptDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [epInput, setEpInput] = useState('')
  const [editingEp, setEditingEp] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/scripts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setScript(data)
        if (data.episode_number != null) {
          setEpInput(String(data.episode_number))
        } else if (data.content) {
          const m =
            data.content.match(/\*\*Episodio:\*\*\s*(\d+)/) ??
            data.content.match(/\bEpisodio\s+(\d+)\b/i) ??
            data.content.match(/\bEp\.?\s*(\d+)\b/i)
          if (m) setEpInput(m[1])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function saveEpisodeNumber() {
    if (!script) return
    setEditingEp(false)
    const num = epInput.trim() ? parseInt(epInput.trim()) : null
    await fetch(`/api/scripts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode_number: num }),
    })
    setScript((prev) => prev ? { ...prev, episode_number: num ?? undefined } : prev)
  }

  function copyGuestLink() {
    if (!script?.share_token) return
    const url = `${window.location.origin}/guion/${script.share_token}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  if (loading) {
    return (
      <div style={{ color: 'var(--text-sec)', padding: '2rem', fontSize: '0.9rem' }}>
        Cargando guion…
      </div>
    )
  }

  if (!script || (script as unknown as { error: string }).error) {
    return (
      <div style={{ color: '#f87171', padding: '2rem', fontSize: '0.9rem' }}>
        Guion no encontrado.{' '}
        <Link href="/studio" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
          Volver
        </Link>
      </div>
    )
  }

  const status = script.status ?? 'draft'
  const comments = script.comments ?? []

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Back */}
      <Link
        href="/studio"
        style={{ color: 'var(--text-sec)', fontSize: '0.8125rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}
      >
        ← Todos los guiones
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              T{script.season_number ?? 1}
            </span>
            {editingEp ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700 }}> · Ep.</span>
                <input
                  autoFocus
                  type="number"
                  value={epInput}
                  onChange={(e) => setEpInput(e.target.value)}
                  onBlur={saveEpisodeNumber}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEpisodeNumber(); if (e.key === 'Escape') setEditingEp(false) }}
                  placeholder="N"
                  style={{ width: 48, background: 'rgba(224,168,88,0.1)', border: '1px solid var(--gold)', borderRadius: 4, color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, padding: '1px 4px', outline: 'none' }}
                />
              </span>
            ) : (
              <button
                onClick={() => setEditingEp(true)}
                title="Editar número de episodio"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: epInput ? 'none' : 'underline dotted', opacity: epInput ? 1 : 0.6 }}
              >
                {epInput ? ` · Ep. ${epInput}` : ' · Ep. ?'}
              </button>
            )}
          </div>
          <h1 style={{ color: 'var(--text-pri)', fontSize: '1.375rem', fontWeight: 700, marginBottom: '4px' }}>
            {script.guest_name ?? 'Sin invitado'}
          </h1>
          {script.company && (
            <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', marginBottom: '6px' }}>
              {script.company}
            </p>
          )}
          <span
            style={{
              display: 'inline-block',
              background: status === 'approved' ? 'rgba(74,222,128,0.12)' : status === 'review' ? 'rgba(224,168,88,0.12)' : 'var(--border)',
              color: status === 'approved' ? '#4ade80' : status === 'review' ? 'var(--gold)' : 'var(--text-sec)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '3px 10px',
              borderRadius: '5px',
            }}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setEditMode((v) => !v)}
            className="btn-ghost"
            style={{ cursor: 'pointer' }}
          >
            {editMode ? 'Ver preview' : 'Editar'}
          </button>
          <button
            onClick={copyGuestLink}
            className="btn-primary"
            style={{ cursor: 'pointer' }}
          >
            {copiedLink ? 'Link copiado' : 'Compartir con invitado'}
          </button>
        </div>
      </div>

      {/* Script */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {editMode ? (
          <ScriptEditor
            scriptId={script.id}
            initialContent={script.content}
            onSaved={(c) => setScript((prev) => prev ? { ...prev, content: c } : prev)}
          />
        ) : (
          <ScriptViewer content={script.content} />
        )}
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <h2 style={{ color: 'var(--text-pri)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Comentarios del invitado ({comments.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-pri)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {c.author_name ?? 'Anónimo'}
                  </span>
                  {c.block_ref && (
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(224,168,88,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                      {c.block_ref}
                    </span>
                  )}
                  <span style={{ color: 'var(--text-ter)', fontSize: '0.75rem', marginLeft: 'auto' }}>
                    {new Date(c.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
