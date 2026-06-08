import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'yang_admin_session'
const SESSION_SECONDS = 60 * 60 * 8

type AdminSession = {
  scope: 'admin'
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

const adminPassword = () => process.env.ADMIN_PASSWORD || ''

const sessionSecret = () => {
  const password = adminPassword()
  return password ? createHash('sha256').update(`yang-admin-session:${password}`).digest() : undefined
}

const sign = (payload: string) => {
  const secret = sessionSecret()
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured.')
  return base64url(createHmac('sha256', secret).update(payload).digest())
}

export const adminCookieName = ADMIN_COOKIE
export const adminCookieMaxAge = SESSION_SECONDS

export function createAdminSession() {
  const payload = base64url(
    JSON.stringify({ scope: 'admin', expiresAt: Date.now() + SESSION_SECONDS * 1000 } satisfies AdminSession),
  )
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
    if (session.scope !== 'admin' || !session.expiresAt || session.expiresAt < Date.now()) return undefined
    return session
  } catch {
    return undefined
  }
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies()
  return readAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)
}

export function verifyAdminPassword(password: string) {
  const configuredPassword = adminPassword()
  if (!configuredPassword) return false

  const actual = Buffer.from(password)
  const expected = Buffer.from(configuredPassword)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
