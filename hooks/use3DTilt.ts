"use client"

import type { MouseEvent } from "react"
import { useMotionValue, useSpring } from "motion/react"

export function use3DTilt(strength = 10) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 180, damping: 22 })
  const springY = useSpring(rotateY, { stiffness: 180, damping: 22 })
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * strength)
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -strength)
  }
  const onMouseLeave = () => { rotateX.set(0); rotateY.set(0) }
  return { springX, springY, onMouseMove, onMouseLeave }
}
