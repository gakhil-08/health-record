import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Brand from './Brand.jsx'

export default function ProviderHome() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('code')
  const [code, setCode] = useState('')
  const [abha, setAbha] = useState('')

  function goCode() {
    if (!code.trim()) return alert('Enter the code')
    navigate(`/v/${code.trim().toUpperCase()}`)
  }

  function goAbha() {
    if (!code.trim() || !abha.trim()) return alert('Enter both ABHA ID and code')
    navigate(`/v/${code.trim().toUpperCase()}?abha=${encodeURIComponent(abha.trim())}`)
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Brand subtitle="Provider access portal" />
      <h1 className="text-xl font-bold">Access a patient record</h1>

      <div className="flex gap-2">
        <button onClick={() => setTab('code')} className={`flex-1 p-2 rounded-lg font-bold ${tab === 'code' ? 'bg-teal-700 text-white' : 'bg-slate-100'}`}>Enter Code</button>
        <button onClick={() => setTab('abha')} className={`flex-1 p-2 rounded-lg font-bold ${tab === 'abha' ? 'bg-teal-700 text-white' : 'bg-slate-100'}`}>ABHA-Linked</button>
      </div>

      {tab === 'code' && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <p className="text-slate-500 text-sm">Patient gives you a QR code, or type the 6-character code here.</p>
          <input className="w-full border rounded p-3 text-lg tracking-widest font-mono" placeholder="e.g. K3X9PQ" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={goCode} className="w-full bg-teal-700 text-white font-bold rounded-xl p-3">View Record</button>
        </div>
      )}

      {tab === 'abha' && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <p className="text-slate-500 text-sm">Enter the patient's ABHA ID plus the access code they gave you.</p>
          <input className="w-full border rounded p-3 text-lg" placeholder="ABHA ID" value={abha} onChange={(e) => setAbha(e.target.value)} />
          <input className="w-full border rounded p-3 text-lg tracking-widest font-mono" placeholder="Access code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={goAbha} className="w-full bg-teal-700 text-white font-bold rounded-xl p-3">Verify & View Record</button>
        </div>
      )}
    </div>
  )
}