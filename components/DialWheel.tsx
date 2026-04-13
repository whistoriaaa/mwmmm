"use client"

import { forwardRef, useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ── 17 label tersebar merata 360° ──────────────────────────────
const BASE_LABELS = [
  { v: "A",    isA: true  },
  { v: "T",    isA: false },
  { v: "B",    isA: false },
  { v: "1",    isA: false },
  { v: "2",    isA: false },
  { v: "4",    isA: false },
  { v: "8",    isA: false },
  { v: "15",   isA: false },
  { v: "30",   isA: false },
  { v: "60",   isA: false },
  { v: "125",  isA: false },
  { v: "250X",  isA: false },
  { v: "500",  isA: false },
  { v: "1000", isA: false },
  { v: "2000", isA: false },
  { v: "4000", isA: false },
  { v: "8000", isA: false },
]

const STEP = 360 / BASE_LABELS.length  // ≈ 21.18° per item

const SPEEDS = BASE_LABELS.map((s, i) => ({
  ...s,
  a: +(i * STEP).toFixed(2),
}))

// ── Tick marks: 17 titik merata 360° ───────────────────────────
const TICKS = BASE_LABELS.map((_, i) => {
  const a = (i * STEP * Math.PI) / 180
  return {
    x1: +(50 + 44.0 * Math.sin(a)).toFixed(3),
    y1: +(50 - 44.0 * Math.cos(a)).toFixed(3),
    x2: +(50 + 47.5 * Math.sin(a)).toFixed(3),
    y2: +(50 - 47.5 * Math.cos(a)).toFixed(3),
  }
})

// ── Knurling ────────────────────────────────────────────────────
const KNURLS = Array.from({ length: 90 }, (_, i) => {
  const a = (i * (360 / 90) * Math.PI) / 180
  return {
    x1: +(50 + 46.5 * Math.sin(a)).toFixed(3), y1: +(50 - 46.5 * Math.cos(a)).toFixed(3),
    x2: +(50 + 49.5 * Math.sin(a)).toFixed(3), y2: +(50 - 49.5 * Math.cos(a)).toFixed(3),
    bright: i % 2 === 0,
  }
})

// Teks mulai dari pinggir luar, mengalir ke dalam
const OUTER_R = 46
const OUTER_Y = 50 - OUTER_R  // = 8

// ── Component ──────────────────────────────────────────────────
const DialWheel = forwardRef<HTMLDivElement>((_, ref) => {
  const discRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ── GSAP scroll spin ─────────────────────────────────────────
  useEffect(() => {
    const disc = discRef.current
    if (!disc) return
    const ctx = gsap.context(() => {
      gsap.to(disc, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   1.4,
        },
      })
    }, disc)
    return () => ctx.revert()
  }, [])

  const FS = mobile ? "5.5" : "9.4"

  return (
    <div
      ref={ref}
      style={{
        position:      "absolute",
        top:           "100%",
        left:          "10%",
        transform:     "translate(-50%, -50%)",
        width:  "clamp(280px, 60vw, 700px)",
        height: "clamp(280px, 60vw, 700px)",
        zIndex:        3,
        pointerEvents: "none",
        userSelect:    "none",
      }}
    >
      {/* ── Spinning disc ── */}
      <div
        ref={discRef}
        style={{
          width:        "100%",
          height:       "100%",
          willChange:   "transform",
          borderRadius: "50%",
          background:   "#111",
          boxShadow: [
            "0 0 0 1px rgba(255,255,255,0.75)",
            "0 0 0 2.5px rgba(60,58,55,0.50)",
            "0 0 0 4px #050505",
            "0 20px 70px rgba(0,0,0,0.90)",
            "0 6px 20px  rgba(0,0,0,0.70)",
          ].join(", "),
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="dw_face" cx="50%" cy="44%" r="65%">
              <stop offset="0%"   stopColor="#2a2a2a" />
              <stop offset="50%"  stopColor="#1e1e1e" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </radialGradient>

            <radialGradient id="dw_vig" cx="50%" cy="50%" r="50%">
              <stop offset="62%"  stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.60)" />
            </radialGradient>

            <linearGradient id="dw_chrome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.82)" />
              <stop offset="28%"  stopColor="rgba(255,255,255,0.14)" />
              <stop offset="58%"  stopColor="rgba(255,255,255,0.52)" />
              <stop offset="100%" stopColor="rgba(140,138,134,0.08)" />
            </linearGradient>

            <radialGradient id="dw_hub" cx="32%" cy="26%" r="68%">
              <stop offset="0%"   stopColor="#303030" />
              <stop offset="50%"  stopColor="#141414" />
              <stop offset="100%" stopColor="#040404" />
            </radialGradient>
          </defs>

          {/* ─ Face ─ */}
          <circle cx="50" cy="50" r="49.8" fill="url(#dw_face)" />
          <circle cx="50" cy="50" r="49.8" fill="url(#dw_vig)" />

          {/* ─ Knurling band ─ */}
          {/* <circle cx="50" cy="50" r="49.8" fill="none" stroke="#0a0a0a" strokeWidth="5.8" />
          {KNURLS.map((k, i) => (
            <line key={i}
              x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2}
              stroke={k.bright ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.72)"}
              strokeWidth="0.45"
            />
          ))} */}

          {/* ─ Chrome edge lancip ─ */}
          {/* <circle cx="50" cy="50" r="46.4" fill="none" stroke="url(#dw_chrome)" strokeWidth="0.42" />
          <circle cx="50" cy="50" r="46.0" fill="none" stroke="rgba(0,0,0,0.92)"  strokeWidth="0.22" /> */}

          {/* ─ Tick marks ─ */}
          {/* {TICKS.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(230,228,224,0.88)"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          ))} */}

          {/* ─ Labels — radial dari luar ke dalam ─
               x={50} y={OUTER_Y}               → anchor di posisi atas (radius OUTER_R)
               textAnchor="start"                → karakter pertama di anchor = pinggir luar
               rotate(a, 50,50) rotate(90,50,8)  → posisikan + putar teks mengalir ke dalam
          */}
          {SPEEDS.map(s => (
            <text
              key={`sp-${s.v}`}
              x={50}
              y={OUTER_Y}
              textAnchor="start"
              dominantBaseline="central"
              transform={`rotate(${s.a}, 50, 50) rotate(90, 50, ${OUTER_Y})`}
              fill={s.isA ? "#ff3800" : "rgba(230,228,224,0.95)"}
              fontSize={FS}
              fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
              fontWeight={s.isA ? "900" : "700"}
              letterSpacing="0.1"
            >
              {s.v}
            </text>
          ))}

          {/* ─ Inner groove ─ */}
          <circle cx="50" cy="50" r="21.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.20" />
          <circle cx="50" cy="50" r="21.0" fill="none" stroke="rgba(0,0,0,0.72)"       strokeWidth="0.15" />

          {/* ─ Hub ─ */}
          <circle cx="50" cy="50" r="14.5" fill="url(#dw_hub)" />
          <circle cx="50" cy="50" r="14.5" fill="none" stroke="url(#dw_chrome)"          strokeWidth="0.38" />
          <circle cx="50" cy="50" r="7.0"  fill="#090909" stroke="rgba(255,255,255,0.14)" strokeWidth="0.28" />
          <circle cx="50" cy="50" r="4.2"  fill="#131313" stroke="rgba(255,255,255,0.08)" strokeWidth="0.20" />
          <circle cx="50" cy="50" r="1.4"  fill="rgba(130,128,124,0.55)" />

          {/* ─ Indicator notch ─ */}
          <rect x="49.1" y="43.8" width="1.8" height="3.2" rx="0.4"
            fill="rgba(240,238,234,0.95)" />
        </svg>
      </div>
    </div>
  )
})

DialWheel.displayName = "DialWheel"
export default DialWheel