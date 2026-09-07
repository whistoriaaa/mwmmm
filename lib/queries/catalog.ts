import "server-only"
import { asc, eq, isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories, subcategories, sessions, photos } from "@/lib/db/schema"

export async function listCategories() {
  const [cats, subs] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.label)),
    db.select().from(subcategories).orderBy(asc(subcategories.sortOrder), asc(subcategories.label)),
  ])
  return cats.map((c) => ({ ...c, subs: subs.filter((s) => s.categoryId === c.id) }))
}

export interface SessionRow {
  id: number
  slug: string
  title: string
  month: string | null
  categoryId: number
  subcategoryId: number | null
  published: boolean
  coverPhotoId: number | null
  photoCount: number
}

export async function listSessions(): Promise<SessionRow[]> {
  return db
    .select({
      id: sessions.id,
      slug: sessions.slug,
      title: sessions.title,
      month: sessions.month,
      categoryId: sessions.categoryId,
      subcategoryId: sessions.subcategoryId,
      published: sessions.published,
      coverPhotoId: sessions.coverPhotoId,
      photoCount: sql<number>`(select count(*) from ${photos} where ${photos.sessionId} = ${sessions.id})`,
    })
    .from(sessions)
    .orderBy(asc(sessions.categoryId), asc(sessions.sortOrder), asc(sessions.title))
}

export async function getSessionWithPhotos(id: number) {
  const s = await db.query.sessions.findFirst({ where: eq(sessions.id, id) })
  if (!s) return null
  const rows = await db
    .select()
    .from(photos)
    .where(eq(photos.sessionId, id))
    .orderBy(asc(photos.sortOrder), asc(photos.id))
  return { session: s, photos: rows }
}

export async function getLoosePhotos() {
  return db
    .select()
    .from(photos)
    .where(isNull(photos.sessionId))
    .orderBy(asc(photos.categoryId), asc(photos.sortOrder), asc(photos.id))
}

export async function looseCount(): Promise<number> {
  const [r] = await db
    .select({ n: sql<number>`count(*)` })
    .from(photos)
    .where(isNull(photos.sessionId))
  return r?.n ?? 0
}
