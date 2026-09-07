/**
 * Pembangun URL gambar CMS (aman dipakai di client — tanpa dependency server).
 * Bucket private → semua lewat route handler /api/img.
 */
import type { PhotoVariant } from "@/lib/db/schema"

export const IMG_BASE = "/api/img"

export function imgSrc(storageDir: string, w: number, fmt: "avif" | "webp"): string {
  return `${IMG_BASE}/${storageDir}/${w}.${fmt}`
}

export interface PictureSources {
  avif?: string
  webp?: string
  /** fallback <img src> — WebP terkecil */
  fallback: string
  smallestWidth: number
  largest: { src: string; w: number }
}

/** srcSet per format dari daftar varian. */
export function pictureSources(storageDir: string, variants: PhotoVariant[]): PictureSources {
  const by = (fmt: "avif" | "webp") =>
    variants
      .filter((v) => v.fmt === fmt)
      .sort((a, b) => a.w - b.w)
  const avif = by("avif")
  const webp = by("webp")
  const set = (list: PhotoVariant[]) =>
    list.map((v) => `${imgSrc(storageDir, v.w, v.fmt)} ${v.w}w`).join(", ") || undefined
  const fallbackV = webp[0] ?? avif[0]
  const largestV = webp.at(-1) ?? avif.at(-1) ?? fallbackV
  return {
    avif: set(avif),
    webp: set(webp),
    fallback: imgSrc(storageDir, fallbackV.w, fallbackV.fmt),
    smallestWidth: fallbackV.w,
    largest: { src: imgSrc(storageDir, largestV.w, largestV.fmt), w: largestV.w },
  }
}
