import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const sites = [
  {
    name: 'Cheetah',
    source: 'project-sources/apps/cheetah',
    target: 'public/embedded-apps/cheetah',
    files: ['index.html', 'LeoLedger.js'],
  },
  {
    name: 'YinYang',
    source: 'project-sources/apps/yinyang',
    target: 'public/embedded-apps/yinyang',
    files: [
      'index.html',
      'embed.html',
      'assets/LUNAR-LICENSE',
      'assets/analysis.js',
      'assets/app.js',
      'assets/embed-host.js',
      'assets/engine.js',
      'assets/lunar.js',
      'assets/styles.css',
    ],
  },
  {
    name: 'Film Archive',
    source: 'project-sources/photography/film-archive/site',
    target: 'public/embedded-sites/film',
    files: ['index.html', 'app.js', 'data.js', 'styles.css'],
  },
]

for (const site of sites) {
  for (const relativePath of site.files) {
    const sourcePath = path.join(root, site.source, relativePath)
    const targetPath = path.join(root, site.target, relativePath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    await copyFile(sourcePath, targetPath)
  }

  console.log(`Synced ${site.name}`)
}
