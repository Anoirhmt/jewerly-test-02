'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, Check, CheckCircle2, FileText, ImagePlus, Loader2, Minus, Plus, Search, Send, Sparkles, Trash2, X,
} from 'lucide-react'
import OrdersView from '@/components/OrdersView'
import type { Product } from '@/data/products'
import { shrinkImage } from '@/lib/shrink-image'

// Nouvelle commande: drop a chat screenshot, the AI fills the form, check it, save or send to
// Riyalto. Orders are kept with source "manual" and listed below the form.

type Item = { name: string; quantity: number; price: number; image?: string }
type Extracted = {
  name: string; phone: string; city: string; address: string; product: string
  quantity: number | null; price: number | null; note: string
}
type Sent = { ok: boolean; name: string; ref?: string; riyaltoId?: string; error?: string }
type FieldKey = 'name' | 'phone' | 'city' | 'address' | 'note'

const EMPTY = { name: '', phone: '', city: '', address: '', note: '' }
const ERRORS: Record<string, string> = {
  name: 'Le nom du client est obligatoire.',
  phone: 'Numéro invalide. Il faut 10 chiffres, comme 0612345678.',
  city: 'La ville est obligatoire.',
  items: 'Ajoutez au moins un article.',
  total: 'Le total à encaisser doit être supérieur à 0.',
  'not-image': "Ce fichier n'est pas une image.",
  'too-big': 'Image trop lourde.',
  ai: "L'IA n'a pas pu lire cette image. Réessayez ou remplissez à la main.",
  vps: 'Le serveur ne répond pas. Réessayez.',
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const packNumber = (s: string) => /(?:pack|باك)\s*(\d+)/i.exec(s)?.[1]
const phoneOk = (s: string) => /^(?:\+?212|0)?[5-7]\d{8}$/.test(s.replace(/[\s.-]/g, ''))

function toBase64(b: Blob) {
  return new Promise<string>((ok, fail) => {
    const r = new FileReader()
    r.onload = () => ok(String(r.result).split(',')[1] ?? '')
    r.onerror = fail
    r.readAsDataURL(b)
  })
}

function matchPack(product: string, packs: Product[]) {
  const n = packNumber(product)
  const key = norm(product)
  return (
    packs.find((p) => n && packNumber(p.name) === n) ??
    packs.find((p) => norm(p.name) === key) ??
    packs.find((p) => key.length > 3 && (norm(p.name).includes(key) || key.includes(norm(p.name))))
  )
}

export default function NouvelleCommandePage() {
  const [form, setForm] = useState(EMPTY)
  const [items, setItems] = useState<Item[]>([])
  const [packs, setPacks] = useState<Product[]>([])
  const [rates, setRates] = useState<Record<string, number>>({})
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [deliveryEdit, setDeliveryEdit] = useState<string | null>(null)
  const [totalEdit, setTotalEdit] = useState<string | null>(null)
  const [packQuery, setPackQuery] = useState('')
  const [custom, setCustom] = useState('')
  const [shot, setShot] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanDone, setScanDone] = useState(false)
  const [scanError, setScanError] = useState('')
  const [filled, setFilled] = useState<Set<string>>(new Set())
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState<'save' | 'send' | null>(null)
  const [error, setError] = useState('')
  const [badFields, setBadFields] = useState<Set<string>>(new Set())
  const [result, setResult] = useState<Sent | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/packs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { packs?: Product[] }) => setPacks((d.packs ?? []).filter((p) => p.inStock)))
      .catch(() => {})
    fetch('/shipping-rates.txt')
      .then((r) => r.text())
      .then((text) => {
        const out: Record<string, number> = {}
        for (const line of text.split(/\r?\n/)) {
          const parts = line.trim().split(/\s+/)
          const price = parseInt(parts[parts.length - 2] ?? '')
          if (parts.length >= 3 && !isNaN(price)) out[parts.slice(0, -2).join(' ').toUpperCase()] = price
        }
        setRates(out)
      })
      .catch(() => {})
  }, [])

  const cities = useMemo(() => Object.keys(rates).sort(), [rates])
  const cityIndex = useMemo(() => new Map(cities.map((c) => [norm(c), c])), [cities])

  // Same spelling as the website's city list, which is what Riyalto expects.
  const matchCity = useCallback(
    (city: string) => {
      const key = norm(city)
      if (!key) return city
      return cityIndex.get(key) ?? cities.find((c) => norm(c).startsWith(key)) ?? city.toUpperCase()
    },
    [cityIndex, cities],
  )

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const cityFee = rates[form.city.trim().toUpperCase()]
  const delivery = freeDelivery ? 0 : deliveryEdit !== null ? Number(deliveryEdit) || 0 : cityFee ?? 0
  const autoTotal = subtotal + delivery
  const total = totalEdit !== null ? Number(totalEdit) || 0 : autoTotal

  const applyExtract = useCallback(
    (o: Extracted) => {
      const got = new Set<string>()
      const patch: Partial<typeof EMPTY> = {}
      for (const k of ['name', 'phone', 'address', 'note'] as const) {
        if (o[k]) { patch[k] = o[k]; got.add(k) }
      }
      if (o.city) { patch.city = matchCity(o.city); got.add('city') }
      setForm((f) => ({ ...f, ...patch }))
      if (o.product) {
        const pack = matchPack(o.product, packs)
        const qty = o.quantity ?? 1
        setItems([
          pack
            ? { name: pack.name, quantity: qty, price: pack.price, image: pack.image ?? pack.variants?.[0]?.image }
            : { name: o.product, quantity: qty, price: 0 },
        ])
        got.add('items')
      }
      if (o.price !== null) { setTotalEdit(String(o.price)); got.add('total') }
      setFilled(got)
    },
    [matchCity, packs],
  )

  const readShot = useCallback(
    async (file: Blob) => {
      if (!file.type.startsWith('image/')) return setScanError(ERRORS['not-image']!)
      setShot((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file) })
      setScanning(true)
      setScanDone(false)
      setScanError('')
      setResult(null)
      try {
        const image = await toBase64(await shrinkImage(file))
        const r = await fetch('/api/admin/orders/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, mime: 'image/jpeg' }),
        })
        const d = (await r.json()) as { ok: boolean; order?: Extracted; error?: string }
        if (d.ok && d.order) {
          applyExtract(d.order)
          setScanDone(true)
        } else setScanError(ERRORS[d.error ?? ''] ?? ERRORS.ai!)
      } catch {
        setScanError(ERRORS.vps!)
      } finally {
        setScanning(false)
      }
    },
    [applyExtract],
  )

  // Ctrl+V anywhere on the page pastes a screenshot.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'))
      if (file) { e.preventDefault(); readShot(file) }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [readShot])

  const setField = (k: FieldKey, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setFilled((s) => { const n = new Set(s); n.delete(k); return n })
    setBadFields((s) => { const n = new Set(s); n.delete(k); return n })
    setError('')
  }

  function addPack(p: Product) {
    setItems((list) => {
      const i = list.findIndex((x) => x.name === p.name)
      if (i >= 0) return list.map((x, j) => (j === i ? { ...x, quantity: x.quantity + 1 } : x))
      return [...list, { name: p.name, quantity: 1, price: p.price, image: p.image ?? p.variants?.[0]?.image }]
    })
    setTotalEdit(null)
    setBadFields((s) => { const n = new Set(s); n.delete('items'); return n })
    setError('')
  }

  function addCustom() {
    const name = custom.trim()
    if (!name) return
    setItems((list) => [...list, { name, quantity: 1, price: 0 }])
    setCustom('')
    setBadFields((s) => { const n = new Set(s); n.delete('items'); return n })
  }

  function setQty(i: number, q: number) {
    setItems((list) => list.map((x, j) => (j === i ? { ...x, quantity: Math.max(1, Math.min(50, q)) } : x)))
    setTotalEdit(null)
  }

  function reset() {
    setForm(EMPTY)
    setItems([])
    setFreeDelivery(false)
    setDeliveryEdit(null)
    setTotalEdit(null)
    setFilled(new Set())
    setBadFields(new Set())
    setScanDone(false)
    setScanError('')
    setError('')
    setPackQuery('')
    setShot((old) => { if (old) URL.revokeObjectURL(old); return null })
  }

  function validate() {
    const bad = new Set<string>()
    if (form.name.trim().length < 2) bad.add('name')
    if (!phoneOk(form.phone)) bad.add('phone')
    if (form.city.trim().length < 2) bad.add('city')
    if (!items.length) bad.add('items')
    if (!(total > 0)) bad.add('total')
    setBadFields(bad)
    const first = Array.from(bad)[0]
    setError(first ? ERRORS[first]! : '')
    return bad.size === 0
  }

  async function submit(send: boolean) {
    if (busy || !validate()) return
    setBusy(send ? 'send' : 'save')
    setError('')
    const customer = form.name.trim()
    try {
      const r = await fetch('/api/admin/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: items.map(({ name, quantity }) => ({ name, quantity })), total, delivery }),
      })
      const d = (await r.json()) as { ok: boolean; id?: string; error?: string }
      if (!d.ok || !d.id) {
        setError(ERRORS[d.error ?? ''] ?? ERRORS.vps!)
        return
      }
      reset()
      if (!send) {
        setResult({ ok: true, name: customer })
        return
      }
      const s = await fetch(`/api/admin/orders/send/${encodeURIComponent(d.id)}`, { method: 'POST' })
      const sd = (await s.json().catch(() => ({}))) as { ok?: boolean; riyalto_ref?: string; pdf_url?: string; error?: string }
      setResult(
        s.ok && sd.ok
          ? { ok: true, name: customer, ref: sd.riyalto_ref ?? '', riyaltoId: /(\d+)$/.exec(sd.pdf_url ?? '')?.[1] }
          : { ok: false, name: customer, error: sd.error ?? '' },
      )
    } catch {
      setError(ERRORS.vps!)
    } finally {
      setBusy(null)
    }
  }

  const q = norm(packQuery)
  const shownPacks = q ? packs.filter((p) => norm(p.name).includes(q)) : packs
  const field = (k: string) =>
    `cl-field-input ${filled.has(k) ? 'cl-ai-filled' : ''} ${badFields.has(k) ? 'cl-field-bad' : ''}`

  return (
    <div className="space-y-10">
      <div className="cl-scope max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>Nouvelle commande</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>
              Déposez une capture d'écran : l'IA remplit le formulaire, vous vérifiez, puis vous envoyez à Riyalto.
            </p>
          </div>
          {(shot || form.name || items.length > 0) && (
            <button onClick={reset} className="cl-btn-ghost"><X size={14} /> Tout effacer</button>
          )}
        </div>

        {result && (
          <div className={`cl-result mt-4 ${result.ok ? 'cl-result-ok' : 'cl-result-warn'}`}>
            {result.ok ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <div className="min-w-0 flex-1">
              {result.ok && result.ref !== undefined ? (
                <>
                  <p className="font-semibold">Commande de {result.name} envoyée à Riyalto</p>
                  <p className="text-[13px] opacity-80">N° de suivi : <b>{result.ref || '—'}</b></p>
                </>
              ) : result.ok ? (
                <p className="font-semibold">Commande de {result.name} enregistrée. Envoyez-la depuis la liste ci-dessous.</p>
              ) : (
                <>
                  <p className="font-semibold">Commande de {result.name} enregistrée, mais pas envoyée à Riyalto.</p>
                  <p className="text-[13px] opacity-80">Vérifiez la ville puis réessayez depuis la liste ci-dessous.{result.error ? ` (${result.error})` : ''}</p>
                </>
              )}
            </div>
            {result.riyaltoId && (
              <a href={`/api/admin/orders/pdf/${result.riyaltoId}?format=10x10`} target="_blank" rel="noopener noreferrer" className="cl-btn-ghost">
                <FileText size={14} /> Étiquette
              </a>
            )}
            <button onClick={() => setResult(null)} className="cl-icon-btn" title="Fermer"><X size={16} /></button>
          </div>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          {/* Screenshot */}
          <section className="lg:sticky lg:top-20">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const f = e.dataTransfer.files?.[0]
                if (f) readShot(f)
              }}
              className={`cl-drop ${dragOver ? 'cl-drop-over' : ''} ${shot ? 'cl-drop-has' : ''}`}
            >
              {shot ? (
                <img src={shot} alt="Capture d'écran" className="cl-drop-img" />
              ) : (
                <span className="flex flex-col items-center gap-3 px-6 text-center">
                  <span className="cl-drop-icon"><ImagePlus size={24} /></span>
                  <span className="text-[15px] font-semibold" style={{ color: 'var(--cl-text)' }}>Déposez la capture ici</span>
                  <span className="text-[13px] leading-relaxed" style={{ color: 'var(--cl-muted)' }}>
                    ou cliquez pour choisir une image,<br className="hidden sm:block" /> ou collez avec <kbd className="cl-kbd">Ctrl</kbd> + <kbd className="cl-kbd">V</kbd>
                  </span>
                </span>
              )}
              {scanning && (
                <span className="cl-scan">
                  <span className="cl-scan-line" />
                  <span className="cl-scan-chip"><Sparkles size={14} /> L'IA lit la capture…</span>
                </span>
              )}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) readShot(f)
              }}
            />
            {scanDone && !scanning && (
              <p className="cl-note cl-note-ok"><Sparkles size={14} /> Infos remplies. Vérifiez les champs marqués, puis envoyez.</p>
            )}
            {scanError && <p className="cl-note cl-note-warn"><AlertTriangle size={14} /> {scanError}</p>}
            {shot && !scanning && (
              <p className="mt-2 text-center text-[12px]" style={{ color: 'var(--cl-subtle)' }}>
                Une autre capture complète le formulaire (par exemple l'adresse dans un 2ᵉ message).
              </p>
            )}
          </section>

          {/* Form */}
          <section className="cl-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="cl-field-lbl">Nom du client</span>
                <input className={field('name')} value={form.name} onChange={(e) => setField('name', e.target.value)} autoComplete="off" dir="auto" />
              </label>
              <label className="block">
                <span className="cl-field-lbl">Téléphone</span>
                <input className={field('phone')} value={form.phone} onChange={(e) => setField('phone', e.target.value)} inputMode="tel" placeholder="06XXXXXXXX" autoComplete="off" />
              </label>
              <label className="block">
                <span className="cl-field-lbl">Ville</span>
                <input
                  className={field('city')}
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value.toUpperCase())}
                  onBlur={() => { if (form.city) setField('city', matchCity(form.city)) }}
                  list="nc-cities"
                  autoComplete="off"
                />
                <datalist id="nc-cities">{cities.map((c) => <option key={c} value={c} />)}</datalist>
              </label>
              <label className="block">
                <span className="cl-field-lbl">Adresse</span>
                <input className={field('address')} value={form.address} onChange={(e) => setField('address', e.target.value)} autoComplete="off" dir="auto" />
              </label>
              <label className="block sm:col-span-2">
                <span className="cl-field-lbl">Note pour le livreur <span className="normal-case font-normal tracking-normal" style={{ color: 'var(--cl-subtle)' }}>(optionnel)</span></span>
                <input className={field('note')} value={form.note} onChange={(e) => setField('note', e.target.value)} autoComplete="off" />
              </label>
            </div>

            <div className="cl-divider" />

            <div className="flex items-center justify-between gap-3">
              <span className="cl-field-lbl !mb-0">Articles</span>
              <span className="cl-search-sm">
                <Search size={13} />
                <input value={packQuery} onChange={(e) => setPackQuery(e.target.value)} placeholder="Chercher un pack…" />
              </span>
            </div>

            <div className={`cl-packs ${badFields.has('items') ? 'cl-packs-bad' : ''}`}>
              {shownPacks.map((p) => {
                const inCart = items.some((i) => i.name === p.name)
                return (
                  <button key={p.id} type="button" onClick={() => addPack(p)} className={`cl-pack ${inCart ? 'cl-pack-on' : ''}`} title={p.name}>
                    <span className="relative block">
                      <img src={p.image ?? p.variants?.[0]?.image ?? ''} alt="" loading="lazy" />
                      {inCart && <span className="cl-pack-check"><Check size={12} strokeWidth={3} /></span>}
                    </span>
                    <span className="cl-pack-name">{p.name}</span>
                    <span className="cl-pack-price">{p.price} DH</span>
                  </button>
                )
              })}
              {packs.length > 0 && shownPacks.length === 0 && (
                <p className="px-2 py-6 text-[13px]" style={{ color: 'var(--cl-subtle)' }}>Aucun pack trouvé</p>
              )}
            </div>

            {items.length > 0 && (
              <ul className="mt-3 space-y-2">
                {items.map((it, i) => (
                  <li key={`${it.name}-${i}`} className={`cl-line ${filled.has('items') ? 'cl-ai-filled' : ''}`}>
                    {it.image ? <img src={it.image} alt="" /> : <span className="cl-line-ph" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium" style={{ color: 'var(--cl-text)' }} dir="auto">{it.name}</span>
                      <span className="block text-[12px]" style={{ color: 'var(--cl-muted)' }}>{it.price ? `${it.price} DH` : 'Prix à saisir dans le total'}</span>
                    </span>
                    <span className="cl-stepper">
                      <button type="button" onClick={() => setQty(i, it.quantity - 1)} aria-label="Moins"><Minus size={13} /></button>
                      <b>{it.quantity}</b>
                      <button type="button" onClick={() => setQty(i, it.quantity + 1)} aria-label="Plus"><Plus size={13} /></button>
                    </span>
                    <button type="button" onClick={() => { setItems((l) => l.filter((_, j) => j !== i)); setTotalEdit(null) }} className="cl-icon-btn" title="Retirer">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 flex gap-2">
              <input
                className="cl-field-input"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
                placeholder="Autre article (hors packs)…"
                dir="auto"
              />
              <button type="button" onClick={addCustom} disabled={!custom.trim()} className="cl-btn-ghost shrink-0"><Plus size={14} /> Ajouter</button>
            </div>

            <div className="cl-divider" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="cl-field-lbl">Livraison (DH)</span>
                  <label className="mb-1.5 flex cursor-pointer items-center gap-1.5 text-[12px]" style={{ color: 'var(--cl-muted)' }}>
                    <input type="checkbox" className="cl-check" checked={freeDelivery} onChange={(e) => { setFreeDelivery(e.target.checked); setTotalEdit(null) }} />
                    Gratuite
                  </label>
                </div>
                <input
                  type="number"
                  min={0}
                  className="cl-field-input"
                  disabled={freeDelivery}
                  value={freeDelivery ? 0 : deliveryEdit ?? (cityFee ?? '')}
                  onChange={(e) => { setDeliveryEdit(e.target.value); setTotalEdit(null) }}
                  placeholder="—"
                />
              </div>
              <label className="block">
                <span className="cl-field-lbl">Total à encaisser (DH)</span>
                <input
                  type="number"
                  min={0}
                  className={`${field('total')} cl-total-input`}
                  value={totalEdit ?? (autoTotal || '')}
                  onChange={(e) => { setTotalEdit(e.target.value); setBadFields((s) => { const n = new Set(s); n.delete('total'); return n }) }}
                  placeholder="0"
                />
              </label>
            </div>

            {error && <p className="cl-note cl-note-warn"><AlertTriangle size={14} /> {error}</p>}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => submit(false)} disabled={!!busy} className="cl-btn-ghost justify-center">
                {busy === 'save' ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Enregistrer
              </button>
              <button type="button" onClick={() => submit(true)} disabled={!!busy} className="cl-btn-accent justify-center">
                {busy === 'send' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Envoyer à Riyalto
              </button>
            </div>
          </section>
        </div>
      </div>

      <OrdersView source="manual" title="Commandes ajoutées" subtitle="Les commandes créées ici. Cliquez sur l'icône d'impression pour envoyer à Riyalto." />
    </div>
  )
}
