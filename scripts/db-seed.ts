/**
 * Seed database:
 *  - akun admin dari ADMIN_USERNAME + (ADMIN_PASSWORD_HASH | ADMIN_PASSWORD)
 *  - kategori & sub-kategori dari data/categories.ts (taksonomi situs sekarang)
 *
 *   npm run db:seed
 */
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import * as schema from "../lib/db/schema.ts"
import { categoryDefs } from "../data/categories.ts"

const url = process.env.DATABASE_URL ?? "file:./.data/cms.db"
const db = drizzle(createClient({ url }), { schema })

async function seedAdmin() {
  const username = (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase()
  let hash = process.env.ADMIN_PASSWORD_HASH?.trim()
  if (!hash) {
    const plain = process.env.ADMIN_PASSWORD?.trim()
    if (!plain) {
      console.warn("⚠  ADMIN_PASSWORD_HASH / ADMIN_PASSWORD kosong — akun admin dilewati.")
      return
    }
    hash = await bcrypt.hash(plain, 12)
  }

  const existing = await db.query.users.findFirst({ where: eq(schema.users.username, username) })
  if (existing) {
    await db.update(schema.users).set({ passwordHash: hash }).where(eq(schema.users.id, existing.id))
    console.log(`✓ admin "${username}" — password diperbarui`)
  } else {
    await db.insert(schema.users).values({ username, passwordHash: hash, name: "Administrator" })
    console.log(`✓ admin "${username}" — dibuat`)
  }
}

async function seedTaxonomy() {
  for (let ci = 0; ci < categoryDefs.length; ci++) {
    const c = categoryDefs[ci]
    let cat = await db.query.categories.findFirst({ where: eq(schema.categories.slug, c.key) })
    if (!cat) {
      ;[cat] = await db
        .insert(schema.categories)
        .values({ slug: c.key, label: c.label, sortOrder: ci })
        .returning()
      console.log(`✓ kategori "${c.label}"`)
    }
    const subs = c.subs ?? []
    for (let si = 0; si < subs.length; si++) {
      const s = subs[si]
      const has = await db.query.subcategories.findFirst({
        where: (t, { and, eq: e }) => and(e(t.categoryId, cat!.id), e(t.slug, s.key)),
      })
      if (!has) {
        await db
          .insert(schema.subcategories)
          .values({ categoryId: cat.id, slug: s.key, label: s.label, sortOrder: si })
        console.log(`  ↳ sub "${s.label}"`)
      }
    }
  }
}

await seedAdmin()
await seedTaxonomy()
console.log("\nSelesai.")
process.exit(0)
