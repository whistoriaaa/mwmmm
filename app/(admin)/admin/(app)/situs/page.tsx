import { getSettings } from "@/lib/queries/settings"
import { SettingsForm } from "@/components/admin/settings-form"

export const metadata = { title: "Konten Situs" }
export const dynamic = "force-dynamic"

export default async function SitusPage() {
  const settings = await getSettings()
  return <SettingsForm initial={settings} />
}
