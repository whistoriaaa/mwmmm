import type { PhotoVariant } from "@/lib/db/schema"

export interface SiteCategory {
  slug: string
  label: string
  subs: { slug: string; label: string }[]
}

export interface SitePhoto {
  id: number
  categorySlug: string
  subSlug: string | null
  sessionSlug: string | null
  sessionTitle: string | null
  month: string | null
  highlight: boolean
  width: number
  height: number
  blurDataUrl: string
  storageDir: string
  variants: PhotoVariant[]
}
