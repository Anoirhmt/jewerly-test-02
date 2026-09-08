'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { RefreshCw, ChevronDown, TrendingUp, Package, DollarSign } from 'lucide-react'

type Order = {
  riya: string
  name: string
  phone: string
  city: string
  price: string
  state: string
  bucket: 'encours' | 'delivered' | 'failed'
}
type Day = {
  date: string
  date_display: string
  weekday: string
  orders: Order[]
  total: number
  revenue: number
}
type Data = { days: Day[]; error?: string }

function cleanPrice(v: string) { return String(v || '').replace(/\s*DH\s*$/i, '').trim() }

function StatePill({ state, bucket }: { state: string; bucket: string }) {
  const cls =
    bucket === 'delivered' ? 'cl-pill-ok' :
    bucket === 'failed'    ? 'cl-pill-warn' :
    'cl-pill-accent'
  const label = state || (bucket === 'delivered' ? 'Livré' : bucket === 'failed' ? 'Retour' : 'En cours')
  return <span className={`cl-pill ${cls}`}>{label}</span>
}

export default function JournalPage() {
  const [data, setData] = useState<Data | null>(null)
  const [q, setQ] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [openDays, setOpenDays] = useState<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch('/api/retours/journal', { cache: 'no-store' })
      if (r.ok) {
        const d = await r.json()
        setData(d)
        if (d.days?.length && openDays.size === 0) {
          setOpenDays(new Set([d.days[0].date]))
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const refresh = async () => {
    setRefreshing(true)
    await fetchData()
    setTimeout(() => setRefreshing(false), 500)
  }

  const toggleDay = (date: string) => {
    setOpenDays(prev => {
      const n = new Set(prev)
      n.has(date) ? n.delete(date) : n.add(date)
      return n
    })
  }
  const expandAll = () => setOpenDays(new Set(filteredDays.map(d => d.date)))
  const collapseAll = () => setOpenDays(new Set())

  const filteredDays = useMemo(() => {
    if (!data?.days) return []
    if (!q) return data.days
    const qq = q.toLowerCase()
    return data.days
      .map(day => ({
        ...day,
        orders: day.orders.filter(o =>
          o.name.toLowerCase().includes(qq) ||
          o.phone.includes(q) ||
          o.city.toLowerCase().includes(qq) ||
          o.riya.toLowerCase().includes(qq)
        ),
      }))
      .filter(d => d.orders.length > 0)
  }, [data, q])

  const grandTotals = useMemo(() => {
    const days = data?.days ?? []
    return {
      totalOrders:  days.reduce((s, d) => s + d.total, 0),
      totalRevenue: days.reduce((s, d) => s + d.revenue, 0),
      avgPerDay:    days.length ? days.reduce((s, d) => s + d.revenue, 0) / days.length : 0,
    }
  }, [data])

  return (
    <div className="cl-scope space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>Journal</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>
            Toutes les commandes Riyalto groupées par jour · 30 derniers jours
          </p>
        </div>
        <button onClick={refresh} disabled={refreshing} className="cl-btn-blue">
          <RefreshCw size={14} className={refreshing ? 'cl-spin' : ''} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Grand totals */}
      <div className="grid grid-cols-3 gap-3">
        <div className="cl-stat">
          <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--cl-muted)' }}>
            <Package size={14} />
          </div>
          <div className="cl-stat-num">{grandTotals.totalOrders}</div>
          <div className="cl-stat-lbl">Commandes 30j</div>
        </div>
        <div className="cl-stat">
          <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--cl-muted)' }}>
            <DollarSign size={14} />
          </div>
          <div className="cl-stat-num" style={{ color: 'var(--cl-accent)' }}>
            {grandTotals.totalRevenue.toLocaleString('fr-MA')}
          </div>
          <div className="cl-stat-lbl">Revenus DH</div>
        </div>
        <div className="cl-stat">
          <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--cl-muted)' }}>
            <TrendingUp size={14} />
          </div>
          <div className="cl-stat-num" style={{ color: 'var(--cl-ok)' }}>
            {Math.round(grandTotals.avgPerDay).toLocaleString('fr-MA')}
          </div>
          <div className="cl-stat-lbl">Moyenne / jour</div>
        </div>
      </div>

      {/* Search + expand controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="cl-search flex-1 min-w-[200px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher nom, téléphone, ville, RIYA..." />
        </div>
        <button onClick={expandAll} className="cl-btn-ghost">Tout ouvrir</button>
        <button onClick={collapseAll} className="cl-btn-ghost">Tout fermer</button>
      </div>

      {/* Days */}
      {filteredDays.length === 0 && data ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <div className="cl-empty-t">Aucune commande</div>
          <div className="cl-empty-s">Essayez une autre recherche</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDays.map(day => {
            const isOpen = openDays.has(day.date)
            return (
              <div key={day.date} className="cl-day-card">
                <button onClick={() => toggleDay(day.date)} className="cl-day-header">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--cl-accent)' }}>
                        {day.weekday}
                      </span>
                      <span className="ml-2 font-serif text-lg" style={{ color: 'var(--cl-text)' }}>
                        {day.date_display}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--cl-muted)' }}>Commandes</div>
                      <div className="font-semibold" style={{ color: 'var(--cl-text)' }}>{day.total}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--cl-muted)' }}>Total</div>
                      <div className="font-semibold" style={{ color: 'var(--cl-accent)', fontVariantNumeric: 'tabular-nums' }}>
                        {day.revenue.toLocaleString('fr-MA')} <span className="text-xs font-normal">DH</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      style={{ color: 'var(--cl-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="cl-day-body">
                    {day.orders.map((o, i) => (
                      <div key={o.riya + i} className="cl-order-row">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="font-semibold truncate" style={{ color: 'var(--cl-text)' }}>{o.name || '—'}</div>
                            <div className="text-[12px] font-mono" style={{ color: 'var(--cl-subtle)' }}>{o.riya}</div>
                          </div>
                          <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--cl-muted)' }}>
                            <span>+{o.phone}</span>
                            <span>·</span>
                            <span>{o.city || '—'}</span>
                            <span>·</span>
                            <StatePill state={o.state} bucket={o.bucket} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold text-[15px]" style={{ color: 'var(--cl-accent)', fontVariantNumeric: 'tabular-nums' }}>
                            {cleanPrice(o.price)} <span className="text-xs font-normal" style={{ color: 'var(--cl-muted)' }}>DH</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .cl-day-card {
          background: var(--cl-surface);
          border: 1px solid var(--cl-border);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 140ms ease;
        }
        .cl-day-card:hover { border-color: var(--cl-border-strong); }
        .cl-day-header {
          width: 100%;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 140ms ease;
        }
        .cl-day-header:hover { background: var(--cl-surface-hover); }
        .cl-day-body {
          border-top: 1px solid var(--cl-border);
        }
        .cl-order-row {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid var(--cl-border);
          transition: background 140ms ease;
        }
        .cl-order-row:last-child { border-bottom: none; }
        .cl-order-row:hover { background: var(--cl-surface-hover); }
      `}</style>
    </div>
  )
}
