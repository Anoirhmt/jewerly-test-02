'use client'
import { useEffect, useState } from 'react'
import { getRetourOrders, receiveOrder } from '@/lib/retours-api'
import type { RiyaltoOrder } from '@/lib/retours-api'
import { ScanLine, Search } from 'lucide-react'
import Link from 'next/link'

export default function NonScannesPage() {
  const [orders, setOrders] = useState<RiyaltoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { orders: data } = await getRetourOrders()
    setOrders(data.filter(o => !o.received))
    setLoading(false)
  }

  async function handleReceive(riya: string) {
    setUpdating(riya)
    await receiveOrder(riya)
    setOrders(prev => prev.filter(o => o.riya !== riya))
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return !search ||
      o.riya.toLowerCase().includes(q) ||
      o.name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 flex items-center gap-2">
            <ScanLine size={22} className="text-red-500" />
            Non reçus
          </h1>
          <p className="text-sm text-zinc-500 mt-1">{orders.length} retours en attente de réception</p>
        </div>
        <Link
          href="/anoir/scan"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          <ScanLine size={16} />
          Scanner
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-red-50">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">{filtered.length} EN ATTENTE</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-zinc-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3">Code RIYA</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-left px-6 py-3">Ville</th>
                  <th className="text-left px-6 py-3">Prix</th>
                  <th className="text-left px-6 py-3">État</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(o => (
                  <tr key={o.riya} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-blue-600">{o.riya}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-zinc-900">{o.name || '—'}</div>
                      <div className="text-zinc-400 text-xs">{o.phone}</div>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-600">{o.city}</td>
                    <td className="px-6 py-3.5 font-medium text-zinc-900">{o.price} DH</td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-medium">{o.state}</span>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 text-xs">{o.date}</td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleReceive(o.riya)}
                        disabled={updating === o.riya}
                        className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {updating === o.riya ? '...' : '✓ Reçu'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      Aucun retour en attente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
