'use client'
import { useEffect, useRef, useState } from 'react'
import { getRetourOrders, receiveOrder } from '@/lib/retours-api'
import type { RiyaltoOrder } from '@/lib/retours-api'
import { ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'

type ScanResult =
  | { ok: true; order: RiyaltoOrder }
  | { ok: false; code: string }

export default function ScanPage() {
  const [orders, setOrders] = useState<RiyaltoOrder[]>([])
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [libReady, setLibReady] = useState(false)
  const doneRef = useRef(false)
  const fileRef = useRef<any>(null)

  useEffect(() => {
    getRetourOrders().then(({ orders: data }) => setOrders(data))

    if (typeof window === 'undefined') return
    if ((window as any).Html5Qrcode) { setLibReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
    s.async = true
    s.onload = () => setLibReady(true)
    document.head.appendChild(s)
  }, [])

  function matchOrder(code: string): RiyaltoOrder | null {
    const up = code.toUpperCase().trim()
    return orders.find(o =>
      o.riya.toUpperCase() === up ||
      up.includes(o.riya.toUpperCase()) ||
      o.riya.toUpperCase().includes(up)
    ) ?? null
  }

  async function handleCode(code: string) {
    if (doneRef.current) return
    doneRef.current = true
    const matched = matchOrder(code)
    if (matched) {
      await receiveOrder(matched.riya)
      setResult({ ok: true, order: matched })
    } else {
      setResult({ ok: false, code })
    }
  }

  function resizeAndScan(file: File) {
    setScanning(true)
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const MAX = 1400
        let w = img.width, h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX }
          else { w = Math.round((w * MAX) / h); h = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        canvas.toBlob(blob => {
          if (!blob) { setScanning(false); return }
          const resized = new File([blob], 'scan.jpg', { type: 'image/jpeg' })
          const Lib = (window as any).Html5Qrcode
          if (!fileRef.current) fileRef.current = new Lib('reader-file')
          fileRef.current
            .scanFile(resized, false)
            .then((code: string) => { setScanning(false); handleCode(code) })
            .catch(() => {
              setScanning(false)
              alert('Code non détecté. Photographiez le code-barres plus près et bien plat.')
            })
        }, 'image/jpeg', 0.92)
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  }

  function reset() {
    doneRef.current = false
    setResult(null)
    setScanning(false)
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/anoir/retours" className="text-blue-600 hover:text-blue-700">
          <ArrowLeft size={22} />
        </Link>
        <span className="font-bold text-zinc-900 text-lg">Scanner un retour</span>
      </div>

      {!result && (
        <>
          {/* Photo capture button — primary method, works on all devices */}
          {!scanning && (
            <div className="p-5">
              <label className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white rounded-2xl py-6 text-lg font-bold cursor-pointer hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
                <Camera size={26} />
                Photographier le code-barres
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (!libReady) {
                      alert('Chargement en cours, réessayez dans 2 secondes.')
                      return
                    }
                    resizeAndScan(file)
                    e.target.value = ''
                  }}
                />
              </label>
              <p className="text-center text-sm text-zinc-400 mt-3">
                Ouvre directement votre caméra
              </p>
            </div>
          )}

          {scanning && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
              <p className="text-base font-semibold text-blue-600">Analyse en cours...</p>
            </div>
          )}

          <div id="reader-file" className="hidden" />

          {/* Manual input */}
          <div className="p-4 mt-auto border-t border-gray-200">
            <p className="text-xs text-zinc-500 font-semibold mb-2 uppercase tracking-wide">
              Ou entrez le code manuellement :
            </p>
            <form
              onSubmit={e => {
                e.preventDefault()
                const val = (e.currentTarget.elements.namedItem('code') as HTMLInputElement).value.trim()
                if (val) handleCode(val)
              }}
              className="flex gap-2"
            >
              <input
                name="code"
                placeholder="RIYA-XXXXXXXX-XXXXX"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="characters"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </form>
            <p className="text-xs text-zinc-400 mt-2">Fonctionne aussi avec un scanner Bluetooth</p>
          </div>
        </>
      )}

      {result && (
        <div className={`m-5 rounded-2xl p-8 text-center border-2 ${result.ok ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
          <div className="text-6xl mb-4">{result.ok ? '✅' : '❌'}</div>
          {result.ok ? (
            <>
              <div className="text-xl font-bold text-green-700 mb-2">Reçu !</div>
              <div className="font-bold text-zinc-900 text-lg mb-1">{result.order.name || '—'}</div>
              <div className="font-mono text-sm text-zinc-500 mb-1">{result.order.riya}</div>
              <div className="text-sm text-zinc-500">{result.order.city} · {result.order.price} DH</div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-red-700 mb-2">Code non trouvé</div>
              <div className="text-sm text-zinc-500 font-mono break-all">{result.code}</div>
              <p className="text-xs text-zinc-400 mt-2">Ce code ne correspond à aucun retour en attente</p>
            </>
          )}
          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={reset}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              Scanner un autre
            </button>
            <Link
              href="/anoir/retours"
              className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-sm text-center hover:bg-blue-50 transition-colors"
            >
              Voir les retours
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
