import type { NextAuthConfig } from "next-auth"

/**
 * Konfigurasi Auth.js yang aman untuk Edge (dipakai middleware).
 * Tanpa provider yang menyentuh DB/bcrypt — itu ditambah di auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const loggedIn = !!auth?.user
      const { pathname, search } = request.nextUrl
      const onLogin = pathname === "/admin/login"
      const onAdmin = pathname === "/admin" || pathname.startsWith("/admin/")

      if (onLogin) {
        if (loggedIn) return Response.redirect(new URL("/admin", request.nextUrl))
        return true
      }
      if (onAdmin) {
        if (loggedIn) return true
        const url = new URL("/admin/login", request.nextUrl)
        if (pathname !== "/admin") url.searchParams.set("next", pathname + search)
        return Response.redirect(url)
      }
      return true
    },
    jwt({ token, user }) {
      if (user) token.username = (user as { username?: string }).username
      return token
    },
    session({ session, token }) {
      if (token.username) session.user.username = token.username as string
      return session
    },
  },
} satisfies NextAuthConfig
