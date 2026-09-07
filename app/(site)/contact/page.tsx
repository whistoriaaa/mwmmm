import { getSettings } from "@/lib/queries/settings"
import ContactSection from "@/components/site/contact/contact-section"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactSection settings={settings} />
}
