import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getLoosePhotos, listCategories } from "@/lib/queries/catalog"
import { PhotoThumb } from "@/components/admin/photo-thumb"
import { PhotoActions } from "@/components/admin/photo-actions"

export const metadata = { title: "Foto lepas" }

export default async function LoosePage() {
  const [photos, categories] = await Promise.all([getLoosePhotos(), listCategories()])

  const byCat = categories
    .map((c) => ({ cat: c, list: photos.filter((p) => p.categoryId === c.id) }))
    .filter((g) => g.list.length > 0)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/foto"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Foto
      </Link>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Foto lepas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {photos.length} foto tanpa sesi.
      </p>

      {byCat.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Tidak ada foto lepas.</p>
      )}

      <div className="mt-6 space-y-8">
        {byCat.map(({ cat, list }) => (
          <section key={cat.id}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {cat.label} · {list.length}
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <div key={p.id} className="group relative overflow-hidden rounded-lg border bg-muted">
                  <div className="aspect-square">
                    <PhotoThumb photo={p} sizes="(min-width:1024px) 220px, 45vw" />
                  </div>
                  {p.highlight && (
                    <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1 backdrop-blur">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="fill-yellow-400 text-yellow-400">
                        <path stroke="currentColor" strokeWidth="2" d="m12 2 3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z" />
                      </svg>
                    </span>
                  )}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                    <PhotoActions photoId={p.id} highlight={p.highlight} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
