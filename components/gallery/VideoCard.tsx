"use client"

import { useRef, useEffect } from "react"

export function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}) }
  }, [])
  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <video ref={videoRef} src={src} loop playsInline className="w-full h-full object-cover" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
        style={{ background: "rgba(14,40,48,0.75)", backdropFilter: "blur(6px)" }}>
        <svg width="8" height="9" viewBox="0 0 8 9" fill="var(--pink)"><path d="M0 0.5L8 4.5L0 8.5V0.5Z"/></svg>
        <span className="tracking-widest uppercase" style={{ color: "var(--pink)", fontSize: "10px" }}>Video</span>
      </div>
    </div>
  )
}
