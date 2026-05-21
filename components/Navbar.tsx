"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react"
import { navItems } from "@/data/navigation"
import { ScrollToTop } from "@/components/navbar/ScrollToTop"

export default function Navbar() {
  const pathname    = usePathname()
  const { scrollY } = useScroll()
  const [pastHero, setPastHero] = useState(false)
  const [mobile, setMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastHero(latest > window.innerHeight * 0.88)
  })

  // Belum mount — hindari flash
  if (mobile === null) return null

  // Mobile: hanya tampilkan ScrollToTop, navbar atas disembunyikan
  if (mobile) return <ScrollToTop />

  return (
    <>
      <AnimatePresence>
        <motion.nav
          key="navbar"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <motion.div
            className="absolute inset-0 backdrop-blur-md"
            animate={{ opacity: pastHero ? 1 : 0 }}
            style={{ backgroundColor: "var(--navbar-bg)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            animate={{ opacity: pastHero ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "linear-gradient(to right, transparent, var(--cyan), transparent)" }}
          />

          <div className="relative flex justify-between items-center px-8 py-5 md:py-6">
            <Link
              href="/"
              className="italic tracking-wider"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--gold)" }}
            >
              Shobiryne
            </Link>

            <ul className="flex gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className="text-xs tracking-widest uppercase transition-colors duration-300"
                      style={{ color: isActive ? "var(--cyan)" : "var(--text-muted)" }}
                    >
                      {item.label}
                    </Link>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-px"
                        style={{ backgroundColor: "var(--cyan)", boxShadow: "0 0 8px var(--border-accent)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </motion.nav>
      </AnimatePresence>

      <ScrollToTop />
    </>
  )
}
