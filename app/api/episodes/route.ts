import { NextResponse } from 'next/server'

const RSS_URL = 'https://anchor.fm/s/10eee8608/podcast/rss'
const MAX_EPISODES = 6

export const revalidate = 3600 // caché 1 hora

export async function GET() {
  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()

    const allMatches: string[] = []
    const countRegex = /<item>([\s\S]*?)<\/item>/g
    let m: RegExpExecArray | null
    while ((m = countRegex.exec(xml)) !== null) allMatches.push(m[1])

    const total = allMatches.length
    const itemsToProcess = allMatches.slice(0, MAX_EPISODES)

    const get = (item: string, tag: string) => {
      const r = new RegExp(
        `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`
      ).exec(item)
      return r ? (r[1] || r[2] || '').trim() : ''
    }

    const items = itemsToProcess.map((item, idx) => {
      const audioMatch = /<enclosure\s[^>]*url="([^"]+)"/.exec(item)
      const imageMatch = /<itunes:image\s[^>]*href="([^"]+)"/.exec(item)
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item)
      const epNumMatch = /<itunes:episode>([^<]+)<\/itunes:episode>/.exec(item)

      const pubDateRaw = get(item, 'pubDate')
      const pubDate = pubDateRaw
        ? new Date(pubDateRaw).toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : ''

      return {
        number: epNumMatch ? parseInt(epNumMatch[1]) : total - idx,
        title: get(item, 'title'),
        description: get(item, 'description')
          .replace(/<[^>]+>/g, '')
          .slice(0, 200),
        pubDate,
        audioUrl: audioMatch ? audioMatch[1].trim() : '',
        imageUrl: imageMatch ? imageMatch[1].trim() : '',
        duration: durationMatch ? durationMatch[1].trim() : '',
        guest: get(item, 'itunes:subtitle') || '',
      }
    })

    return NextResponse.json({ items })
  } catch (err) {
    console.error('Episodes API error:', err)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}
