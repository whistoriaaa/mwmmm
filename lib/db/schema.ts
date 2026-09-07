/**
 * Skema database CMS (SQLite / libSQL via Drizzle).
 *
 * Konvensi:
 * - PK integer autoincrement untuk relasi internal
 * - `slug` unik untuk apa pun yang muncul di URL
 * - waktu disimpan sebagai epoch-ms (mode "timestamp_ms")
 * - `storageDir` = sub-folder objek di S3 (di bawah S3_PREFIX="wishtoria")
 *   file varian ada di `${storageDir}/${width}.${fmt}`
 */
import { sql } from "drizzle-orm"
import { sqliteTable, integer, text, index, unique } from "drizzle-orm/sqlite-core"

export type PhotoVariant = { w: number; fmt: "avif" | "webp"; bytes?: number }

export type CvData = {
  headline?: string
  summary?: string
  location?: string
  email?: string
  phone?: string
  links?: { label: string; url: string }[]
  experience?: { role: string; org: string; period: string; detail?: string }[]
  education?: { title: string; org: string; period: string }[]
  skills?: string[]
  services?: string[]
}

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date())

/* ─────────────────────────── Auth ─────────────────────────── */

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: createdAt(),
})

/** Jejak percobaan login untuk rate limiter. */
export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    scope: text("scope").notNull(), // mis. ip, atau `${ip}|${username}`
    success: integer("success", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("login_attempts_scope_time").on(t.scope, t.createdAt)],
)

/* ─────────────────────── Taksonomi foto ───────────────────── */

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
})

export const subcategories = sqliteTable(
  "subcategories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [unique("subcat_category_slug").on(t.categoryId, t.slug)],
)

/** "Sesi" / album / folder (Aira, Fendra & Wife, Trip Kondang Merak). */
export const sessions = sqliteTable(
  "sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    subcategoryId: integer("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null",
    }),
    month: text("month"), // "YYYY-MM"
    description: text("description"),
    coverPhotoId: integer("cover_photo_id"), // ref lunak ke photos.id (hindari siklus FK)
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("sessions_category").on(t.categoryId, t.subcategoryId)],
)

export const photos = sqliteTable(
  "photos",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sessionId: integer("session_id").references(() => sessions.id, { onDelete: "cascade" }), // null = foto lepas
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    subcategoryId: integer("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null",
    }),
    storageDir: text("storage_dir").notNull(), // "portrait/aira/kx7f2a"
    origFormat: text("orig_format").notNull(), // "jpg"
    /** asal file saat migrasi dari public/ — untuk idempotensi & jejak */
    sourcePath: text("source_path"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    variants: text("variants", { mode: "json" }).$type<PhotoVariant[]>().notNull(),
    blurDataUrl: text("blur_data_url").notNull(),
    alt: text("alt"),
    highlight: integer("highlight", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("photos_session").on(t.sessionId),
    index("photos_category").on(t.categoryId, t.subcategoryId),
    unique("photos_source_path").on(t.sourcePath),
  ],
)

/* ───────────────────── Artikel / storytelling ─────────────── */

export const articles = sqliteTable(
  "articles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    coverStorageDir: text("cover_storage_dir"),
    coverWidth: integer("cover_width"),
    coverHeight: integer("cover_height"),
    coverBlurDataUrl: text("cover_blur_data_url"),
    coverVariants: text("cover_variants", { mode: "json" }).$type<PhotoVariant[]>(),
    bodyJson: text("body_json", { mode: "json" }).notNull(), // dokumen Tiptap
    bodyHtml: text("body_html").notNull().default(""), // hasil render untuk tampilan
    readingMinutes: integer("reading_minutes").notNull().default(1),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    publishedAt: integer("published_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("articles_status_pub").on(t.status, t.publishedAt)],
)

/** Gambar yang di-upload di dalam body artikel. */
export const articleAssets = sqliteTable(
  "article_assets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    storageDir: text("storage_dir").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    blurDataUrl: text("blur_data_url").notNull(),
    variants: text("variants", { mode: "json" }).$type<PhotoVariant[]>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("article_assets_article").on(t.articleId)],
)

/* ─────────────────────────── CV ───────────────────────────── */

/** Satu baris (id = 1). */
export const cv = sqliteTable("cv", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  data: text("data", { mode: "json" }).$type<CvData>().notNull(),
  pdfStorageKey: text("pdf_storage_key"),
  updatedAt: updatedAt(),
})

/* ───────────── Konten situs yang bisa diedit (key-value) ──── */

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).notNull(),
  updatedAt: updatedAt(),
})

export const schema = {
  users,
  loginAttempts,
  categories,
  subcategories,
  sessions,
  photos,
  articles,
  articleAssets,
  cv,
  settings,
}

// Bikin `sql` terpakai (untuk defaults mentah bila perlu nanti).
export const _sqlTag = sql
