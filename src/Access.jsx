import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllConsents, revokeConsent, getLog } from './store.js'
import { currentAbha } from './auth.js'
import Brand from './Brand.jsx'

const names = { allergies: 'Allergies', medicines: 'Medicines', tests: 'Tests' }

export default function Access() {
  const navigate = useNavigate()
  const abha = currentAbha()
  const [consents, setConsents] = useState([])
  const [log, setLog] = useState([])
  const [now, setNow] = useState(Date.now())

  async function refresh() {
    if (!abha) return
    setConsents(await getAllConsents(abha))
    setLog(await getLog(abha))
    setNow(Date.now())
  }

  useEffect(() => {
    if (!abha) { navigate('/login'); return }
    refresh()
    const timer = setInterval(refresh, 2000)
    return () => clearInterval(timer)
  }, [abha])

  async function handleRevoke(token) {
    await revokeConsent(token, abha)
    refresh()
  }

  const isActive = (c) => !c.revoked && new Date(c.expiresAt) > now
  const active = consents.filter(isActive)
  const ended = consents.filter((c) => !isActive(c))

  function timeLeft(c) {
    const ms = new Date(c.expiresAt) - now
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m left`
  }

  function sentence(e) {
    const who = e.label || 'A provider'
    const t = new Date(e.time).toLocaleTimeString()
    if (e.event === 'granted') return `You gave ${who} access, ${t}`
    if (e.event === 'viewed') return `${who} viewed your records, ${t}`
    if (e.event === 'revoked') return `You revoked access (code ${e.token}), ${t}`
    return `${e.event}, ${t}`
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Brand />
      <Link to="/" className="text-teal-700">&larr; Back</Link>
      <h1 className="text-2xl font-bold">Who can see my records</h1>

      {active.length === 0 && <div className="bg-slate-100 border rounded-xl p-4 text-center">No one has access right now.</div>}

      {active.map((c) => (
        <div key={c.token} className="bg-white border rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <h2 className="font-bold text-lg">{c.label}</h2>
            <span className="font-mono text-slate-500">{c.token}</span>
          </div>
          <p>Sharing: {c.scopes.map((s) => names[s]).join(', ')}</p>
          <p className="text-green-700 font-bold">{timeLeft(c)}</p>
          <button onClick={() => handleRevoke(c.token)} className="w-full bg-red-600 text-white text-lg font-bold rounded-xl p-3">
            Revoke access
          </button>
        </div>
      ))}

      {ended.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-slate-600">Ended</h2>
          {ended.map((c) => (
            <div key={c.token} className="bg-slate-100 border rounded-xl p-3 text-slate-500">
              {c.label} ({c.token}): {c.revoked ? 'Revoked' : 'Expired'}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border rounded-xl p-4 space-y-2">
        <h2 className="font-bold text-lg">Activity</h2>
        {log.length === 0 && <p className="text-slate-500">Nothing yet.</p>}
        {log.map((e, i) => (
          <p key={i} className="text-sm border-b pb-1">{sentence(e)}</p>
        ))}
      </div>
    </div>
  )
}