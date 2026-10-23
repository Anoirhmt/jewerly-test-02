import { PACKS_VPS } from "@/lib/packs"

// Pack photos uploaded from the dashboard live on the VPS (plain HTTP); this serves them over
// HTTPS. Names are random and never reused, so browsers and Vercel's CDN can keep them forever.

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  if (!/^[0-9a-f]{20}\.(jpg|png|webp)$/.test(params.name)) return new Response("Not found", { status: 404 })
  try {
    const r = await fetch(`${PACKS_VPS}/api/packs/image/${params.name}`, { signal: AbortSignal.timeout(10000) })
    if (!r.ok) return new Response("Not found", { status: 404 })
    return new Response(r.body, {
      headers: {
        "Content-Type": r.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new Response("Unavailable", { status: 502 })
  }
}
