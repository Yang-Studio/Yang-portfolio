import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
const username = process.env.ADMIN_SETUP_USERNAME || 'admin'
const password =
  process.env.ADMIN_SETUP_PASSWORD ||
  Array.from(randomBytes(22), (byte) => alphabet[byte % alphabet.length]).join('')
const values = {
  ADMIN_USERNAME: username,
  ADMIN_PASSWORD: password,
  ADMIN_SESSION_SECRET: randomBytes(48).toString('hex'),
  ANALYTICS_SALT: randomBytes(48).toString('hex'),
}

if (process.argv.includes('--write-local')) {
  const envPath = resolve('.env.local')
  const existing = readFileSync(envPath, 'utf8')
  const managedKeys = new Set([...Object.keys(values), 'ADMIN_PASSWORD_HASH'])
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
console.log(`Temporary admin password: ${password}`)
console.log('Store the password in a password manager. Do not commit it to Git.')
