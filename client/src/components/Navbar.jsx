import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-brand-500">TinyLink</Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <nav className={`md:flex gap-4 ${open ? 'block' : 'hidden'} md:block mt-3 md:mt-0`}>
          <Link className="text-slate-700 hover:text-brand-500" to="/">Dashboard</Link>
        </nav>
      </div>
    </header>
  )
}
