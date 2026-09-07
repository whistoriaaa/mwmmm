import type { PhotoVariant } from "@/lib/db/schema"
import { cn } from "cn"

export interface ThumbPhoto {
  storageDir: string
  width: number
  height: number
  variants: PhotoVariant[]
  blurDataUrl: string
  alt?: string | null
}

const url = (dir: string, w: number, fmt: string) => `/api/img/${dir}/${w}.${fmt}`

/** Tampilkan foto dari varian pra-generate (AVIF→WebP), blur saat memuat. */
export function PhotoThumb({
  photo,
  sizes = "(min-width: 768px) 220px, 45vw",
  className,
}: {
  photo: ThumbPhoto
  sizes?: string
  className?: string
}) {
  const avif = photo.variants.filter((v) => v.fmt === "avif").sort((a, b) => a.w - b.w)
  const webp = photo.variants.filter((v) => v.fmt === "webp").sort((a, b) => a.w - b.w)
  const set = (list: PhotoVariant[]) =>
    list.map((v) => `${url(photo.storageDir, v.w, v.fmt)} ${v.w}w`).join(", ")
  const fallback = webp[0] ?? avif[0]

  return (
    <picture>
      {avif.length > 0 && <source type="image/avif" srcSet={set(avif)} sizes={sizes} />}
      {webp.length > 0 && <source type="image/webp" srcSet={set(webp)} sizes={sizes} />}
      <img
        src={fallback ? url(photo.storageDir, fallback.w, fallback.fmt) : undefined}
        width={photo.width}
        height={photo.height}
        alt={photo.alt ?? ""}
        loading="lazy"
        decoding="async"
        className={cn("block h-full w-full object-cover", className)}
        style={{
          backgroundImage: `url("${photo.blurDataUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  )
}
