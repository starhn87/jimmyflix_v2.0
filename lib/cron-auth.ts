import { timingSafeEqual } from 'node:crypto'

export function isCronAuthorized(authorization: string | null, secret: string | undefined) {
  if (!secret || !authorization) return false
  const received = Buffer.from(authorization)
  const expected = Buffer.from(`Bearer ${secret}`)
  return received.length === expected.length && timingSafeEqual(received, expected)
}
