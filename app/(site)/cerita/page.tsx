import type { Metadata } from "next"
import Link from "next/link"
import { listPublishedArticles } from "@/lib/queries/articles"
import { Picture } from "@/components/picture"

export const metadata: Metadata = {
  title: "Cerita — Shobiryne",
  description: "Catatan di balik layar, proses, dan cerita dari setiap sesi.",
}
export const dynamic = "force-dynamic"

function fmtDate(d: Date | null) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

export default async function CeritaPage() {
  const articles = await listPublishedArticles()

  return (
    <main
      className="min-h-screen px-5 md:px-8"
      style={{ background: "var(--background)", color: "var(--text-primary)", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-3xl" style={{ paddingTop: "calc(env(safe-area-inset-top) + 80px)" }}>
        <p className="text-xs tracking-[0.45em] uppercase mb-3" style={{ color: "var(--cyan)", opacity: 0.75 }}>
          Cerita
        </p>
        <h1
          className="font-light italic leading-none mb-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 7vw, 3.5rem)", color: "var(--gold)" }}
        >
          Di Balik Cahaya
        </h1>
        <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-muted)" }}>
          Catatan proses, cerita sesi, dan hal-hal kecil yang membuat sebuah foto terasa hidup.
        </p>

        {articles.length === 0 ? (
          <p className="mt-16 text-sm" style={{ color: "var(--text-faint)" }}>
            Belum ada cerita yang dipublikasikan.
          </p>
        ) : (
          <div className="mt-12 flex flex-col gap-10">
            {articles.map((a) => (
              <Link key={a.id} href={`/cerita/${a.slug}`} className="group grid gap-4 sm:grid-cols-[200px_1fr]">
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-square"
                  style={{ background: "var(--bg-surface-2)" }}
                >
                  {a.coverStorageDir && a.coverVariants ? (
                    <Picture
                      photo={{
                        storageDir: a.coverStorageDir,
                        variants: a.coverVariants,
                        blurDataUrl: a.coverBlurDataUrl ?? "",
                        width: a.coverWidth ?? 4,
                        height: a.coverHeight ?? 3,
                      }}
                      sizes="(min-width: 640px) 200px, 100vw"
                      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs" style={{ color: "var(--text-faint)" }}>
                      Shobiryne
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[11px] tracking-wider uppercase mb-1.5" style={{ color: "var(--text-faint)" }}>
                    {fmtDate(a.publishedAt)} · {a.readingMinutes} menit baca
                  </div>
                  <h2
                    className="font-light italic leading-tight transition-colors"
                    style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 4vw, 1.7rem)", color: "var(--text-primary)" }}
                  >
                    {a.title}
                  </h2>
                  {a.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {a.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
