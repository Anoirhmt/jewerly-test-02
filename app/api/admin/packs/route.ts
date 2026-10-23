import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { packsProducts } from "@/data/packs-products"
import { PACKS_TAG, PACKS_VPS, fetchVpsPacks } from "@/lib/packs"
import { requireAdmin, vpsAuth } from "@/lib/admin-session"

// Dashboard (/anoir/packs) API. Needs the dashboard login; the VPS checks the admin password on every save.

export const dynamic = "force-dynamic"

export async function GET() {
  const packs = await fetchVpsPacks({ cache: "no-store" })
  return NextResponse.json({ packs: packs ?? packsProducts, source: packs ? "vps" : "file" })
}

export async function POST(req: Request) {
  const denied = await requireAdmin(req)
  if (denied) return denied
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "json" }, { status: 400 })
  }
  try {
    const r = await fetch(`${PACKS_VPS}/api/packs/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: vpsAuth() },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    })
    const data = await r.json()
    if (r.ok && data.ok) {
      revalidateTag(PACKS_TAG)
      revalidatePath("/offre/[id]", "page")
      revalidatePath("/offre")
      revalidatePath("/packs")
    }
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: "vps" }, { status: 502 })
  }
}
