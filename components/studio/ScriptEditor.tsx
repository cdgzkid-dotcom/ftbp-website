'use client'

import { useState } from 'react'

interface ScriptEditorProps {
  scriptId: string
  initialContent: string
  onSaved?: (content: string) => void
}

export default function ScriptEditor({ scriptId, initialContent, onSaved }: ScriptEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        setSaved(true)
        onSaved?.(content)
        setTimeout(() => setSaved(false), 2500)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          minHeight: '520px',
          background: 'var(--bg-input)',
          color: 'var(--text-pri)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          fontFamily: 'monospace',
          resize: 'vertical',
          outline: 'none',
        }}
        spellCheck={false}
      />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && (
          <span style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>
            Cambios guardados
          </span>
        )}
      </div>
    </div>
  )
}
