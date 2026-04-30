'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lockedSeconds, setLockedSeconds] = useState(0)

  // Countdown timer during lockout
  useEffect(() => {
    if (lockedSeconds <= 0) return
    const t = setInterval(() => {
      setLockedSeconds(s => {
        if (s <= 1) { clearInterval(t); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [lockedSeconds])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || lockedSeconds > 0) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/anoir/dashboard')
        return
      }

      if (data.locked) {
        setLockedSeconds(data.secondsLeft)
        setError(`Trop de tentatives. Bloqué ${Math.ceil(data.secondsLeft / 60)} minutes.`)
      } else {
        const left = data.attemptsLeft
        setError(`Mot de passe incorrect. ${left} tentative${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}.`)
      }

      setShake(true)
      setTimeout(() => setShake(false), 600)
    } catch {
      setError('Erreur de connexion. Réessayez.')
    }

    setPassword('')
    setLoading(false)
  }

  const isLocked = lockedSeconds > 0
  const minutes = Math.floor(lockedSeconds / 60)
  const seconds = lockedSeconds % 60

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        .shake { animation: shake 0.6s ease-in-out; }
      `}</style>
      <div
        className="min-h-screen flex items-center justify-center p-4 font-sans"
        style={{
          backgroundColor: '#1a1a2e',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <div className={`bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl ${shake ? 'shake' : ''}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: '#1a1a2e' }}>
              {isLocked ? <Lock size={26} className="text-red-400" /> : <Package size={26} className="text-white" />}
            </div>
            <h1 className="text-xl font-bold text-zinc-900">ELARAIN</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Operations</p>
          </div>

          {isLocked ? (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-700">Accès bloqué</p>
                <p className="text-xs text-red-500 mt-1">Trop de tentatives incorrectes</p>
              </div>
              <div className="text-4xl font-bold text-zinc-900 tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-xs text-zinc-400">
                Réessayez dans {minutes > 0 ? `${minutes} min ${seconds}s` : `${seconds}s`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    className={`w-full px-4 py-2.5 pr-11 border rounded-lg text-sm outline-none transition-all ${
                      error
                        ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                        : 'border-gray-200 focus:ring-2 focus:ring-zinc-900'
                    }`}
                    placeholder="••••••••"
                    autoFocus
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Vérification...</>
                  : 'Se connecter'
                }
              </button>
            </form>
          )}

          <p className="text-center text-xs text-zinc-400 mt-6">
            Accès réservé à l&apos;administrateur
          </p>
        </div>
      </div>
    </>
  )
}
