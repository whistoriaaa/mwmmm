import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"
import { DEFAULT_SETTINGS } from "@/lib/queries/settings"
import { revalidateSite, revalidateAbout } from "@/lib/revalidate"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"

const s = (v: unknown, d = "") => (typeof v === "string" ? v.trim() : d)

export async function PATCH(req: Request) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const c = (b.contact ?? {}) as Record<string, unknown>

  const entries: { key: string; value: unknown }[] = [
    { key: "tagline", value: s(b.tagline, DEFAULT_SETTINGS.tagline) },
    { key: "availableForWork", value: b.availableForWork !== false },
    { key: "contactIntro", value: s(b.contactIntro, DEFAULT_SETTINGS.contactIntro) },
    {
      key: "contact",
      value: {
        instagramHandle: s(c.instagramHandle, DEFAULT_SETTINGS.contact.instagramHandle),
        instagramUrl: s(c.instagramUrl, DEFAULT_SETTINGS.contact.instagramUrl),
        whatsappDisplay: s(c.whatsappDisplay, DEFAULT_SETTINGS.contact.whatsappDisplay),
        whatsappUrl: s(c.whatsappUrl, DEFAULT_SETTINGS.contact.whatsappUrl),
        email: s(c.email, DEFAULT_SETTINGS.contact.email),
      },
    },
  ]

  for (const e of entries) {
    await db
      .insert(settings)
      .values({ key: e.key, value: e.value })
      .onConflictDoUpdate({ target: settings.key, set: { value: e.value } })
  }

  revalidateSite()
  revalidateAbout()
  revalidatePath("/contact", "page")
  return NextResponse.json({ ok: true })
}
