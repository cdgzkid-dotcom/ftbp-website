"use client";

import { motion } from "framer-motion";

const STATS = [
  { number: "2", label: "Hosts" },
  { number: "2026", label: "Desde" },
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
      <div className="flex flex-wrap">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={`flex-1 min-w-[140px] text-center py-5 ${
              i < STATS.length - 1 ? "border-r border-border" : ""
            }`}
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
