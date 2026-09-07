import "server-only"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"

const listCols = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  excerpt: articles.excerpt,
  status: articles.status,
  coverStorageDir: articles.coverStorageDir,
  coverWidth: articles.coverWidth,
  coverHeight: articles.coverHeight,
  coverBlurDataUrl: articles.coverBlurDataUrl,
  coverVariants: articles.coverVariants,
  readingMinutes: articles.readingMinutes,
  publishedAt: articles.publishedAt,
  updatedAt: articles.updatedAt,
}

/** CMS — semua artikel, terbaru diedit dulu. */
export function listArticles() {
  return db.select(listCols).from(articles).orderBy(desc(articles.updatedAt))
}

export function getArticle(id: number) {
  return db.query.articles.findFirst({ where: eq(articles.id, id) })
}

/** Situs — artikel published, terbaru dulu. */
export function listPublishedArticles() {
  return db
    .select(listCols)
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
}

export function getPublishedArticle(slug: string) {
  return db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.status, "published")),
  })
}

export async function publishedArticleSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(eq(articles.status, "published"))
  return rows.map((r) => r.slug)
}
