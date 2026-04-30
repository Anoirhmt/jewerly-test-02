'use client'
import { RefreshCw } from 'lucide-react'

export default function SyncPage() {
  return (
    <div className="space-y-6 font-sans max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 flex items-center gap-2">
          <RefreshCw size={22} className="text-zinc-500" />
          Cloud Sync
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Synchronisation avec Riyaltoexpress</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <RefreshCw size={36} className="text-zinc-300 mx-auto mb-3" />
        <p className="font-medium text-zinc-600">Disponible après configuration de l&apos;API</p>
        <p className="text-sm text-zinc-400 mt-1">Configurez d&apos;abord votre clé API dans Config API</p>
      </div>
    </div>
  )
}
