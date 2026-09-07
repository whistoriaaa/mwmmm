import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { setArticleCover, clearArticleCover } from "@/lib/storage/articles"
import { revalidateArticles } from "@/lib/revalidate"

export const runtime = "nodejs"
export const maxDuration = 120

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny
  const id = Number((await ctx.params).id)
  const a = await db.query.articles.findFirst({ where: eq(articles.id, id) })
  if (!a) return NextResponse.json({ error: "artikel tidak ditemukan" }, { status: 404 })

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "gambar wajib" }, { status: 400 })
  }
  try {
    const res = await setArticleCover(id, Buffer.from(await file.arrayBuffer()))
    revalidateArticles(a.slug)
    return NextResponse.json(res)
  } catch (e) {
    console.error("cover gagal:", e)
    return NextResponse.json({ error: "gagal memproses" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny
  const id = Number((await ctx.params).id)
  const a = await db.query.articles.findFirst({ where: eq(articles.id, id) })
  if (!a) return NextResponse.json({ error: "not found" }, { status: 404 })
  await clearArticleCover(id)
  revalidateArticles(a.slug)
  return NextResponse.json({ ok: true })
}
