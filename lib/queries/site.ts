import "server-only"
import { asc, eq, isNull, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, subcategories, sessions, photos } from "@/lib/db/schema"
import type { SiteCategory, SitePhoto } from "./site-types"

export type { SiteCategory, SitePhoto } from "./site-types"

/** Katalog untuk halaman /kategori — kategori + semua foto publik. */
export async function getSiteCatalog(): Promise<{
  categories: SiteCategory[]
  photos: SitePhoto[]
}> {
  const [cats, subs, rows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.label)),
    db.select().from(subcategories).orderBy(asc(subcategories.sortOrder), asc(subcategories.label)),
    db
      .select({
        id: photos.id,
        categoryId: photos.categoryId,
        subcategoryId: photos.subcategoryId,
        highlight: photos.highlight,
        width: photos.width,
        height: photos.height,
        blurDataUrl: photos.blurDataUrl,
        storageDir: photos.storageDir,
        variants: photos.variants,
        sortOrder: photos.sortOrder,
        sessionSlug: sessions.slug,
        sessionTitle: sessions.title,
        sessionMonth: sessions.month,
        sessionSort: sessions.sortOrder,
      })
      .from(photos)
      .leftJoin(sessions, eq(photos.sessionId, sessions.id))
      // foto lepas (tanpa sesi) atau sesi yang published
      .where(or(isNull(photos.sessionId), eq(sessions.published, true)))
      .orderBy(asc(sessions.sortOrder), asc(photos.sortOrder), asc(photos.id)),
  ])

  const catById = new Map(cats.map((c) => [c.id, c]))
  const subById = new Map(subs.map((s) => [s.id, s]))

  const siteCategories: SiteCategory[] = cats.map((c) => ({
    slug: c.slug,
    label: c.label,
    subs: subs.filter((s) => s.categoryId === c.id).map((s) => ({ slug: s.slug, label: s.label })),
  }))

  const sitePhotos: SitePhoto[] = rows.map((r) => ({
    id: r.id,
    categorySlug: catById.get(r.categoryId)?.slug ?? "",
    subSlug: r.subcategoryId ? (subById.get(r.subcategoryId)?.slug ?? null) : null,
    sessionSlug: r.sessionSlug,
    sessionTitle: r.sessionTitle,
    month: r.sessionMonth ?? null,
    highlight: r.highlight,
    width: r.width,
    height: r.height,
    blurDataUrl: r.blurDataUrl,
    storageDir: r.storageDir,
    variants: r.variants,
  }))

  return { categories: siteCategories, photos: sitePhotos }
}

/**
 * Foto "Karya Terbaru" untuk beranda — yang punya bulan, dibatasi
 * `perSession` foto/sesi, lalu `maxMonths` bulan terakhir.
 */
export async function getRecentWorks(perSession = 4, maxMonths = 6): Promise<SitePhoto[]> {
  const { photos } = await getSiteCatalog()
  const withMonth = photos.filter((p) => p.month)

  const bySession = new Map<string, SitePhoto[]>()
  for (const p of withMonth) {
    const k = p.sessionSlug ?? `_solo_${p.id}`
    if (!bySession.has(k)) bySession.set(k, [])
    bySession.get(k)!.push(p)
  }
  const capped = [...bySession.values()].flatMap((list) =>
    [...list]
      .sort((a, b) => (b.highlight ? 1 : 0) - (a.highlight ? 1 : 0))
      .slice(0, perSession),
  )

  const months = [...new Set(capped.map((p) => p.month!))].sort().reverse().slice(0, maxMonths)
  return capped
    .filter((p) => months.includes(p.month!))
    .sort((a, b) => (b.month! < a.month! ? -1 : 1))
}
