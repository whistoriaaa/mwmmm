"use client"

import type { CSSProperties } from "react"
import { useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react"
import Image from "next/image"
import type { Item } from "@/types/gallery"

export function Lightbox({ item, items, onClose, onPrev, onNext }: {
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

  const cardStyle: CSSProperties = {
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
        className="absolute left-4 md:left-8 w-11 h-11 flex items-center justify-center rounded-lg border"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </motion.button>

      <motion.button initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}
        onClick={e => { e.stopPropagation(); onNext() }} aria-label="Berikutnya"
        className="absolute right-4 md:right-8 w-11 h-11 flex items-center justify-center rounded-lg border"
        style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
        whileHover={{ backgroundColor: "rgba(34,179,208,0.1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </motion.button>

      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.1 }}
        onClick={onClose} aria-label="Tutup"
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-lg border"
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
