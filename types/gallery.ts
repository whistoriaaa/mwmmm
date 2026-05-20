export type PotraitSub = "wedding" | "graduation" | "personal" | "couple"
export type ProductSub = "commercial" | "culinary" | "fashion" | "lifestyle"

export type Item = {
  id: number; src: string; w: number; h: number
  category:    "potrait" | "event" | "product"
  subCategory?: PotraitSub | ProductSub
  type:        "photo" | "video"
  highlight:   boolean
  date?:       string  // "YYYY-MM"
}

export const filters = ["all", "potrait", "event", "product"] as const
export type Filter = typeof filters[number]
