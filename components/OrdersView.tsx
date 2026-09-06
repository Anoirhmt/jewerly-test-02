'use client'
import { useEffect, useState, useCallback } from 'react'

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

function fmtTime(iso: string) {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
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
    const id = setInterval(fetchData, 5000)
    const onVis = () => { if (!document.hidden) fetchData() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [fetchData])

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
        if (d.pdf_url) window.open(`/api/admin/orders/pdf/${encodeURIComponent(d.pdf_url.split('/').pop())}`, '_blank')
        fetchData()
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
      r.items.toLowerCase().includes(qq)
    )
  }

  const filters: { k: Filter; label: string }[] = [
    { k: 'all', label: 'All' },
    { k: 'confirmed', label: 'Confirmed' },
    { k: 'pending', label: 'Pending' },
    { k: 'cancelled', label: 'Cancelled' },
    { k: 'not_sent_riy', label: 'Ready to ship' },
  ]

  return (
    <div className="cl-scope space-y-3 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>{subtitle}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="cl-stat"><div className="cl-stat-num">{data?.total ?? 0}</div><div className="cl-stat-lbl">Total</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-ok)' }}>{data?.confirmed ?? 0}</div><div className="cl-stat-lbl">Confirmed</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-pending)' }}>{data?.pending ?? 0}</div><div className="cl-stat-lbl">Pending</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-accent)' }}>{data?.sent ?? 0}</div><div className="cl-stat-lbl">In Riyalto</div></div>
      </div>

      <div className="cl-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, city..." />
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
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

      {rows.length === 0 && data ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          </div>
          <div className="cl-empty-t">No orders yet</div>
          <div className="cl-empty-s">Orders will appear here as they come in</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {rows.map(r => {
            const canSend = r.sara_status === 'confirmed' && r.riyalto_status !== 'sent'
            const sentBadge =
              r.riyalto_status === 'sent' ? <span className="cl-badge cl-badge-accent">Riyalto · {r.riyalto_ref || 'sent'}</span> :
              r.riyalto_status === 'failed' ? <span className="cl-badge cl-badge-warn">Riyalto · Failed</span> :
              <span className="cl-badge cl-badge-neutral">Riyalto · Not sent</span>
            const saraBadge =
              r.sara_status === 'confirmed' ? <span className="cl-badge cl-badge-ok">Sara · Confirmed</span> :
              r.sara_status === 'cancelled' ? <span className="cl-badge cl-badge-warn">Sara · Cancelled</span> :
              <span className="cl-badge cl-badge-pending">Sara · Pending</span>
            return (
              <div key={r.id} className="cl-card">
                <div className="cl-card-body">
                  <div className="cl-avatar">{(r.name || '?')[0].toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-[15px] font-semibold tracking-tight truncate" style={{ color: 'var(--cl-text)' }}>{r.name || '—'}</div>
                      <div className="text-xs shrink-0" style={{ color: 'var(--cl-muted)' }}>{fmtTime(r.ts)}</div>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>+{r.phone} · {r.city || '—'}</div>
                    <div className="text-[13px] mt-1.5 truncate" style={{ color: 'var(--cl-muted)' }}>{r.items}{r.address ? ' · ' + r.address : ''}</div>
                    <div className="text-[15px] font-semibold mt-1.5" style={{ color: 'var(--cl-accent)', fontVariantNumeric: 'tabular-nums' }}>
                      {cleanNum(r.total)} DH <span className="text-xs font-normal" style={{ color: 'var(--cl-muted)' }}>· livraison {cleanNum(r.delivery)} DH</span>
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">{saraBadge}{sentBadge}</div>
                  </div>
                </div>
                <div className="cl-card-actions">
                  {r.riyalto_status === 'sent' && r.riyalto_id ? (
                    <>
                      <a className="cl-act cl-act-accent" href={`/api/admin/orders/pdf/${r.riyalto_id}`} target="_blank" rel="noopener noreferrer">View PDF</a>
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
