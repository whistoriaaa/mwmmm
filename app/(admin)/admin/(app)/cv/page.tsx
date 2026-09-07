import { getCv } from "@/lib/queries/cv"
import { CvForm } from "@/components/admin/cv-form"

export const metadata = { title: "CV" }
export const dynamic = "force-dynamic"

export default async function CvAdminPage() {
  const data = await getCv()
  return <CvForm initial={data} />
}
