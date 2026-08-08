"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { allCategoryPhotos, type Photo } from "@/data/categories"
import { PhotoViewer } from "@/components/kategori/PhotoViewer"

export default function RecentWorks() {
  const [viewerOpen,  setViewerOpen]  = useState(false)
  const [viewerIdx,   setViewerIdx]   = useState(0)
  const [viewerList,  setViewerList]  = useState<Photo[]>([])

  const couplePhotos = allCategoryPhotos.filter(p => p.sub === "couple")

  const openViewer = (idx: number) => {
    setViewerList(couplePhotos)
    setViewerIdx(idx)
    setViewerOpen(true)
  }

  return (
    <section className="px-4 md:px-12 pb-36 md:pb-28">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.45em] uppercase mb-3"
            style={{ color: "var(--cyan)", opacity: 0.75 }}
          >
            Karya Terbaru
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-light italic leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--gold)",
            }}
          >
            Couple Session
          </motion.h2>
        </div>

        {/* ── Couple session grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {couplePhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              style={{ aspectRatio: photo.w > photo.h ? "4/3" : "3/4" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openViewer(idx)}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading={idx < 6 ? "eager" : "lazy"}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }}
              >
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Couple Session
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center pt-2"
        >
          <Link
            href="/kategori"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg text-xs tracking-widest uppercase transition-all duration-300"
            style={{
              border: "1px solid rgba(211,179,102,0.3)",
              color: "var(--gold)",
              background: "rgba(211,179,102,0.05)",
            }}
          >
            Lihat Semua Karya
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Photo viewer */}
      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer
            photos={viewerList}
            initialIndex={viewerIdx}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
