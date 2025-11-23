import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI is not set in .env')
    }

    await mongoose.connect(uri)
    console.log('Database connected')
  } catch (err) {
    console.error('Database connection error:', err.message)
    process.exit(1)
  }
}
