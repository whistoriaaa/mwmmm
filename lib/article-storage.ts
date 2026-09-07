import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { articles, articleAssets } from "@/lib/db/schema"
import { uploadObject, deleteObjects, listPrefix } from "@/lib/storage"
import { processPhoto, variantMeta, contentTypeFor } from "@/lib/images"
import { shortId } from "@/lib/id"
import { imgSrc } from "@/lib/img"

/** Proses + simpan satu gambar untuk body artikel → { url, width, height }. */
export async function ingestArticleImage(articleId: number, buffer: Buffer) {
  const proc = await processPhoto(buffer)
  const id = shortId()
  const dir = `articles/${articleId}/${id}`

  await Promise.all([
    ...proc.variants.map((v) =>
      uploadObject({ path: `${dir}/${v.w}.${v.fmt}`, body: v.data, contentType: contentTypeFor(v.fmt) }),
    ),
    uploadObject({
      path: `${dir}/original.${proc.origFormat}`,
      body: buffer,
      contentType: `image/${proc.origFormat}`,
    }),
  ])

  await db.insert(articleAssets).values({
    articleId,
    storageDir: dir,
    width: proc.width,
    height: proc.height,
    blurDataUrl: proc.blurDataUrl,
    variants: variantMeta(proc.variants),
  })

  // src editor: WebP ukuran menengah (lebar cukup untuk kolom artikel)
  const mid = proc.variants
    .filter((v) => v.fmt === "webp")
    .sort((a, b) => a.w - b.w)
    .find((v) => v.w >= 1080) ?? proc.variants.filter((v) => v.fmt === "webp").at(-1)!

  return { url: imgSrc(`${dir}`, mid.w, mid.fmt), width: proc.width, height: proc.height }
}

/** Proses gambar sampul artikel → simpan + update kolom cover_* artikel. */
export async function setArticleCover(articleId: number, buffer: Buffer) {
  const proc = await processPhoto(buffer)
  const dir = `articles/${articleId}/cover/${shortId()}`
  await Promise.all(
    proc.variants.map((v) =>
      uploadObject({ path: `${dir}/${v.w}.${v.fmt}`, body: v.data, contentType: contentTypeFor(v.fmt) }),
    ),
  )
  await db
    .update(articles)
    .set({
      coverStorageDir: dir,
      coverWidth: proc.width,
      coverHeight: proc.height,
      coverBlurDataUrl: proc.blurDataUrl,
      coverVariants: variantMeta(proc.variants),
    })
    .where(eq(articles.id, articleId))
  return { storageDir: dir, width: proc.width, height: proc.height }
}

export async function clearArticleCover(articleId: number) {
  const a = await db.query.articles.findFirst({ where: eq(articles.id, articleId) })
  if (a?.coverStorageDir && a.coverVariants) {
    await deleteObjects(a.coverVariants.map((v) => `${a.coverStorageDir}/${v.w}.${v.fmt}`)).catch(() => {})
  }
  await db
    .update(articles)
    .set({
      coverStorageDir: null,
      coverWidth: null,
      coverHeight: null,
      coverBlurDataUrl: null,
      coverVariants: null,
    })
    .where(eq(articles.id, articleId))
}

/** Hapus artikel + seluruh objek storage-nya (semua di bawah articles/<id>/). */
export async function deleteArticle(articleId: number): Promise<void> {
  const article = await db.query.articles.findFirst({ where: eq(articles.id, articleId) })
  if (!article) return

  try {
    const { objects } = await listPrefix(`articles/${articleId}/`)
    await deleteObjects(objects.map((o) => o.path))
  } catch (e) {
    console.error(`deleteArticle: gagal hapus sebagian objek ${articleId}:`, e)
  }
  await db.delete(articles).where(eq(articles.id, articleId)) // assets cascade
}
