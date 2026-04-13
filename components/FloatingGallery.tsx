"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { motion, AnimatePresence } from "motion/react"
import ParticleField3D from "./ParticleField3D"

type Photo = {
  id: string; src: string; w: number; h: number
  left: string; top: string; size: string; depth: number
}

const photoSets: Photo[][] = [
  [
    { id: "a1", src: "/photo/photo (7).jpg",  w: 400, h: 560, left: "3%",  top: "13%", size: "clamp(140px, 20vw, 560px)", depth: 1.2 },
    { id: "a2", src: "/photo/photo (8).jpg",  w: 500, h: 320, left: "20%", top: "8%",  size: "clamp(100px, 26vw, 302px)", depth: 0.9 },
    { id: "a3", src: "/photo/photo (9).jpg",  w: 500, h: 600, left: "60%", top: "10%", size: "clamp(130px, 21vw, 600px)", depth: 1.4 },
    { id: "a4", src: "/photo/photo (10).jpg", w: 460, h: 300, left: "76%", top: "22%", size: "clamp(90px, 25vw, 392px)",  depth: 1.0 },
    { id: "a6", src: "/photo/photo (12).jpg", w: 480, h: 300, left: "64%", top: "66%", size: "clamp(90px, 22vw, 358px)",  depth: 1.1 },
  ],
  [
    { id: "b1", src: "/photo/photo (1).jpg",  w: 420, h: 580, left: "4%",  top: "14%", size: "clamp(90px, 21vw, 336px)",  depth: 1.3 },
    { id: "b2", src: "/photo/photo (2).jpg",  w: 520, h: 340, left: "21%", top: "10%", size: "clamp(110px, 28vw, 448px)", depth: 0.8 },
    { id: "b3", src: "/photo/photo (3).jpg",  w: 360, h: 520, left: "61%", top: "12%", size: "clamp(90px, 20vw, 314px)",  depth: 1.6 },
    { id: "b4", src: "/photo/photo (4).jpg",  w: 470, h: 300, left: "77%", top: "19%", size: "clamp(90px, 25vw, 381px)",  depth: 1.0 },
    { id: "b6", src: "/photo/photo (6).jpg",  w: 500, h: 320, left: "75%", top: "38%", size: "clamp(90px, 24vw, 358px)",  depth: 1.2 },
  ],
  [
    { id: "c1", src: "/photo/photo (13).jpg", w: 400, h: 560, left: "28%", top: "56%", size: "clamp(90px, 22vw, 347px)",  depth: 1.1 },
    { id: "c2", src: "/photo/photo (14).jpg", w: 540, h: 350, left: "3%",  top: "8%",  size: "clamp(110px, 29vw, 470px)", depth: 0.7 },
    { id: "c3", src: "/photo/photo (15).jpg", w: 350, h: 510, left: "62%", top: "8%",  size: "clamp(90px, 21vw, 325px)",  depth: 1.5 },
    { id: "c4", src: "/photo/photo (16).jpg", w: 450, h: 290, left: "78%", top: "12%", size: "clamp(90px, 24vw, 370px)",  depth: 1.0 },
    { id: "c6", src: "/photo/photo (18).jpg", w: 480, h: 310, left: "75%", top: "46%", size: "clamp(90px, 22vw, 353px)",  depth: 1.3 },
  ],
]

const floatParams = [
  { y: 30, rot: 4.5, dur: 2.8, delay: 0.0 },
  { y: 22, rot: 5.2, dur: 2.4, delay: 0.5 },
  { y: 34, rot: 3.8, dur: 3.2, delay: 0.2 },
  { y: 26, rot: 6.0, dur: 2.6, delay: 0.8 },
  { y: 38, rot: 4.2, dur: 3.5, delay: 0.3 },
]

// ─── Lightbox ──────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8,18,22,0.94)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`fg-${photo.id}`}
        className="relative overflow-hidden rounded-sm"
        style={{ maxWidth: "min(85vw, 900px)", maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={photo.src} alt={`Portfolio ${photo.id}`}
          width={photo.w} height={photo.h}
          className="w-full h-auto object-cover"
          style={{ maxHeight: "85vh", objectFit: "contain" }}
        />
      </motion.div>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }} transition={{ delay: 0.15 }}
        onClick={onClose} aria-label="Tutup"
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border"
        style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
        whileHover={{ backgroundColor: "rgba(207,83,155,0.12)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ delay: 0.25 }}
        className="absolute bottom-6 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Klik di luar untuk tutup
      </motion.p>
    </motion.div>
  )
}

// ─── PhotoCard ─────────────────────────────────────────────────
function PhotoCard({
  photo, index, parallaxRefCb, floatRefCb, onOpen,
}: {
  photo: Photo; index: number
  parallaxRefCb: (el: HTMLDivElement | null) => void
  floatRefCb:   (el: HTMLDivElement | null) => void
  onOpen: (photo: Photo) => void
}) {
  const [mobilePreview, setMobilePreview] = useState(false)

  const handleClick = useCallback(() => {
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches
    if (isMobile) {
      if (!mobilePreview) {
        setMobilePreview(true)
        setTimeout(() => setMobilePreview(false), 3000)
      } else {
        setMobilePreview(false)
        onOpen(photo)
      }
    } else {
      onOpen(photo)
    }
  }, [mobilePreview, onOpen, photo])

  return (
    <div
      ref={parallaxRefCb}
      className="absolute cursor-pointer group"
      style={{ left: photo.left, top: photo.top, width: photo.size, willChange: "transform" }}
      onClick={handleClick}
    >
      <div ref={floatRefCb} style={{ willChange: "transform" }}>
        <motion.div
          layoutId={`fg-${photo.id}`}
          className="overflow-hidden rounded-sm shadow-2xl"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={photo.src} alt={`Portfolio ${photo.id}`}
            width={photo.w} height={photo.h}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index < 3} loading={index < 3 ? "eager" : "lazy"}
          />
        </motion.div>

        <div
          className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
          style={{ background: "rgba(8,18,22,0.5)" }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>Lihat</span>
        </div>

        <AnimatePresence>
          {mobilePreview && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-sm flex flex-col items-center justify-center gap-2 md:hidden"
              style={{ background: "rgba(8,18,22,0.65)", backdropFilter: "blur(2px)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              <span className="text-xs tracking-widest uppercase" style={{ color: "var(--cyan)" }}>Tap lagi</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── SetIndicator ──────────────────────────────────────────────
function SetIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.35 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-0.5 rounded-full"
          style={{ background: i === current ? "var(--gold)" : "var(--text-muted)" }}
        />
      ))}
    </div>
  )
}

// ─── FloatingGallery ───────────────────────────────────────────
export default function FloatingGallery() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const set1Ref      = useRef<HTMLDivElement>(null)
  const set2Ref      = useRef<HTMLDivElement>(null)
  const set3Ref      = useRef<HTMLDivElement>(null)
  const setRefs      = [set1Ref, set2Ref, set3Ref]

  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatRefs    = useRef<(HTMLDivElement | null)[]>([])

  const titleRef = useRef<HTMLHeadingElement>(null)
  const glitchR  = useRef<HTMLHeadingElement>(null)
  const glitchB  = useRef<HTMLHeadingElement>(null)

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)
  const [currentSet, setCurrentSet]   = useState(0)
  const isAnimating = useRef(false)

  const TOTAL_SETS = photoSets.length

  // ── Navigate antar set ──────────────────────────────────────
  const goToSet = useCallback((next: number) => {
    if (isAnimating.current) return
    const prev = currentSet
    if (next < 0 || next >= TOTAL_SETS || next === prev) return
    isAnimating.current = true

    const direction = next > prev ? -1 : 1
    const prevEl = setRefs[prev].current
    const nextEl = setRefs[next].current
    if (!prevEl || !nextEl) { isAnimating.current = false; return }

    gsap.set(nextEl, { x: `${-direction * 110}%`, opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false }
    })
    tl
      .to(prevEl, { x: `${direction * 110}%`, opacity: 0, duration: 0.65, ease: "power2.inOut" })
      .to(nextEl, { x: "0%", opacity: 1,         duration: 0.65, ease: "power2.inOut" }, "<")

    setCurrentSet(next)
  }, [currentSet, TOTAL_SETS, setRefs])

  // ── Swipe touch / mouse ─────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) goToSet(currentSet + 1)
        else        goToSet(currentSet - 1)
      }
    }

    // Mouse drag
    let mouseStartX = 0
    let dragging = false
    const onMouseDown = (e: MouseEvent) => { mouseStartX = e.clientX; dragging = true }
    const onMouseUp   = (e: MouseEvent) => {
      if (!dragging) return
      dragging = false
      const dx = e.clientX - mouseStartX
      if (Math.abs(dx) > 60) {
        if (dx < 0) goToSet(currentSet + 1)
        else        goToSet(currentSet - 1)
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchend",   onTouchEnd,   { passive: true })
    el.addEventListener("mousedown",  onMouseDown)
    window.addEventListener("mouseup", onMouseUp)

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchend",   onTouchEnd)
      el.removeEventListener("mousedown",  onMouseDown)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [currentSet, goToSet])

  // ── Keyboard ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToSet(currentSet + 1)
      if (e.key === "ArrowLeft")  goToSet(currentSet - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [currentSet, goToSet])

  useGSAP(() => {
    // ── Init posisi set 2 & 3 ─────────────────────────────────
    gsap.set(set2Ref.current, { x: "110%", opacity: 0 })
    gsap.set(set3Ref.current, { x: "110%", opacity: 0 })

    // ── Floating helper ───────────────────────────────────────
    const startFloating = (el: HTMLDivElement, idx: number) => {
      const p = floatParams[idx % floatParams.length]
      gsap.to(el, { y: `+=${p.y}`, duration: p.dur, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay, force3D: true })
      gsap.to(el, { rotate: `+=${p.rot}`, duration: p.dur * 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay + 0.6, force3D: true })
    }

    // ── Entrance Set 1 ────────────────────────────────────────
    parallaxRefs.current.slice(0, 5).forEach((el, i) => {
      if (!el) return
      const floatEl = floatRefs.current[i]
      gsap.from(el, {
        opacity: 0, y: 40, scale: 0.92,
        duration: 1.2, delay: i * 0.1, ease: "power3.out", force3D: true,
        onComplete: () => { if (floatEl) startFloating(floatEl, i) },
      })
    })

    // ── Set 2 & 3 floating (mulai setelah pernah aktif) ──────
    // Di-trigger manual saat goToSet dipanggil (lihat useEffect di bawah)

    // ── Mouse parallax ────────────────────────────────────────
    let mouseX = 0, mouseY = 0, rafId = 0

    const targets = parallaxRefs.current.map((_, i) => {
      const setIdx = Math.floor(i / 5)
      const depth  = photoSets[setIdx]?.[i % 5]?.depth ?? 1
      return { cx: 0, cy: 0, depth }
    })

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 50
      mouseY = (e.clientY / window.innerHeight - 0.5) * 35
    }

    const tick = () => {
      parallaxRefs.current.forEach((el, i) => {
        if (!el) return
        const t = targets[i]
        if (!t) return
        t.cx += (mouseX * t.depth - t.cx) * 0.06
        t.cy += (mouseY * t.depth - t.cy) * 0.06
        gsap.set(el, { x: t.cx, y: t.cy, force3D: true })
      })
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    // ── Glitch loop ───────────────────────────────────────────
    const doGlitch = () => {
      const main = titleRef.current
      const red  = glitchR.current
      const blue = glitchB.current
      if (!main || !red || !blue) return

      const intensity = 0.5 + Math.random() * 1.2
      const doDouble  = Math.random() > 0.6
      const s1t = Math.random() * 45
      const s1h = 8 + Math.random() * 22
      const s2t = s1t + s1h + Math.random() * 20
      const s2h = 8 + Math.random() * 20

      gsap.set(red,  { opacity: 1, clipPath: `inset(${s1t}% 0 ${Math.max(0, 100 - s1t - s1h)}% 0)`, x: -(3 + intensity * 5) })
      gsap.set(blue, { opacity: 1, clipPath: `inset(${s2t}% 0 ${Math.max(0, 100 - s2t - s2h)}% 0)`, x:  (3 + intensity * 5) })

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to([red, blue], { opacity: 0, x: 0, duration: 0.06 })
          gsap.delayedCall(1.5 + Math.random() * 4, doGlitch)
        },
      })
      tl
        .to(main, { x: -(2 * intensity), skewX:  1.5 * intensity, duration: 0.05, ease: "none" })
        .to(main, { x:  3 * intensity,   skewX: -2   * intensity, duration: 0.05, ease: "none" })
        .to(main, { x: -1.5 * intensity, skewX:  1   * intensity, duration: 0.06, ease: "none" })
        .to(main, { x:  2 * intensity,   skewX: -1   * intensity, duration: 0.04, ease: "none" })
        .to(main, { x: 0,                skewX: 0,                duration: 0.06, ease: "power2.out" })

      if (doDouble) {
        tl.addLabel("g2", "+=0.06")
          .to(main, { x: -3 * intensity, skewX: 2 * intensity, duration: 0.04, ease: "none" }, "g2")
          .to(main, { x: 0,              skewX: 0,             duration: 0.05, ease: "power2.out" }, "g2+=0.04")
      }
    }

    gsap.delayedCall(0.8 + Math.random() * 1.5, doGlitch)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, { scope: sectionRef })

  // ── Floating untuk set yang baru pertama kali tampil ────────
  const floatedSets = useRef(new Set([0]))
  useEffect(() => {
    if (floatedSets.current.has(currentSet)) return
    floatedSets.current.add(currentSet)

    const startIdx = currentSet * 5
    floatRefs.current.slice(startIdx, startIdx + 5).forEach((el, i) => {
      if (!el) return
      const p = floatParams[i % floatParams.length]
      gsap.to(el, { y: `+=${p.y}`, duration: p.dur, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay, force3D: true })
      gsap.to(el, { rotate: `+=${p.rot}`, duration: p.dur * 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay + 0.6, force3D: true })
    })
  }, [currentSet])

  // ── Render helper ─────────────────────────────────────────────
  const renderSet = (
    setPhotos: Photo[],
    containerRef: React.RefObject<HTMLDivElement | null>,
    startIdx: number
  ) => (
    <div ref={containerRef} className="absolute inset-0">
      {setPhotos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={startIdx + i}
          parallaxRefCb={el => { parallaxRefs.current[startIdx + i] = el }}
          floatRefCb={el    => { floatRefs.current[startIdx + i]    = el }}
          onOpen={setActivePhoto}
        />
      ))}
    </div>
  )

  const titleStyle: React.CSSProperties = {
    fontFamily:    "var(--font-display)",
    fontSize:      "clamp(4rem, 10vw, 10rem)",
    fontWeight:    300,
    fontStyle:     "italic",
    letterSpacing: "0.05em",
    lineHeight:    1,
  }

  return (
    <>
      {/* ── Tinggi hanya 100svh, TIDAK di-pin, scroll bebas ── */}
      <div
        ref={sectionRef}
        className="relative w-full overflow-hidden select-none"
        style={{ height: "100svh" }}
      >
        <ParticleField3D />

        {/* Photo sets */}
        {renderSet(photoSets[0], set1Ref, 0)}
        {renderSet(photoSets[1], set2Ref, 5)}
        {renderSet(photoSets[2], set3Ref, 10)}

        {/* ── Arrow nav ──────────────────────────────────────── */}
        {currentSet > 0 && (
          <button
            aria-label="Set sebelumnya"
            onClick={() => goToSet(currentSet - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--cyan)", color: "var(--cyan)", pointerEvents: "auto" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(34,179,208,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {currentSet < TOTAL_SETS - 1 && (
          <button
            aria-label="Set berikutnya"
            onClick={() => goToSet(currentSet + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--cyan)", color: "var(--cyan)", pointerEvents: "auto" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(34,179,208,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* ── Dot indicator ──────────────────────────────────── */}
        <SetIndicator total={TOTAL_SETS} current={currentSet} />

        {/* ── Center title + glitch ──────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <h1
              ref={titleRef}
              style={{
                ...titleStyle,
                color:        "var(--gold)",
                mixBlendMode: "exclusion",
                position:     "relative",
                zIndex:       1,
                willChange:   "transform",
              }}
            >
              Shobiryne
            </h1>
            <h1
              ref={glitchR}
              aria-hidden="true"
              style={{
                ...titleStyle, color: "#ff2060",
                position: "absolute", top: 0, left: 0,
                opacity: 0, mixBlendMode: "screen",
                clipPath: "inset(0% 0 100% 0)",
                pointerEvents: "none", userSelect: "none",
                willChange: "transform, opacity, clip-path",
              }}
            >
              Shobiryne
            </h1>
            <h1
              ref={glitchB}
              aria-hidden="true"
              style={{
                ...titleStyle, color: "#00e5ff",
                position: "absolute", top: 0, left: 0,
                opacity: 0, mixBlendMode: "screen",
                clipPath: "inset(0% 0 100% 0)",
                pointerEvents: "none", userSelect: "none",
                willChange: "transform, opacity, clip-path",
              }}
            >
              Shobiryne
            </h1>
          </div>

          <p
            className="mt-4 text-sm tracking-[0.45em] uppercase font-light"
            style={{ color: "var(--cyan)", opacity: 0.85 }}
          >
            Photographer &amp; Videographer
          </p>
        </div>

        {/* ── Scroll hint ────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 15 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--cyan)" }}>
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ color: "var(--cyan)" }}>
            <rect x="5.5" y="1.5" width="5" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="8" y1="5" x2="8" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M4 16l4 5 4-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
        )}
      </AnimatePresence>
    </>
  )
}