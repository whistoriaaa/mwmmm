"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Link2, ImagePlus, Undo2, Redo2, Minus, Trash2,
} from "lucide-react"
import type { JSONContent } from "@tiptap/core"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { articleExtensions } from "@/lib/tiptap"
import { slugify } from "@/lib/id"
import { imgSrc } from "@/lib/img"
import type { PhotoVariant } from "@/lib/db/schema"

export interface ArticleData {
  id: number
  title: string
  slug: string
  excerpt: string | null
  bodyJson: JSONContent
  status: "draft" | "published"
  cover: { storageDir: string; variants: PhotoVariant[] } | null
}

function CoverRow({ articleId, cover }: { articleId: number; cover: ArticleData["cover"] }) {
  const router = useRouter()
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function upload(file: File) {
    setBusy(true)
    const fd = new FormData()
    fd.set("file", file)
    await fetch(`/api/admin/articles/${articleId}/cover`, { method: "POST", body: fd })
    setBusy(false)
    router.refresh()
  }
  async function clear() {
    setBusy(true)
    await fetch(`/api/admin/articles/${articleId}/cover`, { method: "DELETE" })
    setBusy(false)
    router.refresh()
  }

  const thumb = cover?.variants.find((v) => v.fmt === "webp" && v.w >= 480) ?? cover?.variants[0]

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="grid h-16 w-24 place-items-center overflow-hidden rounded-md border bg-muted text-[10px] text-muted-foreground">
        {cover && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc(cover.storageDir, thumb.w, thumb.fmt)} alt="" className="h-full w-full object-cover" />
        ) : (
          "Sampul"
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        name="article-cover"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
          e.target.value = ""
        }}
      />
      <Button variant="outline" size="sm" onClick={() => ref.current?.click()} disabled={busy}>
        {busy ? "…" : cover ? "Ganti sampul" : "Tambah sampul"}
      </Button>
      {cover && (
        <Button variant="ghost" size="sm" onClick={clear} disabled={busy}>
          Hapus
        </Button>
      )}
    </div>
  )
}

function Tb({
  onClick, active, disabled, label, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // jangan curi fokus/selection dari editor
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, articleId }: { editor: Editor; articleId: number }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const addImage = useCallback(
    async (file: File) => {
      setUploading(true)
      const fd = new FormData()
      fd.set("file", file)
      const r = await fetch(`/api/admin/articles/${articleId}/images`, { method: "POST", body: fd })
      const j = await r.json().catch(() => ({}))
      setUploading(false)
      if (r.ok && j.url) editor.chain().focus().setImage({ src: j.url }).run()
    },
    [editor, articleId],
  )

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("URL tautan:", prev ?? "https://")
    if (url === null) return
    if (url === "") editor.chain().focus().unsetLink().run()
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background/95 p-1 backdrop-blur">
      <Tb label="Tebal" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold className="size-4" /></Tb>
      <Tb label="Miring" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic className="size-4" /></Tb>
      <span className="mx-1 h-5 w-px bg-border" />
      <Tb label="Judul 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 className="size-4" /></Tb>
      <Tb label="Judul 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 className="size-4" /></Tb>
      <Tb label="Daftar" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List className="size-4" /></Tb>
      <Tb label="Daftar bernomor" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered className="size-4" /></Tb>
      <Tb label="Kutipan" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote className="size-4" /></Tb>
      <Tb label="Garis pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="size-4" /></Tb>
      <span className="mx-1 h-5 w-px bg-border" />
      <Tb label="Tautan" onClick={setLink} active={editor.isActive("link")}><Link2 className="size-4" /></Tb>
      <Tb label={uploading ? "Mengunggah…" : "Sisipkan gambar"} onClick={() => fileRef.current?.click()} disabled={uploading}><ImagePlus className="size-4" /></Tb>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        name="article-image"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) addImage(f)
          e.target.value = ""
        }}
      />
      <span className="mx-1 h-5 w-px bg-border" />
      <Tb label="Urungkan" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 className="size-4" /></Tb>
      <Tb label="Ulangi" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 className="size-4" /></Tb>
    </div>
  )
}

export function ArticleEditor({ article }: { article: ArticleData }) {
  const router = useRouter()
  const [title, setTitle] = useState(article.title)
  const [slug, setSlug] = useState(article.slug)
  const [slugTouched, setSlugTouched] = useState(false)
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState(false)

  const editor = useEditor({
    extensions: [
      ...articleExtensions,
      Placeholder.configure({ placeholder: "Tulis ceritanya…" }),
    ],
    content: article.bodyJson,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-article min-h-[50vh] max-w-none px-1 py-4 focus:outline-none",
      },
    },
  })

  async function save(status?: "draft" | "published") {
    if (!editor) return
    setSaving(true)
    setSaved(null)
    const r = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || "Artikel tanpa judul",
        slug: (slugTouched ? slug : slugify(title)) || slug,
        excerpt: excerpt.trim() || null,
        bodyJson: editor.getJSON(),
        ...(status ? { status } : {}),
      }),
    })
    setSaving(false)
    if (r.ok) {
      const j = await r.json().catch(() => ({}))
      if (j.slug) setSlug(j.slug)
      setSaved(status === "published" ? "Dipublish" : "Tersimpan")
      router.refresh()
      setTimeout(() => setSaved(null), 2500)
    }
  }

  async function remove() {
    const r = await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" })
    if (r.ok) router.push("/admin/artikel")
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <a href="/admin/artikel" className="text-sm text-muted-foreground hover:text-foreground">
          ‹ Artikel
        </a>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-muted-foreground">{saved}</span>}
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
            {article.status}
          </span>
          <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}>
            Simpan
          </Button>
          <Button size="sm" onClick={() => save(article.status === "published" ? "draft" : "published")} disabled={saving}>
            {article.status === "published" ? "Jadikan draft" : "Simpan & publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul artikel"
          className="border-0 bg-transparent px-1 text-2xl font-semibold outline-none placeholder:text-muted-foreground/50"
        />
        <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-muted-foreground">
          <span>/cerita/</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            className="min-w-40 flex-1 border-b border-dashed bg-transparent outline-none focus:border-solid"
          />
        </div>
      </div>

      <CoverRow articleId={article.id} cover={article.cover} />

      <div className="mt-4 grid gap-1.5">
        <Label className="px-1">Ringkasan (opsional)</Label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="Kalimat pembuka untuk daftar & pratinjau…"
          className="w-full resize-none rounded-md border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border">
        {editor && <Toolbar editor={editor} articleId={article.id} />}
        <EditorContent editor={editor} />
      </div>

      <div className="mt-8 border-t pt-4">
        {confirmDel ? (
          <Button variant="destructive" size="sm" onClick={remove}>
            Yakin hapus artikel ini?
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmDel(true)}>
            <Trash2 className="size-4" />
            Hapus artikel
          </Button>
        )}
      </div>
    </div>
  )
}
