"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeletePhotoButton({ photoId }: { photoId: number }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  function remove() {
    start(async () => {
      const r = await fetch(`/api/admin/photos/${photoId}`, { method: "DELETE" })
      if (r.ok) router.refresh()
      setConfirm(false)
    })
  }

  if (confirm) {
    return (
      <div className="flex gap-1">
        <Button size="xs" variant="destructive" onClick={remove} disabled={pending}>
          {pending ? "…" : "Hapus"}
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setConfirm(false)}>
          Batal
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      aria-label="Hapus foto"
      onClick={() => setConfirm(true)}
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
