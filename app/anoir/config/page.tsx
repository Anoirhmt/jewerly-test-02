'use client'
import { useState } from 'react'
import { Settings, Save, Eye, EyeOff } from 'lucide-react'

export default function ConfigPage() {
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to env or localStorage when API is ready
    if (typeof window !== 'undefined') {
      localStorage.setItem('riyalto_api_url', apiUrl)
      localStorage.setItem('riyalto_api_key', apiKey)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 font-sans max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 flex items-center gap-2">
          <Settings size={22} className="text-zinc-500" />
          Config API
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Configuration de l&apos;API Riyaltoexpress</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">URL de base de l&apos;API</label>
            <input
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="https://api.riyaltoexpress.com"
              className="admin-input"
            />
            <p className="text-xs text-zinc-400 mt-1">Disponible dans la documentation Riyaltoexpress</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Clé API</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Votre clé API..."
                className="admin-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Save size={15} />
            {saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">En attente de l&apos;API</p>
        <p className="text-xs text-amber-700">Une fois que vous recevez la documentation Riyaltoexpress, ajoutez l&apos;URL et la clé ici. Les appels API seront automatiquement activés.</p>
      </div>
    </div>
  )
}
