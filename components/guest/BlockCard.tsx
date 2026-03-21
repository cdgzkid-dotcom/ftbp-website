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
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Block header */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.25rem',
          background: 'var(--gold-subtle)',
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
              color: 'var(--text-pri)',
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
      <div style={{ padding: '1.25rem' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => (
              <p style={{ color: 'var(--text-sec)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '0.625rem' }}>
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: 'var(--text-pri)', fontWeight: 600 }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{children}</em>
            ),
            ul: ({ children }) => (
              <ul style={{ color: 'var(--text-sec)', paddingLeft: '1.25rem', marginBottom: '0.5rem', listStyleType: 'disc' }}>
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
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
          {!submitted ? (
            <>
              <button
                onClick={() => setShowForm((v) => !v)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text-sec)',
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
                  el.style.borderColor = 'var(--border)'
                  el.style.color = 'var(--text-sec)'
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
            <p style={{ color: 'var(--gold)', fontSize: '0.8125rem' }}>
              Comentario enviado en este bloque.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
