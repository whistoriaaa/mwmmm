"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SiteSettings } from "@/lib/queries/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-4">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const [d, setD] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const setC = (k: keyof SiteSettings["contact"], v: string) =>
    setD((p) => ({ ...p, contact: { ...p.contact, [k]: v } }))

  async function save() {
    setSaving(true)
    setSaved(false)
    const r = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(d),
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
          <h1 className="text-xl font-semibold tracking-tight">Konten Situs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Teks & info yang tampil di seluruh situs.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-muted-foreground">Tersimpan</span>}
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <section className="grid gap-4 rounded-lg border p-4">
          <h2 className="text-sm font-medium">Umum</h2>
          <Row label="Tagline">
            <Input value={d.tagline} onChange={(e) => setD({ ...d, tagline: e.target.value })} />
          </Row>
          <label className="flex items-center gap-2 text-sm sm:col-start-2">
            <input
              type="checkbox"
              className="size-4"
              checked={d.availableForWork}
              onChange={(e) => setD({ ...d, availableForWork: e.target.checked })}
            />
            Tampilkan badge “Tersedia untuk proyek baru”
          </label>
        </section>

        <section className="grid gap-4 rounded-lg border p-4">
          <h2 className="text-sm font-medium">Kontak</h2>
          <Row label="Intro kontak">
            <textarea
              rows={2}
              className="w-full resize-none rounded-md border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={d.contactIntro}
              onChange={(e) => setD({ ...d, contactIntro: e.target.value })}
            />
          </Row>
          <Row label="Instagram">
            <div className="flex gap-2">
              <Input placeholder="@handle" value={d.contact.instagramHandle} onChange={(e) => setC("instagramHandle", e.target.value)} className="w-40" />
              <Input placeholder="https://instagram.com/…" value={d.contact.instagramUrl} onChange={(e) => setC("instagramUrl", e.target.value)} />
            </div>
          </Row>
          <Row label="WhatsApp">
            <div className="flex gap-2">
              <Input placeholder="+62…" value={d.contact.whatsappDisplay} onChange={(e) => setC("whatsappDisplay", e.target.value)} className="w-44" />
              <Input placeholder="https://wa.me/62…" value={d.contact.whatsappUrl} onChange={(e) => setC("whatsappUrl", e.target.value)} />
            </div>
          </Row>
          <Row label="Email">
            <Input value={d.contact.email} onChange={(e) => setC("email", e.target.value)} />
          </Row>
        </section>
      </div>
    </div>
  )
}
