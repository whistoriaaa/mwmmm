import { pictureSources } from "@/lib/img"
import type { SitePhoto } from "@/lib/queries/site-types"

type Src = Pick<SitePhoto, "storageDir" | "variants" | "blurDataUrl" | "width" | "height">

/**
 * <picture> dari varian pra-generate (AVIF→WebP), blur placeholder saat
 * memuat. Dipakai di seluruh situs publik untuk foto dari CMS.
 */
export function SitePicture({
  photo,
  sizes,
  className,
  style,
  priority = false,
  fit = "cover",
  alt = "",
}: {
  photo: Src
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
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={{
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
