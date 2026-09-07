"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "cn"

interface Cat {
  id: number
  label: string
  subs: { id: number; label: string }[]
}
interface SessionInfo {
  id: number
  title: string
  month: string | null
  categoryId: number
  subcategoryId: number | null
  published: boolean
}

const selectCls =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function SessionSettings({
  session,
  categories,
}: {
  session: SessionInfo
  categories: Cat[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(session.title)
  const [month, setMonth] = useState(session.month ?? "")
  const [categoryId, setCategoryId] = useState(String(session.categoryId))
  const [subcategoryId, setSubcategoryId] = useState(
    session.subcategoryId ? String(session.subcategoryId) : "",
  )
  const [published, setPublished] = useState(session.published)
  const [busy, setBusy] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const subs = categories.find((c) => String(c.id) === categoryId)?.subs ?? []

  async function save() {
    setBusy(true)
    setErr(null)
    const r = await fetch(`/api/admin/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        month: month || null,
        categoryId: Number(categoryId),
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
        published,
      }),
    })
    setBusy(false)
    if (r.ok) {
      setOpen(false)
      router.refresh()
    } else {
      const j = await r.json().catch(() => ({}))
      setErr(j.error ?? "Gagal menyimpan")
    }
  }

  async function remove() {
    setBusy(true)
    const r = await fetch(`/api/admin/sessions/${session.id}`, { method: "DELETE" })
    if (r.ok) router.push("/admin/foto")
    else setBusy(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Settings2 className="size-4" />
        Pengaturan
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pengaturan sesi</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Nama sesi</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Bulan</Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-44"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Kategori</Label>
            <select
              className={selectCls}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                setSubcategoryId("")
              }}
            >
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="size-4"
            />
            Tampilkan di situs (publish)
          </label>

          {err && <p className="text-sm text-destructive">{err}</p>}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <div>
            {confirmDel ? (
              <Button variant="destructive" size="sm" disabled={busy} onClick={remove}>
                Yakin hapus sesi + semua fotonya?
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => setConfirmDel(true)}
              >
                <Trash2 className="size-4" />
                Hapus sesi
              </Button>
            )}
          </div>
          <Button onClick={save} disabled={busy || !title.trim()} className={cn(busy && "opacity-70")}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
