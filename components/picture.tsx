import { pictureSources } from "@/lib/img"
import type { PhotoVariant } from "@/lib/db/schema"

export interface PicturePhoto {
  storageDir: string
  variants: PhotoVariant[]
  blurDataUrl: string
  width: number
  height: number
  alt?: string | null
}

/**
 * <picture> dari varian pra-generate (AVIF→WebP) + blur placeholder saat
 * memuat. Satu komponen untuk semua foto CMS — situs publik & /admin.
 */
export function Picture({
  photo,
  sizes,
  className,
  style,
  priority = false,
  fit = "cover",
  alt,
}: {
  photo: PicturePhoto
  sizes: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  fit?: "cover" | "contain"
  alt?: string
}) {
  const s = pictureSources(photo.storageDir, photo.variants)
  return (
    <picture>
      {s.avif && <source type="image/avif" srcSet={s.avif} sizes={sizes} />}
      {s.webp && <source type="image/webp" srcSet={s.webp} sizes={sizes} />}
      <img
        src={s.fallback}
        width={photo.width}
        height={photo.height}
        alt={alt ?? photo.alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={{
          display: "block",
          objectFit: fit,
          backgroundImage: `url("${photo.blurDataUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...style,
        }}
      />
    </picture>
  )
}
