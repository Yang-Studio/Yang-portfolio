import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'yang_admin_session'
const SESSION_SECONDS = 60 * 60 * 8

type AdminSession = {
  username: string
  expiresAt: number
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')

const fromBase64url = (input: string) => {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

const sessionSecret = () => process.env.ADMIN_SESSION_SECRET || ''

const sign = (payload: string) => base64url(createHmac('sha256', sessionSecret()).update(payload).digest())

export const adminCookieName = ADMIN_COOKIE
export const adminCookieMaxAge = SESSION_SECONDS

export function createAdminSession(username: string) {
  if (!sessionSecret()) throw new Error('ADMIN_SESSION_SECRET is not configured.')

  const payload = base64url(JSON.stringify({ username, expiresAt: Date.now() + SESSION_SECONDS * 1000 }))
  return `${payload}.${sign(payload)}`
}

export function readAdminSession(token?: string): AdminSession | undefined {
  if (!token || !sessionSecret()) return undefined

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return undefined

  const expected = Buffer.from(sign(payload))
  const actual = Buffer.from(signature)
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined

  try {
    const session = JSON.parse(fromBase64url(payload)) as AdminSession
    if (!session.username || !session.expiresAt || session.expiresAt < Date.now()) return undefined
    return session
  } catch {
    return undefined
  }
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies()
  return readAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)
}

export function verifyAdminPassword(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!expectedUsername || username !== expectedUsername) return false

  if (expectedPassword) {
    const actual = Buffer.from(password)
    const expected = Buffer.from(expectedPassword)
    return actual.length === expected.length && timingSafeEqual(actual, expected)
  }

  if (!passwordHash) return false

  const [algorithm, saltHex, expectedHex] = passwordHash.split('$')
  if (algorithm !== 'scrypt' || !saltHex || !expectedHex) return false

  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), Buffer.from(expectedHex, 'hex').length)
  const expected = Buffer.from(expectedHex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function generatePasswordHash(password: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}
