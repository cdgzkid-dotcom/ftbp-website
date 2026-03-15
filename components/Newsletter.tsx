"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-bg-alt border-b border-border px-8 py-12 relative overflow-hidden">
      <div className="max-w-md mx-auto text-center">
        <motion.h2
          className="font-display text-[32px] font-black uppercase mb-3"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
        >
          No te pierdas ningún episodio
        </motion.h2>

        <motion.p
          className="text-[14px] text-text-sec mb-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={1}
        >
          Cada semana, directo a tu correo. Sin spam, sin rollos.
        </motion.p>

        <motion.form
          className="flex gap-2 max-w-[380px] mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={2}
          onSubmit={(e) => {
            e.preventDefault();
            if (email) {
              window.location.href = `mailto:christian@sellia.com.mx?subject=Suscripción FTBP&body=Quiero suscribirme al newsletter: ${email}`;
            }
          }}
        >
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-bg-input border border-border rounded-[5px] px-3.5 py-2.5 text-[14px] text-text-pri placeholder:text-text-ter outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]"
          />
          <button
            type="submit"
            className="btn-primary flex-shrink-0 hover:-translate-y-0.5"
          >
            Suscribirme
          </button>
        </motion.form>
      </div>
    </section>
  );
}
