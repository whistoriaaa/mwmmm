"use client"

import { motion } from "motion/react"

export function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between">
      <motion.span
        className="block h-px w-full origin-center"
        style={{ backgroundColor: "var(--text-primary)" }}
        animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="block h-px w-full origin-center"
        style={{ backgroundColor: "var(--text-primary)" }}
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 0.75 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-px w-full origin-center"
        style={{ backgroundColor: "var(--text-primary)" }}
        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
