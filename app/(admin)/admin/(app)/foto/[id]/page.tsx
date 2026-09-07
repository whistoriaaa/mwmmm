import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSessionWithPhotos, listCategories } from "@/lib/queries/catalog"
import { SessionPhotoGrid, type GridPhoto } from "@/components/admin/session-photo-grid"
import { SessionSettings } from "@/components/admin/session-settings"

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()

  const [data, categories] = await Promise.all([getSessionWithPhotos(id), listCategories()])
  if (!data) notFound()

  const { session, photos } = data
  const cat = categories.find((c) => c.id === session.categoryId)
  const sub = cat?.subs.find((s) => s.id === session.subcategoryId)

  const gridPhotos: GridPhoto[] = photos.map((p) => ({
    id: p.id,
    highlight: p.highlight,
    storageDir: p.storageDir,
    width: p.width,
    height: p.height,
    variants: p.variants,
    blurDataUrl: p.blurDataUrl,
    alt: p.alt,
  }))

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/foto"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Foto
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{session.title}</h1>
            {!session.published && <Badge variant="secondary">draft</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {[cat?.label, sub?.label, session.month].filter(Boolean).join(" · ")} · {photos.length}{" "}
            foto
          </p>
        </div>
        <div className="flex gap-2">
          <SessionSettings
            session={{
              id: session.id,
              title: session.title,
              month: session.month,
              categoryId: session.categoryId,
              subcategoryId: session.subcategoryId,
              published: session.published,
            }}
            categories={categories.map((c) => ({
              id: c.id,
              label: c.label,
              subs: c.subs.map((s) => ({ id: s.id, label: s.label })),
            }))}
          />
          <Button size="sm" render={<Link href="/admin/foto/upload" />}>
            <Plus className="size-4" />
            Unggah
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {gridPhotos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada foto.{" "}
            <Link href="/admin/foto/upload" className="underline">
              Unggah
            </Link>
            .
          </p>
        ) : (
          <SessionPhotoGrid
            sessionId={session.id}
            photos={gridPhotos}
            coverPhotoId={session.coverPhotoId}
          />
        )}
      </div>
    </div>
  )
}
