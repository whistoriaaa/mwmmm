import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { cv, type CvData } from "@/lib/db/schema"
import { revalidateAbout } from "@/lib/revalidate"

export const runtime = "nodejs"

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")
const arr = <T,>(v: unknown, map: (x: Record<string, unknown>) => T): T[] =>
  Array.isArray(v) ? v.map((x) => map((x ?? {}) as Record<string, unknown>)) : []

export async function PATCH(req: Request) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>

  const data: CvData = {
    headline: str(b.headline),
    summary: str(b.summary),
    location: str(b.location),
    email: str(b.email),
    phone: str(b.phone),
    links: arr(b.links, (x) => ({ label: str(x.label), url: str(x.url) })).filter((l) => l.label && l.url),
    experience: arr(b.experience, (x) => ({
      role: str(x.role),
      org: str(x.org),
      period: str(x.period),
      detail: str(x.detail) || undefined,
    })).filter((e) => e.role || e.org),
    education: arr(b.education, (x) => ({
      title: str(x.title),
      org: str(x.org),
      period: str(x.period),
    })).filter((e) => e.title || e.org),
    skills: Array.isArray(b.skills)
      ? (b.skills as unknown[]).map(str).filter(Boolean)
      : str(b.skills).split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
    services: Array.isArray(b.services)
      ? (b.services as unknown[]).map(str).filter(Boolean)
      : str(b.services).split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
  }

  const existing = await db.query.cv.findFirst({ where: eq(cv.id, 1) })
  if (existing) await db.update(cv).set({ data }).where(eq(cv.id, 1))
  else await db.insert(cv).values({ id: 1, data })

  revalidateAbout()
  return NextResponse.json({ ok: true })
}
