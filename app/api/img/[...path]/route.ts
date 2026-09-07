import { Readable } from "node:stream"
import { getObjectStream } from "@/lib/storage"

const ALLOWED = /^(photos|articles|cv)\//

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  const key = path.map(decodeURIComponent).join("/")

  if (!ALLOWED.test(key) || key.includes("..")) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const obj = await getObjectStream(key)
    const body = Readable.toWeb(obj.body) as ReadableStream
    return new Response(body, {
      headers: {
        "Content-Type": obj.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(obj.contentLength ? { "Content-Length": String(obj.contentLength) } : {}),
        ...(obj.etag ? { ETag: obj.etag } : {}),
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
