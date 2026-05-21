"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { categoryDefs, allCategoryPhotos, type MainCat, type SubCat, type Photo } from "@/data/categories"
import { PhotoViewer } from "@/components/kategori/PhotoViewer"

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

export default function KategoriPage() {
  const [mainCat,     setMainCat]     = useState<MainCat | null>(null)
  const [subCat,      setSubCat]      = useState<SubCat | null>(null)
  const [viewerOpen,  setViewerOpen]  = useState(false)
  const [viewerIdx,   setViewerIdx]   = useState(0)
  const [viewerList,  setViewerList]  = useState<Photo[]>([])

  const filtered = allCategoryPhotos.filter(p => {
    if (!mainCat) return true
    if (p.category !== mainCat) return false
    if (subCat && p.sub !== subCat) return false
    return true
  })

  const activeDef = categoryDefs.find(c => c.key === mainCat)

  // Kelompokkan per bulan saat subcategory aktif
  const groupedByMonth = subCat
    ? filtered.reduce<Record<string, Photo[]>>((acc, p) => {
        const key = p.date ?? "unknown"
        if (!acc[key]) acc[key] = []
        acc[key].push(p)
        return acc
      }, {})
    : null

  const sortedMonthKeys = groupedByMonth
    ? Object.keys(groupedByMonth).filter(k => k !== "unknown").sort().reverse()
    : []

  const unknownGroup = groupedByMonth?.["unknown"] ?? []

  const openViewer = (list: Photo[], idx: number) => {
    setViewerList(list)
    setViewerIdx(idx)
    setViewerOpen(true)
  }

  const selectMain = (key: MainCat) => {
    if (mainCat === key) { setMainCat(null); setSubCat(null) }
    else { setMainCat(key); setSubCat(null) }
  }

  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: "var(--background)", paddingBottom: "96px" }}
      >
        {/* ── Sticky header filter ── */}
        <div
          className="sticky top-0 z-40"
          style={{ background: "var(--sticky-bg)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="px-4 md:px-8"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 52px)" }}
          >
            <h1
              className="font-light italic mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "var(--gold)" }}
            >
              Kategori
            </h1>

            {/* ── Main category chips ── */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {/* All */}
              <button
                onClick={() => { setMainCat(null); setSubCat(null) }}
                className="flex-none px-4 py-1.5 rounded-lg text-[11px] tracking-wider uppercase transition-all duration-200"
                style={{
                  background:   !mainCat ? "var(--cyan)"   : "transparent",
                  color:        !mainCat ? "#fff"           : "var(--text-muted)",
                  border:       `1px solid ${!mainCat ? "var(--cyan)" : "var(--border)"}`,
                  fontWeight:   !mainCat ? 600 : 400,
                }}
              >
                Semua
              </button>

              {categoryDefs.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => selectMain(cat.key)}
                  className="flex-none px-4 py-1.5 rounded-lg text-[11px] tracking-wider uppercase transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: mainCat === cat.key ? "var(--cyan)"  : "transparent",
                    color:      mainCat === cat.key ? "#fff"          : "var(--text-muted)",
                    border:     `1px solid ${mainCat === cat.key ? "var(--cyan)" : "var(--border)"}`,
                    fontWeight: mainCat === cat.key ? 600 : 400,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ── Sub-category chips ── */}
            <AnimatePresence>
              {activeDef?.subs && (
                <motion.div
                  key={mainCat}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 pb-1">
                    {/* All sub */}
                    <button
                      onClick={() => setSubCat(null)}
                      className="flex-none px-3 py-1 rounded-lg text-[10px] tracking-wider uppercase transition-all duration-200"
                      style={{
                        background: !subCat ? "var(--bg-surface-2)" : "transparent",
                        color:      !subCat ? "var(--gold)"          : "var(--text-faint)",
                        border:     `1px solid ${!subCat ? "var(--gold)" : "var(--border)"}`,
                      }}
                    >
                      Semua
                    </button>

                    {activeDef.subs.map(s => (
                      <button
                        key={s.key}
                        onClick={() => setSubCat(prev => prev === s.key ? null : s.key)}
                        className="flex-none px-3 py-1 rounded-lg text-[10px] tracking-wider uppercase transition-all duration-200 whitespace-nowrap"
                        style={{
                          background: subCat === s.key ? "var(--bg-surface-2)" : "transparent",
                          color:      subCat === s.key ? "var(--gold)"          : "var(--text-faint)",
                          border:     `1px solid ${subCat === s.key ? "var(--gold)" : "var(--border)"}`,
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Jumlah foto ── */}
            <div className="py-2">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] tracking-wider"
                style={{ color: "var(--text-faint)" }}
              >
                {filtered.length} foto
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── Photo grid ── */}
        <div className="px-2 pt-3 md:px-6">
          {filtered.length > 0 ? (
            subCat && groupedByMonth ? (
              /* ── Tampilan per bulan saat subcategory dipilih ── */
              <div>
                {sortedMonthKeys.map((monthKey, mi) => {
                  const monthPhotos = groupedByMonth[monthKey]
                  return (
                    <motion.div
                      key={monthKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: mi * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-10"
                    >
                      {/* Month separator */}
                      <div className="flex items-center gap-3 mb-3 px-1">
                        <span
                          className="text-[10px] tracking-[0.4em] uppercase whitespace-nowrap"
                          style={{ color: "var(--gold)", opacity: 0.85 }}
                        >
                          {formatMonth(monthKey)}
                        </span>
                        <div
                          className="flex-1 h-px"
                          style={{ background: "linear-gradient(to right, rgba(211,179,102,0.25), transparent)" }}
                        />
                        <span className="text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
                          {monthPhotos.length} foto
                        </span>
                      </div>

                      {/* Masonry grid per bulan */}
                      <div style={{ columns: "2 160px", columnGap: "6px" }}>
                        {monthPhotos.map((photo, idx) => (
                          <div
                            key={photo.id}
                            className="break-inside-avoid mb-1.5 rounded-lg overflow-hidden cursor-pointer relative group"
                            onClick={() => openViewer(monthPhotos, idx)}
                          >
                            <Image
                              src={photo.src}
                              alt=""
                              width={photo.w}
                              height={photo.h}
                              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                              loading={mi === 0 && idx < 6 ? "eager" : "lazy"}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}

                {/* Foto tanpa tanggal */}
                {unknownGroup.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3 px-1">
                      <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--text-faint)" }}>
                        Tanpa tanggal
                      </span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                    <div style={{ columns: "2 160px", columnGap: "6px" }}>
                      {unknownGroup.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="break-inside-avoid mb-1.5 rounded-lg overflow-hidden cursor-pointer relative group"
                          onClick={() => openViewer(unknownGroup, idx)}
                        >
                          <Image
                            src={photo.src}
                            alt=""
                            width={photo.w}
                            height={photo.h}
                            className="w-full h-auto object-cover"
                            loading={idx < 6 ? "eager" : "lazy"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Masonry flat (semua / kategori utama saja) ── */
              <motion.div
                layout
                style={{ columns: "2 160px", columnGap: "6px" }}
              >
                <AnimatePresence>
                  {filtered.map((photo, idx) => (
                    <motion.div
                      key={photo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="break-inside-avoid mb-1.5 rounded-lg overflow-hidden cursor-pointer relative group"
                      onClick={() => openViewer(filtered, idx)}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        width={photo.w}
                        height={photo.h}
                        className="w-full h-auto object-cover"
                        loading={idx < 8 ? "eager" : "lazy"}
                      />
                      {/* Sub-label overlay */}
                      {photo.sub && (
                        <div
                          className="absolute bottom-0 left-0 right-0 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
                        >
                          <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {categoryDefs
                              .flatMap(c => c.subs ?? [])
                              .find(s => s.key === photo.sub)?.label}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.2" strokeLinecap="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Belum ada foto</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Photo Viewer ── */}
      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer
            photos={viewerList}
            initialIndex={viewerIdx}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
