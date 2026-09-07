import "server-only"
import { and, eq, gt, lt, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { loginAttempts } from "@/lib/db/schema"

/**
 * Rate limiter login berbasis tabel `login_attempts`.
 * - per-IP: maks 10 gagal / 10 menit
 * - per IP+username: maks 5 gagal / 10 menit
 * Setelah lewat ambang → tolak selama window masih berjalan.
 */
const WINDOW_MS = 10 * 60_000
const MAX_PER_IP = 10
const MAX_PER_IP_USER = 5

function since() {
  return new Date(Date.now() - WINDOW_MS)
}

async function countFails(scope: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.scope, scope),
        eq(loginAttempts.success, false),
        gt(loginAttempts.createdAt, since()),
      ),
    )
  return row?.n ?? 0
}

export interface RateResult {
  blocked: boolean
  retryAfterSec?: number
}

/** Cek sebelum mencoba login. */
export async function checkLoginRate(ip: string, username: string): Promise<RateResult> {
  // bersihkan jejak lama sesekali (murah di SQLite volume rendah)
  await db
    .delete(loginAttempts)
    .where(lt(loginAttempts.createdAt, new Date(Date.now() - 86_400_000)))
    .catch(() => {})

  const [ipFails, userFails] = await Promise.all([
    countFails(`ip:${ip}`),
    countFails(`ipuser:${ip}|${username.toLowerCase()}`),
  ])

  if (ipFails >= MAX_PER_IP || userFails >= MAX_PER_IP_USER) {
    return { blocked: true, retryAfterSec: Math.ceil(WINDOW_MS / 1000) }
  }
  return { blocked: false }
}

/** Catat hasil percobaan login. */
export async function recordLoginAttempt(ip: string, username: string, success: boolean): Promise<void> {
  const rows = [
    { scope: `ip:${ip}`, success },
    { scope: `ipuser:${ip}|${username.toLowerCase()}`, success },
  ]
  await db.insert(loginAttempts).values(rows)
  // sukses → hapus kegagalan sebelumnya untuk kombinasi ini
  if (success) {
    await db
      .delete(loginAttempts)
      .where(
        and(
          eq(loginAttempts.scope, `ipuser:${ip}|${username.toLowerCase()}`),
          eq(loginAttempts.success, false),
        ),
      )
  }
}
