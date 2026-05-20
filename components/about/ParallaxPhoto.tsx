"use client"

import type { ReactNode } from "react"
import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

export function ParallaxPhoto({
  src, alt, height = "70vh", speed = 0.3,
  overlayOpacity = 0.45, children,
}: {
  src: string; alt: string; height?: string; speed?: number
  overlayOpacity?: number; children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y, height: "130%", top: "-15%" }}
      >
        <Image
          src={src} alt={alt} fill
          className="object-cover"
          style={{ filter: "saturate(0.75) brightness(0.82)" }}
        />
      </motion.div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(8,18,22,${overlayOpacity}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(8,18,22,${overlayOpacity}) 100%
          )`,
        }}
      />

      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
