// server/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import linkRoutes from './routes/linkRoutes.js'
import { redirectByCode } from './controllers/linkController.js'

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'],
  })
)
app.use(express.json())

// Healthcheck – must be GET /healthz and return 200
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' })
})

// API routes – this gives /api/links, /api/links/:code, etc.
app.use('/api', linkRoutes)

// Redirect route – must be /:code
// Keep AFTER /healthz and /api so it doesn't catch them
app.get('/:code', redirectByCode)

const port = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to start server:', err)
  })

export default app
