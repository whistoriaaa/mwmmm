import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/guard"
import { deletePhoto } from "@/lib/photo-storage"

export const runtime = "nodejs"

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const id = Number((await ctx.params).id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: "id tidak valid" }, { status: 400 })

  await deletePhoto(id)
  return NextResponse.json({ ok: true })
}
