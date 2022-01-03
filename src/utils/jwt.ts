import jwt from 'jsonwebtoken'

export function decodeJwt<T>(token: string): T | null {
  try {
    const decoded = jwt.decode(token.split(' ')[1]) as T

    return decoded
  } catch (e) {
    return null
  }
}
