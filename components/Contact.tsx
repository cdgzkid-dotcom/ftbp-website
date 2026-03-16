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

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: apiKey,
          subject: `Mensaje de ${form.name} — FTBP`,
          from_name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-bg-input border border-border rounded-[5px] px-3.5 py-2.5 text-[14px] text-text-pri placeholder:text-text-ter outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]";

  return (
    <section id="contacto" className="bg-bg-alt border-b border-border px-8 py-14 relative overflow-hidden">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
        >
          <h2 className="font-display text-[32px] font-black uppercase mb-3">
            Escríbenos
          </h2>
          <p className="text-[14px] text-text-sec">
            ¿Quieres ser invitado? ¿Tienes algo que decirnos? Mándanos un mensaje.
          </p>
        </motion.div>

        {status === "sent" ? (
          <motion.div
            className="text-center py-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-[22px] font-black uppercase text-gold mb-2">¡Mensaje enviado!</p>
            <p className="text-[14px] text-text-sec">Te respondemos pronto.</p>
            <button
              className="mt-6 text-[13px] text-text-ter underline hover:text-gold transition-colors"
              onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", message: "" }); }}
            >
              Enviar otro mensaje
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={1}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Tu celular"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
            <textarea
              name="message"
              placeholder="¿Qué quieres decirnos?"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed self-center px-10"
            >
              {status === "sending" ? "Enviando..." : "Enviar mensaje"}
            </button>
            {status === "error" && (
              <p className="text-center text-[13px] text-red-400">Algo salió mal. Intenta de nuevo.</p>
            )}
          </motion.form>
        )}
      </div>
    </section>
  );
}
