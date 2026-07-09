# Application Review — Onono Landing Page

**Date:** 2026-07-07
**Scope:** Full app surface — Next.js frontend (layout, all 4 pages, every custom component, api client, i18n) and FastAPI backend (auth, messages, db, main). Type check (`npx tsc --noEmit`) passes clean.

**Verdict:** The app-specific code is in good shape — the backend auth/messages design is correct and appropriately minimal — but the repo is carrying a lot of dead weight, plus a handful of small real bugs.

## The big one: ~35 unused dependencies and 49 unused components

Nothing in the app imports from `src/components/ui/` — the only references are the ui files importing each other. That whole shadcn boilerplate drags in dependencies never used: all ~28 `@radix-ui/*` packages, `recharts`, `react-hook-form`, `zod`, `@hookform/resolvers`, `embla-carousel-react`, `cmdk`, `date-fns`, `react-day-picker`, `vaul`, `sonner`, `input-otp`, `react-resizable-panels`, `class-variance-authority`. Also dead:

- `src/components/TeamSection.tsx` (376 lines) — never imported, and it's the **only** user of `framer-motion`
- `src/App.css` — never imported (Vite leftover)
- `src/hooks/` (`use-mobile`, `use-toast`) — only used by the unused ui components
- `dist/` — a stale Vite build sitting on disk (untracked, safe to delete)
- `public/novobackground.png` — untracked and referenced nowhere; the hero uses `hero-poster.jpg`

Deleting `src/components/ui/`, `src/hooks/`, `TeamSection.tsx`, `App.css`, `components.json`, `dist/` and pruning those deps would shrink installs/CI dramatically with zero behavior change.

## Real bugs (small, worth fixing)

1. **Silent failures on two async actions.** `src/app/admin/page.tsx:57` — `markRead` has no catch; if the token expired, clicking "mark read" does nothing with no feedback. Same in `src/components/GoogleButton.tsx:32`: a failed `/auth/google` call is an unhandled rejection, user sees nothing.
2. **Placeholder maps link.** `src/components/ContactSection.tsx:110` points to `https://maps.google.com` generically, not the Rua Eduardo Mondlane address. Also, those cards use `window.open` on a `mailto:`, which opens a blank tab in several browsers — a plain `<a href>` is the right tool.
3. **`lang="en"` but the site defaults to Portuguese.** `src/app/layout.tsx:36` hardcodes English, and the meta description is English too, while `i18n.ts` defaults to `pt`. Hurts SEO/accessibility for the primary audience.
4. **Untranslated "Other".** `src/components/ContactSection.tsx:128` hardcodes English `"Other"` in the service dropdown even in PT mode.
5. **`getUser()` can crash.** `src/lib/api.ts:14` — `JSON.parse` on corrupted localStorage throws and takes the page down; wrap in try/catch returning null.
6. **ErrorBoundary leaks stack traces.** `src/components/ErrorBoundary.tsx:30` renders `error.stack` to visitors in production; show a friendly message instead (also: typo `searilizeError`).

## Backend — solid, two notes

The security model is right where it matters: message listing/marking is enforced server-side via `require_admin`, passwords are bcrypt'd, Google tokens verified server-side, JWT secret is required (crashes without it — good). Two minor gaps:

- **Register race** (`backend/app/auth.py:96`): check-then-insert means a duplicate email under concurrency hits the DB unique constraint and returns a 500 instead of 409. Catch `IntegrityError` on commit.
- **No rate limiting on `POST /messages`** — the public contact endpoint will accept unlimited bot spam. A simple per-IP limit (e.g. `slowapi`) or a honeypot field is enough for a landing page.

The client-side admin gate (localStorage role check) is cosmetic-only, but that's fine since the API enforces it for real. JWT-in-localStorage is XSS-exposed, but acceptable at this scale.

## What's good

The GSAP work is careful (reduced-motion handled everywhere, `immediateRender` pitfall documented, ScrollTrigger cleanup via `useGSAP` scope), `ParticleCanvas.tsx` disposes everything properly and pauses offscreen, the SSR-safe i18n hydration strategy is correct and well-commented, and the Pydantic validation on messages has sensible bounds.
