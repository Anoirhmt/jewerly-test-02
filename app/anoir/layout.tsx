'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, RotateCcw, Warehouse, ScanLine,
  History, Settings, RefreshCw, LogOut, Menu, Wifi, WifiOff,
} from 'lucide-react'
import { getOrders, getReturns } from '@/lib/riyalto-api'

interface NavCounts {
  tousLesColis: number
  retoursRecus: number
  retoursWH: number
  nonScannes: number
}

const navMain = [
  { href: '/anoir/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/anoir/tous-les-colis', label: 'Tous les colis', icon: Package, countKey: 'tousLesColis' as keyof NavCounts },
  { href: '/anoir/retours-recus', label: 'Retours reçus', icon: RotateCcw, countKey: 'retoursRecus' as keyof NavCounts, badgeColor: 'bg-green-500' },
  { href: '/anoir/retours-wh', label: 'Retours WH', icon: Warehouse, countKey: 'retoursWH' as keyof NavCounts, badgeColor: 'bg-orange-500' },
  { href: '/anoir/non-scannes', label: 'Non scannés', icon: ScanLine, countKey: 'nonScannes' as keyof NavCounts, badgeColor: 'bg-red-500' },
  { href: '/anoir/historique', label: 'Historique', icon: History },
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
    Promise.all([getOrders(), getReturns()]).then(([orders, returns]) => {
      setCounts({
        tousLesColis: orders.length,
        retoursRecus: returns.filter(r => r.returnStatus === 'recu').length,
        retoursWH: returns.filter(r => r.returnStatus === 'en_transit_retour').length,
        nonScannes: returns.filter(r => r.returnStatus === 'en_attente').length,
      })
      setApiConnected(true)
    })
  }, [pathname])

  if (!checked) return null
  if (pathname === '/anoir') return <>{children}</> // login page — no sidebar

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/anoir')
  }

  const allNav = [...navMain, ...navOutils]
  const currentLabel = allNav.find(n => n.href === pathname)?.label || 'Admin'

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-60 bg-[#1a1a2e] text-white z-30 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <Package size={14} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">ELARAIN RETOUR</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">Operations</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 px-2 mb-2">Principal</p>
            <div className="space-y-0.5">
              {navMain.map(({ href, label, icon: Icon, countKey, badgeColor }) => {
                const isActive = pathname === href
                const count = countKey ? counts[countKey] : null
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} />
                      {label}
                    </span>
                    {count !== null && count > 0 && (
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full text-white min-w-[24px] text-center ${badgeColor || 'bg-zinc-600'}`}>
                        {count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 px-2 mb-2">Outils</p>
            <div className="space-y-0.5">
              {navOutils.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    pathname === href ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
          <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/40">
            {apiConnected
              ? <><Wifi size={13} className="text-green-400" /><span>Riyalto API — Connecté</span></>
              : <><WifiOff size={13} className="text-red-400" /><span>API non configurée</span></>
            }
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-60 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800">
            <Menu size={20} />
          </button>
          <span className="text-sm text-gray-500">{currentLabel}</span>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
