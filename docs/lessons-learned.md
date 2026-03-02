# Lessons Learned — AI Portfolio

Architecture decisions, patterns, and trade-offs discovered during development.

---

## Server/Client Component Split

**Decision:** Pages are server components that load data via `loader.ts` (uses `fs`). Interactive components (`PortfolioGrid`, `CategoryFilter`, `SortSelect`) use `"use client"`.

**Why:** Next.js 15 App Router requires this separation for static generation. Server components can read the filesystem at build time; client components handle interactivity. Mixing the two causes build failures.

**Key rule:** Never add `"use client"` to a page component — it breaks `generateStaticParams` and static generation.

---

## URL-Driven Filter State + Suspense Boundary

**Decision:** Category and sort selections stored in URL search params (`?category=X&sort=Y`) instead of React state.

**Why:** Makes filtered views shareable and bookmarkable. Users can link directly to a filtered view.

**Gotcha:** `useSearchParams()` in Next.js 15 requires a `<Suspense>` boundary wrapping the component that calls it. Without it, static generation fails silently or throws during build. This boundary must NOT be removed.

---

## Static JSON Pipeline vs CMS vs Runtime API

**Decision:** GitHub API fetched at sync time → validated through Zod → output as static JSON → consumed at build time.

**Why:**
- **vs CMS:** No vendor lock-in, no monthly cost, content lives alongside code
- **vs Runtime API:** No rate limits, no latency, no single point of failure
- **Trade-off:** Requires a manual sync step before deploy. Acceptable because portfolio updates are infrequent.

The pipeline: `PORTFOLIO.md` (in repos) → `sync-portfolio.ts` → `content/portfolio.json` → `loader.ts` → components

---

## Zod Schema Transforms for Backward Compatibility

**Decision:** The Zod schema in `schema.ts` accepts both old and new PORTFOLIO.md field names and transforms them to a canonical format during validation.

**Why:** As the PORTFOLIO.md format evolved, older repos still had the original field names. Rather than requiring all repos to update simultaneously, the schema handles both formats. This lets content migration happen gradually.

---

## Middleware Locale Routing (Rewrite vs Redirect)

**Decision:** Middleware rewrites `/` to `/en/` (no visible URL change) for English, while `/es/` stays visible for Spanish.

**Why:** English is the default locale and shouldn't show a prefix in the URL. Spanish needs the prefix for language identification. Using rewrites (not redirects) preserves clean URLs without causing redirect chains that hurt SEO.

---

## Image Domain Security + resolveAssetUrl Pattern

**Decision:** `next.config.ts` restricts remote images to GitHub-hosted domains (`raw.githubusercontent.com`, `avatars.githubusercontent.com`, `user-images.githubusercontent.com`).

**Why:** Prevents arbitrary remote image injection. All project images either live in GitHub repos (resolved through the domain allowlist) or in this app's own `public/` directory (served as local assets).

**resolveAssetUrl pattern:**
1. Absolute URLs (`https://...`) pass through as-is
2. Self-repo paths stay relative (served from this app's `public/`)
3. Other repos: resolve against `live_url`/`demo_url`, or fall back to `raw.githubusercontent.com`

---

## WebP Migration: Local vs Remote Images

**Decision:** Converted all 12 local images (10 PNGs, 2 JPGs) to WebP at quality 80. Remote images in other repos stay in their original format.

**Why:** Local images are under our control and served from `public/images/`. Converting to WebP reduced total image payload from 9.3MB to 0.7MB (93% reduction). Remote images are hosted by their respective deployments and would need to be converted in those repos separately.

**References updated:** `PORTFOLIO.md`, `content/project-overrides.json`, `content/portfolio.json`, `README.md`.

---

## SEO Implementation Patterns

### Sitemap (`src/app/sitemap.ts`)
Next.js 15 supports a `sitemap.ts` export that generates `/sitemap.xml` at build time. The function imports the data loader and generates entries for all static pages and dynamic project pages, including `hreflang` alternates for EN/ES.

### Robots (`src/app/robots.ts`)
Simple `robots.ts` export — allows all crawlers and points to the sitemap URL.

### JSON-LD Component
A reusable `JsonLd` server component renders `<script type="application/ld+json">`. Used for:
- **Organization schema** — in the locale layout (site-wide)
- **BreadcrumbList** — on project detail pages (Home → Portfolio → Project)
- **SoftwareApplication / CreativeWork** — on project detail pages, type chosen by category

### Canonical URL Strategy
English canonical URLs omit the `/en/` prefix (middleware hides it). Spanish URLs use the `/es/` prefix. Every page exports `alternates.canonical` in its `generateMetadata`.

### Theme Color
Uses Next.js 15's `viewport` export (not `metadata`) with media-query-aware `themeColor` for light (`#ffffff`) and dark (`#0a0a0a`).

---

## i18n Architecture

**Decision:** File-based routing with `[locale]` dynamic segment. Translations are static TypeScript objects (not JSON files loaded at runtime).

**Why:** Keeps the entire site statically generated. No runtime translation loading, no hydration mismatches. Two locales (EN/ES) are manageable as static objects.

**Pattern:** `isValidLocale()` guard at the top of every page, with fallback to `'en'`.
