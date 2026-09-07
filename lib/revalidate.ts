import "server-only"
import { revalidatePath } from "next/cache"

/** Panggil setelah konten foto publik berubah dari CMS. */
export function revalidateSite() {
  revalidatePath("/", "page")
  revalidatePath("/kategori", "page")
}

/** Panggil setelah artikel berubah. */
export function revalidateArticles(slug?: string) {
  revalidatePath("/cerita", "page")
  if (slug) revalidatePath(`/cerita/${slug}`, "page")
  revalidatePath("/about", "page")
}

/** Panggil setelah CV / konten situs berubah. */
export function revalidateAbout() {
  revalidatePath("/about", "page")
  revalidatePath("/", "page")
}
