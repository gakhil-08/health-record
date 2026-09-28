import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { patient } from './data.js'
import { getConsent, addLog } from './store.js'

export default function Provider() {
  const { token } = useParams()
  const [consent, setConsent] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [now, setNow] = useState(Date.now())
  const logged = useRef(false)

  useEffect(() => {
    async function refresh() {
      const c = await getConsent(token)
      setConsent(c)
      setLoaded(true)
    }
    refresh()
    const timer = setInterval(() => {
      setNow(Date.now())
      refresh()
    }, 2000)
    return () => clearInterval(timer)
  }, [token])

  const valid = consent && !consent.revoked && new Date(consent.expiresAt) > now

  useEffect(() => {
    if (valid && !logged.current) {
      logged.current = true
      addLog(token, 'viewed', consent.label)
    }
  }, [valid, token, consent])

  if (!loaded) {
    return <p className="max-w-md mx-auto p-4">Loading...</p>
  }

  if (!consent) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-gray-100 border rounded-xl p-6 text-center">
          <h1 className="text-xl font-bold">Invalid code</h1>
          <p>This access code does not exist.</p>
        </div>
      </div>
    )
  }

  if (consent.revoked) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">Patient has revoked access</h1>
          <p>You can no longer view this record.</p>
        </div>
      </div>
    )
  }

  if (!valid) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
          <h1 className="text-xl font-bold">Access expired</h1>
          <p>Ask the patient for a new QR code.</p>
        </div>
      </div>
    )
  }

  const msLeft = new Date(consent.expiresAt) - now
  const h = Math.floor(msLeft / 3600000)
  const m = Math.floor((msLeft % 3600000) / 60000)
  const has = (s) => consent.scopes.includes(s)

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-blue-700 text-white rounded-xl p-4">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p>Age {patient.age} | {patient.abha}</p>
        <p className="text-sm mt-1">Access ends in {h}h {m}m</p>
      </div>

      {has('allergies') && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
          <h2 className="font-bold text-red-700">ALLERGIES</h2>
          {patient.allergies.map((a) => (
            <p key={a.name} className="text-lg font-bold">{a.name} ({a.severity})</p>
          ))}
        </div>
      )}

      {has('medicines') && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-bold">Current Medicines</h2>
          {patient.medicines.map((x) => (
            <p key={x.name}>{x.name}, {x.dose} <span className="text-gray-500">({x.by})</span></p>
          ))}
        </div>
      )}

      {has('tests') && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-bold">Recent Tests</h2>
          {patient.tests.map((t) => {
            const days = Math.floor((now - new Date(t.date)) / 86400000)
            return (
              <p key={t.name}>
                {t.name}: {t.result}{' '}
                <span className="bg-yellow-200 text-sm rounded px-1">Done {days} days ago</span>
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}