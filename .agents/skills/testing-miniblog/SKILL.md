---
name: testing-miniblog
description: Test the miniBlogComIA React+Firebase app end-to-end through the UI. Use when verifying changes to posts, auth, slug generation, date formatting, firebase config, or any code path that runs in the browser against the real Firebase project.
---

# Testing miniBlogComIA end-to-end

A pragmatic checklist for testing this app via the UI against the real Firebase project.

## Quick facts

- **Dev server**: `npm run dev` → serves on `http://localhost:3000` (NOT the Vite default 5173 — see `vite.config.*`).
- **Backend**: real Firebase project (Auth + Firestore). No emulator setup is wired in by default.
- **Env file**: `.env.local` at repo root holds `VITE_FIREBASE_*` keys. If it's missing or has placeholder values, the app boots but every Firestore call fails silently with an opaque error. Verify Home page loads real posts before assuming the rest works.
- **Lint**: `npm run lint` (ESLint with `--max-warnings 0`).
- **Tests**: `npm test -- --run` (vitest, 25 files / 181 tests as of phase 3).
- **Build**: `npm run build` (runs `tsc && vite build`). After any TS migration PR, always run this — `tsc` catches type errors that `vite dev` skips.

## Static checks first

Before doing any UI testing, gate on these:

```bash
cd ~/repos/miniBlogComIA
npm run lint
npm test -- --run
npm run build
```

All three should pass. If `npm run build` fails but `npm test` passes, suspect a TS-only error that vitest didn't catch.

## Routes that matter

| Route | Auth required | Purpose |
|---|---|---|
| `/` | public | Home — lists posts via `usePosts` (Firestore `onSnapshot`). Exercises `firebase.ts` + `formatRelativeDate`. |
| `/posts/:slug` | public | PostDetail — fetches by slug via `postService.getPostBySlug`. Exercises slug round-trip + `formatDate` (long form). |
| `/login` | public | Email/password or Google login. |
| `/registro` | public | Registration form. Use a fresh email each session to avoid "email already in use" errors. |
| `/criar-post` | yes | CreatePost — exercises `generateSlug`. |
| `/admin/posts/edit/:id` | yes (author or admin) | EditPost — exercises `generateSlug` on title changes. |
| `/dashboard` | yes | User dashboard. |
| `/admin` | admin only | Admin panel. |

## Auth strategy for testing

- **Don't share creds across sessions** — register a fresh email each time (e.g. `devin+<purpose>+<unix-ts>@example.com`). Avoids state pollution and "already in use" errors.
- Password must be ≥ 6 chars (client-side validation in `Register.jsx`).
- Google login requires a popup → not reliably automatable from a headless context. Stick to email/password for automated testing.
- After registration the user is auto-logged-in and redirected to Home (or `from` state). Look for navbar showing `Olá, <Name>` and `Sair` button as confirmation.

## Asserting on the migrated utils

### generateSlug

Trace from `src/utils/generateSlug.ts`: NFD-strip accents → lowercase → keep only `[a-z0-9\s-]` → trim → spaces→`-` → dedupe `-`.

Good adversarial titles for testing:
- `Teste TS Fase 3: É possível? <ts>` → `teste-ts-fase-3-e-possivel-<ts>` (accents, punctuation, numbers).
- `React.js & Node.js: O Guia Completo!` → `reactjs-nodejs-o-guia-completo`.

Collision path: submit the same title twice → second URL gets `-1` suffix (counter increments up to 100, then errors).

### formatDate / formatRelativeDate

Both are in `src/utils/formatDate.ts` and consume Firestore `Timestamp`-shaped objects (`{seconds, nanoseconds}`).

- **PostCard (Home)** uses `formatRelativeDate` → pt-BR relative format: `agora há pouco`, `há N minutos/horas/dias/meses/anos`. Regex: `/^(agora há pouco|há \d+ (minutos?|horas?|dias?|m[êe]s|meses|anos?))$/`.
- **PostDetail** uses `formatDate` → pt-BR long form: `DD de mês de AAAA` (e.g. `12 de maio de 2026`).
- Falsy/missing timestamp → `Data não disponível`. Seeing this string means the document field is missing or the format function regressed.

## Recording tips

- Maximize the browser before starting: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.
- Use `annotate_recording` for each test (`test_start` + `assertion`). The structured annotations make the recording navigable.
- For slug tests, capture the **URL bar** in the screenshot — that's the actual evidence, not the page body.

## Common gotchas

- **CORS / network errors on Firestore** → usually missing/invalid `VITE_FIREBASE_*` env vars in `.env.local`. The app won't show a clear error; it just stays on the loading state or shows a generic error banner.
- **Vite port** is 3000, not 5173 — easy to assume wrong.
- **`Security Scan` CI check is optional and flaky-by-design** — it fails whenever any transitive dep has a moderate+ vulnerability. Confirm a PR didn't touch `package.json` / `package-lock.json` before dismissing.
- **Branch protection**: PRs must target `develop`, not `main`. Per `.windsurf/workflows/github-flow.md`.

## Devin Secrets Needed

None strictly required — `.env.local` is checked in for this project (Firebase web API keys are public-by-design and protected by Firestore security rules). If you ever need write access to admin areas, register an account and ask the user to flip its `role` to `admin` in Firestore.
