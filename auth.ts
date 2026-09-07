import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import { authConfig } from "./auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { verifyPassword } from "@/lib/auth/password"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const username = String(raw?.username ?? "").trim().toLowerCase()
        const password = String(raw?.password ?? "")
        if (!username || !password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.username, username),
        })
        if (!user) return null

        const ok = await verifyPassword(password, user.passwordHash)
        if (!ok) return null

        return {
          id: String(user.id),
          name: user.name ?? user.username,
          username: user.username,
        }
      },
    }),
  ],
})
