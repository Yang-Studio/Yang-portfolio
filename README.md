# Yang Studio Portfolio

Next.js portfolio with separate game-development, app-development, and photography sections.

## Routes

- `/` - collection and language selector
- `/games` - game-development homepage
- `/projects` - game project archive
- `/projects/[slug]` - game project details
- `/apps` - app-development archive
- `/apps/[slug]` - app project details
- `/photography` - redirects to the standalone Film Archive
- `/admin` - consent-based visitor analytics dashboard
- `/privacy` - visitor analytics privacy notice

## Source Structure

```text
src/
  app/                  Next.js routes, layouts, metadata, and API handlers
  components/
    layout/             Shared site chrome and route shells
    providers/          Global React providers
    ui/                 Reusable presentation components
  features/
    landing/            Main collection selector
    games/              Game homepage and custom game case studies
    apps/               App index and app-specific shell
    projects/           Shared project archive and detail presentation
    about/              About-page presentation
  content/
    games/              Game project data and recruiting highlights
    apps/               App project data
    projects/           Shared project types, assets, and translations
public/
  assets/projects/      Production media grouped by project slug
  embedded-apps/        Deployable static applications
  embedded-sites/       Deployable standalone websites
project-sources/
  games/                Original game project material
  design/               Original design project material
  apps/                 Original app source projects
  photography/          Photography website source and original scans
scripts/
  sync-static-sites.mjs Copies canonical static-site code into public/
```

Route files should stay small. UI belongs in `src/features` or `src/components`, while project records belong in `src/content`.

`public/` is the deployment tree. Editable static-site source belongs in `project-sources/`; run `npm run sync:static` after changing YinYang or Film Archive source files. Film Archive's optimized web images remain in `public/embedded-sites/film/media`, while original TIFF scans remain under `project-sources/photography/film-archive/originals`.

Run `npm run optimize:images` when new PNG or JPEG deployment assets are added. The script creates resized WebP files, updates local references, and leaves the original project material under `project-sources/` untouched.

## Add An App

1. Add the project record to `src/content/apps/projects.ts`.
2. Add a route at `src/app/apps/[slug]/page.tsx`.
3. Render `src/features/projects/ProjectDetail.tsx` with `siblings={appProjects}` and `backHref="/apps"`.
4. Put app media under `public/assets/projects/[slug]`.
5. Put a deployable static app under `public/embedded-apps/[slug]`.

The `/apps` archive reads the data array automatically, so new records appear with the same visual system as game projects.

## Development

```bash
npm install
npm run sync:static
npm run dev
```

Production verification:

```bash
npm run security:secrets
npm run lint
npm run build
```

## Admin And Visitor Analytics

The site includes an optional, consent-based analytics backend for Vercel deployments:

- Visitors can accept or decline analytics without losing access to the portfolio.
- Accepted visits store the page, time, device class, referrer host, hashed visitor ID, hashed IP, and coarse IP-derived city/region/country/continent/timezone.
- Raw IP addresses, latitude/longitude, postal codes, names, email addresses, and precise home addresses are not stored.
- Records older than 180 days are deleted automatically.
- `/admin` requires an HttpOnly signed session cookie.
- `/projects/terradotta` is password protected. It reads `TERRADOTTA_PASSWORD` first and falls back to `ADMIN_PASSWORD`.

Setup:

1. In the Vercel project, install the Neon integration and connect a Postgres database. This injects `DATABASE_URL`.
2. Run `npm run admin:credentials` locally.
3. Add the generated `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `ANALYTICS_SALT` values to Vercel.
4. Redeploy the project.
5. Use the admin form on `/` to open `/admin`.

Optional Terra Dotta lock:

- Set `TERRADOTTA_PASSWORD` if the project page should use a separate password.
- Set `TERRADOTTA_LOCK_SECRET` if the project page should use a separate cookie-signing secret.
- If omitted, the page lock reuses `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.

The database table and indexes are created automatically on the first consented visit or dashboard request.

For local development, run:

```bash
npm run admin:credentials:local
```

This preserves existing values in `.env.local` and adds only the username, password, and administrator secrets.
The plaintext password is not written to a separate document. Restart the development server after generating credentials.
When `DATABASE_URL` is absent in development, consented visits are stored in the ignored `.analytics.local.json` file.
Production deployments still require Neon/Postgres.
