"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Gift, Loader2, Minus, Plus, ShieldCheck, Star, Truck, Wallet, X } from "lucide-react"
import type { Product } from "@/data/products"
import { formatPrice } from "@/utils/format-price"
import { track } from "@/lib/fb-pixel"

// Hidden landing page for Facebook ads: every pack as a big card, ordered in two taps from a
// bottom sheet. Orders go to the same Google Sheet as the product page's quick-order form.

const ORDER_URL =
  "https://script.google.com/macros/s/AKfycbyQagx3a8x5-vfVy1afXcWSa0gdTJupjvFoJ6Jn8k3qt1Hp-KRYC6eZTKbUPS-PmhsF/exec"
const WHATSAPP = "212693011454"
const LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whisk_10ef3247e2%20-%20Copy-modified-gLXRu1tXPExbkNdyd4KaSz6Sd1TkhC.png"
const BRAND = "#9b5c5c"

const CITIES = [
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
const colorInfo = (c: string) => COLORS[c.toLowerCase()] ?? { ar: c, fr: c, hex: "#cbd5e1" }

const hasArabic = (s: string) => /[؀-ۿ]/.test(s)

// Pack names in the catalogue are internal ("pack4+BOITE"); show customers something friendlier.
function packTitles(p: Product) {
  const box = /bo[iî]te/i.test(p.name)
  const n = /pack\s*(\d+)/i.exec(p.name)?.[1]
  if (hasArabic(p.description)) {
    return { ar: p.description.replace(/\s*\d+\s*(dh|درهم)\s*$/i, "").trim(), fr: p.name.replace(/\s*\d+\s*dh\s*$/i, ""), box }
  }
  return {
    ar: n ? `باك ${n}` : "باك مجوهرات",
    fr: n ? `Pack ${n}${box ? " + boîte cadeau" : ""}` : p.name,
    box,
  }
}

type Card = { p: Product; t: ReturnType<typeof packTitles> }

export function OffrePage({ packs, featuredId, arabicFont }: { packs: Product[]; featuredId: number | null; arabicFont: string }) {
  const cards = useMemo<Card[]>(() => {
    const list = packs.map((p) => ({ p, t: packTitles(p) }))
    // An ad can open the page on its own pack: ?pack=211 puts it first.
    if (featuredId) list.sort((a, b) => Number(b.p.id === featuredId) - Number(a.p.id === featuredId))
    return list
  }, [packs, featuredId])

  const [colorOf, setColorOf] = useState<Record<number, string>>({})
  const [ordering, setOrdering] = useState<Card | null>(null)
  const avgRating = useMemo(() => {
    const r = packs.filter((p) => p.rating)
    return r.length ? (r.reduce((s, p) => s + (p.rating ?? 0), 0) / r.length).toFixed(1) : "4.8"
  }, [packs])

  useEffect(() => {
    const f = cards[0]
    if (featuredId && f) track("ViewContent", { content_ids: [String(f.p.id)], content_type: "product", value: f.p.price, currency: "MAD" })
  }, [cards, featuredId])

  function open(card: Card) {
    setOrdering(card)
    track("InitiateCheckout", { content_ids: [String(card.p.id)], value: card.p.price, currency: "MAD", num_items: 1 })
  }

  return (
    <div dir="rtl" lang="ar" className={`${arabicFont} min-h-screen bg-[#faf6f4] text-neutral-900`}>
      {/* Promise bar */}
      <div className="overflow-hidden bg-[#9b5c5c] py-2 text-white">
        <div className="flex animate-[offre-marquee_22s_linear_infinite] gap-10 whitespace-nowrap text-[13px] font-medium">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-10">
              <span>🚚 التوصيل مجاني لجميع المدن</span>
              <span>💵 الدفع عند الاستلام</span>
              <span dir="ltr">Livraison 0 DH · Paiement à la livraison</span>
            </span>
          ))}
        </div>
      </div>

      <header className="mx-auto max-w-5xl px-5 pb-2 pt-6 text-center">
        <img src={LOGO_URL} alt="Elarain Jewelry" className="mx-auto h-14 w-14 rounded-full object-contain" />
        <h1 className="mt-4 text-[28px] font-bold leading-tight sm:text-4xl">عروض خاصة ✨ اختاري الباك ديالك</h1>
        <p className="mt-1 font-[family-name:var(--font-playfair)] text-[15px] italic text-neutral-500" dir="ltr">
          Offres spéciales — choisissez votre pack
        </p>
        <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2 text-[12px]">
          {[
            { icon: <Truck size={16} />, ar: "توصيل مجاني", fr: "Livraison 0 DH" },
            { icon: <Wallet size={16} />, ar: "الدفع عند الاستلام", fr: "Paiement à la livraison" },
            { icon: <Star size={16} className="fill-current" />, ar: `${avgRating} / 5`, fr: "Avis clients" },
          ].map((b) => (
            <div key={b.fr} className="rounded-2xl bg-white px-2 py-3 shadow-[0_6px_20px_-12px_rgba(155,92,92,0.5)]">
              <span className="mx-auto grid size-8 place-items-center rounded-full bg-[#9b5c5c]/10 text-[#9b5c5c]">{b.icon}</span>
              <p className="mt-1.5 font-bold leading-tight">{b.ar}</p>
              <p className="text-[10.5px] text-neutral-500" dir="ltr">{b.fr}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-4 pb-28 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const { p, t } = card
          const featured = featuredId === p.id && i === 0
          const color = colorOf[p.id] ?? p.variants?.[0]?.color
          const image = p.variants?.find((v) => v.color === color)?.image ?? p.image
          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`overflow-hidden rounded-[26px] bg-white shadow-[0_18px_40px_-24px_rgba(80,40,40,0.45)] ${
                featured ? "ring-2 ring-[#9b5c5c] sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <button type="button" onClick={() => open({ p, t })} className="relative block w-full" aria-label={`Commander ${t.fr}`}>
                <img src={image} alt={t.fr} loading={i < 2 ? "eager" : "lazy"} className="aspect-square w-full object-cover" />
                <div className="absolute inset-x-3 top-3 flex flex-wrap justify-start gap-1.5">
                  {featured && <span className="rounded-full bg-[#9b5c5c] px-3 py-1 text-[12px] font-bold text-white shadow">🔥 العرض ديالك</span>}
                  {t.box && (
                    <span className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-[#9b5c5c] shadow">
                      <Gift size={13} /> علبة هدية مجانية
                    </span>
                  )}
                </div>
              </button>

              <div className="p-4 pt-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-bold leading-snug">{t.ar}</h2>
                    <p className="mt-0.5 truncate text-[12.5px] text-neutral-500" dir="ltr">{t.fr}</p>
                  </div>
                  <p className="shrink-0 text-left" dir="ltr">
                    {p.originalPrice && p.originalPrice > p.price ? (
                      <span className="block text-[12px] text-neutral-400 line-through">{p.originalPrice} DH</span>
                    ) : null}
                    <span className="block text-[24px] font-extrabold leading-none" style={{ color: BRAND }}>{p.price}</span>
                    <span className="text-[11px] font-semibold text-neutral-500">DH</span>
                  </p>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <span className="flex text-amber-400" dir="ltr">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={13} className={s < Math.round(p.rating ?? 5) ? "fill-current" : ""} />
                    ))}
                  </span>
                  {p.reviews ? <span>({p.reviews})</span> : null}
                  <span className="mr-auto rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">التوصيل مجاني</span>
                </div>

                {p.variants && p.variants.length > 1 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[12px] text-neutral-500">اللون:</span>
                    {p.variants.map((v) => {
                      const c = colorInfo(v.color)
                      const on = v.color === color
                      return (
                        <button
                          key={v.color}
                          type="button"
                          onClick={() => setColorOf((m) => ({ ...m, [p.id]: v.color }))}
                          title={`${c.ar} · ${c.fr}`}
                          aria-pressed={on}
                          className={`size-7 rounded-full border-2 transition ${on ? "scale-110 border-[#9b5c5c]" : "border-white shadow"}`}
                          style={{ background: c.hex }}
                        />
                      )
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => open({ p, t })}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-[16px] font-bold text-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6)] transition active:scale-[0.98]"
                >
                  اطلبي الآن
                  <span className="text-[12px] font-medium text-white/70" dir="ltr">· Commander</span>
                </button>
              </div>
            </motion.article>
          )
        })}
      </main>

      <footer className="pb-24 text-center text-[12px] text-neutral-400">
        <p>© {new Date().getFullYear()} Elarain Jewelry</p>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-[#25D366] shadow-lg"
      >
        <svg viewBox="0 0 24 24" fill="white" className="size-8" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <AnimatePresence>
        {ordering && (
          <OrderSheet
            key={ordering.p.id}
            card={ordering}
            color={colorOf[ordering.p.id] ?? ordering.p.variants?.[0]?.color}
            onClose={() => setOrdering(null)}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes offre-marquee { from { transform: translateX(0) } to { transform: translateX(50%) } }`}</style>
    </div>
  )
}

function OrderSheet({ card, color, onClose }: { card: Card; color: string | undefined; onClose: () => void }) {
  const { p, t } = card
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" })
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<{ name: string; ref: string } | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const image = p.variants?.find((v) => v.color === color)?.image ?? p.image
  const total = p.price * qty
  const c = color ? colorInfo(color) : null

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const timer = setTimeout(() => nameRef.current?.focus(), 350)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(timer)
    }
  }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value
    if (k === "phone") v = v.replace(/\D/g, "").slice(0, 10)
    setForm((f) => ({ ...f, [k]: v }))
    setError("")
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError("عافاك كتبي الاسم ديالك")
    if (!/^0[5-7]\d{8}$/.test(form.phone)) return setError("رقم الهاتف خاصو يكون 10 أرقام، بحال 0612345678")
    if (form.city.trim().length < 2) return setError("عافاك كتبي المدينة")
    setBusy(true)
    setError("")
    const details = `${t.fr}${c ? ` (${c.fr})` : ""} x${qty} (${formatPrice(total)})`
    const params = new URLSearchParams()
    params.append("nom et prenom", form.name.trim())
    params.append("Téléphone", form.phone)
    params.append("Adresse", `${form.address.trim() || "—"}, ${form.city.trim()}`)
    params.append("Détails de commande", details)
    params.append("TOTAL", formatPrice(total))
    params.append("delivery", formatPrice(0))
    try {
      await fetch(ORDER_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      })
      track("Purchase", { content_ids: [String(p.id)], content_type: "product", value: total, currency: "MAD", num_items: qty })
      setDone({ name: form.name.trim().split(/\s+/)[0] ?? "", ref: `EL${Math.floor(100000 + Math.random() * 900000)}` })
    } catch {
      setError("وقع مشكل فالاتصال. عاودي المحاولة")
    } finally {
      setBusy(false)
    }
  }

  const input =
    "w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-[16px] outline-none transition focus:border-[#9b5c5c] focus:bg-white focus:ring-4 focus:ring-[#9b5c5c]/15"

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92vh] max-w-lg overflow-y-auto rounded-t-[30px] bg-white pb-[max(env(safe-area-inset-bottom),16px)] shadow-2xl sm:bottom-6 sm:rounded-[30px]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
      >
        <div className="sticky top-0 z-10 bg-white px-5 pb-3 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-neutral-200" />
          <button type="button" onClick={onClose} aria-label="Fermer" className="absolute left-4 top-3 grid size-9 place-items-center rounded-full bg-neutral-100 text-neutral-500">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="px-6 pb-8 pt-2 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>
            <h3 className="mt-5 text-2xl font-bold">شكراً {done.name}! 💝</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
              توصلنا بالطلب ديالك. غادي نتاصلو بيك قريب فالهاتف باش نأكدو معاك التوصيل.
            </p>
            <p className="mt-1 text-[13px] text-neutral-400" dir="ltr">
              Commande reçue · Réf. {done.ref}
            </p>
            <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-right text-[14px]">
              <p className="font-bold">{t.ar}</p>
              <p className="text-neutral-500">
                {qty} × {formatPrice(p.price)} · <b className="text-neutral-900">{formatPrice(total)}</b> · التوصيل مجاني
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`سلام، طلبت ${t.ar} (Réf. ${done.ref})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-bold text-white"
            >
              تواصلي معنا فواتساب
            </a>
            <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-[14px] font-medium text-neutral-500">
              شوفي عروض أخرى
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 pb-6">
            <div className="flex items-center gap-3 rounded-2xl bg-[#faf6f4] p-3">
              <img src={image} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{t.ar}</p>
                <p className="truncate text-[12px] text-neutral-500" dir="ltr">
                  {t.fr}
                  {c ? ` · ${c.fr}` : ""}
                </p>
                <p className="mt-0.5 text-[15px] font-extrabold" style={{ color: BRAND }} dir="ltr">
                  {formatPrice(total)}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm" dir="ltr">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Moins" className="grid size-8 place-items-center rounded-full text-neutral-600 active:bg-neutral-100">
                  <Minus size={15} />
                </button>
                <span className="w-5 text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(5, q + 1))} aria-label="Plus" className="grid size-8 place-items-center rounded-full text-neutral-600 active:bg-neutral-100">
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <h3 className="mt-5 text-xl font-bold">معلومات التوصيل</h3>
            <p className="text-[13px] text-neutral-500">ماكتخلصي حتى توصلك السلعة 💵</p>

            <div className="mt-4 space-y-3">
              <input ref={nameRef} className={input} value={form.name} onChange={set("name")} placeholder="الاسم الكامل" autoComplete="name" />
              <input
                className={`${input} text-right`}
                value={form.phone}
                onChange={set("phone")}
                placeholder="رقم الهاتف · 06XXXXXXXX"
                inputMode="numeric"
                autoComplete="tel"
              />
              <input className={input} value={form.city} onChange={set("city")} placeholder="المدينة" list="offre-cities" autoComplete="address-level2" />
              <datalist id="offre-cities">
                {CITIES.map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
              <input className={input} value={form.address} onChange={set("address")} placeholder="العنوان (اختياري)" autoComplete="street-address" />
            </div>

            {error && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-[14px] font-medium text-rose-700">{error}</p>}

            <button
              disabled={busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[17px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(155,92,92,0.9)] transition active:scale-[0.98] disabled:opacity-70"
              style={{ background: BRAND }}
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : null}
              {busy ? "جاري الإرسال…" : `تأكيد الطلب · ${formatPrice(total)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-neutral-500">
              <ShieldCheck size={14} className="text-emerald-600" /> التوصيل مجاني · الدفع عند الاستلام
            </p>
          </form>
        )}
      </motion.div>
    </>
  )
}
