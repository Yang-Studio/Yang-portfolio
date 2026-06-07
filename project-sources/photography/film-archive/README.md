# Film Archive Source

```text
film-archive/
  site/                 Editable HTML, CSS, JavaScript, and catalogue data
  originals/
    Building/           Original TIFF scans classified as architecture
    Landscape/          Original TIFF scans classified as landscape
    Portrait/           Original TIFF scans classified as portraiture
    Street/             Original TIFF scans classified as street photography
```

The deployable site lives at `public/embedded-sites/film`. Its `media/` directory contains optimized JPG files and thumbnails and is intentionally not duplicated here.

After editing files in `site/`, run this command from the repository root:

```bash
npm run sync:static
```
