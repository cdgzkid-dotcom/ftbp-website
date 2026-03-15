"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HOSTS = [
  {
    image: "/images/christian.jpg",
    name: "Christian Dominguez",
    bio: "Emprendedor serial. Fundador de Sellia y ViM Transporte. Sin filtro sobre lo que funciona y lo que no.",
    linkedin: "https://www.linkedin.com/in/christian-dominguez-90662026",
  },
  {
    image: "/images/juancarlos.png",
    name: "Juan Carlos Rico",
    bio: "Co-host y co-conspirador. La otra mitad del caos. Brings the perspective, challenges the assumptions.",
    linkedin: "https://www.linkedin.com/in/jcricoc/",
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

export default function About() {
  return (
    <section
      id="sobre"
      className="bg-bg-alt border-b border-border px-8 py-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold mb-3">
            Sobre el podcast
          </p>
          <h2 className="font-display text-[36px] font-black uppercase leading-[1.1] mb-4">
            Sin guión.
            <br />
            Sin filtro.
            <br />
            Sin rodeos.
          </h2>
          <p className="text-[14px] leading-[1.75] text-text-sec max-w-[440px] mb-5">
            Cada semana hablamos con emprendedores que han construido (y
            destruido) negocios de verdad. No los highlights — la versión
            completa. Los errores, los pivots, las decisiones que nadie te
            cuenta.
          </p>
          <a href="#" className="btn-ghost">
            Conocer más →
          </a>
        </motion.div>

        {/* Right — Host cards */}
        <div className="flex flex-col gap-2.5">
          {HOSTS.map((host, i) => (
            <motion.a
              key={host.name}
              href={host.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3.5 p-4 rounded-[10px] border border-border bg-bg-card hover:translate-x-[5px] hover:border-gold-border transition-all duration-200 cursor-pointer"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              custom={i + 1}
            >
              {/* Avatar */}
              <Image
                src={host.image}
                alt={host.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-gold-border flex-shrink-0"
              />
              <div>
                <h3 className="text-[14px] font-bold text-text-pri mb-0.5 flex items-center gap-1.5">
                  {host.name}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gold opacity-60">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </h3>
                <p className="text-[12px] leading-[1.6] text-text-sec">
                  {host.bio}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
