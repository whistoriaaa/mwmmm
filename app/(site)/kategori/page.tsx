import { getSiteCatalog } from "@/lib/queries/site"
import { KategoriBrowser } from "@/components/site/kategori/kategori-browser"

export const dynamic = "force-dynamic"

export default async function KategoriPage() {
  const { categories, photos } = await getSiteCatalog()
  return <KategoriBrowser categories={categories} photos={photos} />
}
