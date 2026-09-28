import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { createConsent } from './store.js'
import { currentAbha } from './auth.js'
import { patients } from './data.js'
import Brand from './Brand.jsx'

export default function Share() {
  const navigate = useNavigate()
  const abha = currentAbha()
  const patient = patients[abha]
  const [scopes, setScopes] = useState({ allergies: true, medicines: true, tests: false })
  const [hours, setHours] = useState(24)
  const [label, setLabel] = useState('')
  const [token, setToken] = useState(null)

  if (!patient) { navigate('/login'); return null }

  function toggle(name) {
    setScopes({ ...scopes, [name]: !scopes[name] })
  }

  async function generate(customScopes, customHours, customLabel) {
    const chosen = customScopes || Object.keys(scopes).filter((s) => scopes[s])
    if (chosen.length === 0) {
      alert('Pick at least one thing to share')
      return
    }
    const t = await createConsent({
      abha,
      scopes: chosen,
      label: customLabel !== undefined ? customLabel : label,
      hours: customHours || hours,
    })
    if (t) setToken(t)
  }

  const link = token ? `${window.location.origin}/v/${token}` : ''

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Brand />
      <Link to="/" className="text-teal-700">&larr; Back</Link>
      <h1 className="text-2xl font-bold">Share my records</h1>

      {!token && (
        <>
          <button
            onClick={() => generate(['allergies', 'medicines'], 1, 'Emergency access')}
            className="w-full bg-red-600 text-white font-bold rounded-xl p-4"
          >
            Emergency Share (Allergies + Medicines, 1 hour)
          </button>

          <div className="bg-white border rounded-xl p-4 space-y-2">
            <h2 className="font-bold">Or customize</h2>
            <label className="flex gap-2 text-lg">
              <input type="checkbox" checked={scopes.allergies} onChange={() => toggle('allergies')} /> Allergies
            </label>
            <label className="flex gap-2 text-lg">
              <input type="checkbox" checked={scopes.medicines} onChange={() => toggle('medicines')} /> Current medicines
            </label>
            <label className="flex gap-2 text-lg">
              <input type="checkbox" checked={scopes.tests} onChange={() => toggle('tests')} /> Test results
            </label>
          </div>

          <div className="bg-white border rounded-xl p-4 space-y-2">
            <h2 className="font-bold">For how long</h2>
            <select className="w-full border rounded p-2 text-lg" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              <option value={1}>1 hour</option>
              <option value={24}>24 hours</option>
              <option value={168}>7 days</option>
            </select>
          </div>

          <div className="bg-white border rounded-xl p-4 space-y-2">
            <h2 className="font-bold">Who is it for (optional)</h2>
            <input className="w-full border rounded p-2 text-lg" placeholder="e.g. City Clinic" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          <button onClick={() => generate()} className="w-full bg-teal-700 text-white text-lg font-bold rounded-xl p-4">
            Generate QR code
          </button>
        </>
      )}

      {token && (
        <div className="bg-white border rounded-xl p-4 text-center space-y-3">
          <p className="font-bold">Show this to your doctor</p>
          <div className="flex justify-center"><QRCodeSVG value={link} size={220} /></div>
          <p className="text-slate-500 text-sm">Or give this code, with your ABHA ID:</p>
          <p className="text-4xl font-mono font-bold tracking-widest">{token}</p>
          <p className="text-sm text-slate-500">ABHA: {abha}</p>
          <a href={link} target="_blank" className="block text-teal-700 underline">Open provider view in a new tab</a>
          <button onClick={() => setToken(null)} className="w-full border rounded-xl p-3">Create another</button>
        </div>
      )}
    </div>
  )
}