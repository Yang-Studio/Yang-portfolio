import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
const adminPassword =
  process.env.ADMIN_SETUP_PASSWORD ||
  Array.from(randomBytes(22), (byte) => alphabet[byte % alphabet.length]).join('')
const terradottaPassword =
  process.env.TERRADOTTA_SETUP_PASSWORD ||
  Array.from(randomBytes(22), (byte) => alphabet[byte % alphabet.length]).join('')
const values = {
  ADMIN_PASSWORD: adminPassword,
  TERRADOTTA_PASSWORD: terradottaPassword,
}

if (process.argv.includes('--write-local')) {
  const envPath = resolve('.env.local')
  const existing = readFileSync(envPath, 'utf8')
  const managedKeys = new Set([
    ...Object.keys(values),
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_SESSION_SECRET',
    'ANALYTICS_SALT',
    'JWT_SECRET',
    'TERRADOTTA_LOCK_SECRET',
  ])
  const preserved = existing
    .split(/\r?\n/)
    .filter((line) => !managedKeys.has(line.split('=', 1)[0]))
    .join('\n')
    .trimEnd()
  const managed = Object.entries(values)
    .map(([key, value]) => `${key}=${value.replaceAll('$', '\\$')}`)
    .join('\n')

  writeFileSync(envPath, `${preserved}\n\n${managed}\n`, 'utf8')

  console.log('Local administrator configuration updated.')
  console.log('Restart the Next.js server before signing in.')
  process.exit(0)
}

console.log('Add these values to Vercel Project Settings > Environment Variables:')
console.log('')
for (const [key, value] of Object.entries(values)) {
  console.log(`${key}=${value}`)
}
console.log('')
console.log(`Temporary admin password: ${adminPassword}`)
console.log(`Temporary Terra Dotta password: ${terradottaPassword}`)
console.log('Store both passwords in a password manager. Do not commit them to Git.')
