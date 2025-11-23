// server/controllers/linkController.js
import Link from '../models/Link.js'
import Click from '../models/Click.js'

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

function generateRandomCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function buildShortUrl(code) {
  const base = process.env.BASE_SHORT_URL || process.env.BASE_URL || 'http://tinylink.app'
  return `${base.replace(/\/$/, '')}/${code}`
}

function validateUrl(value) {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }
    return true
  } catch {
    return false
  }
}

// POST /api/links
export async function createLink(req, res) {
  try {
    const { originalUrl, code: customCode } = req.body || {}

    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ message: 'originalUrl is required' })
    }

    if (!validateUrl(originalUrl)) {
      return res.status(400).json({ message: 'Please provide a valid URL (http/https)' })
    }

    let code = customCode?.trim()
    if (code) {
      if (!CODE_REGEX.test(code)) {
        return res.status(400).json({
          message: 'Code must be 6–8 characters, A–Z, a–z, 0–9',
        })
      }

      const exists = await Link.findOne({ code })
      if (exists) {
        // PDF: 409 if code exists
        return res.status(409).json({ message: 'Code already exists. Please choose another.' })
      }
    } else {
      // Auto-generate a unique code
      let tries = 0
      do {
        code = generateRandomCode(6)
        const exists = await Link.findOne({ code })
        if (!exists) break
        tries++
      } while (tries < 5)

      if (!code) {
        return res.status(500).json({ message: 'Could not generate unique code' })
      }
    }

    const shortUrl = buildShortUrl(code)

    const link = await Link.create({
      originalUrl,
      code,
      shortUrl,
    })

    return res.status(201).json(link)
  } catch (err) {
    console.error('createLink error:', err)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.code === 1) {
      return res.status(409).json({
        message: 'That code is already in use. Please choose another.',
      })
    }
    return res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/links
export async function getLinks(req, res) {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).lean()
    return res.json(links)
  } catch (err) {
    console.error('getLinks error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/links/:code
export async function getLinkStats(req, res) {
  try {
    const { code } = req.params
    const link = await Link.findOne({ code }).lean()

    if (!link) {
      return res.status(404).json({ message: 'Link not found' })
    }

    return res.json(link)
  } catch (err) {
    console.error('getLinkStats error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/links/:code
export async function deleteLink(req, res) {
  try {
    const { code } = req.params

    const link = await Link.findOneAndDelete({ code })
    if (!link) {
      return res.status(404).json({ message: 'Link not found' })
    }

    await Click.deleteMany({ link: link._id })

    // After deletion, /:code must return 404 (handled in redirectByCode)
    return res.json({ ok: true })
  } catch (err) {
    console.error('deleteLink error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// GET /:code → redirect
export async function redirectByCode(req, res) {
  try {
    const { code } = req.params

    const link = await Link.findOne({ code })
    if (!link) {
      return res.status(404).send('Not found')
    }

    // increment click count and lastClicked
    link.clicks += 1
    link.lastClicked = new Date()
    await link.save()

    // store click record
    await Click.create({
      link: link._id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    })

    return res.redirect(302, link.originalUrl)
  } catch (err) {
    console.error('redirectByCode error:', err)
    return res.status(500).send('Server error')
  }
}
