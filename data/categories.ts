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

export const allCategoryPhotos: Photo[] = [
  // Portrait — Graduation
  { id: 1,  src: "/photos/portrait/graduation/1.jpg", w: 600, h: 800, category: "portrait", sub: "graduation" },
  { id: 2,  src: "/photos/portrait/graduation/2.jpg", w: 700, h: 500, category: "portrait", sub: "graduation" },
  // Portrait — Personal Photoshot
  { id: 3,  src: "/photos/portrait/personal/1.jpg",   w: 600, h: 750, category: "portrait", sub: "personal"   },
  { id: 4,  src: "/photos/portrait/personal/2.jpg",   w: 800, h: 550, category: "portrait", sub: "personal"   },
  // Portrait — Fashionis (akan diupload menyusul)
  // Portrait — Couple Session
  { id: 5,  src: "/photos/portrait/couple/1.jpg",     w: 800, h: 450, category: "portrait", sub: "couple"     },
  { id: 6,  src: "/photos/portrait/couple/2.jpg",     w: 700, h: 900, category: "portrait", sub: "couple"     },
  // Special — Prewedding
  { id: 7,  src: "/photos/special/prewedding/1.jpg",  w: 800, h: 450, category: "special",  sub: "prewedding" },
  { id: 8,  src: "/photos/special/prewedding/2.jpg",  w: 800, h: 600, category: "special",  sub: "prewedding" },
  // Special — Wedding
  { id: 9,  src: "/photos/special/wedding/1.jpg",     w: 600, h: 900, category: "special",  sub: "wedding"    },
  { id: 10, src: "/photos/special/wedding/2.jpg",     w: 800, h: 450, category: "special",  sub: "wedding"    },
  // Special — Birthday, Maternity, Engagement, Family Vacation (akan diupload menyusul)
  // Event & Trips
  { id: 11, src: "/photos/event/1.jpg",               w: 500, h: 800, category: "event" },
  { id: 12, src: "/photos/event/2.jpg",               w: 800, h: 450, category: "event" },
  { id: 13, src: "/photos/event/3.jpg",               w: 550, h: 820, category: "event" },
  { id: 14, src: "/photos/event/4.jpg",               w: 800, h: 450, category: "event" },
  { id: 15, src: "/photos/event/5.jpg",               w: 640, h: 960, category: "event" },
  { id: 16, src: "/photos/event/6.jpg",               w: 750, h: 500, category: "event" },
  { id: 17, src: "/photos/event/7.jpg",               w: 800, h: 450, category: "event" },
]
