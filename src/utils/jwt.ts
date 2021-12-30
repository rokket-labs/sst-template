import jwt from 'jsonwebtoken'

const publicKey = process.env.PUBLIC_KEY ?? ''
const privateKey = process.env.PRIVATE_KEY ?? ''

export function signJwt(
  object: Record<string, unknown>,
  options?: jwt.SignOptions | undefined,
) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, publicKey) as T

    return decoded
  } catch (e) {
    return null
  }
}
