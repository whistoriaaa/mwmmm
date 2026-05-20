"use client"

import { useState, useEffect } from "react"
import { motion, useSpring, useTransform } from "motion/react"
import { useMousePosition } from "@/hooks/useMousePosition"

export function Spotlight() {
  const { x, y } = useMousePosition()
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })
  const [visible, setVisible] = useState(false)
  const bgGradient = useTransform(
    [sx, sy],
    ([cx, cy]: number[]) =>
      `radial-gradient(320px circle at ${cx}px ${cy}px, rgba(34,179,208,0.045) 0%, transparent 70%)`
  )
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])
  if (!visible) return null
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ background: bgGradient }}
    />
  )
}
