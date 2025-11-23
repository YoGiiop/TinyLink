import React from 'react'
import LinkCard from './LinkCard'

export default function LinkList({ links, onDelete }) {
  if (!links || links.length === 0)
    return <p className="text-slate-600">No links yet.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((l) => (
        <LinkCard key={l._id || l.code} link={l} onDelete={onDelete} />
      ))}
    </div>
  )
}
