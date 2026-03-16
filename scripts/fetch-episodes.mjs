import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RSS_URL = "https://anchor.fm/s/10eee8608/podcast/rss";
const OUTPUT = join(__dirname, "../public/episodes.json");
const MAX_EPISODES = 6;

async function fetchEpisodes() {
  console.log("Fetching RSS feed from", RSS_URL);

  const res = await fetch(RSS_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const xml = await res.text();

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let epNumber = 1;

  // Get total count first to assign proper episode numbers
  const allMatches = [];
  const countRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = countRegex.exec(xml)) !== null) allMatches.push(m[1]);
  const total = allMatches.length;

  const itemsToProcess = allMatches.slice(0, MAX_EPISODES);

  for (let idx = 0; idx < itemsToProcess.length; idx++) {
    const item = itemsToProcess[idx];
    const get = (tag) => {
      const r = new RegExp(
        `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`
      ).exec(item);
      return r ? (r[1] || r[2] || "").trim() : "";
    };

    const audioMatch = /<enclosure\s[^>]*url="([^"]+)"/.exec(item);
    const imageMatch = /<itunes:image\s[^>]*href="([^"]+)"/.exec(item);
    const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);
    const epNumMatch = /<itunes:episode>([^<]+)<\/itunes:episode>/.exec(item);

    const pubDateRaw = get("pubDate");
    const pubDate = pubDateRaw
      ? new Date(pubDateRaw).toLocaleDateString("es-MX", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    items.push({
      number: epNumMatch ? parseInt(epNumMatch[1]) : total - idx,
      title: get("title"),
      description: get("description").replace(/<[^>]+>/g, "").slice(0, 200),
      pubDate,
      audioUrl: audioMatch ? audioMatch[1].trim() : "",
      imageUrl: imageMatch ? imageMatch[1].trim() : "",
      duration: durationMatch ? durationMatch[1].trim() : "",
      guest: get("itunes:subtitle") || "",
    });
  }

  mkdirSync(join(__dirname, "../public"), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify({ items }, null, 2));
  console.log(`✓ Wrote ${items.length} episodes to public/episodes.json`);
}

fetchEpisodes().catch((err) => {
  console.error("Failed to fetch episodes:", err);
  process.exit(1);
});
