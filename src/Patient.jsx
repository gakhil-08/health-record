import { patient } from './data.js'
import { Link } from 'react-router-dom'

export default function Patient() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-blue-700 text-white rounded-xl p-4">
        <p className="text-sm">ABHA Health Card</p>
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p>Age {patient.age} | {patient.abha}</p>
      </div>

      <div className="bg-red-50 border border-red-300 rounded-xl p-4">
        <h2 className="font-bold text-red-700">Allergies</h2>
        {patient.allergies.map((a) => (
          <p key={a.name}>{a.name} ({a.severity})</p>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-bold">Current Medicines</h2>
        {patient.medicines.map((m) => (
          <p key={m.name}>{m.name}, {m.dose} <span className="text-gray-500">({m.by})</span></p>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-bold">Tests</h2>
        {patient.tests.map((t) => (
          <p key={t.name}>{t.name}: {t.result} <span className="text-gray-500">({t.date}, {t.place})</span></p>
        ))}
      </div>

    <Link to="/share" className="block text-center w-full bg-green-600 text-white text-lg font-bold rounded-xl p-4">
        Share my records
    </Link>
    <Link to="/access" className="block text-center w-full border-2 border-red-600 text-red-600 text-lg font-bold rounded-xl p-4">
  Who can see my records
</Link>
    </div>
  )
}