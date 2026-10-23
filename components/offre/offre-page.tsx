"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Gift, Star, Truck, Wallet, X } from "lucide-react"
import type { Product } from "@/data/products"
import { track } from "@/lib/fb-pixel"
import { OrderForm, type OrderFormHandle } from "./order-form"
import { BRAND, LOGO_URL, WHATSAPP, colorInfo, packTitles, type PackTitles } from "./shared"
import { WaIcon } from "./pack-landing"

// Hidden landing page for Facebook ads: every pack as a big card, ordered in two taps from a
// bottom sheet. Each photo opens that pack's own page (/offre/211).

type Card = { p: Product; t: PackTitles }

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
              <Link href={`/offre/${p.id}`} className="relative block w-full" aria-label={t.fr}>
                <img src={image} alt={t.fr} loading={i < 2 ? "eager" : "lazy"} className="aspect-square w-full object-cover" />
                <div className="absolute inset-x-3 top-3 flex flex-wrap justify-start gap-1.5">
                  {featured && <span className="rounded-full bg-[#9b5c5c] px-3 py-1 text-[12px] font-bold text-white shadow">🔥 العرض ديالك</span>}
                  {t.box && (
                    <span className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-[#9b5c5c] shadow">
                      <Gift size={13} /> علبة هدية مجانية
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4 pt-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-bold leading-snug"><Link href={`/offre/${p.id}`}>{t.ar}</Link></h2>
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
        <WaIcon className="size-8" />
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
  const form = useRef<OrderFormHandle>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const timer = setTimeout(() => form.current?.focus(), 350)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(timer)
    }
  }, [])

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
        <div className="px-5 pb-6">
          <OrderForm ref={form} pack={p} titles={t} color={color} onDone={onClose} />
        </div>
      </motion.div>
    </>
  )
}
