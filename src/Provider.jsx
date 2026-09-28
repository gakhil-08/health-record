import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { patients } from './data.js'
import { getConsent, addLog, addUpdate } from './store.js'
import Brand from './Brand.jsx'

export default function Provider() {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const abhaCheck = searchParams.get('abha')

  const [consent, setConsent] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const logged = useRef(false)

  useEffect(() => {
    async function refresh() {
      const c = await getConsent(token)
      setConsent(c)
      setLoaded(true)
    }
    refresh()
    const timer = setInterval(() => { setNow(Date.now()); refresh() }, 2000)
    return () => clearInterval(timer)
  }, [token])

  const abhaMismatch = consent && abhaCheck && consent.abha !== abhaCheck
  const valid = consent && !consent.revoked && new Date(consent.expiresAt) > now && !abhaMismatch

  useEffect(() => {
    if (valid && !logged.current) {
      logged.current = true
      addLog(token, 'viewed', consent.label, consent.abha)
    }
  }, [valid, token, consent])

  if (!loaded) return <p className="max-w-md mx-auto p-4">Loading...</p>

  if (!consent) {
    return <Msg title="Invalid code" text="This access code does not exist." color="slate" />
  }
  if (abhaMismatch) {
    return <Msg title="ABHA ID does not match" text="The ABHA ID does not match this access code." color="red" />
  }
  if (consent.revoked) {
    return <Msg title="Patient has revoked access" text="You can no longer view this record." color="red" />
  }
  if (!valid) {
    return <Msg title="Access expired" text="Ask the patient for a new QR code." color="yellow" />
  }

  const patient = patients[consent.abha]
  const msLeft = new Date(consent.expiresAt) - now
  const h = Math.floor(msLeft / 3600000)
  const m = Math.floor((msLeft % 3600000) / 60000)
  const has = (s) => consent.scopes.includes(s)

  async function submitNote() {
    if (!note.trim()) return
    await addUpdate(token, consent.abha, note.trim())
    setNote('')
    setSent(true)
    setTimeout(() => setSent(false), 2500)
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Brand subtitle="Provider view" />
      <div className="bg-teal-700 text-white rounded-xl p-4">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p>Age {patient.age} | {patient.abha}</p>
        <p className="text-sm mt-1">Access ends in {h}h {m}m</p>
      </div>

      {has('allergies') && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
          <h2 className="font-bold text-red-700">ALLERGIES</h2>
          {patient.allergies.length === 0 && <p>None recorded</p>}
          {patient.allergies.map((a) => (
            <p key={a.name} className="text-lg font-bold">{a.name} ({a.severity})</p>
          ))}
        </div>
      )}

      {has('medicines') && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-bold">Current Medicines</h2>
          {patient.medicines.map((x) => (
            <p key={x.name}>{x.name}, {x.dose} <span className="text-slate-500">({x.by})</span></p>
          ))}
        </div>
      )}

      {has('tests') && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-bold">Recent Tests</h2>
          {patient.tests.map((t) => {
            const days = Math.floor((now - new Date(t.date)) / 86400000)
            return (
              <p key={t.name}>{t.name}: {t.result} <span className="bg-yellow-200 text-sm rounded px-1">Done {days} days ago</span></p>
            )
          })}
        </div>
      )}

      <div className="bg-white border rounded-xl p-4 space-y-2">
        <h2 className="font-bold">Add visit note / prescription</h2>
        <p className="text-xs text-slate-500">This writes back to the patient's record instantly.</p>
        <textarea className="w-full border rounded p-2" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Prescribed Paracetamol 500mg for fever" />
        <button onClick={submitNote} className="w-full bg-teal-700 text-white font-bold rounded-xl p-3">
          {sent ? 'Sent ✓' : 'Send to patient record'}
        </button>
      </div>
    </div>
  )
}

function Msg({ title, text, color }) {
  const styles = {
    red: 'bg-red-50 border-red-300 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    slate: 'bg-slate-100 border-slate-300 text-slate-700',
  }
  return (
    <div className="max-w-md mx-auto p-4">
      <Brand subtitle="Provider view" />
      <div className={`border rounded-xl p-6 text-center ${styles[color]}`}>
        <h1 className="text-xl font-bold">{title}</h1>
        <p>{text}</p>
      </div>
    </div>
  )
}