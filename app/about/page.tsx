"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { Spotlight } from "@/components/about/Spotlight"
import { MagneticBtn } from "@/components/about/MagneticBtn"
import { TiltCard } from "@/components/about/TiltCard"
import { ParallaxPhoto } from "@/components/about/ParallaxPhoto"
import { SectionTitle } from "@/components/about/SectionTitle"
import { services } from "@/data/services"

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function AboutPage() {
  const heroRef      = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroCopyRef  = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef, offset: ["start start", "end start"],
  })
  const heroBgY     = useTransform(heroScroll, [0, 1], ["0%", "35%"])
  const heroTextY   = useTransform(heroScroll, [0, 1], ["0%", "-20%"])
  const heroOpacity = useTransform(heroScroll, [0, 0.65], [1, 0])
  const heroScale   = useTransform(heroScroll, [0, 1], [1, 1.08])

  useGSAP(() => {
    if (!heroTitleRef.current || !heroCopyRef.current) return
    const split = new SplitText(heroTitleRef.current, { type: "chars" })
    gsap.from(split.chars, {
      opacity: 0, y: 60, rotateY: 45, transformOrigin: "0% 50%",
      stagger: 0.06, duration: 1.1, ease: "power4.out", delay: 0.2,
    })
    gsap.from(heroCopyRef.current, {
      opacity: 0, y: 24, duration: 1, ease: "power3.out", delay: 0.9,
    })
    return () => split.revert()
  }, { scope: heroRef })

  return (
    <main style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <Spotlight />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroBgY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src="/photos/hero/5.jpg"
            alt="About hero" fill className="object-cover"
            sizes="100vw"
            style={{ filter: "brightness(0.2) saturate(0.5)" }} priority
          />
        </motion.div>

        <div className="absolute inset-0 z-20"
          style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(8,18,22,0.92) 100%)" }}
        />

        {/* Garis dekorasi */}
        <motion.div
          style={{ y: useTransform(heroScroll, [0, 1], ["0px", "-60px"]) }}
          className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-px h-48 hidden md:block z-10"
        >
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, transparent, var(--cyan), transparent)", opacity: 0.3 }} />
        </motion.div>
        <motion.div
          style={{ y: useTransform(heroScroll, [0, 1], ["0px", "40px"]) }}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-px h-32 hidden md:block z-10"
        >
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, transparent, var(--pink), transparent)", opacity: 0.25 }} />
        </motion.div>

        {/* Orb */}
        <motion.div
          style={{ y: useTransform(heroScroll, [0, 1], ["0px", "80px"]), background: "radial-gradient(circle, var(--cyan) 0%, transparent 70%)" }}
          className="absolute left-[15%] top-[30%] w-64 h-64 rounded-full pointer-events-none z-10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.11, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: useTransform(heroScroll, [0, 1], ["0px", "-50px"]), background: "radial-gradient(circle, var(--pink) 0%, transparent 70%)" }}
          className="absolute right-[18%] bottom-[25%] w-48 h-48 rounded-full pointer-events-none z-10"
          animate={{ scale: [1, 1.12, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Hero content */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-30 text-center px-6 max-w-3xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 0.7, letterSpacing: "0.45em" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="block text-xs uppercase mb-6"
            style={{ color: "var(--cyan)" }}
          >
            Photographer &amp; Videographer
          </motion.span>
          <h1
            ref={heroTitleRef}
            className="font-light italic tracking-wide leading-none mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 9vw, 8rem)",
              color: "var(--gold)",
              textShadow: "0 0 120px rgba(211,179,102,0.25)",
              perspective: "600px",
            }}
          >
            About
          </h1>
          <p
            ref={heroCopyRef}
            className="text-sm md:text-base leading-relaxed max-w-lg mx-auto"
            style={{ color: "rgba(240,236,228,0.72)" }}
          >
            Saya percaya bahwa setiap momen memiliki cahayanya sendiri —
            tugas saya adalah menemukannya dan mengabadikannya sebelum menghilang.
          </p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--cyan)", opacity: 0.4 }}>Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 1, height: 32, background: "linear-gradient(to bottom, var(--cyan), transparent)", opacity: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── BIO TEXT ─────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-28 md:py-36 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 items-start"
        >
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "auto" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.45em] uppercase overflow-hidden whitespace-nowrap"
            style={{ color: "var(--cyan)", opacity: 0.7 }}
          >
            Tentang Saya
          </motion.span>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="h-px origin-left"
            style={{ width: "clamp(60px, 10vw, 120px)", background: "linear-gradient(to right, var(--gold), transparent)" }}
          />

          {[
            "Saya adalah fotografer dan videografer berbasis di Indonesia yang berfokus pada estetika sinematik. Setiap karya yang saya buat berangkat dari satu pertanyaan sederhana: bagaimana cahaya ini terasa?",
            "Dengan pengalaman lebih dari 7 tahun, saya telah bekerja di berbagai genre — dari portrait intim hingga landscape luas, dari iklan brand hingga film pendek personal. Saya percaya bahwa teknik yang baik hanyalah fondasi; yang membuat foto hidup adalah koneksi emosional di baliknya.",
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-muted)", maxWidth: "58ch" }}
            >
              {para}
            </motion.p>
          ))}

          <div className="flex flex-wrap gap-3 pt-2">
            {["Indonesia", "Portrait", "Landscape", "Cinematic", "Color Grading"].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, color: "var(--cyan)" }}
                className="text-xs tracking-widest uppercase px-3 py-1.5 rounded-lg cursor-default"
                style={{ border: "1px solid var(--border-accent)", color: "var(--text-muted)", transition: "color 0.3s, background 0.3s" }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOTO PARALLAX ────────────────────────────────────── */}
      <ParallaxPhoto
        src="/photos/hero/5.jpg"
        alt="Shobiryne - Landscape"
        height="65vh"
        speed={0.25}
        overlayOpacity={0.3}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center px-6"
        >
          <p
            className="font-light italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 3vw, 2.5rem)",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 2px 30px rgba(0,0,0,0.5)",
              maxWidth: "50ch",
              lineHeight: 1.4,
            }}
          >
            &ldquo;Setiap cahaya bercerita — saya hanya mendengarkan.&rdquo;
          </p>
        </motion.div>
      </ParallaxPhoto>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-24 md:py-32 max-w-6xl mx-auto">
        <SectionTitle label="Layanan" title="Apa yang Saya Tawarkan" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <TiltCard
                className="relative p-6 rounded-lg flex flex-col gap-4 group overflow-hidden cursor-default h-full"
                style={{ border: "1px solid var(--border-accent)", background: "var(--card-surface)" }}
              >
                <motion.div
                  className="absolute top-0 left-0 h-px w-0 group-hover:w-full"
                  style={{ background: "linear-gradient(to right, var(--cyan), var(--pink))", transition: "width 0.5s ease" }}
                />
                <motion.div
                  style={{ color: "var(--cyan)", opacity: 0.7 }}
                  className="group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {s.icon}
                </motion.div>
                <h3 className="text-sm font-medium tracking-wide" style={{ color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {s.desc}
                </p>
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ borderRight: "1px solid var(--cyan)", borderBottom: "1px solid var(--cyan)" }}
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-28 md:py-40 relative overflow-hidden"
        style={{ background: "#0d0c11" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/photos/hero/5.jpg"
            alt="" fill className="object-cover"
            sizes="100vw"
            style={{ filter: "brightness(0.18) saturate(0.5)", mixBlendMode: "luminosity" }}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(33,32,40,0.55) 0%, rgba(13,12,17,0.92) 100%)" }}
        />

        {[200, 350, 500].map((size, i) => (
          <motion.div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: size, height: size, border: "1px solid rgba(255,255,255,0.05)" }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.1 }} viewport={{ once: true }}
            className="block text-xs tracking-[0.45em] uppercase mb-4"
            style={{ color: "var(--cyan)" }}
          >
            Kolaborasi
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }} viewport={{ once: true }}
            className="font-light italic mb-6"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--gold)" }}
          >
            Mari Berkarya Bersama
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} viewport={{ once: true }}
            className="text-sm leading-relaxed mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            Punya proyek menarik? Saya selalu terbuka untuk kolaborasi baru —
            dari sesi portrait, event, hingga kampanye brand.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }} viewport={{ once: true }}
          >
            <MagneticBtn
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg text-xs tracking-widest uppercase relative overflow-hidden group"
              style={{ border: "1px solid var(--cyan)", color: "var(--cyan)" }}
            >
              <motion.span
                className="absolute inset-0 rounded-lg pointer-events-none"
                initial={{ scaleX: 0, originX: "0%" }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: "rgba(34,179,208,0.1)" }}
              />
              <span className="relative z-10">Hubungi Saya</span>
              <motion.svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </motion.svg>
            </MagneticBtn>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
