import Link from "next/link"
import { Plus, FolderOpen, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { listCategories, listSessions, looseCount } from "@/lib/queries/catalog"

export const metadata = { title: "Foto" }

export default async function FotoPage() {
  const [categories, sessions, loose] = await Promise.all([
    listCategories(),
    listSessions(),
    looseCount(),
  ])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Foto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sessions.length} sesi · {sessions.reduce((n, s) => n + s.photoCount, 0) + loose} foto
          </p>
        </div>
        <Button render={<Link href="/admin/foto/upload" />}>
          <Plus className="size-4" />
          Unggah
        </Button>
      </div>

      <div className="mt-6 space-y-8">
        {categories.map((cat) => {
          const catSessions = sessions.filter((s) => s.categoryId === cat.id)
          return (
            <section key={cat.id}>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {cat.label}
              </h2>
              <div className="mt-2 divide-y rounded-lg border">
                {catSessions.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Belum ada sesi.</p>
                )}
                {catSessions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/admin/foto/${s.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium">{s.title}</span>
                      {!s.published && <Badge variant="secondary">draft</Badge>}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {s.photoCount} foto{s.month ? ` · ${s.month}` : ""}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Foto lepas
          </h2>
          <div className="mt-2 rounded-lg border px-4 py-3 text-sm">
            {loose > 0 ? (
              <Link href="/admin/foto/lepas" className="flex items-center gap-2 hover:underline">
                <ImageOff className="size-4 text-muted-foreground" />
                {loose} foto tanpa sesi
              </Link>
            ) : (
              <span className="text-muted-foreground">Tidak ada.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
