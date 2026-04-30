'use client'
import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { getOrders } from '@/lib/riyalto-api'
import type { Order, OrderStatus } from '@/types/admin'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  picked_up: { label: 'Ramassé', color: 'bg-blue-100 text-blue-800' },
  in_transit: { label: 'En transit', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livré', color: 'bg-green-100 text-green-800' },
  returned: { label: 'Retourné', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' },
}

export default function HistoriquePage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then(data => {
      setOrders([...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 flex items-center gap-2">
          <History size={22} className="text-zinc-500" />
          Historique
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Toutes les commandes triées par date</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-zinc-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase tracking-widest">
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3">Tracking</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-left px-6 py-3">Articles</th>
                  <th className="text-left px-6 py-3">Ville</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Source</th>
                  <th className="text-left px-6 py-3">Statut</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-mono text-xs text-zinc-500">{order.trackingNumber}</td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-zinc-900">{order.customerName}</div>
                      <div className="text-zinc-400 text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-600 max-w-[160px] truncate">{order.items}</td>
                    <td className="px-6 py-3.5 text-zinc-600">{order.city}</td>
                    <td className="px-6 py-3.5 font-medium">{order.total} MAD</td>
                    <td className="px-6 py-3.5 capitalize text-zinc-500 text-xs">{order.source}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString('fr-MA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
