import { defineConfig } from "drizzle-kit"

// drizzle-kit tidak baca .env.local otomatis.
try {
  process.loadEnvFile(".env.local")
} catch {
  /* abaikan bila tak ada */
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "turso", // libSQL — juga menangani file lokal "file:./.data/cms.db"
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./.data/cms.db",
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
})
