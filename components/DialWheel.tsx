"use client"

import { forwardRef } from "react"

// ── Pre-computed constants ─────────────────────────────────────────────────
const D    = 80     // disc diameter (vw)
const HR   = D / 2  // 40vw — radius
const RIMH = 4.0    // rim border thickness (vw)

// ── 72 tick marks on face (every 5°) ──────────────────────────────────────
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a  = (i * 5 * Math.PI) / 180
  const s  = Math.sin(a), c = Math.cos(a)
  const mj = i % 6 === 0
  const md = !mj && i % 3 === 0
  const ro = 48.7
  const ri = mj ? 41.0 : md ? 44.5 : 46.5
  return {
    x1: Number((50 + ri * s).toFixed(4)), y1: Number((50 - ri * c).toFixed(4)),
    x2: Number((50 + ro * s).toFixed(4)), y2: Number((50 - ro * c).toFixed(4)),
    mj, md,
  }
})

// ── Shutter-speed labels ───────────────────────────────────────────────────
const SPEEDS = [
  { v: "A",   a: -115 }, { v: "B",   a: -95 }, { v: "T",   a: -76 },
  { v: "1",   a:  -58 }, { v: "2",   a: -41 }, { v: "4",   a: -25 },
  { v: "8",   a:   -9 }, { v: "15",  a:   0 }, { v: "30",  a:   9 },
  { v: "60",  a:   25 }, { v: "125", a:  41 }, { v: "250", a:  58 },
  { v: "500", a:   76 }, { v: "1000",  a:  95 }, { v: "2000",  a: 115 },
].map(s => {
  const r = (s.a * Math.PI) / 180
  return { ...s,
    x: Number((50 + 36 * Math.sin(r)).toFixed(4)),
    y: Number((50 - 36 * Math.cos(r)).toFixed(4)),
  }
})

// ── Component ──────────────────────────────────────────────────────────────
const DialWheel = forwardRef<HTMLDivElement>((_, ref) => (
  <>
    <div
      aria-hidden="true"
      style={{
        position:          "absolute",
        // geser ke bawah agar hanya separuh disc terlihat di viewport
        bottom:            `-${HR * 0.56}vw`,
        left:              "50%",
        transform:         "translateX(-50%)",
        width:             `${D}vw`,
        height:            `${D * 0.5}vw`,
        zIndex:            3,
        pointerEvents:     "none",
        userSelect:        "none",
        perspective:       `clamp(900px, 130vw, 2200px)`,
        perspectiveOrigin: "50% 18%",
        overflow:          "hidden",
      }}
    >
      {/* Tilt wrapper */}
      <div
        style={{
          width:           "100%",
          height:          "100%",
          transform:       "rotateX(68deg)",
          transformStyle:  "preserve-3d",
          transformOrigin: "50% 100%",
        }}
      >
        {/* SpinDisc — GSAP rotateZ target */}
        <div
          ref={ref}
          style={{
            position:       "absolute",
            bottom:         0,
            left:           `calc(50% - ${HR}vw)`,
            width:          `${D}vw`,
            height:         `${D}vw`,
            transformStyle: "preserve-3d",
            willChange:     "transform",
          }}
        >
          {/* ══ DISC FACE ══════════════════════════════════════════ */}
          <div style={{
            position:     "absolute",
            inset:        0,
            borderRadius: "50%",
            background: [
              "radial-gradient(ellipse at 32% 26%, rgba(255,255,255,0.055) 0%, transparent 50%)",
              "radial-gradient(circle, #242424 0%, #1b1b1b 28%, #141414 62%, #0e0e0e 100%)",
            ].join(", "),
            // Rim: shadow berlapis — silver tipis → hitam tebal → silver faint
            boxShadow: [
              `0 0 0 ${D * 0.004}vw rgba(220,220,220,0.25)`,
              `0 0 0 ${D * 0.009}vw rgba(0,0,0,0.98)`,
              `0 0 0 ${D * 0.014}vw rgba(160,160,160,0.10)`,
              `0 0 0 ${D * 0.018}vw rgba(0,0,0,0.70)`,
            ].join(", "),
          }}>
            <svg
              viewBox="0 0 100 100"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="dlFaceHL" cx="32%" cy="26%" r="50%">
                  <stop offset="0%"   stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="dlHubGr" cx="38%" cy="32%" r="62%">
                  <stop offset="0%"   stopColor="#303030" />
                  <stop offset="100%" stopColor="#0f0f0f" />
                </radialGradient>
              </defs>

              {/* Highlight */}
              <circle cx="50" cy="50" r="49" fill="url(#dlFaceHL)" />

              {/* Outer bevel rings */}
              <circle cx="50" cy="50" r="49.3" fill="none" stroke="rgba(200,200,200,0.30)" strokeWidth="0.28" />
              <circle cx="50" cy="50" r="48.7" fill="none" stroke="rgba(0,0,0,0.90)"       strokeWidth="0.22" />
              <circle cx="50" cy="50" r="48.2" fill="none" stroke="rgba(200,200,200,0.08)" strokeWidth="0.16" />

              {/* Tick marks */}
              {TICKS.map((t, i) => (
                <line key={i}
                  x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke={
                    t.mj ? "rgba(225,225,225,0.95)"
                         : t.md ? "rgba(155,155,155,0.60)"
                                : "rgba(95,95,95,0.42)"
                  }
                  strokeWidth={t.mj ? "0.72" : t.md ? "0.44" : "0.26"}
                  strokeLinecap="round"
                />
              ))}

              {/* Label ring separator */}
              <circle cx="50" cy="50" r="40.8" fill="none" stroke="rgba(180,180,180,0.22)" strokeWidth="0.17" />

              {/* Shutter-speed labels */}
              {SPEEDS.map(s => (
                <text
                  key={`sp-${s.v}-${s.a}`}
                  x={s.x} y={s.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={
                    s.a === 0     ? "#c0392b"
                    : s.v === "A" ? "rgba(220,220,220,0.92)"
                    : "rgba(175,175,175,0.75)"
                  }
                  fontSize={s.v.length > 2 ? "2.1" : "2.55"}
                  fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
                  fontWeight={s.a === 0 ? "700" : s.v === "A" ? "600" : "400"}
                >
                  {s.v}
                </text>
              ))}

              {/* Active marker — 12-o'clock */}
              {/* <polygon points="50,1.0 48.4,4.4 51.6,4.4" fill="#c0392b" />
              <line x1="50" y1="4.8" x2="50" y2="7.5"
                stroke="#c0392b" strokeWidth="0.55" strokeLinecap="round" /> */}

              {/* Inner ring */}
              <circle cx="50" cy="50" r="21.5" fill="none" stroke="rgba(170,170,170,0.18)" strokeWidth="0.17" />

              {/* Hub */}
              <circle cx="50" cy="50" r="13.5" fill="url(#dlHubGr)"    stroke="rgba(180,180,180,0.38)" strokeWidth="0.28" />
              <circle cx="50" cy="50" r="8.2"  fill="none"             stroke="rgba(80,80,80,0.50)"    strokeWidth="0.18" />
              <circle cx="50" cy="50" r="3.6"  fill="#1c1c1c"          stroke="rgba(175,175,175,0.52)" strokeWidth="0.30" />
              <circle cx="50" cy="50" r="1.3"  fill="rgba(200,200,200,0.72)" />
            </svg>
          </div>

        </div>{/* /SpinDisc */}
      </div>{/* /TiltWrapper */}
    </div>{/* /PerspectiveContainer */}
  </>
))

DialWheel.displayName = "DialWheel"
export default DialWheel