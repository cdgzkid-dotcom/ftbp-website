'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div
      style={{
        minHeight: '100vh',
        background: '#0F1011',
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
          background: '#1A1B1D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2rem',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p style={{ color: '#E0A858', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            FTBP
          </p>
        </Link>
        <h1 style={{ color: '#F2F0ED', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.375rem' }}>
          Studio
        </h1>
        <p style={{ color: 'rgba(242,240,237,0.5)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
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
              background: '#161719',
              border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px',
              color: '#F2F0ED',
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
  )
}
