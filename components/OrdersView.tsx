'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Eye, Printer, Trash2, RefreshCw, ExternalLink, Check, X } from 'lucide-react'

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

function cleanNum(v: string) {
  return String(v || '').replace(/\s*DH\s*$/i, '').trim()
}
function parseNum(v: string) {
  const n = parseFloat(cleanNum(v).replace(',', '.'))
  return isNaN(n) ? 0 : n
}
function fmtDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_sent' | 'sent' | 'confirmed' | 'pending' | 'cancelled'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [labelSize, setLabelSize] = useState<'10x10' | 'a4'>('10x10')
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

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600) }

  const sendToRiyalto = async (id: string) => {
    showToast('Sending...')
    try {
      const r = await fetch(`/api/admin/orders/send/${encodeURIComponent(id)}`, { method: 'POST' })
      const d = await r.json()
      if (r.ok) {
        showToast(`Sent · BL ${d.riyalto_ref || ''}`)
        fetchData()
        setTimeout(async () => {
          const fresh = await fetch(`/api/admin/orders/data?source=${source}`, { cache: 'no-store' }).then(r => r.json())
          const row = fresh.rows.find((r: OrderRow) => r.id === id)
          if (row?.riyalto_id) window.open(`/api/admin/orders/pdf/${row.riyalto_id}?format=${labelSize}`, '_blank')
        }, 500)
      } else showToast('Failed · ' + (d.message || d.error || ''))
    } catch (e) { showToast('Error: ' + e) }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order from the log?')) return
    await fetch(`/api/admin/orders/delete/${encodeURIComponent(id)}`, { method: 'POST' })
    showToast('Deleted'); fetchData()
  }

  const markConfirmed = async (id: string) => {
    if (!confirm('Mark this order as confirmed without customer reply?')) return
    await fetch(`/api/admin/orders/mark-confirmed/${encodeURIComponent(id)}`, { method: 'POST' })
    showToast('Marked confirmed'); fetchData()
  }

  const toggleSelected = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleSelectAllVisible = (ids: string[]) => {
    setSelected(prev => {
      const all = ids.every(id => prev.has(id))
      const n = new Set(prev)
      if (all) ids.forEach(id => n.delete(id))
      else ids.forEach(id => n.add(id))
      return n
    })
  }
  const clearSelection = () => setSelected(new Set())

  const printSelected = async () => {
    if (!data) return
    const chosen = data.rows.filter(r => selected.has(r.id))
    const printable = chosen.filter(r =>
      r.sara_status === 'confirmed' &&
      (r.riyalto_status === 'sent' || r.riyalto_status !== 'sent') // includes not_sent confirmed
    )
    const skipped = chosen.length - printable.length

    if (printable.length === 0) {
      showToast('Aucune commande imprimable — confirmez-les d\'abord')
      return
    }

    showToast(`Préparation de ${printable.length} étiquette${printable.length > 1 ? 's' : ''}...`)
    // OPEN A BLANK TAB SYNCHRONOUSLY (avoids popup blocker)
    const newTab = window.open('', '_blank')
    if (!newTab) {
      showToast('Popup bloqué — autorisez les popups pour ce site')
      return
    }
    newTab.document.write('<title>Impression en cours...</title><style>body{font-family:system-ui;padding:40px;text-align:center;color:#666}</style><p>Génération du PDF combiné...</p>')

    try {
      const res = await fetch('/api/admin/orders/batch-print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: printable.map(r => r.id), format: labelSize }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({ error: 'failed' }))
        newTab.document.body.innerHTML = `<p style="color:#c15f3c">Erreur : ${j.error || 'failed'}</p>`
        showToast('Erreur pendant l\'impression')
        return
      }
      const count = res.headers.get('X-Order-Count') || printable.length.toString()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      newTab.location.href = url
      showToast(`${count} étiquette${Number(count) > 1 ? 's' : ''} prête${Number(count) > 1 ? 's' : ''}${skipped > 0 ? ` (${skipped} ignorée${skipped > 1 ? 's' : ''})` : ''}`)
      fetchData()
    } catch (e) {
      newTab.document.body.innerHTML = `<p style="color:#c15f3c">Erreur : ${e}</p>`
      showToast('Erreur : ' + e)
    }
  }

  const filteredRows = useMemo(() => {
    let rows = data?.rows ?? []
    if (statusFilter === 'not_sent') rows = rows.filter(r => r.riyalto_status === 'not_sent' && r.sara_status === 'confirmed')
    else if (statusFilter === 'sent') rows = rows.filter(r => r.riyalto_status === 'sent')
    else if (statusFilter === 'confirmed') rows = rows.filter(r => r.sara_status === 'confirmed')
    else if (statusFilter === 'pending') rows = rows.filter(r => r.sara_status === 'pending')
    else if (statusFilter === 'cancelled') rows = rows.filter(r => r.sara_status === 'cancelled')
    if (q) {
      const qq = q.toLowerCase()
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(qq) || r.phone.includes(q) ||
        r.city.toLowerCase().includes(qq) || r.address.toLowerCase().includes(qq) ||
        r.items.toLowerCase().includes(qq) || (r.riyalto_ref || '').toLowerCase().includes(qq)
      )
    }
    if (dateFrom) rows = rows.filter(r => isoDayLE(r.ts) >= dateFrom)
    if (dateTo) rows = rows.filter(r => isoDayLE(r.ts) <= dateTo)
    return rows
  }, [data, statusFilter, q, dateFrom, dateTo])

  const displayRows = filteredRows.slice(0, pageSize)
  const totalValue = useMemo(
    () => filteredRows.filter(r => r.sara_status !== 'cancelled').reduce((s, r) => s + parseNum(r.total), 0),
    [filteredRows]
  )
  const expediees = useMemo(
    () => (data?.rows ?? []).filter(r => r.riyalto_status === 'sent').length,
    [data]
  )

  const visibleIds = displayRows.map(r => r.id)
  const allSelectedVisible = visibleIds.length > 0 && visibleIds.every(id => selected.has(id))
  const selectedCount = selected.size

  return (
    <div className="cl-scope space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>{title}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>{subtitle}</p>
      </div>

      {/* Two centered stat cards */}
      <div className="flex justify-center gap-4 py-2">
        <div className="cl-stat-lg">
          <div className="cl-stat-lg-lbl">
            <span className="w-1.5 h-1.5 rounded-full inline-block mr-2" style={{ background: 'var(--cl-accent)' }} />
            EXPÉDIÉES
          </div>
          <div className="cl-stat-lg-num">{expediees}</div>
        </div>
        <div className="cl-stat-lg">
          <div className="cl-stat-lg-lbl">
            <span className="w-1.5 h-1.5 rounded-full inline-block mr-2" style={{ background: 'var(--cl-accent)' }} />
            VALEUR PAGE
          </div>
          <div className="cl-stat-lg-num">
            {totalValue.toLocaleString('fr-MA')} <span className="text-base" style={{ color: 'var(--cl-muted)' }}>MAD</span>
          </div>
        </div>
      </div>

      {/* Toolbar row 1 — search + filters + refresh */}
      <div className="cl-toolbar">
        <div className="cl-search flex-1 min-w-[200px]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher nom, téléphone, ville, adresse..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="cl-select-lg">
          <option value="all">Tous les statuts</option>
          <option value="not_sent">Non imprimées</option>
          <option value="sent">Imprimées (envoyées)</option>
          <option value="confirmed">Confirmées</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulées</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="cl-date-lg" />
        <span style={{ color: 'var(--cl-subtle)' }}>→</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="cl-date-lg" />
        <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="cl-select-lg">
          <option value={20}>20 lignes</option>
          <option value={50}>50 lignes</option>
          <option value={100}>100 lignes</option>
          <option value={500}>500 lignes</option>
        </select>
        <button onClick={fetchData} className="cl-btn-blue">
          <RefreshCw size={14} /> Actualiser
        </button>
        <button
          onClick={() => { setQ(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); clearSelection() }}
          className="cl-btn-ghost"
        >
          Reset
        </button>
      </div>

      {/* Toolbar row 2 — label size + select all + print */}
      <div className="cl-toolbar">
        <div className="flex items-center gap-4">
          <label className="cl-radio">
            <input type="radio" name="fmt" checked={labelSize === 'a4'} onChange={() => setLabelSize('a4')} />
            <span>A4</span>
          </label>
          <label className="cl-radio">
            <input type="radio" name="fmt" checked={labelSize === '10x10'} onChange={() => setLabelSize('10x10')} />
            <span>10×10</span>
          </label>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={selectedCount === 0 ? () => toggleSelectAllVisible(visibleIds) : clearSelection}
            className="cl-btn-ghost"
          >
            {selectedCount === 0 ? 'Tout sélectionner' : 'Tout désélectionner'}
          </button>
          <button
            onClick={printSelected}
            disabled={selectedCount === 0}
            className="cl-btn-blue"
          >
            <Printer size={14} /> Imprimer ({selectedCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="cl-table-wrap">
        <table className="cl-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={allSelectedVisible} onChange={() => toggleSelectAllVisible(visibleIds)} className="cl-check" />
              </th>
              <th>NOM</th>
              <th>ADRESSE</th>
              <th>VILLE</th>
              <th>N° DE SUIVI</th>
              <th className="text-right">PRIX</th>
              <th>STATUT</th>
              <th>DATE</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 && data ? (
              <tr><td colSpan={9} className="cl-table-empty">Aucune commande</td></tr>
            ) : displayRows.map(r => {
              const canSend = r.sara_status === 'confirmed' && r.riyalto_status !== 'sent'
              const isSelected = selected.has(r.id)
              const statutText = r.riyalto_status === 'sent' ? 'Expédiée'
                : r.sara_status === 'confirmed' ? 'Confirmée'
                : r.sara_status === 'cancelled' ? 'Annulée' : 'En attente'
              const statutClass = r.riyalto_status === 'sent' ? 'cl-pill-accent'
                : r.sara_status === 'confirmed' ? 'cl-pill-ok'
                : r.sara_status === 'cancelled' ? 'cl-pill-warn' : 'cl-pill-pending'
              return (
                <tr key={r.id} className={isSelected ? 'cl-tr-selected' : ''}>
                  <td>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelected(r.id)} className="cl-check" />
                  </td>
                  <td>
                    <div className="font-semibold text-[14px]" style={{ color: 'var(--cl-text)' }}>{r.name || '—'}</div>
                    <div className="text-[12px]" style={{ color: 'var(--cl-muted)' }}>+{r.phone}</div>
                  </td>
                  <td className="max-w-[240px]">
                    <div className="text-[13px] truncate" style={{ color: 'var(--cl-muted)' }} title={r.address}>{r.address || '—'}</div>
                    <div className="text-[12px] truncate" style={{ color: 'var(--cl-subtle)' }} title={r.items}>{r.items}</div>
                  </td>
                  <td className="font-medium" style={{ color: 'var(--cl-text)' }}>{r.city || '—'}</td>
                  <td>
                    {r.riyalto_ref ? (
                      <button
                        onClick={() => { navigator.clipboard?.writeText(r.riyalto_ref); showToast('Copié · ' + r.riyalto_ref) }}
                        className="cl-track"
                        title="Cliquer pour copier"
                      >
                        {r.riyalto_ref} <ExternalLink size={11} />
                      </button>
                    ) : <span style={{ color: 'var(--cl-subtle)' }}>—</span>}
                  </td>
                  <td className="text-right font-semibold" style={{ color: 'var(--cl-text)', fontVariantNumeric: 'tabular-nums' }}>
                    {cleanNum(r.total)} <span className="text-[11px]" style={{ color: 'var(--cl-muted)' }}>DH</span>
                  </td>
                  <td>
                    <span className={`cl-pill ${statutClass}`}>{statutText}</span>
                  </td>
                  <td className="text-[12px]" style={{ color: 'var(--cl-muted)' }}>{fmtDate(r.ts)}</td>
                  <td>
                    <div className="flex items-center gap-1 justify-end">
                      {r.sara_status === 'pending' && (
                        <button onClick={() => markConfirmed(r.id)} className="cl-icon-btn" title="Forcer confirmé" style={{ color: 'var(--cl-ok)' }}>
                          <Check size={15} />
                        </button>
                      )}
                      {r.riyalto_status === 'sent' && r.riyalto_id ? (
                        <a
                          href={`/api/admin/orders/pdf/${r.riyalto_id}?format=${labelSize}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cl-icon-btn"
                          title="Voir PDF"
                          style={{ color: 'var(--cl-accent)' }}
                        >
                          <Printer size={15} />
                        </a>
                      ) : (
                        <button
                          onClick={() => sendToRiyalto(r.id)}
                          disabled={!canSend}
                          className="cl-icon-btn"
                          title="Envoyer à Riyalto"
                          style={{ color: canSend ? 'var(--cl-accent)' : 'var(--cl-subtle)' }}
                        >
                          <Printer size={15} />
                        </button>
                      )}
                      <button onClick={() => deleteOrder(r.id)} className="cl-icon-btn" title="Supprimer" style={{ color: 'var(--cl-muted)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--cl-subtle)' }}>
        <span>Affichage {displayRows.length} sur {filteredRows.length}</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="cl-check" />
          Auto-refresh
        </label>
      </div>

      {toast && <div className="cl-toast cl-toast-show">{toast}</div>}
    </div>
  )
}
