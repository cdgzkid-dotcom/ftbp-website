"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const EPISODES = [
  {
    number: 4,
    tag: "Fabrice Serfatti",
    date: "Mar 10, 2025",
    title: "El dinero que transforma empresas con Fabrice Serfatti de IGNIA",
    guest: "IGNIA",
    spotifyId: "2Ai7D6gmjJA7wF0Z3iNahd",
    overlayColor: "rgba(28,21,16,0.55)",
  },
  {
    number: 3,
    tag: "Ivan Vázquez",
    date: "Mar 3, 2025",
    title: "De cero a vender audio de lujo en México",
    guest: "Fortune Acoustics",
    spotifyId: "3CvqCKjvbtEaMUgAyvhbr0",
    overlayColor: "rgba(24,20,16,0.60)",
  },
  {
    number: 2,
    tag: "Carlos Domínguez",
    date: "Feb 17, 2025",
    title: "Finanzas: Gestión de Capital y Rentabilidad",
    guest: "Gestión de Capital",
    spotifyId: "0MxcgL1AflZTkinSyZz7XB",
    overlayColor: "rgba(20,19,18,0.55)",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Episodes() {
  const [playingId, setPlayingId] = useState<string | null>(null);

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
        {EPISODES.map((ep, i) => (
          <motion.article
            key={ep.spotifyId}
            className="rounded-[10px] border border-border overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
            style={{
              background: "var(--bg-card)",
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={i + 1}
            whileHover={{
              boxShadow:
                "0 20px 44px rgba(0,0,0,0.35), 0 0 0 1px var(--gold-border)",
            }}
          >
            {/* Thumbnail or Spotify player */}
            {playingId === ep.spotifyId ? (
              <div className="aspect-video relative">
                <iframe
                  src={`https://open.spotify.com/embed/episode/${ep.spotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="absolute inset-0 border-0"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : (
              <div
                className="relative aspect-video overflow-hidden"
                onClick={() => setPlayingId(ep.spotifyId)}
              >
                <Image
                  src="/images/ftbp-cover.png"
                  alt={ep.title}
                  fill
                  className="object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                />
                {/* Color overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: ep.overlayColor }}
                />
                {/* Bottom gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  }}
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[42px] h-[42px] rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center transition-all group-hover:scale-[1.18] group-hover:bg-gold shadow-lg">
                    <svg
                      width="14"
                      height="16"
                      viewBox="0 0 14 16"
                      fill="none"
                    >
                      <path d="M13 8L1 15V1L13 8Z" fill="#111" />
                    </svg>
                  </div>
                </div>
                {/* Episode number */}
                <div className="absolute bottom-2.5 left-3 text-white/70 text-[10px] font-bold font-display uppercase tracking-wider">
                  EP. {ep.number}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.10em] text-gold bg-gold-subtle border border-gold-border rounded-[3px] px-[7px] py-[2px]">
                  {ep.tag}
                </span>
                <span className="text-[11px] font-medium text-text-ter">
                  {ep.date}
                </span>
              </div>
              <h3 className="text-[13px] font-bold leading-[1.45] text-text-pri mb-1">
                {ep.title}
              </h3>
              <p className="text-[11px] font-medium text-text-sec">
                {ep.guest}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
