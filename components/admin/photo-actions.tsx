"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Star, Trash2 } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"

async function api(url: string, method: string, body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.ok
}

/** Aksi ringkas (highlight + hapus) untuk grid foto non-sortable. */
export function PhotoActions({ photoId, highlight }: { photoId: number; highlight: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <div className="flex items-center gap-0.5 rounded-md bg-background/85 p-0.5 backdrop-blur">
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label={highlight ? "Batalkan highlight" : "Jadikan highlight"}
        disabled={pending}
        onClick={() =>
          start(async () => {
            if (await api(`/api/admin/photos/${photoId}`, "PATCH", { highlight: !highlight }))
              router.refresh()
          })
        }
      >
        <Star className={cn("size-3.5", highlight && "fill-yellow-400 text-yellow-400")} />
      </Button>
      {confirmDel ? (
        <Button
          size="xs"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            start(async () => {
              if (await api(`/api/admin/photos/${photoId}`, "DELETE")) router.refresh()
            })
          }
        >
          Hapus
        </Button>
      ) : (
        <Button size="icon-xs" variant="ghost" aria-label="Hapus foto" onClick={() => setConfirmDel(true)}>
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
