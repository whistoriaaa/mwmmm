/**
 * Taksonomi awal situs — dipakai `scripts/db-seed.ts` untuk mengisi tabel
 * `categories` / `subcategories` saat pertama kali setup.
 *
 * Setelah seed, kategori dikelola lewat CMS / DB. File ini hanya nilai awal.
 */

export type MainCat = "portrait" | "special" | "event"

export type PortraitSub = "graduation" | "personal" | "fashionis" | "couple"
export type SpecialSub =
  | "birthday"
  | "maternity"
  | "engagement"
  | "prewedding"
  | "wedding"
  | "family-vacation"
export type SubCat = PortraitSub | SpecialSub

export interface SubDef {
  key: SubCat
  label: string
}

export interface CategoryDef {
  key: MainCat
  label: string
  subs?: SubDef[]
}

export const categoryDefs: CategoryDef[] = [
  {
    key: "portrait",
    label: "Portrait",
    subs: [
      { key: "graduation", label: "Graduation" },
      { key: "personal", label: "Personal Photoshot" },
      { key: "fashionis", label: "Fashion Lifestyle" },
      { key: "couple", label: "Couple Session" },
    ],
  },
  {
    key: "special",
    label: "Special Moment",
    subs: [
      { key: "wedding", label: "Wedding" },
      { key: "prewedding", label: "Prewedding" },
      { key: "engagement", label: "Engagement" },
      { key: "birthday", label: "Birthday Party" },
      { key: "maternity", label: "Maternity" },
      { key: "family-vacation", label: "Family Vacation" },
    ],
  },
  {
    key: "event",
    label: "Event & Trips",
  },
]
