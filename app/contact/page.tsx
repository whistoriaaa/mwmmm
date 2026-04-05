"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger)

const contactLinks = [
  {
    label: "Instagram",
    value: "@shobiryne",
    href: "https://instagram.com/shobiryne",
    desc: "Follow for daily updates",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
    color: "var(--pink)",
    highlight: "rgba(207,83,155,0.08)",
    border: "rgba(207,83,155,0.25)",
  },
  {
    label: "WhatsApp",
    value: "+62 xxx-xxxx-xxxx",
    href: "https://wa.me/62xxxxxxxxxx",
    desc: "Chat langsung untuk diskusi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    color: "var(--cyan)",
    highlight: "rgba(1,105,111,0.08)",
    border: "rgba(1,105,111,0.25)",
  },
  {
    label: "Email",
    value: "hello@shobiryne.com",
    href: "mailto:hello@shobiryne.com",
    desc: "Untuk inquiry & kolaborasi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    color: "var(--gold)",
    highlight: "rgba(211,179,102,0.08)",
    border: "rgba(211,179,102,0.25)",
  },
]

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
      },
    })

    tl.from(headingRef.current, {
        y: 60, opacity: 0, duration: 1.1, ease: "power3.out",
      })
      .from(cardsRef.current!.children, {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
      }, "-=0.5")
      .from(badgeRef.current, {
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
      }, "-=0.3")
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
      style={{ background: "var(--bg, #080c10)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "clamp(300px, 50vw, 700px)", height: "clamp(300px, 50vw, 700px)",
          background: "radial-gradient(circle, rgba(1,105,111,0.07) 0%, rgba(207,83,155,0.04) 50%, transparent 70%)",
          borderRadius: "50%", filter: "blur(60px)",
        }} />
      </div>

      {/* ── Heading ─────────────────────────────────────────── */}
      <div ref={headingRef} className="text-center mb-16 z-10">
        <p className="text-xs tracking-[0.45em] uppercase mb-5"
          style={{ color: "var(--cyan)", opacity: 0.7 }}>
          Hubungi Saya
        </p>
        <h2
          className="font-light italic tracking-wide leading-none mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 7vw, 7rem)",
            color: "var(--gold)",
            textShadow: "0 0 80px rgba(211,179,102,0.15)",
          }}
        >
          Let&apos;s Work Together
        </h2>
        <p className="text-sm font-light leading-relaxed mx-auto"
          style={{ color: "var(--text-muted, #8a9baa)", maxWidth: "42ch" }}>
          Terbuka untuk proyek foto, video, dan kolaborasi kreatif.
          Pilih saluran yang paling nyaman untukmu.
        </p>
      </div>

      {/* ── Kartu kontak ────────────────────────────────────── */}
      <div
        ref={cardsRef}
        className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-5 z-10"
      >
        {contactLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center gap-4 px-6 py-8 rounded-sm"
            style={{
              border: `1px solid ${link.border}`,
              background: "rgba(255,255,255,0.02)",
            }}
            whileHover={{
              background: link.highlight,
              y: -6,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ border: `1px solid ${link.border}`, color: link.color }}
            >
              {link.icon}
            </div>

            {/* Teks */}
            <div className="flex flex-col gap-1">
              <p className="text-xs tracking-[0.25em] uppercase"
                style={{ color: "var(--text-muted, #8a9baa)", fontSize: "11px" }}>
                {link.label}
              </p>
              <p className="text-sm font-light" style={{ color: link.color }}>
                {link.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted, #8a9baa)", opacity: 0.6 }}>
                {link.desc}
              </p>
            </div>

            {/* Arrow */}
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              style={{ color: link.color, opacity: 0.6 }}
            >
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </motion.a>
        ))}
      </div>

      {/* ── Availability badge ───────────────────────────────── */}
      <div ref={badgeRef} className="mt-14 z-10">
        <div
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            border: "1px solid rgba(1,105,111,0.3)",
            background: "rgba(1,105,111,0.05)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--cyan)" }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "var(--cyan)" }} />
          </span>
          <span className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--cyan)", opacity: 0.9 }}>
            Tersedia untuk proyek baru
          </span>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="mt-20 z-10 text-center">
        <div className="w-px h-12 mx-auto mb-6"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08))" }} />
        <p className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--text-muted, #8a9baa)", opacity: 0.35 }}>
          © {new Date().getFullYear()} Shobiryne. All rights reserved.
        </p>
      </div>
    </section>
  )
}