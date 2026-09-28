import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { patientList } from './data.js'
import { login } from './auth.js'
import Brand from './Brand.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState('pick')
  const [abha, setAbha] = useState('')
  const [otp, setOtp] = useState('')

  function requestOtp(id) {
    setAbha(id)
    setStep('otp')
  }

  function verify() {
    if (otp.trim().length < 4) {
      alert('Enter the OTP (any 6 digits, demo mode)')
      return
    }
    login(abha)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Brand subtitle="Patient-held, consent-driven health record" />
      <h1 className="text-2xl font-bold text-slate-800">Login</h1>

      {step === 'pick' && (
        <div className="space-y-3">
          <p className="text-slate-500 text-sm">Demo: pick a sample patient to log in as</p>
          {patientList.map((p) => (
            <button
              key={p.abha}
              onClick={() => requestOtp(p.abha)}
              className="w-full text-left bg-white border rounded-xl p-4 hover:border-teal-600"
            >
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-slate-500">ABHA: {p.abha}</p>
            </button>
          ))}
        </div>
      )}

      {step === 'otp' && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <p>OTP sent to phone linked with <span className="font-mono">{abha}</span></p>
          <input
            className="w-full border rounded p-3 text-lg tracking-widest"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verify} className="w-full bg-teal-700 text-white font-bold rounded-xl p-3">
            Verify & Login
          </button>
          <button onClick={() => setStep('pick')} className="w-full text-slate-500">
            &larr; Back
          </button>
        </div>
      )}
    </div>
  )
}