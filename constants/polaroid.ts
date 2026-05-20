import type { CSSProperties } from "react"

export const MAX_ZOOM_DESKTOP = 3.5
export const MAX_ZOOM_MOBILE  = 2.2

export const GRAIN_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 30,
  opacity: 0.04,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
  backgroundRepeat: "repeat",
  backgroundSize: "200px 200px",
  mixBlendMode: "overlay",
  willChange: "auto",
}

export const TECH_TOP    = ["f/1.8", "ISO 400", "1/500s", "35mm", "RAW", "f/2.8", "ISO 200", "1/250s"]
export const TECH_BOTTOM = ["EV +0.3", "AWB", "sRGB", "JPEG+RAW", "AF-S", "±0", "f/1.4", "TTL"]
export const TECH_LEFT   = ["f/1.8", "ISO 400", "1/500s", "35mm", "RAW", "EV 0", "AWB", "f/2.8", "ISO 200", "1/250s", "sRGB", "AF-S"]
export const TECH_RIGHT  = ["JPEG", "f/1.4", "ISO 800", "1/125s", "50mm", "RAW", "EV -0.3", "AWB", "f/4.0", "ISO 100", "1/1000s", "TTL"]

export const handFont = "'Dancing Script', 'Segoe Script', cursive"
export const monoFont = "'Courier New', Courier, monospace"
