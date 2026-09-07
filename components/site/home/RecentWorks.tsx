"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { PhotoViewer } from "@/components/site/kategori/PhotoViewer"
import { Picture } from "@/components/picture"
import type { SitePhoto } from "@/lib/queries/site-types"

const MONTHS: Record<string, string> = {
  "01": "Januari", "02": "Februari", "03": "Maret",
  "04": "April",   "05": "Mei",      "06": "Juni",
  "07": "Juli",    "08": "Agustus",  "09": "September",
  "10": "Oktober", "11": "November", "12": "Desember",
}
const formatMonth = (m: string) => {
  const [y, mm] = m.split("-")
  return `${MONTHS[mm] ?? mm} ${y}`
}

const CAT_LABEL: Record<string, string> = { portrait: "Portrait", special: "Special", event: "Event" }

export default function RecentWorks({
  photos,
  subLabels = {},
}: {
  photos: SitePhoto[]
  subLabels?: Record<string, string>
}) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIdx, setViewerIdx] = useState(0)
  const [viewerList, setViewerList] = useState<SitePhoto[]>([])

  const label = (p: SitePhoto) =>
    p.sessionTitle ??
    (p.subSlug ? subLabels[p.subSlug] ?? p.subSlug : CAT_LABEL[p.categorySlug] ?? p.categorySlug)

  const grouped = photos.reduce<Record<string, SitePhoto[]>>((acc, p) => {
    ;(acc[p.month!] ??= []).push(p)
    return acc
  }, {})
  const sortedMonths = Object.keys(grouped).sort().reverse()

  const openViewer = (list: SitePhoto[], idx: number) => {
    setViewerList(list)
    setViewerIdx(idx)
    setViewerOpen(true)
  }

  return (
    <section className="px-4 md:px-12 pb-36 md:pb-28">
      <div className="max-w-4xl mx-auto">
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

        {sortedMonths.map((monthKey, mi) => {
          const list = grouped[monthKey]
          return (
            <motion.div
              key={monthKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: mi * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="mb-14"
            >
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
                <span className="text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
                  {list.length} foto
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {list.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    style={{ aspectRatio: photo.width > photo.height ? "4/3" : "3/4" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openViewer(list, idx)}
                  >
                    <Picture
                      photo={photo}
                      sizes="(min-width: 768px) 298px, 50vw"
                      priority={mi === 0 && idx < 4}
                      className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute bottom-1 right-1 max-w-[60%] px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
                    >
                      <span
                        className="block text-[7px] tracking-wider uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ color: "rgba(255,255,255,0.85)" }}
                      >
                        {label(photo)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}

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
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer photos={viewerList} initialIndex={viewerIdx} onClose={() => setViewerOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  )
}
