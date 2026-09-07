import { revalidateSite } from "@/lib/revalidate"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/guard"
import { reorderPhotos } from "@/lib/photo-storage"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const body = (await req.json().catch(() => ({}))) as { orderedIds?: unknown }
  const ids = Array.isArray(body.orderedIds)
    ? body.orderedIds.filter((n): n is number => Number.isInteger(n))
    : []
  if (ids.length === 0) return NextResponse.json({ error: "orderedIds kosong" }, { status: 400 })

  await reorderPhotos(ids)
  revalidateSite()
  return NextResponse.json({ ok: true })
}
