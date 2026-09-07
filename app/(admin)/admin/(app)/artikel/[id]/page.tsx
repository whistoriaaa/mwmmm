import { notFound } from "next/navigation"
import { getArticle } from "@/lib/queries/articles"
import { ArticleEditor } from "@/components/admin/article-editor"
import { emptyDoc } from "@/lib/tiptap"
import type { JSONContent } from "@tiptap/core"

export const dynamic = "force-dynamic"

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()

  const a = await getArticle(id)
  if (!a) notFound()

  return (
    <ArticleEditor
      article={{
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        bodyJson: (a.bodyJson as JSONContent) ?? emptyDoc,
        status: a.status,
        cover:
          a.coverStorageDir && a.coverVariants
            ? { storageDir: a.coverStorageDir, variants: a.coverVariants }
            : null,
      }}
    />
  )
}
