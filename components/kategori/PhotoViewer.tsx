"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import type { Photo } from "@/data/categories"

export function PhotoViewer({ photos, initialIndex, onClose }: {
  photos: Photo[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)

  // Refs agar touch handler tidak stale
  const scaleRef   = useRef(1)
  const panXRef    = useRef(0)
  const panYRef    = useRef(0)
  const indexRef   = useRef(initialIndex)
  const photosLen  = useRef(photos.length)
  const onCloseRef = useRef(onClose)

  useEffect(() => { scaleRef.current  = scale       }, [scale])
  useEffect(() => { panXRef.current   = panX        }, [panX])
  useEffect(() => { panYRef.current   = panY        }, [panY])
  useEffect(() => { indexRef.current  = index       }, [index])
  useEffect(() => { photosLen.current = photos.length }, [photos.length])
  useEffect(() => { onCloseRef.current = onClose    }, [onClose])

  const containerRef    = useRef<HTMLDivElement>(null)
  const touchStartX     = useRef(0)
  const touchStartY     = useRef(0)
  const startPanX       = useRef(0)
  const startPanY       = useRef(0)
  const lastPinchDist   = useRef(0)
  const isPinching      = useRef(false)
  const lastTapTime     = useRef(0)
  const hasMoved        = useRef(false)
  const animating       = useRef(false)

  const navigate = useCallback((dir: 1 | -1) => {
    if (animating.current) return
    animating.current = true
    const next = (indexRef.current + dir + photosLen.current) % photosLen.current
    scaleRef.current = 1; panXRef.current = 0; panYRef.current = 0
    setScale(1); setPanX(0); setPanY(0)
    setIndex(next)
    setTimeout(() => { animating.current = false }, 350)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onCloseRef.current()
      if (e.key === "ArrowRight") navigate(1)
      if (e.key === "ArrowLeft")  navigate(-1)
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [navigate])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Touch events (passive:false hanya di touchmove agar bisa preventDefault)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onStart = (e: TouchEvent) => {
      hasMoved.current = false

      if (e.touches.length === 1) {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
        startPanX.current   = panXRef.current
        startPanY.current   = panYRef.current

        // Double tap → toggle zoom
        const now = Date.now()
        if (now - lastTapTime.current < 280) {
          lastTapTime.current = 0
          if (scaleRef.current > 1) {
            scaleRef.current = 1; panXRef.current = 0; panYRef.current = 0
            setScale(1); setPanX(0); setPanY(0)
          } else {
            scaleRef.current = 2.5
            setScale(2.5)
          }
        } else {
          lastTapTime.current = now
        }
      }

      if (e.touches.length === 2) {
        isPinching.current    = true
        lastPinchDist.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }

    const onMove = (e: TouchEvent) => {
      e.preventDefault()
      hasMoved.current = true

      if (e.touches.length === 2 && isPinching.current) {
        const dist   = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const next   = Math.min(4, Math.max(1, scaleRef.current * (dist / lastPinchDist.current)))
        scaleRef.current      = next
        lastPinchDist.current = dist
        setScale(next)
      } else if (e.touches.length === 1 && !isPinching.current && scaleRef.current > 1) {
        const dx = e.touches[0].clientX - touchStartX.current
        const dy = e.touches[0].clientY - touchStartY.current
        const nx = startPanX.current + dx
        const ny = startPanY.current + dy
        panXRef.current = nx; panYRef.current = ny
        setPanX(nx); setPanY(ny)
      }
    }

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        // Swipe navigasi hanya saat scale = 1
        if (!isPinching.current && scaleRef.current <= 1 && hasMoved.current) {
          const dx = e.changedTouches[0].clientX - touchStartX.current
          const dy = e.changedTouches[0].clientY - touchStartY.current
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
            navigate(dx < 0 ? 1 : -1)
          }
        }
        isPinching.current = false
        // Snap ke 1 jika hampir kembali
        if (scaleRef.current < 1.12) {
          scaleRef.current = 1; panXRef.current = 0; panYRef.current = 0
          setScale(1); setPanX(0); setPanY(0)
        }
      } else if (e.touches.length === 1) {
        isPinching.current    = false
        touchStartX.current   = e.touches[0].clientX
        touchStartY.current   = e.touches[0].clientY
        startPanX.current     = panXRef.current
        startPanY.current     = panYRef.current
      }
    }

    el.addEventListener("touchstart", onStart,  { passive: true  })
    el.addEventListener("touchmove",  onMove,   { passive: false })
    el.addEventListener("touchend",   onEnd,    { passive: true  })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove",  onMove)
      el.removeEventListener("touchend",   onEnd)
    }
  }, [navigate])

  const photo = photos[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-100"
      style={{ background: "#000" }}
    >
      {/* ── Top bar ── */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4"
        style={{
          paddingTop:    "calc(env(safe-area-inset-top) + 14px)",
          paddingBottom: "14px",
          background:    "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)",
        }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-lg"
          style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(8px)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <span className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
          {index + 1} / {photos.length}
        </span>

        <div className="w-9" />
      </div>

      {/* ── Photo area ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{ touchAction: "none", cursor: scale > 1 ? "grab" : "default" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              transform:       `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`,
              transition:      isPinching.current ? "none" : "transform 0.28s cubic-bezier(0.16,1,0.3,1)",
              transformOrigin: "center center",
              userSelect:      "none",
              WebkitUserSelect:"none",
            }}
          >
            <Image
              src={photo.src}
              alt=""
              width={photo.w}
              height={photo.h}
              sizes="100vw"
              className="object-contain"
              style={{
                maxWidth:  "100vw",
                maxHeight: "100svh",
                width:     "auto",
                height:    "auto",
                display:   "block",
                pointerEvents: "none",
              }}
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center gap-2.5"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 22px)",
          paddingTop:    "18px",
          background:    "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}
      >
        {/* Progress bar */}
        <div className="w-28 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.18)" }}>
          <motion.div
            className="h-full rounded-full bg-white"
            animate={{ width: `${((index + 1) / photos.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.28)" }}>
          {scale > 1 ? "geser · double tap reset" : "geser · double tap zoom"}
        </p>
      </div>

      {/* ── Desktop arrows ── */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center rounded-lg"
        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center rounded-lg"
        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </motion.div>
  )
}
