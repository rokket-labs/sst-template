import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI ?? ''
const isLocal = !!process.env.IS_LOCAL

if (!uri)
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )

let clientPromise: Promise<typeof mongoose>

const opts = {
  bufferCommands: false,
}

interface Global {
  _mongoosePromise: Promise<typeof mongoose>
}

// eslint-disable-next-line no-var
declare var global: Global

if (isLocal) {
  if (!global._mongoosePromise)
    global._mongoosePromise = mongoose.connect(uri, opts)

  clientPromise = global._mongoosePromise
} else clientPromise = mongoose.connect(uri, opts)

export default clientPromise
