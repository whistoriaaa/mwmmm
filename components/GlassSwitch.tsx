"use client"

import { motion, AnimatePresence } from "motion/react"

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  "aria-label"?: string
  /** Ikon di sisi thumb saat checked (mis. bulan) */
  iconOn?: React.ReactNode
  /** Ikon di sisi thumb saat tidak checked (mis. matahari) */
  iconOff?: React.ReactNode
}

const TRACK_W = 58
const TRACK_H = 30
const THUMB = 24
const PAD = 3
const TRAVEL = TRACK_W - THUMB - PAD * 2

/**
 * Switch bergaya shadcn/ui — track glassmorphism, thumb geser dengan
 * animasi spring, ikon crossfade. Tanpa dependency (pakai `motion`).
 */
export function GlassSwitch({
  checked,
  onCheckedChange,
  disabled,
  iconOn,
  iconOff,
  "aria-label": ariaLabel,
}: SwitchProps) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center rounded-full"
      style={{
        width: TRACK_W,
        height: TRACK_H,
        padding: PAD,
        flexShrink: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: "var(--navbar-bg)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        boxShadow: "var(--glass-edge)",
      }}
    >
      {/* Thumb */}
      <motion.span
        className="relative flex items-center justify-center rounded-full"
        animate={{ x: checked ? TRAVEL : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
        style={{
          width: THUMB,
          height: THUMB,
          background: checked ? "var(--cyan)" : "#ffffff",
          color: checked ? "var(--background)" : "var(--gold)",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={checked ? "on" : "off"}
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex"
          >
            {checked ? iconOn : iconOff}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.button>
  )
}
