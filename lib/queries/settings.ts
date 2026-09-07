import "server-only"
import { db } from "@/lib/db"
import { settings } from "@/lib/db/schema"

export interface SiteSettings {
  tagline: string
  availableForWork: boolean
  contact: {
    instagramHandle: string
    instagramUrl: string
    whatsappDisplay: string
    whatsappUrl: string
    email: string
  }
  contactIntro: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  tagline: "Photographer & Videographer",
  availableForWork: true,
  contact: {
    instagramHandle: "@shobiryne",
    instagramUrl: "https://instagram.com/shobiryne_",
    whatsappDisplay: "+62 822-4553-4636",
    whatsappUrl: "https://wa.me/6282245534636",
    email: "shobiryne@gmail.com",
  },
  contactIntro:
    "Terbuka untuk proyek foto, video, dan kolaborasi kreatif. Pilih saluran yang paling nyaman untukmu.",
}

/** Gabungkan baris settings DB ke objek bertipe (dengan default). */
export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(settings)
  const map = new Map(rows.map((r) => [r.key, r.value]))
  const merged = { ...DEFAULT_SETTINGS }
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    if (map.has(key)) {
      const v = map.get(key)
      if (key === "contact" && v && typeof v === "object") {
        merged.contact = { ...DEFAULT_SETTINGS.contact, ...(v as object) }
      } else {
        // @ts-expect-error — key-by-key merge
        merged[key] = v
      }
    }
  }
  return merged
}
