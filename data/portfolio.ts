import type { Item, PotraitSub, ProductSub } from "@/types/gallery"

export const potraitSubs: { key: PotraitSub; label: string }[] = [
  { key: "wedding",    label: "Wedding"           },
  { key: "graduation", label: "Graduation"         },
  { key: "personal",   label: "Personal Photoshot" },
  { key: "couple",     label: "Couple Session"     },
]

export const productSubs: { key: ProductSub; label: string }[] = [
  { key: "commercial", label: "Commercial" },
  { key: "culinary",   label: "Culinary"   },
  { key: "fashion",    label: "Fashion"    },
  { key: "lifestyle",  label: "Lifestyle"  },
]

export const allPhotos: Item[] = [
  // Potrait — Wedding
  { id: 1,  src: "/photos/portrait/wedding/1.jpg",    w: 600, h: 900, category: "potrait", subCategory: "wedding",    type: "photo", highlight: true  },
  { id: 2,  src: "/photos/portrait/wedding/2.jpg",    w: 800, h: 450, category: "potrait", subCategory: "wedding",    type: "photo", highlight: false },
  // Potrait — Graduation
  { id: 3,  src: "/photos/portrait/graduation/1.jpg", w: 600, h: 800, category: "potrait", subCategory: "graduation", type: "photo", highlight: true  },
  { id: 4,  src: "/photos/portrait/graduation/2.jpg", w: 700, h: 500, category: "potrait", subCategory: "graduation", type: "photo", highlight: false },
  // Potrait — Personal
  { id: 9,  src: "/photos/portrait/personal/1.jpg",   w: 600, h: 750, category: "potrait", subCategory: "personal",   type: "photo", highlight: true  },
  { id: 10, src: "/photos/portrait/personal/2.jpg",   w: 800, h: 550, category: "potrait", subCategory: "personal",   type: "photo", highlight: false },
  // Potrait — Couple
  { id: 11, src: "/photos/portrait/couple/1.jpg",     w: 800, h: 450, category: "potrait", subCategory: "couple",     type: "photo", highlight: false },
  { id: 12, src: "/photos/portrait/couple/2.jpg",     w: 700, h: 900, category: "potrait", subCategory: "couple",     type: "photo", highlight: true  },
  // Event
  { id: 7,  src: "/photos/event/1.jpg",               w: 500, h: 800, category: "event",   type: "photo", highlight: false },
  { id: 8,  src: "/photos/event/2.jpg",               w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  { id: 13, src: "/photos/event/3.jpg",               w: 550, h: 820, category: "event",   type: "photo", highlight: true  },
  { id: 14, src: "/photos/event/4.jpg",               w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  { id: 15, src: "/photos/event/5.jpg",               w: 640, h: 960, category: "event",   type: "photo", highlight: false },
  { id: 16, src: "/photos/event/6.jpg",               w: 750, h: 500, category: "event",   type: "photo", highlight: false },
  { id: 17, src: "/photos/event/7.jpg",               w: 800, h: 450, category: "event",   type: "photo", highlight: false },
  // Product — Commercial
  { id: 18, src: "/photos/product/commercial/1.jpg",  w: 820, h: 550, category: "product", subCategory: "commercial", type: "photo", highlight: true  },
  { id: 19, src: "/photos/product/commercial/2.jpg",  w: 580, h: 870, category: "product", subCategory: "commercial", type: "photo", highlight: false },
  // Product — Culinary
  { id: 20, src: "/photos/product/culinary/1.jpg",    w: 800, h: 450, category: "product", subCategory: "culinary",   type: "photo", highlight: false },
]
