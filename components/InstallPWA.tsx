"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "pwa-install-dismissed"

function isStandalone() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSHint, setShowIOSHint] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)

    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    let timer: ReturnType<typeof setTimeout> | undefined
    if (isIOS) {
      timer = setTimeout(() => {
        setShowIOSHint(true)
        setVisible(true)
      }, 2500)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, "1")
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, "1")
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-4 right-4 z-60 md:left-auto md:right-6 md:w-80"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 84px)" }}
        >
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: "var(--bottom-nav-bg)",
              backdropFilter: "blur(24px)",
              border: "1px solid var(--nav-border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-light italic"
              style={{ background: "var(--gold)", color: "#080c10", fontFamily: "var(--font-display)", fontSize: "18px" }}
            >
              S
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                Pasang Aplikasi Shobiryne
              </p>
              <p className="text-[10px] leading-snug mt-0.5" style={{ color: "var(--text-faint)" }}>
                {showIOSHint
                  ? "Tap tombol Share, lalu pilih \"Add to Home Screen\""
                  : "Akses lebih cepat dari layar utama HP kamu"}
              </p>
            </div>

            {!showIOSHint && (
              <button
                onClick={install}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] tracking-wide uppercase"
                style={{ background: "var(--cyan)", color: "#fff", fontWeight: 600 }}
              >
                Install
              </button>
            )}

            <button
              onClick={dismiss}
              aria-label="Tutup"
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
              style={{ color: "var(--text-faint)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
