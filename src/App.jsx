import { Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Patient from './Patient.jsx'
import Share from './share.jsx'
import Access from './Access.jsx'
import ProviderHome from './ProviderHome.jsx'
import Provider from './Provider.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Patient />} />
      <Route path="/share" element={<Share />} />
      <Route path="/access" element={<Access />} />
      <Route path="/scan" element={<ProviderHome />} />
      <Route path="/v/:token" element={<Provider />} />
    </Routes>
  )
}