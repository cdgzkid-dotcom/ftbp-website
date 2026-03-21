'use client'

import { useState } from 'react'

interface ApproveButtonProps {
  scriptId: string
}

export default function ApproveButton({ scriptId }: ApproveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleApprove() {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const res = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        setStatus('idle')
      }
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div
        style={{
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
          Guion aprobado
        </p>
        <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>
          El equipo de producción fue notificado. ¡Nos vemos en el episodio!
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={handleApprove}
      disabled={status === 'loading'}
      className="btn-primary"
      style={{
        width: '100%',
        padding: '0.875rem',
        fontSize: '0.9375rem',
        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        opacity: status === 'loading' ? 0.7 : 1,
        textAlign: 'center',
      }}
    >
      {status === 'loading' ? 'Procesando…' : 'Aprobar guion'}
    </button>
  )
}
