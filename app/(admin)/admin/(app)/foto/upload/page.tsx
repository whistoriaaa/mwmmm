import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { listCategories, listSessions } from "@/lib/queries/catalog"
import { UploadForm } from "@/components/admin/upload-form"

export const metadata = { title: "Unggah Foto" }

export default async function UploadPage() {
  const [categories, sessions] = await Promise.all([listCategories(), listSessions()])

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/foto"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Foto
      </Link>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Unggah Foto</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Pilih kategori, tentukan sesi/bulan, lalu pilih beberapa foto. Setiap foto otomatis
        dibuat versi ringan (AVIF/WebP) beberapa ukuran.
      </p>

      <UploadForm
        categories={categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          label: c.label,
          subs: c.subs.map((s) => ({ id: s.id, slug: s.slug, label: s.label })),
        }))}
        sessions={sessions.map((s) => ({
          id: s.id,
          title: s.title,
          categoryId: s.categoryId,
          month: s.month,
          photoCount: s.photoCount,
        }))}
      />
    </div>
  )
}
