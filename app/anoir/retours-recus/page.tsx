'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle2, PackageOpen } from 'lucide-react'
import { getReturns, updateReturnStatus } from '@/lib/riyalto-api'
import type { Return, ReturnStatus } from '@/types/admin'

export default function RetoursRecusPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await getReturns()
    setReturns(data.filter(r => r.returnStatus === 'recu'))
    setLoading(false)
  }

  async function handleStatusChange(id: string, status: ReturnStatus) {
    setUpdating(id)
    await updateReturnStatus(id, status)
    setReturns(prev => prev.filter(r => r.id !== id))
    setUpdating(null)
  }

  const filtered = returns.filter(r => {
    const q = search.toLowerCase()
    return !search ||
      r.trackingNumber.toLowerCase().includes(q) ||
      (r.scannedCode || '').toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.city.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-5 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <CheckCircle2 size={24} className="text-green-500" />
          Retours reçus
        </h1>
        <p className="text-sm text-zinc-400 mt-0.5">Colis retournés et confirmés reçus en entrepôt</p>
      </div>

      <div className="bg-zinc-900 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold text-white">{returns.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5 uppercase tracking-widest font-semibold">Retours reçus</div>
        </div>
        <CheckCircle2 size={36} className="text-green-400 opacity-60" />
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par tracking, code scanné, nom, ville..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Tracking lié</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-zinc-800 uppercase tracking-widest">Code scanné</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Ville</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Montant</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Date reçu</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Modifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <>
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      {[90, 110, 120, 70, 60, 70, 90].map((w, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${w}px` }} />
                          {j === 2 && <div className="h-3 bg-gray-100 rounded animate-pulse mt-1.5" style={{ width: '65px' }} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
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
                filtered.map(ret => (
                  <tr key={ret.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-zinc-400">{ret.trackingNumber}</td>
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-zinc-900">{ret.scannedCode || ret.trackingNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-zinc-900 text-sm">{ret.customerName}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{ret.customerPhone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-600 text-sm">{ret.city}</td>
                    <td className="px-5 py-3.5 font-bold text-zinc-900 text-sm">{ret.total} MAD</td>
                    <td className="px-5 py-3.5 text-zinc-500 text-xs">
                      {ret.receivedAt ? new Date(ret.receivedAt).toLocaleDateString('fr-MA') : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={ret.returnStatus}
                        onChange={e => handleStatusChange(ret.id, e.target.value as ReturnStatus)}
                        disabled={updating === ret.id}
                        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 bg-white text-zinc-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="en_transit_retour">En transit retour</option>
                        <option value="recu">Reçu</option>
                        <option value="non_recu">Non reçu</option>
                      </select>
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
