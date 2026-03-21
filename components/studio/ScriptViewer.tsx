'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ScriptViewerProps {
  content: string
}

export default function ScriptViewer({ content }: ScriptViewerProps) {
  return (
    <div className="prose-studio">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ color: 'var(--text-pri)', fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', borderLeft: '3px solid var(--gold)', paddingLeft: '0.75rem' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ color: 'var(--text-pri)', fontSize: '1rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem' }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ color: 'var(--text-sec)', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '0.75rem' }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: 'var(--text-pri)', fontWeight: 600 }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul style={{ color: 'var(--text-sec)', paddingLeft: '1.25rem', marginBottom: '0.75rem', listStyleType: 'disc' }}>
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '0.25rem', lineHeight: '1.6' }}>
              {children}
            </li>
          ),
          hr: () => (
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />
          ),
          blockquote: ({ children }) => (
            <blockquote style={{ borderLeft: '3px solid var(--gold-border)', paddingLeft: '1rem', color: 'var(--text-sec)', margin: '1rem 0' }}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
