"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LogOut } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NAV, isActive } from "./nav"
import { logoutAction } from "@/lib/auth/actions"

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {NAV.map((item) => {
        const active = isActive(item, pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <div className="grid size-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
        S
      </div>
      <span className="text-sm font-semibold">CMS Shobiryne</span>
    </div>
  )
}

function UserFooter({ name }: { name: string }) {
  return (
    <form action={logoutAction} className="border-t p-2">
      <div className="px-2 py-1.5 text-xs text-muted-foreground">{name}</div>
      <Button variant="ghost" size="sm" type="submit" className="w-full justify-start gap-2">
        <LogOut className="size-4" />
        Keluar
      </Button>
    </form>
  )
}

export function AdminShell({
  userName,
  children,
}: {
  userName: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>
        <UserFooter name={userName} />
      </aside>

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header mobile */}
        <header className="flex h-14 items-center gap-2 border-b px-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigasi</SheetTitle>
              <Brand />
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
              <UserFooter name={userName} />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">CMS Shobiryne</span>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
