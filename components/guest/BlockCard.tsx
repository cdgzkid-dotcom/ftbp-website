'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CommentForm from './CommentForm'

interface BlockCardProps {
  scriptId: string
  blockTitle: string
  blockContent: string
  blockIndex: number
}

export default function BlockCard({ scriptId, blockTitle, blockContent, blockIndex }: BlockCardProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      style={{
        background: '#1A1B1D',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Block header */}
      <div
        className="guion-block-header"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '1rem 1.25rem',
          background: 'rgba(224,168,88,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              background: 'var(--gold)',
              color: '#111',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}
          >
            Bloque {blockIndex + 1}
          </span>
          <h3
            style={{
              color: '#F2F0ED',
              fontSize: '0.9375rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {blockTitle}
          </h3>
        </div>
      </div>

      {/* Block content */}
      <div className="guion-block-body" style={{ padding: '1.25rem' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p style={{ color: 'rgba(242,240,237,0.7)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '0.625rem' }}>
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: '#F2F0ED', fontWeight: 600 }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ color: '#E0A858', fontStyle: 'italic' }}>{children}</em>
            ),
            ul: ({ children }) => (
              <ul style={{ color: 'rgba(242,240,237,0.7)', paddingLeft: '1.25rem', marginBottom: '0.5rem', listStyleType: 'disc' }}>
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem', lineHeight: '1.6' }}>{children}</li>
            ),
          }}
        >
          {blockContent}
        </ReactMarkdown>

        {/* Comment toggle */}
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem' }}>
          {!submitted ? (
            <>
              <button
                onClick={() => setShowForm((v) => !v)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: 'rgba(242,240,237,0.6)',
                  fontSize: '0.8125rem',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms, color 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = 'var(--gold-border)'
                  el.style.color = 'var(--gold)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = 'rgba(255,255,255,0.12)'
                  el.style.color = 'rgba(242,240,237,0.6)'
                }}
              >
                {showForm ? 'Cancelar' : 'Dejar comentario'}
              </button>

              {showForm && (
                <CommentForm
                  scriptId={scriptId}
                  blockRef={`bloque-${blockIndex + 1}`}
                  onSubmitted={() => setSubmitted(true)}
                />
              )}
            </>
          ) : (
            <p style={{ color: '#E0A858', fontSize: '0.8125rem' }}>
              Comentario enviado en este bloque.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
