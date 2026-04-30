'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, X, CheckCircle, Package } from 'lucide-react'
import { getOrders, createShipment } from '@/lib/riyalto-api'
import type { Order, CreateShipmentData, OrderStatus, OrderSource } from '@/types/admin'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  picked_up: { label: 'Ramassé', color: 'bg-blue-100 text-blue-800' },
  in_transit: { label: 'En transit', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livré', color: 'bg-green-100 text-green-800' },
  returned: { label: 'Retourné', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800' },
}

const sourceStyles: Record<string, { bg: string; label: string }> = {
  website: { bg: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Website' },
  whatsapp: { bg: 'bg-green-50 text-green-700 border border-green-200', label: 'WhatsApp' },
  tiktok: { bg: 'bg-pink-50 text-pink-700 border border-pink-200', label: 'TikTok' },
}

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Meknès', 'Agadir',
  'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida', 'Beni Mellal', 'Laâyoune', 'Autre',
]

const emptyForm: CreateShipmentData = {
  customerName: '',
  customerPhone: '',
  address: '',
  city: '',
  items: '',
  total: 0,
  source: 'whatsapp',
  notes: '',
}

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'in_transit', label: 'En transit' },
  { key: 'delivered', label: 'Livré' },
  { key: 'returned', label: 'Retourné' },
]

function SkeletonRow() {
  return (
    <tr>
      {[90, 120, 100, 80, 60, 70, 70, 60].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${w}px` }} />
          {i === 1 && <div className="h-3 bg-gray-100 rounded animate-pulse mt-1.5" style={{ width: '70px' }} />}
        </td>
      ))}
    </tr>
  )
}

export default function TousLesColisPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<CreateShipmentData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    setOrders(await getOrders())
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await createShipment(form)
    await loadOrders()
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setShowModal(false)
      setForm(emptyForm)
    }, 1500)
  }

  const closeModal = () => { setShowModal(false); setForm(emptyForm); setSuccess(false) }

  const getTabCount = (key: string) => {
    if (key === 'all') return orders.length
    if (key === 'in_transit') return orders.filter(o => o.status === 'in_transit' || o.status === 'picked_up').length
    return orders.filter(o => o.status === key).length
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      o.customerName.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.city.toLowerCase().includes(q)
    let matchTab = false
    if (activeTab === 'all') matchTab = true
    else if (activeTab === 'in_transit') matchTab = o.status === 'in_transit' || o.status === 'picked_up'
    else matchTab = o.status === activeTab
    return matchSearch && matchTab
  })

  return (
    <div className="space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Tous les colis</h1>
          <p className="text-sm text-zinc-400 mt-0.5">{orders.length} colis au total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Nouvelle commande
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => {
          const count = getTabCount(tab.key)
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-zinc-900 text-zinc-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone, tracking, ville..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3">Tracking</th>
                <th className="text-left px-5 py-3">Client</th>
                <th className="text-left px-5 py-3">Articles</th>
                <th className="text-left px-5 py-3">Ville</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Source</th>
                <th className="text-left px-5 py-3">Statut</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                      <Package size={36} className="mb-3 text-gray-300" />
                      <p className="font-medium text-zinc-500">Aucune commande trouvée</p>
                      <p className="text-xs mt-1">Essayez de modifier vos filtres</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">{order.trackingNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900 text-sm">{order.customerName}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{order.customerPhone}</div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs max-w-[160px]">
                      <span className="truncate block" title={order.items}>{order.items}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 text-sm">{order.city}</td>
                    <td className="px-5 py-4 font-bold text-zinc-900 text-sm">{order.total} MAD</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceStyles[order.source]?.bg || 'bg-gray-100 text-gray-700'}`}>
                        {sourceStyles[order.source]?.label || order.source}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-zinc-900">Nouvelle commande</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Remplissez les informations ci-dessous</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-14 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <p className="font-bold text-zinc-900 text-lg">Commande créée !</p>
                <p className="text-sm text-zinc-500 mt-1">La commande a été ajoutée avec succès</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom du client" required>
                    <input
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      className="admin-input"
                      placeholder="Ex: Fatima Zahra"
                      required
                    />
                  </Field>
                  <Field label="Téléphone" required>
                    <input
                      value={form.customerPhone}
                      onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                      className="admin-input"
                      placeholder="06XXXXXXXX"
                      required
                    />
                  </Field>
                </div>

                <Field label="Adresse complète" required>
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="admin-input"
                    placeholder="Ex: 12 Rue Hassan II"
                    required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Ville" required>
                    <select
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="admin-input"
                      required
                    >
                      <option value="">Choisir une ville...</option>
                      {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Source" required>
                    <select
                      value={form.source}
                      onChange={e => setForm(f => ({ ...f, source: e.target.value as OrderSource }))}
                      className="admin-input"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="tiktok">TikTok</option>
                      <option value="website">Site web</option>
                    </select>
                  </Field>
                </div>

                <Field label="Articles" required>
                  <input
                    value={form.items}
                    onChange={e => setForm(f => ({ ...f, items: e.target.value }))}
                    placeholder="Ex: Bracelet or x1, Collier x2"
                    className="admin-input"
                    required
                  />
                </Field>

                <Field label="Total (MAD)" required>
                  <input
                    type="number"
                    value={form.total || ''}
                    onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))}
                    className="admin-input"
                    placeholder="Ex: 350"
                    min="0"
                    required
                  />
                </Field>

                <Field label="Notes (optionnel)">
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="admin-input resize-none"
                    placeholder="Instructions spéciales, remarques..."
                    rows={2}
                  />
                </Field>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Création...' : 'Créer la commande'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
