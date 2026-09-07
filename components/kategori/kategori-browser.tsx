"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { PhotoViewer } from "@/components/kategori/PhotoViewer"
import { CategoryCard } from "@/components/kategori/CategoryCard"
import { SitePicture } from "@/components/site/site-picture"
import type { SiteCategory, SitePhoto } from "@/lib/queries/site-types"

const MONTHS: Record<string, string> = {
  "01": "Januari", "02": "Februari", "03": "Maret",
  "04": "April",   "05": "Mei",      "06": "Juni",
  "07": "Juli",    "08": "Agustus",  "09": "September",
  "10": "Oktober", "11": "November", "12": "Desember",
}
const formatMonth = (m: string) => {
  const [y, mm] = m.split("-")
  return `${MONTHS[mm] ?? mm} ${y}`
}

type Level = "mains" | "subs" | "sessions" | "photos"

/** Sebar hingga n foto preview antar sub/sesi, highlight didahulukan. */
function pickPreview(list: SitePhoto[], n = 4): SitePhoto[] {
  const buckets = new Map<string, SitePhoto[]>()
  for (const p of list) {
    const k = `${p.subSlug ?? ""}|${p.sessionSlug ?? ""}`
    if (!buckets.has(k)) buckets.set(k, [])
    buckets.get(k)!.push(p)
  }
  const lists = [...buckets.values()].map((arr) =>
    [...arr].sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0)),
  )
  const out: SitePhoto[] = []
  let i = 0
  while (out.length < n && lists.some((l) => l.length)) {
    const l = lists[i % lists.length]
    if (l.length) out.push(l.shift()!)
    i++
  }
  return out
}

export function KategoriBrowser({
  categories,
  photos,
}: {
  categories: SiteCategory[]
  photos: SitePhoto[]
}) {
  const [mainCat, setMainCat] = useState<string | null>(null)
  const [subCat, setSubCat] = useState<string | null>(null)
  const [session, setSession] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIdx, setViewerIdx] = useState(0)
  const [viewerList, setViewerList] = useState<SitePhoto[]>([])

  const openViewer = (list: SitePhoto[], idx: number) => {
    setViewerList(list)
    setViewerIdx(idx)
    setViewerOpen(true)
  }

  const activeDef = categories.find((c) => c.slug === mainCat)
  const subLabelOf = (slug?: string | null) =>
    slug ? (categories.flatMap((c) => c.subs).find((s) => s.slug === slug)?.label ?? null) : null

  const scoped = photos.filter((p) => {
    if (mainCat && p.categorySlug !== mainCat) return false
    if (subCat && p.subSlug !== subCat) return false
    if (session && p.sessionSlug !== session) return false
    return true
  })
  const scopedNoSession = photos.filter((p) => {
    if (mainCat && p.categorySlug !== mainCat) return false
    if (subCat && p.subSlug !== subCat) return false
    return true
  })

  const sessionSlugs = useMemo(
    () => [...new Set(scopedNoSession.map((p) => p.sessionSlug).filter((s): s is string => !!s))],
    [scopedNoSession],
  )
  const looseInScope = scopedNoSession.filter((p) => !p.sessionSlug)

  const level: Level =
    session ? "photos"
    : !mainCat ? "mains"
    : !subCat && (activeDef?.subs.length ?? 0) > 0 ? "subs"
    : sessionSlugs.length > 0 ? "sessions"
    : "photos"

  const mainCards = categories
    .filter((c) => photos.some((p) => p.categorySlug === c.slug))
    .map((c) => {
      const list = photos.filter((p) => p.categorySlug === c.slug)
      const nSub = c.subs.filter((s) => list.some((p) => p.subSlug === s.slug)).length
      const nSess = new Set(list.map((p) => p.sessionSlug).filter(Boolean)).size
      const meta = [
        nSub ? `${nSub} kategori` : nSess ? `${nSess} sesi` : null,
        `${list.length} foto`,
      ].filter(Boolean).join(" · ")
      return { key: c.slug, title: c.label, meta, preview: pickPreview(list) }
    })

  const subCards = (activeDef?.subs ?? [])
    .map((s) => ({ s, list: photos.filter((p) => p.categorySlug === mainCat && p.subSlug === s.slug) }))
    .filter((x) => x.list.length > 0)
    .map(({ s, list }) => {
      const nSess = new Set(list.map((p) => p.sessionSlug).filter(Boolean)).size
      const meta = [nSess ? `${nSess} sesi` : null, `${list.length} foto`].filter(Boolean).join(" · ")
      return { key: s.slug, title: s.label, meta, preview: pickPreview(list) }
    })

  const sessionCards = sessionSlugs.map((slug) => {
    const list = scopedNoSession.filter((p) => p.sessionSlug === slug)
    const title = list[0]?.sessionTitle ?? slug
    const monthStr = list.find((p) => p.month)?.month
    const meta = [
      `${list.length} foto`,
      !subCat ? subLabelOf(list[0]?.subSlug) : null,
      monthStr ? formatMonth(monthStr) : null,
    ].filter(Boolean).join(" · ")
    return { key: slug, title, meta, preview: pickPreview(list) }
  })

  const cards =
    level === "mains" ? mainCards :
    level === "subs" ? subCards :
    level === "sessions" ? sessionCards : []

  const onCardClick = (key: string) => {
    if (level === "mains") { setMainCat(key); setSubCat(null); setSession(null) }
    else if (level === "subs") { setSubCat(key); setSession(null) }
    else setSession(key)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const groupedByMonth = level === "photos"
    ? scoped.reduce<Record<string, SitePhoto[]>>((acc, p) => {
        const k = p.month ?? "unknown"
        ;(acc[k] ??= []).push(p)
        return acc
      }, {})
    : null
  const sortedMonthKeys = groupedByMonth
    ? Object.keys(groupedByMonth).filter((k) => k !== "unknown").sort().reverse()
    : []
  const unknownGroup = groupedByMonth?.["unknown"] ?? []

  const sessionTitle = session
    ? scopedNoSession.find((p) => p.sessionSlug === session)?.sessionTitle ?? session
    : ""

  const crumbs = [
    { label: "Semua", onClick: () => { setMainCat(null); setSubCat(null); setSession(null) }, active: !mainCat },
    ...(mainCat ? [{ label: activeDef?.label ?? "", onClick: () => { setSubCat(null); setSession(null) }, active: !subCat && !session }] : []),
    ...(subCat ? [{ label: subLabelOf(subCat) ?? "", onClick: () => setSession(null), active: !session }] : []),
    ...(session ? [{ label: sessionTitle, onClick: () => {}, active: true }] : []),
  ]

  const countText =
    level === "mains" ? `${mainCards.length} kategori`
    : level === "subs" ? `${subCards.length} kategori · ${scopedNoSession.length} foto`
    : level === "sessions" ? `${sessionCards.length} sesi · ${scopedNoSession.length} foto`
    : `${scoped.length} foto`

  const infoLabel = (p: SitePhoto) => p.sessionTitle ?? subLabelOf(p.subSlug)

  const renderMasonry = (list: SitePhoto[], eager = 6) => (
    <div style={{ columns: "2 160px", columnGap: "6px" }}>
      {list.map((photo, idx) => {
        const label = infoLabel(photo)
        return (
          <div
            key={photo.id}
            className="break-inside-avoid mb-1.5 rounded-lg overflow-hidden cursor-pointer relative group"
            onClick={() => openViewer(list, idx)}
          >
            <SitePicture
              photo={photo}
              sizes="50vw"
              priority={idx < eager}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
            />
            {label && (
              <div
                className="absolute bottom-1 right-1 max-w-[60%] px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
              >
                <span className="block text-[7px] tracking-wider uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {label}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--background)", paddingBottom: "96px" }}>
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
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Belum ada foto</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {viewerOpen && (
          <PhotoViewer photos={viewerList} initialIndex={viewerIdx} onClose={() => setViewerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
