"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { Photo } from "@/data/categories"

/**
 * Kartu navigasi kategori — persegi panjang rounded, background berisi
 * 4 foto yang disusun sejajar rapat (tanpa jarak). Dipakai di setiap
 * tingkat: kategori utama, sub-kategori, maupun sesi.
 *
 * Catatan: animasi hover (lift) ada di <button> luar, sedangkan klip
 * rounded + shadow ada di <div> dalam yang tidak ikut ditransform —
 * supaya tepi foto tidak "bocor" 1px saat kartu terangkat.
 */
export function CategoryCard({ title, meta, preview, onClick, index = 0 }: {
  title: string
  meta?: string
  /** hingga 4 foto untuk background kartu */
  preview: Photo[]
  onClick: () => void
  index?: number
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      aria-label={title}
      className="group relative block w-full text-left"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl aspect-[16/7]"
        style={{
          boxShadow: "var(--glass-float)",
          transform: "translateZ(0)",
          isolation: "isolate",
        }}
      >
        {/* Strip 4 foto sejajar, rapat tanpa jarak */}
        <div className="absolute inset-0 flex" style={{ background: "var(--bg-surface-2)" }}>
          {preview.slice(0, 4).map((p, i) => (
            <div key={p.id} className="relative flex-1 overflow-hidden">
              <Image
                src={p.src}
                alt=""
                fill
                sizes="(min-width: 768px) 13vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ transitionDelay: `${i * 35}ms` }}
                loading={index < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Overlay gradasi untuk keterbacaan teks */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.10) 46%, rgba(0,0,0,0.30) 100%)",
          }}
        />

        {/* Judul + meta */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
          <h3
            className="font-light italic leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.05rem, 4.6vw, 1.45rem)",
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </h3>
          {meta && (
            <p className="mt-1 text-[10px] tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.82)" }}>
              {meta}
            </p>
          )}
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
      </div>
    </motion.button>
  )
}
