/**
 * Object storage (S3-compatible — Sumopod / Cloudeka).
 *
 * SERVER-ONLY. Jangan pernah impor file ini dari komponen client —
 * berisi kredensial rahasia (S3_SECRET_ACCESS_KEY).
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  type ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import type { Readable } from "node:stream"

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Env ${name} belum diisi (lihat .env.example)`)
  return v
}

export const S3_BUCKET = required("S3_BUCKET")
const PUBLIC_BASE = (process.env.S3_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "")

let _client: S3Client | null = null

/** Client S3 tunggal (lazy). */
export function s3(): S3Client {
  if (_client) return _client
  _client = new S3Client({
    region: required("S3_REGION"),
    endpoint: required("S3_ENDPOINT"),
    // Ceph / Cloudeka butuh path-style (bucket di path, bukan subdomain).
    forcePathStyle: true,
    credentials: {
      accessKeyId: required("S3_ACCESS_KEY_ID"),
      secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    },
  })
  return _client
}

/** Normalisasi key: buang leading slash, rapikan double slash. */
export function normalizeKey(key: string): string {
  return key.replace(/^\/+/, "").replace(/\/{2,}/g, "/")
}

/** URL publik objek (butuh S3_PUBLIC_BASE_URL + bucket public-read). */
export function publicUrl(key: string): string {
  if (!PUBLIC_BASE) throw new Error("S3_PUBLIC_BASE_URL belum diisi")
  return `${PUBLIC_BASE}/${normalizeKey(key)}`
}

type UploadBody = Buffer | Uint8Array | string | Readable | Blob

/** Upload satu objek. Otomatis multipart untuk file besar. */
export async function uploadObject(opts: {
  key: string
  body: UploadBody
  contentType?: string
  cacheControl?: string
  metadata?: Record<string, string>
}): Promise<{ key: string }> {
  const key = normalizeKey(opts.key)
  const upload = new Upload({
    client: s3(),
    params: {
      Bucket: S3_BUCKET,
      Key: key,
      Body: opts.body as never,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
      Metadata: opts.metadata,
    },
  })
  await upload.done()
  return { key }
}

/** Upload sederhana (non-multipart) — untuk objek kecil / teks. */
export async function putObject(opts: {
  key: string
  body: UploadBody
  contentType?: string
  cacheControl?: string
}): Promise<{ key: string }> {
  const key = normalizeKey(opts.key)
  await s3().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: opts.body as never,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl,
    }),
  )
  return { key }
}

export async function deleteObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: normalizeKey(key) }))
}

export async function deleteObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return
  // API batas 1000 per request
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000)
    await s3().send(
      new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: { Objects: chunk.map(k => ({ Key: normalizeKey(k) })) },
      }),
    )
  }
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: normalizeKey(key) }))
    return true
  } catch (e) {
    const err = e as { name?: string; $metadata?: { httpStatusCode?: number } }
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) return false
    throw e
  }
}

export interface ListedObject {
  key: string
  size: number
  lastModified?: Date
}

/**
 * List objek di bawah prefix. Dengan delimiter "/" mengembalikan juga
 * "folder" (commonPrefixes) — dipakai untuk navigasi CMS.
 */
export async function listPrefix(
  prefix = "",
  opts: { delimiter?: string; maxKeys?: number } = {},
): Promise<{ objects: ListedObject[]; folders: string[] }> {
  const objects: ListedObject[] = []
  const folders = new Set<string>()
  let token: string | undefined

  do {
    const res: ListObjectsV2CommandOutput = await s3().send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: normalizeKey(prefix),
        Delimiter: opts.delimiter,
        ContinuationToken: token,
        MaxKeys: opts.maxKeys,
      }),
    )
    for (const o of res.Contents ?? []) {
      if (o.Key) objects.push({ key: o.Key, size: o.Size ?? 0, lastModified: o.LastModified })
    }
    for (const p of res.CommonPrefixes ?? []) {
      if (p.Prefix) folders.add(p.Prefix)
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  return { objects, folders: [...folders].sort() }
}

/** Presigned URL untuk baca (private bucket / akses sementara). */
export function presignedGetUrl(key: string, expiresInSec = 3600): Promise<string> {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: normalizeKey(key) }),
    { expiresIn: expiresInSec },
  )
}

/** Presigned URL untuk upload langsung dari browser (opsional). */
export function presignedPutUrl(
  key: string,
  contentType: string,
  expiresInSec = 900,
): Promise<string> {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: S3_BUCKET, Key: normalizeKey(key), ContentType: contentType }),
    { expiresIn: expiresInSec },
  )
}
