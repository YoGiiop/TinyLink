// server/models/Link.js
import mongoose from 'mongoose'

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9]{6,8}$/,
    },
    shortUrl: {
      type: String,
      required: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastClicked: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

const Link = mongoose.model('Link', linkSchema)
export default Link
