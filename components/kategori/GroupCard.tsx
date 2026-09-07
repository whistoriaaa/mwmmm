"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { Photo } from "@/data/categories"

export interface GroupCardData {
  /** Nama sesi / orang / trip, mis. "Aira", "Fendra & Wife" */
  name: string
  /** Semua foto milik grup ini */
  photos: Photo[]
  /** 4–5 foto untuk strip background kartu */
  preview: Photo[]
  subLabel?: string | null
  dateLabel?: string | null
}

/**
 * Kartu sesi — persegi panjang rounded, background berisi 4–5 foto
 * yang disusun sejajar. Klik → buka detail seluruh foto grup.
 */
export function GroupCard({ data, onClick, index = 0 }: {
  data: GroupCardData
  onClick: () => void
  index?: number
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      aria-label={`Lihat semua foto ${data.name} (${data.photos.length} foto)`}
      className="group relative w-full overflow-hidden rounded-2xl text-left aspect-[16/7]"
      style={{ border: "1px solid var(--border)", boxShadow: "var(--glass-float)" }}
    >
      {/* Strip foto sejajar sebagai background */}
      <div className="absolute inset-0 flex gap-1" style={{ background: "var(--bg-surface-2)" }}>
        {data.preview.map((p, i) => (
          <div key={p.id} className="relative flex-1 overflow-hidden">
            <Image
              src={p.src}
              alt=""
              fill
              sizes="(min-width: 768px) 12vw, 22vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ transitionDelay: `${i * 35}ms` }}
              loading={index < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Overlay gradasi untuk keterbacaan teks */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 46%, rgba(0,0,0,0.30) 100%)",
        }}
      />

      {/* Judul + meta */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
        <h3
          className="font-light italic leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.05rem, 4.6vw, 1.4rem)",
            color: "#fff",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {data.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.92)" }}>
            {data.photos.length} foto
          </span>
          {data.subLabel && (
            <>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
              <span className="text-[10px] tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.72)" }}>
                {data.subLabel}
              </span>
            </>
          )}
          {data.dateLabel && (
            <>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
              <span className="text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.58)" }}>
                {data.dateLabel}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Petunjuk klik */}
      <div
        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </motion.button>
  )
}
