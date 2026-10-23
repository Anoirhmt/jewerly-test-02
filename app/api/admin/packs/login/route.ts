import { NextResponse } from "next/server"
import { PACKS_VPS } from "@/lib/packs"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string }
    const r = await fetch(`${PACKS_VPS}/api/packs/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: String(password ?? "") }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    })
    return NextResponse.json(await r.json(), { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: "vps" }, { status: 502 })
  }
}
