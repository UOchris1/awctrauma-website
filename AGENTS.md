# Agent Notes

## Production Rules

- Vercel deploys from `main`. Permanent static assets must be committed under `public/`.
- Do not rely on writing to `public/` from an API route in production; serverless filesystem changes are not durable.
- Admin-uploaded algorithm images should use Supabase Storage. The site allows Supabase Storage images through `next.config.js`.
- For a hand-curated algorithm image that should be stable across deploys, put it in `public/flowcharts/v2/`, commit it, and update the `algorithms.image_url` row to a same-origin path such as `/flowcharts/v2/name.png`.

## Admin/API Safety

- Any API route that mutates files, algorithms, handouts, or storage must check the `admin-auth` cookie before doing work.
- `/api/admin/*` is protected in middleware, but route-level checks should stay in place for mutating endpoints.
- Public read routes are `/api/files`, `/api/files/[id]`, `/api/algorithms`, and `/api/algorithms/[id]`.

## Database Notes

- The production `algorithms` table currently has `card_color` but may not have `html_url`.
- Before relying on interactive HTML flowcharts, run `supabase/migrations/20260326_add_html_url.sql` in Supabase.
- Keep migrations and TypeScript types aligned. If a route writes a new column, confirm the production schema has that column first.

## Verification

- Run `npm run type-check` and `npm run build` before pushing.
- For image changes, verify both the API value and the UI:
  - `https://www.awctrauma.org/api/algorithms`
  - homepage algorithm card click/lightbox rendering in Chrome.
