import { NextResponse } from "next/server"
import { PACKS_VPS } from "@/lib/packs"

// Photo upload from the dashboard → stored on the VPS → served at /api/pack-image/<name>.

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file")
    if (!(file instanceof Blob)) return NextResponse.json({ ok: false, error: "file" }, { status: 400 })
    const out = new FormData()
    out.append("password", String(form.get("password") ?? ""))
    out.append("file", file, "photo")
    const r = await fetch(`${PACKS_VPS}/api/packs/image`, { method: "POST", body: out, cache: "no-store", signal: AbortSignal.timeout(30000) })
    const data = (await r.json()) as { ok: boolean; name?: string; error?: string }
    if (data.ok && data.name) return NextResponse.json({ ok: true, url: `/api/pack-image/${data.name}` })
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: "vps" }, { status: 502 })
  }
}
