import {
  LayoutDashboard,
  Images,
  FileText,
  IdCard,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  /** cocok sebagai prefix (untuk sub-halaman) */
  match?: (pathname: string) => boolean
}

export const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/admin" },
  { href: "/admin/foto", label: "Foto", icon: Images, match: (p) => p.startsWith("/admin/foto") },
  { href: "/admin/artikel", label: "Artikel", icon: FileText, match: (p) => p.startsWith("/admin/artikel") },
  { href: "/admin/cv", label: "CV", icon: IdCard, match: (p) => p.startsWith("/admin/cv") },
  { href: "/admin/situs", label: "Konten Situs", icon: SlidersHorizontal, match: (p) => p.startsWith("/admin/situs") },
]

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match ? item.match(pathname) : pathname === item.href
}
