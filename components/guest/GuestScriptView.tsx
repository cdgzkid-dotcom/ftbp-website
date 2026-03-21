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

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.318a.75.75 0 0 1-1.032.25c-2.825-1.726-6.38-2.117-10.567-1.16a.75.75 0 0 1-.336-1.463c4.583-1.048 8.516-.597 11.685 1.341a.75.75 0 0 1 .25 1.032zm1.472-3.272a.937.937 0 0 1-1.288.308c-3.232-1.986-8.158-2.562-11.983-1.402a.937.937 0 0 1-.53-1.795c4.368-1.29 9.79-.664 13.493 1.6a.937.937 0 0 1 .308 1.29zm.126-3.407c-3.877-2.302-10.278-2.514-13.982-1.39a1.124 1.124 0 1 1-.652-2.152c4.25-1.29 11.316-1.04 15.773 1.608a1.124 1.124 0 0 1-1.14 1.934z"/>
  </svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M12.003 0C8.955 0 8.584.013 7.267.072 5.953.13 5.058.334 4.276.63a5.87 5.87 0 0 0-2.122 1.382A5.868 5.868 0 0 0 .772 4.133C.476 4.916.272 5.811.213 7.124.154 8.44.14 8.812.14 11.86v.281c0 3.047.014 3.42.073 4.735.059 1.313.263 2.208.559 2.991a5.871 5.871 0 0 0 1.382 2.121 5.873 5.873 0 0 0 2.122 1.382c.783.296 1.678.5 2.991.559 1.317.059 1.689.073 4.736.073s3.42-.014 4.736-.073c1.313-.059 2.208-.263 2.991-.559a5.876 5.876 0 0 0 2.121-1.382 5.873 5.873 0 0 0 1.382-2.121c.296-.783.5-1.678.559-2.991.059-1.316.073-1.688.073-4.735v-.281c0-3.048-.014-3.42-.073-4.736-.059-1.313-.263-2.208-.559-2.991A5.872 5.872 0 0 0 21.865 1.7 5.87 5.87 0 0 0 19.743.317C18.96.022 18.065-.182 16.752-.24 15.436-.3 15.064-.313 12.016-.313h-.013zm-.001 2.16c2.995 0 3.349.011 4.53.065 1.093.05 1.686.233 2.082.386.523.203.897.447 1.29.84.391.391.636.765.838 1.288.154.397.337.99.386 2.083.054 1.18.065 1.534.065 4.53s-.011 3.349-.065 4.53c-.05 1.093-.232 1.686-.386 2.082a3.474 3.474 0 0 1-.84 1.29 3.474 3.474 0 0 1-1.288.84c-.396.154-.99.337-2.083.386-1.18.054-1.534.065-4.53.065s-3.35-.011-4.53-.065c-1.093-.05-1.686-.232-2.082-.386a3.477 3.477 0 0 1-1.29-.84 3.475 3.475 0 0 1-.84-1.29c-.154-.396-.337-.989-.386-2.082-.054-1.181-.065-1.535-.065-4.53s.011-3.35.065-4.53c.05-1.093.232-1.686.386-2.082a3.476 3.476 0 0 1 .84-1.29 3.474 3.474 0 0 1 1.29-.84c.396-.153.989-.337 2.082-.386 1.181-.054 1.535-.065 4.53-.065zm2.22 3.46L9.78 10.77v8.46l4.9-4.23 4.9 4.23V6.76l-5.357 4.68z"/>
  </svg>
)

const AmazonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M13.955 9.2c0 1.083.028 1.985-.52 2.942-.44.776-1.14 1.255-1.918 1.255-1.063 0-1.685-.811-1.685-2.008 0-2.363 2.118-2.792 4.123-2.792v.603zm2.797 6.763a.58.58 0 0 1-.655.065c-.92-.764-1.086-1.118-1.593-1.846-1.522 1.553-2.6 2.018-4.573 2.018-2.336 0-4.152-1.441-4.152-4.327 0-2.253 1.221-3.787 2.96-4.538 1.507-.663 3.612-.78 5.221-.963V6.03c0-.663.052-1.447-.338-2.02-.343-.515-.999-.727-1.577-.727-1.071 0-2.026.55-2.26 1.69-.048.252-.234.501-.487.514L7.21 5.23c-.21-.046-.442-.217-.381-.54C7.43 2.145 9.85 1.3 12.023 1.3c1.114 0 2.568.296 3.445 1.14 1.114 1.04.007 2.428 0 3.935v3.565c0 1.072.444 1.543.862 2.122.147.207.18.455-.007.609-.467.39-1.3 1.112-1.756 1.517l-.815-.325zM21.3 18.306c-2.293 1.698-5.617 2.598-8.481 2.598-4.011 0-7.621-1.483-10.349-3.946-.215-.194-.023-.459.235-.308 2.946 1.716 6.591 2.747 10.354 2.747 2.538 0 5.328-.526 7.895-1.615.387-.165.712.254.346.524zm.987-1.123c-.292-.375-1.938-.177-2.676-.09-.226.028-.26-.169-.057-.311 1.31-.921 3.46-.655 3.71-.347.252.312-.065 2.474-1.296 3.506-.189.158-.369.074-.285-.135.276-.69.897-2.242.604-2.623z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

const PLATFORMS = [
  { label: '🎙 Spotify', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
  { label: '🎵 Apple Podcasts', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
  { label: '🎶 Amazon Music', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
]

// Mobile-only platform icons (with brand color + SVG)
const MOBILE_PLATFORMS = [
  { label: 'Spotify', Icon: SpotifyIcon, color: '#1DB954', href: 'https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T' },
  { label: 'Apple Podcasts', Icon: AppleIcon, color: '#B150E2', href: 'https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227' },
  { label: 'Amazon Music', Icon: AmazonIcon, color: '#00A8E1', href: 'https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan' },
  { label: 'Instagram', Icon: InstagramIcon, color: '#E1306C', href: 'https://www.instagram.com/fuckthebusinessplan/' },
  { label: 'WhatsApp', Icon: WhatsAppIcon, color: '#25D366', href: 'https://wa.me/523338155238' },
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
            {MOBILE_PLATFORMS.map(({ label, Icon, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(242,240,237,0.5)', textDecoration: 'none', flexShrink: 0, transition: 'color 0.15s, background 0.15s' }}
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
