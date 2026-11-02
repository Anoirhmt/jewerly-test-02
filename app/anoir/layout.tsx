'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, RotateCcw, ScanLine, ChevronDown, Globe, Inbox, Sparkles, Plus,
  History, Settings, RefreshCw, LogOut, Menu, Wifi, WifiOff, Camera, PackageCheck,
  MessageCircle, ShoppingBag, Bot, CalendarDays, Tag,
} from 'lucide-react'
import { getRetourOrders } from '@/lib/retours-api'

interface NavCounts {
  tousLesColis: number
  retoursRecus: number
  retoursWH: number
  nonScannes: number
  toSendWebsite: number
  toSendSara: number
  toSendManual: number
}

type NavLeaf = { href: string; label: string; icon: any; countKey?: keyof NavCounts; badgeColor?: string }
type NavBranch = { id: string; label: string; icon: any; children: NavLeaf[]; countKeys: (keyof NavCounts)[]; badgeColor?: string }
type NavEntry = NavLeaf | NavBranch

const TO_SEND = 'bg-[#C15F3C]'

const navMain: NavEntry[] = [
  { href: '/anoir/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/anoir/tous-les-colis', label: 'Tous les colis', icon: Package },
  {
    id: 'commandes',
    label: 'Commandes',
    icon: ShoppingBag,
    countKeys: ['toSendManual', 'toSendWebsite', 'toSendSara'],
    badgeColor: TO_SEND,
    children: [
      { href: '/anoir/nouvelle-commande', label: 'Nouvelle commande', icon: Sparkles, countKey: 'toSendManual', badgeColor: TO_SEND },
      { href: '/anoir/orders', label: 'Site web', icon: Globe, countKey: 'toSendWebsite', badgeColor: TO_SEND },
      { href: '/anoir/sara-orders', label: 'Sara', icon: Bot, countKey: 'toSendSara', badgeColor: TO_SEND },
    ],
  },
  {
    id: 'retours',
    label: 'Retours',
    icon: RotateCcw,
    countKeys: ['nonScannes'],
    badgeColor: 'bg-red-500/80',
    children: [
      { href: '/anoir/retours', label: 'Tous les retours', icon: Inbox, countKey: 'tousLesColis' },
      { href: '/anoir/retours-recus', label: 'Retours reçus', icon: PackageCheck, countKey: 'retoursRecus', badgeColor: 'bg-emerald-500/80' },
      { href: '/anoir/non-scannes', label: 'Non reçus', icon: ScanLine, countKey: 'nonScannes', badgeColor: 'bg-red-500/80' },
    ],
  },
  { href: '/anoir/scan', label: 'Scanner', icon: Camera },
  { href: '/anoir/historique', label: 'Historique', icon: History },
]

const navAdmin: NavEntry[] = [
  { href: '/anoir/journal', label: 'Journal', icon: CalendarDays },
  { href: '/anoir/sara', label: 'Sara Chat', icon: MessageCircle },
  { href: '/anoir/packs', label: 'Packs & prix', icon: Tag },
]

const navOutils: NavEntry[] = [
  { href: '/anoir/config', label: 'Config API', icon: Settings },
  { href: '/anoir/sync', label: 'Cloud Sync', icon: RefreshCw },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [counts, setCounts] = useState<NavCounts>({ tousLesColis: 0, retoursRecus: 0, retoursWH: 0, nonScannes: 0, toSendWebsite: 0, toSendSara: 0, toSendManual: 0 })
  const [apiConnected, setApiConnected] = useState(false)

  useEffect(() => {
    setChecked(true)
  }, [])

  useEffect(() => {
    if (pathname === '/anoir') return
    getRetourOrders().then(({ orders }) => {
      setCounts(c => ({
        ...c,
        tousLesColis: orders.length,
        retoursRecus: orders.filter(o => o.received).length,
        retoursWH: 0,
        nonScannes: orders.filter(o => !o.received).length,
      }))
      setApiConnected(orders.length > 0)
    })
    // Confirmed orders still waiting to be sent to Riyalto
    fetch('/api/admin/orders/data?source=all', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then((d: { rows?: { source: string; sara_status: string; riyalto_status: string }[] } | null) => {
        if (!d?.rows) return
        const waiting = d.rows.filter(r => r.sara_status === 'confirmed' && r.riyalto_status !== 'sent')
        const of = (src: string) => waiting.filter(r => r.source === src).length
        setCounts(c => ({ ...c, toSendWebsite: of('website'), toSendSara: of('sara'), toSendManual: of('manual') }))
      })
      .catch(() => {})
  }, [pathname])

  if (!checked) return null
  if (pathname === '/anoir') return <>{children}</>

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/anoir')
  }

  const allNav = [...navMain, ...navAdmin, ...navOutils]
  const branch = allNav.find((n): n is NavBranch => 'children' in n && n.children.some(c => c.href === pathname))
  const leaf = branch
    ? branch.children.find(c => c.href === pathname)
    : allNav.find((n): n is NavLeaf => 'href' in n && n.href === pathname)

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
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl text-[15px] font-semibold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #E08668, #A84D2E)' }}>E</div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight leading-none" style={{ color: 'var(--elarain-sidebar-text)' }}>Elarain</p>
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
          <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--elarain-muted)' }}>
            {branch && <span className="opacity-60">{branch.label} /</span>}
            <span className="truncate">{leaf?.label || 'Admin'}</span>
          </span>
          {pathname !== '/anoir/nouvelle-commande' && (
            <Link href="/anoir/nouvelle-commande" className="el-quick-add ml-auto">
              <Plus size={15} /> <span className="hidden sm:inline">Nouvelle commande</span>
            </Link>
          )}
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

function Badge({ count, color }: { count: number; color?: string }) {
  if (count <= 0) return null
  return <span className={`el-nav-badge ${color || 'bg-white/15'}`}>{count}</span>
}

function NavLink({ item, pathname, counts, onNav }: { item: NavLeaf; pathname: string; counts: NavCounts; onNav: () => void }) {
  const { href, label, icon: Icon, countKey, badgeColor } = item
  return (
    <Link href={href} onClick={onNav} className={`el-nav-item ${pathname === href ? 'el-nav-active' : ''}`}>
      <span className="flex items-center gap-2.5">
        <Icon size={16} />
        {label}
      </span>
      {countKey && <Badge count={counts[countKey]} color={badgeColor} />}
    </Link>
  )
}

function NavDropdown({ item, pathname, counts, onNav }: { item: NavBranch; pathname: string; counts: NavCounts; onNav: () => void }) {
  const { id, label, icon: Icon, children, countKeys, badgeColor } = item
  const storeKey = `elarain-nav-${id}`
  const hasActive = children.some(c => c.href === pathname)
  const [open, setOpen] = useState(hasActive)

  useEffect(() => {
    try {
      if (localStorage.getItem(storeKey) === '1') setOpen(true)
    } catch {}
  }, [storeKey])

  useEffect(() => {
    if (hasActive) setOpen(true)
  }, [hasActive])

  function toggle() {
    const next = !open
    setOpen(next)
    try {
      localStorage.setItem(storeKey, next ? '1' : '0')
    } catch {}
  }

  const total = countKeys.reduce((s, k) => s + counts[k], 0)
  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`el-nav-item ${open ? 'el-nav-open' : ''} ${hasActive && !open ? 'el-nav-active' : ''}`}
      >
        <span className="flex items-center gap-2.5">
          <Icon size={16} />
          {label}
        </span>
        <span className="flex items-center gap-1.5">
          {!open && <Badge count={total} color={badgeColor} />}
          <ChevronDown size={15} className="el-nav-chevron" />
        </span>
      </button>
      <div className="el-nav-panel">
        <div>
          <div className="el-nav-tree space-y-0.5">
            {children.map(c => <NavLink key={c.href} item={c} pathname={pathname} counts={counts} onNav={onNav} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

function NavGroup({
  label, items, pathname, counts, onNav,
}: {
  label: string
  items: NavEntry[]
  pathname: string
  counts: NavCounts
  onNav: () => void
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest px-2 mb-2" style={{ color: 'var(--elarain-sidebar-muted)' }}>{label}</p>
      <div className="space-y-0.5">
        {items.map(item =>
          'children' in item
            ? <NavDropdown key={item.id} item={item} pathname={pathname} counts={counts} onNav={onNav} />
            : <NavLink key={item.href} item={item} pathname={pathname} counts={counts} onNav={onNav} />,
        )}
      </div>
    </div>
  )
}
