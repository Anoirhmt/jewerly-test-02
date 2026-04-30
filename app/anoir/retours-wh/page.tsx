'use client'
import { useEffect, useState } from 'react'
import { Search, Warehouse } from 'lucide-react'
import { getReturns, updateReturnStatus } from '@/lib/riyalto-api'
import type { Return, ReturnStatus } from '@/types/admin'

export default function RetoursWHPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await getReturns()
    setReturns(data.filter(r => r.returnStatus === 'en_transit_retour'))
    setLoading(false)
  }

  async function handleStatusChange(id: string, status: ReturnStatus) {
    setUpdating(id)
    await updateReturnStatus(id, status)
    setReturns(prev => prev.map(r => r.id === id ? { ...r, returnStatus: status } : r))
    setUpdating(null)
  }

  const filtered = returns.filter(r => {
    const q = search.toLowerCase()
    return !search || r.trackingNumber.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 flex items-center gap-2">
          <Warehouse size={22} className="text-orange-500" />
          Retours WH
        </h1>
        <p className="text-sm text-zinc-500 mt-1">{returns.length} colis en transit vers l&apos;entrepôt</p>
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
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{filtered.length} RETOURS WH</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-zinc-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3">Tracking lié</th>
                  <th className="text-left px-6 py-3">Code scanné</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-left px-6 py-3">Ville</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(ret => (
                  <tr key={ret.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-mono text-xs text-zinc-500">{ret.trackingNumber}</td>
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-zinc-800">{ret.scannedCode || ret.trackingNumber}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-zinc-900">{ret.customerName}</div>
                      <div className="text-zinc-400 text-xs">{ret.customerPhone}</div>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-600">{ret.city}</td>
                    <td className="px-6 py-3.5 font-medium">{ret.total} MAD</td>
                    <td className="px-6 py-3.5 text-zinc-500 text-xs">{new Date(ret.createdAt).toLocaleDateString('fr-MA')}</td>
                    <td className="px-6 py-3.5">
                      <select
                        value={ret.returnStatus}
                        onChange={e => handleStatusChange(ret.id, e.target.value as ReturnStatus)}
                        disabled={updating === ret.id}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 bg-white"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="en_transit_retour">En transit</option>
                        <option value="recu">Reçu</option>
                        <option value="non_recu">Non reçu</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-zinc-400">Aucun retour WH pour le moment</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
