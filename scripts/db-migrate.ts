/**
 * Terapkan migrasi Drizzle ke database.
 *   npm run db:migrate
 */
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { createClient } from "@libsql/client"

const url = process.env.DATABASE_URL ?? "file:./.data/cms.db"
const db = drizzle(createClient({ url }))

await migrate(db, { migrationsFolder: "./lib/db/migrations" })
console.log(`Migrasi diterapkan ke ${url}`)
process.exit(0)
