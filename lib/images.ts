import "server-only"
import sharp from "sharp"
import type { PhotoVariant } from "@/lib/db/schema"

/** Lebar varian yang dibuat (di-cap ke lebar asli). */
export const PHOTO_WIDTHS = [480, 1080, 1920, 2560] as const

const AVIF = { quality: 50, effort: 3 } as const
const WEBP = { quality: 80, effort: 4 } as const

export interface ProcessedVariant extends PhotoVariant {
  data: Buffer
}

export interface ProcessedImage {
  /** dimensi master (varian terbesar) */
  width: number
  height: number
  origFormat: string
  /** placeholder blur, data URL kecil */
  blurDataUrl: string
  variants: ProcessedVariant[]
}

/**
 * Proses satu foto → AVIF + WebP di beberapa lebar + blur placeholder.
 * Sumber di-decode & di-orient sekali (buffer raw), lalu setiap varian
 * di-resize dari situ — jauh lebih cepat dari decode berulang.
 */
export async function processPhoto(input: Buffer): Promise<ProcessedImage> {
  const oriented = sharp(input, { failOn: "none" }).rotate()
  const meta = await oriented.metadata()
  const srcW = meta.autoOrient?.width ?? meta.width ?? 0
  const srcH = meta.autoOrient?.height ?? meta.height ?? 0
  if (!srcW || !srcH) throw new Error("Tidak bisa membaca dimensi gambar")

  const maxW = Math.min(srcW, PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1])
  const widths = [...new Set([...PHOTO_WIDTHS.filter((w) => w < srcW), maxW])].sort((a, b) => a - b)

  // master raw (sudah ter-orient & di-cap ke maxW)
  const { data: rawData, info } = await oriented
    .resize({ width: maxW, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const raw = { raw: { width: info.width, height: info.height, channels: info.channels } }

  const variants: ProcessedVariant[] = []
  for (const w of widths) {
    const pipe = sharp(rawData, raw).resize({ width: w, withoutEnlargement: true })
    const [avif, webp] = await Promise.all([
      pipe.clone().avif(AVIF).toBuffer(),
      pipe.clone().webp(WEBP).toBuffer(),
    ])
    variants.push(
      { w, fmt: "avif", bytes: avif.length, data: avif },
      { w, fmt: "webp", bytes: webp.length, data: webp },
    )
  }

  const blur = await sharp(rawData, raw).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()

  return {
    width: info.width,
    height: info.height,
    origFormat: meta.format ?? "jpeg",
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    variants,
  }
}

/** Metadata varian tanpa buffer — untuk kolom photos.variants. */
export function variantMeta(variants: ProcessedVariant[]): PhotoVariant[] {
  return variants.map(({ w, fmt, bytes }) => ({ w, fmt, bytes }))
}

export const contentTypeFor = (fmt: "avif" | "webp") =>
  fmt === "avif" ? "image/avif" : "image/webp"
