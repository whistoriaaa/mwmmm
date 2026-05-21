"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { MAX_ZOOM_DESKTOP, MAX_ZOOM_MOBILE } from "@/constants/polaroid"

export default function PolaroidParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const maxZoom    = mobile ? MAX_ZOOM_MOBILE : MAX_ZOOM_DESKTOP
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, maxZoom])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#000",
        height: "100dvh",
        minHeight: "100dvh",
      }}
    >
      {/* Foto dengan parallax zoom */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: photoScale,
          transformOrigin: "center center",
          zIndex: 1,
          willChange: "transform",
        }}
      >
        <Image
          src="/photos/hero/DSCF0093.jpg"
          alt="Shobiryne portfolio"
          fill
          className="object-cover"
          style={{ objectPosition: "center center" }}
          priority
          quality={75}
        />
        {/* Vignette + color grade */}
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

      {/* Teks hero */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="text-center px-6">
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
