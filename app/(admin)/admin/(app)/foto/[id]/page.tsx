import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Star } from "lucide-react"
import { getSessionWithPhotos, listCategories } from "@/lib/queries/catalog"
import { PhotoThumb } from "@/components/admin/photo-thumb"
import { DeletePhotoButton } from "@/components/admin/delete-photo-button"

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()

  const [data, categories] = await Promise.all([getSessionWithPhotos(id), listCategories()])
  if (!data) notFound()

  const { session, photos } = data
  const cat = categories.find((c) => c.id === session.categoryId)
  const sub = cat?.subs.find((s) => s.id === session.subcategoryId)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/foto"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Foto
      </Link>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{session.title}</h1>
        <span className="text-sm text-muted-foreground">
          {[cat?.label, sub?.label, session.month].filter(Boolean).join(" · ")}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{photos.length} foto</p>

      {photos.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Belum ada foto.{" "}
          <Link href="/admin/foto/upload" className="underline">
            Unggah
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-square bg-muted">
                <PhotoThumb photo={p} sizes="(min-width:1024px) 220px, 45vw" />
              </div>
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {p.highlight ? (
                  <Star className="size-4 fill-yellow-400 text-yellow-400 drop-shadow" />
                ) : (
                  <span />
                )}
                <div className="rounded-md bg-background/85 backdrop-blur">
                  <DeletePhotoButton photoId={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
