// client/src/routes/LinkDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { fetchLinkStats, api } from '../api'
import { LoaderFull } from '../components/Loader'
import { addToast } from '../hooks/useToasts'

export default function LinkDetails() {
  // we use /code/:code in the route
  const { code } = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      try {
        setError(null)
        setLoading(true)
        const data = await fetchLinkStats(code)
        setLink(data)
      } catch (err) {
        console.error(err)
        setError('Could not find this link.')
      } finally {
        setLoading(false)
      }
    }

    if (code) run()
  }, [code])

  const handleDelete = async () => {
    if (!link || !link.code) return
    if (!window.confirm('Delete this link? This cannot be undone.')) return

    try {
      await api.delete(`/links/${link.code}`)
      addToast('Link deleted')
      navigate('/') // go back to dashboard
    } catch (err) {
      console.error(err)
      addToast('Failed to delete link', 'error')
    }
  }

  if (loading) return <LoaderFull />

  if (error || !link) {
    return (
      <div className="space-y-3">
        <p className="text-red-600 text-sm">{error || 'Not found'}</p>
        <RouterLink to="/" className="text-blue-600 text-sm hover:underline">
          ← Back to dashboard
        </RouterLink>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <RouterLink to="/" className="text-blue-600 text-sm hover:underline">
        ← Back to dashboard
      </RouterLink>

      <div className="card space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Link stats</h2>

          {/* Delete button */}
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-red-600 hover:underline cursor-pointer"
          >
            Delete link
          </button>
        </div>

        <p className="text-xs text-slate-500 font-mono">Code: {link.code}</p>

        <p className="text-sm">
          Short URL:{' '}
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {link.shortUrl}
          </a>
        </p>

        <p className="text-sm">
          Original URL:{' '}
          <a
            href={link.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {link.originalUrl}
          </a>
        </p>

        <p className="text-sm">Total clicks: {link.clicks ?? 0}</p>

        <p className="text-sm">
          Last clicked:{' '}
          {link.lastClicked
            ? new Date(link.lastClicked).toLocaleString()
            : '—'}
        </p>

        <p className="text-xs text-slate-500">
          Created:{' '}
          {link.createdAt ? new Date(link.createdAt).toLocaleString() : '—'}
        </p>
      </div>
    </div>
  )
}
