/**
 * Object storage (S3-compatible — Sumopod / Cloudeka).
 *
 * SERVER-ONLY. Jangan pernah impor file ini dari komponen client —
 * berisi kredensial rahasia (S3_SECRET_ACCESS_KEY).
 *
 * Semua fungsi menerima path RELATIF-APP (mis. "portrait/aira/1-1080.avif").
 * Prefix bucket (S3_PREFIX, mis. "wishtoria/") ditambahkan otomatis, dan
 * dilepas lagi dari hasil listPrefix — pemanggil tak perlu tahu prefix.
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
export const S3_PREFIX = (process.env.S3_PREFIX ?? "").replace(/^\/+|\/+$/g, "")
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

/** Rapikan path: buang leading slash & double slash. */
export function cleanPath(p: string): string {
  return p.replace(/^\/+/, "").replace(/\/{2,}/g, "/")
}

/** path relatif-app → key absolut di bucket (dengan S3_PREFIX). */
export function toKey(path: string): string {
  const p = cleanPath(path)
  return S3_PREFIX ? `${S3_PREFIX}/${p}` : p
}

/** key absolut → path relatif-app (tanpa S3_PREFIX). */
export function fromKey(key: string): string {
  const k = cleanPath(key)
  return S3_PREFIX && k.startsWith(`${S3_PREFIX}/`) ? k.slice(S3_PREFIX.length + 1) : k
}

/** URL publik objek (hanya jika bucket/prefix public-read). */
export function publicUrl(path: string): string {
  if (!PUBLIC_BASE) throw new Error("S3_PUBLIC_BASE_URL belum diisi")
  return `${PUBLIC_BASE}/${toKey(path)}`
}

type UploadBody = Buffer | Uint8Array | string | Readable | Blob

/** Upload satu objek. Otomatis multipart untuk file besar. */
export async function uploadObject(opts: {
  path: string
  body: UploadBody
  contentType?: string
  cacheControl?: string
  metadata?: Record<string, string>
}): Promise<{ path: string; key: string }> {
  const key = toKey(opts.path)
  await new Upload({
    client: s3(),
    params: {
      Bucket: S3_BUCKET,
      Key: key,
      Body: opts.body as never,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
      Metadata: opts.metadata,
    },
  }).done()
  return { path: cleanPath(opts.path), key }
}

export async function deleteObject(path: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: toKey(path) }))
}

export async function deleteObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return
  for (let i = 0; i < paths.length; i += 1000) {
    const chunk = paths.slice(i, i + 1000)
    await s3().send(
      new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: { Objects: chunk.map(p => ({ Key: toKey(p) })) },
      }),
    )
  }
}

export async function objectExists(path: string): Promise<boolean> {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: toKey(path) }))
    return true
  } catch (e) {
    const err = e as { name?: string; $metadata?: { httpStatusCode?: number } }
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) return false
    throw e
  }
}

export interface ListedObject {
  path: string
  size: number
  lastModified?: Date
}

/**
 * List objek di bawah path. delimiter "/" juga mengembalikan "folder"
 * (commonPrefixes). Semua path yang dikembalikan sudah relatif-app.
 */
export async function listPrefix(
  path = "",
  opts: { delimiter?: string; maxKeys?: number } = {},
): Promise<{ objects: ListedObject[]; folders: string[] }> {
  const objects: ListedObject[] = []
  const folders = new Set<string>()
  let token: string | undefined
  const prefix = toKey(path)

  do {
    const res: ListObjectsV2CommandOutput = await s3().send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix,
        Delimiter: opts.delimiter,
        ContinuationToken: token,
        MaxKeys: opts.maxKeys,
      }),
    )
    for (const o of res.Contents ?? []) {
      if (o.Key) objects.push({ path: fromKey(o.Key), size: o.Size ?? 0, lastModified: o.LastModified })
    }
    for (const p of res.CommonPrefixes ?? []) {
      if (p.Prefix) folders.add(fromKey(p.Prefix))
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)

  return { objects, folders: [...folders].sort() }
}

/** Presigned URL untuk baca (private bucket / akses sementara). */
export function presignedGetUrl(path: string, expiresInSec = 3600): Promise<string> {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: toKey(path) }),
    { expiresIn: expiresInSec },
  )
}

/** Presigned URL untuk upload langsung dari browser (opsional). */
export function presignedPutUrl(
  path: string,
  contentType: string,
  expiresInSec = 900,
): Promise<string> {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: S3_BUCKET, Key: toKey(path), ContentType: contentType }),
    { expiresIn: expiresInSec },
  )
}

/** Stream objek untuk route handler (baca private bucket ke client). */
export async function getObjectStream(path: string): Promise<{
  body: Readable
  contentType?: string
  contentLength?: number
  etag?: string
}> {
  const res = await s3().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: toKey(path) }))
  return {
    body: res.Body as Readable,
    contentType: res.ContentType,
    contentLength: res.ContentLength,
    etag: res.ETag,
  }
}
