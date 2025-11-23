// client/src/routes/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import LinkList from '../components/LinkList'
import { LoaderFull } from '../components/Loader'
import CreateLinkForm from '../components/CreateLinkForm'
import { addToast } from '../hooks/useToasts'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/links')
      .then((r) => setLinks(r.data.links || r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // optional: if you later update CreateLinkForm to call onCreated(newLink)
  const handleCreated = (newLink) => {
    // keep newest link on top
    setLinks((prev) => [newLink, ...prev])
  }

  // Delete handler
  const handleDelete = async (code) => {
    if (!window.confirm('Delete this link? This cannot be undone.')) return
    try {
      await api.delete(`/links/${code}`)
      setLinks((prev) => prev.filter((l) => l.code !== code))
      addToast('Link deleted')
    } catch (err) {
      console.error(err)
      addToast('Failed to delete link', 'error')
    }
  }

  if (loading) return <LoaderFull />

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <CreateLinkForm onCreated={handleCreated} />

      {/* Existing list of links */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Links</h3>
        <LinkList links={links} onDelete={handleDelete} />
      </div>
    </div>
  )
}
