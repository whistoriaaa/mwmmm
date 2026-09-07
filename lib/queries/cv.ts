import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { cv, type CvData } from "@/lib/db/schema"

export const EMPTY_CV: CvData = {
  headline: "",
  summary: "",
  location: "",
  email: "",
  phone: "",
  links: [],
  experience: [],
  education: [],
  skills: [],
  services: [],
}

/** Ambil data CV (baris tunggal id=1). */
export async function getCv(): Promise<CvData> {
  const row = await db.query.cv.findFirst({ where: eq(cv.id, 1) })
  return { ...EMPTY_CV, ...(row?.data ?? {}) }
}

/** True bila CV punya isi yang layak ditampilkan. */
export function cvHasContent(d: CvData): boolean {
  return Boolean(
    d.summary ||
      (d.experience && d.experience.length) ||
      (d.education && d.education.length) ||
      (d.skills && d.skills.length),
  )
}
