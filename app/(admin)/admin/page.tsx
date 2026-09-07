import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function AdminHome() {
  const session = await auth()

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">CMS Shobiryne</h1>
      <p className="text-sm text-muted-foreground">
        Masuk sebagai <span className="font-medium text-foreground">{session?.user?.name}</span>.
        Modul konten (foto, artikel, CV) menyusul.
      </p>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/admin/login" })
        }}
      >
        <Button variant="outline" type="submit">
          Keluar
        </Button>
      </form>
    </main>
  )
}
