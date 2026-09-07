import Link from "next/link"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { listArticles } from "@/lib/queries/articles"
import { NewArticleButton } from "@/components/admin/new-article-button"

export const metadata = { title: "Artikel" }
export const dynamic = "force-dynamic"

export default async function ArtikelPage() {
  const rows = await listArticles()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Artikel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cerita / storytelling untuk menu Tentang. {rows.length} artikel.
          </p>
        </div>
        <NewArticleButton />
      </div>

      <div className="mt-6 divide-y rounded-lg border">
        {rows.length === 0 && (
          <p className="px-4 py-4 text-sm text-muted-foreground">Belum ada artikel.</p>
        )}
        {rows.map((a) => (
          <Link
            key={a.id}
            href={`/admin/artikel/${a.id}`}
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm font-medium">{a.title}</span>
              {a.status === "draft" && <Badge variant="secondary">draft</Badge>}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {a.readingMinutes} mnt ·{" "}
              {new Date(a.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
