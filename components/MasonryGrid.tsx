"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { type Filter, type Item, type PotraitSub, type ProductSub, filters } from "@/types/gallery"
import { allPhotos, potraitSubs, productSubs } from "@/data/portfolio"
import { VideoCard } from "@/components/gallery/VideoCard"
import { SubFilter } from "@/components/gallery/SubFilter"
import { Lightbox } from "@/components/gallery/Lightbox"

export default function MasonryGrid() {
  const [active,       setActive]       = useState<Filter>("all")
  const [activeSub,    setActiveSub]    = useState<PotraitSub | ProductSub | null>(null)
  const [activeItem,   setActiveItem]   = useState<Item | null>(null)
  const [activeIndex,  setActiveIndex]  = useState(0)
  const [lightboxList, setLightboxList] = useState<Item[]>(allPhotos)

  const sorted = (list: Item[]): Item[] => [
    ...list.filter(i => i.highlight),
    ...list.filter(i => !i.highlight),
  ]

  const filtered: Item[] = sorted((() => {
    if (active === "all") return allPhotos
    const base = allPhotos.filter(p => p.category === active)
    if ((active === "potrait" || active === "product") && activeSub) {
      return base.filter(p => p.subCategory === activeSub)
    }
    return base
  })())

  const handleFilterClick = (f: Filter) => {
    setActive(f)
    setActiveSub(null)
  }

  const openItem = (item: Item, index: number, list: Item[] = filtered) => {
    setActiveItem(item); setActiveIndex(index); setLightboxList(list)
  }
  const closeItem = () => setActiveItem(null)
  const goPrev = () => {
    const i = (activeIndex - 1 + lightboxList.length) % lightboxList.length
    setActiveItem(lightboxList[i]); setActiveIndex(i)
  }
  const goNext = () => {
    const i = (activeIndex + 1) % lightboxList.length
    setActiveItem(lightboxList[i]); setActiveIndex(i)
  }

  const activeSubs = active === "potrait" ? potraitSubs : active === "product" ? productSubs : []
  const activeSubLabel = activeSubs.find(s => s.key === activeSub)?.label

  return (
    <section id="works" className="px-6 md:px-8 py-20 md:py-28 pb-24 md:pb-28">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 md:mb-14">

        {/* Judul + breadcrumb sub-category */}
        <div className="flex flex-col gap-1.5">
          <h2
            className="font-light tracking-wide"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--gold)" }}
          >
            Works
          </h2>

          <AnimatePresence>
            {activeSubLabel && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
                  {active}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
                  {activeSubLabel}
                </span>
                <button
                  onClick={() => setActiveSub(null)}
                  aria-label="Reset"
                  className="w-4 h-4 flex items-center justify-center rounded-lg transition-opacity duration-200 opacity-50 hover:opacity-100"
                  style={{ border: "1px solid var(--text-muted)", color: "var(--text-muted)" }}
                >
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Filter section ── */}
        <div className="flex flex-col items-start sm:items-end gap-0">

          {/* Main filters */}
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => handleFilterClick(f)}
                className="relative px-4 py-1.5 text-xs tracking-widest uppercase transition-colors duration-300"
                style={{ color: active === f ? "var(--pink)" : "var(--text-muted)" }}
              >
                {f}
                {active === f && (
                  <motion.div
                    layoutId="filterBar"
                    className="absolute inset-0 rounded-lg border"
                    style={{ borderColor: "var(--pink)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sub-filters — Portrait */}
          <AnimatePresence>
            {active === "potrait" && (
              <SubFilter<PotraitSub>
                subs={potraitSubs}
                active={activeSub as PotraitSub | null}
                onSelect={setActiveSub}
              />
            )}
          </AnimatePresence>

          {/* Sub-filters — Product */}
          <AnimatePresence>
            {active === "product" && (
              <SubFilter<ProductSub>
                subs={productSubs}
                active={activeSub as ProductSub | null}
                onSelect={setActiveSub}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Masonry ─────────────────────────────────────────── */}
      <motion.div layout style={{ columns: "3 280px", columnGap: "0.75rem" }}>
        <AnimatePresence>
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              layoutId={`masonry-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid mb-3 group relative overflow-hidden rounded-lg cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => openItem(item, index, filtered)}
            >
              {item.type === "video" ? (
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <VideoCard src={item.src} />
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <Image
                      src={item.src} alt={`Work ${item.id}`}
                      width={item.w} height={item.h}
                      className="w-full h-auto object-cover"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, rgba(14,40,48,0.92) 0%, transparent 65%)" }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--pink)" }}>
                        {item.category}
                      </span>
                      {item.subCategory && (
                        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--gold)", opacity: 0.7 }}>
                          {[...potraitSubs, ...productSubs].find(s => s.key === item.subCategory)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeItem && (
          <Lightbox item={activeItem} items={lightboxList} onClose={closeItem} onPrev={goPrev} onNext={goNext} />
        )}
      </AnimatePresence>
    </section>
  )
}
