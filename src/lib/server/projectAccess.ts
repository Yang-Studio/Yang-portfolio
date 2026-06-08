import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const ACCESS_SECONDS = 60 * 60 * 8
const TERRADOTTA_COOKIE = 'yang_terradotta_access'

type ProjectAccessSession = {
  project: string
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

function accessSecret() {
  const password = terradottaPassword()
  return password ? createHash('sha256').update(`yang-terradotta-access:${password}`).digest() : undefined
}

function terradottaPassword() {
  return process.env.TERRADOTTA_PASSWORD || ''
}

function sign(payload: string) {
  const secret = accessSecret()
  if (!secret) throw new Error('TERRADOTTA_PASSWORD is not configured.')
  return base64url(createHmac('sha256', secret).update(payload).digest())
}

function constantTimeEquals(actualValue: string, expectedValue: string) {
  const actual = Buffer.from(actualValue)
  const expected = Buffer.from(expectedValue)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export const terradottaAccessCookieName = TERRADOTTA_COOKIE
export const terradottaAccessMaxAge = ACCESS_SECONDS

export function isTerradottaLockConfigured() {
  return Boolean(terradottaPassword() && accessSecret())
}

export function verifyTerradottaPassword(password: string) {
  const expected = terradottaPassword()
  return Boolean(expected && constantTimeEquals(password, expected))
}

export function createTerradottaAccessToken() {
  const payload = base64url(
    JSON.stringify({
      project: 'terradotta',
      expiresAt: Date.now() + ACCESS_SECONDS * 1000,
    } satisfies ProjectAccessSession),
  )
  return `${payload}.${sign(payload)}`
}

export function readTerradottaAccessToken(token?: string) {
  if (!token || !accessSecret()) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = Buffer.from(sign(payload))
  const actual = Buffer.from(signature)
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false

  try {
    const session = JSON.parse(fromBase64url(payload)) as ProjectAccessSession
    return session.project === 'terradotta' && session.expiresAt > Date.now()
  } catch {
    return false
  }
}

export async function canViewTerradottaProject() {
  const cookieStore = await cookies()
  return readTerradottaAccessToken(cookieStore.get(TERRADOTTA_COOKIE)?.value)
}
