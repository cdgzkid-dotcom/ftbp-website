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

export default function Episodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [dur, setDur] = useState("--:--");
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    fetch(`/episodes.json`)
      .then((r) => r.json())
      .then((data) => setEpisodes(data.items ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingIdx === null) {
      audio.pause();
      setPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setDur("--:--");
      return;
    }
    const ep = episodes[playingIdx];
    if (!ep) return;
    audio.src = ep.audioUrl;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [playingIdx, episodes]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(pct);
      setCurrentTime(fmt(audio.currentTime));
    };
    const onLoaded = () => setDur(fmt(audio.duration));
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
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

  const displayed = episodes.slice(0, 3);

  return (
    <section id="episodios" className="bg-bg border-b border-border px-8 py-12">
      <audio ref={audioRef} preload="metadata" />

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
        {displayed.map((ep, i) => {
          const isActive = playingIdx === i;
          return (
            <motion.article
              key={ep.number}
              className="rounded-[10px] border border-border overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
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
              {/* Thumbnail — always same aspect ratio */}
              <div
                className="relative aspect-video overflow-hidden bg-black"
                onClick={isActive ? undefined : () => setPlayingIdx(i)}
                style={{ cursor: isActive ? "default" : "pointer" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ep.imageUrl || `/images/ftbp-cover.png`}
                  alt={ep.title}
                  className={`absolute inset-0 w-full h-full object-contain transition-transform duration-500 ${isActive ? "" : "group-hover:scale-105"}`}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)" }} />

                {/* Not playing: play button + EP/duration */}
                {!isActive && (
                  <>
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
                  </>
                )}

                {/* Playing: controls overlaid */}
                {isActive && (
                  <>
                    {/* Close */}
                    <button
                      onClick={() => setPlayingIdx(null)}
                      className="absolute top-2.5 right-3 text-white/50 hover:text-white/90 transition-colors text-[13px] z-10"
                    >
                      ✕
                    </button>
                    {/* Progress + controls at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex flex-col gap-2 z-10">
                      <div
                        className="h-[3px] bg-white/20 rounded-full cursor-pointer"
                        onClick={seek}
                      >
                        <div className="h-full bg-gold rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform"
                        >
                          {playing ? (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <rect x="1" y="1" width="3.5" height="10" rx="1" fill="#111" />
                              <rect x="7.5" y="1" width="3.5" height="10" rx="1" fill="#111" />
                            </svg>
                          ) : (
                            <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
                              <path d="M11 7L1 13V1L11 7Z" fill="#111" />
                            </svg>
                          )}
                        </button>
                        <span className="text-[11px] text-white/60 tabular-nums">{currentTime} / {dur}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Info — always visible, same size */}
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
          );
        })}
      </div>
    </section>
  );
}
