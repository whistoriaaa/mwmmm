"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import type { CvData } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ta =
  "w-full resize-y rounded-md border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

type ExpItem = NonNullable<CvData["experience"]>[number]
type EduItem = NonNullable<CvData["education"]>[number]
type LinkItem = NonNullable<CvData["links"]>[number]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-medium">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  )
}

export function CvForm({ initial }: { initial: CvData }) {
  const router = useRouter()
  const [d, setD] = useState<CvData>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof CvData>(k: K, v: CvData[K]) => setD((p) => ({ ...p, [k]: v }))

  const addExp = () =>
    set("experience", [...(d.experience ?? []), { role: "", org: "", period: "", detail: "" }])
  const addEdu = () => set("education", [...(d.education ?? []), { title: "", org: "", period: "" }])
  const addLink = () => set("links", [...(d.links ?? []), { label: "", url: "" }])

  const upExp = (i: number, patch: Partial<ExpItem>) =>
    set("experience", (d.experience ?? []).map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const upEdu = (i: number, patch: Partial<EduItem>) =>
    set("education", (d.education ?? []).map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const upLink = (i: number, patch: Partial<LinkItem>) =>
    set("links", (d.links ?? []).map((x, j) => (j === i ? { ...x, ...patch } : x)))

  async function save() {
    setSaving(true)
    setSaved(false)
    const r = await fetch("/api/admin/cv", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...d,
        skills: (d.skills ?? []).join("\n"),
        services: (d.services ?? []).join("\n"),
      }),
    })
    setSaving(false)
    if (r.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">CV</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tampil di halaman /cv & tautan di Tentang.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-muted-foreground">Tersimpan</span>}
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <Section title="Ringkasan">
          <div className="grid gap-1.5">
            <Label>Headline</Label>
            <Input
              value={d.headline ?? ""}
              onChange={(e) => set("headline", e.target.value)}
              placeholder="Photographer & Videographer"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Deskripsi singkat</Label>
            <textarea
              rows={4}
              className={ta}
              value={d.summary ?? ""}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Kontak">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label>Lokasi</Label>
              <Input value={d.location ?? ""} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input value={d.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Telepon</Label>
              <Input value={d.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tautan</Label>
            {(d.links ?? []).map((l, i) => (
              <div key={i} className="flex gap-2">
                <Input placeholder="Instagram" value={l.label} onChange={(e) => upLink(i, { label: e.target.value })} className="w-40" />
                <Input placeholder="https://…" value={l.url} onChange={(e) => upLink(i, { url: e.target.value })} />
                <Button variant="ghost" size="icon" onClick={() => set("links", (d.links ?? []).filter((_, j) => j !== i))}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLink} className="w-fit">
              <Plus className="size-4" /> Tautan
            </Button>
          </div>
        </Section>

        <Section title="Pengalaman">
          {(d.experience ?? []).map((x, i) => (
            <div key={i} className="grid gap-2 rounded-md border p-3">
              <div className="flex gap-2">
                <Input placeholder="Peran" value={x.role} onChange={(e) => upExp(i, { role: e.target.value })} />
                <Input placeholder="Periode (2019 – kini)" value={x.period} onChange={(e) => upExp(i, { period: e.target.value })} className="w-48" />
                <Button variant="ghost" size="icon" onClick={() => set("experience", (d.experience ?? []).filter((_, j) => j !== i))}>
                  <X className="size-4" />
                </Button>
              </div>
              <Input placeholder="Organisasi / klien" value={x.org} onChange={(e) => upExp(i, { org: e.target.value })} />
              <textarea rows={2} className={ta} placeholder="Detail (opsional)" value={x.detail ?? ""} onChange={(e) => upExp(i, { detail: e.target.value })} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExp} className="w-fit">
            <Plus className="size-4" /> Pengalaman
          </Button>
        </Section>

        <Section title="Pendidikan">
          {(d.education ?? []).map((x, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="Jurusan / gelar" value={x.title} onChange={(e) => upEdu(i, { title: e.target.value })} />
              <Input placeholder="Institusi" value={x.org} onChange={(e) => upEdu(i, { org: e.target.value })} />
              <Input placeholder="Tahun" value={x.period} onChange={(e) => upEdu(i, { period: e.target.value })} className="w-28" />
              <Button variant="ghost" size="icon" onClick={() => set("education", (d.education ?? []).filter((_, j) => j !== i))}>
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEdu} className="w-fit">
            <Plus className="size-4" /> Pendidikan
          </Button>
        </Section>

        <Section title="Keahlian & Layanan">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Keahlian (satu per baris)</Label>
              <textarea
                rows={6}
                className={ta}
                value={(d.skills ?? []).join("\n")}
                onChange={(e) => set("skills", e.target.value.split("\n"))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Layanan (satu per baris)</Label>
              <textarea
                rows={6}
                className={ta}
                value={(d.services ?? []).join("\n")}
                onChange={(e) => set("services", e.target.value.split("\n"))}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
