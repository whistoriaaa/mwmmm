"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { categoryDefs, allCategoryPhotos, type MainCat, type SubCat, type Photo } from "@/data/categories"
import { PhotoViewer } from "@/components/kategori/PhotoViewer"
import { CategoryCard } from "@/components/kategori/CategoryCard"

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

function subLabelOf(key?: SubCat): string | null {
  return key
    ? categoryDefs.flatMap(c => c.subs ?? []).find(s => s.key === key)?.label ?? null
    : null
}

/** Ambil hingga n foto preview, disebar merata antar sub/sesi, highlight didahulukan */
function pickPreview(photos: Photo[], n = 4): Photo[] {
  const buckets = new Map<string, Photo[]>()
  for (const p of photos) {
    const k = `${p.sub ?? ""}|${p.group ?? ""}`
    if (!buckets.has(k)) buckets.set(k, [])
    buckets.get(k)!.push(p)
  }
  const lists = [...buckets.values()].map(arr =>
    [...arr].sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0))
  )
  const out: Photo[] = []
  let i = 0
  while (out.length < n && lists.some(l => l.length)) {
    const l = lists[i % lists.length]
    if (l.length) out.push(l.shift()!)
    i++
  }
  return out
}

function photoInfoLabel(photo: Photo): string | null {
  if (photo.group) return photo.group
  return subLabelOf(photo.sub)
}

function PhotoInfoBadge({ photo }: { photo: Photo }) {
  const label = photoInfoLabel(photo)
  if (!label) return null
  return (
    <div
      className="absolute bottom-1 right-1 max-w-[60%] px-1.5 py-0.5 rounded"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
    >
      <span className="block text-[7px] tracking-wider uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: "rgba(255,255,255,0.85)" }}>
        {label}
      </span>
    </div>
  )
}

type Level = "mains" | "subs" | "sessions" | "photos"

export default function KategoriPage() {
  const [mainCat,    setMainCat]    = useState<MainCat | null>(null)
  const [subCat,     setSubCat]     = useState<SubCat | null>(null)
  const [group,      setGroup]      = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIdx,  setViewerIdx]  = useState(0)
  const [viewerList, setViewerList] = useState<Photo[]>([])

  const openViewer = (list: Photo[], idx: number) => {
    setViewerList(list)
    setViewerIdx(idx)
    setViewerOpen(true)
  }

  const activeDef = categoryDefs.find(c => c.key === mainCat)

  // Foto dalam scope navigasi saat ini
  const scoped = allCategoryPhotos.filter(p => {
    if (mainCat && p.category !== mainCat) return false
    if (subCat  && p.sub      !== subCat)  return false
    if (group   && p.group    !== group)   return false
    return true
  })

  // Scope tanpa filter sesi — untuk menghitung sesi & foto lepas
  const scopedNoGroup = allCategoryPhotos.filter(p => {
    if (mainCat && p.category !== mainCat) return false
    if (subCat  && p.sub      !== subCat)  return false
    return true
  })
  const sessionNames = Array.from(
    new Set(scopedNoGroup.map(p => p.group).filter((g): g is string => !!g))
  )
  const looseInScope = scopedNoGroup.filter(p => !p.group)

  // Tentukan tingkat tampilan
  const level: Level =
    group                         ? "photos"
    : !mainCat                     ? "mains"
    : !subCat && activeDef?.subs   ? "subs"
    : sessionNames.length > 0      ? "sessions"
    : "photos"

  // ── Data kartu per tingkat ──
  const mainCards = categoryDefs
    .filter(c => allCategoryPhotos.some(p => p.category === c.key))
    .map(c => {
      const photos = allCategoryPhotos.filter(p => p.category === c.key)
      const nSub   = c.subs?.filter(s => photos.some(p => p.sub === s.key)).length ?? 0
      const nSess  = new Set(photos.map(p => p.group).filter(Boolean)).size
      const meta   = [
        nSub ? `${nSub} kategori` : nSess ? `${nSess} sesi` : null,
        `${photos.length} foto`,
      ].filter(Boolean).join(" · ")
      return { key: c.key as string, title: c.label, meta, preview: pickPreview(photos) }
    })

  const subCards = (activeDef?.subs ?? [])
    .map(s => ({ s, photos: allCategoryPhotos.filter(p => p.category === mainCat && p.sub === s.key) }))
    .filter(x => x.photos.length > 0)
    .map(({ s, photos }) => {
      const nSess = new Set(photos.map(p => p.group).filter(Boolean)).size
      const meta  = [nSess ? `${nSess} sesi` : null, `${photos.length} foto`].filter(Boolean).join(" · ")
      return { key: s.key as string, title: s.label, meta, preview: pickPreview(photos) }
    })

  const sessionCards = sessionNames.map(name => {
    const photos  = scopedNoGroup.filter(p => p.group === name)
    const dateStr = photos.find(p => p.date)?.date
    const meta    = [
      `${photos.length} foto`,
      !subCat ? subLabelOf(photos[0]?.sub) : null,
      dateStr ? formatMonth(dateStr) : null,
    ].filter(Boolean).join(" · ")
    return { key: name, title: name, meta, preview: pickPreview(photos) }
  })

  const cards =
    level === "mains"    ? mainCards :
    level === "subs"     ? subCards  :
    level === "sessions" ? sessionCards : []

  const onCardClick = (key: string) => {
    if      (level === "mains") { setMainCat(key as MainCat); setSubCat(null); setGroup(null) }
    else if (level === "subs")  { setSubCat(key as SubCat);   setGroup(null) }
    else                        { setGroup(key) }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Grid foto (leaf) — dikelompokkan per bulan ──
  const groupedByMonth = level === "photos"
    ? scoped.reduce<Record<string, Photo[]>>((acc, p) => {
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

  // ── Breadcrumb ──
  const crumbs = [
    { label: "Semua", onClick: () => { setMainCat(null); setSubCat(null); setGroup(null) }, active: !mainCat },
    ...(mainCat ? [{ label: activeDef?.label ?? "", onClick: () => { setSubCat(null); setGroup(null) }, active: !subCat && !group }] : []),
    ...(subCat  ? [{ label: subLabelOf(subCat) ?? "", onClick: () => setGroup(null), active: !group }] : []),
    ...(group   ? [{ label: group, onClick: () => {}, active: true }] : []),
  ]

  const countText =
    level === "mains"    ? `${mainCards.length} kategori`
    : level === "subs"   ? `${subCards.length} kategori · ${scopedNoGroup.length} foto`
    : level === "sessions" ? `${sessionCards.length} sesi · ${scopedNoGroup.length} foto`
    : `${scoped.length} foto`

  const renderMasonry = (list: Photo[], eager = 6) => (
    <div style={{ columns: "2 160px", columnGap: "6px" }}>
      {list.map((photo, idx) => (
        <div
          key={photo.id}
          className="break-inside-avoid mb-1.5 rounded-lg overflow-hidden cursor-pointer relative group"
          onClick={() => openViewer(list, idx)}
        >
          <Image
            src={photo.src}
            alt=""
            width={photo.w}
            height={photo.h}
            sizes="50vw"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            loading={idx < eager ? "eager" : "lazy"}
          />
          <PhotoInfoBadge photo={photo} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--background)", paddingBottom: "96px" }}>
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-40"
          style={{ background: "var(--sticky-bg)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="px-4 md:px-8" style={{ paddingTop: "calc(env(safe-area-inset-top) + 52px)" }}>
            <h1
              className="font-light italic"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 5vw, 2rem)", color: "var(--gold)" }}
            >
              Kategori
            </h1>

            {/* ── Breadcrumb ── */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {crumbs.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                  <button
                    onClick={c.onClick}
                    disabled={c.active}
                    className="text-[11px] tracking-wider uppercase transition-colors duration-200 disabled:cursor-default"
                    style={{ color: c.active ? "var(--cyan)" : "var(--text-muted)", fontWeight: c.active ? 600 : 400 }}
                  >
                    {c.label}
                  </button>
                </div>
              ))}
            </div>

            {/* ── Jumlah ── */}
            <div className="py-2">
              <motion.span
                key={countText}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] tracking-wider"
                style={{ color: "var(--text-faint)" }}
              >
                {countText}
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── Konten ── */}
        <div className="px-3 pt-4 md:px-6">
          {level !== "photos" ? (
            <div>
              <motion.div
                key={`${level}-${mainCat ?? ""}-${subCat ?? ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid gap-3 md:grid-cols-2"
              >
                {cards.map((card, i) => (
                  <CategoryCard
                    key={card.key}
                    title={card.title}
                    meta={card.meta}
                    preview={card.preview}
                    index={i}
                    onClick={() => onCardClick(card.key)}
                  />
                ))}
              </motion.div>

              {level === "sessions" && looseInScope.length > 0 && (
                <div className="mt-9">
                  <div className="flex items-center gap-3 mb-3 px-1">
                    <span className="text-[10px] tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "var(--text-faint)" }}>
                      Foto lepas
                    </span>
                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    <span className="text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
                      {looseInScope.length} foto
                    </span>
                  </div>
                  {renderMasonry(looseInScope)}
                </div>
              )}
            </div>
          ) : scoped.length > 0 ? (
            <div>
              {sortedMonthKeys.map((monthKey, mi) => {
                const monthPhotos = groupedByMonth![monthKey]
                return (
                  <motion.div
                    key={monthKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: mi * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10"
                  >
                    <div className="flex items-center gap-3 mb-3 px-1">
                      <span className="text-[10px] tracking-[0.4em] uppercase whitespace-nowrap" style={{ color: "var(--gold)", opacity: 0.85 }}>
                        {formatMonth(monthKey)}
                      </span>
                      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(211,179,102,0.25), transparent)" }} />
                      <span className="text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
                        {monthPhotos.length} foto
                      </span>
                    </div>
                    {renderMasonry(monthPhotos, mi === 0 ? 6 : 0)}
                  </motion.div>
                )
              })}

              {unknownGroup.length > 0 && (
                <div className="mb-10">
                  {sortedMonthKeys.length > 0 && (
                    <div className="flex items-center gap-3 mb-3 px-1">
                      <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--text-faint)" }}>
                        Tanpa tanggal
                      </span>
                      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    </div>
                  )}
                  {renderMasonry(unknownGroup)}
                </div>
              )}
            </div>
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
