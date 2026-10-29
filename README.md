# OLDBIJOU

This Vite/React site is deployed as a static site on GitHub Pages. Shared editable site content is stored in Supabase; the browser never connects to the database directly.

## Shared content and authorization

- `src/services/siteContent.ts` loads the public site-content endpoint on startup and every 30 seconds. Bundled follower/video defaults remain visible while it loads; a failed request is shown in the UI rather than treated as a successful save.
- The admin page signs in with Supabase Auth. Its session is used to authorize writes, but the Edge Function independently verifies the access token and checks the user's ID against the server-side `ADMIN_USER_IDS` allowlist.
- `supabase/functions/site-content/index.ts` permits public `GET`, handles a narrowly scoped public `POST` to record support, and accepts authenticated, validated admin `PUT` writes. It uses `SUPABASE_SERVICE_ROLE_KEY` on the server to access the database. The service-role key must never be copied into frontend variables, GitHub configuration, browser storage, or checked-in files.
- `supabase/migrations/20261029000000_create_site_content.sql` creates the singleton row for follower counts, featured videos, and the shared support count. The later support-counter migrations add atomic increments and remove the former per-IP rate limit. RLS is enabled and no `anon`/`authenticated` table policies or grants permit direct access.
- The public football-support button increments the shared count through the Edge Function without a per-visitor cooldown.

## Required Supabase setup

1. Create a Supabase project that belongs to this site. Do not reuse credentials from another project.
2. Apply both migrations in `supabase/migrations/` in filename order using the Supabase SQL Editor or Supabase CLI linked to this project. Verify that `public.site_content` contains its seeded singleton row.
3. In Supabase Authentication, create an admin user with an email and a strong, unique password. Disable public sign-ups if they are not needed, and configure the site's production URL and local development callback URLs in the Auth URL configuration.
4. Copy that user's Auth UUID from the Supabase dashboard. Configure these **Function secrets in Supabase**, not in this repository or GitHub:
   - `SUPABASE_URL`: this project's URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: this project's service-role secret. Keep it private and rotate it if it has ever been exposed.
   - `ADMIN_USER_IDS`: comma-separated Auth user UUIDs allowed to edit.
   - `ALLOWED_ORIGINS`: comma-separated exact origins, for example the site's `https://<account>.github.io` origin and `http://localhost:3000` for local work. Do not include URL paths or use `*`.
5. Deploy `site-content` to the same Supabase project (Supabase CLI: `supabase functions deploy site-content`). The function's runtime also needs the project's URL and service-role secret. Set/verify them using Supabase Function secrets; never add them as `VITE_` variables.
6. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add only:
   - `VITE_SUPABASE_URL`: the Supabase project URL.
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable/anon client key. This key is public by design; RLS and the Edge Function are the security boundary.
   Do not add a service-role key, admin password, or other private credential to GitHub Actions variables or secrets for this frontend build. The deploy workflow reads only those two public variables. Set `ALLOWED_ORIGINS` to the exact browser origin that serves GitHub Pages.
7. Deploy the site using the `Deploy to GitHub Pages` workflow. Local development uses the same public settings from a local `.env` file based on `.env.example`.

Visitors can increment the shared support count only through the dedicated function action; direct database writes remain blocked. The public counter has no per-visitor rate limit, so repeated clicks are accepted. Administrative count changes still require an allowlisted Supabase Auth user.

## Verify the deployment

1. Open the public site in one browser/session. Confirm follower counts and videos load, and check the browser console/network panel for successful `GET` requests to `/functions/v1/site-content`.
2. Open `https://karim-gouida.github.io/oldbijou/#oldbijonumbers` in a separate browser/session and sign in with the Supabase Auth admin email/password. Save a follower count, edit/add/reorder a video, and test the reset action. A save is reported successful only after the Edge Function confirms persistence.
3. Reload the public browser or wait up to 30 seconds. Verify the edits appear there, then reload the admin session and confirm they remain.
4. Click the public football-support button repeatedly and verify each successful click increases the shared count in a separate session. The endpoint does not impose a per-IP cooldown.
5. Confirm a signed-in non-admin user receives `403` on an admin write, and that direct REST access to `site_content` with only the publishable key is denied. Confirm no service-role key appears in downloaded assets, browser storage, or GitHub Actions variables.

## Local development

Prerequisites: Node.js 22+

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set the public Supabase URL and publishable key for this project. Add `http://localhost:3000` to the Function's `ALLOWED_ORIGINS` secret.
3. Run `npm run dev`, then use `http://localhost:3000/#oldbijonumbers` to open the admin page.
4. Run `npm run lint` and `npm run build` to validate the app.
