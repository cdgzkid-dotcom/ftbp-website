'use client'

import { useState } from 'react'

interface CommentFormProps {
  scriptId: string
  blockRef?: string
  onSubmitted?: () => void
}

export default function CommentForm({ scriptId, blockRef, onSubmitted }: CommentFormProps) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim() || sending) return
    setSending(true)
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script_id: scriptId,
          block_ref: blockRef,
          author_name: name.trim() || null,
          content: comment.trim(),
        }),
      })

      // Notificación por correo via FormSubmit
      const emailData = new FormData()
      emailData.append('_subject', `Comentario en guion FTBP — ${blockRef ?? 'General'}`)
      emailData.append('_captcha', 'false')
      emailData.append('_template', 'table')
      emailData.append('Bloque', blockRef ?? 'General')
      emailData.append('Autor', name.trim() || 'Invitado')
      emailData.append('Comentario', comment.trim())
      emailData.append('Script ID', scriptId)
      await fetch('https://formsubmit.co/cdgzkid@gmail.com', {
        method: 'POST',
        body: emailData,
        headers: { Accept: 'application/json' },
      })

      setSent(true)
      onSubmitted?.()
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <p style={{ color: 'var(--gold)', fontSize: '0.875rem', padding: '0.75rem 0' }}>
        Comentario enviado. ¡Gracias!
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.75rem' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre (opcional)"
        style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--text-pri)',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          outline: 'none',
          fontFamily: 'var(--font-body)',
        }}
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Escribe tu comentario o sugerencia…"
        rows={3}
        required
        style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--text-pri)',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'var(--font-body)',
        }}
      />
      <button
        type="submit"
        disabled={sending || !comment.trim()}
        className="btn-primary"
        style={{
          alignSelf: 'flex-start',
          cursor: sending || !comment.trim() ? 'not-allowed' : 'pointer',
          opacity: sending || !comment.trim() ? 0.5 : 1,
        }}
      >
        {sending ? 'Enviando…' : 'Enviar comentario'}
      </button>
    </form>
  )
}
