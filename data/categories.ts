export type MainCat = "portrait" | "special" | "event"

export type PortraitSub  = "graduation" | "personal" | "fashionis" | "couple"
export type SpecialSub   = "birthday" | "maternity" | "engagement" | "prewedding" | "wedding" | "family-vacation"
export type SubCat       = PortraitSub | SpecialSub

export interface Photo {
  id: number
  src: string
  w: number
  h: number
  category: MainCat
  sub?: SubCat
  /** Format "YYYY-MM" — diisi dari nama folder tanggal (dd-mm-yy) */
  date?: string
  highlight?: boolean
}

/**
 * Mengubah nama folder tanggal "dd-mm-yy" → "YYYY-MM"
 * Contoh: "02-02-26" → "2026-02"
 */
export function parseFolderDate(folder: string): string {
  const parts = folder.split("-")
  if (parts.length !== 3) return ""
  const [, mm, yy] = parts
  return `20${yy}-${mm}`
}

export interface SubDef { key: SubCat; label: string }

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
      { key: "graduation", label: "Graduation"         },
      { key: "personal",   label: "Personal Photoshot" },
      { key: "fashionis",  label: "Fashion Lifestyle"  },
      { key: "couple",     label: "Couple Session"     },
    ],
  },
  {
    key: "special",
    label: "Special Moment",
    subs: [
      { key: "wedding",          label: "Wedding"         },
      { key: "prewedding",       label: "Prewedding"      },
      { key: "engagement",       label: "Engagement"      },
      { key: "birthday",         label: "Birthday Party"  },
      { key: "maternity",        label: "Maternity"       },
      { key: "family-vacation",  label: "Family Vacation" },
    ],
  },
  {
    key: "event",
    label: "Event & Trips",
  },
]

/**
 * Konvensi path foto dengan folder tanggal:
 *   /photos/{kategori}/{sub}/{dd-mm-yy}/{nomor}.jpg
 * Contoh:
 *   /photos/portrait/graduation/02-04-25/1.jpg
 *
 * Untuk foto lama yang belum dipindahkan ke folder tanggal,
 * tambahkan field `date` secara manual dalam format "YYYY-MM".
 */
export const allCategoryPhotos: Photo[] = [
  // Portrait — Graduation (April 2025)
  { id: 1,  src: "/photos/portrait/graduation/1.jpg", w: 600, h: 800, category: "portrait", sub: "graduation", date: "2025-04", highlight: true  },
  { id: 2,  src: "/photos/portrait/graduation/2.jpg", w: 700, h: 500, category: "portrait", sub: "graduation", date: "2025-04", highlight: false },
  // Portrait — Personal Photoshot (Mei 2025)
  { id: 3,  src: "/photos/portrait/personal/1.jpg",   w: 600, h: 750, category: "portrait", sub: "personal",   date: "2025-05", highlight: true  },
  { id: 4,  src: "/photos/portrait/personal/2.jpg",   w: 800, h: 550, category: "portrait", sub: "personal",   date: "2025-05", highlight: false },
  // Portrait — Couple Session (Mei 2025)
  { id: 5,  src: "/photos/portrait/couple/1.jpg",     w: 800, h: 450, category: "portrait", sub: "couple",     date: "2025-05", highlight: false },
  { id: 6,  src: "/photos/portrait/couple/2.jpg",     w: 700, h: 900, category: "portrait", sub: "couple",     date: "2025-05", highlight: true  },
  // Special — Prewedding (Mei 2025)
  { id: 7,  src: "/photos/special/prewedding/1.jpg",  w: 800, h: 450, category: "special",  sub: "prewedding", date: "2025-05", highlight: true  },
  { id: 8,  src: "/photos/special/prewedding/2.jpg",  w: 800, h: 600, category: "special",  sub: "prewedding", date: "2025-05", highlight: false },
  // Special — Wedding (April 2025)
  { id: 9,  src: "/photos/special/wedding/1.jpg",     w: 600, h: 900, category: "special",  sub: "wedding",    date: "2025-04", highlight: true  },
  { id: 10, src: "/photos/special/wedding/2.jpg",     w: 800, h: 450, category: "special",  sub: "wedding",    date: "2025-04", highlight: false },
  // Event & Trips (April 2025)
  { id: 11, src: "/photos/event/1.jpg",               w: 500, h: 800, category: "event",    date: "2025-04", highlight: false },
  { id: 12, src: "/photos/event/2.jpg",               w: 800, h: 450, category: "event",    date: "2025-04", highlight: false },
  { id: 13, src: "/photos/event/3.jpg",               w: 550, h: 820, category: "event",    date: "2025-04", highlight: true  },
  { id: 14, src: "/photos/event/4.jpg",               w: 800, h: 450, category: "event",    date: "2025-04", highlight: false },
  // Event & Trips (Maret 2025)
  { id: 15, src: "/photos/event/5.jpg",               w: 640, h: 960, category: "event",    date: "2025-03", highlight: false },
  { id: 16, src: "/photos/event/6.jpg",               w: 750, h: 500, category: "event",    date: "2025-03", highlight: false },
  { id: 17, src: "/photos/event/7.jpg",               w: 800, h: 450, category: "event",    date: "2025-03", highlight: false },
]
