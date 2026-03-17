"use client";

import { motion } from "framer-motion";

const STATS = [
  { number: "2", label: "Hosts" },
  { number: "1", label: "Temporada" },
  { number: "GDL", label: "Hecho en Guadalajara" },
  { number: "Semanal", label: "Frecuencia" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function StatsBar() {
  return (
    <section className="bg-bg-alt border-b border-border">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`text-center py-6
              ${i % 2 === 0 ? "border-r border-border" : ""}
              ${i < 2 ? "border-b border-border md:border-b-0" : ""}
              ${i < STATS.length - 1 ? "md:border-r md:border-border" : ""}
            `}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={i}
          >
            <div className="font-body text-[10px] font-bold uppercase tracking-[0.09em] text-text-ter mb-1">
              {stat.label}
            </div>
            <div className="font-display text-[32px] font-black text-gold">
              {stat.number}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
