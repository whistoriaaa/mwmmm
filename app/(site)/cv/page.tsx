import type { Metadata } from "next"
import Link from "next/link"
import { getCv, cvHasContent } from "@/lib/queries/cv"

export const metadata: Metadata = { title: "CV — Shobiryne" }
export const dynamic = "force-dynamic"

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--cyan)", opacity: 0.7 }}>
    {children}
  </p>
)

export default async function CvPage() {
  const cv = await getCv()
  const empty = !cvHasContent(cv)

  return (
    <main
      className="min-h-screen px-5 md:px-8"
      style={{ background: "var(--background)", color: "var(--text-primary)", paddingBottom: "96px" }}
    >
      <div className="mx-auto max-w-2xl" style={{ paddingTop: "calc(env(safe-area-inset-top) + 80px)" }}>
        <Link href="/about" className="text-xs tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
          ‹ Tentang
        </Link>

        <h1
          className="mt-6 font-light italic leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem, 8vw, 4rem)", color: "var(--gold)" }}
        >
          Shobiryne
        </h1>
        {cv.headline && (
          <p className="mt-2 text-sm tracking-wide uppercase" style={{ color: "var(--cyan)" }}>
            {cv.headline}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {cv.location && <span>{cv.location}</span>}
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {(cv.links ?? []).map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="underline">
              {l.label}
            </a>
          ))}
        </div>

        {empty ? (
          <p className="mt-16 text-sm" style={{ color: "var(--text-faint)" }}>
            CV belum diisi.
          </p>
        ) : (
          <div className="mt-14 flex flex-col gap-14">
            {cv.summary && (
              <section>
                <Label>Ringkasan</Label>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "58ch" }}>
                  {cv.summary}
                </p>
              </section>
            )}

            {(cv.experience ?? []).length > 0 && (
              <section>
                <Label>Pengalaman</Label>
                <div className="flex flex-col gap-6">
                  {cv.experience!.map((e, i) => (
                    <div key={i}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                          {e.role}
                        </h3>
                        <span className="text-xs tracking-wider" style={{ color: "var(--text-faint)" }}>
                          {e.period}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--cyan)", opacity: 0.85 }}>
                        {e.org}
                      </p>
                      {e.detail && (
                        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                          {e.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(cv.education ?? []).length > 0 && (
              <section>
                <Label>Pendidikan</Label>
                <div className="flex flex-col gap-3">
                  {cv.education!.map((e, i) => (
                    <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span style={{ color: "var(--text-primary)" }}>
                        {e.title}
                        {e.org ? ` · ${e.org}` : ""}
                      </span>
                      <span className="text-xs tracking-wider" style={{ color: "var(--text-faint)" }}>
                        {e.period}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid gap-14 sm:grid-cols-2">
              {(cv.skills ?? []).length > 0 && (
                <section>
                  <Label>Keahlian</Label>
                  <ul className="flex flex-col gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {cv.skills!.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </section>
              )}
              {(cv.services ?? []).length > 0 && (
                <section>
                  <Label>Layanan</Label>
                  <ul className="flex flex-col gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {cv.services!.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
