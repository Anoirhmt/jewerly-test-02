'use client'
import { useEffect, useState } from 'react'
import { Search, Package, RefreshCw } from 'lucide-react'
import { getAllOrders } from '@/lib/retours-api'
import type { RiyaltoOrderLight } from '@/lib/retours-api'

const TABS = [
  { key: 'encours',   label: 'En cours',  color: 'text-blue-600',  badge: 'bg-blue-600' },
  { key: 'delivered', label: 'Livrées',   color: 'text-green-600', badge: 'bg-green-600' },
  { key: 'failed',    label: 'Échouées',  color: 'text-red-600',   badge: 'bg-red-600' },
] as const
type TabKey = typeof TABS[number]['key']

const STATE_COLORS: Record<string, string> = {
  'Livré':                  'bg-green-100 text-green-800',
  'Mise en distribution':   'bg-blue-100 text-blue-800',
  'Injoignable':            'bg-orange-100 text-orange-800',
  'Reporté':                'bg-yellow-100 text-yellow-800',
  '3 Jour Pas De Reponse':  'bg-orange-100 text-orange-800',
  'Retourné':               'bg-red-100 text-red-800',
  'Annulé':                 'bg-gray-100 text-gray-700',
}

function stateColor(state: string) {
  return STATE_COLORS[state] ?? 'bg-gray-100 text-gray-600'
}

function SkeletonRow() {
  return (
    <tr>
      {[90, 130, 90, 70, 80, 70].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: w }} />
          {i === 1 && <div className="h-3 bg-gray-100 rounded animate-pulse mt-1.5 w-16" />}
        </td>
      ))}
    </tr>
  )
}

export default function TousLesColisPage() {
  const [encours, setEncours]     = useState<RiyaltoOrderLight[]>([])
  const [delivered, setDelivered] = useState<RiyaltoOrderLight[]>([])
  const [failed, setFailed]       = useState<RiyaltoOrderLight[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [tab, setTab]             = useState<TabKey>('encours')
  const [search, setSearch]       = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  async function load() {
    setLoading(true)
    const data = await getAllOrders()
    setEncours(data.encours)
    setDelivered(data.delivered)
    setFailed(data.failed)
    setError(data.error)
    setLastRefresh(new Date())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const lists: Record<TabKey, RiyaltoOrderLight[]> = { encours, delivered, failed }

  const filtered = lists[tab].filter(o => {
    const q = search.toLowerCase()
    return !q ||
      o.riya.toLowerCase().includes(q) ||
      o.name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.phone.includes(q)
  })

  const totalDH = {
    encours:   encours.reduce((s, o) => s + parseFloat(o.price || '0'), 0),
    delivered: delivered.reduce((s, o) => s + parseFloat(o.price || '0'), 0),
    failed:    failed.reduce((s, o) => s + parseFloat(o.price || '0'), 0),
  }

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tous les colis</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {lastRefresh ? `Mis à jour à ${lastRefresh.toLocaleTimeString('fr-MA')}` : 'Chargement…'}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-zinc-900">{encours.length}</div>
          <div className="text-sm font-medium text-zinc-700 mt-0.5">En cours</div>
          <div className="text-xs text-blue-600 mt-0.5 font-medium">{totalDH.encours.toLocaleString('fr-MA')} DH</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-zinc-900">{delivered.length}</div>
          <div className="text-sm font-medium text-zinc-700 mt-0.5">Livrées</div>
          <div className="text-xs text-green-600 mt-0.5 font-medium">{totalDH.delivered.toLocaleString('fr-MA')} DH</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-zinc-900">{failed.length}</div>
          <div className="text-sm font-medium text-zinc-700 mt-0.5">Échouées</div>
          <div className="text-xs text-red-500 mt-0.5 font-medium">{totalDH.failed.toLocaleString('fr-MA')} DH</div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => {
          const count = lists[t.key].length
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                active ? `border-current ${t.color}` : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-gray-300'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                active ? `${t.badge} text-white` : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par RIYA, nom, ville, téléphone…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3">RIYA</th>
                <th className="text-left px-5 py-3">Client</th>
                <th className="text-left px-5 py-3">Ville</th>
                <th className="text-left px-5 py-3">Prix</th>
                <th className="text-left px-5 py-3">Statut</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <Package size={36} className="mb-3 text-gray-300" />
                      <p className="font-medium text-zinc-500">Aucun colis trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.riya} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">{o.riya}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900 text-sm">{o.name || '—'}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{o.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 text-sm">{o.city || '—'}</td>
                    <td className="px-5 py-4 font-bold text-zinc-900 text-sm">{o.price} DH</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stateColor(o.state)}`}>
                        {o.state}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">{o.date}</td>
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
