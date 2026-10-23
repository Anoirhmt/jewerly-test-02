'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowUp, Check, Copy, ExternalLink, ImagePlus, Loader2, Lock, Pencil, Plus, Save, Search, Trash2, X,
} from 'lucide-react'
import type { Product } from '@/data/products'

// Packs & prix: change prices and stock, and add new packs. Saved on the VPS; the shop,
// the product pages and the Facebook ad pages (/offre) pick it up within seconds.

type Pack = Product
const PW_KEY = 'elarain-packs-pw'
const DELIVERY_KEY = 'elarain-packs-delivery'
const COLORS = [
  { v: 'gold', label: 'Doré', hex: '#d4a64a' },
  { v: 'silver', label: 'Argent', hex: '#d1d5db' },
  { v: 'rose', label: 'Rose', hex: '#e7a6a1' },
  { v: 'red', label: 'Rouge', hex: '#b91c1c' },
  { v: 'black', label: 'Noir', hex: '#111827' },
]
const ERRORS: Record<string, string> = {
  password: 'Code incorrect.',
  locked: 'Trop de codes incorrects. Réessayez dans 10 minutes.',
  vps: 'Le serveur ne répond pas. Réessayez.',
  'duplicate-id': 'Deux packs ont le même numéro.',
  'too-big': 'Photo trop lourde.',
  'not-image': "Ce fichier n'est pas une photo.",
}
const errorText = (e?: string) =>
  !e ? 'Erreur inconnue.' : ERRORS[e] ?? (e.startsWith('invalid:') ? `Champ invalide : ${e.slice(8)}` : e)

function store(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key) ?? ''
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch {}
  return ''
}

export default function PacksAdminPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [packs, setPacks] = useState<Pack[] | null>(null)
  const [saved, setSaved] = useState<string>('')
  const [source, setSource] = useState<'vps' | 'file'>('vps')
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<Pack | null>(null)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'on' | 'off'>('all')
  const [delivery, setDelivery] = useState(35)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null)

  const dirty = packs !== null && saved !== '' && sig(packs) !== sig(JSON.parse(saved))
  const changes = useMemo(() => {
    if (!packs || !saved) return 0
    const before = new Map((JSON.parse(saved) as Pack[]).map((p) => [p.id, sig(p)]))
    const removed = Array.from(before.keys()).filter((id) => !packs.some((p) => p.id === id)).length
    const edited = packs.filter((p) => before.get(p.id) !== sig(p)).length
    return removed + edited || (dirty ? 1 : 0) // 1 = only the order changed
  }, [packs, saved, dirty])

  async function load() {
    setLoadError('')
    try {
      const r = await fetch('/api/admin/packs', { cache: 'no-store' })
      const d = (await r.json()) as { packs: Pack[]; source: 'vps' | 'file' }
      setPacks(d.packs)
      setSaved(JSON.stringify(d.packs))
      setSource(d.source)
    } catch {
      setLoadError('Impossible de charger les packs.')
    }
  }

  useEffect(() => {
    const pw = store(PW_KEY)
    const d = Number(store(DELIVERY_KEY))
    if (d > 0) setDelivery(d)
    if (pw) {
      setPassword(pw)
      setUnlocked(true)
    }
    load()
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function flash(ok: boolean, text: string) {
    setToast({ ok, text })
    setTimeout(() => setToast(null), 3500)
  }

  function lock() {
    store(PW_KEY, '')
    setPassword('')
    setUnlocked(false)
  }

  const update = (id: number, patch: Partial<Pack>) =>
    setPacks((list) => list && list.map((p) => (p.id === id ? clean({ ...p, ...patch }) : p)))

  function move(id: number, dir: -1 | 1) {
    setPacks((list) => {
      if (!list) return list
      const i = list.findIndex((p) => p.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= list.length) return list
      const next = [...list]
      ;[next[i], next[j]] = [next[j]!, next[i]!]
      return next
    })
  }

  function newPack() {
    const id = Math.max(200, ...(packs ?? []).map((p) => p.id)) + 1
    setEditing({ id, name: '', description: '', price: 199, category: 'pack', rating: 4.8, reviews: 0, inStock: true, isPack: true })
  }

  function applyEdit(p: Pack) {
    setPacks((list) => {
      if (!list) return list
      return list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? clean(p) : x)) : [...list, clean(p)]
    })
    setEditing(null)
  }

  function remove(id: number) {
    setPacks((list) => list && list.filter((p) => p.id !== id))
    setEditing(null)
  }

  async function save() {
    if (!packs) return
    const bad = packs.find((p) => !p.name.trim() || !(p.price > 0) || !(p.image || p.variants?.length))
    if (bad) return flash(false, `Pack ${bad.id} : il manque le nom, le prix ou la photo.`)
    setSaving(true)
    try {
      const r = await fetch('/api/admin/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, packs }),
      })
      const d = (await r.json()) as { ok: boolean; packs?: Pack[]; error?: string }
      if (d.ok && d.packs) {
        setPacks(d.packs)
        setSaved(JSON.stringify(d.packs))
        setSource('vps')
        flash(true, 'Enregistré — le site est à jour.')
      } else {
        if (d.error === 'password') lock()
        flash(false, errorText(d.error))
      }
    } catch {
      flash(false, errorText('vps'))
    } finally {
      setSaving(false)
    }
  }

  const shown = (packs ?? []).filter((p) => {
    if (tab === 'on' && !p.inStock) return false
    if (tab === 'off' && p.inStock) return false
    const q = query.trim().toLowerCase()
    return !q || `${p.id} ${p.name} ${p.titleAr ?? ''} ${p.description}`.toLowerCase().includes(q)
  })

  if (!unlocked) {
    return <Unlock onOk={(pw) => { store(PW_KEY, pw); setPassword(pw); setUnlocked(true) }} />
  }

  return (
    <div className="cl-scope max-w-6xl mx-auto pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>Packs & prix</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--cl-muted)' }}>
            Prix, stock et nouveaux packs. Visible sur la boutique et les pages pub après « Enregistrer ».
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={lock} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Lock size={14} /> Verrouiller
          </button>
          <button onClick={newPack} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800">
            <Plus size={16} /> Nouveau pack
          </button>
        </div>
      </div>

      {source === 'file' && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Le serveur n'a pas répondu : liste chargée depuis le code du site. Enregistrer la remettra sur le serveur.
        </p>
      )}
      {loadError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError} <button onClick={load} className="underline">Réessayer</button>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un pack…"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-sm">
          {([['all', 'Tous'], ['on', 'En stock'], ['off', 'Masqués']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-md px-3 py-1.5 ${tab === k ? 'bg-gray-900 text-white' : 'text-gray-600'}`}>
              {l}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600">
          Livraison
          <input
            type="number"
            min={0}
            value={delivery}
            onChange={(e) => { const v = Math.max(0, Number(e.target.value) || 0); setDelivery(v); store(DELIVERY_KEY, String(v)) }}
            className="w-14 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-right text-gray-900"
          />
          DH
        </label>
      </div>

      {!packs ? (
        <div className="mt-16 flex justify-center text-gray-400"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PackCard
              key={p.id}
              p={p}
              delivery={delivery}
              first={packs[0]?.id === p.id}
              last={packs[packs.length - 1]?.id === p.id}
              onChange={(patch) => update(p.id, patch)}
              onEdit={() => setEditing(p)}
              onMove={(d) => move(p.id, d)}
              onCopied={() => flash(true, 'Lien copié')}
            />
          ))}
          <button
            onClick={newPack}
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
          >
            <Plus size={28} />
            <span className="text-sm font-medium">Ajouter un pack</span>
          </button>
        </div>
      )}

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="text-sm text-gray-700">
              <b>{changes}</b> modification{changes > 1 ? 's' : ''} non enregistrée{changes > 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPacks(JSON.parse(saved))} className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <EditPack
          pack={editing}
          isNew={!packs?.some((p) => p.id === editing.id)}
          password={password}
          delivery={delivery}
          onClose={() => setEditing(null)}
          onApply={applyEdit}
          onDelete={() => remove(editing.id)}
          onAuthError={lock}
        />
      )}

      {toast && (
        <div className={`fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.text}
        </div>
      )}
    </div>
  )
}

// JSON with sorted keys, so the same pack always gives the same text.
function sig(v: unknown): string {
  return JSON.stringify(v, (_k, x) =>
    x && typeof x === 'object' && !Array.isArray(x)
      ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, (x as Record<string, unknown>)[k]]))
      : x,
  )
}

// Drops empty optional fields so "no change" really compares equal.
function clean(p: Pack): Pack {
  const out: Pack = { ...p }
  if (!out.originalPrice || out.originalPrice <= 0) delete out.originalPrice
  if (!out.titleAr?.trim()) delete out.titleAr
  if (!out.hoverImage) delete out.hoverImage
  if (!out.packContents?.length) delete out.packContents
  if (!out.variants?.length) delete out.variants
  if (!out.isBestSeller) delete out.isBestSeller
  return out
}

const imageOf = (p: Pack) => p.image || p.variants?.[0]?.image || ''

function Remaining({ price, delivery }: { price: number; delivery: number }) {
  const left = Math.round(price - delivery)
  const tone = left >= 120 ? 'bg-emerald-50 text-emerald-700' : left >= 80 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`} title="Prix moins la livraison (avant le coût du produit)">
      reste {left} DH après livraison
    </span>
  )
}

function PackCard({
  p, delivery, first, last, onChange, onEdit, onMove, onCopied,
}: {
  p: Pack
  delivery: number
  first: boolean
  last: boolean
  onChange: (patch: Partial<Pack>) => void
  onEdit: () => void
  onMove: (d: -1 | 1) => void
  onCopied: () => void
}) {
  const link = `https://www.elarain.store/offre/${p.id}`
  return (
    <div className={`overflow-hidden rounded-xl border bg-white ${p.inStock ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
      <div className="relative">
        {imageOf(p) ? (
          <img src={imageOf(p)} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
        ) : (
          <div className="aspect-[4/3] w-full bg-gray-100" />
        )}
        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">#{p.id}</span>
        {!p.inStock && <span className="absolute right-2 top-2 rounded-md bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">Masqué</span>}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button onClick={() => onMove(-1)} disabled={first} title="Monter" className="grid size-7 place-items-center rounded-md bg-white/90 text-gray-700 shadow disabled:opacity-30"><ArrowUp size={14} /></button>
          <button onClick={() => onMove(1)} disabled={last} title="Descendre" className="grid size-7 place-items-center rounded-md bg-white/90 text-gray-700 shadow disabled:opacity-30"><ArrowDown size={14} /></button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{p.name || 'Sans nom'}</p>
            {p.titleAr && <p className="truncate text-sm text-gray-500" dir="rtl">{p.titleAr}</p>}
          </div>
          <Toggle on={p.inStock} onChange={(v) => onChange({ inStock: v })} label={p.inStock ? 'En stock' : 'Masqué'} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-xs text-gray-500">
            Prix
            <div className="mt-1 flex items-center rounded-lg border border-gray-200 focus-within:border-gray-400">
              <input
                type="number"
                min={1}
                value={p.price || ''}
                onChange={(e) => onChange({ price: Number(e.target.value) })}
                className="w-full rounded-lg px-2.5 py-1.5 text-base font-semibold text-gray-900 outline-none"
              />
              <span className="pr-2.5 text-xs text-gray-400">DH</span>
            </div>
          </label>
          <label className="text-xs text-gray-500">
            Ancien prix <span className="text-gray-400">(barré)</span>
            <div className="mt-1 flex items-center rounded-lg border border-gray-200 focus-within:border-gray-400">
              <input
                type="number"
                min={0}
                value={p.originalPrice || ''}
                placeholder="—"
                onChange={(e) => onChange({ originalPrice: Number(e.target.value) || undefined })}
                className="w-full rounded-lg px-2.5 py-1.5 text-base text-gray-900 outline-none"
              />
              <span className="pr-2.5 text-xs text-gray-400">DH</span>
            </div>
          </label>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <Remaining price={p.price} delivery={delivery} />
          {p.originalPrice && p.originalPrice > p.price ? (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">-{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
          <button onClick={onEdit} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            <Pencil size={14} /> Modifier
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(link).then(onCopied, () => {})}
            title="Copier le lien de la page pub"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy size={14} /> Lien pub
          </button>
          <a href={link} target="_blank" rel="noopener noreferrer" title="Voir la page pub" className="inline-flex items-center rounded-lg border border-gray-200 px-2.5 text-gray-700 hover:bg-gray-50">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex shrink-0 items-center gap-1.5 text-xs text-gray-600" aria-pressed={on}>
      <span className={`relative h-5 w-9 rounded-full transition ${on ? 'bg-emerald-500' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

function Unlock({ onOk }: { onOk: (pw: string) => void }) {
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      const r = await fetch('/api/admin/packs/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const d = (await r.json()) as { ok: boolean; error?: string }
      if (d.ok) onOk(pw)
      else setErr(errorText(d.error))
    } catch {
      setErr(errorText('vps'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-10 max-w-sm rounded-xl border border-gray-200 bg-white p-6">
      <div className="grid size-11 place-items-center rounded-full bg-gray-100 text-gray-700"><Lock size={20} /></div>
      <h1 className="mt-4 text-lg font-semibold text-gray-900">Packs & prix</h1>
      <p className="mt-1 text-sm text-gray-500">Entrez le code des packs pour modifier les prix. Il reste enregistré sur cet appareil.</p>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoFocus
        autoComplete="current-password"
        placeholder="Code des packs"
        className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
      />
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <button disabled={busy || !pw} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {busy && <Loader2 size={16} className="animate-spin" />} Déverrouiller
      </button>
    </form>
  )
}

// Shrinks phone photos (often 4–8 MB) to max 1600 px JPEG before upload.
async function shrink(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = fail
      i.src = url
    })
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
    const c = document.createElement('canvas')
    c.width = Math.round(img.width * scale)
    c.height = Math.round(img.height * scale)
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
    return await new Promise<Blob>((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error('blob'))), 'image/jpeg', 0.86))
  } finally {
    URL.revokeObjectURL(url)
  }
}

function PhotoPicker({
  value, onChange, password, onAuthError, label, small,
}: {
  value: string | undefined
  onChange: (url: string) => void
  password: string
  onAuthError: () => void
  label: string
  small?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true)
    setErr('')
    try {
      const body = new FormData()
      body.append('password', password)
      body.append('file', await shrink(f), 'photo.jpg')
      const r = await fetch('/api/admin/packs/image', { method: 'POST', body })
      const d = (await r.json()) as { ok: boolean; url?: string; error?: string }
      if (d.ok && d.url) onChange(d.url)
      else {
        if (d.error === 'password') onAuthError()
        setErr(errorText(d.error))
      }
    } catch {
      setErr("Échec de l'envoi de la photo.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`relative grid place-items-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400 ${small ? 'size-20' : 'aspect-square w-full max-w-[180px]'}`}
      >
        {value ? <img src={value} alt="" className="absolute inset-0 size-full object-cover" /> : null}
        <span className={`relative flex flex-col items-center gap-1 text-xs ${value ? 'rounded-md bg-white/85 px-2 py-1' : ''}`}>
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          {busy ? 'Envoi…' : value ? 'Changer' : label}
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" onChange={pick} className="hidden" />
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  )
}

function EditPack({
  pack, isNew, password, delivery, onClose, onApply, onDelete, onAuthError,
}: {
  pack: Pack
  isNew: boolean
  password: string
  delivery: number
  onClose: () => void
  onApply: (p: Pack) => void
  onDelete: () => void
  onAuthError: () => void
}) {
  const [p, setP] = useState<Pack>(pack)
  const [contents, setContents] = useState((pack.packContents ?? []).join('\n'))
  const [err, setErr] = useState('')
  const set = (patch: Partial<Pack>) => setP((x) => ({ ...x, ...patch }))
  const variants = p.variants ?? []

  function apply() {
    if (!p.name.trim()) return setErr('Donnez un nom au pack.')
    if (!(p.price > 0)) return setErr('Mettez un prix.')
    if (!p.image && !variants.length) return setErr('Ajoutez au moins une photo.')
    if (variants.some((v) => !v.image)) return setErr('Chaque couleur a besoin de sa photo.')
    onApply({
      ...p,
      name: p.name.trim(),
      packContents: contents.split('\n').map((x) => x.trim()).filter(Boolean),
    })
  }

  const field = 'mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <h2 className="font-semibold text-gray-900">{isNew ? 'Nouveau pack' : `Modifier le pack #${p.id}`}</h2>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr]">
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">Photo principale</p>
            <PhotoPicker value={p.image} onChange={(url) => set({ image: url })} password={password} onAuthError={onAuthError} label="Ajouter" />
            <p className="text-xs font-medium text-gray-500">2ᵉ photo <span className="text-gray-400">(optionnel)</span></p>
            <div className="flex items-start gap-2">
              <PhotoPicker value={p.hoverImage} onChange={(url) => set({ hoverImage: url })} password={password} onAuthError={onAuthError} label="Ajouter" small />
              {p.hoverImage && (
                <button onClick={() => set({ hoverImage: undefined })} className="text-xs text-gray-500 underline">Retirer</button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-medium text-gray-500">
              Nom (boutique)
              <input value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="ex. pack15+boite" className={field} />
            </label>
            <label className="block text-xs font-medium text-gray-500">
              Titre en arabe <span className="text-gray-400">(pages pub — optionnel)</span>
              <input dir="rtl" value={p.titleAr ?? ''} onChange={(e) => set({ titleAr: e.target.value })} placeholder="باك ساعة مع الإكسسوارات" className={field} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-gray-500">
                Prix (DH)
                <input type="number" min={1} value={p.price || ''} onChange={(e) => set({ price: Number(e.target.value) })} className={`${field} font-semibold`} />
              </label>
              <label className="block text-xs font-medium text-gray-500">
                Ancien prix barré (DH)
                <input type="number" min={0} value={p.originalPrice || ''} placeholder="—" onChange={(e) => set({ originalPrice: Number(e.target.value) || undefined })} className={field} />
              </label>
            </div>
            <Remaining price={p.price || 0} delivery={delivery} />
            <label className="block text-xs font-medium text-gray-500">
              Description
              <textarea value={p.description} onChange={(e) => set({ description: e.target.value })} rows={3} className={field} />
            </label>
            <label className="block text-xs font-medium text-gray-500">
              Contenu du pack <span className="text-gray-400">(une ligne par article — optionnel)</span>
              <textarea value={contents} onChange={(e) => setContents(e.target.value)} rows={3} placeholder={'Montre dorée\nBracelet\nCollier'} className={field} />
            </label>

            <div>
              <p className="text-xs font-medium text-gray-500">Couleurs <span className="text-gray-400">(optionnel — une photo par couleur)</span></p>
              <div className="mt-2 space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                    <PhotoPicker
                      value={v.image}
                      onChange={(url) => set({ variants: variants.map((x, j) => (j === i ? { ...x, image: url } : x)) })}
                      password={password}
                      onAuthError={onAuthError}
                      label="Photo"
                      small
                    />
                    <div className="flex flex-1 flex-wrap gap-1.5">
                      {COLORS.map((c) => (
                        <button
                          key={c.v}
                          type="button"
                          onClick={() => set({ variants: variants.map((x, j) => (j === i ? { ...x, color: c.v } : x)) })}
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${v.color === c.v ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600'}`}
                        >
                          <span className="size-3 rounded-full border border-black/10" style={{ background: c.hex }} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => set({ variants: variants.filter((_, j) => j !== i) })} className="grid size-8 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600" title="Retirer">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set({ variants: [...variants, { color: COLORS.find((c) => !variants.some((v) => v.color === c.v))?.v ?? 'gold', image: '' }] })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Plus size={14} /> Ajouter une couleur
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-gray-500">
                Note (étoiles)
                <input type="number" min={0} max={5} step={0.1} value={p.rating} onChange={(e) => set({ rating: Math.min(5, Math.max(0, Number(e.target.value))) })} className={field} />
              </label>
              <label className="block text-xs font-medium text-gray-500">
                Nombre d'avis
                <input type="number" min={0} value={p.reviews} onChange={(e) => set({ reviews: Math.max(0, Math.round(Number(e.target.value))) })} className={field} />
              </label>
            </div>
            <div className="flex flex-wrap gap-5">
              <Toggle on={p.inStock} onChange={(v) => set({ inStock: v })} label="En stock (visible)" />
              <Toggle on={!!p.isBestSeller} onChange={(v) => set({ isBestSeller: v })} label="Best seller" />
            </div>
          </div>
        </div>

        {err && <p className="mx-5 mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-5 py-4">
          {isNew ? <span /> : (
            <button
              onClick={() => { if (confirm(`Supprimer définitivement le pack #${p.id} ? (Pour le cacher seulement, désactivez « En stock ».)`)) onDelete() }}
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
            >
              <Trash2 size={14} /> Supprimer
            </button>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
            <button onClick={apply} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              <Check size={16} /> {isNew ? 'Ajouter' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
