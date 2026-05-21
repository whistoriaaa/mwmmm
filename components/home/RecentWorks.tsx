"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { allPhotos } from "@/data/portfolio"
import type { Item } from "@/types/gallery"
import { PhotoViewer } from "@/components/kategori/PhotoViewer"
import type { Photo } from "@/data/categories"

const MONTHS: Record<string, string> = {
  "01": "Januari", "02": "Februari", "03": "Maret",
  "04": "April",   "05": "Mei",      "06": "Juni",
  "07": "Juli",    "08": "Agustus",  "09": "September",
  "10": "Oktober", "11": "November", "12": "Desember",
}

function formatMonth(dateStr: string) {
  const [year, month] = dateStr.split("-")
  return `${MONTHS[month] ?? month} ${year}`
}

function itemToPhoto(item: Item): Photo {
  return { id: item.id, src: item.src, w: item.w, h: item.h, category: "portrait" }
}

const categoryLabel: Record<string, string> = {
  potrait: "Portrait",
  event:   "Event",
  product: "Product",
}

export default function RecentWorks() {
  const [viewerOpen,  setViewerOpen]  = useState(false)
  const [viewerIdx,   setViewerIdx]   = useState(0)
  const [viewerList,  setViewerList]  = useState<Photo[]>([])

  const withDate = allPhotos.filter(p => p.date)
  const grouped = withDate.reduce<Record<string, Item[]>>((acc, p) => {
    const key = p.date!
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})
  const sortedMonths = Object.keys(grouped).sort().reverse()

  const openViewer = (allInMonth: Item[], idx: number) => {
    setViewerList(allInMonth.map(itemToPhoto))
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
            Timeline
          </motion.h2>
        </div>

        {/* ── Grouped by month ── */}
        {sortedMonths.map((monthKey, mi) => {
          const photos = grouped[monthKey]
          return (
            <motion.div
              key={monthKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: mi * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="mb-14"
            >
              {/* Month separator */}
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="text-xs tracking-[0.35em] uppercase whitespace-nowrap"
                  style={{ color: "var(--gold)", opacity: 0.8 }}
                >
                  {formatMonth(monthKey)}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(to right, rgba(211,179,102,0.25), transparent)" }}
                />
                <span
                  className="text-[10px] tracking-wider"
                  style={{ color: "var(--text-faint)" }}
                >
                  {photos.length} foto
                </span>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    style={{ aspectRatio: photo.w > photo.h ? "4/3" : "3/4" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openViewer(photos, idx)}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={mi === 0 && idx < 4 ? "eager" : "lazy"}
                    />

                    {/* Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }}
                    >
                      <div
                        className="self-end text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-lg"
                        style={{
                          background: "rgba(0,0,0,0.55)",
                          backdropFilter: "blur(6px)",
                          color: "var(--cyan)",
                          border: "1px solid rgba(34,179,208,0.3)",
                        }}
                      >
                        {formatMonth(monthKey)}
                      </div>
                      <span
                        className="text-[10px] tracking-widest uppercase"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {categoryLabel[photo.category] ?? photo.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}

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
