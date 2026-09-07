"use client"

import type { ReactNode, CSSProperties, MouseEvent } from "react"
import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function MagneticBtn({ children, className, style, href }: {
  children: ReactNode; className?: string
  style?: CSSProperties; href?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })
  const onMove = (e: MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.a href={href} whileTap={{ scale: 0.95 }} className={className} style={style}>
        {children}
      </motion.a>
    </motion.div>
  )
}
