import { randomBytes } from "node:crypto"

/** ID pendek URL-safe (~11 char) untuk nama folder objek storage. */
export function shortId(): string {
  return randomBytes(8).toString("base64url")
}

/** Slug dari teks bebas: huruf kecil, tanda hubung. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64)
}
