'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'

type OrderRow = {
  id: string
  source: string
  ts: string
  name: string
  phone: string
  city: string
  address: string
  items: string
  total: string
  delivery: string
  sara_status: 'pending' | 'confirmed' | 'cancelled'
  riyalto_status: 'not_sent' | 'sent' | 'failed'
  riyalto_ref: string
  riyalto_id: string
  sent_ts: string
}

type Data = {
  rows: OrderRow[]
  total: number
  confirmed: number
  cancelled: number
  pending: number
  sent: number
}

type Filter = 'all' | 'confirmed' | 'pending' | 'cancelled' | 'not_sent_riy'

function cleanNum(v: string) {
  return String(v || '').replace(/\s*DH\s*$/i, '').trim()
}
function parseNum(v: string) {
  const n = parseFloat(cleanNum(v).replace(',', '.'))
  return isNaN(n) ? 0 : n
}
function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}
function isoDayLE(iso: string) {
  try { return iso.slice(0, 10) } catch { return '' }
}

export default function OrdersView({
  source,
  title,
  subtitle,
}: {
  source: 'website' | 'sara'
  title: string
  subtitle: string
}) {
  const [data, setData] = useState<Data | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/orders/data?source=${source}`, { cache: 'no-store' })
      if (!r.ok) return
      setData(await r.json())
    } catch {}
  }, [source])

  useEffect(() => {
    fetchData()
    if (!autoRefresh) return
    const id = setInterval(fetchData, 5000)
    const onVis = () => { if (!document.hidden) fetchData() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [fetchData, autoRefresh])

  const showToast = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(null), 2600)
  }

  const sendToRiyalto = async (id: string) => {
    showToast('Sending...')
    try {
      const r = await fetch(`/api/admin/orders/send/${encodeURIComponent(id)}`, { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        showToast(`Sent · BL ${d.riyalto_ref || ''}`)
        fetchData()
        // Give the state a moment to update, then open PDF (10x10 format)
        setTimeout(async () => {
          const fresh = await fetch(`/api/admin/orders/data?source=${source}`, { cache: 'no-store' }).then(r => r.json())
          const row = fresh.rows.find((r: OrderRow) => r.id === id)
          if (row?.riyalto_id) window.open(`/api/admin/orders/pdf/${row.riyalto_id}?format=10x10`, '_blank')
        }, 500)
      } else {
        showToast('Failed · ' + (d.message || d.error || ''))
      }
    } catch (e) { showToast('Error: ' + e) }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order from the log?')) return
    await fetch(`/api/admin/orders/delete/${encodeURIComponent(id)}`, { method: 'POST' })
    showToast('Deleted')
    fetchData()
  }

  const markConfirmed = async (id: string) => {
    if (!confirm('Mark this order as confirmed without customer reply?')) return
    await fetch(`/api/admin/orders/mark-confirmed/${encodeURIComponent(id)}`, { method: 'POST' })
    showToast('Marked confirmed')
    fetchData()
  }

  const toggleSelected = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleSelectAllVisible = (ids: string[]) => {
    setSelected(prev => {
      const allSelected = ids.every(id => prev.has(id))
      const next = new Set(prev)
      if (allSelected) ids.forEach(id => next.delete(id))
      else ids.forEach(id => next.add(id))
      return next
    })
  }
  const printSelected = () => {
    if (!data) return
    const targets = data.rows.filter(r => selected.has(r.id) && r.riyalto_status === 'sent' && r.riyalto_id)
    if (targets.length === 0) {
      showToast('No printable orders selected (must be sent to Riyalto first)')
      return
    }
    showToast(`Opening ${targets.length} PDF${targets.length > 1 ? 's' : ''}...`)
    // Open all PDFs in new tabs — user click gesture allows this
    targets.forEach((r, i) => {
      setTimeout(() => {
        window.open(`/api/admin/orders/pdf/${r.riyalto_id}?format=10x10`, '_blank')
      }, i * 120) // slight stagger avoids popup-blocker
    })
  }

  // Filtering pipeline
  const filteredRows = useMemo(() => {
    let rows = data?.rows ?? []
    if (filter === 'confirmed') rows = rows.filter(r => r.sara_status === 'confirmed')
    else if (filter === 'pending') rows = rows.filter(r => r.sara_status === 'pending')
    else if (filter === 'cancelled') rows = rows.filter(r => r.sara_status === 'cancelled')
    else if (filter === 'not_sent_riy') rows = rows.filter(r => r.riyalto_status === 'not_sent' && r.sara_status === 'confirmed')
    if (q) {
      const qq = q.toLowerCase()
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(qq) ||
        r.phone.includes(q) ||
        r.city.toLowerCase().includes(qq) ||
        r.address.toLowerCase().includes(qq) ||
        r.items.toLowerCase().includes(qq)
      )
    }
    if (dateFrom) rows = rows.filter(r => isoDayLE(r.ts) >= dateFrom)
    if (dateTo) rows = rows.filter(r => isoDayLE(r.ts) <= dateTo)
    return rows
  }, [data, filter, q, dateFrom, dateTo])

  const displayRows = filteredRows.slice(0, pageSize)
  const revenue = useMemo(
    () => (data?.rows ?? []).filter(r => r.sara_status === 'confirmed').reduce((s, r) => s + parseNum(r.total), 0),
    [data]
  )

  const filters: { k: Filter; label: string }[] = [
    { k: 'all', label: 'All' },
    { k: 'confirmed', label: 'Confirmed' },
    { k: 'pending', label: 'Pending' },
    { k: 'cancelled', label: 'Cancelled' },
    { k: 'not_sent_riy', label: 'Ready to ship' },
  ]

  const visibleIds = displayRows.map(r => r.id)
  const allSelectedVisible = visibleIds.length > 0 && visibleIds.every(id => selected.has(id))
  const selectedCount = selected.size

  return (
    <div className="cl-scope space-y-3 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>{subtitle}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div className="cl-stat"><div className="cl-stat-num">{data?.total ?? 0}</div><div className="cl-stat-lbl">Total</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-ok)' }}>{data?.confirmed ?? 0}</div><div className="cl-stat-lbl">Confirmed</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-pending)' }}>{data?.pending ?? 0}</div><div className="cl-stat-lbl">Pending</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-accent)' }}>{data?.sent ?? 0}</div><div className="cl-stat-lbl">In Riyalto</div></div>
        <div className="cl-stat col-span-2 md:col-span-1">
          <div className="cl-stat-num" style={{ color: 'var(--cl-accent)' }}>{revenue.toLocaleString('fr-MA')}</div>
          <div className="cl-stat-lbl">Revenue DH</div>
        </div>
      </div>

      {/* Search */}
      <div className="cl-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, city, address..." />
      </div>

      {/* Filters + date range + controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`cl-filter ${filter === f.k ? 'cl-filter-active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="cl-date"
            title="From date"
          />
          <span style={{ color: 'var(--cl-subtle)' }}>→</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="cl-date"
            title="To date"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo('') }}
              className="cl-filter"
              style={{ padding: '4px 10px' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Toolbar row: select all + batch print + page size + auto-refresh */}
      <div className="flex flex-wrap items-center gap-2 py-1">
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none" style={{ color: 'var(--cl-muted)' }}>
          <input
            type="checkbox"
            checked={allSelectedVisible}
            onChange={() => toggleSelectAllVisible(visibleIds)}
            className="cl-check"
          />
          {allSelectedVisible ? 'Deselect all visible' : 'Select all visible'}
        </label>
        {selectedCount > 0 && (
          <button onClick={printSelected} className="cl-btn cl-btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>
            🖨 Imprimer ({selectedCount})
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <label className="text-xs flex items-center gap-1.5" style={{ color: 'var(--cl-muted)' }}>
            Rows:
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="cl-select">
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </label>
          <label className="text-xs flex items-center gap-1.5 cursor-pointer" style={{ color: 'var(--cl-muted)' }}>
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="cl-check" />
            Auto-refresh
          </label>
        </div>
      </div>

      <div className="text-xs" style={{ color: 'var(--cl-subtle)' }}>
        Showing {displayRows.length} of {filteredRows.length}
      </div>

      {/* List */}
      {displayRows.length === 0 && data ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          </div>
          <div className="cl-empty-t">No orders</div>
          <div className="cl-empty-s">Try changing filters or date range</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {displayRows.map(r => {
            const canSend = r.sara_status === 'confirmed' && r.riyalto_status !== 'sent'
            const isSelected = selected.has(r.id)
            const sentBadge =
              r.riyalto_status === 'sent' ? <span className="cl-badge cl-badge-accent">Riyalto · {r.riyalto_ref || 'sent'}</span> :
              r.riyalto_status === 'failed' ? <span className="cl-badge cl-badge-warn">Riyalto · Failed</span> :
              <span className="cl-badge cl-badge-neutral">Riyalto · Not sent</span>
            const saraBadge =
              r.sara_status === 'confirmed' ? <span className="cl-badge cl-badge-ok">Sara · Confirmed</span> :
              r.sara_status === 'cancelled' ? <span className="cl-badge cl-badge-warn">Sara · Cancelled</span> :
              <span className="cl-badge cl-badge-pending">Sara · Pending</span>
            return (
              <div key={r.id} className="cl-card" style={{ borderColor: isSelected ? 'var(--cl-accent)' : undefined }}>
                <div className="cl-card-body">
                  <label className="flex items-start pt-1 cursor-pointer">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelected(r.id)} className="cl-check" />
                  </label>
                  <div className="cl-avatar">{(r.name || '?')[0].toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-[15px] font-semibold tracking-tight truncate" style={{ color: 'var(--cl-text)' }}>{r.name || '—'}</div>
                      <div className="text-xs shrink-0" style={{ color: 'var(--cl-muted)' }}>{fmtTime(r.ts)}</div>
                    </div>
                    <div className="text-xs mt-0.5 flex flex-wrap items-center gap-x-2" style={{ color: 'var(--cl-muted)' }}>
                      <span>+{r.phone}</span>
                      {r.city && <><span>·</span><span className="font-medium" style={{ color: 'var(--cl-text)' }}>{r.city}</span></>}
                    </div>
                    {r.address && (
                      <div className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--cl-subtle)' }}>📍 {r.address}</div>
                    )}
                    <div className="text-[13px] mt-1.5 truncate" style={{ color: 'var(--cl-muted)' }}>{r.items}</div>
                    <div className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--cl-accent)', fontVariantNumeric: 'tabular-nums' }}>
                      {cleanNum(r.total)} DH <span className="text-xs font-normal" style={{ color: 'var(--cl-muted)' }}>· livraison {cleanNum(r.delivery)} DH</span>
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">{saraBadge}{sentBadge}</div>
                  </div>
                </div>
                <div className="cl-card-actions">
                  {r.riyalto_status === 'sent' && r.riyalto_id ? (
                    <>
                      <a className="cl-act cl-act-accent" href={`/api/admin/orders/pdf/${r.riyalto_id}?format=10x10`} target="_blank" rel="noopener noreferrer">View PDF</a>
                      <button className="cl-act cl-act-muted" onClick={() => deleteOrder(r.id)}>Delete</button>
                    </>
                  ) : (
                    <>
                      {r.sara_status === 'pending' && (
                        <button className="cl-act cl-act-ok" onClick={() => markConfirmed(r.id)}>Force confirm</button>
                      )}
                      <button className="cl-act cl-act-accent" disabled={!canSend} onClick={() => sendToRiyalto(r.id)}>Send to Riyalto</button>
                      <button className="cl-act cl-act-muted" onClick={() => deleteOrder(r.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toast && <div className="cl-toast cl-toast-show">{toast}</div>}
    </div>
  )
}
