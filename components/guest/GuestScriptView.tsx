'use client'

import { useMemo, useRef, useState } from 'react'
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

const PLATFORMS = [
  { label: '🎙 Spotify', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
  { label: '🎵 Apple Podcasts', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
  { label: '🎶 Amazon Music', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
]

// Mobile-only: logos oficiales vía simpleicons CDN + color de marca en hover
const MOBILE_PLATFORMS = [
  { label: 'Spotify',        slug: 'spotify',        color: '1DB954', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
  { label: 'Apple Podcasts', slug: 'applepodcasts',   color: 'B150E2', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
  { label: 'Amazon Music',   slug: 'amazonmusic',     color: '00A8E1', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
  { label: 'Instagram',      slug: 'instagram',       color: 'E1306C', href: 'https://www.instagram.com/fuckthebusinessplan/' },
  { label: 'WhatsApp',       slug: 'whatsapp',        color: '25D366', href: 'https://wa.me/523338155238' },
]

const HOSTS = [
  { name: 'Christian Dominguez', image: '/images/christian.jpg' },
  { name: 'Juan Carlos Rico', image: '/images/juancarlos.png' },
]

interface Episode {
  number: number
  title: string
  pubDate: string
  duration: string
  imageUrl: string
  audioUrl: string
  guest?: string
}

function extractGuestAndCompany(title: string): { guest: string; company: string } {
  const clean = title.split(' | ')[0].trim()

  // "con Name de Company" or "— con Name de Company"
  const conDe = clean.match(/\bcon\s+([A-ZÁÉÍÓÚÑ][A-Za-záéíóúüñÁÉÍÓÚÜÑ .]+?)\s+de\s+([A-ZÁÉÍÓÚÑ][^,|—\n]+?)(?:\s*$|\s*[—|,])/u)
  if (conDe) return { guest: conDe[1].trim(), company: conDe[2].trim() }

  // "— Name, Company [| ...]"
  const dashComma = clean.match(/—\s+([A-ZÁÉÍÓÚÑ][^,|—\n]+?),\s*([^,|—\n]+?)(?:\s*$|\s*[|—])/u)
  if (dashComma) return { guest: dashComma[1].trim(), company: dashComma[2].trim() }

  // "— Name de Company"
  const dashDe = clean.match(/—\s+([A-ZÁÉÍÓÚÑ][^,|—\n]+?)\s+de\s+([A-ZÁÉÍÓÚÑ][^,|—\n]+?)(?:\s*$|\s*[—|,])/u)
  if (dashDe) return { guest: dashDe[1].trim(), company: dashDe[2].trim() }

  // "con Name" (no company)
  const con = clean.match(/\bcon\s+([A-ZÁÉÍÓÚÑ][^|—\n,]+?)(?:\s*$|\s*[—|,])/u)
  if (con) return { guest: con[1].trim(), company: '' }

  // "— Name" (no company)
  const dash = clean.match(/—\s+([A-ZÁÉÍÓÚÑ][^,|—\n]+?)(?:\s*$|\s*[|—,])/u)
  if (dash) return { guest: dash[1].trim(), company: '' }

  return { guest: '', company: '' }
}

function EpisodePlayer({ ep }: { ep: Episode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const { guest, company } = extractGuestAndCompany(ep.title)

  return (
    <div style={{ background: '#1A1B1D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden' }}>
      <audio
        ref={audioRef}
        src={ep.audioUrl}
        onTimeUpdate={() => {
          const a = audioRef.current!
          setCurrent(a.currentTime)
          setDuration(a.duration)
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
        }}
        onEnded={() => setPlaying(false)}
      />
      <div style={{ display: 'flex', gap: '0.625rem', padding: '0.625rem', alignItems: 'center' }}>
        <button
          onClick={toggle}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#E0A858', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: '#111', fontSize: '0.875rem',
          }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'rgba(242,240,237,0.4)', fontSize: '0.6rem', fontWeight: 600, marginBottom: '2px' }}>EP. {ep.number} · {ep.pubDate}</p>
          {guest && (
            <p style={{ color: '#E0A858', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1px', lineHeight: '1.2' }}>
              {guest}
            </p>
          )}
          {company && (
            <p style={{ color: 'rgba(224,168,88,0.6)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '2px', lineHeight: '1.2' }}>
              {company}
            </p>
          )}
          <p style={{ color: 'rgba(242,240,237,0.6)', fontSize: '0.7rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {ep.title.split('—')[0].split('con ')[0].trim()}
          </p>
        </div>
      </div>
      {playing && (
        <div style={{ padding: '0 0.625rem 0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(242,240,237,0.4)', marginBottom: '3px' }}>
            <span>{fmt(current)}</span><span>{fmt(duration)}</span>
          </div>
          <div
            style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration
            }}
          >
            <div style={{ height: '100%', width: `${progress}%`, background: '#E0A858', borderRadius: 2 }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Sidebar({ episodes }: { episodes: Episode[] }) {
  return (
    <aside className="guion-sidebar" style={{
      width: 270,
      flexShrink: 0,
      position: 'sticky',
      top: '1rem',
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      maxHeight: 'calc(100vh - 2rem)',
      overflowY: 'auto',
    }}>
      {/* Portada */}
      <img
        className="guion-sidebar-cover"
        src="/images/ftbp-cover.png"
        alt="Fuck The Business Plan"
        style={{ width: '100%', borderRadius: '10px', display: 'block' }}
      />
      {/* Mobile-only brand label */}
      <div className="guion-mobile-brand" style={{ display: 'none', flexDirection: 'column' }}>
        <span style={{ color: '#E0A858', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Fuck The Business Plan
        </span>
        <span style={{ color: 'rgba(242,240,237,0.4)', fontSize: '0.65rem' }}>
          Guion de episodio
        </span>
      </div>

      {/* Hosts */}
      <div className="guion-sidebar-detail">
        <p style={{ color: 'rgba(242,240,237,0.45)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Hosts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {HOSTS.map(h => (
            <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={h.image} alt={h.name} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <span style={{ color: '#F2F0ED', fontSize: '0.8125rem', fontWeight: 500 }}>{h.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plataformas */}
      <div className="guion-sidebar-detail">
        <p style={{ color: 'rgba(242,240,237,0.45)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Escúchanos en</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {PLATFORMS.map((p) => (
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid rgba(224,168,88,0.2)', background: 'rgba(224,168,88,0.04)', color: '#F2F0ED', textDecoration: 'none' }}>
              {p.label}
            </a>
          ))}
          <a href="https://www.instagram.com/fuckthebusinessplan/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#F2F0ED', textDecoration: 'none' }}>
            📷 @fuckthebusinessplan
          </a>
        </div>
      </div>

      {/* Episodios */}
      {episodes.length > 0 && (
        <div className="guion-sidebar-detail">
          <p style={{ color: 'rgba(242,240,237,0.45)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Episodios anteriores</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {episodes.map((ep) => <EpisodePlayer key={ep.number} ep={ep} />)}
          </div>
        </div>
      )}
    </aside>
  )
}

export default function GuestScriptView({ script }: GuestScriptViewProps) {
  const blocks = useMemo(() => parseBlocks(script.content), [script.content])
  const header = useMemo(() => parseHeader(script.content), [script.content])
  const cierre = useMemo(() => parseCierre(script.content), [script.content])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const isApproved = script.status === 'approved'

  // Load episodes from static JSON
  useMemo(() => {
    fetch('/episodes.json')
      .then(r => r.json())
      .then(d => setEpisodes((d.items ?? []) as Episode[]))
      .catch(() => {})
  }, [])

  return (
    <div className="guion-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', minHeight: '100vh', background: '#161719', fontFamily: 'var(--font-body)', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <Sidebar episodes={episodes} />

      {/* Main content */}
      <div className="guion-main" style={{ flex: 1, minWidth: 0 }}>

      {/* ── Mobile-only header ── */}
      <div className="guion-mobile-header" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.875rem', background: '#1A1B1D', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Row 1: Cover + brand name + platform icons (top right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/images/ftbp-cover.png" alt="FTBP" style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0, border: '1px solid rgba(224,168,88,0.3)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#E0A858', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>Fuck The Business Plan</p>
            <p style={{ color: 'rgba(242,240,237,0.4)', fontSize: '0.6rem', marginTop: 2 }}>Podcast de emprendimiento</p>
          </div>
          {/* Platform icon circles — top right */}
          <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
            {MOBILE_PLATFORMS.map(({ label, slug, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="guion-platform-btn"
                style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flexShrink: 0 }}
                data-color={color}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${slug}/${color}`}
                  alt={label}
                  width={15}
                  height={15}
                  className="guion-platform-icon"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Hosts */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {HOSTS.map(h => (
            <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <img src={h.image} alt={h.name} width={26} height={26} style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(224,168,88,0.4)', flexShrink: 0 }} />
              <span style={{ color: 'rgba(242,240,237,0.7)', fontSize: '0.7rem', fontWeight: 500 }}>{h.name}</span>
            </div>
          ))}
        </div>

      </div>

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

      {/* Footer */}
      <div style={{ paddingBottom: '2rem', marginTop: '1rem' }}>
        <p style={{ color: 'rgba(242,240,237,0.2)', fontSize: '0.75rem' }}>
          Fuck The Business Plan — Guadalajara, México
        </p>
      </div>

      </div>{/* end main */}
    </div>
  )
}
