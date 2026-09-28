import { Routes, Route } from 'react-router-dom'
import Patient from './Patient.jsx'
import Provider from './Provider.jsx'
import Share from './share.jsx'
import Access from './Access.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Patient />} />
      <Route path="/share" element={<Share />} />
      <Route path="/access" element={<Access />} />
      <Route path="/v/:token" element={<Provider />} />
    </Routes>
  )
}