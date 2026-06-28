import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');

const entries = [
  'index.html',
  'embed.html',
  'embed-example.html',
  'assets',
  'docs'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of entries) {
  await cp(join(root, entry), join(dist, entry), {
    recursive: true,
    filter: (source) => basename(source) !== '.synctest'
  });
}

await writeFile(join(dist, '.nojekyll'), '');
console.log('GitHub Pages static build written to dist/');
