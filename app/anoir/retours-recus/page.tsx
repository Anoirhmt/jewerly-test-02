'use client'
import { useEffect, useState } from 'react'
import { getRetourOrders, unreceiveOrder } from '@/lib/retours-api'
import type { RiyaltoOrder } from '@/lib/retours-api'
import { CheckCircle2, Search, PackageOpen } from 'lucide-react'

export default function RetoursRecusPage() {
  const [orders, setOrders] = useState<RiyaltoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { orders: data } = await getRetourOrders()
    setOrders(data.filter(o => o.received))
    setLoading(false)
  }

  async function handleUnreceive(riya: string) {
    setUpdating(riya)
    await unreceiveOrder(riya)
    setOrders(prev => prev.filter(o => o.riya !== riya))
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return !search ||
      o.riya.toLowerCase().includes(q) ||
      o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.city.toLowerCase().includes(q)
  })

  const total = filtered.reduce((s, o) => s + (parseInt(o.price) || 0), 0)

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <CheckCircle2 size={24} className="text-green-500" />
          Retours reçus
        </h1>
        <p className="text-sm text-zinc-400 mt-0.5">Colis retournés confirmés reçus en entrepôt</p>
      </div>

      <div className="flex gap-3">
        <div className="bg-zinc-900 rounded-xl px-5 py-4 flex items-center justify-between flex-1">
          <div>
            <div className="text-3xl font-bold text-white">{orders.length}</div>
            <div className="text-xs text-zinc-400 mt-0.5 uppercase tracking-widest font-semibold">Reçus</div>
          </div>
          <CheckCircle2 size={32} className="text-green-400 opacity-60" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex-1">
          <div className="text-2xl font-bold text-zinc-900">{total} DH</div>
          <div className="text-xs text-zinc-500 mt-0.5 uppercase tracking-widest font-semibold">Valeur totale</div>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par code, nom, téléphone, ville..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="text-left px-5 py-3">Code RIYA</th>
                <th className="text-left px-5 py-3">Client</th>
                <th className="text-left px-5 py-3">Ville</th>
                <th className="text-left px-5 py-3">Prix</th>
                <th className="text-left px-5 py-3">État Riyalto</th>
                <th className="text-left px-5 py-3">Date reçu</th>
                <th className="text-left px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}>
                    {[1, 2, 3, 4, 5, 6, 7].map(j => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <PackageOpen size={36} className="mb-3 text-gray-300" />
                      <p className="font-medium text-zinc-500">Aucun retour reçu</p>
                      <p className="text-xs mt-1">Les retours confirmés apparaîtront ici</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.riya} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-blue-600">{o.riya}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900">{o.name || '—'}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{o.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600">{o.city}</td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{o.price} DH</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-gray-100 text-zinc-600 px-2 py-1 rounded-full">{o.state}</span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs">{o.date_recu || '—'}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleUnreceive(o.riya)}
                        disabled={updating === o.riya}
                        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        {updating === o.riya ? '...' : 'Annuler'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
