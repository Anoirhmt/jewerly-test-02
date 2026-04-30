'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, X, CheckCircle } from 'lucide-react'
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

const sourceStyles: Record<string, string> = {
  website: 'bg-blue-50 text-blue-700',
  whatsapp: 'bg-green-50 text-green-700',
  tiktok: 'bg-pink-50 text-pink-700',
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

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
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

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      o.customerName.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Commandes</h1>
          <p className="text-sm text-zinc-500 mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} />
          Nouvelle commande
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, tracking..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusConfig).map(([v, { label }]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-zinc-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3">Tracking</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-left px-6 py-3">Articles</th>
                  <th className="text-left px-6 py-3">Ville</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Source</th>
                  <th className="text-left px-6 py-3">Statut</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600">{order.trackingNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{order.customerName}</div>
                      <div className="text-zinc-400 text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 max-w-[180px] truncate" title={order.items}>{order.items}</td>
                    <td className="px-6 py-4 text-zinc-600">{order.city}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{order.total} MAD</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${sourceStyles[order.source] || 'bg-gray-100 text-gray-700'}`}>
                        {order.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-400">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-zinc-900">Nouvelle commande</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-14 text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-medium text-green-700">Commande créée avec succès !</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom du client" required>
                    <input
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      className="admin-input"
                      required
                    />
                  </Field>
                  <Field label="Téléphone" required>
                    <input
                      value={form.customerPhone}
                      onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                      className="admin-input"
                      required
                    />
                  </Field>
                </div>

                <Field label="Adresse" required>
                  <input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="admin-input"
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
                      <option value="">Choisir...</option>
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
                    placeholder="ex: Bracelet or x1, Collier x2"
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
                    min="0"
                    required
                  />
                </Field>

                <Field label="Notes (optionnel)">
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="admin-input resize-none"
                    rows={2}
                  />
                </Field>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors"
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
