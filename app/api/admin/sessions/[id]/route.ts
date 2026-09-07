import { revalidateSite } from "@/lib/revalidate"
import { NextResponse } from "next/server"
import { and, eq, ne } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { sessions, categories, subcategories, photos } from "@/lib/db/schema"
import { deleteSession } from "@/lib/storage/photos"
import { slugify } from "@/lib/id"

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

  const cur = await db.query.sessions.findFirst({ where: eq(sessions.id, id) })
  if (!cur) return NextResponse.json({ error: "sesi tidak ditemukan" }, { status: 404 })

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const patch: Record<string, unknown> = {}

  if (typeof b.title === "string" && b.title.trim()) {
    const title = b.title.trim()
    patch.title = title
    if (title !== cur.title) {
      let slug = slugify(title) || cur.slug
      const clash = await db.query.sessions.findFirst({
        where: and(eq(sessions.slug, slug), ne(sessions.id, id)),
      })
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
      patch.slug = slug
    }
  }
  if (b.month === null || (typeof b.month === "string" && /^\d{4}-\d{2}$/.test(b.month))) {
    patch.month = b.month ?? null
  }
  if (typeof b.description === "string") patch.description = b.description.trim() || null
  if (typeof b.published === "boolean") patch.published = b.published

  if (typeof b.categoryId === "number") {
    const cat = await db.query.categories.findFirst({ where: eq(categories.id, b.categoryId) })
    if (!cat) return NextResponse.json({ error: "kategori tidak valid" }, { status: 400 })
    patch.categoryId = b.categoryId
    // reset subcategory jika pindah kategori
    if (b.categoryId !== cur.categoryId) patch.subcategoryId = null
  }
  if (b.subcategoryId === null) patch.subcategoryId = null
  else if (typeof b.subcategoryId === "number") {
    const targetCat = (patch.categoryId as number) ?? cur.categoryId
    const sub = await db.query.subcategories.findFirst({
      where: and(eq(subcategories.id, b.subcategoryId), eq(subcategories.categoryId, targetCat)),
    })
    if (!sub) return NextResponse.json({ error: "sub-kategori tidak valid" }, { status: 400 })
    patch.subcategoryId = b.subcategoryId
  }
  if (typeof b.coverPhotoId === "number") {
    const ph = await db.query.photos.findFirst({
      where: and(eq(photos.id, b.coverPhotoId), eq(photos.sessionId, id)),
    })
    if (ph) patch.coverPhotoId = b.coverPhotoId
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "tidak ada perubahan" }, { status: 400 })
  }

  // jika kategori/sub berubah, ikutkan foto-fotonya
  if (patch.categoryId !== undefined || patch.subcategoryId !== undefined) {
    await db
      .update(photos)
      .set({
        ...(patch.categoryId !== undefined ? { categoryId: patch.categoryId as number } : {}),
        ...(patch.subcategoryId !== undefined
          ? { subcategoryId: patch.subcategoryId as number | null }
          : {}),
      })
      .where(eq(photos.sessionId, id))
  }

  await db.update(sessions).set(patch).where(eq(sessions.id, id))
  revalidateSite()
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny
  const id = parseId((await ctx.params).id)
  if (id == null) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  await deleteSession(id)
  revalidateSite()
  return NextResponse.json({ ok: true })
}
