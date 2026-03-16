"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Episode {
  number: number;
  title: string;
  description: string;
  pubDate: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  guest: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

function AudioPlayer({ audioUrl, onClose }: { audioUrl: string; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("--:--");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => {});

    const onTime = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(pct);
      setCurrentTime(fmt(audio.currentTime));
    };
    const onLoaded = () => setDuration(fmt(audio.duration));
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.pause();
    };
  }, []);

  function fmt(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  return (
    <div className="bg-[#111] p-4 flex flex-col gap-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      {/* Progress bar */}
      <div
        className="h-1 bg-white/10 rounded-full cursor-pointer relative"
        onClick={seek}
      >
        <div
          className="h-full bg-gold rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-gold flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="3.5" height="10" rx="1" fill="#111" />
              <rect x="7.5" y="1" width="3.5" height="10" rx="1" fill="#111" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M11 7L1 13V1L11 7Z" fill="#111" />
            </svg>
          )}
        </button>
        <span className="text-[11px] text-white/50 tabular-nums">{currentTime} / {duration}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white/30 hover:text-white/70 transition-colors text-[11px]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Episodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    fetch(`${basePath}/episodes.json`)
      .then((r) => r.json())
      .then((data) => setEpisodes(data.items ?? []))
      .catch(() => {});
  }, [basePath]);

  const displayed = episodes.slice(0, 3);

  return (
    <section id="episodios" className="bg-bg border-b border-border px-8 py-12">
      {/* Header */}
      <motion.div
        className="flex items-end justify-between mb-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0}
      >
        <div>
          <h2 className="font-display text-[26px] font-black uppercase">
            Episodios recientes
          </h2>
          <div
            className="h-[2px] mt-2"
            style={{
              background: "var(--gold)",
              animation: "barReveal 0.8s ease-out both",
              transformOrigin: "left",
            }}
          />
        </div>
        <a
          href="https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-semibold text-gold hover:tracking-[0.04em] transition-all"
        >
          Ver todos &rarr;
        </a>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[13px]">
        {displayed.map((ep, i) => (
          <motion.article
            key={ep.number}
            className="rounded-[10px] border border-border overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
            style={{ background: "var(--bg-card)" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={i + 1}
            whileHover={{
              boxShadow: "0 20px 44px rgba(0,0,0,0.35), 0 0 0 1px var(--gold-border)",
            }}
          >
            {/* Thumbnail or Player */}
            {playingIdx === i ? (
              <AudioPlayer audioUrl={ep.audioUrl} onClose={() => setPlayingIdx(null)} />
            ) : (
              <div
                className="relative aspect-video overflow-hidden"
                onClick={() => setPlayingIdx(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ep.imageUrl || `${basePath}/images/ftbp-cover.png`}
                  alt={ep.title}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(0,0,0,0.45)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[42px] h-[42px] rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-[1.18] group-hover:bg-gold shadow-lg">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                      <path d="M13 8L1 15V1L13 8Z" fill="#111" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-3 text-white/70 text-[10px] font-bold font-display uppercase tracking-wider">
                  EP. {ep.number}
                </div>
                {ep.duration && (
                  <div className="absolute bottom-2.5 right-3 text-white/50 text-[10px] tabular-nums">
                    {ep.duration}
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.10em] text-gold bg-gold-subtle border border-gold-border rounded-[3px] px-[7px] py-[2px]">
                  EP. {ep.number}
                </span>
                <span className="text-[11px] font-medium text-text-ter">
                  {ep.pubDate}
                </span>
              </div>
              <h3 className="text-[13px] font-bold leading-[1.45] text-text-pri mb-1 line-clamp-2">
                {ep.title}
              </h3>
              {ep.description && (
                <p className="text-[11px] text-text-ter leading-[1.5] line-clamp-2">
                  {ep.description}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
