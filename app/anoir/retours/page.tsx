'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react'
import { getReturns, updateReturnStatus } from '@/lib/riyalto-api'
import type { Return, ReturnStatus } from '@/types/admin'

const returnStatusConfig: Record<ReturnStatus, { label: string; color: string; icon: React.ElementType }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  en_transit_retour: { label: 'En transit retour', color: 'bg-blue-100 text-blue-800', icon: Truck },
  recu: { label: 'Reçu', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  non_recu: { label: 'Non reçu', color: 'bg-red-100 text-red-800', icon: XCircle },
}

export default function RetoursPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { loadReturns() }, [])

  async function loadReturns() {
    setLoading(true)
    setReturns(await getReturns())
    setLoading(false)
  }

  async function handleStatusChange(returnId: string, status: ReturnStatus) {
    setUpdating(returnId)
    await updateReturnStatus(returnId, status)
    setReturns(prev =>
      prev.map(r =>
        r.id === returnId
          ? { ...r, returnStatus: status, receivedAt: status === 'recu' ? new Date().toISOString() : r.receivedAt }
          : r
      )
    )
    setUpdating(null)
  }

  const filtered = returns.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      r.customerName.toLowerCase().includes(q) ||
      r.trackingNumber.toLowerCase().includes(q) ||
      r.customerPhone.includes(q)
    const matchStatus = filterStatus === 'all' || r.returnStatus === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    enAttente: returns.filter(r => r.returnStatus === 'en_attente').length,
    enTransit: returns.filter(r => r.returnStatus === 'en_transit_retour').length,
    recu: returns.filter(r => r.returnStatus === 'recu').length,
    nonRecu: returns.filter(r => r.returnStatus === 'non_recu').length,
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gestion des retours</h1>
        <p className="text-sm text-zinc-500 mt-1">{returns.length} retour{returns.length !== 1 ? 's' : ''} au total</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat label="En attente" value={stats.enAttente} className="bg-yellow-50 text-yellow-700 border border-yellow-200" />
        <MiniStat label="En transit retour" value={stats.enTransit} className="bg-blue-50 text-blue-700 border border-blue-200" />
        <MiniStat label="Reçus" value={stats.recu} className="bg-green-50 text-green-700 border border-green-200" />
        <MiniStat label="Non reçus" value={stats.nonRecu} className="bg-red-50 text-red-700 border border-red-200" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, tracking..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(returnStatusConfig).map(([v, { label }]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-zinc-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">Tracking</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-left px-6 py-3">Articles</th>
                  <th className="text-left px-6 py-3">Ville</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Raison</th>
                  <th className="text-left px-6 py-3">Date retour</th>
                  <th className="text-left px-6 py-3">Statut</th>
                  <th className="text-left px-6 py-3">Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(ret => {
                  const config = returnStatusConfig[ret.returnStatus]
                  const StatusIcon = config.icon
                  return (
                    <tr key={ret.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs text-zinc-600">{ret.trackingNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{ret.customerName}</div>
                        <div className="text-zinc-400 text-xs">{ret.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 max-w-[160px] truncate" title={ret.items}>{ret.items}</td>
                      <td className="px-6 py-4 text-zinc-600">{ret.city}</td>
                      <td className="px-6 py-4 font-medium text-zinc-900">{ret.total} MAD</td>
                      <td className="px-6 py-4 text-zinc-500 text-xs max-w-[120px] truncate" title={ret.reason}>{ret.reason || '—'}</td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {new Date(ret.createdAt).toLocaleDateString('fr-MA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <StatusIcon size={12} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ret.returnStatus}
                          onChange={e => handleStatusChange(ret.id, e.target.value as ReturnStatus)}
                          disabled={updating === ret.id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 bg-white"
                        >
                          {Object.entries(returnStatusConfig).map(([v, { label }]) => (
                            <option key={v} value={v}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-zinc-400">
                      Aucun retour trouvé
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

function MiniStat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-80">{label}</div>
    </div>
  )
}
