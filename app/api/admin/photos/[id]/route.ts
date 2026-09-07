import { revalidateSite } from "@/lib/revalidate"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { photos } from "@/lib/db/schema"
import { deletePhoto } from "@/lib/storage/photos"

export const runtime = "nodejs"

function parseId(v: string) {
  const n = Number(v)
  return Number.isInteger(n) ? n : null
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const id = parseId((await ctx.params).id)
  if (id == null) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  const body = (await req.json().catch(() => ({}))) as {
    highlight?: boolean
    alt?: string | null
  }
  const patch: Record<string, unknown> = {}
  if (typeof body.highlight === "boolean") patch.highlight = body.highlight
  if (body.alt !== undefined) patch.alt = body.alt ? String(body.alt).slice(0, 300) : null
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "tidak ada perubahan" }, { status: 400 })
  }

  await db.update(photos).set(patch).where(eq(photos.id, id))
  revalidateSite()
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const id = parseId((await ctx.params).id)
  if (id == null) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  await deletePhoto(id)
  revalidateSite()
  return NextResponse.json({ ok: true })
}
