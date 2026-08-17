import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const binaryExtensions = new Set([
  '.gif', '.ico', '.jpeg', '.jpg', '.mov', '.mp4', '.pdf', '.png',
  '.tif', '.tiff', '.webp', '.woff', '.woff2', '.zip',
])
const ignoredDirectories = new Set(['.git', '.next', 'node_modules'])
const rules = [
  { name: 'OpenAI API key', pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g },
  { name: 'Plain administrator password', pattern: /^\s*ADMIN_PASSWORD\s*=\s*[^\s\r\n]+/gm },
  { name: 'Committed administrator password hash', pattern: /^\s*ADMIN_PASSWORD_HASH\s*=\s*[^\s\r\n]+/gm },
  { name: 'Committed administrator session secret', pattern: /^\s*ADMIN_SESSION_SECRET\s*=\s*[^\s\r\n]+/gm },
  { name: 'Committed analytics salt', pattern: /^\s*ANALYTICS_SALT\s*=\s*[^\s\r\n]+/gm },
  { name: 'Committed Terra Dotta password', pattern: /^\s*TERRADOTTA_PASSWORD\s*=\s*[^\s\r\n]+/gm },
  { name: 'Committed Terra Dotta lock secret', pattern: /^\s*TERRADOTTA_LOCK_SECRET\s*=\s*[^\s\r\n]+/gm },
]
function walk(directory = '.') {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...walk(path))
    else if (entry.isFile()) files.push(path.replace(/^\.\//, ''))
  }
  return files
}
let files
try {
  files = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).split('\0').filter(Boolean)
} catch {
  files = walk()
}
const findings = []
for (const file of files) {
  if (file === '.env.example') continue
  if (binaryExtensions.has(extname(file).toLowerCase())) continue
  let content
  try { content = readFileSync(file, 'utf8') } catch { continue }
  if (content.includes('\0')) continue
  for (const rule of rules) {
    rule.pattern.lastIndex = 0
    if (rule.pattern.test(content)) findings.push(rule.name + ': ' + file)
  }
}
if (findings.length) {
  console.error('Potential secrets found:')
  for (const finding of findings) console.error('- ' + finding)
  process.exit(1)
}
console.log('Secret scan passed (' + files.length + ' files checked).')
