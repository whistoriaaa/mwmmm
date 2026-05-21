"use client"

import Link from "next/link"
import { motion } from "motion/react"

const tags = ["Portrait", "Event & Trip", "Product", "Cinematic"]

export default function BioBrief() {
  return (
    <section className="relative px-6 md:px-16 py-24 md:py-32">
      {/* Fade dari parallax — di luar overflow:hidden sehingga tidak ada garis */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "80px",
          marginTop: "-80px",
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />
      <div className="max-w-2xl mx-auto md:mx-0 md:ml-[12vw]">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.45em] uppercase mb-5"
          style={{ color: "var(--cyan)", opacity: 0.75 }}
        >
          Tentang
        </motion.p>

        {/* Nama */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-light italic leading-none mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
            color: "var(--gold)",
          }}
        >
          Shobiryne
        </motion.h2>

        {/* Garis */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="h-px origin-left mb-7"
          style={{
            width: "clamp(50px, 10vw, 90px)",
            background: "linear-gradient(to right, var(--gold), transparent)",
          }}
        />

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base leading-relaxed mb-8"
          style={{ color: "var(--text-muted)", maxWidth: "50ch" }}
        >
          Fotografer dan videografer berbasis di Indonesia, berfokus pada estetika sinematik.
          Mengabadikan setiap momen — dari portrait intim, event berkesan, hingga kampanye produk —
          dengan cahaya dan emosi yang nyata.
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-lg"
              style={{
                border: "1px solid rgba(34,179,208,0.18)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex items-center gap-6"
        >
          <Link
            href="/kategori"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              background: "rgba(34,179,208,0.1)",
              border: "1px solid rgba(34,179,208,0.35)",
              color: "var(--cyan)",
            }}
          >
            Lihat Karya
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/about"
            className="text-xs tracking-widest uppercase transition-opacity duration-300 hover:opacity-100"
            style={{ color: "var(--text-muted)", opacity: 0.65 }}
          >
            Tentang Saya →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
