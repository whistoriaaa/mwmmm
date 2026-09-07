"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Star, Trash2, ImageDown } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Picture, type PicturePhoto } from "@/components/picture"

export interface GridPhoto extends PicturePhoto {
  id: number
  highlight: boolean
}

async function api(url: string, method: string, body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.ok
}

function Cell({
  photo,
  isCover,
  onChanged,
  onSetCover,
}: {
  photo: GridPhoto
  isCover: boolean
  onChanged: () => void
  onSetCover: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  })
  const [pending, start] = useTransition()
  const [confirmDel, setConfirmDel] = useState(false)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-muted",
        isDragging && "z-10 opacity-70 ring-2 ring-primary",
      )}
    >
      <div className="aspect-square">
        <Picture photo={photo} sizes="(min-width:1024px) 220px, 45vw" className="h-full w-full" />
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Geser urutan"
        className="absolute left-1.5 top-1.5 cursor-grab touch-none rounded-md bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {photo.highlight && (
        <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1 backdrop-blur">
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
        </span>
      )}
      {isCover && (
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
          Sampul
        </span>
      )}

      <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-0.5 rounded-md bg-background/85 p-0.5 backdrop-blur">
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={photo.highlight ? "Batalkan highlight" : "Jadikan highlight"}
            disabled={pending}
            onClick={() =>
              start(async () => {
                if (
                  await api(`/api/admin/photos/${photo.id}`, "PATCH", {
                    highlight: !photo.highlight,
                  })
                )
                  onChanged()
              })
            }
          >
            <Star className={cn("size-3.5", photo.highlight && "fill-yellow-400 text-yellow-400")} />
          </Button>
          {!isCover && (
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Jadikan sampul sesi"
              disabled={pending}
              onClick={() => start(async () => onSetCover())}
            >
              <ImageDown className="size-3.5" />
            </Button>
          )}
          {confirmDel ? (
            <Button
              size="xs"
              variant="destructive"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  if (await api(`/api/admin/photos/${photo.id}`, "DELETE")) onChanged()
                })
              }
            >
              Hapus
            </Button>
          ) : (
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Hapus foto"
              onClick={() => setConfirmDel(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function SessionPhotoGrid({
  sessionId,
  photos: initial,
  coverPhotoId,
}: {
  sessionId: number
  photos: GridPhoto[]
  coverPhotoId: number | null
}) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [cover, setCover] = useState(coverPhotoId)
  const [savingOrder, setSavingOrder] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  async function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const next = arrayMove(
      items,
      items.findIndex((p) => p.id === active.id),
      items.findIndex((p) => p.id === over.id),
    )
    setItems(next)
    setSavingOrder(true)
    await fetch("/api/admin/photos/reorder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((p) => p.id) }),
    })
    setSavingOrder(false)
  }

  async function setSessionCover(photoId: number) {
    if (await api(`/api/admin/sessions/${sessionId}`, "PATCH", { coverPhotoId: photoId })) {
      setCover(photoId)
      router.refresh()
    }
  }

  return (
    <div>
      {savingOrder && <p className="mb-2 text-xs text-muted-foreground">Menyimpan urutan…</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <Cell
                key={p.id}
                photo={p}
                isCover={cover === p.id}
                onChanged={() => router.refresh()}
                onSetCover={() => setSessionCover(p.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
