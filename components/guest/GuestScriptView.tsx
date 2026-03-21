'use client'

import { useMemo, useRef, useState } from 'react'
import BlockCard from './BlockCard'
import ApproveButton from './ApproveButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ThemeManager from '@/components/ThemeManager'

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

/* ── Inline SVGs oficiales (paths de simpleicons.org) ── */
const IconSpotify = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const IconApple = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a9.152 9.152 0 0 1-3.24 5.835c-.768.66-2.084 1.356-3.12 1.62-.504.132-1.67.18-2.28.096-1.692-.24-3.18-1.044-4.38-2.34C5.88 16.116 5.04 14.2 5.04 12.048c0-1.356.276-2.484.876-3.66.757-1.476 1.876-2.616 3.312-3.348C10.14 4.404 10.388 4.32 11 4.14c.468-.132.924-.18 1.836-.18zm0 1.824c-1.992 0-3.684.804-4.8 2.268C6.204 7.776 5.784 9.252 5.784 12c0 3.084 1.2 5.268 3.504 6.6.816.468 1.728.696 2.784.696 1.056 0 1.944-.216 2.736-.66 2.4-1.284 3.66-3.564 3.66-6.684 0-1.98-.552-3.624-1.632-4.8-1.152-1.272-2.748-1.896-4.572-1.752zm.072 2.304c2.256 0 4.104 1.824 4.104 4.08s-1.836 4.08-4.104 4.08-4.104-1.824-4.104-4.08 1.836-4.08 4.104-4.08zm0 1.548c-1.404 0-2.556 1.14-2.556 2.544s1.14 2.544 2.556 2.544 2.556-1.14 2.556-2.544-1.152-2.544-2.556-2.544zm0 1.008c.84 0 1.536.684 1.536 1.536s-.684 1.536-1.536 1.536-1.536-.684-1.536-1.536.684-1.536 1.536-1.536z"/>
  </svg>
)

const IconAmazon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M.351 14.4C3.938 16.8 8.829 18.24 14.058 18.24c3.479 0 7.301-.72 10.802-2.219.461-.201.842.299.422.659C21.965 19.56 17.7 21 13.261 21 7.26 21 2.01 18.3.031 14.94c-.181-.3.239-.6.32-.54zM24 13.44c-.479-.6-3.119-.3-4.318-.119-.359.06-.419-.26-.06-.479 2.099-1.44 5.578-1.02 5.998-.54.42.48-.12 3.779-2.099 5.398-.299.24-.599.12-.479-.18.48-1.14 1.439-3.479.958-4.08zM13.62 4.08c0-1.68 1.62-2.88 3.24-2.88s3.24 1.2 3.24 2.88c0 1.62-1.08 2.82-3.24 4.32-2.16-1.5-3.24-2.7-3.24-4.32z"/>
    <path d="M3.181 8.459c0-.9.12-1.68.361-2.339.48-1.26 1.44-2.16 2.579-2.64.6-.24 1.26-.36 2.04-.36 1.38 0 2.52.42 3.3 1.2.78.78 1.2 1.86 1.2 3.06v.36c0 .9-.12 1.68-.36 2.34-.48 1.26-1.44 2.16-2.58 2.64a6.05 6.05 0 0 1-2.04.36c-1.38 0-2.52-.42-3.3-1.2-.78-.78-1.2-1.86-1.2-3.06v-.36zm2.04.24c0 .66.12 1.2.36 1.68.42.84 1.14 1.26 2.16 1.26s1.74-.42 2.16-1.26c.24-.48.36-1.08.36-1.8v-.24c0-.66-.12-1.2-.36-1.68-.42-.84-1.14-1.26-2.16-1.26s-1.74.42-2.16 1.26c-.24.48-.36 1.08-.36 1.8v.24z"/>
  </svg>
)

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

// Mobile-only: logos inline SVG + color de marca en hover via CSS var
const MOBILE_PLATFORMS = [
  { label: 'Spotify',        Icon: IconSpotify,   brand: '#1DB954', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
  { label: 'Apple Podcasts', Icon: IconApple,     brand: '#B150E2', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
  { label: 'Amazon Music',   Icon: IconAmazon,    brand: '#00A8E1', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
  { label: 'Instagram',      Icon: IconInstagram, brand: '#E1306C', href: 'https://www.instagram.com/fuckthebusinessplan/' },
  { label: 'WhatsApp',       Icon: IconWhatsApp,  brand: '#25D366', href: 'https://wa.me/523338155238' },
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
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
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
            background: 'var(--gold)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: '#111', fontSize: '0.875rem',
          }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--text-ter)', fontSize: '0.6rem', fontWeight: 600, marginBottom: '2px' }}>EP. {ep.number} · {ep.pubDate}</p>
          {guest && (
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1px', lineHeight: '1.2' }}>
              {guest}
            </p>
          )}
          {company && (
            <p style={{ color: 'rgba(224,168,88,0.6)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '2px', lineHeight: '1.2' }}>
              {company}
            </p>
          )}
          <p style={{ color: 'var(--text-sec)', fontSize: '0.7rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {ep.title.split('—')[0].split('con ')[0].trim()}
          </p>
        </div>
      </div>
      {playing && (
        <div style={{ padding: '0 0.625rem 0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-ter)', marginBottom: '3px' }}>
            <span>{fmt(current)}</span><span>{fmt(duration)}</span>
          </div>
          <div
            style={{ height: 3, background: 'var(--border)', borderRadius: 2, cursor: 'pointer' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration
            }}
          >
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 2 }} />
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
        <span style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Fuck The Business Plan
        </span>
        <span style={{ color: 'var(--text-ter)', fontSize: '0.65rem' }}>
          Guion de episodio
        </span>
      </div>

      {/* Hosts */}
      <div className="guion-sidebar-detail">
        <p style={{ color: 'var(--text-ter)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Hosts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {HOSTS.map(h => (
            <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={h.image} alt={h.name} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-pri)', fontSize: '0.8125rem', fontWeight: 500 }}>{h.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plataformas */}
      <div className="guion-sidebar-detail">
        <p style={{ color: 'var(--text-ter)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Escúchanos en</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {PLATFORMS.map((p) => (
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid var(--gold-border)', background: 'var(--gold-subtle)', color: 'var(--text-pri)', textDecoration: 'none' }}>
              {p.label}
            </a>
          ))}
          <a href="https://www.instagram.com/fuckthebusinessplan/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-pri)', textDecoration: 'none' }}>
            📷 @fuckthebusinessplan
          </a>
        </div>
      </div>

      {/* Episodios */}
      {episodes.length > 0 && (
        <div className="guion-sidebar-detail">
          <p style={{ color: 'var(--text-ter)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Episodios anteriores</p>
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
    <ThemeManager>
    <div className="guion-page" style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <Sidebar episodes={episodes} />

      {/* Main content */}
      <div className="guion-main" style={{ flex: 1, minWidth: 0 }}>

      {/* ── Mobile-only header ── */}
      <div className="guion-mobile-header" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.875rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>

        {/* Row 1: Cover + brand name + platform icons (top right) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/images/ftbp-cover.png" alt="FTBP" style={{ width: 48, height: 48, borderRadius: 8, flexShrink: 0, border: '1px solid rgba(224,168,88,0.3)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>Fuck The Business Plan</p>
            <p style={{ color: 'var(--text-ter)', fontSize: '0.6rem', marginTop: 2 }}>Podcast de emprendimiento</p>
          </div>
          {/* Platform icons — top right, sin contenedor */}
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
            {MOBILE_PLATFORMS.map(({ label, Icon, brand, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="guion-platform-btn"
                data-label={label}
                style={{ '--brand': brand, display: 'flex', alignItems: 'center', textDecoration: 'none', position: 'relative' } as React.CSSProperties}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Hosts */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {HOSTS.map(h => (
            <div key={h.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <img src={h.image} alt={h.name} width={26} height={26} style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(224,168,88,0.4)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-sec)', fontSize: '0.7rem', fontWeight: 500 }}>{h.name}</span>
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
        <p style={{ color: 'var(--gold)', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
          Fuck The Business Plan — Guion de episodio
        </p>
        <h1 style={{ color: 'var(--text-pri)', fontSize: '1.375rem', fontWeight: 700, lineHeight: '1.3', marginBottom: '0.5rem' }}>
          Hola{script.guest_name ? `, ${script.guest_name}` : ''}
        </h1>
        <p style={{ color: 'var(--text-sec)', fontSize: '0.9rem', lineHeight: '1.65' }}>
          Aquí está el guion de conversación que preparamos para tu episodio. Está pensado como una guía,
          no como un script. Léelo con calma, deja comentarios en los bloques que quieras ajustar,
          y apruébalo cuando estés listo.
        </p>
      </div>

      {/* Header / metadata */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h2 style={{ color: 'var(--gold)', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.5rem' }}>
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.375rem' }}>
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: 'var(--text-pri)', fontWeight: 600 }}>{children}</strong>
            ),
            hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />,
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
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h3 style={{ color: 'var(--text-pri)', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', borderLeft: '3px solid var(--gold)', paddingLeft: '0.75rem' }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '0.5rem' }}>
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: 'var(--text-pri)', fontWeight: 600 }}>{children}</strong>
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
            {cierre}
          </ReactMarkdown>
        </div>
      )}

      {/* Approve button */}
      {!isApproved && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
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
          <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>El equipo de producción fue notificado.</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ paddingBottom: '2rem', marginTop: '1rem' }}>
        <p style={{ color: 'var(--text-ter)', fontSize: '0.75rem' }}>
          Fuck The Business Plan — Guadalajara, México
        </p>
      </div>

      </div>{/* end main */}
    </div>
    </ThemeManager>
  )
}
