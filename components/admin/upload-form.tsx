"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "cn"

interface Cat {
  id: number
  slug: string
  label: string
  subs: { id: number; slug: string; label: string }[]
}
interface Sess {
  id: number
  title: string
  categoryId: number
  month: string | null
  photoCount: number
}

const selectCls =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"

type Mode = "new" | "existing" | "loose"
type Result = { name: string; ok: boolean; error?: string }

export function UploadForm({ categories, sessions }: { categories: Cat[]; sessions: Sess[] }) {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [mode, setMode] = useState<Mode>("new")
  const [sessionId, setSessionId] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [month, setMonth] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [results, setResults] = useState<Result[]>([])

  const cat = categories.find((c) => String(c.id) === categoryId)
  const subs = cat?.subs ?? []
  const catSessions = useMemo(
    () => sessions.filter((s) => String(s.categoryId) === categoryId),
    [sessions, categoryId],
  )

  const canSubmit =
    !!categoryId &&
    files.length > 0 &&
    !busy &&
    (mode !== "new" || newTitle.trim().length > 0) &&
    (mode !== "existing" || !!sessionId)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setBusy(true)
    setResults([])
    setProgress({ done: 0, total: files.length })

    let liveSessionId: number | null = mode === "existing" ? Number(sessionId) : null
    const acc: Result[] = []

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const fd = new FormData()
      fd.set("file", f)
      fd.set("categoryId", categoryId)
      if (subcategoryId) fd.set("subcategoryId", subcategoryId)
      if (month) fd.set("month", month)
      if (liveSessionId) fd.set("sessionId", String(liveSessionId))
      else if (mode === "new") fd.set("newSessionTitle", newTitle.trim())

      try {
        const r = await fetch("/api/admin/photos", { method: "POST", body: fd })
        const j = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(j.error ?? `HTTP ${r.status}`)
        if (j.sessionId && !liveSessionId) liveSessionId = j.sessionId
        acc.push({ name: f.name, ok: true })
      } catch (err) {
        acc.push({ name: f.name, ok: false, error: err instanceof Error ? err.message : "gagal" })
      }
      setProgress({ done: i + 1, total: files.length })
      setResults([...acc])
    }

    setBusy(false)
    router.refresh()
    if (liveSessionId && acc.some((x) => x.ok)) {
      router.push(`/admin/foto/${liveSessionId}`)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-5">
      <div className="grid gap-1.5">
        <Label>Kategori</Label>
        <select
          className={selectCls}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value)
            setSubcategoryId("")
            setSessionId("")
          }}
          required
        >
          <option value="">— pilih —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {subs.length > 0 && (
        <div className="grid gap-1.5">
          <Label>Sub-kategori</Label>
          <select
            className={selectCls}
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
          >
            <option value="">— tidak ada —</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-1.5">
        <Label>Folder / Sesi</Label>
        <div className="flex flex-wrap gap-2">
          {(["new", "existing", "loose"] as Mode[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm",
                mode === m ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground",
              )}
            >
              {m === "new" ? "Sesi baru" : m === "existing" ? "Sesi yang ada" : "Foto lepas"}
            </button>
          ))}
        </div>

        {mode === "new" && (
          <Input
            className="mt-1"
            placeholder="Nama sesi (mis. Aira, Fendra & Wife, Trip Kondang Merak)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        )}
        {mode === "existing" && (
          <select
            className={cn(selectCls, "mt-1")}
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            disabled={!categoryId}
          >
            <option value="">{categoryId ? "— pilih sesi —" : "pilih kategori dulu"}</option>
            {catSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.photoCount} foto{s.month ? ` · ${s.month}` : ""})
              </option>
            ))}
          </select>
        )}
        {mode === "loose" && (
          <p className="text-xs text-muted-foreground">
            Foto akan masuk sebagai “foto lepas” di kategori terpilih (tanpa sesi).
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label>Bulan (opsional)</Label>
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-44" />
      </div>

      <div className="grid gap-1.5">
        <Label>Foto</Label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm"
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground">{files.length} file dipilih</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!canSubmit}>
          {busy ? "Mengunggah…" : "Unggah"}
        </Button>
        {progress && (
          <span className="text-sm text-muted-foreground">
            {progress.done}/{progress.total}
          </span>
        )}
      </div>

      {results.length > 0 && (
        <ul className="grid gap-1 text-xs">
          {results.map((r, i) => (
            <li key={i} className={r.ok ? "text-muted-foreground" : "text-destructive"}>
              {r.ok ? "✓" : "✗"} {r.name}
              {r.error ? ` — ${r.error}` : ""}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
