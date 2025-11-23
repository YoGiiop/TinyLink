import React from 'react'
import { Link } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { addToast } from '../hooks/useToasts'

export default function LinkCard({ link, onDelete }) {
  return (
    <div className="card">
      <p className="text-xs text-gray-500 break-all">{link.originalUrl}</p>
      <a
        href={link.shortUrl}
        className="text-blue-600 text-sm"
        target="_blank"
        rel="noreferrer"
      >
        {link.shortUrl}
      </a>

      <div className="flex justify-between mt-2 text-sm">
        <span>Clicks: {link.clicks}</span>
        <button
          onClick={() => {
            copy(link.shortUrl)
            addToast('Copied!')
          }}
          className="text-xs text-blue-600 cursor-pointer"
        >
          Copy
        </button>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <Link to={`/code/${link.code}`}>Details</Link>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete && onDelete(link.code)}
          className="text-red-600 hover:underline cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
