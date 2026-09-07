import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Next 16 "proxy" (dulu "middleware"). Config Edge-safe tanpa provider DB.
// Callback `authorized` di auth.config yang mengatur redirect /admin.
const { auth } = NextAuth(authConfig)

export default auth(() => {
  // keputusan izin ditangani callback `authorized`
})

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
