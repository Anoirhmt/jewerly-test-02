"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Gift, PackageCheck, PhoneCall, Star, Truck, Wallet } from "lucide-react"
import type { Product } from "@/data/products"
import { track } from "@/lib/fb-pixel"
import { OrderForm, type OrderFormHandle } from "./order-form"
import { BRAND, LOGO_URL, WHATSAPP, imageFor, packTitles } from "./shared"

// One pack, one page (elarain.store/offre/211): photo, price, and the order form right there,
// so a visitor from a Facebook ad can order without leaving the page.

const FAQ = [
  { q: "واش التوصيل مجاني؟", a: "إيه، التوصيل مجاني لجميع المدن ديال المغرب." },
  { q: "إمتى غادي توصلني الطلبية؟", a: "عادةً بين 24 و 72 ساعة حسب المدينة ديالك." },
  { q: "كيفاش نخلص؟", a: "كتخلصي نقداً للموزع ملي توصلك الطلبية. ماكاين حتى دفع مسبق." },
  { q: "واش غادي تتاصلو بيا؟", a: "إيه، كنتاصلو بيك فالهاتف باش نأكدو معاك الطلب والعنوان قبل الإرسال." },
]

export function PackLanding({ pack: p, others, arabicFont }: { pack: Product; others: Product[]; arabicFont: string }) {
  const t = useMemo(() => packTitles(p), [p])
  const [color, setColor] = useState<string | undefined>(p.variants?.[0]?.color)
  const [shot, setShot] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [formVisible, setFormVisible] = useState(false)
  const formBox = useRef<HTMLDivElement>(null)
  const form = useRef<OrderFormHandle>(null)

  // Variant photos when the pack comes in colours, otherwise the main and second photo.
  const gallery = useMemo(() => {
    const list = p.variants?.length ? p.variants.map((v) => v.image) : [p.image, p.hoverImage]
    return Array.from(new Set(list.filter((x): x is string => !!x)))
  }, [p])
  const main = shot ?? imageFor(p, color)
  const discount = p.originalPrice && p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

  useEffect(() => {
    track("ViewContent", { content_ids: [String(p.id)], content_type: "product", value: p.price, currency: "MAD" })
  }, [p])

  // Hide the sticky "order" bar once the form itself is on screen.
  useEffect(() => {
    const el = formBox.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFormVisible(!!e?.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function goToForm() {
    formBox.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    setTimeout(() => form.current?.focus(), 450)
  }

  function pickColor(c: string) {
    setColor(c)
    setShot(null)
  }

  return (
    <div dir="rtl" lang="ar" className={`${arabicFont} min-h-screen bg-[#faf6f4] text-neutral-900`}>
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

      <header className="mx-auto flex max-w-5xl items-center justify-center px-5 py-3">
        <Link href="/offre" aria-label="Elarain — toutes les offres">
          <img src={LOGO_URL} alt="Elarain Jewelry" className="h-11 w-11 rounded-full object-contain" />
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-32 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:pb-16">
        {/* Photos */}
        <section className="lg:sticky lg:top-4">
          <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_24px_50px_-28px_rgba(80,40,40,0.55)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={main}
                src={main}
                alt={t.fr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="aspect-square w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
              {discount > 0 && <span className="rounded-full bg-rose-600 px-3 py-1 text-[12px] font-bold text-white shadow" dir="ltr">-{discount}%</span>}
              {t.box && (
                <span className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-[#9b5c5c] shadow">
                  <Gift size={13} /> علبة هدية مجانية
                </span>
              )}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {gallery.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    const v = p.variants?.find((x) => x.image === g)
                    if (v) pickColor(v.color)
                    else setShot(g)
                  }}
                  className={`size-16 overflow-hidden rounded-2xl border-2 transition ${g === main ? "border-[#9b5c5c]" : "border-transparent opacity-70"}`}
                >
                  <img src={g} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Details + order */}
        <section className="mt-5 lg:mt-0">
          <h1 className="text-[26px] font-bold leading-tight sm:text-[30px]">{t.ar}</h1>
          <p className="mt-1 font-[family-name:var(--font-playfair)] text-[15px] italic text-neutral-500" dir="ltr">
            {t.fr}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-neutral-500">
            <span className="flex text-amber-400" dir="ltr">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={16} className={s < Math.round(p.rating || 5) ? "fill-current" : ""} />
              ))}
            </span>
            <span className="font-semibold text-neutral-700">{(p.rating || 4.8).toFixed(1)}</span>
            {p.reviews ? <span>· {p.reviews} تقييم</span> : null}
          </div>

          <div className="mt-4 flex items-end gap-3" dir="ltr">
            <span className="text-[40px] font-extrabold leading-none" style={{ color: BRAND }}>
              {p.price}
              <span className="ml-1 text-[18px] font-bold">DH</span>
            </span>
            {discount > 0 && <span className="pb-1 text-[18px] text-neutral-400 line-through">{p.originalPrice} DH</span>}
          </div>
          <p className="mt-1 text-[14px] font-semibold text-emerald-700">+ التوصيل مجاني 🚚</p>

          {p.packContents && p.packContents.length > 0 && (
            <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_8px_24px_-18px_rgba(80,40,40,0.5)]">
              <p className="text-[14px] font-bold">شنو كاين فالباك:</p>
              <ul className="mt-2 space-y-1.5 text-[14px] text-neutral-700">
                {p.packContents.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: BRAND }} />
                    <span dir="auto">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2 text-[13px]">
            {[
              { icon: <Truck size={17} />, ar: "توصيل مجاني", fr: "Livraison 0 DH" },
              { icon: <Wallet size={17} />, ar: "الدفع عند الاستلام", fr: "Paiement à la livraison" },
              { icon: <PhoneCall size={17} />, ar: "كنتاصلو بيك نأكدو", fr: "Confirmation par appel" },
              t.box
                ? { icon: <Gift size={17} />, ar: "علبة هدية مجانية", fr: "Boîte cadeau offerte" }
                : { icon: <PackageCheck size={17} />, ar: "تغليف مزيان", fr: "Emballage soigné" },
            ].map((b) => (
              <div key={b.fr} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-[0_6px_20px_-14px_rgba(155,92,92,0.6)]">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#9b5c5c]/10 text-[#9b5c5c]">{b.icon}</span>
                <span className="min-w-0">
                  <span className="block font-bold leading-tight">{b.ar}</span>
                  <span className="block truncate text-[11px] text-neutral-500" dir="ltr">{b.fr}</span>
                </span>
              </div>
            ))}
          </div>

          <div
            ref={formBox}
            id="commander"
            className="mt-6 scroll-mt-4 rounded-[28px] bg-white p-5 shadow-[0_24px_50px_-28px_rgba(80,40,40,0.55)] ring-1 ring-[#9b5c5c]/15"
          >
            <p className="mb-4 text-center text-[18px] font-bold">
              اطلبي دابا <span className="text-[13px] font-medium text-neutral-500" dir="ltr">· Commander</span>
            </p>
            <OrderForm ref={form} pack={p} titles={t} color={color} onColorChange={pickColor} showSummary={false} />
          </div>

          {/* How it works */}
          <div className="mt-8">
            <h2 className="text-center text-[18px] font-bold">كيفاش كتخدم؟</h2>
            <ol className="mt-4 grid grid-cols-3 gap-2 text-center text-[12.5px]">
              {[
                { n: 1, ar: "عمّري الفورمولير", fr: "Commandez" },
                { n: 2, ar: "كنتاصلو بيك نأكدو", fr: "On confirme" },
                { n: 3, ar: "توصلك وتخلصي", fr: "Payez à la livraison" },
              ].map((s) => (
                <li key={s.n} className="rounded-2xl bg-white px-2 py-3">
                  <span className="mx-auto grid size-8 place-items-center rounded-full text-[14px] font-bold text-white" style={{ background: BRAND }}>
                    {s.n}
                  </span>
                  <p className="mt-2 font-bold leading-tight">{s.ar}</p>
                  <p className="text-[10.5px] text-neutral-500" dir="ltr">{s.fr}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* FAQ */}
          <div className="mt-8 space-y-2">
            <h2 className="text-center text-[18px] font-bold">أسئلة متكررة</h2>
            {FAQ.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl bg-white">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-right text-[14.5px] font-bold"
                >
                  {f.q}
                  <ChevronDown size={18} className={`shrink-0 text-neutral-400 transition ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-4 pb-4 text-[14px] leading-relaxed text-neutral-600">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Other packs */}
      {others.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-32 lg:pb-16">
          <h2 className="text-[18px] font-bold">باكات أخرى غادي تعجبك</h2>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {others.map((o) => {
              const ot = packTitles(o)
              return (
                <Link key={o.id} href={`/offre/${o.id}`} className="w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_-18px_rgba(80,40,40,0.6)]">
                  <img src={imageFor(o, o.variants?.[0]?.color)} alt={ot.fr} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="p-2.5">
                    <p className="truncate text-[13px] font-bold">{ot.ar}</p>
                    <p className="text-[14px] font-extrabold" style={{ color: BRAND }} dir="ltr">{o.price} DH</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <p className="mt-6 text-center text-[12px] text-neutral-400">© {new Date().getFullYear()} Elarain Jewelry</p>
        </section>
      )}

      {/* Sticky order bar (mobile) */}
      <AnimatePresence>
        {!formVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-center gap-3">
              <div className="shrink-0 leading-tight" dir="ltr">
                <p className="text-[22px] font-extrabold" style={{ color: BRAND }}>{p.price} DH</p>
                <p className="text-[11px] font-semibold text-emerald-700">Livraison gratuite</p>
              </div>
              <button
                type="button"
                onClick={goToForm}
                className="flex-1 rounded-2xl py-3.5 text-[17px] font-bold text-white shadow-[0_12px_24px_-12px_rgba(155,92,92,0.9)] active:scale-[0.98]"
                style={{ background: BRAND }}
              >
                اطلبي الآن
              </button>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`سلام، بغيت نسول على ${t.ar}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white"
              >
                <WaIcon />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes offre-marquee { from { transform: translateX(0) } to { transform: translateX(50%) } }`}</style>
    </div>
  )
}

export function WaIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
