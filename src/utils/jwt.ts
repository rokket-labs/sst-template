import jwt from 'jsonwebtoken'
import { omit } from 'ramda'

const publicKey = Buffer.from(process.env.PUBLIC_KEY ?? '', 'base64').toString(
  'ascii',
)
const privateKey = Buffer.from(
  process.env.PRIVATE_KEY ?? '',
  'base64',
).toString('ascii')

export function signJwt(
  object: Record<string, unknown>,
  options?: jwt.SignOptions | undefined,
) {
  return jwt.sign(omit(['password'], object), privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token.split(' ')[1], publicKey) as T

    return decoded
  } catch (e) {
    return null
  }
}
