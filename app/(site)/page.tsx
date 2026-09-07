import Parallax from "@/components/Parallax"
import BioBrief from "@/components/home/BioBrief"
import RecentWorks from "@/components/home/RecentWorks"
import { getRecentWorks, getSiteCatalog } from "@/lib/queries/site"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [recent, { categories }] = await Promise.all([getRecentWorks(), getSiteCatalog()])
  const subLabels = Object.fromEntries(
    categories.flatMap((c) => c.subs).map((s) => [s.slug, s.label]),
  )

  return (
    <>
      <Parallax />
      <BioBrief />
      <RecentWorks photos={recent} subLabels={subLabels} />
    </>
  )
}
