# Shobiryne — portfolio + CMS

Situs portfolio fotografi (Next.js 16, App Router) dengan CMS bawaan di `/admin`
untuk mengelola foto, artikel, CV, dan konten situs.

## Menjalankan (lokal)

```bash
npm install
cp .env.example .env.local     # isi kredensial (lihat di bawah)
npm run db:migrate             # buat / update skema SQLite
npm run db:seed                # akun admin + kategori awal
npm run dev                    # http://localhost:3000  ·  CMS: /admin
```

Login CMS default: `admin` / nilai `ADMIN_PASSWORD` di `.env.local`.
Buat hash password lain: `npm run auth:hash -- 'passwordbaru'` → isi `ADMIN_PASSWORD_HASH`.

## Skrip

| Perintah | Fungsi |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:generate` | buat file migrasi Drizzle dari `lib/db/schema.ts` |
| `npm run db:migrate` | terapkan migrasi ke `.data/cms.db` |
| `npm run db:seed` | seed admin + taksonomi |
| `npm run db:studio` | Drizzle Studio (GUI DB) |
| `npm run auth:hash -- '…'` | cetak bcrypt hash |
| `npm run storage:check` | tes koneksi object storage |
| `npm run migrate:photos` | migrasi `public/photos` → object storage + DB (idempoten) |

## Struktur

```
app/
  (site)/          Situs publik — root layout + globals.css sendiri
    page.tsx           beranda (hero + Timeline dari DB)
    kategori/          galeri berbasis kartu (dari DB)
    cerita/           daftar + halaman artikel
    cv/               CV
    about/  contact/
  (admin)/         CMS — root layout + admin.css (shadcn) sendiri, TERISOLASI
    admin/login/      login + rate limiter
    admin/(app)/      area login: dashboard, foto, artikel, cv, situs
  api/
    auth/             Auth.js
    img/[...path]/     penyaji objek storage (bucket private)
    admin/            endpoint mutasi CMS (foto, sesi, artikel, cv, settings)
components/
  site/            komponen situs publik (Navbar, kategori/, home/, about/, …)
  admin/           komponen CMS
  ui/              shadcn
lib/
  db/              schema (Drizzle) + koneksi libSQL + migrations
  storage/         s3 · images (sharp) · photos · articles
  auth/            password · rate-limit · guard · server actions
  queries/         pembacaan data (catalog, site, articles, cv, settings)
  id · img · tiptap · revalidate · utils
scripts/           perkakas CLI (migrasi, seed, hash, cek storage)
auth.ts · auth.config.ts · proxy.ts · drizzle.config.ts · next.config.ts
```

**Isolasi situs ↔ CMS:** dua *root layout* lewat route group. Halaman `/admin`
tidak memuat CSS/font situs, dan sebaliknya — tema shadcn tak pernah bocor ke situs.

## Environment (`.env.local`)

| Var | Keterangan |
|---|---|
| `S3_ENDPOINT` `S3_REGION` `S3_BUCKET` | object storage (S3-compatible) |
| `S3_ACCESS_KEY_ID` `S3_SECRET_ACCESS_KEY` | kredensial — **jangan commit** |
| `S3_PREFIX` | prefix objek (`wishtoria`) |
| `S3_PUBLIC_BASE_URL` | dasar URL objek (bucket ini private → dibaca via `/api/img`) |
| `DATABASE_URL` | `file:./.data/cms.db` |
| `AUTH_SECRET` | rahasia Auth.js (`openssl rand -base64 32`) |
| `ADMIN_USERNAME` `ADMIN_PASSWORD` / `ADMIN_PASSWORD_HASH` | akun admin (seed) |

## Alur gambar

Upload di CMS → `sharp` membuat **AVIF + WebP** di lebar 480/1080/1920/2560
(di-cap ke resolusi asli) + placeholder blur → objek di
`wishtoria/photos/<kategori>/<sesi>/<id>/<lebar>.<fmt>` + `original`.
Metadata (dimensi, daftar varian, blur) disimpan di DB. Bucket private → disajikan
`/api/img/[...path]` dengan cache `immutable` 1 tahun. `next/image` tidak dipakai
untuk foto CMS (varian sudah pra-generate).

## Deploy

Target: VPS + Docker (menyusul). Yang perlu di produksi: env di atas, `npm ci`,
`npm run db:migrate && npm run db:seed`, `npm run build`, `npm start`; reverse
proxy (nginx) + TLS; `.data/cms.db` persisten (volume).
