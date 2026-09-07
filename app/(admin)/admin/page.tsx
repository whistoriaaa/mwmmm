import { Button } from "@/components/ui/button"

export default function AdminHome() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">CMS Shobiryne</h1>
      <p className="text-sm text-muted-foreground">
        Fondasi CMS siap. Autentikasi & modul konten menyusul.
      </p>
      <Button>Tombol shadcn — cek tema</Button>
    </main>
  )
}
