"use client"

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

const sampleVideos = [
  "https://assets.mixkit.co/videos/3991/3991-720.mp4",
  "https://assets.mixkit.co/videos/4927/4927-720.mp4",
  "https://assets.mixkit.co/videos/39767/39767-720.mp4",
  "https://assets.mixkit.co/videos/3991/3991-720.mp4",
  "https://assets.mixkit.co/videos/5765/5765-720.mp4",
  "https://assets.mixkit.co/videos/39767/39767-720.mp4",
  "https://assets.mixkit.co/videos/680/680-720.mp4",
]

const allPhotos = [
  { id: 1,  src: "https://picsum.photos/seed/wm1/600/900",   w: 600, h: 900,  category: "photo" },
  { id: 2,  src: sampleVideos[0],                             w: 800, h: 450,  category: "video" },
  { id: 3,  src: "https://picsum.photos/seed/wm3/600/800",   w: 600, h: 800,  category: "photo" },
  { id: 4,  src: "https://picsum.photos/seed/wm4/700/500",   w: 700, h: 500,  category: "photo" },
  { id: 5,  src: sampleVideos[1],                             w: 800, h: 450,  category: "video" },
  { id: 6,  src: "https://picsum.photos/seed/wm6/800/600",   w: 800, h: 600,  category: "photo" },
  { id: 7,  src: "https://picsum.photos/seed/wm7/500/800",   w: 500, h: 800,  category: "photo" },
  { id: 8,  src: sampleVideos[2],                             w: 800, h: 450,  category: "video" },
  { id: 9,  src: "https://picsum.photos/seed/wm9/600/750",   w: 600, h: 750,  category: "photo" },
  { id: 10, src: "https://picsum.photos/seed/wm10/800/550",  w: 800, h: 550,  category: "photo" },
  { id: 11, src: sampleVideos[3],                             w: 800, h: 450,  category: "video" },
  { id: 12, src: "https://picsum.photos/seed/wm12/700/900",  w: 700, h: 900,  category: "photo" },
  { id: 13, src: "https://picsum.photos/seed/wm13/550/820",  w: 550, h: 820,  category: "photo" },
  { id: 14, src: sampleVideos[4],                             w: 800, h: 450,  category: "video" },
  { id: 15, src: "https://picsum.photos/seed/wm15/640/960",  w: 640, h: 960,  category: "photo" },
  { id: 16, src: "https://picsum.photos/seed/wm16/750/500",  w: 750, h: 500,  category: "photo" },
  { id: 17, src: sampleVideos[5],                             w: 800, h: 450,  category: "video" },
  { id: 18, src: "https://picsum.photos/seed/wm18/820/550",  w: 820, h: 550,  category: "photo" },
  { id: 19, src: "https://picsum.photos/seed/wm19/580/870",  w: 580, h: 870,  category: "photo" },
  { id: 20, src: sampleVideos[6],                             w: 800, h: 450,  category: "video" },
  { id: 21, src: "https://picsum.photos/seed/wm21/620/930",  w: 620, h: 930,  category: "photo" },
  { id: 22, src: "https://picsum.photos/seed/wm22/780/520",  w: 780, h: 520,  category: "photo" },
  { id: 23, src: "https://picsum.photos/seed/wm23/520/780",  w: 520, h: 780,  category: "photo" },
  { id: 24, src: "https://picsum.photos/seed/wm24/860/560",  w: 860, h: 560,  category: "photo" },
]

type Item = typeof allPhotos[0]

const filters = ["all", "photo", "video"]

// ─── Video Card ────────────────────────────────────────────────
function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      <div
        className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
        style={{ background: "rgba(14,40,48,0.75)", backdropFilter: "blur(6px)" }}
      >
        <svg width="8" height="9" viewBox="0 0 8 9" fill="var(--pink)">
          <path d="M0 0.5L8 4.5L0 8.5V0.5Z"/>
        </svg>
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--pink)", fontSize: "10px" }}>
          Video
        </span>
      </div>
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────
function Lightbox({
  item,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  item: Item
  items: Item[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentIdx = items.findIndex(i => i.id === item.id)
  const card2 = items[(currentIdx - 1 + items.length) % items.length]
  const card3 = items[(currentIdx - 2 + items.length) % items.length]

  // ── Swipe gesture ─────────────────────────────────────────
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18])
  const cardOpacity = useTransform(x, [-250, -100, 0, 100, 250], [0, 1, 1, 1, 0])
  const overlayLeftOpacity  = useTransform(x, [-150, -60, 0], [0.85, 0.4, 0])
  const overlayRightOpacity = useTransform(x, [0, 60, 150],   [0, 0.4, 0.85])

  const handleDragEnd = (
    _: PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const threshold = 80
    const velocityThreshold = 500
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onNext()
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onPrev()
    }
  }

  // Reset x saat item berganti
  useEffect(() => {
    x.set(0)
  }, [item, x])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft")  onPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onNext, onPrev])

  // Video autoplay saat item berganti
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.play().catch(() => {})
    }
  }, [item])

  const cardStyle: React.CSSProperties = {
    maxWidth: "min(78vw, 860px)",
    maxHeight: "80vh",
    borderRadius: "4px",
    overflow: "hidden",
    position: "absolute",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8,18,22,0.96)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      {/* ── Card Stack Container ──────────────────────────── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: "min(78vw, 860px)", height: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Card 3 — paling belakang */}
        <motion.div
          style={cardStyle}
          initial={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={{ rotate: -9, x: -55, y: 28, scale: 0.91, opacity: 1 }}
          exit={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          {card3.category === "photo" ? (
            <Image
              src={card3.src}
              alt=""
              width={card3.w}
              height={card3.h}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "80vh", filter: "brightness(0.35) saturate(0.5)" }}
            />
          ) : (
            <div style={{ aspectRatio: "16/9", width: "100%", background: "var(--bg-surface-2)", filter: "brightness(0.35)" }} />
          )}
        </motion.div>

        {/* Card 2 — tengah */}
        <motion.div
          style={cardStyle}
          initial={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={{ rotate: -4.5, x: -27, y: 14, scale: 0.955, opacity: 1 }}
          exit={{ rotate: 0, x: 0, y: 0, scale: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.02 }}
        >
          {card2.category === "photo" ? (
            <Image
              src={card2.src}
              alt=""
              width={card2.w}
              height={card2.h}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "80vh", filter: "brightness(0.55) saturate(0.6)" }}
            />
          ) : (
            <div style={{ aspectRatio: "16/9", width: "100%", background: "var(--bg-surface-2)", filter: "brightness(0.55)" }} />
          )}
        </motion.div>

        {/* Card 1 — depan + swipe */}
        <motion.div
          layoutId={`masonry-${item.id}`}
          style={{
            ...cardStyle,
            position: "relative",
            x,
            rotate,
            opacity: cardOpacity,
            cursor: "grab",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: "grabbing" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Overlay hint NEXT (swipe kiri) */}
          <motion.div
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              background: "linear-gradient(135deg, rgba(34,179,208,0.35) 0%, transparent 60%)",
              borderRadius: "4px",
              opacity: overlayLeftOpacity,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: "24px", pointerEvents: "none",
            }}
          >
            <span style={{ color: "var(--cyan)", fontSize: "13px", letterSpacing: "0.25em", fontWeight: 600 }}>
              NEXT →
            </span>
          </motion.div>

          {/* Overlay hint PREV (swipe kanan) */}
          <motion.div
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              background: "linear-gradient(225deg, rgba(207,83,155,0.35) 0%, transparent 60%)",
              borderRadius: "4px",
              opacity: overlayRightOpacity,
              display: "flex", alignItems: "center", justifyContent: "flex-start",
              paddingLeft: "24px", pointerEvents: "none",
            }}
          >
            <span style={{ color: "var(--pink)", fontSize: "13px", letterSpacing: "0.25em", fontWeight: 600 }}>
              ← PREV
            </span>
          </motion.div>

          {/* Konten foto / video */}
          {item.category === "video" ? (
            <video
              ref={videoRef}
              src={item.src}
              controls
              playsInline
              className="w-full h-auto"
              style={{ maxHeight: "80vh" }}
            />
          ) : (
            <Image
              src={item.src}
              alt={`Work ${item.id}`}
              width={item.w}
              height={item.h}
              className="w-full h-auto object-contain"
              style={{ maxHeight: "80vh", pointerEvents: "none", userSelect: "none" }}
            />
          )}
        </motion.div>
      </div>

      {/* Tombol Prev */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Sebelumnya"
        className="absolute left-4 md:left-8 w-11 h-11 flex items-center justify-center rounded-full border transition-colors duration-300"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </motion.button>

      {/* Tombol Next */}
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Berikutnya"
        className="absolute right-4 md:right-8 w-11 h-11 flex items-center justify-center rounded-full border transition-colors duration-300"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </motion.button>

      {/* Tombol Tutup */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.1 }}
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
        style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
        whileHover={{ backgroundColor: "rgba(207,83,155,0.12)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
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
  const [active,      setActive]      = useState("all")
  const [activeItem,  setActiveItem]  = useState<Item | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const filtered = active === "all"
    ? allPhotos
    : allPhotos.filter(p => p.category === active)

  const openItem = (item: Item, index: number) => {
    setActiveItem(item)
    setActiveIndex(index)
  }

  const closeItem = () => setActiveItem(null)

  const goPrev = () => {
    const i = (activeIndex - 1 + filtered.length) % filtered.length
    setActiveItem(filtered[i])
    setActiveIndex(i)
  }

  const goNext = () => {
    const i = (activeIndex + 1) % filtered.length
    setActiveItem(filtered[i])
    setActiveIndex(i)
  }

  return (
    <section className="px-6 md:px-8 py-20 md:py-28">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 md:mb-14">
        <h2
          className="font-light tracking-wide"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--gold)" }}
        >
          Works
        </h2>

        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
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
      </div>

      {/* Masonry */}
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
              onClick={() => openItem(item, index)}
            >
              {item.category === "video" ? (
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <VideoCard src={item.src} />
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <Image
                      src={item.src}
                      alt={`Work ${item.id}`}
                      width={item.w}
                      height={item.h}
                      className="w-full h-auto object-cover"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, rgba(14,40,48,0.92) 0%, transparent 65%)" }}
                  >
                    <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--pink)" }}>Photo</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <Lightbox
            item={activeItem}
            items={filtered}
            onClose={closeItem}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
