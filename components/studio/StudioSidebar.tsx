'use client'

import Link from 'next/link'
import ScriptList from './ScriptList'

export default function StudioSidebar() {
  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault()
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/studio/login'
  }

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: 'var(--bg-alt)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo area */}
      <div
        style={{
          padding: '1.25rem 1rem 1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--gold)',
              fontSize: '1.125rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            FTBP
          </span>
        </Link>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-ter)',
          }}
        >
          Studio
        </span>
      </div>

      {/* Scripts list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '1rem' }}>
        <p
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-ter)',
            padding: '0 1rem',
            marginBottom: '0.5rem',
          }}
        >
          Guiones
        </p>
        <ScriptList />
      </div>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <a
          href="/studio/login"
          onClick={handleLogout}
          style={{
            color: 'var(--text-ter)',
            fontSize: '0.8rem',
            textDecoration: 'none',
            display: 'block',
            padding: '0.5rem 0',
            transition: 'color 200ms',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-pri)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-ter)' }}
        >
          Cerrar sesión
        </a>
      </div>
    </aside>
  )
}
