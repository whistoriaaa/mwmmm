import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { ingestArticleImage } from "@/lib/storage/articles"

export const runtime = "nodejs"
export const maxDuration = 120

const MAX_BYTES = 25 * 1024 * 1024

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const id = Number((await ctx.params).id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) })
  if (!article) return NextResponse.json({ error: "artikel tidak ditemukan" }, { status: 404 })

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "file wajib" }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "file > 25 MB" }, { status: 413 })
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "bukan gambar" }, { status: 415 })

  try {
    const res = await ingestArticleImage(id, Buffer.from(await file.arrayBuffer()))
    return NextResponse.json(res)
  } catch (e) {
    console.error("ingest gambar artikel gagal:", e)
    return NextResponse.json({ error: "gagal memproses gambar" }, { status: 500 })
  }
}
