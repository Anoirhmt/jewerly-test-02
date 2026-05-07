'use client'
import { useEffect, useState } from 'react'
import { getRetourOrders, receiveOrder, unreceiveOrder } from '@/lib/retours-api'
import type { RiyaltoOrder } from '@/lib/retours-api'
import { RefreshCw, AlertTriangle, ScanLine } from 'lucide-react'
import Link from 'next/link'

const STATE_COLORS: Record<string, { text: string; bg: string }> = {
  'retourné vers client': { text: '#1b5e20', bg: '#e7f3e8' },
  'Annulé':              { text: '#b71c1c', bg: '#fff0f0' },
  'Injoignable':         { text: '#e65100', bg: '#fff3e0' },
  'Reporté':             { text: '#1565c0', bg: '#e3f2fd' },
}

function priceInt(p: string) {
  try { return parseInt(p) || 0 } catch { return 0 }
}

export default function RetoursPage() {
  const [orders, setOrders] = useState<RiyaltoOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending' | 'received'>('pending')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { orders: data, error: err } = await getRetourOrders()
    setOrders(data)
    setError(err)
    setLoading(false)
  }

  async function handleReceive(riya: string) {
    setUpdating(riya)
    await receiveOrder(riya)
    setOrders(prev => prev.map(o =>
      o.riya === riya ? { ...o, received: true, date_recu: new Date().toISOString().split('T')[0] } : o
    ))
    setUpdating(null)
  }

  async function handleUnreceive(riya: string) {
    setUpdating(riya)
    await unreceiveOrder(riya)
    setOrders(prev => prev.map(o =>
      o.riya === riya ? { ...o, received: false, date_recu: '' } : o
    ))
    setUpdating(null)
  }

  const pending  = orders.filter(o => !o.received)
  const received = orders.filter(o => o.received)
  const totalP   = pending.reduce((s, o) => s + priceInt(o.price), 0)
  const totalR   = received.reduce((s, o) => s + priceInt(o.price), 0)
  const shown    = tab === 'pending' ? pending : received

  return (
    <div className="space-y-5 font-sans pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Retours Riyalto</h1>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 text-zinc-500 transition-colors">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle size={16} className="shrink-0" />
          <span>Riyalto indisponible — données locales affichées</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-zinc-900">{pending.length}</div>
          <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">À recevoir</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-orange-400">
          <div className="text-xl font-bold text-zinc-900">{totalP} DH</div>
          <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">Valeur att.</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-zinc-900">{received.length}</div>
          <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">Reçus</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-blue-500">
          <div className="text-xl font-bold text-zinc-900">{totalR} DH</div>
          <div className="text-xs text-zinc-500 mt-1 font-semibold uppercase tracking-wide">Valeur rec.</div>
        </div>
      </div>

      <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
        {(['pending', 'received'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              tab === t ? 'bg-[#1a1a2e] text-white' : 'text-zinc-500 hover:bg-gray-50'
            }`}
          >
            {t === 'pending' ? 'En attente' : 'Reçus'}
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-zinc-500'
            }`}>
              {t === 'pending' ? pending.length : received.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900" />
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <div className="text-5xl mb-3">{tab === 'pending' ? '📭' : '📦'}</div>
          <div className="font-semibold text-zinc-600">
            {tab === 'pending' ? 'Aucun retour en attente' : 'Aucun retour reçu'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(o => {
            const sc = STATE_COLORS[o.state] || { text: '#65676b', bg: '#e4e6eb' }
            return (
              <div
                key={o.riya}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden border-l-4 ${
                  o.received ? 'border-l-green-500' : 'border-l-red-500'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-bold text-blue-600">{o.riya}</div>
                      <div className="font-semibold text-zinc-900 mt-1">{o.name || '—'}</div>
                      <div className="text-sm text-zinc-500 mt-0.5">{o.city} · {o.price} DH · {o.date}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {o.received ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Reçu ✓</span>
                      ) : (
                        <span
                          style={{ background: sc.bg, color: sc.text }}
                          className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                        >
                          {o.state}
                        </span>
                      )}
                      {o.archived && <span className="text-xs text-zinc-400">Archivé</span>}
                    </div>
                  </div>
                  {o.received ? (
                    <button
                      onClick={() => handleUnreceive(o.riya)}
                      disabled={updating === o.riya}
                      className="w-full py-2.5 text-sm font-semibold text-zinc-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      {updating === o.riya ? 'En cours...' : 'Annuler la réception'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReceive(o.riya)}
                      disabled={updating === o.riya}
                      className="w-full py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {updating === o.riya ? 'En cours...' : '✓ Reçu physiquement'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Link
        href="/anoir/scan"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-lg font-bold text-sm hover:bg-blue-700 transition-colors z-50"
      >
        <ScanLine size={18} />
        Scanner
      </Link>
    </div>
  )
}
