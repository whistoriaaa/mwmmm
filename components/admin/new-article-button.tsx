"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewArticleButton() {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [asking, setAsking] = useState(false)
  const [title, setTitle] = useState("")

  function create() {
    start(async () => {
      const r = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.id) router.push(`/admin/artikel/${j.id}`)
    })
  }

  if (asking) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          create()
        }}
        className="flex gap-2"
      >
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul artikel"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "…" : "Buat"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setAsking(false)}>
          Batal
        </Button>
      </form>
    )
  }

  return (
    <Button size="sm" onClick={() => setAsking(true)}>
      <Plus className="size-4" />
      Tulis baru
    </Button>
  )
}
