'use client'

import { useEffect, useRef, useState } from 'react'
import ScriptViewer from './ScriptViewer'
import ScriptEditor from './ScriptEditor'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hola, vamos a preparar el guion. ¿Quién es el invitado de este episodio?',
}

function isScriptGenerated(text: string): boolean {
  return text.includes('---') && /^#\s+.+/m.test(text)
}

function extractScript(messages: Message[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role === 'assistant' && isScriptGenerated(msg.content)) {
      return msg.content
    }
  }
  return ''
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [scriptContent, setScriptContent] = useState('')
  const [scriptId, setScriptId] = useState<string | null>(null)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const script = extractScript(messages)
    if (script) setScriptContent(script)
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Error en la respuesta del servidor')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const type = parsed.type

            if (type === 'content_block_delta') {
              const delta = parsed.delta
              if (delta?.type === 'text_delta' && typeof delta.text === 'string') {
                accumulated += delta.text
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'assistant', content: accumulated }
                  return updated
                })
              }
            } else if (type === 'message_stop') {
              break
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Hubo un error. Por favor intenta de nuevo.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function saveScript() {
    if (!scriptContent || saving) return
    setSaving(true)
    try {
      // Extract title from "# TÍTULO — SUBTÍTULO"
      const titleMatch = scriptContent.match(/^#\s+(.+)/m)
      const title = titleMatch ? titleMatch[1].trim() : 'Sin título'

      // Extract guest name from "**Invitado:** Nombre — ..."
      const guestMatch = scriptContent.match(/\*\*Invitado:\*\*\s*([^—\n]+)/)
      const guest_name = guestMatch ? guestMatch[1].trim() : 'Invitado'

      // Extract episode number from "Episodio N" or "Ep. N" in the content
      const epMatch = scriptContent.match(/(?:episodio|ep\.?)\s*(\d+)/i)
      const episode_number = epMatch ? parseInt(epMatch[1]) : null

      const res = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: scriptContent, title, guest_name, season_number: 1, episode_number, status: 'draft' }),
      })
      const data = await res.json()
      if (data.id) {
        setScriptId(data.id)
        setShareToken(data.share_token)
      } else {
        alert('Error al guardar: ' + (data.error ?? 'desconocido'))
      }
    } catch (e) {
      alert('Error de conexión al guardar.')
    } finally {
      setSaving(false)
    }
  }

  function copyGuestLink() {
    if (!shareToken) return
    const url = `${window.location.origin}/guion/${shareToken}`
    navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Chat area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '520px',
        }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: msg.role === 'user'
                    ? 'rgba(224,168,88,0.12)'
                    : 'var(--bg-input)',
                  border: '1px solid',
                  borderColor: msg.role === 'user'
                    ? 'var(--gold-border)'
                    : 'var(--border)',
                  color: 'var(--text-pri)',
                  fontSize: '0.9rem',
                  lineHeight: '1.65',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content || (loading && i === messages.length - 1 ? null : '')}
                {!msg.content && loading && i === messages.length - 1 && (
                  <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                    <span style={dotStyle(0)} />
                    <span style={dotStyle(200)} />
                    <span style={dotStyle(400)} />
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px 12px 12px 4px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  <span style={dotStyle(0)} />
                  <span style={dotStyle(200)} />
                  <span style={dotStyle(400)} />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '0.875rem 1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Escribe aquí… (Enter para enviar)"
            rows={1}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-pri)',
              padding: '0.625rem 0.875rem',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              resize: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              opacity: loading ? 0.6 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Script section */}
      {scriptContent && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-border)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <h2 style={{ color: 'var(--text-pri)', fontSize: '1rem', fontWeight: 700, flex: 1 }}>
              Guion generado
            </h2>

            {!scriptId && (
              <button
                onClick={saveScript}
                disabled={saving}
                className="btn-primary"
                style={{ cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Guardando…' : 'Guardar guion'}
              </button>
            )}

            <button
              onClick={() => setEditMode((v) => !v)}
              className="btn-ghost"
              style={{ cursor: 'pointer' }}
            >
              {editMode ? 'Ver preview' : 'Editar'}
            </button>

            {shareToken && (
              <button
                onClick={copyGuestLink}
                className="btn-primary"
                style={{ cursor: 'pointer' }}
              >
                {copiedLink ? 'Link copiado' : 'Compartir con invitado'}
              </button>
            )}
          </div>

          {editMode && scriptId ? (
            <ScriptEditor
              scriptId={scriptId}
              initialContent={scriptContent}
              onSaved={(c) => setScriptContent(c)}
            />
          ) : (
            <ScriptViewer content={scriptContent} />
          )}
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function dotStyle(delay: number): React.CSSProperties {
  return {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--gold)',
    display: 'inline-block',
    animation: `blink 1.2s ease-in-out ${delay}ms infinite`,
  }
}
