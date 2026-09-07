import { revalidateSite } from "@/lib/revalidate"
import { NextResponse, type NextRequest } from "next/server"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { categories, sessions } from "@/lib/db/schema"
import { ingestPhoto } from "@/lib/storage/photos"
import { slugify } from "@/lib/id"

export const runtime = "nodejs"
export const maxDuration = 120

const MAX_BYTES = 40 * 1024 * 1024

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File wajib diunggah." }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran file melebihi 40 MB." }, { status: 413 })
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File bukan gambar." }, { status: 415 })
  }

  const categoryId = Number(form.get("categoryId"))
  const subcategoryId = form.get("subcategoryId") ? Number(form.get("subcategoryId")) : null
  let sessionId = form.get("sessionId") ? Number(form.get("sessionId")) : null
  const newSessionTitle = String(form.get("newSessionTitle") ?? "").trim()
  const month = (String(form.get("month") ?? "").trim().match(/^\d{4}-\d{2}$/)?.[0]) ?? null

  const cat = await db.query.categories.findFirst({ where: eq(categories.id, categoryId) })
  if (!cat) return NextResponse.json({ error: "Kategori tidak valid." }, { status: 400 })

  let sess: typeof sessions.$inferSelect | undefined
  if (sessionId) {
    sess = await db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) })
    if (!sess) return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 400 })
  } else if (newSessionTitle) {
    let slug = slugify(newSessionTitle) || `sesi-${Date.now().toString(36)}`
    const clash = await db.query.sessions.findFirst({ where: eq(sessions.slug, slug) })
    if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    ;[sess] = await db
      .insert(sessions)
      .values({ slug, title: newSessionTitle, categoryId, subcategoryId, month })
      .returning()
    sessionId = sess.id
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const row = await ingestPhoto({
      buffer,
      categoryId,
      categorySlug: cat.slug,
      subcategoryId: sess?.subcategoryId ?? subcategoryId,
      sessionId: sessionId ?? null,
      sessionSlug: sess?.slug ?? null,
    })
    revalidateSite()
    return NextResponse.json({
      sessionId: sessionId ?? null,
      sessionTitle: sess?.title ?? null,
      photo: { id: row.id, storageDir: row.storageDir, width: row.width, height: row.height },
    })
  } catch (e) {
    console.error("ingest gagal:", e)
    return NextResponse.json({ error: "Gagal memproses gambar." }, { status: 500 })
  }
}
