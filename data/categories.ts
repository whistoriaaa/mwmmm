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
  /** Nama orang/pasangan/trip untuk sub-galeri, mis. "Aira", "Fendra & Wife" */
  group?: string
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
 * ── Cara mengatur bulan/tahun foto secara manual ──────────────────
 * Isi tanggal sesi di sini, format "YYYY-MM" (mis. "2026-04").
 * Semua foto yang punya `group` sama (satu folder orang/pasangan/trip)
 * otomatis ikut tanggal ini — cukup ubah satu baris, tidak perlu
 * mengedit tiap foto satu-satu.
 * Kosongkan jadi "" kalau belum tahu tanggalnya — foto akan masuk ke
 * kelompok "Tanpa tanggal" di halaman kategori.
 */
export const sessionDates: Record<string, string> = {
  "Angel":              "",
  "Aira":                "",
  "Ayu":                 "",
  "Fatma":               "",
  "Shofi":               "",
  "Fira dan Rikha":      "",
  "Rizkika":             "",
  "Dhoni & Syahlu":      "",
  "Faroid & Wife":       "",
  "Fendra & Wife":       "",
  "Indra & Dewi":        "",
  "Trip Kondang Merak":  "",
  "Trip Rivertubing":    "",
}

/**
 * Untuk foto tanpa `group` (foto lepas / tanpa sesi tertentu),
 * atur tanggalnya langsung lewat field `date: "YYYY-MM"` pada foto itu.
 */
const rawPhotos: Photo[] = [
  // portrait/couple
  { id: 18, src: "/photos/portrait/couple/1.jpg", w: 2832, h: 1892, category: "portrait", sub: "couple", highlight: true },
  // portrait/couple — Angel
  { id: 19, src: "/photos/portrait/couple/angel/1.jpg", w: 2832, h: 4240, category: "portrait", sub: "couple", group: "Angel", highlight: true },
  { id: 20, src: "/photos/portrait/couple/angel/2.jpg", w: 2832, h: 4240, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 21, src: "/photos/portrait/couple/angel/3.jpg", w: 2698, h: 4145, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 22, src: "/photos/portrait/couple/angel/4.jpg", w: 2558, h: 3410, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 23, src: "/photos/portrait/couple/angel/5.jpg", w: 2785, h: 4171, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 24, src: "/photos/portrait/couple/angel/6.jpg", w: 2667, h: 3993, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 25, src: "/photos/portrait/couple/angel/7.jpg", w: 2619, h: 3853, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 26, src: "/photos/portrait/couple/angel/8.jpg", w: 1499, h: 2243, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 27, src: "/photos/portrait/couple/angel/9.jpg", w: 2823, h: 4226, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 28, src: "/photos/portrait/couple/angel/10.jpg", w: 2632, h: 3939, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 29, src: "/photos/portrait/couple/angel/11.jpg", w: 2725, h: 4080, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 30, src: "/photos/portrait/couple/angel/12.jpg", w: 2661, h: 3900, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 31, src: "/photos/portrait/couple/angel/13.jpg", w: 2310, h: 3079, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 32, src: "/photos/portrait/couple/angel/14.jpg", w: 2664, h: 3552, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 33, src: "/photos/portrait/couple/angel/15.jpg", w: 2832, h: 4240, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  { id: 34, src: "/photos/portrait/couple/angel/16.jpg", w: 2832, h: 4240, category: "portrait", sub: "couple", group: "Angel", highlight: false },
  // portrait/graduation — Aira
  { id: 35, src: "/photos/portrait/graduation/aira/1.jpg", w: 2468, h: 3085, category: "portrait", sub: "graduation", group: "Aira", highlight: true },
  { id: 36, src: "/photos/portrait/graduation/aira/2.jpg", w: 1824, h: 2280, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 37, src: "/photos/portrait/graduation/aira/3.jpg", w: 2678, h: 3348, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 38, src: "/photos/portrait/graduation/aira/4.jpg", w: 3253, h: 2150, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 39, src: "/photos/portrait/graduation/aira/5.jpg", w: 2544, h: 3180, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 40, src: "/photos/portrait/graduation/aira/6.jpg", w: 2480, h: 1654, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 41, src: "/photos/portrait/graduation/aira/7.jpg", w: 1447, h: 1808, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 42, src: "/photos/portrait/graduation/aira/8.jpg", w: 2763, h: 3454, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 43, src: "/photos/portrait/graduation/aira/9.jpg", w: 2423, h: 3028, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 44, src: "/photos/portrait/graduation/aira/10.jpg", w: 2794, h: 3492, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 45, src: "/photos/portrait/graduation/aira/11.jpg", w: 2214, h: 3938, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 46, src: "/photos/portrait/graduation/aira/12.jpg", w: 2792, h: 3490, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 47, src: "/photos/portrait/graduation/aira/13.jpg", w: 2234, h: 2793, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 48, src: "/photos/portrait/graduation/aira/14.jpg", w: 2558, h: 3196, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 49, src: "/photos/portrait/graduation/aira/15.jpg", w: 2694, h: 3367, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 50, src: "/photos/portrait/graduation/aira/16.jpg", w: 2596, h: 3244, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  { id: 51, src: "/photos/portrait/graduation/aira/17.jpg", w: 2582, h: 3228, category: "portrait", sub: "graduation", group: "Aira", highlight: false },
  // portrait/graduation — Ayu
  { id: 52, src: "/photos/portrait/graduation/ayu/1.jpg", w: 2339, h: 3119, category: "portrait", sub: "graduation", group: "Ayu", highlight: true },
  { id: 53, src: "/photos/portrait/graduation/ayu/2.jpg", w: 1363, h: 1817, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 54, src: "/photos/portrait/graduation/ayu/3.jpg", w: 2463, h: 3285, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 55, src: "/photos/portrait/graduation/ayu/4.jpg", w: 2568, h: 3424, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 56, src: "/photos/portrait/graduation/ayu/5.jpg", w: 4060, h: 1408, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 57, src: "/photos/portrait/graduation/ayu/6.jpg", w: 2831, h: 3776, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 58, src: "/photos/portrait/graduation/ayu/7.jpg", w: 2263, h: 3338, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 59, src: "/photos/portrait/graduation/ayu/8.jpg", w: 2744, h: 3658, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 60, src: "/photos/portrait/graduation/ayu/9.jpg", w: 2483, h: 3716, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 61, src: "/photos/portrait/graduation/ayu/10.jpg", w: 2136, h: 2847, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 62, src: "/photos/portrait/graduation/ayu/11.jpg", w: 2701, h: 3601, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 63, src: "/photos/portrait/graduation/ayu/12.jpg", w: 2470, h: 3292, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  { id: 64, src: "/photos/portrait/graduation/ayu/13.jpg", w: 2663, h: 3987, category: "portrait", sub: "graduation", group: "Ayu", highlight: false },
  // portrait/graduation — Fatma
  { id: 65, src: "/photos/portrait/graduation/fatma/1.jpg", w: 3426, h: 5140, category: "portrait", sub: "graduation", group: "Fatma", highlight: true },
  { id: 66, src: "/photos/portrait/graduation/fatma/2.jpg", w: 2402, h: 3596, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 67, src: "/photos/portrait/graduation/fatma/3.jpg", w: 2733, h: 4093, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 68, src: "/photos/portrait/graduation/fatma/4.jpg", w: 1906, h: 2854, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 69, src: "/photos/portrait/graduation/fatma/5.jpg", w: 2538, h: 3799, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 70, src: "/photos/portrait/graduation/fatma/6.jpg", w: 2277, h: 3036, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 71, src: "/photos/portrait/graduation/fatma/7.jpg", w: 2832, h: 4240, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 72, src: "/photos/portrait/graduation/fatma/8.jpg", w: 4240, h: 2832, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 73, src: "/photos/portrait/graduation/fatma/9.jpg", w: 2832, h: 4240, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  { id: 74, src: "/photos/portrait/graduation/fatma/10.jpg", w: 2832, h: 4240, category: "portrait", sub: "graduation", group: "Fatma", highlight: false },
  // portrait/graduation — Shofi
  { id: 75, src: "/photos/portrait/graduation/shofi/1.jpg", w: 2609, h: 3971, category: "portrait", sub: "graduation", group: "Shofi", highlight: true },
  { id: 76, src: "/photos/portrait/graduation/shofi/2.jpg", w: 1736, h: 3086, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 77, src: "/photos/portrait/graduation/shofi/3.jpg", w: 2756, h: 4132, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 78, src: "/photos/portrait/graduation/shofi/4.jpg", w: 2715, h: 4064, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 79, src: "/photos/portrait/graduation/shofi/5.jpg", w: 2394, h: 3584, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 80, src: "/photos/portrait/graduation/shofi/6.jpg", w: 2581, h: 3872, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 81, src: "/photos/portrait/graduation/shofi/7.jpg", w: 2198, h: 2748, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 82, src: "/photos/portrait/graduation/shofi/8.jpg", w: 2832, h: 4240, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 83, src: "/photos/portrait/graduation/shofi/9.jpg", w: 2774, h: 4152, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 84, src: "/photos/portrait/graduation/shofi/10.jpg", w: 2302, h: 3452, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 85, src: "/photos/portrait/graduation/shofi/11.jpg", w: 2143, h: 3212, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 86, src: "/photos/portrait/graduation/shofi/12.jpg", w: 2832, h: 4240, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 87, src: "/photos/portrait/graduation/shofi/13.jpg", w: 2683, h: 4017, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 88, src: "/photos/portrait/graduation/shofi/14.jpg", w: 4240, h: 2832, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 89, src: "/photos/portrait/graduation/shofi/15.jpg", w: 2742, h: 4105, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 90, src: "/photos/portrait/graduation/shofi/16.jpg", w: 2674, h: 4004, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 91, src: "/photos/portrait/graduation/shofi/17.jpg", w: 2799, h: 4191, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  { id: 92, src: "/photos/portrait/graduation/shofi/18.jpg", w: 4240, h: 2832, category: "portrait", sub: "graduation", group: "Shofi", highlight: false },
  // portrait/personal — Fira dan Rikha
  { id: 93, src: "/photos/portrait/personal/fira-dan-rikha/1.jpg", w: 2833, h: 3543, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: true },
  { id: 94, src: "/photos/portrait/personal/fira-dan-rikha/2.jpg", w: 4000, h: 5333, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  { id: 95, src: "/photos/portrait/personal/fira-dan-rikha/3.jpg", w: 3741, h: 4988, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  { id: 96, src: "/photos/portrait/personal/fira-dan-rikha/4.jpg", w: 2832, h: 3776, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  { id: 97, src: "/photos/portrait/personal/fira-dan-rikha/5.jpg", w: 3199, h: 4799, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  { id: 98, src: "/photos/portrait/personal/fira-dan-rikha/6.jpg", w: 2558, h: 3830, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  { id: 99, src: "/photos/portrait/personal/fira-dan-rikha/7.jpg", w: 2832, h: 4240, category: "portrait", sub: "personal", group: "Fira dan Rikha", highlight: false },
  // portrait/personal — Rizkika
  { id: 100, src: "/photos/portrait/personal/rizkika/1.jpg", w: 2633, h: 3290, category: "portrait", sub: "personal", group: "Rizkika", highlight: true },
  { id: 101, src: "/photos/portrait/personal/rizkika/2.jpg", w: 2702, h: 3377, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 102, src: "/photos/portrait/personal/rizkika/3.jpg", w: 2342, h: 3507, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 103, src: "/photos/portrait/personal/rizkika/4.jpg", w: 2552, h: 3821, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 104, src: "/photos/portrait/personal/rizkika/5.jpg", w: 2499, h: 3123, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 105, src: "/photos/portrait/personal/rizkika/6.jpg", w: 2533, h: 3167, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 106, src: "/photos/portrait/personal/rizkika/7.jpg", w: 2645, h: 3307, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 107, src: "/photos/portrait/personal/rizkika/8.jpg", w: 2765, h: 4139, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 108, src: "/photos/portrait/personal/rizkika/9.jpg", w: 2809, h: 4206, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 109, src: "/photos/portrait/personal/rizkika/10.jpg", w: 2694, h: 3367, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 110, src: "/photos/portrait/personal/rizkika/11.jpg", w: 2826, h: 3532, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  { id: 111, src: "/photos/portrait/personal/rizkika/12.jpg", w: 2746, h: 3432, category: "portrait", sub: "personal", group: "Rizkika", highlight: false },
  // portrait/fashionis
  { id: 113, src: "/photos/portrait/fashionis/2.jpg", w: 2646, h: 3528, category: "portrait", sub: "fashionis", highlight: true },
  { id: 114, src: "/photos/portrait/fashionis/3.jpg", w: 2368, h: 3545, category: "portrait", sub: "fashionis", highlight: false },
  { id: 115, src: "/photos/portrait/fashionis/4.jpg", w: 2832, h: 4240, category: "portrait", sub: "fashionis", highlight: false },
  { id: 116, src: "/photos/portrait/fashionis/5.jpg", w: 2719, h: 4071, category: "portrait", sub: "fashionis", highlight: false },
  { id: 117, src: "/photos/portrait/fashionis/6.jpg", w: 2478, h: 3650, category: "portrait", sub: "fashionis", highlight: false },
  { id: 118, src: "/photos/portrait/fashionis/7.jpg", w: 1790, h: 2756, category: "portrait", sub: "fashionis", highlight: false },
  { id: 119, src: "/photos/portrait/fashionis/8.jpg", w: 2745, h: 4111, category: "portrait", sub: "fashionis", highlight: false },
  { id: 120, src: "/photos/portrait/fashionis/9.jpg", w: 2608, h: 3904, category: "portrait", sub: "fashionis", highlight: false },
  { id: 121, src: "/photos/portrait/fashionis/10.jpg", w: 2832, h: 4240, category: "portrait", sub: "fashionis", highlight: false },
  { id: 122, src: "/photos/portrait/fashionis/11.jpg", w: 2565, h: 3766, category: "portrait", sub: "fashionis", highlight: false },
  { id: 123, src: "/photos/portrait/fashionis/12.jpg", w: 2829, h: 3538, category: "portrait", sub: "fashionis", highlight: false },
  { id: 124, src: "/photos/portrait/fashionis/13.jpg", w: 2804, h: 4198, category: "portrait", sub: "fashionis", highlight: false },
  { id: 125, src: "/photos/portrait/fashionis/14.jpg", w: 2827, h: 3534, category: "portrait", sub: "fashionis", highlight: false },
  { id: 126, src: "/photos/portrait/fashionis/15.jpg", w: 2544, h: 3179, category: "portrait", sub: "fashionis", highlight: false },
  { id: 127, src: "/photos/portrait/fashionis/16.jpg", w: 2544, h: 3878, category: "portrait", sub: "fashionis", highlight: false },
  { id: 128, src: "/photos/portrait/fashionis/17.jpg", w: 2687, h: 4023, category: "portrait", sub: "fashionis", highlight: false },
  { id: 129, src: "/photos/portrait/fashionis/18.jpg", w: 2832, h: 4240, category: "portrait", sub: "fashionis", highlight: false },
  { id: 130, src: "/photos/portrait/fashionis/19.jpg", w: 2690, h: 4026, category: "portrait", sub: "fashionis", highlight: false },
  { id: 131, src: "/photos/portrait/fashionis/20.jpg", w: 3999, h: 5332, category: "portrait", sub: "fashionis", highlight: false },
  // special/engagement
  { id: 132, src: "/photos/special/engagement/1.jpg", w: 2118, h: 2824, category: "special", sub: "engagement", date: "2026-04", highlight: true },
  { id: 133, src: "/photos/special/engagement/2.jpg", w: 2832, h: 4240, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 134, src: "/photos/special/engagement/3.jpg", w: 2599, h: 3891, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 135, src: "/photos/special/engagement/4.jpg", w: 2686, h: 4021, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 136, src: "/photos/special/engagement/5.jpg", w: 2797, h: 4023, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 137, src: "/photos/special/engagement/6.jpg", w: 2575, h: 3856, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 138, src: "/photos/special/engagement/7.jpg", w: 4622, h: 5778, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 139, src: "/photos/special/engagement/8.jpg", w: 4134, h: 5167, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 140, src: "/photos/special/engagement/9.jpg", w: 2757, h: 4129, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 141, src: "/photos/special/engagement/10.jpg", w: 2668, h: 3996, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 142, src: "/photos/special/engagement/11.jpg", w: 4294, h: 5368, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 143, src: "/photos/special/engagement/12.jpg", w: 2699, h: 4040, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 144, src: "/photos/special/engagement/13.jpg", w: 2832, h: 4240, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  { id: 145, src: "/photos/special/engagement/14.jpg", w: 2748, h: 4115, category: "special", sub: "engagement", date: "2026-04", highlight: false },
  // special/wedding — Dhoni & Syahlu
  { id: 146, src: "/photos/special/wedding/dhoni-dan-syahlu/1.jpg", w: 2560, h: 3414, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: true },
  { id: 147, src: "/photos/special/wedding/dhoni-dan-syahlu/2.jpg", w: 2646, h: 3529, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 148, src: "/photos/special/wedding/dhoni-dan-syahlu/3.jpg", w: 2781, h: 3708, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 149, src: "/photos/special/wedding/dhoni-dan-syahlu/4.jpg", w: 3489, h: 2331, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 150, src: "/photos/special/wedding/dhoni-dan-syahlu/5.jpg", w: 4134, h: 2761, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 151, src: "/photos/special/wedding/dhoni-dan-syahlu/6.jpg", w: 4031, h: 2716, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 152, src: "/photos/special/wedding/dhoni-dan-syahlu/7.jpg", w: 2784, h: 3713, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 153, src: "/photos/special/wedding/dhoni-dan-syahlu/8.jpg", w: 2832, h: 3776, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 154, src: "/photos/special/wedding/dhoni-dan-syahlu/9.jpg", w: 3645, h: 2445, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 155, src: "/photos/special/wedding/dhoni-dan-syahlu/10.jpg", w: 2626, h: 3502, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 156, src: "/photos/special/wedding/dhoni-dan-syahlu/11.jpg", w: 2615, h: 3487, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 157, src: "/photos/special/wedding/dhoni-dan-syahlu/12.jpg", w: 2188, h: 2917, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 158, src: "/photos/special/wedding/dhoni-dan-syahlu/13.jpg", w: 3847, h: 2453, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 159, src: "/photos/special/wedding/dhoni-dan-syahlu/14.jpg", w: 2083, h: 2778, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  { id: 160, src: "/photos/special/wedding/dhoni-dan-syahlu/15.jpg", w: 2216, h: 2954, category: "special", sub: "wedding", group: "Dhoni & Syahlu", highlight: false },
  // special/wedding — Faroid & Wife
  { id: 161, src: "/photos/special/wedding/faroid-wife/1.jpg", w: 3639, h: 2300, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: true },
  { id: 162, src: "/photos/special/wedding/faroid-wife/2.jpg", w: 4236, h: 2830, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 163, src: "/photos/special/wedding/faroid-wife/3.jpg", w: 3278, h: 2190, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 164, src: "/photos/special/wedding/faroid-wife/4.jpg", w: 2413, h: 3613, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 165, src: "/photos/special/wedding/faroid-wife/5.jpg", w: 2361, h: 3148, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 166, src: "/photos/special/wedding/faroid-wife/6.jpg", w: 2584, h: 3871, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 167, src: "/photos/special/wedding/faroid-wife/7.jpg", w: 1921, h: 2777, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 168, src: "/photos/special/wedding/faroid-wife/8.jpg", w: 2792, h: 4180, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 169, src: "/photos/special/wedding/faroid-wife/9.jpg", w: 2516, h: 3451, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 170, src: "/photos/special/wedding/faroid-wife/10.jpg", w: 2716, h: 3622, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 171, src: "/photos/special/wedding/faroid-wife/11.jpg", w: 2737, h: 4098, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  { id: 172, src: "/photos/special/wedding/faroid-wife/12.jpg", w: 2481, h: 3715, category: "special", sub: "wedding", group: "Faroid & Wife", highlight: false },
  // special/wedding — Fendra & Wife
  { id: 173, src: "/photos/special/wedding/fendra-wife/1.jpg", w: 2714, h: 3393, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: true },
  { id: 174, src: "/photos/special/wedding/fendra-wife/2.jpg", w: 2458, h: 3072, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 175, src: "/photos/special/wedding/fendra-wife/3.jpg", w: 2831, h: 2832, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 176, src: "/photos/special/wedding/fendra-wife/4.jpg", w: 2696, h: 3370, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 177, src: "/photos/special/wedding/fendra-wife/5.jpg", w: 2435, h: 3045, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 178, src: "/photos/special/wedding/fendra-wife/6.jpg", w: 2637, h: 3794, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 179, src: "/photos/special/wedding/fendra-wife/7.jpg", w: 3934, h: 2622, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 180, src: "/photos/special/wedding/fendra-wife/8.jpg", w: 3191, h: 2134, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 181, src: "/photos/special/wedding/fendra-wife/9.jpg", w: 2823, h: 3529, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 182, src: "/photos/special/wedding/fendra-wife/10.jpg", w: 2430, h: 3781, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 183, src: "/photos/special/wedding/fendra-wife/11.jpg", w: 2861, h: 1658, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 184, src: "/photos/special/wedding/fendra-wife/12.jpg", w: 2763, h: 3685, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 185, src: "/photos/special/wedding/fendra-wife/13.jpg", w: 2332, h: 2917, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 186, src: "/photos/special/wedding/fendra-wife/14.jpg", w: 4135, h: 2762, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 187, src: "/photos/special/wedding/fendra-wife/15.jpg", w: 3837, h: 2223, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 188, src: "/photos/special/wedding/fendra-wife/16.jpg", w: 2643, h: 4175, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 189, src: "/photos/special/wedding/fendra-wife/17.jpg", w: 4132, h: 2776, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 190, src: "/photos/special/wedding/fendra-wife/18.jpg", w: 2545, h: 3181, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 191, src: "/photos/special/wedding/fendra-wife/19.jpg", w: 2820, h: 4222, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 192, src: "/photos/special/wedding/fendra-wife/20.jpg", w: 2535, h: 3170, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 193, src: "/photos/special/wedding/fendra-wife/21.jpg", w: 4090, h: 2731, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 194, src: "/photos/special/wedding/fendra-wife/22.jpg", w: 2814, h: 4214, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 195, src: "/photos/special/wedding/fendra-wife/23.jpg", w: 2555, h: 3195, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 196, src: "/photos/special/wedding/fendra-wife/24.jpg", w: 3969, h: 2652, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  { id: 197, src: "/photos/special/wedding/fendra-wife/25.jpg", w: 2805, h: 4200, category: "special", sub: "wedding", group: "Fendra & Wife", highlight: false },
  // special/wedding — Indra & Dewi
  { id: 198, src: "/photos/special/wedding/indra-dewi/1.jpg", w: 2765, h: 4140, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: true },
  { id: 199, src: "/photos/special/wedding/indra-dewi/2.jpg", w: 2329, h: 3486, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 200, src: "/photos/special/wedding/indra-dewi/3.jpg", w: 2574, h: 3852, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 201, src: "/photos/special/wedding/indra-dewi/4.jpg", w: 2690, h: 4028, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 202, src: "/photos/special/wedding/indra-dewi/5.jpg", w: 2630, h: 3937, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 203, src: "/photos/special/wedding/indra-dewi/6.jpg", w: 4123, h: 2748, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 204, src: "/photos/special/wedding/indra-dewi/7.jpg", w: 2476, h: 3708, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 205, src: "/photos/special/wedding/indra-dewi/8.jpg", w: 2696, h: 4044, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 206, src: "/photos/special/wedding/indra-dewi/9.jpg", w: 2810, h: 4208, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 207, src: "/photos/special/wedding/indra-dewi/10.jpg", w: 2802, h: 4195, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 208, src: "/photos/special/wedding/indra-dewi/11.jpg", w: 2538, h: 3799, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 209, src: "/photos/special/wedding/indra-dewi/12.jpg", w: 2614, h: 3921, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 210, src: "/photos/special/wedding/indra-dewi/13.jpg", w: 2591, h: 3880, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 211, src: "/photos/special/wedding/indra-dewi/14.jpg", w: 2665, h: 3838, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 212, src: "/photos/special/wedding/indra-dewi/15.jpg", w: 2168, h: 3252, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 213, src: "/photos/special/wedding/indra-dewi/16.jpg", w: 2558, h: 3829, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  { id: 214, src: "/photos/special/wedding/indra-dewi/17.jpg", w: 2598, h: 3889, category: "special", sub: "wedding", group: "Indra & Dewi", highlight: false },
  // event
  { id: 215, src: "/photos/event/8.jpg", w: 2831, h: 1592, category: "event", highlight: true },
  // event — Trip Kondang Merak
  { id: 216, src: "/photos/event/trip/kondang-merak/1.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: true },
  { id: 217, src: "/photos/event/trip/kondang-merak/2.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 218, src: "/photos/event/trip/kondang-merak/3.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 219, src: "/photos/event/trip/kondang-merak/4.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 220, src: "/photos/event/trip/kondang-merak/5.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 221, src: "/photos/event/trip/kondang-merak/6.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 222, src: "/photos/event/trip/kondang-merak/7.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 223, src: "/photos/event/trip/kondang-merak/8.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 224, src: "/photos/event/trip/kondang-merak/9.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 225, src: "/photos/event/trip/kondang-merak/10.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 226, src: "/photos/event/trip/kondang-merak/11.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 227, src: "/photos/event/trip/kondang-merak/12.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 228, src: "/photos/event/trip/kondang-merak/13.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  { id: 229, src: "/photos/event/trip/kondang-merak/14.jpg", w: 4240, h: 2832, category: "event", group: "Trip Kondang Merak", highlight: false },
  // event — Trip Rivertubing
  { id: 230, src: "/photos/event/trip/rivertubing/1.jpg", w: 4240, h: 2832, category: "event", group: "Trip Rivertubing", highlight: true },
  { id: 231, src: "/photos/event/trip/rivertubing/2.jpg", w: 4240, h: 2832, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 232, src: "/photos/event/trip/rivertubing/3.jpg", w: 4240, h: 2832, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 233, src: "/photos/event/trip/rivertubing/4.jpg", w: 3794, h: 2534, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 234, src: "/photos/event/trip/rivertubing/5.jpg", w: 2832, h: 4240, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 235, src: "/photos/event/trip/rivertubing/6.jpg", w: 4132, h: 2760, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 236, src: "/photos/event/trip/rivertubing/7.jpg", w: 2814, h: 3517, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 237, src: "/photos/event/trip/rivertubing/8.jpg", w: 3737, h: 2497, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 238, src: "/photos/event/trip/rivertubing/9.jpg", w: 2816, h: 3520, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 239, src: "/photos/event/trip/rivertubing/10.jpg", w: 2814, h: 3518, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 240, src: "/photos/event/trip/rivertubing/11.jpg", w: 4204, h: 2808, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 241, src: "/photos/event/trip/rivertubing/12.jpg", w: 2831, h: 3540, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 242, src: "/photos/event/trip/rivertubing/13.jpg", w: 2832, h: 3540, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 243, src: "/photos/event/trip/rivertubing/14.jpg", w: 2287, h: 2857, category: "event", group: "Trip Rivertubing", highlight: false },
  { id: 244, src: "/photos/event/trip/rivertubing/15.jpg", w: 2760, h: 3679, category: "event", group: "Trip Rivertubing", highlight: false },
]

export const allCategoryPhotos: Photo[] = rawPhotos.map(p =>
  p.date || !p.group
    ? p
    : { ...p, date: sessionDates[p.group] || undefined }
)
