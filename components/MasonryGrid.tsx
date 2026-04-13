"use client"

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

// ─── Types ─────────────────────────────────────────────────────
type PotraitSub = "wedding" | "graduation" | "personal" | "couple"
type ProductSub = "commercial" | "culinary" | "fashion" | "lifestyle"

type Item = {
  id: number; src: string; w: number; h: number
  category:    "potrait" | "event" | "product"
  subCategory?: PotraitSub | ProductSub
  type:        "photo" | "video"
  highlight:   boolean
}

const filters = ["all", "potrait", "event", "product"] as const
type Filter = typeof filters[number]

const potraitSubs: { key: PotraitSub; label: string }[] = [
  { key: "wedding",    label: "Wedding"           },
  { key: "graduation", label: "Graduation"         },
  { key: "personal",   label: "Personal Photoshot" },
  { key: "couple",     label: "Couple Session"     },
]

const productSubs: { key: ProductSub; label: string }[] = [
  { key: "commercial", label: "Commercial" },
  { key: "culinary",   label: "Culinary"   },
  { key: "fashion",    label: "Fashion"    },
  { key: "lifestyle",  label: "Lifestyle"  },
]

// ─── Dataset ───────────────────────────────────────────────────
const allPhotos: Item[] = [
  // Potrait — Wedding
  { id: 1,  src: "/photo/photo (1).jpg",  w: 600, h: 900, category: "potrait", subCategory: "wedding",    type: "photo", highlight: true  },
  { id: 2,  src: "/photo/photo (2).jpg",  w: 800, h: 450, category: "potrait", subCategory: "wedding",    type: "photo", highlight: false },
  // Potrait — Graduation
  { id: 3,  src: "/photo/photo (3).jpg",  w: 600, h: 800, category: "potrait", subCategory: "graduation", type: "photo", highlight: true  },
  { id: 4,  src: "/photo/photo (4).jpg",  w: 700, h: 500, category: "potrait", subCategory: "graduation", type: "photo", highlight: false },
  // Potrait — Personal
  { id: 9,  src: "/photo/photo (9).jpg",  w: 600, h: 750, category: "potrait", subCategory: "personal",   type: "photo", highlight: true  },
  { id: 10, src: "/photo/photo (10).jpg", w: 800, h: 550, category: "potrait", subCategory: "personal",   type: "photo", highlight: false },
  // Potrait — Couple
  { id: 11, src: "/photo/photo (11).jpg", w: 800, h: 450, category: "potrait", subCategory: "couple",     type: "photo", highlight: false },
  { id: 12, src: "/photo/photo (12).jpg", w: 700, h: 900, category: "potrait", subCategory: "couple",     type: "photo", highlight: true  },
  // Event
  { id: 5,  src: "/photo/photo (5).jpg",  w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  { id: 6,  src: "/photo/photo (6).jpg",  w: 800, h: 600, category: "event",   type: "photo", highlight: true  },
  { id: 7,  src: "/photo/photo (7).jpg",  w: 500, h: 800, category: "event",   type: "photo", highlight: false },
  { id: 8,  src: "/photo/photo (8).jpg",  w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  { id: 13, src: "/photo/photo (13).jpg", w: 550, h: 820, category: "event",   type: "photo", highlight: false },
  { id: 14, src: "/photo/photo (14).jpg", w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  { id: 15, src: "/photo/photo (15).jpg", w: 640, h: 960, category: "event",   type: "photo", highlight: false },
  { id: 16, src: "/photo/photo (16).jpg", w: 750, h: 500, category: "event",   type: "photo", highlight: false },
  { id: 17, src: "/photo/photo (17).jpg", w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  // Product — Commercial
  { id: 18, src: "/photo/photo (18).jpg", w: 820, h: 550, category: "product", subCategory: "commercial", type: "photo", highlight: true  },
  { id: 19, src: "/photo/photo (19).jpg", w: 580, h: 870, category: "product", subCategory: "commercial", type: "photo", highlight: false },
  // Product — Culinary
  { id: 20, src: "/photo/photo (20).jpg", w: 800, h: 450, category: "product", subCategory: "culinary",   type: "photo", highlight: false },
  { id: 21, src: "/photo/photo (1).jpg",  w: 620, h: 930, category: "product", subCategory: "culinary",   type: "photo", highlight: false },
  // Product — Fashion
  { id: 22, src: "/photo/photo (2).jpg",  w: 780, h: 520, category: "product", subCategory: "fashion",    type: "photo", highlight: false },
  { id: 23, src: "/photo/photo (3).jpg",  w: 520, h: 780, category: "product", subCategory: "fashion",    type: "photo", highlight: false },
  // Product — Lifestyle
  { id: 24, src: "/photo/photo (4).jpg",  w: 860, h: 560, category: "product", subCategory: "lifestyle",  type: "photo", highlight: false },
]

// ─── VideoCard ─────────────────────────────────────────────────
function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}) }
  }, [])
  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <video ref={videoRef} src={src} loop playsInline className="w-full h-full object-cover" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
        style={{ background: "rgba(14,40,48,0.75)", backdropFilter: "blur(6px)" }}>
        <svg width="8" height="9" viewBox="0 0 8 9" fill="var(--pink)"><path d="M0 0.5L8 4.5L0 8.5V0.5Z"/></svg>
        <span className="tracking-widest uppercase" style={{ color: "var(--pink)", fontSize: "10px" }}>Video</span>
      </div>
    </div>
  )
}

// ─── SubFilter ─────────────────────────────────────────────────
function SubFilter<T extends string>({
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
        {/* All pill */}
        <button
          onClick={() => onSelect(null)}
          className="px-3 py-1 rounded-full text-xs tracking-wider uppercase transition-all duration-250"
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
            className="px-3 py-1 rounded-full text-xs tracking-wider uppercase transition-all duration-250"
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

// ─── Lightbox ──────────────────────────────────────────────────
function Lightbox({ item, items, onClose, onPrev, onNext }: {
  item: Item; items: Item[]
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const currentIdx = items.findIndex(i => i.id === item.id)
  const card2      = items[(currentIdx - 1 + items.length) % items.length]
  const card3      = items[(currentIdx - 2 + items.length) % items.length]

  const x                   = useMotionValue(0)
  const rotate              = useTransform(x, [-300, 0, 300], [-18, 0, 18])
  const cardOpacity         = useTransform(x, [-250, -100, 0, 100, 250], [0, 1, 1, 1, 0])
  const overlayLeftOpacity  = useTransform(x, [-150, -60, 0], [0.85, 0.4, 0])
  const overlayRightOpacity = useTransform(x, [0, 60, 150], [0, 0.4, 0.85])

  const handleDragEnd = (_: PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -80 || info.velocity.x < -500) onNext()
    else if (info.offset.x > 80 || info.velocity.x > 500) onPrev()
  }

  useEffect(() => { x.set(0) }, [item, x])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft")  onPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onNext, onPrev])
  useEffect(() => {
    if (videoRef.current) { videoRef.current.muted = false; videoRef.current.play().catch(() => {}) }
  }, [item])

  const cardStyle: React.CSSProperties = {
    maxWidth: "min(78vw, 860px)", maxHeight: "80vh",
    borderRadius: "4px", overflow: "hidden", position: "absolute",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8,18,22,0.96)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <div className="relative flex items-center justify-center"
        style={{ width: "min(78vw, 860px)", height: "80vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Card 3 */}
        <motion.div style={cardStyle}
          initial={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={{ rotate: -9, x: -55, y: 28, scale: 0.91, opacity: 1 }}
          exit={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          {card3.type === "photo"
            ? <Image src={card3.src} alt="" width={card3.w} height={card3.h} className="w-full h-auto object-cover" style={{ maxHeight: "80vh", filter: "brightness(0.35) saturate(0.5)" }} />
            : <div style={{ aspectRatio: "16/9", width: "100%", background: "#0e1a1e", filter: "brightness(0.35)" }} />
          }
        </motion.div>

        {/* Card 2 */}
        <motion.div style={cardStyle}
          initial={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={{ rotate: -4.5, x: -27, y: 14, scale: 0.955, opacity: 1 }}
          exit={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.02 }}
        >
          {card2.type === "photo"
            ? <Image src={card2.src} alt="" width={card2.w} height={card2.h} className="w-full h-auto object-cover" style={{ maxHeight: "80vh", filter: "brightness(0.55) saturate(0.6)" }} />
            : <div style={{ aspectRatio: "16/9", width: "100%", background: "#0e1a1e", filter: "brightness(0.55)" }} />
          }
        </motion.div>

        {/* Card 1 — depan */}
        <motion.div
          layoutId={`masonry-${item.id}`}
          style={{ ...cardStyle, position: "relative", x, rotate, opacity: cardOpacity, cursor: "grab" }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18}
          onDragEnd={handleDragEnd} whileTap={{ cursor: "grabbing" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "linear-gradient(135deg, rgba(34,179,208,0.35) 0%, transparent 60%)",
            borderRadius: "4px", opacity: overlayLeftOpacity,
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: "24px", pointerEvents: "none",
          }}>
            <span style={{ color: "var(--cyan)", fontSize: "13px", letterSpacing: "0.25em", fontWeight: 600 }}>NEXT →</span>
          </motion.div>
          <motion.div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "linear-gradient(225deg, rgba(207,83,155,0.35) 0%, transparent 60%)",
            borderRadius: "4px", opacity: overlayRightOpacity,
            display: "flex", alignItems: "center", justifyContent: "flex-start",
            paddingLeft: "24px", pointerEvents: "none",
          }}>
            <span style={{ color: "var(--pink)", fontSize: "13px", letterSpacing: "0.25em", fontWeight: 600 }}>← PREV</span>
          </motion.div>

          {item.type === "video"
            ? <video ref={videoRef} src={item.src} controls playsInline className="w-full h-auto" style={{ maxHeight: "80vh" }} />
            : <Image src={item.src} alt={`Work ${item.id}`} width={item.w} height={item.h}
                className="w-full h-auto object-contain"
                style={{ maxHeight: "80vh", pointerEvents: "none", userSelect: "none" }} />
          }
        </motion.div>
      </div>

      <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}
        onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Sebelumnya"
        className="absolute left-4 md:left-8 w-11 h-11 flex items-center justify-center rounded-full border"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </motion.button>

      <motion.button initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}
        onClick={e => { e.stopPropagation(); onNext() }} aria-label="Berikutnya"
        className="absolute right-4 md:right-8 w-11 h-11 flex items-center justify-center rounded-full border"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </motion.button>

      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }}
        onClick={onClose} aria-label="Tutup"
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border"
        style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
        whileHover={{ backgroundColor: "rgba(207,83,155,0.12)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3 }}
        className="absolute bottom-5 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        ← swipe / → navigasi &nbsp;·&nbsp; ESC tutup
      </motion.p>
    </motion.div>
  )
}

// ─── MasonryGrid ───────────────────────────────────────────────
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

  // Sub label yang aktif untuk breadcrumb
  const activeSubs = active === "potrait" ? potraitSubs : active === "product" ? productSubs : []
  const activeSubLabel = activeSubs.find(s => s.key === activeSub)?.label

  return (
    <section id="works" className="px-6 md:px-8 py-20 md:py-28">

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

          {/* Breadcrumb aktif */}
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
                  className="w-4 h-4 flex items-center justify-center rounded-full transition-opacity duration-200 opacity-50 hover:opacity-100"
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
                    className="absolute inset-0 rounded-full border"
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
              className="break-inside-avoid mb-3 group relative overflow-hidden rounded-sm cursor-pointer"
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