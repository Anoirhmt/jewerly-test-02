import { packsProducts } from "@/data/packs-products"
import type { Product } from "@/data/products"

// Pack prices, stock and new packs are edited at /anoir/packs and stored on the VPS.
// data/packs-products.ts is only the fallback when the VPS can't be reached.

// PACKS_VPS_URL lets a local test run point at a test server instead of the real one.
export const PACKS_VPS = process.env.PACKS_VPS_URL || "http://195.201.96.39:5000"
export const PACKS_TAG = "packs"

export async function fetchVpsPacks(init?: RequestInit): Promise<Product[] | null> {
  try {
    const r = await fetch(`${PACKS_VPS}/api/packs`, { signal: AbortSignal.timeout(5000), ...init })
    if (!r.ok) return null
    const d = (await r.json()) as { packs: Product[] | null }
    return Array.isArray(d.packs) && d.packs.length ? d.packs : null
  } catch {
    return null
  }
}

// Cached for 5 minutes; saving in the dashboard clears the cache right away.
export async function getPacks(): Promise<Product[]> {
  return (await fetchVpsPacks({ next: { tags: [PACKS_TAG], revalidate: 300 } })) ?? packsProducts
}
