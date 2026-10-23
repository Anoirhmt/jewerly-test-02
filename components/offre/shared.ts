import type { Product } from "@/data/products"
import { formatPrice } from "@/utils/format-price"

// Shared by the /offre list and the per-pack landing pages (/offre/[id]).

export const ORDER_URL =
  "https://script.google.com/macros/s/AKfycbyQagx3a8x5-vfVy1afXcWSa0gdTJupjvFoJ6Jn8k3qt1Hp-KRYC6eZTKbUPS-PmhsF/exec"
export const WHATSAPP = "212693011454"
export const LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png"
export const BRAND = "#9b5c5c"

export const CITIES = [
  "Casablanca", "Rabat", "Salé", "Témara", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
  "Kénitra", "Tétouan", "El Jadida", "Safi", "Mohammedia", "Beni Mellal", "Nador", "Khouribga", "Settat",
  "Larache", "Taza", "Khémisset", "Berrechid", "Inezgane", "Taroudant", "Essaouira", "Tiznit", "Errachidia",
]

const COLORS: Record<string, { ar: string; fr: string; hex: string }> = {
  white: { ar: "فضي", fr: "Argent", hex: "#e5e7eb" },
  silver: { ar: "فضي", fr: "Argent", hex: "#d1d5db" },
  gold: { ar: "ذهبي", fr: "Doré", hex: "#d4a64a" },
  rose: { ar: "وردي", fr: "Rose", hex: "#e7a6a1" },
  red: { ar: "أحمر", fr: "Rouge", hex: "#b91c1c" },
  black: { ar: "أسود", fr: "Noir", hex: "#111827" },
}
export const colorInfo = (c: string) => COLORS[c.toLowerCase()] ?? { ar: c, fr: c, hex: "#cbd5e1" }

const hasArabic = (s: string) => /[؀-ۿ]/.test(s)

export type PackTitles = { ar: string; fr: string; box: boolean }

// Pack names in the catalogue are internal ("pack4+BOITE"); show customers something friendlier.
export function packTitles(p: Product): PackTitles {
  const box = /bo[iî]te/i.test(p.name)
  const n = /pack\s*(\d+)/i.exec(p.name)?.[1]
  if (p.titleAr?.trim()) {
    return { ar: p.titleAr.trim(), fr: n ? `Pack ${n}${box ? " + boîte cadeau" : ""}` : p.name, box }
  }
  if (hasArabic(p.description)) {
    return { ar: p.description.replace(/\s*\d+\s*(dh|درهم)\s*$/i, "").trim(), fr: p.name.replace(/\s*\d+\s*dh\s*$/i, ""), box }
  }
  return {
    ar: n ? `باك ${n}` : "باك مجوهرات",
    fr: n ? `Pack ${n}${box ? " + boîte cadeau" : ""}` : p.name,
    box,
  }
}

export const imageFor = (p: Product, color: string | undefined) => p.variants?.find((v) => v.color === color)?.image ?? p.image ?? ""

export type OrderInput = { name: string; phone: string; city: string; address: string }

// Same fields as the product page's quick-order form, so orders land in the same Google Sheet.
export async function sendOrder(p: Product, t: PackTitles, color: string | undefined, qty: number, f: OrderInput) {
  const total = p.price * qty
  const c = color ? colorInfo(color) : null
  const params = new URLSearchParams()
  params.append("nom et prenom", f.name.trim())
  params.append("Téléphone", f.phone)
  params.append("Adresse", `${f.address.trim() || "—"}, ${f.city.trim()}`)
  params.append("Détails de commande", `${t.fr}${c ? ` (${c.fr})` : ""} x${qty} (${formatPrice(total)})`)
  params.append("TOTAL", formatPrice(total))
  params.append("delivery", formatPrice(0))
  await fetch(ORDER_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })
  return `EL${Math.floor(100000 + Math.random() * 900000)}`
}
