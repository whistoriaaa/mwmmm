"use client"

import { motion } from "motion/react"

export function SubFilter<T extends string>({
  subs,
  active,
  onSelect,
}: {
  subs:     { key: T; label: string }[]
  active:   T | null
  onSelect: (k: T | null) => void
}) {
  return (
    <motion.div
      key="subfilter"
      initial={{ opacity: 0, height: 0, y: -6 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{   opacity: 0, height: 0,      y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div
        className="w-full mt-2 mb-1"
        style={{ height: "1px", background: "linear-gradient(to left, rgba(255,255,255,0.08), transparent)" }}
      />

      <div className="flex gap-1.5 flex-wrap justify-end pt-1.5">
        <button
          onClick={() => onSelect(null)}
          className="px-3 py-1 rounded-lg text-xs tracking-wider uppercase transition-all duration-250"
          style={{
            color:           active === null ? "var(--gold)" : "var(--text-muted)",
            border:          `1px solid ${active === null ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
            backgroundColor: active === null ? "rgba(212,175,55,0.08)" : "transparent",
          }}
        >
          All
        </button>

        {subs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSelect(active === key ? null : key)}
            className="px-3 py-1 rounded-lg text-xs tracking-wider uppercase transition-all duration-250"
            style={{
              color:           active === key ? "var(--gold)" : "var(--text-muted)",
              border:          `1px solid ${active === key ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
              backgroundColor: active === key ? "rgba(212,175,55,0.08)" : "transparent",
              whiteSpace:      "nowrap",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
