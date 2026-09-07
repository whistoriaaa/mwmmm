import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { generateHTML } from "@tiptap/html"
import type { AnyExtension, JSONContent } from "@tiptap/core"

/** Ekstensi untuk render — dipakai editor & saat generate HTML publik. */
export const articleExtensions: AnyExtension[] = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: false, // pakai konfigurasi Link di bawah
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
  }),
  Image.configure({ inline: false }),
]

export const emptyDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] }

/** Render dokumen Tiptap → HTML (server-side, aman: dari JSON terstruktur). */
export function renderArticleHtml(doc: JSONContent): string {
  try {
    return generateHTML(doc, articleExtensions)
  } catch {
    return ""
  }
}

/** Ambil teks polos dari dokumen (untuk excerpt / estimasi baca). */
export function docToText(doc: JSONContent): string {
  const parts: string[] = []
  const walk = (n: JSONContent) => {
    if (n.type === "text" && n.text) parts.push(n.text)
    n.content?.forEach(walk)
  }
  walk(doc)
  return parts.join(" ").replace(/\s+/g, " ").trim()
}

export function readingMinutes(doc: JSONContent): number {
  const words = docToText(doc).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
