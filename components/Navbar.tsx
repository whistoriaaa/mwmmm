"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Portofolio", href: "/" },
  { label: "About",      href: "/about" },
  { label: "Contact",    href: "/contact" },
]

// ─── Scroll To Top ─────────────────────────────────────────────
function ScrollToTop() {
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
          className="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full border"
          style={{ background: "var(--bg-surface)", borderColor: "var(--cyan)", color: "var(--cyan)", backdropFilter: "blur(8px)" }}
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

// ─── Hamburger ─────────────────────────────────────────────────
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
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

// ─── Mobile Menu ───────────────────────────────────────────────
function MobileMenu({ isOpen, onClose, pathname }: { isOpen: boolean; onClose: () => void; pathname: string }) {
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

// ─── Navbar ────────────────────────────────────────────────────
export default function Navbar() {
  const pathname    = usePathname()
  const { scrollY } = useScroll()
  const [pastGallery, setPastGallery] = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastGallery(latest > window.innerHeight * 0.88)
  })

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          animate={{ opacity: pastGallery && !menuOpen ? 1 : 0, backgroundColor: "rgba(14,40,48,0.88)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          animate={{ opacity: pastGallery && !menuOpen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "linear-gradient(to right, transparent, var(--cyan), transparent)" }}
        />

        <div className="relative flex justify-between items-center px-6 md:px-8 py-5 md:py-6">
          <Link
            href="/"
            className="italic tracking-wider"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--gold)" }}
          >
            Shobiryne
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex gap-8">
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
                      style={{ backgroundColor: "var(--cyan)", boxShadow: "0 0 8px rgba(34,179,208,0.6)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative z-50 p-2 -mr-2"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon isOpen={menuOpen} />
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
      <ScrollToTop />
    </>
  )
}