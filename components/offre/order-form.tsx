"use client"

import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2, Minus, Plus, ShieldCheck } from "lucide-react"
import type { Product } from "@/data/products"
import { formatPrice } from "@/utils/format-price"
import { track } from "@/lib/fb-pixel"
import { BRAND, CITIES, WHATSAPP, colorInfo, imageFor, sendOrder, type PackTitles } from "./shared"

export type OrderFormHandle = { focus: () => void }

type Props = {
  pack: Product
  titles: PackTitles
  color: string | undefined
  onColorChange?: (c: string) => void
  // On the pack page the photo is already above the form; in the slide-up panel it isn't.
  showSummary?: boolean
  onDone?: () => void
}

// The 4-field cash-on-delivery order form, then a thank-you screen. Used by the /offre panel
// and inline on each pack's landing page.
export const OrderForm = forwardRef<OrderFormHandle, Props>(function OrderForm(
  { pack: p, titles: t, color, onColorChange, showSummary = true, onDone },
  ref,
) {
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" })
  const [qty, setQty] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<{ name: string; ref: string } | null>(null)
  const started = useRef(false)
  const nameRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => ({ focus: () => nameRef.current?.focus({ preventScroll: true }) }))

  const total = p.price * qty
  const c = color ? colorInfo(color) : null

  // Tell Facebook once that this visitor started ordering.
  function start() {
    if (started.current) return
    started.current = true
    track("InitiateCheckout", { content_ids: [String(p.id)], value: p.price, currency: "MAD", num_items: 1 })
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    start()
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
    try {
      const refNo = await sendOrder(p, t, color, qty, form)
      track("Purchase", { content_ids: [String(p.id)], content_type: "product", value: total, currency: "MAD", num_items: qty })
      setDone({ name: form.name.trim().split(/\s+/)[0] ?? "", ref: refNo })
    } catch {
      setError("وقع مشكل فالاتصال. عاودي المحاولة")
    } finally {
      setBusy(false)
    }
  }

  const input =
    "w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-[16px] outline-none transition focus:border-[#9b5c5c] focus:bg-white focus:ring-4 focus:ring-[#9b5c5c]/15"

  if (done) {
    return (
      <div className="px-1 pb-2 pt-2 text-center">
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
        {onDone && (
          <button type="button" onClick={onDone} className="mt-3 w-full py-2 text-[14px] font-medium text-neutral-500">
            شوفي عروض أخرى
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      {showSummary ? (
        <div className="flex items-center gap-3 rounded-2xl bg-[#faf6f4] p-3">
          <img src={imageFor(p, color)} alt="" className="size-16 shrink-0 rounded-xl object-cover" />
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
          <QtyStepper qty={qty} setQty={setQty} />
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {p.variants && p.variants.length > 1 && onColorChange ? (
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-neutral-600">اللون:</span>
              {p.variants.map((v) => {
                const ci = colorInfo(v.color)
                const on = v.color === color
                return (
                  <button
                    key={v.color}
                    type="button"
                    onClick={() => onColorChange(v.color)}
                    aria-pressed={on}
                    title={`${ci.ar} · ${ci.fr}`}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition ${
                      on ? "border-[#9b5c5c] bg-[#9b5c5c]/10 text-[#9b5c5c]" : "border-neutral-200 text-neutral-600"
                    }`}
                  >
                    <span className="size-4 rounded-full border border-black/10" style={{ background: ci.hex }} />
                    {ci.ar}
                  </button>
                )
              })}
            </div>
          ) : (
            <span className="text-[13px] font-semibold text-neutral-600">الكمية</span>
          )}
          <QtyStepper qty={qty} setQty={setQty} />
        </div>
      )}

      <h3 className="mt-5 text-xl font-bold">معلومات التوصيل</h3>
      <p className="text-[13px] text-neutral-500">ماكتخلصي حتى توصلك السلعة 💵</p>

      <div className="mt-4 space-y-3">
        <input ref={nameRef} className={input} value={form.name} onChange={set("name")} onFocus={start} placeholder="الاسم الكامل" autoComplete="name" />
        <input
          className={`${input} text-right`}
          value={form.phone}
          onChange={set("phone")}
          onFocus={start}
          placeholder="رقم الهاتف · 06XXXXXXXX"
          inputMode="numeric"
          autoComplete="tel"
        />
        <input className={input} value={form.city} onChange={set("city")} onFocus={start} placeholder="المدينة" list="offre-cities" autoComplete="address-level2" />
        <datalist id="offre-cities">
          {CITIES.map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
        <input className={input} value={form.address} onChange={set("address")} onFocus={start} placeholder="العنوان (اختياري)" autoComplete="street-address" />
      </div>

      {error && <p className="mt-3 rounded-xl bg-rose-50 px-4 py-2.5 text-[14px] font-medium text-rose-700">{error}</p>}

      <button
        disabled={busy}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[17px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(155,92,92,0.9)] transition active:scale-[0.98] disabled:opacity-70"
        style={{ background: BRAND }}
      >
        {busy ? <Loader2 size={20} className="animate-spin" /> : null}
        {busy ? (
          "جاري الإرسال…"
        ) : (
          <>
            تأكيد الطلب · <span dir="ltr">{formatPrice(total)}</span>
          </>
        )}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-neutral-500">
        <ShieldCheck size={14} className="text-emerald-600" /> التوصيل مجاني · الدفع عند الاستلام
      </p>
    </form>
  )
})

function QtyStepper({ qty, setQty }: { qty: number; setQty: (fn: (q: number) => number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-neutral-200" dir="ltr">
      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Moins" className="grid size-8 place-items-center rounded-full text-neutral-600 active:bg-neutral-100">
        <Minus size={15} />
      </button>
      <span className="w-5 text-center font-bold">{qty}</span>
      <button type="button" onClick={() => setQty((q) => Math.min(5, q + 1))} aria-label="Plus" className="grid size-8 place-items-center rounded-full text-neutral-600 active:bg-neutral-100">
        <Plus size={15} />
      </button>
    </div>
  )
}
