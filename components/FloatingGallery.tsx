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
  z: number
}

const photoSets: Photo[][] = [
  [
    { id: "a1", src: "/photo/photo (7).jpg",  w: 400, h: 560, left: "20%", top: "8%",  size: "clamp(130px, 16vw, 290px)", depth: 0.2, z: 1 },
    { id: "a2", src: "/photo/photo (8).jpg",  w: 500, h: 320, left: "4%",  top: "22%", size: "clamp(160px, 22vw, 400px)", depth: 1.9, z: 2 },
    { id: "a3", src: "/photo/photo (9).jpg",  w: 500, h: 600, left: "62%", top: "10%", size: "clamp(130px, 17vw, 300px)", depth: 1.4, z: 2 },
    { id: "a4", src: "/photo/photo (10).jpg", w: 460, h: 300, left: "76%", top: "16%", size: "clamp(160px, 22vw, 400px)", depth: 1.0, z: 2 },
    { id: "a5", src: "/photo/photo (12).jpg", w: 480, h: 300, left: "38%", top: "65%", size: "clamp(140px, 19vw, 340px)", depth: 1.1, z: 2 },
  ],
  [
    { id: "b1", src: "/photo/photo (1).jpg",  w: 420, h: 580, left: "20%", top: "8%",  size: "clamp(130px, 16vw, 290px)", depth: 0.2, z: 1 },
    { id: "b2", src: "/photo/photo (2).jpg",  w: 520, h: 340, left: "4%",  top: "22%", size: "clamp(160px, 22vw, 400px)", depth: 1.9, z: 2 },
    { id: "b3", src: "/photo/photo (3).jpg",  w: 360, h: 520, left: "62%", top: "10%", size: "clamp(130px, 17vw, 300px)", depth: 1.4, z: 2 },
    { id: "b4", src: "/photo/photo (6).jpg",  w: 470, h: 300, left: "76%", top: "16%", size: "clamp(160px, 22vw, 400px)", depth: 1.0, z: 2 },
    { id: "b5", src: "/photo/photo (4).jpg",  w: 500, h: 320, left: "38%", top: "65%", size: "clamp(140px, 19vw, 340px)", depth: 1.1, z: 2 },
  ],
  [
    { id: "c1", src: "/photo/photo (13).jpg", w: 400, h: 560, left: "20%", top: "8%",  size: "clamp(130px, 16vw, 290px)", depth: 0.2, z: 1 },
    { id: "c2", src: "/photo/photo (14).jpg", w: 540, h: 350, left: "4%",  top: "22%", size: "clamp(160px, 22vw, 400px)", depth: 1.9, z: 2 },
    { id: "c3", src: "/photo/photo (15).jpg", w: 350, h: 510, left: "62%", top: "10%", size: "clamp(130px, 17vw, 300px)", depth: 1.4, z: 2 },
    { id: "c4", src: "/photo/photo (16).jpg", w: 450, h: 290, left: "76%", top: "16%", size: "clamp(160px, 22vw, 400px)", depth: 1.0, z: 2 },
  ],
]

const floatParams = [
  { y: 28, rot: 4.0, dur: 2.8, delay: 0.0 },
  { y: 20, rot: 5.0, dur: 2.4, delay: 0.5 },
  { y: 32, rot: 3.5, dur: 3.2, delay: 0.2 },
  { y: 24, rot: 5.5, dur: 2.6, delay: 0.8 },
  { y: 36, rot: 4.0, dur: 3.4, delay: 0.3 },
]

// ─── Lightbox ──────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8,18,22,0.95)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`fg-${photo.id}`}
        className="relative overflow-hidden rounded-sm"
        style={{ maxWidth: "min(88vw, 920px)", maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={photo.src} alt={`Portfolio ${photo.id}`}
          width={photo.w} height={photo.h}
          className="w-full h-auto"
          style={{ maxHeight: "88vh", objectFit: "contain" }}
          priority
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }} transition={{ delay: 0.12 }}
        onClick={onClose} aria-label="Tutup"
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border"
        style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
        whileHover={{ backgroundColor: "rgba(207,83,155,0.12)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ delay: 0.22 }}
        className="absolute bottom-5 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Klik di luar untuk tutup · ESC
      </motion.p>
    </motion.div>
  )
}

// ─── PhotoCard ─────────────────────────────────────────────────
function PhotoCard({
  photo, index, parallaxRefCb, floatRefCb, onOpen,
  isTop, onBringFront,
}: {
  photo: Photo; index: number
  parallaxRefCb: (el: HTMLDivElement | null) => void
  floatRefCb:   (el: HTMLDivElement | null) => void
  onOpen: (photo: Photo) => void
  isTop: boolean
  onBringFront: (id: string) => void
}) {
  return (
    <div
      ref={parallaxRefCb}
      className="absolute cursor-pointer group"
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.size,
        willChange: "transform",
        zIndex: isTop ? 50 : photo.z,
      }}
      onMouseEnter={() => onBringFront(photo.id)}
      onMouseLeave={() => onBringFront("")}
      onClick={() => onOpen(photo)}
    >
      <div ref={floatRefCb} style={{ willChange: "transform" }}>
        <motion.div
          layoutId={`fg-${photo.id}`}
          className="overflow-hidden rounded-sm"
          animate={{
            scale:     isTop ? 1.03 : 1,
            boxShadow: isTop
              ? "0 24px 60px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.4)",
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={photo.src} alt={`Portfolio ${photo.id}`}
            width={photo.w} height={photo.h}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index < 3} loading={index < 3 ? "eager" : "lazy"}
            draggable={false}
          />
        </motion.div>

        <div
          className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ background: "rgba(8,18,22,0.0)" }}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>
            Lihat
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── MobileGrid ────────────────────────────────────────────────
function MobileGrid({
  onOpen, onSwipeDown,
}: {
  onOpen: (p: Photo) => void
  onSwipeDown: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [set, setSet] = useState(0)
  const [dir, setDir] = useState(1)
  const TOTAL = photoSets.length

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let sx = 0, sy = 0

    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
    }
    const onMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - sx)
      const dy = Math.abs(e.touches[0].clientY - sy)
      if (dx > dy && dx > 8) e.preventDefault()
    }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < -70) onSwipeDown()
      } else {
        if (dx < -60 && set < TOTAL - 1) { setDir(1);  setSet(s => s + 1) }
        if (dx >  60 && set > 0)         { setDir(-1); setSet(s => s - 1) }
      }
    }

    el.addEventListener("touchstart", onStart, { passive: true  })
    el.addEventListener("touchmove",  onMove,  { passive: false })
    el.addEventListener("touchend",   onEnd,   { passive: true  })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove",  onMove)
      el.removeEventListener("touchend",   onEnd)
    }
  }, [set, TOTAL, onSwipeDown])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ touchAction: "pan-y", userSelect: "none" }}
    >
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={set}
          custom={dir}
          variants={{
            enter:  (d: number) => ({ x: d * 55, opacity: 0 }),
            center: ()          => ({ x: 0,       opacity: 1 }),
            exit:   (d: number) => ({ x: d * -55, opacity: 0 }),
          }}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 grid gap-2"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows:    "1fr 1fr",
            padding:             "82px 12px 92px",
          }}
        >
          {photoSets[set].slice(0, 4).map(photo => (
            <div
              key={photo.id}
              className="relative overflow-hidden rounded-sm"
              onClick={() => onOpen(photo)}
            >
              <Image
                src={photo.src} alt="" fill
                className="object-cover" sizes="45vw"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-9 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === set ? 20 : 6, opacity: i === set ? 1 : 0.28 }}
            transition={{ duration: 0.28 }}
            className="h-1 rounded-full"
            style={{ background: i === set ? "var(--gold)" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>

      {/* Swipe-down hint */}
      <motion.div
        className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"
          style={{ opacity: 0.38 }}
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "var(--text-muted)", opacity: 0.32 }}
        >
          swipe bawah → works
        </span>
      </motion.div>
    </div>
  )
}

// ─── SetIndicator ──────────────────────────────────────────────
function SetIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.3 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="h-0.5 rounded-full"
          style={{ background: i === current ? "var(--gold)" : "rgba(255,255,255,0.4)" }}
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
  const setRefs      = useRef([set1Ref, set2Ref, set3Ref])
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatRefs    = useRef<(HTMLDivElement | null)[]>([])
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const glitchR      = useRef<HTMLHeadingElement>(null)
  const glitchB      = useRef<HTMLHeadingElement>(null)
  const isAnimating  = useRef(false)
  const floatedSets  = useRef(new Set([0]))

  const [mounted,     setMounted]     = useState(false)
  const [isMobile,    setIsMobile]    = useState(false)
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)
  const [currentSet,  setCurrentSet]  = useState(0)
  const [topPhoto,    setTopPhoto]    = useState("")
  const TOTAL_SETS = photoSets.length

  // ── Mount ─────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)")
    setIsMobile(mq.matches)
    setMounted(true)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  // ── goToSet ───────────────────────────────────────────────
  const goToSet = useCallback((next: number) => {
    if (isAnimating.current) return
    const prev = currentSet
    if (next < 0 || next >= TOTAL_SETS || next === prev) return
    isAnimating.current = true

    const direction = next > prev ? -1 : 1
    const prevEl = setRefs.current[prev].current
    const nextEl = setRefs.current[next].current
    if (!prevEl || !nextEl) { isAnimating.current = false; return }

    gsap.set(nextEl, { x: `${-direction * 110}%`, opacity: 0, force3D: true })
    gsap.timeline({ onComplete: () => { isAnimating.current = false } })
      .to(prevEl, { x: `${direction * 110}%`, opacity: 0, duration: 0.6, ease: "power2.inOut", force3D: true })
      .to(nextEl, { x: "0%", opacity: 1,       duration: 0.6, ease: "power2.inOut", force3D: true }, "<")

    setCurrentSet(next)
    setTopPhoto("")
  }, [currentSet, TOTAL_SETS])

  // ── Desktop drag + keyboard ───────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return
    const el = sectionRef.current
    if (!el) return

    let startX = 0, dragging = false
    const onDown = (e: MouseEvent) => { startX = e.clientX; dragging = true }
    const onUp   = (e: MouseEvent) => {
      if (!dragging) return
      dragging = false
      const dx = e.clientX - startX
      if (Math.abs(dx) > 60) {
        if (dx < 0) goToSet(currentSet + 1)
        else        goToSet(currentSet - 1)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToSet(currentSet + 1)
      if (e.key === "ArrowLeft")  goToSet(currentSet - 1)
    }

    el.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup",  onUp)
    window.addEventListener("keydown",  onKey)
    return () => {
      el.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup",  onUp)
      window.removeEventListener("keydown",  onKey)
    }
  }, [mounted, isMobile, currentSet, goToSet])

  // ── GSAP ──────────────────────────────────────────────────
  useGSAP(() => {
    if (!mounted || isMobile) return

    const startFloating = (el: HTMLDivElement, idx: number) => {
      const p = floatParams[idx % floatParams.length]
      gsap.to(el, { y: `+=${p.y}`, duration: p.dur, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay, force3D: true })
      gsap.to(el, { rotate: `+=${p.rot}`, duration: p.dur * 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay + 0.6, force3D: true })
    }

    parallaxRefs.current.slice(0, 5).forEach((el, i) => {
      if (!el) return
      const fEl = floatRefs.current[i]
      gsap.from(el, {
        opacity: 0, y: 40, scale: 0.92,
        duration: 1.2, delay: i * 0.1, ease: "power3.out", force3D: true,
        onComplete: () => { if (fEl) startFloating(fEl, i) },
      })
    })

    let mouseX = 0, mouseY = 0, rafId = 0
    const targets = parallaxRefs.current.map((_, i) => ({
      cx: 0, cy: 0,
      depth: photoSets[Math.floor(i / 5)]?.[i % 5]?.depth ?? 1,
    }))
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 50
      mouseY = (e.clientY / window.innerHeight - 0.5) * 35
    }
    const tick = () => {
      parallaxRefs.current.forEach((el, i) => {
        if (!el) return
        const t = targets[i]; if (!t) return
        t.cx += (mouseX * t.depth - t.cx) * 0.06
        t.cy += (mouseY * t.depth - t.cy) * 0.06
        gsap.set(el, { x: t.cx, y: t.cy, force3D: true })
      })
      rafId = requestAnimationFrame(tick)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    const doGlitch = () => {
      const main = titleRef.current
      const red  = glitchR.current
      const blue = glitchB.current
      if (!main || !red || !blue) return

      const it  = 0.5 + Math.random() * 1.2
      const s1t = Math.random() * 45
      const s1h = 8 + Math.random() * 22
      const s2t = s1t + s1h + Math.random() * 20
      const s2h = 8 + Math.random() * 20

      gsap.set(red,  { opacity: 1, clipPath: `inset(${s1t}% 0 ${Math.max(0, 100-s1t-s1h)}% 0)`, x: -(3+it*5) })
      gsap.set(blue, { opacity: 1, clipPath: `inset(${s2t}% 0 ${Math.max(0, 100-s2t-s2h)}% 0)`, x:  (3+it*5) })

      gsap.timeline({
        onComplete: () => {
          gsap.to([red, blue], { opacity: 0, x: 0, duration: 0.06 })
          gsap.delayedCall(1.5 + Math.random() * 4, doGlitch)
        },
      })
        .to(main, { x: -(2*it), skewX:  1.5*it, duration: 0.05, ease: "none" })
        .to(main, { x:  3*it,   skewX: -2*it,   duration: 0.05, ease: "none" })
        .to(main, { x: -1.5*it, skewX:  it,     duration: 0.06, ease: "none" })
        .to(main, { x: 0,       skewX: 0,        duration: 0.06, ease: "power2.out" })
    }
    gsap.delayedCall(0.8 + Math.random() * 1.5, doGlitch)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
    }
  }, { scope: sectionRef, dependencies: [mounted, isMobile] })

  // ── Floating set baru ─────────────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return
    if (floatedSets.current.has(currentSet)) return
    floatedSets.current.add(currentSet)

    const startIdx = currentSet * 5
    floatRefs.current.slice(startIdx, startIdx + 5).forEach((el, i) => {
      if (!el) return
      gsap.killTweensOf(el)
      const p = floatParams[i % floatParams.length]
      gsap.to(el, { y: `+=${p.y}`, duration: p.dur, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay, force3D: true })
      gsap.to(el, { rotate: `+=${p.rot}`, duration: p.dur * 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: p.delay + 0.6, force3D: true })
    })
  }, [mounted, isMobile, currentSet])

  // ── Render set helper ─────────────────────────────────────
  const renderSet = (
    photos: Photo[],
    ref: React.RefObject<HTMLDivElement | null>,
    startIdx: number,
    hidden: boolean
  ) => (
    <div
      ref={ref}
      className="absolute inset-0"
      style={hidden ? { transform: "translateX(110%)", opacity: 0 } : undefined}
    >
      {photos.map((photo, i) => (
        <PhotoCard
          key={photo.id} photo={photo} index={startIdx + i}
          parallaxRefCb={el => { parallaxRefs.current[startIdx + i] = el }}
          floatRefCb={el    => { floatRefs.current[startIdx + i]    = el }}
          onOpen={setActivePhoto}
          isTop={topPhoto === photo.id}
          onBringFront={setTopPhoto}
        />
      ))}
    </div>
  )

  const titleStyle: React.CSSProperties = {
    fontFamily:    "var(--font-body)",
    fontSize:      "clamp(3.2rem, 10vw, 10rem)",
    fontWeight:    300,
    fontStyle:     "italic",
    letterSpacing: "0.05em",
    lineHeight:    1,
  }

  return (
    <>
      <div
        ref={sectionRef}
        className="relative w-full overflow-hidden select-none"
        style={{ height: "100svh" }}
      >
        {mounted && <ParticleField3D />}

        {mounted && !isMobile && (
          <>
            {renderSet(photoSets[0], set1Ref, 0,  false)}
            {renderSet(photoSets[1], set2Ref, 5,  true)}
            {renderSet(photoSets[2], set3Ref, 10, true)}
          </>
        )}

        {mounted && isMobile && (
          <MobileGrid
            onOpen={setActivePhoto}
            onSwipeDown={() =>
              document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })
            }
          />
        )}

        {/* Arrow nav */}
        {mounted && !isMobile && currentSet > 0 && (
          <button
            aria-label="Set sebelumnya"
            onClick={() => goToSet(currentSet - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(34,179,208,0.12)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
        {mounted && !isMobile && currentSet < TOTAL_SETS - 1 && (
          <button
            aria-label="Set berikutnya"
            onClick={() => goToSet(currentSet + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--cyan)", color: "var(--cyan)" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(34,179,208,0.12)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}

        {mounted && !isMobile && (
          <SetIndicator total={TOTAL_SETS} current={currentSet} />
        )}

        {/* Title + glitch */}
        {mounted && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 60 }}
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
                ref={glitchR} aria-hidden="true"
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
                ref={glitchB} aria-hidden="true"
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
              className="mt-4 text-sm tracking-[0.45em] uppercase font-light text-center px-4"
              style={{ color: "var(--cyan)", opacity: 0.85 }}
            >
              Photographer &amp; Videographer
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activePhoto && (
          <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
        )}
      </AnimatePresence>
    </>
  )
}