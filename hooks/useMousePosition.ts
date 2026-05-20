"use client"

import { useEffect } from "react"
import { useMotionValue } from "motion/react"

export function useMousePosition() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [x, y])
  return { x, y }
}
