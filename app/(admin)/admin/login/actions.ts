"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { checkLoginRate, recordLoginAttempt } from "@/lib/auth/rate-limit"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const nextRaw = String(formData.get("next") ?? "/admin")
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin"

  if (!username || !password) return { error: "Username dan password wajib diisi." }

  const h = await headers()
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim()

  const rate = await checkLoginRate(ip, username)
  if (rate.blocked) {
    const mins = Math.ceil((rate.retryAfterSec ?? 600) / 60)
    return { error: `Terlalu banyak percobaan gagal. Coba lagi dalam ~${mins} menit.` }
  }

  let ok = false
  try {
    await signIn("credentials", { username, password, redirect: false })
    ok = true
  } catch (e) {
    if (e instanceof AuthError) ok = false
    else throw e
  }

  await recordLoginAttempt(ip, username, ok)
  if (!ok) return { error: "Username atau password salah." }

  redirect(next)
}
