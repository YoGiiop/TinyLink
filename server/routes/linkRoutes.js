// server/routes/linkRoutes.js
import { Router } from 'express'
import {
  createLink,
  getLinks,
  getLinkStats,
  deleteLink,
} from '../controllers/linkController.js'

const router = Router()

// PDF spec:
// POST   /api/links         → create (409 on duplicate)
// GET    /api/links         → list all
// GET    /api/links/:code   → stats for one
// DELETE /api/links/:code   → delete
router.post('/links', createLink)
router.get('/links', getLinks)
router.get('/links/:code', getLinkStats)
router.delete('/links/:code', deleteLink)

export default router
