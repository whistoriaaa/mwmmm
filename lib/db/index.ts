/**
 * Koneksi database (libSQL / SQLite) + Drizzle.
 * SERVER-ONLY.
 */
import "server-only"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

const url = process.env.DATABASE_URL ?? "file:./.data/cms.db"

const client = createClient({ url })

export const db = drizzle(client, { schema })
export { schema }
export type DB = typeof db
