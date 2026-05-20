export type MainCat = "portrait" | "event" | "product"
export type PortraitSub = "personal" | "graduation" | "couple" | "prewedding" | "wedding"
export type ProductSub = "commercial" | "culinary" | "fashion"
export type SubCat = PortraitSub | ProductSub

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
      { key: "personal",   label: "Personal Photoshot" },
      { key: "graduation", label: "Graduation"         },
      { key: "couple",     label: "Couple Session"     },
      { key: "prewedding", label: "Pre Wedding"        },
      { key: "wedding",    label: "Wedding"            },
    ],
  },
  {
    key: "event",
    label: "Event & Trip",
  },
  {
    key: "product",
    label: "Product",
    subs: [
      { key: "commercial", label: "Commercial" },
      { key: "culinary",   label: "Culinary"   },
      { key: "fashion",    label: "Fashion"    },
    ],
  },
]

export const allCategoryPhotos: Photo[] = [
  // Portrait — Personal
  { id: 1,  src: "/photos/portrait/personal/1.jpg",    w: 600, h: 750, category: "portrait", sub: "personal"   },
  { id: 2,  src: "/photos/portrait/personal/2.jpg",    w: 800, h: 550, category: "portrait", sub: "personal"   },
  // Portrait — Graduation
  { id: 3,  src: "/photos/portrait/graduation/1.jpg",  w: 600, h: 800, category: "portrait", sub: "graduation" },
  { id: 4,  src: "/photos/portrait/graduation/2.jpg",  w: 700, h: 500, category: "portrait", sub: "graduation" },
  // Portrait — Couple
  { id: 5,  src: "/photos/portrait/couple/1.jpg",      w: 800, h: 450, category: "portrait", sub: "couple"     },
  { id: 6,  src: "/photos/portrait/couple/2.jpg",      w: 700, h: 900, category: "portrait", sub: "couple"     },
  // Portrait — Pre Wedding
  { id: 7,  src: "/photos/portrait/prewedding/1.jpg",  w: 800, h: 450, category: "portrait", sub: "prewedding" },
  { id: 8,  src: "/photos/portrait/prewedding/2.jpg",  w: 800, h: 600, category: "portrait", sub: "prewedding" },
  // Portrait — Wedding
  { id: 9,  src: "/photos/portrait/wedding/1.jpg",     w: 600, h: 900, category: "portrait", sub: "wedding"    },
  { id: 10, src: "/photos/portrait/wedding/2.jpg",     w: 800, h: 450, category: "portrait", sub: "wedding"    },
  // Event & Trip
  { id: 11, src: "/photos/event/1.jpg",                w: 500, h: 800, category: "event" },
  { id: 12, src: "/photos/event/2.jpg",                w: 800, h: 450, category: "event" },
  { id: 13, src: "/photos/event/3.jpg",                w: 550, h: 820, category: "event" },
  { id: 14, src: "/photos/event/4.jpg",                w: 800, h: 450, category: "event" },
  { id: 15, src: "/photos/event/5.jpg",                w: 640, h: 960, category: "event" },
  { id: 16, src: "/photos/event/6.jpg",                w: 750, h: 500, category: "event" },
  { id: 17, src: "/photos/event/7.jpg",                w: 800, h: 450, category: "event" },
  // Product — Commercial
  { id: 18, src: "/photos/product/commercial/1.jpg",   w: 820, h: 550, category: "product", sub: "commercial" },
  { id: 19, src: "/photos/product/commercial/2.jpg",   w: 580, h: 870, category: "product", sub: "commercial" },
  // Product — Culinary
  { id: 20, src: "/photos/product/culinary/1.jpg",     w: 800, h: 450, category: "product", sub: "culinary"   },
  // Product — Fashion (akan diupload menyusul)
  // Product — Lifestyle (akan diupload menyusul)
]
