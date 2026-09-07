import Link from "next/link"
import { Images, FileText, IdCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
  { href: "/admin/foto", label: "Foto", icon: Images, desc: "Kelola sesi & galeri foto" },
  { href: "/admin/artikel", label: "Artikel", icon: FileText, desc: "Tulisan storytelling di menu Tentang" },
  { href: "/admin/cv", label: "CV", icon: IdCard, desc: "Curriculum vitae di menu Tentang" },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Kelola seluruh isi situs dari sini.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <c.icon className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">{c.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.desc}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
