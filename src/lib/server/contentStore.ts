import { readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'
import type { ContentOverrides, LangOverride } from '@/lib/content/overrides'

type Sql = ReturnType<typeof neon>

let sqlClient: Sql | undefined
let schemaReady: Promise<void> | undefined

function localStoreEnabled() {
  return !process.env.DATABASE_URL && process.env.NODE_ENV !== 'production'
}

function getSql(): Sql | undefined {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return undefined
  sqlClient ??= neon(databaseUrl)
  return sqlClient
}

const localPath = () => resolve(process.cwd(), '.content-overrides.local.json')

async function readLocal(): Promise<ContentOverrides> {
  try {
    const parsed = JSON.parse(await readFile(localPath(), 'utf8'))
    return parsed && typeof parsed === 'object' ? (parsed as ContentOverrides) : {}
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw error
  }
}

async function writeLocal(data: ContentOverrides) {
  const target = localPath()
  const temporary = `${target}.tmp`
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await rename(temporary, target)
}

async function ensureSchema(sql: Sql) {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS content_overrides (
        slug TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
  })()
  return schemaReady
}

export async function getContentOverrides(): Promise<ContentOverrides> {
  if (localStoreEnabled()) return readLocal()
  const sql = getSql()
  if (!sql) return {}
  try {
    await ensureSchema(sql)
    const rows = (await sql`SELECT slug, data FROM content_overrides`) as { slug: string; data: LangOverride }[]
    const map: ContentOverrides = {}
    for (const row of rows) map[row.slug] = row.data
    return map
  } catch (error) {
    console.error('[content-overrides] read failed', error)
    return {}
  }
}

const isEmpty = (value: LangOverride) =>
  (!value.en || Object.keys(value.en).length === 0) &&
  (!value.zh || Object.keys(value.zh).length === 0) &&
  (!value.images || Object.keys(value.images).length === 0)

export async function setContentOverride(slug: string, value: LangOverride): Promise<void> {
  if (localStoreEnabled()) {
    const data = await readLocal()
    if (isEmpty(value)) delete data[slug]
    else data[slug] = value
    await writeLocal(data)
    return
  }
  const sql = getSql()
  if (!sql) throw new Error('DATABASE_URL is not configured.')
  await ensureSchema(sql)
  if (isEmpty(value)) {
    await sql`DELETE FROM content_overrides WHERE slug = ${slug}`
    return
  }
  await sql`
    INSERT INTO content_overrides (slug, data, updated_at)
    VALUES (${slug}, ${JSON.stringify(value)}::jsonb, NOW())
    ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
  `
}
