/**
 * Cek koneksi & perilaku object storage.
 *   node --env-file=.env.local scripts/storage-check.ts
 */
import {
  listPrefix,
  uploadObject,
  objectExists,
  deleteObject,
  presignedGetUrl,
  publicUrl,
  S3_BUCKET,
} from "../lib/storage.ts"

async function main() {
  console.log(`Bucket: ${S3_BUCKET}\n`)

  // 1. List root
  console.log("→ List root (delimiter '/')")
  const root = await listPrefix("", { delimiter: "/" })
  console.log("  folders:", root.folders.length ? root.folders : "(kosong)")
  console.log("  objects:", root.objects.slice(0, 10).map(o => `${o.key} (${o.size}b)`))

  // 2. Upload objek uji
  const key = `_healthcheck/${Date.now()}.txt`
  console.log(`\n→ Upload ${key}`)
  await uploadObject({
    key,
    body: `ok ${new Date().toISOString()}`,
    contentType: "text/plain",
    cacheControl: "no-store",
  })
  console.log("  ok")

  // 3. Head
  console.log(`\n→ objectExists(${key}) =`, await objectExists(key))

  // 4. Presigned GET
  const signed = await presignedGetUrl(key, 120)
  const rSigned = await fetch(signed)
  console.log(`\n→ Presigned GET: HTTP ${rSigned.status} — "${(await rSigned.text()).slice(0, 40)}"`)

  // 5. Public URL (apakah bucket public-read?)
  try {
    const pub = publicUrl(key)
    const rPub = await fetch(pub)
    console.log(`→ Public GET (${pub}): HTTP ${rPub.status}`)
    console.log(
      rPub.ok
        ? "  ✓ Bucket PUBLIC-READ — bisa dipakai langsung sebagai src <Image>."
        : "  ✗ Bukan public-read — perlu serve lewat route Next / presigned / CDN.",
    )
  } catch (e) {
    console.log("→ Public URL skip:", (e as Error).message)
  }

  // 6. Cleanup
  await deleteObject(key)
  console.log(`\n→ Hapus ${key} — objectExists =`, await objectExists(key))
  console.log("\nSelesai.")
}

main().catch(e => {
  console.error("\nGAGAL:", e)
  process.exit(1)
})
