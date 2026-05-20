"use client"

import React from "react"
import { TECH_TOP, TECH_BOTTOM, TECH_LEFT, TECH_RIGHT, handFont, monoFont } from "@/constants/polaroid"

export const PolaroidFrame = React.memo(function PolaroidFrame({ mobile }: { mobile: boolean }) {
  const bt = mobile ? 38 : 72
  const bs = mobile ? 38 : 72
  const bb = mobile ? 96 : 184
  const cream   = "#f5f0e8"
  const creamDk = "#ede8dc"
  const ink     = "rgba(60,50,35,0.45)"
  const ts      = mobile ? 6 : 11

  return (
    <>
      {/* TOP */}
      <div className="absolute left-0 right-0 flex items-center justify-around overflow-hidden"
        style={{ top: 0, height: bt, background: `linear-gradient(to bottom, ${cream}, ${creamDk})`, zIndex: 20, paddingLeft: bs, paddingRight: bs }}>
        {TECH_TOP.map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.06em", whiteSpace: "nowrap", userSelect: "none" }}>{t}</span>
        ))}
      </div>

      {/* BOTTOM */}
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

      {/* LEFT */}
      <div className="absolute flex flex-col justify-around items-center overflow-hidden"
        style={{ top: 0, bottom: 0, left: 0, width: bs, background: `linear-gradient(to right, ${creamDk}, ${cream})`, zIndex: 20, paddingTop: bt, paddingBottom: bb }}>
        {TECH_LEFT.slice(0, mobile ? 8 : 12).map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.05em", whiteSpace: "nowrap", userSelect: "none", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>{t}</span>
        ))}
      </div>

      {/* RIGHT */}
      <div className="absolute flex flex-col justify-around items-center overflow-hidden"
        style={{ top: 0, bottom: 0, right: 0, width: bs, background: `linear-gradient(to left, ${creamDk}, ${cream})`, zIndex: 20, paddingTop: bt, paddingBottom: bb }}>
        {TECH_RIGHT.slice(0, mobile ? 8 : 12).map((t, i) => (
          <span key={i} style={{ fontFamily: monoFont, fontSize: ts, color: ink, letterSpacing: "0.05em", whiteSpace: "nowrap", userSelect: "none", writingMode: "vertical-rl", textOrientation: "mixed" }}>{t}</span>
        ))}
      </div>

      {/* Outer border */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 25, borderRadius: 0, border: `${mobile ? 2 : 3}px solid rgba(255,255,255,0.35)`,
          boxShadow: `0 ${mobile ? 12 : 32}px ${mobile ? 45 : 110}px rgba(0,0,0,0.70), 0 ${mobile ? 4 : 10}px ${mobile ? 14 : 35}px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.22)` }} />

      {/* Light leak */}
      <div className="absolute left-0 right-0 pointer-events-none"
        style={{ top: bt, height: mobile ? 45 : 100, zIndex: 19, background: "linear-gradient(to bottom, rgba(255,238,180,0.11) 0%, transparent 100%)", mixBlendMode: "screen" }} />
    </>
  )
})
