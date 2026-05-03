"use client"

import React, { useRef, useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

const MAX_ZOOM_DESKTOP = 3.5
const MAX_ZOOM_MOBILE  = 2.2

const GRAIN_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 30,
  opacity: 0.04,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "200px 200px",
  mixBlendMode: "overlay",
}

const TECH_TOP    = ["f/1.8", "ISO 400", "1/500s", "35mm", "RAW", "f/2.8", "ISO 200", "1/250s"]
const TECH_BOTTOM = ["EV +0.3", "AWB", "sRGB", "JPEG+RAW", "AF-S", "±0", "f/1.4", "TTL"]
const TECH_LEFT   = ["f/1.8", "ISO 400", "1/500s", "35mm", "RAW", "EV 0", "AWB", "f/2.8", "ISO 200", "1/250s", "sRGB", "AF-S"]
const TECH_RIGHT  = ["JPEG", "f/1.4", "ISO 800", "1/125s", "50mm", "RAW", "EV -0.3", "AWB", "f/4.0", "ISO 100", "1/1000s", "TTL"]

const handFont = "'Dancing Script', 'Segoe Script', cursive"
const monoFont = "'Courier New', Courier, monospace"

const PolaroidFrame = React.memo(function PolaroidFrame({ mobile }: { mobile: boolean }) {
  const bt = mobile ? 38 : 72
  const bs = mobile ? 38 : 72
  const bb = mobile ? 96 : 184
  const cream   = "#f5f0e8"
  const creamDk = "#ede8dc"
  const ink     = "rgba(60,50,35,0.45)"
  const ts      = mobile ? 6 : 11

  return (
    <>
      <div className="absolute left-0 right-0 flex items-center justify-around overflow-hidden"
        style={{ top: 0, height: bt, background: `linear-gradient(to bottom, ${cream}, ${creamDk})`, zIndex: 20, paddingLeft: bs, paddingRight: bs }}>
        {TECH_TOP.map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.06em", whiteSpace: "nowrap", userSelect: "none" }}>{t}</span>
        ))}
      </div>

      <div className="absolute left-0 right-0 flex flex-col items-center justify-center"
        style={{ bottom: 0, height: bb, background: `linear-gradient(to top, ${creamDk}, ${cream})`, zIndex: 20, gap: mobile ? 5 : 10 }}>
        <div className="flex items-center justify-around w-full" style={{ paddingLeft: bs, paddingRight: bs }}>
          {TECH_BOTTOM.map((t, i) => (
            <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.06em", whiteSpace: "nowrap", userSelect: "none" }}>{t}</span>
          ))}
        </div>
        <div style={{ width: "52%", height: 1, background: "rgba(60,50,35,0.12)" }} />
        <span style={{ fontFamily: handFont, fontWeight: 600, fontSize: mobile ? 15 : 30, color: "#2a2010", letterSpacing: "0.04em", opacity: 0.75, lineHeight: 1 }}>instax mini</span>
        <span style={{ fontFamily: handFont, fontWeight: 600, fontSize: mobile ? 10 : 18, color: "#1a6b3a", letterSpacing: "0.12em", opacity: 0.80, lineHeight: 1 }}>Fujifilm</span>
      </div>

      <div className="absolute flex flex-col justify-around items-center overflow-hidden"
        style={{ top: 0, bottom: 0, left: 0, width: bs, background: `linear-gradient(to right, ${creamDk}, ${cream})`, zIndex: 20, paddingTop: bt, paddingBottom: bb }}>
        {TECH_LEFT.slice(0, mobile ? 8 : 12).map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.05em", whiteSpace: "nowrap", userSelect: "none", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>{t}</span>
        ))}
      </div>

      <div className="absolute flex flex-col justify-around items-center overflow-hidden"
        style={{ top: 0, bottom: 0, right: 0, width: bs, background: `linear-gradient(to left, ${creamDk}, ${cream})`, zIndex: 20, paddingTop: bt, paddingBottom: bb }}>
        {TECH_RIGHT.slice(0, mobile ? 8 : 12).map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.05em", whiteSpace: "nowrap", userSelect: "none", writingMode: "vertical-rl", textOrientation: "mixed" }}>{t}</span>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 25, border: `${mobile ? 2 : 3}px solid rgba(255,255,255,0.35)`,
          boxShadow: `0 ${mobile ? 12 : 32}px ${mobile ? 45 : 110}px rgba(0,0,0,0.70), 0 ${mobile ? 4 : 10}px ${mobile ? 14 : 35}px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.22)` }} />

      <div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: bt, height: mobile ? 45 : 100, zIndex: 19, background: "linear-gradient(to bottom, rgba(255,238,180,0.11) 0%, transparent 100%)", mixBlendMode: "screen" }} />
    </>
  )
})

export default function PolaroidParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [mobile, setMobile]   = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ─── Gunakan scroll dari window, bukan dari target container ───
  // Ini eliminasi warning "non-static position" sepenuhnya
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,   // ← pakai useEffect bukan useLayoutEffect = tidak SSR warning
  })

  const maxZoom    = mobile ? MAX_ZOOM_MOBILE : MAX_ZOOM_DESKTOP
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, maxZoom])
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, mobile ? 1.08 : 1.15])
  const rotate     = useTransform(scrollYProgress, [0, 1], [0, mobile ? 0.8 : 2.0])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{
        position: "relative",   // inline style, bukan Tailwind — lebih reliable
        backgroundColor: "#100e0a",
        height: "100svh",
        minHeight: "100dvh",
        isolation: "isolate",
      }}
    >
      {/* ── Layer 1: Foto ── */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: photoScale, transformOrigin: "center center", zIndex: 1, willChange: "transform" }}
      >
        <Image
          src="/photo/photo (9).jpg"
          alt="Shobiryne portfolio"
          fill
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
          priority
          quality={mobile ? 65 : 80}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 72% 62% at center, transparent 20%, rgba(0,0,0,0.42) 68%, rgba(0,0,0,0.80) 100%),
              linear-gradient(155deg, rgba(255,235,180,0.07) 0%, transparent 45%, rgba(10,20,30,0.22) 100%)
            `,
          }}
        />
      </motion.div>

      {/* ── Layer 2: Frame ── */}
      {mounted && (
        <motion.div
          className="absolute inset-0"
          style={{ scale: frameScale, rotate, transformOrigin: "center center", zIndex: 20, willChange: "transform" }}
        >
          <PolaroidFrame mobile={mobile} />
        </motion.div>
      )}

      {/* ── Layer 3: Grain ── */}
      <div style={GRAIN_STYLE} />

      {/* ── Layer 4: Content ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{
          zIndex: 35,
          paddingBottom: `${mobile ? 96 : 184}px`,
          paddingTop:    `${mobile ? 38 : 72}px`,
          paddingLeft:   `${mobile ? 38 : 72}px`,
          paddingRight:  `${mobile ? 38 : 72}px`,
        }}
      >
        <div className="text-center">
          <h1
            className="font-light italic"
            style={{
              color: "#f0e8c8",
              textShadow: "0 2px 28px rgba(0,0,0,0.88)",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(2.6rem, 11vw, 7rem)",
              lineHeight: 1.05,
              letterSpacing: "0.04em",
            }}
          >
            Shobiryne
          </h1>
          <p
            className="mt-2 font-light uppercase"
            style={{
              color: "rgba(240,232,200,0.50)",
              fontSize: "clamp(0.52rem, 1.9vw, 0.82rem)",
              letterSpacing: "clamp(0.22em, 1.8vw, 0.46em)",
            }}
          >
            Photographer &amp; Videographer
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(240,232,200,0.28)" strokeWidth="1.5" />
                <rect x="6.5" y="5" width="3" height="5" rx="1.5" fill="rgba(240,232,200,0.40)" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}