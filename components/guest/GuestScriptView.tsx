'use client'

import { useMemo } from 'react'
import BlockCard from './BlockCard'
import ApproveButton from './ApproveButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface GuestScriptViewProps {
  script: {
    id: string
    content: string
    guest_name?: string
    company?: string
    episode_number?: number | string
    status?: string
  }
}

function parseBlocks(content: string): { title: string; body: string }[] {
  // Split by ## headings that look like block titles
  const blockRegex = /^## (BLOQUE \d+[^\n]*)/gm
  const blocks: { title: string; body: string }[] = []

  const matches = [...content.matchAll(blockRegex)]
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const start = (match.index ?? 0) + match[0].length
    const end = matches[i + 1]?.index ?? content.length
    const title = match[1].replace(/\s*\(\d+:\d+\s*-\s*\d+:\d+\)/, '').trim()
    const body = content.slice(start, end).trim()
    blocks.push({ title, body })
  }

  return blocks
}

function parseHeader(content: string): string {
  const idx = content.indexOf('## BLOQUE 1')
  if (idx === -1) return content.split('\n').slice(0, 12).join('\n')
  return content.slice(0, idx).trim()
}

function parseCierre(content: string): string | null {
  const idx = content.indexOf('## CIERRE')
  if (idx === -1) return null
  return content.slice(idx).trim()
}

export default function GuestScriptView({ script }: GuestScriptViewProps) {
  const blocks = useMemo(() => parseBlocks(script.content), [script.content])
  const header = useMemo(() => parseHeader(script.content), [script.content])
  const cierre = useMemo(() => parseCierre(script.content), [script.content])

  const isApproved = script.status === 'approved'

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '1rem',
        minHeight: '100vh',
        background: '#161719',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Welcome banner */}
      <div
        style={{
          background: 'rgba(224,168,88,0.08)',
          border: '1px solid rgba(224,168,88,0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p style={{ color: '#E0A858', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
          Fuck The Business Plan — Guion de episodio
        </p>
        <h1 style={{ color: '#F2F0ED', fontSize: '1.375rem', fontWeight: 700, lineHeight: '1.3', marginBottom: '0.5rem' }}>
          Hola{script.guest_name ? `, ${script.guest_name}` : ''}
        </h1>
        <p style={{ color: 'rgba(242,240,237,0.65)', fontSize: '0.9rem', lineHeight: '1.65' }}>
          Aquí está el guion de conversación que preparamos para tu episodio. Está pensado como una guía,
          no como un script. Léelo con calma, deja comentarios en los bloques que quieras ajustar,
          y apruébalo cuando estés listo.
        </p>
      </div>

      {/* Header / metadata */}
      <div
        style={{
          background: '#1A1B1D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h2 style={{ color: '#E0A858', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p style={{ color: 'rgba(242,240,237,0.7)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.375rem' }}>
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: '#F2F0ED', fontWeight: 600 }}>{children}</strong>
            ),
            hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '0.75rem 0' }} />,
          }}
        >
          {header}
        </ReactMarkdown>
      </div>

      {/* Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {blocks.map((block, i) => (
          <BlockCard
            key={i}
            scriptId={script.id}
            blockTitle={block.title}
            blockContent={block.body}
            blockIndex={i}
          />
        ))}
      </div>

      {/* Cierre */}
      {cierre && (
        <div
          style={{
            background: '#1A1B1D',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h3 style={{ color: '#F2F0ED', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', borderLeft: '3px solid #E0A858', paddingLeft: '0.75rem' }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ color: 'rgba(242,240,237,0.7)', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '0.5rem' }}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: '#F2F0ED', fontWeight: 600 }}>{children}</strong>
              ),
              ul: ({ children }) => (
                <ul style={{ color: 'rgba(242,240,237,0.65)', paddingLeft: '1.25rem', marginBottom: '0.5rem', listStyleType: 'disc' }}>
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem', lineHeight: '1.6' }}>{children}</li>
              ),
            }}
          >
            {cierre}
          </ReactMarkdown>
        </div>
      )}

      {/* Approve button */}
      {!isApproved && (
        <div
          style={{
            background: '#1A1B1D',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <p style={{ color: 'rgba(242,240,237,0.6)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            ¿Todo bien con el guion? Al aprobarlo le avisas al equipo de producción que estás listo.
            Si quieres cambios, deja un comentario en el bloque correspondiente.
          </p>
          <ApproveButton scriptId={script.id} />
        </div>
      )}

      {isApproved && (
        <div
          style={{
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#4ade80', fontWeight: 700, marginBottom: '0.25rem' }}>Guion aprobado</p>
          <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: '0.875rem' }}>El equipo de producción fue notificado.</p>
        </div>
      )}

      {/* Footer con plataformas y redes */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', paddingBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ color: '#E0A858', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Escúchanos en
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
          {[
            { label: '🎙 Spotify', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
            { label: '🎵 Apple Podcasts', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
            { label: '🎶 Amazon Music', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
          ].map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(242,240,237,0.7)',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
            >
              {p.label}
            </a>
          ))}
        </div>
        <a
          href="https://www.instagram.com/fuckthebusinessplan/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(242,240,237,0.4)', fontSize: '0.8125rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}
        >
          📷 @fuckthebusinessplan
        </a>
        <p style={{ color: 'rgba(242,240,237,0.25)', fontSize: '0.75rem' }}>
          Fuck The Business Plan — Guadalajara, México
        </p>
      </div>
    </div>
  )
}
