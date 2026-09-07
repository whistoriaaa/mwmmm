import "server-only"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { photos, sessions } from "@/lib/db/schema"
import { uploadObject, deleteObjects } from "@/lib/storage"
import { processPhoto, variantMeta, contentTypeFor } from "@/lib/images"
import { shortId } from "@/lib/id"

/** Prefix URL untuk menyajikan gambar (bucket private → lewat route handler). */
export const IMG_BASE = "/api/img"

/** storagePath relatif-app → URL yang bisa dipakai <img src>. */
export function imgUrl(storagePath: string): string {
  return `${IMG_BASE}/${storagePath.replace(/^\/+/, "")}`
}

export function variantUrl(storageDir: string, w: number, fmt: "avif" | "webp"): string {
  return imgUrl(`${storageDir}/${w}.${fmt}`)
}

/** Folder objek untuk satu foto. */
function photoDir(categorySlug: string, sessionSlug: string | null, id: string): string {
  return `photos/${categorySlug}/${sessionSlug ?? "_lepas"}/${id}`
}

export interface IngestParams {
  buffer: Buffer
  categoryId: number
  categorySlug: string
  subcategoryId?: number | null
  sessionId?: number | null
  sessionSlug?: string | null
  alt?: string | null
  highlight?: boolean
  sortOrder?: number
  sourcePath?: string | null
}

/**
 * Proses + simpan satu foto: sharp → varian AVIF/WebP → upload S3 →
 * baris `photos`. Mengembalikan baris yang tersimpan.
 */
export async function ingestPhoto(p: IngestParams) {
  const processed = await processPhoto(p.buffer)
  const id = shortId()
  const dir = photoDir(p.categorySlug, p.sessionSlug ?? null, id)

  // upload semua varian + original (untuk re-proses di masa depan)
  await Promise.all([
    ...processed.variants.map((v) =>
      uploadObject({
        path: `${dir}/${v.w}.${v.fmt}`,
        body: v.data,
        contentType: contentTypeFor(v.fmt),
      }),
    ),
    uploadObject({
      path: `${dir}/original.${processed.origFormat}`,
      body: p.buffer,
      contentType: `image/${processed.origFormat}`,
    }),
  ])

  let sortOrder = p.sortOrder
  if (sortOrder === undefined) {
    const [next] = await db
      .select({ v: sql<number>`coalesce(max(${photos.sortOrder}), -1) + 1` })
      .from(photos)
      .where(p.sessionId ? eq(photos.sessionId, p.sessionId) : eq(photos.categoryId, p.categoryId))
    sortOrder = next?.v ?? 0
  }

  const [row] = await db
    .insert(photos)
    .values({
      sessionId: p.sessionId ?? null,
      categoryId: p.categoryId,
      subcategoryId: p.subcategoryId ?? null,
      storageDir: dir,
      origFormat: processed.origFormat,
      sourcePath: p.sourcePath ?? null,
      width: processed.width,
      height: processed.height,
      variants: variantMeta(processed.variants),
      blurDataUrl: processed.blurDataUrl,
      alt: p.alt ?? null,
      highlight: p.highlight ?? false,
      sortOrder,
    })
    .returning()

  return row
}

/** Hapus foto: objek S3 + baris DB. */
export async function deletePhoto(photoId: number): Promise<void> {
  const row = await db.query.photos.findFirst({ where: eq(photos.id, photoId) })
  if (!row) return

  const keys = [
    ...row.variants.map((v) => `${row.storageDir}/${v.w}.${v.fmt}`),
    `${row.storageDir}/original.${row.origFormat}`,
  ]
  try {
    await deleteObjects(keys)
  } catch (e) {
    console.error(`deletePhoto: gagal hapus sebagian objek foto ${photoId}:`, e)
  }
  await db.delete(photos).where(eq(photos.id, photoId))
}

/** Hapus sesi + seluruh fotonya (objek S3 + baris DB). */
export async function deleteSession(sessionId: number): Promise<void> {
  const rows = await db.query.photos.findMany({ where: eq(photos.sessionId, sessionId) })
  const keys = rows.flatMap((r) => [
    ...r.variants.map((v) => `${r.storageDir}/${v.w}.${v.fmt}`),
    `${r.storageDir}/original.${r.origFormat}`,
  ])
  try {
    await deleteObjects(keys)
  } catch (e) {
    console.error(`deleteSession: gagal hapus sebagian objek sesi ${sessionId}:`, e)
  }
  await db.delete(sessions).where(eq(sessions.id, sessionId)) // photos cascade
}

/** Simpan urutan baru foto. */
export async function reorderPhotos(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, i) =>
      db.update(photos).set({ sortOrder: i }).where(eq(photos.id, id)),
    ),
  )
}
