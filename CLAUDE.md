# CLAUDE.md — AI Portfolio

## Project Overview

A Next.js 15 portfolio application that aggregates project data from GitHub repositories and displays them in a filterable, statically-generated showcase at cushlabs.ai. Each repo contains a `PORTFOLIO.md` with YAML frontmatter; a sync script fetches, validates, and outputs static JSON consumed at build time.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Zod (schema validation)
- next-themes (dark mode)
- Embla Carousel (image carousels)
- pnpm (package manager)
- Vercel (deployment)

## Project Structure

```
ai-portfolio/
├── content/
│   ├── portfolio.json           # Generated data — never edit manually
│   └── portfolio-order.json     # Display order & featured overrides
├── scripts/
│   ├── sync-portfolio.ts        # GitHub → JSON sync (main)
│   ├── sync-local.ts            # Local file sync (dev preview)
│   ├── sync-images.ts           # Image discovery from repos
│   └── generate-portfolio.ts    # PORTFOLIO.md generator for repos
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   ├── page.tsx             # Home page (CTA → portfolio)
│   │   └── portfolio/
│   │       ├── page.tsx         # Grid view with filters
│   │       └── [slug]/page.tsx  # Dynamic detail page
│   ├── components/
│   │   ├── portfolio/           # PortfolioGrid, PortfolioCard, PortfolioDetail, etc.
│   │   └── ui/                  # shadcn/ui — regenerate via CLI, don't edit
│   └── lib/
│       └── portfolio/
│           ├── loader.ts        # Server-only data loading (uses fs)
│           ├── schema.ts        # Zod schema with backward-compat transforms
│           ├── types.ts         # TypeScript interfaces (source of truth)
│           └── filters.ts       # Client-safe pure filter/sort functions
├── docs/                        # Architecture docs & reference material
└── portfolio-files/             # Published PORTFOLIO.md files (local)
```

## Development Commands

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Sync portfolio data from GitHub
pnpm sync

# Sync from local files (dev preview)
pnpm sync:local

# Generate PORTFOLIO.md for repos
pnpm generate
```

## Key Patterns & Conventions

### Server/Client Component Split
- **Pages are server components** — load data via `loader.ts` (uses `fs`, server-only)
- **Interactive components use `"use client"`** — PortfolioGrid, CategoryFilter, SortSelect
- **`filters.ts` is client-safe** — pure functions only, no `fs` or server imports
- **Never add `"use client"` to page components** — breaks static generation

### URL-Driven Filter State
- Category and sort stored in URL search params (`?category=X&sort=Y`)
- `useSearchParams()` requires a `<Suspense>` boundary in Next.js 15 — do NOT remove it
- Params cleared when set to defaults ('all', 'priority') for clean URLs

### Data Pipeline
- `PORTFOLIO.md` (in repos) → `sync-portfolio.ts` → `content/portfolio.json` → `loader.ts` → components
- Zod schema accepts both old and new field names with automatic transforms
- `portfolio-order.json` overrides display priority and featured flags
- Never edit `portfolio.json` manually — it gets overwritten by sync

### shadcn/ui
- Components live in `src/components/ui/` — regenerate via `pnpm dlx shadcn@latest add [name]`
- Create wrapper components instead of editing generated files

### Naming Conventions
- Components: PascalCase (`PortfolioCard.tsx`)
- Utilities: camelCase (`filterProjects`)
- Types/Interfaces: PascalCase (`PortfolioProject`)
- File names (pages): kebab-case (`[slug]/page.tsx`)

## Environment Setup

Required for sync scripts only (not for local dev):

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Personal access token with `public_repo` scope |
| `NEXT_PUBLIC_SITE_URL` | Base URL for OG images (optional) |

Copy `.env.example` to `.env` and fill in values.

## Deployment

Deploys to Vercel via git push. The sync script runs locally before deploy:

```powershell
pnpm sync
git add content/portfolio.json
git commit -m "Sync portfolio data"
git push    # Triggers Vercel auto-deploy
```

## Known Issues

- Sync script requires `GITHUB_TOKEN` — fails silently if missing
- Some older repos use legacy PORTFOLIO.md format (handled by schema transforms)
- No automated CI sync — manual step before deploy

## Current Focus

- Portfolio content quality — filling in PORTFOLIO.md files across repos
- Image pipeline — sourcing thumbnails and hero images for projects
- SEO optimization — OG images, structured data
