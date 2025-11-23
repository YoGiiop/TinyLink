// client/src/api.js
import axios from 'axios'

const rawBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const baseURL = `${rawBase.replace(/\/$/, '')}/api`

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Helper wrappers

export async function fetchLinks() {
  const res = await api.get('/links')
  return res.data
}

export async function createLink(data) {
  const res = await api.post('/links', data)
  return res.data
}

export async function deleteLinkByCode(code) {
  const res = await api.delete(`/links/${code}`)
  return res.data
}

export async function fetchLinkStats(code) {
  const res = await api.get(`/links/${code}`)
  return res.data
}
