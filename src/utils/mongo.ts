import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI ?? ''
const isLocal = !!process.env.IS_LOCAL

if (!uri)
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )

const opts: mongoose.ConnectOptions = {
  bufferCommands: false,
  autoIndex: isLocal,
}

let cachedConnection: typeof mongoose

export const dbConnect = async () => {
  if (cachedConnection) return cachedConnection

  cachedConnection = await mongoose.connect(uri, opts)

  return cachedConnection
}
