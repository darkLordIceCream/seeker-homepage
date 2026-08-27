# AGENTS.md

Agent harness for **Seeker追光者** (seeker-homepage) — the official website of a
photography group ("拍一张照片，交一个朋友"), built with **Astro 7 + React 19 +
Tailwind CSS 4 + TypeScript 6 (strict)**, deployed to **Cloudflare Pages**.

## Project Layout

- `src/pages/` — routes (`index.astro`, `team.astro`,
  `under-construction.astro`); keep pages thin
- `src/components/` — reusable `.astro` components (Navigation, Banner, Footer,
  TeamHero, MemberCard, MemberSocial, ThemeToggle, SEOHead)
- `src/components/ui/` — shadcn/ui components (New York style, zinc base, lucide
  icons); add via shadcn conventions, don't hand-roll equivalents
- `src/layouts/Layout.astro` — root layout; every page must reuse it
- `src/content/` + `src/content.config.ts` — Astro Content Collections
  (currently `members`); site content lives here as Markdown, NOT hardcoded in
  pages
- `src/styles/global.css` — Tailwind 4 CSS-first config + shadcn CSS variables
  (no `tailwind.config.js`)
- `src/assets/` — images processed by `astro:assets`
- `public/` — static files served as-is

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read `DEVELOPMENT_STANDARDS.md`** (coding/deploy rules) and `README-zh.md`
   / `README.md`
4. **Run `./init.sh`** to verify environment is healthy
5. **Read `feature_list.json`** to see current feature state
6. **Review recent commits** with `git log --oneline -5`

If baseline verification is failing, repair that first before adding new scope.

## Working Rules

- **One feature at a time**: Pick exactly one unfinished feature from
  `feature_list.json`
- **Verification required**: Don't claim done without running verification
  commands
- **Update artifacts**: Before ending session, update `progress.md` and
  `feature_list.json`
- **Stay in scope**: Don't modify files unrelated to the current feature
- **Leave clean state**: Next session must be able to run `./init.sh`
  immediately

## Required Artifacts

- `feature_list.json` — Feature state tracker (source of truth)
- `progress.md` — Session continuity log
- `init.sh` — Standard startup and verification path
- `session-handoff.md` — Optional, for larger sessions

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] Required verification actually ran (tests / lint / type-check)
- [ ] Evidence recorded in `feature_list.json` or `progress.md`
- [ ] Repository remains restartable from standard startup path

## End of Session

Before ending a session:

1. Update `progress.md` with current state
2. Update `feature_list.json` with new feature status
3. Record any unresolved risks or blockers
4. Commit with descriptive message once work is in safe state
5. Leave repo clean enough for next session to run `./init.sh` immediately

## Coding Rules

- **Content first**: new content = new Markdown file in `src/content/`, not page
  code edits. Extend the zod schema in `src/content.config.ts` if fields are
  missing.
- **No `any`**; tsconfig extends `astro/tsconfigs/strict` with
  `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` — unused
  vars/params fail type-check.
- **Path aliases**: `@/*`, `@/components/*`, `@/layouts/*`, `@/pages/*`,
  `@/assets/*` → `src/...` (see `tsconfig.json` / `components.json`).
- **Images**: always use Astro `<Image />` from `astro:assets` with `alt`,
  `width`/`height`, `loading="lazy"`; never a raw `<img>`.
- **Performance**: prefer zero-JS static `.astro`; interactive React components
  need a client directive, in order `client:visible` > `client:idle` >
  `client:load` (avoid `client:load`).
- **SEO/a11y**: every page gets `SEOHead` metadata; keep semantic HTML, alt
  text, heading hierarchy, keyboard navigation.
- **Dark mode**: theme via shadcn CSS variables in `global.css` + `ThemeToggle`
  (localStorage); don't hardcode light-only colors.
- **Commits**: Conventional Commits + gitmoji via `pnpm commit` (e.g.
  `✨ feat: ...`); commitlint + husky enforce on commit/push, header ≤ 100
  chars. Branches: `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`, PRs
  into `main`.

## Verification Commands

```bash
# Full verification (recommended)
./init.sh
```

Required checks:

- `pnpm install`
- `pnpm run type-check` (runs `astro check && tsc --noEmit`)
- `pnpm run lint` (ESLint; warnings OK, errors not)
- `pnpm run build`

Others: `pnpm dev` (dev server on 0.0.0.0:4321), `pnpm preview`, `pnpm format`,
`pnpm format:check`.

## Deployment Gotchas

- Deploy target is **Cloudflare Pages** (GitHub integration, push to `main`
  auto-deploys; domains: seeker-homepage.pages.dev and a .club custom domain).
- **Single files > 25 MiB break the build/deploy** — large videos/images must go
  to Cloudflare R2 bucket `seeker-homepage-assets`
  (`https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev/...`), referenced by
  absolute URL in code. Upload with `wrangler r2 object put`.
- Requires Node 22.12.0+ (`.nvmrc`) and pnpm; don't switch package managers.

## Escalation

If you encounter:

- **Architecture / styling decisions**: consult `DEVELOPMENT_STANDARDS.md`
  first, otherwise ask user
- **Unclear requirements**: check `README-zh.md` / `README.md`, otherwise ask
  user
- **Repeated test failures**: Update progress, flag for human review
- **Scope ambiguity**: Re-read `feature_list.json` for definition of done (next
  unfinished features: feat-016 作品展示画廊, feat-017 小组简介,
  feat-018 小组活动, feat-019 加入小组入口)
