import "server-only"
import { revalidatePath } from "next/cache"

/** Panggil setelah konten foto publik berubah dari CMS. */
export function revalidateSite() {
  revalidatePath("/", "page")
  revalidatePath("/kategori", "page")
}
