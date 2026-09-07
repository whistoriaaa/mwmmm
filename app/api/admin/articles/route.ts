import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/guard"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { emptyDoc } from "@/lib/tiptap"
import { slugify } from "@/lib/id"
import { eq } from "drizzle-orm"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if ("deny" in guard) return guard.deny

  const { title } = (await req.json().catch(() => ({}))) as { title?: string }
  const t = (title ?? "").trim() || "Artikel tanpa judul"

  let slug = slugify(t) || `artikel-${Date.now().toString(36)}`
  if (await db.query.articles.findFirst({ where: eq(articles.slug, slug) })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  }

  const [row] = await db
    .insert(articles)
    .values({ slug, title: t, bodyJson: emptyDoc, bodyHtml: "", status: "draft" })
    .returning()

  return NextResponse.json({ id: row.id })
}
