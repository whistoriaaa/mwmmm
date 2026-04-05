"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { motion, AnimatePresence } from "motion/react"

gsap.registerPlugin(ScrollTrigger)

type Photo = {
  id: string
  src: string
  w: number
  h: number
  left: string
  top: string
  size: string
  depth: number
}

const photoSets: Photo[][] = [
  [ // Set 1
    { id: "a1", src: "https://picsum.photos/seed/ws1/400/560",  w: 400, h: 560, left: "3%",  top: "15%",  size: "clamp(175px, 22vw, 358px)", depth: 1.2 },
    { id: "a2", src: "https://picsum.photos/seed/ws2/500/320",  w: 500, h: 320, left: "18%", top: "13%",  size: "clamp(200px, 26vw, 426px)", depth: 0.9 },
    { id: "a3", src: "https://picsum.photos/seed/ws3/380/500",  w: 380, h: 500, left: "60%", top: "13%",  size: "clamp(163px, 21vw, 336px)", depth: 1.4 },
    { id: "a4", src: "https://picsum.photos/seed/ws4/460/300",  w: 460, h: 300, left: "76%", top: "18%",  size: "clamp(188px, 25vw, 392px)", depth: 1.0 },
    { id: "a5", src: "https://picsum.photos/seed/ws5/300/440",  w: 300, h: 440, left: "5%",  top: "52%", size: "clamp(150px, 19vw, 302px)", depth: 1.7 },
    { id: "a6", src: "https://picsum.photos/seed/ws6/480/300",  w: 480, h: 300, left: "74%", top: "60%", size: "clamp(175px, 22vw, 358px)", depth: 1.1 },
  ],
  [ // Set 2
    { id: "b1", src: "https://picsum.photos/seed/ws8/420/580",  w: 420, h: 580, left: "4%",  top: "14%",  size: "clamp(163px, 21vw, 336px)", depth: 1.3 },
    { id: "b2", src: "https://picsum.photos/seed/ws9/520/340",  w: 520, h: 340, left: "19%", top: "12%",  size: "clamp(213px, 28vw, 448px)", depth: 0.8 },
    { id: "b3", src: "https://picsum.photos/seed/ws10/360/520", w: 360, h: 520, left: "61%", top: "12%",  size: "clamp(150px, 20vw, 314px)", depth: 1.6 },
    { id: "b4", src: "https://picsum.photos/seed/ws11/470/300", w: 470, h: 300, left: "77%", top: "17%",  size: "clamp(188px, 25vw, 381px)", depth: 1.0 },
    { id: "b5", src: "https://picsum.photos/seed/ws12/300/420", w: 300, h: 420, left: "6%",  top: "55%", size: "clamp(144px, 19vw, 291px)", depth: 1.8 },
    { id: "b6", src: "https://picsum.photos/seed/ws13/500/320", w: 500, h: 320, left: "75%", top: "62%", size: "clamp(175px, 24vw, 358px)", depth: 1.2 },
  ],
  [ // Set 3
    { id: "c1", src: "https://picsum.photos/seed/ws14/400/560", w: 400, h: 560, left: "3%",  top: "16%",  size: "clamp(175px, 22vw, 347px)", depth: 1.1 },
    { id: "c2", src: "https://picsum.photos/seed/ws15/540/350", w: 540, h: 350, left: "17%", top: "14%",  size: "clamp(219px, 29vw, 470px)", depth: 0.7 },
    { id: "c3", src: "https://picsum.photos/seed/ws16/350/510", w: 350, h: 510, left: "62%", top: "13%",  size: "clamp(156px, 21vw, 325px)", depth: 1.5 },
    { id: "c4", src: "https://picsum.photos/seed/ws17/450/290", w: 450, h: 290, left: "78%", top: "19%",  size: "clamp(181px, 24vw, 370px)", depth: 1.0 },
    { id: "c5", src: "https://picsum.photos/seed/ws18/310/430", w: 310, h: 430, left: "5%",  top: "54%", size: "clamp(144px, 19vw, 286px)", depth: 1.9 },
    { id: "c6", src: "https://picsum.photos/seed/ws19/480/310", w: 480, h: 310, left: "75%", top: "58%", size: "clamp(175px, 22vw, 353px)", depth: 1.3 },
  ],
]

// ─── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <motion.div
      key="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8,18,22,0.94)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`photo-${photo.id}`}
        className="relative overflow-hidden rounded-sm"
        style={{ maxWidth: "min(85vw, 900px)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={photo.src}
          alt={`Portfolio ${photo.id}`}
          width={photo.w}
          height={photo.h}
          className="w-full h-auto object-cover"
          style={{ maxHeight: "85vh", objectFit: "contain" }}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300"
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
        className="absolute bottom-6 text-xs tracking-[0.3em] uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        Klik di luar untuk tutup
      </motion.p>
    </motion.div>
  )
}

// ─── PhotoCard ─────────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  index,
  refCallback,
  onOpen,
}: {
  photo: Photo
  index: number
  refCallback: (el: HTMLDivElement | null) => void
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
      ref={refCallback}
      className="absolute overflow-hidden rounded-sm shadow-2xl cursor-pointer group"
      style={{ left: photo.left, top: photo.top, width: photo.size }}
      onClick={handleClick}
    >
      <motion.div
        layoutId={`photo-${photo.id}`}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={photo.src}
          alt={`Portfolio ${photo.id}`}
          width={photo.w}
          height={photo.h}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
        />
      </motion.div>

      {/* Desktop hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center" style={{ background: "rgba(8,18,22,0.5)" }}>
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--gold)" }}>Lihat</span>
      </div>

      {/* Mobile tap preview */}
      <AnimatePresence>
        {mobilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:hidden"
            style={{ background: "rgba(8,18,22,0.65)", backdropFilter: "blur(2px)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--cyan)" }}>Tap lagi</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── FloatingGallery ───────────────────────────────────────────────────────
export default function FloatingGallery() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const set1Ref    = useRef<HTMLDivElement>(null)
  const set2Ref    = useRef<HTMLDivElement>(null)
  const set3Ref    = useRef<HTMLDivElement>(null)
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([])
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null)

  useGSAP(() => {
    itemsRef.current.slice(0, 6).forEach((el, i) => {
      if (!el) return
      gsap.from(el, { opacity: 0, y: 40, scale: 0.92, duration: 1.2, delay: i * 0.1, ease: "power3.out" })
    })

    gsap.set(set2Ref.current, { x: "110%", opacity: 0 })
    gsap.set(set3Ref.current, { x: "110%", opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        pin: wrapperRef.current,
        scrub: 1.2,
        anticipatePin: 1,
      }
    })

    tl.to(set1Ref.current, { x: "-110%", opacity: 0, duration: 1, ease: "power2.inOut" })
      .to(set2Ref.current, { x: "0%",    opacity: 1, duration: 1, ease: "power2.inOut" }, "<")
      .to(set2Ref.current, { x: "-110%", opacity: 0, duration: 1, ease: "power2.inOut" }, "+=0.3")
      .to(set3Ref.current, { x: "0%",    opacity: 1, duration: 1, ease: "power2.inOut" }, "<")

    const onMouseMove = (e: MouseEvent) => {
      const xNorm = e.clientX / window.innerWidth  - 0.5
      const yNorm = e.clientY / window.innerHeight - 0.5
      itemsRef.current.forEach((el, i) => {
        if (!el) return
        const setIdx = Math.floor(i / 6)
        const depth  = photoSets[setIdx][i % 6].depth
        gsap.to(el, { x: xNorm * 50 * depth, y: yNorm * 35 * depth, duration: 1.4, ease: "power2.out", overwrite: "auto" })
      })
    }

    window.addEventListener("mousemove", onMouseMove)
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, { scope: sectionRef })

  const renderSet = (setPhotos: Photo[], ref: React.RefObject<HTMLDivElement | null>, startIdx: number) => (
    <div ref={ref} className="absolute inset-0">
      {setPhotos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={startIdx + i}
          refCallback={(el) => { itemsRef.current[startIdx + i] = el }}
          onOpen={setActivePhoto}
        />
      ))}
    </div>
  )

  return (
    <>
      <div ref={sectionRef} style={{ height: "350vh" }}>
        <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden">
          {renderSet(photoSets[0], set1Ref, 0)}
          {renderSet(photoSets[1], set2Ref, 6)}
          {renderSet(photoSets[2], set3Ref, 12)}

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <h1
              className="font-light italic tracking-wider leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 10vw, 10rem)",
                color: "var(--gold)",
                textShadow: "0 0 120px rgba(211,179,102,0.2), 0 0 40px rgba(16,49,58,0.8)"
              }}
            >
              Shobirine
            </h1>
           <p
  className="mt-4 text-sm tracking-[0.45em] uppercase font-light"
  style={{ color: "var(--cyan)", opacity: 0.85, textAlign: "center", width: "100%", maxWidth: "none" }}
>
  Photographer &amp; Videographer
</p>
            <div className="absolute bottom-8 flex flex-col items-center gap-2">
              <span className="text-xs tracking-[0.35em] uppercase" style={{ color: "var(--cyan)", opacity: 0.4 }}>Scroll</span>
              <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, var(--cyan), transparent)", opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <Lightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
        )}
      </AnimatePresence>
    </>
  )
}