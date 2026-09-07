"use client"

import { useState } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react"

export function ScrollToTop() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > window.innerHeight * 0.5)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed z-50 w-11 h-11 flex items-center justify-center rounded-full border"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)",
            right: "calc(env(safe-area-inset-right) + 1rem)",
            background: "var(--bottom-nav-bg)",
            borderColor: "var(--cyan)",
            color: "var(--cyan)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: "var(--glass-float)",
          }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(34,179,208,0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
