import "server-only"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

/** Untuk route handler /api/admin/*. Kembalikan user, atau Response 401. */
export async function requireAdmin(): Promise<
  { user: { name?: string | null; username?: string } } | { deny: NextResponse }
> {
  const session = await auth()
  if (!session?.user) {
    return { deny: NextResponse.json({ error: "unauthorized" }, { status: 401 }) }
  }
  return { user: session.user }
}
