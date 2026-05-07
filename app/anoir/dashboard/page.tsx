'use client'
import { useEffect, useState } from 'react'
import { Package, TrendingUp, RotateCcw, Truck } from 'lucide-react'
import { getAllOrders, getRetourOrders } from '@/lib/retours-api'
import type { RiyaltoOrderLight, RiyaltoOrder } from '@/lib/retours-api'

function formatDateFr(date: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-1" />
      <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5].map(i => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: i === 2 ? 120 : 80 }} />
          {i === 2 && <div className="h-3 bg-gray-100 rounded animate-pulse mt-1.5 w-16" />}
        </td>
      ))}
    </tr>
  )
}

const STATE_COLORS: Record<string, string> = {
  'Livré':                 'bg-green-100 text-green-800',
  'Mise en distribution':  'bg-blue-100 text-blue-800',
  'Injoignable':           'bg-orange-100 text-orange-800',
  'Reporté':               'bg-yellow-100 text-yellow-800',
  '3 Jour Pas De Reponse': 'bg-orange-100 text-orange-800',
  'Retourné':              'bg-red-100 text-red-800',
  'Annulé':                'bg-gray-100 text-gray-700',
}
function stateColor(s: string) { return STATE_COLORS[s] ?? 'bg-gray-100 text-gray-600' }

export default function DashboardPage() {
  const [encours, setEncours]     = useState<RiyaltoOrderLight[]>([])
  const [delivered, setDelivered] = useState<RiyaltoOrderLight[]>([])
  const [retours, setRetours]     = useState<RiyaltoOrder[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([getAllOrders(), getRetourOrders()]).then(([all, ret]) => {
      setEncours(all.encours)
      setDelivered(all.delivered)
      setRetours(ret.orders)
      setLoading(false)
    })
  }, [])

  const totalColis   = encours.length + delivered.length
  const totalRevenue = delivered.reduce((s, o) => s + parseFloat(o.price || '0'), 0)
  const pendingRetours = retours.filter(o => !o.received).length
  const deliveryRate = totalColis > 0 ? Math.round((delivered.length / totalColis) * 100) : 0

  const recentEncours = encours.slice(0, 6)

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Tableau de bord</h1>
        <p className="text-sm text-zinc-400 mt-0.5">{formatDateFr(new Date())}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-blue-500">
              <div className="text-3xl font-bold text-zinc-900">{encours.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">En cours</div>
              <div className="text-xs text-blue-600 mt-0.5 font-medium">En distribution</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-green-500">
              <div className="text-3xl font-bold text-zinc-900">{delivered.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">Livrées</div>
              <div className="text-xs text-green-600 mt-0.5 font-medium">{deliveryRate}% taux</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-red-500">
              <div className="text-3xl font-bold text-zinc-900">{pendingRetours}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">Retours en attente</div>
              <div className="text-xs text-red-500 mt-0.5 font-medium">Non scannés</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-purple-500">
              <div className="text-3xl font-bold text-zinc-900">{totalRevenue.toLocaleString('fr-MA')}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">DH livrés</div>
              <div className="text-xs text-purple-600 mt-0.5 font-medium">{delivered.length} colis</div>
            </div>
          </>
        )}
      </div>

      {/* Recent en cours */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-blue-500" />
            <h2 className="font-semibold text-zinc-900 text-sm">Colis en cours</h2>
          </div>
          <span className="text-xs text-zinc-400">
            {loading ? '…' : `${encours.length} total`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="text-left px-6 py-3">RIYA</th>
                <th className="text-left px-6 py-3">Client</th>
                <th className="text-left px-6 py-3">Ville</th>
                <th className="text-left px-6 py-3">Prix</th>
                <th className="text-left px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              ) : recentEncours.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                    Aucun colis en cours
                  </td>
                </tr>
              ) : (
                recentEncours.map(o => (
                  <tr key={o.riya} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{o.riya}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 text-sm">{o.name || '—'}</div>
                      <div className="text-zinc-400 text-xs">{o.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 text-sm">{o.city || '—'}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 text-sm">{o.price} DH</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stateColor(o.state)}`}>
                        {o.state}
                      </span>
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
