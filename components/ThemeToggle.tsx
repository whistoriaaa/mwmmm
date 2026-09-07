"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/ThemeProvider"
import { Switch } from "@/components/ui/switch"

const SunIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.5" />
    <line x1="12" y1="1.5" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22.5" />
    <line x1="3.5" y1="3.5" x2="5.3" y2="5.3" />
    <line x1="18.7" y1="18.7" x2="20.5" y2="20.5" />
    <line x1="1.5" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22.5" y2="12" />
    <line x1="3.5" y1="20.5" x2="5.3" y2="18.7" />
    <line x1="18.7" y1="5.3" x2="20.5" y2="3.5" />
  </svg>
)

const MoonIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = mounted && theme === "dark"

  return (
    <Switch
      checked={isDark}
      onCheckedChange={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      iconOff={SunIcon}
      iconOn={MoonIcon}
    />
  )
}
