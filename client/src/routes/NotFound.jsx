import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-3">404 — Page Not Found</h2>
      <Link to="/" className="text-brand-500">Go Home</Link>
    </div>
  )
}
