"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { navItems } from "@/data/navigation"

export function MobileMenu({ isOpen, onClose, pathname }: {
  isOpen: boolean; onClose: () => void; pathname: string
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
          style={{ backgroundColor: "rgba(8,18,22,0.97)", backdropFilter: "blur(20px)" }}
        >
          <ul className="flex flex-col items-center gap-10">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href
              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="relative text-4xl font-light italic tracking-wider transition-colors duration-300"
                    style={{ fontFamily: "var(--font-display)", color: isActive ? "var(--gold)" : "var(--text-primary)" }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="mobileActiveNav"
                        className="absolute -bottom-1 left-0 right-0 h-px"
                        style={{ background: "var(--gold)", boxShadow: "0 0 10px rgba(211,179,102,0.5)" }}
                      />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-10 text-xs tracking-[0.4em] uppercase"
            style={{ color: "var(--text-faint)" }}
          >
            Shobirine Studio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
