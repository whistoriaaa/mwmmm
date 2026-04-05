"use client"

import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

// Sample videos dari Google CDN — ganti dengan video asli teman kamu nanti
const sampleVideos = [
  "https://assets.mixkit.co/videos/3991/3991-720.mp4",   // kota malam estetik
  "https://assets.mixkit.co/videos/4927/4927-720.mp4",   // cinematic urban
  "https://assets.mixkit.co/videos/39767/39767-720.mp4", // alam & nature
  "https://assets.mixkit.co/videos/3991/3991-720.mp4",   // golden hour
  "https://assets.mixkit.co/videos/5765/5765-720.mp4",   // slow motion air
  "https://assets.mixkit.co/videos/39767/39767-720.mp4", // cinematic langit
  "https://assets.mixkit.co/videos/680/680-720.mp4",     // ocean wave
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
  { id: 20, src: sampleVideos[2],                             w: 800, h: 450,  category: "video" },
  { id: 21, src: "https://picsum.photos/seed/wm21/620/930",  w: 620, h: 930,  category: "photo" },
  { id: 22, src: "https://picsum.photos/seed/wm22/780/520",  w: 780, h: 520,  category: "photo" },
  { id: 23, src: "https://picsum.photos/seed/wm23/520/780",  w: 520, h: 780,  category: "photo" },
  { id: 24, src: "https://picsum.photos/seed/wm24/860/560",  w: 860, h: 560,  category: "photo" },
]

const filters = ["all", "photo", "video"]

// ─── Video Card ────────────────────────────────────────────────
function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // React tidak apply `muted` ke DOM — harus set manual via ref
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
        autoPlay
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

// ─── MasonryGrid ───────────────────────────────────────────────
export default function MasonryGrid() {
  const [active, setActive] = useState("all")

  const filtered = active === "all"
    ? allPhotos
    : allPhotos.filter(p => p.category === active)

  return (
    <section className="px-6 md:px-8 py-20 md:py-28">

      {/* Header */}
      <div className="flex items-center justify-between mb-10 md:mb-14">
        <h2
          className="font-light tracking-wide"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "var(--gold)",
          }}
        >
          Works
        </h2>

        {/* Filter */}
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
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid mb-3 group relative overflow-hidden rounded-sm cursor-pointer"
              whileHover={{ y: -5 }}
            >
              {item.category === "video" ? (
                /* ── Video ── */
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoCard src={item.src} />
                </motion.div>
              ) : (
                /* ── Foto ── */
                <>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={item.src}
                      alt={`Work ${item.id}`}
                      width={item.w}
                      height={item.h}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Hover overlay foto */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, rgba(14,40,48,0.92) 0%, transparent 65%)" }}
                  >
                    <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--pink)" }}>
                      Photo
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}