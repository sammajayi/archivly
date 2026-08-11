# archivly-web

Marketing site for Archivly. Coming-soon page ships first; the full landing
page is built and previewable now, flipped on post-launch.

## Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, same design tokens as archivly-app
- **Waitlist:** Supabase (`waitlist` table, insert-only RLS) + Resend for the confirmation email
- **Analytics:** [Plausible](https://plausible.io) -- chosen over PostHog for this project because it's a single
  script tag with no client SDK, no cookie banner needed, and nothing to instrument beyond pageviews for a
  pre-launch marketing site. Revisit PostHog later if the app side wants funnels/feature flags/session replay.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` -- same Supabase project as archivly-app.
  Run [supabase/schema.sql](supabase/schema.sql) in the SQL Editor to create the `waitlist` table.
- `RESEND_API_KEY` / `RESEND_FROM_EMAIL` -- from [resend.com](https://resend.com). Leave the key unset locally
  and the confirmation email step is skipped with a console warning instead of failing the signup.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` -- the domain registered in your Plausible project. Leave unset to disable analytics.
- `NEXT_PUBLIC_PLAY_STORE_URL` -- placeholder until the app has a real Play Store listing.
- `NEXT_PUBLIC_LAUNCH_DATE` -- ISO date the coming-soon countdown counts down to.
- `NEXT_PUBLIC_SHOW_FULL_LANDING` -- `"true"` serves the full marketing page at `/` instead of coming-soon.

## Run it

```bash
npm run dev
```

- `/` -- coming-soon page (or the full landing page if `NEXT_PUBLIC_SHOW_FULL_LANDING=true`)
- `/full` -- full landing page, always viewable regardless of the flag above, for internal preview
- `/privacy` -- placeholder privacy policy, flagged as needing real legal copy

## Deploy

Target is Vercel -- connect the repo, set the root directory to `archivly-web`, and add the env vars above in
the Vercel project settings.
