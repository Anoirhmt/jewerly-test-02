'use client'
import { useEffect, useState, useCallback } from 'react'

type Row = {
  sender: string
  phone: string
  display: string
  last_time: string
  last_msg: string
  paused: boolean
  count: number
}

type Data = {
  rows: Row[]
  bot_enabled: boolean
  confirmations_enabled: boolean
  site_editor_enabled: boolean
  total: number
  active: number
  paused: number
}

export default function SaraPage() {
  const [data, setData] = useState<Data | null>(null)
  const [q, setQ] = useState('')
  const [live, setLive] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/data', { cache: 'no-store' })
      if (!r.ok) throw new Error()
      setData(await r.json())
      setLive(true)
    } catch {
      setLive(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5000)
    const onVis = () => { if (!document.hidden) fetchData() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [fetchData])

  const toggleBot = async () => {
    await fetch('/api/admin/toggle', { method: 'POST' })
    fetchData()
  }
  const toggleConf = async () => {
    await fetch('/api/admin/toggle-confirmations', { method: 'POST' })
    fetchData()
  }
  const toggleEditor = async () => {
    await fetch('/api/admin/toggle-site-editor', { method: 'POST' })
    fetchData()
  }
  const act = async (kind: 'pause' | 'resume', sender: string) => {
    await fetch(`/api/admin/${kind}/${encodeURIComponent(sender)}`, { method: 'POST' })
    fetchData()
  }

  const rows = (data?.rows ?? []).filter(r =>
    !q ||
    r.display.toLowerCase().includes(q.toLowerCase()) ||
    (r.last_msg || '').toLowerCase().includes(q.toLowerCase()) ||
    (r.phone || '').includes(q)
  )

  return (
    <div className="cl-scope space-y-3 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--cl-text)' }}>Sara</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>WhatsApp bot · Elarain Jewelry</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--cl-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: live ? 'var(--cl-ok)' : 'var(--cl-warn)', animation: live ? 'pulse 1.8s ease-in-out infinite' : undefined }} />
          {live ? 'Live' : 'Offline'}
        </div>
      </div>

      <div className="grid gap-2">
        <div className="cl-panel">
          <div>
            <div className="cl-panel-lbl">Sara Chat Replies</div>
            <div className="cl-panel-status" style={{ color: data?.bot_enabled ? 'var(--cl-ok)' : 'var(--cl-warn)' }}>
              {data ? (data.bot_enabled ? 'Active' : 'Paused') : '—'}
            </div>
          </div>
          <button onClick={toggleBot} className={`cl-btn ${data?.bot_enabled ? 'cl-btn-danger' : 'cl-btn-primary'}`}>
            {data?.bot_enabled ? 'Turn off' : 'Turn on'}
          </button>
        </div>
        <div className="cl-panel">
          <div>
            <div className="cl-panel-lbl">Order Confirmations</div>
            <div className="cl-panel-status" style={{ color: data?.confirmations_enabled ? 'var(--cl-ok)' : 'var(--cl-warn)' }}>
              {data ? (data.confirmations_enabled ? 'Active' : 'Paused') : '—'}
            </div>
          </div>
          <button onClick={toggleConf} className={`cl-btn ${data?.confirmations_enabled ? 'cl-btn-danger' : 'cl-btn-primary'}`}>
            {data?.confirmations_enabled ? 'Turn off' : 'Turn on'}
          </button>
        </div>
        <div className="cl-panel">
          <div>
            <div className="cl-panel-lbl">Site Editor · WhatsApp commands</div>
            <div className="cl-panel-status" style={{ color: data?.site_editor_enabled ? 'var(--cl-ok)' : 'var(--cl-warn)' }}>
              {data ? (data.site_editor_enabled ? 'Active' : 'Paused') : '—'}
            </div>
          </div>
          <button onClick={toggleEditor} className={`cl-btn ${data?.site_editor_enabled ? 'cl-btn-danger' : 'cl-btn-primary'}`}>
            {data?.site_editor_enabled ? 'Turn off' : 'Turn on'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="cl-stat"><div className="cl-stat-num">{data?.total ?? 0}</div><div className="cl-stat-lbl">Total</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-ok)' }}>{data?.active ?? 0}</div><div className="cl-stat-lbl">Auto</div></div>
        <div className="cl-stat"><div className="cl-stat-num" style={{ color: 'var(--cl-warn)' }}>{data?.paused ?? 0}</div><div className="cl-stat-lbl">Manual</div></div>
      </div>

      <div className="cl-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search conversations..." />
      </div>

      <div className="cl-section">Conversations</div>

      {rows.length === 0 && data ? (
        <div className="cl-empty">
          <div className="cl-empty-icon">
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div className="cl-empty-t">No conversations yet</div>
          <div className="cl-empty-s">Waiting for customers to message you</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {rows.map(r => (
            <div key={r.sender} className="cl-card">
              <div className="cl-card-body">
                <div className={`cl-avatar ${r.paused ? 'cl-avatar-warn' : ''}`}>{(r.display || '?')[0].toUpperCase()}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold tracking-tight truncate" style={{ color: 'var(--cl-text)' }}>{r.display}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--cl-muted)' }}>{r.last_time} · {r.count} messages</div>
                  <div className="text-[13px] mt-1.5 truncate" style={{ color: 'var(--cl-muted)' }}>{r.last_msg || '(photo)'}</div>
                  <div className="mt-2.5">
                    <span className={`cl-badge ${r.paused ? 'cl-badge-warn' : 'cl-badge-ok'}`}>
                      {r.paused ? 'You handle it' : 'Auto reply'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl-card-actions">
                {r.paused ? (
                  <button className="cl-act cl-act-ok" onClick={() => act('resume', r.sender)}>Resume Sara</button>
                ) : (
                  <button className="cl-act cl-act-warn" onClick={() => act('pause', r.sender)}>Take over</button>
                )}
                <a className="cl-act cl-act-accent" href={`https://wa.me/${r.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
      `}</style>
    </div>
  )
}
