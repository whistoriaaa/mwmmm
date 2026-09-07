import { readFileSync, writeFileSync } from "node:fs"
import { processPhoto } from "../lib/storage/images.ts"

const src = process.argv[2] ?? "public/photos/portrait/graduation/aira/1.jpg"
const buf = readFileSync(src)
console.log(`Sumber: ${src}  ${(buf.length / 1024 / 1024).toFixed(2)} MB`)

const t0 = Date.now()
const r = await processPhoto(buf)
console.log(`\nProses ${Date.now() - t0}ms — master ${r.width}×${r.height} (${r.origFormat})`)
let total = 0
for (const v of r.variants) {
  total += v.bytes ?? 0
  console.log(`  ${String(v.w).padStart(4)}.${v.fmt}   ${((v.bytes ?? 0) / 1024).toFixed(1)} KB`)
}
console.log(`  total varian: ${(total / 1024).toFixed(0)} KB`)
console.log(`  blur data URL: ${r.blurDataUrl.length} char`)

const sample = r.variants.find((v) => v.w === Math.min(1080, r.width) && v.fmt === "avif")
if (sample) {
  writeFileSync(`${process.env.TEMP || "."}/sample.avif`, sample.data)
  console.log(`\nContoh ditulis: ${process.env.TEMP}/sample.avif`)
}
process.exit(0)
