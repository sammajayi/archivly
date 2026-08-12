# Archivly

Mobile-first activity logging app -- log wins, losses, and milestones in
free-form text and get AI-generated summaries. Phase 1 MVP: activity
logging, auth, and the foundation for the stats dashboard.

## Stack

- **Mobile:** React Native (Expo SDK 54) with Expo Router
- **Styling:** NativeWind (Tailwind for React Native)
- **Auth + DB:** Supabase (email/password + Google OAuth, Row Level Security)
- **AI Summaries:** Groq API, called from a Supabase Edge Function (supabase/functions/generate-summary)
- **Language:** TypeScript (strict mode)

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project's URL and anon key (Project
Settings -> Data API in the Supabase dashboard). Google OAuth client IDs
are only needed to test the "Continue with Google" button.

Run [supabase/schema.sql](supabase/schema.sql) in your project's SQL Editor
to create the `logs` and `categories` tables with Row Level Security.

## Run it

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone for the full native
experience (bottom-sheet modal, native date picker), or press `w` to open
it in a browser (`npm run web`) -- useful for quick local iteration without
a simulator installed, though a couple of native-only bits render
differently there.

## Builds & signing (EAS)

Uses EAS Build (continuous native generation) for dev/preview/release. The
native `ios/` and `android/` folders are gitignored and generated on the fly.

```bash
eas login                                   # once, per machine
eas build --platform android --profile development --local  # no emulator? drop --local
eas build --platform android --profile production           # release AAB pre-Play-Store
```

Signed with a keystore that EAS generates and holds on the first build (or
one you upload via `eas credentials`). See "Google OAuth on Android" below
for why the keystore fingerprint matters.

Play Store: enable **Play App Signing** and add the Play signing cert SHA-1
to the same OAuth client, keeping the debug + EAS fingerprints alongside.

Prefer a dev build over Expo Go for anything auth-related:

- `eas build --platform android --profile development`
- install it, then `npx expo start` and press `a`.

### Google OAuth on Android

`EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` must match the SHA-1 of the cert the
running APK/AAB is signed with, or Google rejects the sign-in. Add these to
the **Android** OAuth client in console.cloud.google.com (package name
`xyz.archivly.app`):

- debug keystore SHA-1 for local dev builds:
  `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`
- `eas credentials` keystore SHA-1 for EAS dev/preview/release builds
- Play App Signing SHA-1 when distributing via Google Play

## Project structure

```
app/
├── _layout.tsx        # root layout: fonts, AuthProvider, protected routes
├── (auth)/             # sign-in, sign-up, forgot-password
├── (tabs)/             # Home, Log launcher, Profile
└── log-entry.tsx       # log entry modal
components/ui/          # Button, Card, OutcomePill, TextField
context/AuthContext.tsx # session state + auth actions
lib/                    # supabase client, logs data access, theme tokens
types/database.ts       # typed Supabase schema
supabase/schema.sql     # logs + categories tables, RLS policies
```

## Status

Phase 1 MVP scaffold: auth flow, tab navigation, and log entry are working
end to end against Supabase. Stats dashboard and AI summaries are next.
