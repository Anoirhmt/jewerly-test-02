'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, RotateCcw, ScanLine,
  History, Settings, RefreshCw, LogOut, Menu, Wifi, WifiOff, Camera,
  MessageCircle, ShoppingBag, Bot, CalendarDays,
} from 'lucide-react'
import { getRetourOrders } from '@/lib/retours-api'

interface NavCounts {
  tousLesColis: number
  retoursRecus: number
  retoursWH: number
  nonScannes: number
}

const navMain = [
  { href: '/anoir/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/anoir/tous-les-colis', label: 'Tous les colis', icon: Package },
  { href: '/anoir/retours', label: 'Retours', icon: RotateCcw, countKey: 'tousLesColis' as keyof NavCounts },
  { href: '/anoir/retours-recus', label: 'Retours reçus', icon: RotateCcw, countKey: 'retoursRecus' as keyof NavCounts, badgeColor: 'bg-emerald-500/80' },
  { href: '/anoir/non-scannes', label: 'Non reçus', icon: ScanLine, countKey: 'nonScannes' as keyof NavCounts, badgeColor: 'bg-red-500/80' },
  { href: '/anoir/scan', label: 'Scanner', icon: Camera },
  { href: '/anoir/historique', label: 'Historique', icon: History },
]

const navAdmin = [
  { href: '/anoir/journal', label: 'Journal', icon: CalendarDays },
  { href: '/anoir/sara', label: 'Sara Chat', icon: MessageCircle },
  { href: '/anoir/orders', label: 'Website Orders', icon: ShoppingBag },
  { href: '/anoir/sara-orders', label: 'Sara Orders', icon: Bot },
]

const navOutils = [
  { href: '/anoir/config', label: 'Config API', icon: Settings },
  { href: '/anoir/sync', label: 'Cloud Sync', icon: RefreshCw },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [counts, setCounts] = useState<NavCounts>({ tousLesColis: 0, retoursRecus: 0, retoursWH: 0, nonScannes: 0 })
  const [apiConnected, setApiConnected] = useState(false)

  useEffect(() => {
    setChecked(true)
  }, [])

  useEffect(() => {
    if (pathname === '/anoir') return
    getRetourOrders().then(({ orders }) => {
      setCounts({
        tousLesColis: orders.length,
        retoursRecus: orders.filter(o => o.received).length,
        retoursWH: 0,
        nonScannes: orders.filter(o => !o.received).length,
      })
      setApiConnected(orders.length > 0)
    })
  }, [pathname])

  if (!checked) return null
  if (pathname === '/anoir') return <>{children}</>

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/anoir')
  }

  const allNav = [...navMain, ...navAdmin, ...navOutils]
  const currentLabel = allNav.find(n => n.href === pathname)?.label || 'Admin'

  return (
    <div className="min-h-screen flex font-sans" style={{ background: 'var(--elarain-bg)' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 z-30 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--elarain-sidebar)', color: 'var(--elarain-sidebar-text)' }}
      >
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--elarain-sidebar-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--cl-accent)' }} />
            <div>
              <p className="text-sm font-semibold tracking-tight leading-none" style={{ color: 'var(--elarain-sidebar-text)' }}>Elarain</p>
              <p className="text-[10px] mt-1 tracking-widest uppercase" style={{ color: 'var(--elarain-sidebar-muted)' }}>Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          <NavGroup label="Principal" items={navMain} pathname={pathname} counts={counts} onNav={() => setSidebarOpen(false)} />
          <NavGroup label="Admin" items={navAdmin} pathname={pathname} counts={counts} onNav={() => setSidebarOpen(false)} />
          <NavGroup label="Outils" items={navOutils} pathname={pathname} counts={counts} onNav={() => setSidebarOpen(false)} />
        </nav>

        <div className="px-3 pb-4 pt-3 space-y-1" style={{ borderTop: '1px solid var(--elarain-sidebar-border)' }}>
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs" style={{ color: 'var(--elarain-sidebar-muted)' }}>
            {apiConnected
              ? <><Wifi size={13} className="text-emerald-400" /><span>Riyalto — Connecté</span></>
              : <><WifiOff size={13} className="text-red-400" /><span>API non configurée</span></>
            }
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm transition-colors hover:bg-white/5"
            style={{ color: 'var(--elarain-sidebar-muted)' }}
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-60 min-w-0">
        <header
          className="px-4 lg:px-8 py-4 flex items-center gap-4 sticky top-0 z-10 backdrop-blur"
          style={{ background: 'var(--elarain-header-bg)', borderBottom: '1px solid var(--elarain-border)' }}
        >
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ color: 'var(--elarain-muted)' }}>
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium" style={{ color: 'var(--elarain-muted)' }}>{currentLabel}</span>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      <style jsx global>{`
        :root {
          --elarain-bg: #F5F4EE;
          --elarain-sidebar: #1C1B18;
          --elarain-sidebar-text: #EDEBE4;
          --elarain-sidebar-muted: rgba(237, 235, 228, 0.55);
          --elarain-sidebar-border: rgba(237, 235, 228, 0.08);
          --elarain-header-bg: rgba(245, 244, 238, 0.85);
          --elarain-border: #E8E6DE;
          --elarain-muted: #6B6B66;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --elarain-bg: #1C1B18;
            --elarain-sidebar: #16150F;
            --elarain-sidebar-text: #EDEBE4;
            --elarain-sidebar-muted: rgba(237, 235, 228, 0.5);
            --elarain-sidebar-border: rgba(237, 235, 228, 0.06);
            --elarain-header-bg: rgba(28, 27, 24, 0.85);
            --elarain-border: #38362E;
            --elarain-muted: #9A968C;
          }
        }
      `}</style>
    </div>
  )
}

function NavGroup({
  label, items, pathname, counts, onNav,
}: {
  label: string
  items: Array<{ href: string; label: string; icon: any; countKey?: keyof NavCounts; badgeColor?: string }>
  pathname: string
  counts: NavCounts
  onNav: () => void
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest px-2 mb-2" style={{ color: 'var(--elarain-sidebar-muted)' }}>{label}</p>
      <div className="space-y-0.5">
        {items.map(({ href, label, icon: Icon, countKey, badgeColor }) => {
          const isActive = pathname === href
          const count = countKey ? counts[countKey] : null
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: isActive ? 'rgba(237, 235, 228, 0.1)' : 'transparent',
                color: isActive ? 'var(--elarain-sidebar-text)' : 'var(--elarain-sidebar-muted)',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(237, 235, 228, 0.04)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={16} />
                {label}
              </span>
              {count !== null && count > 0 && (
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full text-white min-w-[24px] text-center ${badgeColor || 'bg-white/15'}`}>
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
