"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg">
      {/* Orbs */}
      <div
        className="absolute pointer-events-none animate-breathe"
        style={{
          width: 650,
          height: 650,
          top: -120,
          left: -120,
          background:
            "radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none animate-breathe-slow"
        style={{
          width: 450,
          height: 450,
          bottom: -80,
          right: -100,
          background:
            "radial-gradient(circle, var(--pink-glow) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center px-8 py-13">
        {/* Left column */}
        <div className="flex flex-col gap-0">
          {/* Eyebrow */}
          <p className="hero-eyebrow font-body text-[11px] font-bold uppercase tracking-[0.14em] text-gold mb-4">
            Podcast &middot; Nuevos episodios cada semana
          </p>

          {/* H1 */}
          <h1 className="hero-h1 font-display text-[42px] lg:text-[54px] font-black uppercase leading-[1.05]">
            <span className="text-pink">FUCK</span> the business plan,
            <br />
            hazlo de todas formas!
          </h1>

          {/* Gradient bar */}
          <div
            className="hero-bar h-[3px] my-4"
            style={{
              background: "linear-gradient(90deg, var(--pink) 0%, var(--gold) 100%)",
            }}
          />

          {/* Subtitle */}
          <p className="hero-subtitle font-body text-[15px] leading-[1.75] text-text-sec max-w-[420px] mb-5">
            Conversaciones sin filtro con emprendedores que{" "}
            <strong className="text-text-pri">
              construyeron, rompieron y reconstruyeron
            </strong>{" "}
            negocios reales. Sin el discurso de LinkedIn.
          </p>

          {/* Buttons */}
          <div className="hero-buttons flex gap-3 mb-5">
            <a href="#episodios" className="btn-primary">
              Ver todos los episodios
            </a>
            <a href="https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Escuchar en Spotify
            </a>
            <a href="https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Escuchar en Apple Podcasts
            </a>
            <a href="https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Escuchar en Amazon Music
            </a>
          </div>

          {/* Host pills */}
          <div className="hero-pills flex items-center gap-2 mb-4 flex-wrap">
            <HostPill image={`/images/christian.jpg`} name="Christian Dominguez" href="https://www.linkedin.com/in/christian-dominguez-90662026" />
            <span className="text-text-ter text-sm">&</span>
            <HostPill image={`/images/juancarlos.png`} name="Juan Carlos Rico" href="https://www.linkedin.com/in/jcricoc/" />
          </div>

          {/* Platform badges */}
          <div className="hero-badges flex gap-2 flex-wrap">
            {[
              { label: "🎙 Spotify", href: "https://open.spotify.com/show/2trG9tv2AXRQfHhXfme59T" },
              { label: "🎵 Apple Podcasts", href: "https://podcasts.apple.com/mx/podcast/fuck-the-business-plan/id1886786227" },
              { label: "🎶 Amazon Music", href: "https://music.amazon.com.mx/podcasts/7e4713c0-1dea-4df2-81dd-913a3f1ebf06/fuck-the-business-plan" },
              { label: "📷 Instagram", href: "https://www.instagram.com/fuckthebusinessplan/" },
              { label: "💬 WhatsApp", href: "https://wa.me/523338155238" },
            ].map((p) => (
              <a
                key={p.label}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-[11px] font-medium px-3 py-1.5 rounded-[5px] border border-border text-text-sec hover:text-gold hover:border-gold hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right column — Cover */}
        <div className="hero-cover flex justify-center lg:justify-end">
          <div className="animate-float">
            <Image
              src={`/images/ftbp-cover.png`}
              alt="Fuck The Business Plan - Portada"
              width={248}
              height={248}
              className="rounded-[14px] border border-gold-border"
              style={{
                boxShadow:
                  "0 0 70px var(--gold-glow), 0 24px 64px rgba(0,0,0,0.45)",
              }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HostPill({
  image,
  name,
  href,
}: {
  image: string;
  name: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 border border-border rounded-full py-1 pl-1 pr-3.5 hover:-translate-y-0.5 hover:border-gold-border transition-all cursor-pointer"
    >
      <Image
        src={image}
        alt={name}
        width={25}
        height={25}
        className="w-[25px] h-[25px] rounded-full object-cover border border-gold-border"
      />
      <span className="text-[12px] font-medium text-text-sec">{name}</span>
    </a>
  );
}
