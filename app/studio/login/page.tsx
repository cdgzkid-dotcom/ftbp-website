'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeManager from '@/components/ThemeManager'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/studio')
      } else {
        setError('Contraseña incorrecta.')
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeManager>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              FTBP
            </p>
          </Link>
          <h1 style={{ color: 'var(--text-pri)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.375rem' }}>
            Studio
          </h1>
          <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Ingresa la contraseña para acceder al panel de producción.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoFocus
              style={{
                background: 'var(--bg)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
                borderRadius: '8px',
                color: 'var(--text-pri)',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 200ms',
              }}
            />

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.8125rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9375rem',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                opacity: loading || !password ? 0.6 : 1,
                textAlign: 'center',
              }}
            >
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </ThemeManager>
  )
}
