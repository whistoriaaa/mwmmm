import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSONContent } from "@tiptap/core"
import { getPublishedArticle } from "@/lib/queries/articles"
import { renderArticleHtml } from "@/lib/tiptap"
import { SitePicture } from "@/components/site/site-picture"

export const dynamic = "force-dynamic"

function fmtDate(d: Date | null) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const a = await getPublishedArticle((await params).slug)
  if (!a) return { title: "Cerita — Shobiryne" }
  return {
    title: `${a.title} — Shobiryne`,
    description: a.excerpt ?? undefined,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getPublishedArticle((await params).slug)
  if (!a) notFound()

  const html = renderArticleHtml(a.bodyJson as JSONContent)

  return (
    <main
      className="min-h-screen px-5 md:px-8"
      style={{ background: "var(--background)", color: "var(--text-primary)", paddingBottom: "96px" }}
    >
      <article className="mx-auto max-w-2xl" style={{ paddingTop: "calc(env(safe-area-inset-top) + 80px)" }}>
        <Link
          href="/cerita"
          className="inline-flex items-center gap-1 text-xs tracking-wider uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          ‹ Cerita
        </Link>

        <div className="mt-6 text-[11px] tracking-wider uppercase" style={{ color: "var(--text-faint)" }}>
          {fmtDate(a.publishedAt)} · {a.readingMinutes} menit baca
        </div>
        <h1
          className="mt-2 font-light italic leading-tight"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 6vw, 3rem)", color: "var(--gold)" }}
        >
          {a.title}
        </h1>
        {a.excerpt && (
          <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {a.excerpt}
          </p>
        )}

        {a.coverStorageDir && a.coverVariants && (
          <div className="mt-8 overflow-hidden rounded-xl" style={{ background: "var(--bg-surface-2)" }}>
            <SitePicture
              photo={{
                storageDir: a.coverStorageDir,
                variants: a.coverVariants,
                blurDataUrl: a.coverBlurDataUrl ?? "",
                width: a.coverWidth ?? 16,
                height: a.coverHeight ?? 9,
              }}
              sizes="(min-width: 768px) 672px, 100vw"
              fit="contain"
              className="w-full"
              priority
            />
          </div>
        )}

        <div
          className="prose-article mt-10"
          style={{ color: "var(--text-primary)" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </main>
  )
}
