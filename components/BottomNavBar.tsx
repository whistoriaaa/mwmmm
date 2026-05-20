"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

const navItems = [
  {
    label: "Beranda",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    label: "Kategori",
    href: "/kategori",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1"/>
        <rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/>
        <rect x="13" y="13" width="8" height="8" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Tentang",
    href: "/about",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    label: "Kontak",
    href: "/contact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
]

export default function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-2 left-6 right-6 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="rounded-2xl"
        style={{
          background: "rgba(14,18,22,0.94)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <ul className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = item.href === "/#works" ? false : pathname === item.href
            return (
              <li key={item.href} className="flex-1">
                <Link href={item.href} className="flex flex-col items-center gap-1 py-0.5 relative">
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "var(--cyan)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.div
                    animate={{
                      color: isActive ? "var(--cyan)" : "rgba(255,255,255,0.38)",
                      scale: isActive ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span
                    className="text-[9px] tracking-wider uppercase"
                    style={{
                      color: isActive ? "var(--cyan)" : "rgba(255,255,255,0.38)",
                      fontFamily: "var(--font-body)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
