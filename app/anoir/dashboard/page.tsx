'use client'
import { useEffect, useState } from 'react'
import { Package, Truck, CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react'
import { getOrders, getReturns } from '@/lib/riyalto-api'
import type { Order, Return, OrderStatus } from '@/types/admin'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  picked_up: { label: 'Ramassé', color: 'bg-blue-100 text-blue-800' },
  in_transit: { label: 'En transit', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livré', color: 'bg-green-100 text-green-800' },
  returned: { label: 'Retourné', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' },
}

const sourceStyles: Record<string, { bg: string; label: string }> = {
  website: { bg: 'bg-blue-50 text-blue-700', label: 'Website' },
  whatsapp: { bg: 'bg-green-50 text-green-700', label: 'WhatsApp' },
  tiktok: { bg: 'bg-pink-50 text-pink-700', label: 'TikTok' },
}

function formatDateFr(date: Date): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: i === 2 ? '120px' : i === 1 ? '90px' : '70px' }} />
        </td>
      ))}
    </tr>
  )
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

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOrders(), getReturns()]).then(([o, r]) => {
      setOrders(o)
      setReturns(r)
      setLoading(false)
    })
  }, [])

  const delivered = orders.filter(o => o.status === 'delivered')
  const inTransit = orders.filter(o => o.status === 'in_transit' || o.status === 'picked_up')
  const returnsList = returns.filter(r => r.returnStatus === 'en_attente' || r.returnStatus === 'en_transit_retour')
  const revenue = delivered.reduce((sum, o) => sum + o.total, 0)
  const deliveryRate = orders.length > 0 ? Math.round((delivered.length / orders.length) * 100) : 0
  const returnRate = orders.length > 0 ? Math.round((returns.length / orders.length) * 100) : 0

  const sourceCounts = {
    whatsapp: orders.filter(o => o.source === 'whatsapp').length,
    tiktok: orders.filter(o => o.source === 'tiktok').length,
    website: orders.filter(o => o.source === 'website').length,
  }
  const maxSource = Math.max(...Object.values(sourceCounts), 1)

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const today = formatDateFr(new Date())

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tableau de bord</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-blue-500">
              <div className="text-3xl font-bold text-zinc-900">{orders.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">Total commandes</div>
              <div className="text-xs text-zinc-400 mt-0.5">Toutes sources</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-green-500">
              <div className="text-3xl font-bold text-zinc-900">{delivered.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">Livrées</div>
              <div className="text-xs text-green-600 mt-0.5 font-medium">{deliveryRate}% taux de livraison</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-purple-500">
              <div className="text-3xl font-bold text-zinc-900">{inTransit.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">En transit</div>
              <div className="text-xs text-zinc-400 mt-0.5">En cours de livraison</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 border-l-4 border-l-red-500">
              <div className="text-3xl font-bold text-zinc-900">{returnsList.length}</div>
              <div className="text-sm font-medium text-zinc-700 mt-1">Retours actifs</div>
              <div className="text-xs text-red-500 mt-0.5 font-medium">{returnRate}% taux de retour</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" />
            <h2 className="font-semibold text-zinc-900 text-sm">Chiffre d&apos;affaires</h2>
          </div>
          {loading ? (
            <>
              <div className="h-8 w-36 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-zinc-900">
                {revenue.toLocaleString('fr-MA')} MAD
              </div>
              <div className="text-xs text-zinc-400 mt-1">{delivered.length} commandes livrées</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-zinc-500 mb-1">Panier moyen</div>
                <div className="text-lg font-semibold text-zinc-800">
                  {delivered.length > 0 ? Math.round(revenue / delivered.length).toLocaleString('fr-MA') : 0} MAD
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <h2 className="font-semibold text-zinc-900 text-sm mb-4">Répartition par source</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-2.5 w-full bg-gray-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500', count: sourceCounts.whatsapp },
                { key: 'tiktok', label: 'TikTok', color: 'bg-pink-500', count: sourceCounts.tiktok },
                { key: 'website', label: 'Website', color: 'bg-blue-500', count: sourceCounts.website },
              ].map(({ key, label, color, count }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-zinc-700 font-medium">{label}</span>
                    <span className="text-sm font-bold text-zinc-900">{count} colis</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${Math.round((count / maxSource) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 text-sm">Commandes récentes</h2>
          <span className="text-xs text-zinc-400">6 dernières</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="text-left px-6 py-3">Tracking</th>
                <th className="text-left px-6 py-3">Client</th>
                <th className="text-left px-6 py-3">Ville</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-left px-6 py-3">Source</th>
                <th className="text-left px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                <>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.trackingNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 text-sm">{order.customerName}</div>
                        <div className="text-zinc-400 text-xs">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 text-sm">{order.city}</td>
                      <td className="px-6 py-4 font-bold text-zinc-900 text-sm">{order.total} MAD</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceStyles[order.source]?.bg || 'bg-gray-100 text-gray-700'}`}>
                          {sourceStyles[order.source]?.label || order.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                          {statusConfig[order.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                        Aucune commande pour le moment
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
