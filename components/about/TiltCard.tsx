"use client"

import type { ReactNode, CSSProperties, MouseEvent } from "react"
import { motion, useMotionValue, useTransform } from "motion/react"
import { use3DTilt } from "@/hooks/use3DTilt"

export function TiltCard({ children, className, style }: {
  children: ReactNode; className?: string; style?: CSSProperties
}) {
  const { springX, springY, onMouseMove, onMouseLeave } = use3DTilt()
  const glowX = useMotionValue(50); const glowY = useMotionValue(50)
  const glowBg = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(34,179,208,0.12) 0%, transparent 55%)`
  )
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove(e)
    const rect = e.currentTarget.getBoundingClientRect()
    glowX.set(((e.clientX - rect.left) / rect.width) * 100)
    glowY.set(((e.clientY - rect.top) / rect.height) * 100)
  }
  return (
    <motion.div
      onMouseMove={onMove} onMouseLeave={onMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d", perspective: 800, ...style }}
      className={className}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  )
}
