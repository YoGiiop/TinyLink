import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ToastContainer from './components/ToastContainer'
import Dashboard from './routes/Dashboard'
import LinkDetails from './routes/LinkDetails'
import NotFound from './routes/NotFound'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <ToastContainer />

      <main className="container mx-auto p-6">
        <Routes>
          {/* Dashboard is at / */}
          <Route path="/" element={<Dashboard />} />

          {/* Stats page for a single code */}
          <Route path="/code/:code" element={<LinkDetails />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
