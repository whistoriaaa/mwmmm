/**
 * Cek koneksi & perilaku object storage.
 *   npm run storage:check
 */
import {
  listPrefix,
  uploadObject,
  objectExists,
  deleteObject,
  presignedGetUrl,
  publicUrl,
  S3_BUCKET,
  S3_PREFIX,
} from "../lib/storage.ts"

async function main() {
  console.log(`Bucket: ${S3_BUCKET}   Prefix: ${S3_PREFIX || "(none)"}\n`)

  console.log("→ List root app (delimiter '/')")
  const root = await listPrefix("", { delimiter: "/" })
  console.log("  folders:", root.folders.length ? root.folders : "(kosong)")
  console.log("  objects:", root.objects.slice(0, 10).map(o => `${o.path} (${o.size}b)`))

  const path = `_healthcheck/${Date.now()}.txt`
  console.log(`\n→ Upload ${path}`)
  await uploadObject({
    path,
    body: `ok ${new Date().toISOString()}`,
    contentType: "text/plain",
    cacheControl: "no-store",
  })
  console.log("  ok")

  console.log(`\n→ objectExists(${path}) =`, await objectExists(path))

  const signed = await presignedGetUrl(path, 120)
  const rSigned = await fetch(signed)
  console.log(`\n→ Presigned GET: HTTP ${rSigned.status} — "${(await rSigned.text()).slice(0, 40)}"`)

  try {
    const pub = publicUrl(path)
    const rPub = await fetch(pub)
    console.log(`→ Public GET (${pub}): HTTP ${rPub.status}`)
    console.log(
      rPub.ok
        ? "  ✓ Public-read — bisa dipakai langsung sebagai src <Image>."
        : "  ✗ Bukan public-read — baca lewat route handler Next / presigned / CDN.",
    )
  } catch (e) {
    console.log("→ Public URL skip:", (e as Error).message)
  }

  await deleteObject(path)
  console.log(`\n→ Hapus ${path} — objectExists =`, await objectExists(path))
  console.log("\nSelesai.")
}

main().catch(e => {
  console.error("\nGAGAL:", e)
  process.exit(1)
})
