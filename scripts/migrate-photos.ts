/**
 * Migrasi foto dari public/photos (data/categories.ts) ke object storage + DB.
 * Idempoten: foto yang source_path-nya sudah ada di DB dilewati.
 *
 *   npm run migrate:photos                 # semua
 *   npm run migrate:photos -- --only portrait
 *   npm run migrate:photos -- --limit 10
 */
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { eq, and } from "drizzle-orm"
import * as schema from "../lib/db/schema.ts"
import { processPhoto, variantMeta, contentTypeFor } from "../lib/storage/images.ts"
import { uploadObject } from "../lib/storage/s3.ts"
import { shortId, slugify } from "../lib/id.ts"
import { allCategoryPhotos } from "../data/categories.ts"

const args = process.argv.slice(2)
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const only = opt("only")
const limit = opt("limit") ? Number(opt("limit")) : Infinity

const db = drizzle(createClient({ url: process.env.DATABASE_URL ?? "file:./.data/cms.db" }), { schema })
const PUBLIC = path.resolve("public")

type Row = (typeof allCategoryPhotos)[number]

async function findCategory(slug: string) {
  const c = await db.query.categories.findFirst({ where: eq(schema.categories.slug, slug) })
  if (!c) throw new Error(`kategori "${slug}" belum ada — jalankan db:seed dulu`)
  return c
}

async function findSub(categoryId: number, slug: string | undefined) {
  if (!slug) return null
  return (
    (await db.query.subcategories.findFirst({
      where: and(eq(schema.subcategories.categoryId, categoryId), eq(schema.subcategories.slug, slug)),
    })) ?? null
  )
}

const sessionCache = new Map<string, number>() // slug -> id

async function ensureSession(
  group: string,
  categoryId: number,
  subcategoryId: number | null,
  month: string | null,
): Promise<{ id: number; slug: string }> {
  const slug = slugify(group)
  if (sessionCache.has(slug)) return { id: sessionCache.get(slug)!, slug }

  let s = await db.query.sessions.findFirst({ where: eq(schema.sessions.slug, slug) })
  if (!s) {
    ;[s] = await db
      .insert(schema.sessions)
      .values({ slug, title: group, categoryId, subcategoryId, month })
      .returning()
    console.log(`  + sesi "${group}"`)
  }
  sessionCache.set(slug, s.id)
  return { id: s.id, slug }
}

const orderCounter = new Map<string, number>()

async function migrateOne(p: Row, idx: number, total: number) {
  const rel = p.src.replace(/^\//, "") // "photos/..."
  const abs = path.join(PUBLIC, rel)
  const tag = `[${idx + 1}/${total}] ${p.category}${p.sub ? "/" + p.sub : ""}${p.group ? " · " + p.group : ""}`

  const exists = await db.query.photos.findFirst({ where: eq(schema.photos.sourcePath, p.src) })
  if (exists) {
    console.log(`${tag} — sudah ada, lewati`)
    return "skip"
  }
  if (!existsSync(abs)) {
    console.warn(`${tag} — FILE HILANG: ${abs}`)
    return "missing"
  }

  const cat = await findCategory(p.category)
  const sub = await findSub(cat.id, p.sub)

  let sessionId: number | null = null
  let sessSlug: string | null = null
  if (p.group) {
    const s = await ensureSession(p.group, cat.id, sub?.id ?? null, p.date ?? null)
    sessionId = s.id
    sessSlug = s.slug
  }

  const buf = await readFile(abs)
  const t0 = Date.now()
  const proc = await processPhoto(buf)

  const id = shortId()
  const dir = `photos/${cat.slug}/${sessSlug ?? "_lepas"}/${id}`
  await Promise.all([
    ...proc.variants.map((v) =>
      uploadObject({ path: `${dir}/${v.w}.${v.fmt}`, body: v.data, contentType: contentTypeFor(v.fmt) }),
    ),
    uploadObject({
      path: `${dir}/original.${proc.origFormat}`,
      body: buf,
      contentType: `image/${proc.origFormat}`,
    }),
  ])

  const key = sessSlug ?? `_lepas:${cat.slug}`
  const order = orderCounter.get(key) ?? 0
  orderCounter.set(key, order + 1)

  await db.insert(schema.photos).values({
    sessionId,
    categoryId: cat.id,
    subcategoryId: sub?.id ?? null,
    storageDir: dir,
    origFormat: proc.origFormat,
    sourcePath: p.src,
    width: proc.width,
    height: proc.height,
    variants: variantMeta(proc.variants),
    blurDataUrl: proc.blurDataUrl,
    highlight: p.highlight ?? false,
    sortOrder: order,
  })

  console.log(`${tag} → ${dir}  (${Date.now() - t0}ms, ${proc.variants.length} varian)`)
  return "ok"
}

async function main() {
  let list = allCategoryPhotos as Row[]
  if (only) list = list.filter((p) => p.category === only)
  list = list.slice(0, limit)

  console.log(`Migrasi ${list.length} foto${only ? ` (kategori: ${only})` : ""}…\n`)
  const stats = { ok: 0, skip: 0, missing: 0, err: 0 }
  const t0 = Date.now()

  for (let i = 0; i < list.length; i++) {
    try {
      const r = await migrateOne(list[i], i, list.length)
      stats[r]++
    } catch (e) {
      stats.err++
      console.error(`  GAGAL: ${(e as Error).message}`)
    }
  }

  console.log(
    `\nSelesai dalam ${((Date.now() - t0) / 1000).toFixed(0)}s — ` +
      `ok ${stats.ok}, lewati ${stats.skip}, hilang ${stats.missing}, error ${stats.err}`,
  )
  process.exit(stats.err > 0 ? 1 : 0)
}

main()
