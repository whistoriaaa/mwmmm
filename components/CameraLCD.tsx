"use client"

import { forwardRef } from "react"

interface CameraLCDProps {
  ss?:   string
  fnum?: string
  ev?:   string
  iso?:  string
  mode?: string
}

function LCDRow({
  label,
  value,
  valueSize = "clamp(48px, 6vw, 84px)",
}: {
  label: string
  value: string
  valueSize?: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
      <span style={{
        fontSize:      "clamp(21px, 2.25vw, 30px)",
        color:         "rgba(190,190,190,0.65)",
        fontFamily:    "'Courier New', monospace",
        letterSpacing: "0.08em",
        lineHeight:    1,
        minWidth:      "clamp(48px, 6vw, 78px)",
      }}>
        {label}
      </span>
      <span style={{
        fontSize:      valueSize,
        color:         "rgba(225,225,225,0.95)",
        fontFamily:    "'Courier New', 'Roboto Mono', monospace",
        fontWeight:    400,
        letterSpacing: "0.02em",
        lineHeight:    1,
      }}>
        {value}
      </span>
    </div>
  )
}

function LCDBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background:    "rgba(200,200,200,0.12)",
      border:        "1px solid rgba(200,200,200,0.2)",
      borderRadius:  "4px",
      padding:       "6px 12px",
      fontSize:      "clamp(15px, 1.95vw, 24px)",
      color:         "rgba(200,200,200,0.8)",
      fontFamily:    "'Courier New', monospace",
      fontWeight:    700,
      letterSpacing: "0.04em",
      textAlign:     "center" as const,
      lineHeight:    1.3,
      whiteSpace:    "pre" as const,
    }}>
      {children}
    </div>
  )
}

const CameraLCD = forwardRef<HTMLDivElement, CameraLCDProps>((
  { ss = "500", fnum = "2.8", ev = "±0", iso = "200", mode = "M" },
  ref
) => {
  return (
    <div
      ref={ref}
      style={{
        position:      "absolute",
        top:           "100%",
        left:          "calc(10% + clamp(140px, 30vw, 350px) + 14px)",
        transform:     "translateY(-50%)",
        width:         "clamp(300px, 51vw, 600px)",  // ← 3x
        zIndex:        3,
        pointerEvents: "none",
        userSelect:    "none",
      }}
    >
      <div style={{
        background:   "#161616",
        borderRadius: "clamp(10px, 1.2vw, 18px)",
        border:       "1.5px solid rgba(255,255,255,0.10)",
        padding:      "clamp(24px, 3vw, 42px) clamp(30px, 3.6vw, 48px) clamp(18px, 2.4vw, 30px)",
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.06)",
          "inset 0 -2px 6px rgba(0,0,0,0.45)",
          "0 6px 28px rgba(0,0,0,0.75)",
          "0 2px 6px rgba(0,0,0,0.9)",
        ].join(", "),
      }}>

        {/* S.S. */}
        <LCDRow label="S.S." value={ss} valueSize="clamp(54px, 7.8vw, 96px)" />

        {/* F */}
        <LCDRow label="F" value={fnum} valueSize="clamp(48px, 6.9vw, 84px)" />

        {/* EV */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <svg width="clamp(24px,3vw,36px)" height="clamp(24px,3vw,36px)" viewBox="0 0 12 12"
            fill="none" style={{ opacity: 0.55, flexShrink: 0 }}>
            <rect x="0.5" y="0.5" width="11" height="11" rx="1" stroke="rgba(200,200,200,0.8)" strokeWidth="0.8"/>
            <path d="M4 0.5v11M8 0.5v11M0.5 4h11M0.5 8h11" stroke="rgba(200,200,200,0.8)" strokeWidth="0.6"/>
          </svg>
          <span style={{
            fontSize:      "clamp(30px, 3.3vw, 42px)",
            color:         "rgba(210,210,210,0.85)",
            fontFamily:    "'Courier New', monospace",
            letterSpacing: "0.04em",
          }}>
            {ev}
          </span>
        </div>

        {/* ISO */}
        <LCDRow label="ISO" value={iso} valueSize="clamp(36px, 5.1vw, 60px)" />

        {/* Divider */}
        <div style={{
          height:     "1px",
          background: "rgba(255,255,255,0.07)",
          margin:     "clamp(12px, 1.5vw, 21px) 0",
        }} />

        {/* Badges */}
        <div style={{ display: "flex", gap: "clamp(6px,0.9vw,12px)", flexWrap: "wrap" }}>
          <LCDBadge>{mode}</LCDBadge>
          <LCDBadge>L</LCDBadge>
          <LCDBadge>{"WB\nAUTO"}</LCDBadge>
          <LCDBadge>E</LCDBadge>
        </div>

      </div>
    </div>
  )
})

CameraLCD.displayName = "CameraLCD"
export default CameraLCD