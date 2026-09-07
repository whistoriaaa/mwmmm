import { NextResponse } from "next/server"
import { and, eq, ne } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { deleteArticle } from "@/lib/storage/articles"
import { revalidateArticles } from "@/lib/revalidate"
import { slugify } from "@/lib/id"
import { renderArticleHtml, readingMinutes, docToText } from "@/lib/tiptap"
import type { JSONContent } from "@tiptap/core"

export const runtime = "nodejs"

const parseId = (v: string) => {
  const n = Number(v)
  return Number.isInteger(n) ? n : null
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny
  const id = parseId((await ctx.params).id)
  if (id == null) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  const cur = await db.query.articles.findFirst({ where: eq(articles.id, id) })
  if (!cur) return NextResponse.json({ error: "artikel tidak ditemukan" }, { status: 404 })

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const patch: Record<string, unknown> = {}

  if (typeof b.title === "string" && b.title.trim()) patch.title = b.title.trim()
  if (typeof b.slug === "string" && b.slug.trim()) {
    let slug = slugify(b.slug) || cur.slug
    if (slug !== cur.slug) {
      const clash = await db.query.articles.findFirst({
        where: and(eq(articles.slug, slug), ne(articles.id, id)),
      })
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    }
    patch.slug = slug
  }
  if (b.excerpt !== undefined)
    patch.excerpt = typeof b.excerpt === "string" && b.excerpt.trim() ? b.excerpt.trim().slice(0, 400) : null

  if (b.bodyJson && typeof b.bodyJson === "object") {
    const doc = b.bodyJson as JSONContent
    patch.bodyJson = doc
    patch.bodyHtml = renderArticleHtml(doc)
    patch.readingMinutes = readingMinutes(doc)
    // excerpt otomatis dari isi bila tak diisi manual
    const finalExcerpt = "excerpt" in patch ? (patch.excerpt as string | null) : cur.excerpt
    if (!finalExcerpt) {
      const text = docToText(doc)
      if (text) patch.excerpt = text.slice(0, 180) + (text.length > 180 ? "…" : "")
    }
  }

  if (b.status === "draft" || b.status === "published") {
    patch.status = b.status
    if (b.status === "published" && !cur.publishedAt) patch.publishedAt = new Date()
  }

  if (b.cover && typeof b.cover === "object") {
    const c = b.cover as Record<string, unknown>
    patch.coverStorageDir = String(c.storageDir ?? "")
    patch.coverWidth = Number(c.width) || null
    patch.coverHeight = Number(c.height) || null
    patch.coverBlurDataUrl = String(c.blurDataUrl ?? "")
    patch.coverVariants = c.variants ?? null
  } else if (b.cover === null) {
    patch.coverStorageDir = null
    patch.coverWidth = null
    patch.coverHeight = null
    patch.coverBlurDataUrl = null
    patch.coverVariants = null
  }

  if (Object.keys(patch).length === 0)
    return NextResponse.json({ error: "tidak ada perubahan" }, { status: 400 })

  await db.update(articles).set(patch).where(eq(articles.id, id))
  revalidateArticles((patch.slug as string) ?? cur.slug)
  return NextResponse.json({ ok: true, slug: (patch.slug as string) ?? cur.slug })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny
  const id = parseId((await ctx.params).id)
  if (id == null) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  const cur = await db.query.articles.findFirst({ where: eq(articles.id, id) })
  await deleteArticle(id)
  if (cur) revalidateArticles(cur.slug)
  return NextResponse.json({ ok: true })
}
