import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patients } from './data.js'
import { currentAbha, logout } from './auth.js'
import { getUpdates } from './store.js'
import Brand from './Brand.jsx'

export default function Patient() {
  const navigate = useNavigate()
  const abha = currentAbha()
  const patient = abha ? patients[abha] : null
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    if (!abha) {
      navigate('/login')
      return
    }
    getUpdates(abha).then(setUpdates)
  }, [abha])

  if (!patient) return null

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Brand />
        <button onClick={() => { logout(); navigate('/login') }} className="text-sm text-slate-500 underline">
          Logout
        </button>
      </div>

      <div className="bg-teal-700 text-white rounded-xl p-4">
        <p className="text-sm opacity-80">ABHA Health Card</p>
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p>Age {patient.age} | {patient.abha}</p>
      </div>

      <div className="bg-red-50 border border-red-300 rounded-xl p-4">
        <h2 className="font-bold text-red-700">Allergies</h2>
        {patient.allergies.length === 0 && <p className="text-slate-500">None recorded</p>}
        {patient.allergies.map((a) => (
          <p key={a.name}>{a.name} ({a.severity})</p>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-bold">Current Medicines</h2>
        {patient.medicines.length === 0 && <p className="text-slate-500">None recorded</p>}
        {patient.medicines.map((m) => (
          <p key={m.name}>{m.name}, {m.dose} <span className="text-slate-500">({m.by})</span></p>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-bold">Tests</h2>
        {patient.tests.map((t) => (
          <p key={t.name}>{t.name}: {t.result} <span className="text-slate-500">({t.date}, {t.place})</span></p>
        ))}
      </div>

      {updates.length > 0 && (
        <div className="bg-teal-50 border border-teal-300 rounded-xl p-4">
          <h2 className="font-bold text-teal-800">Updates from providers</h2>
          {updates.map((u) => (
            <p key={u.id} className="text-sm border-b border-teal-100 py-1">{u.text}</p>
          ))}
        </div>
      )}

      <Link to="/share" className="block text-center w-full bg-green-600 text-white text-lg font-bold rounded-xl p-4">
        Share my records
      </Link>
      <Link to="/access" className="block text-center w-full border-2 border-red-600 text-red-600 text-lg font-bold rounded-xl p-4">
        Who can see my records
      </Link>
    </div>
  )
}