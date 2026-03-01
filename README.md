# AI Portfolio

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)

> A static portfolio system that aggregates project data from GitHub repositories and renders a professional, filterable showcase.

## Overview

AI Portfolio is a Next.js application that powers the project showcase at [cushlabs.ai](https://cushlabs.ai). Rather than maintaining portfolio content in a CMS or database, each GitHub repository contains a `PORTFOLIO.md` file with structured YAML frontmatter. A sync script fetches these files, validates them with Zod, enriches the data with GitHub API metadata (stars, forks, language, topics), and generates a static JSON file consumed at build time.

The result is a fast, reliable portfolio site with zero runtime API dependencies. Content updates happen through a simple workflow: edit `PORTFOLIO.md` in any repo, run the sync script, and deploy.

The interface supports category filtering, multiple sort options, dark mode, and responsive project detail pages with image carousels and markdown rendering.

## The Challenge

Maintaining a portfolio across dozens of GitHub repositories creates a content management problem. Project descriptions, tech stacks, screenshots, and status information live in different places — some in READMEs, some in repo descriptions, some nowhere. Keeping a separate portfolio site in sync with evolving projects requires manual updates that inevitably fall behind.

The goal was a system where portfolio content lives alongside the code it describes, stays version-controlled, and feeds automatically into a professional display layer.

## The Solution

Each repository owns its own portfolio entry through a `PORTFOLIO.md` file at the repo root. This file contains structured YAML frontmatter (title, category, tech stack, problem/solution, metrics) plus optional markdown prose for detailed writeups.

A TypeScript sync script orchestrates the data pipeline: it queries the GitHub API for all repositories, fetches and parses each `PORTFOLIO.md`, validates the data through a Zod schema with backward-compatible transforms, enriches entries with live GitHub metadata, and outputs a single `portfolio.json` consumed at build time.

On the display side, Next.js App Router serves statically-generated pages. A server component loads the JSON at build time, while client components handle interactive filtering and sorting through URL search parameters — making filter state shareable and bookmarkable.

## Technical Highlights

- **Static JSON pipeline**: Sync scripts fetch from GitHub API at development time, avoiding runtime API calls, rate limits, and latency
- **Zod schema with transforms**: Backward-compatible validation normalizes old and new PORTFOLIO.md field formats automatically
- **Server/client component split**: Pages load data server-side via `fs`; filtering runs client-side via pure functions in `filters.ts`
- **URL-driven state**: Category and sort selections stored in search params for shareable, bookmarkable filtered views
- **Order override system**: A `portfolio-order.json` config controls display priority and featured badges without code changes
- **Dark mode**: System-preference-aware theme switching via `next-themes`
- **Image security**: `next.config.ts` restricts remote images to GitHub-hosted domains only
- **shadcn/ui components**: Accessible, Tailwind-native UI components with consistent design tokens

## Getting Started

### Prerequisites

- Node.js >= 20 LTS
- pnpm (package manager)
- GitHub Personal Access Token with `public_repo` scope

### Installation

```powershell
git clone https://github.com/RCushmaniii/ai-portfolio.git
cd ai-portfolio
pnpm install
```

### Environment Variables

Copy the example file and add your GitHub token:

```powershell
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes (sync only) | Personal access token for GitHub API |
| `NEXT_PUBLIC_SITE_URL` | No | Base URL for OG images |

### Running Locally

```powershell
# Sync portfolio data from GitHub
pnpm sync

# Start development server
pnpm dev
```

The site runs at `http://localhost:3000`. The portfolio grid is at `/portfolio`.

### Building for Production

```powershell
pnpm build
pnpm start
```

## Project Structure

```
ai-portfolio/
├── content/
│   ├── portfolio.json           # Generated data (never edit manually)
│   └── portfolio-order.json     # Display order & featured overrides
├── scripts/
│   ├── sync-portfolio.ts        # GitHub → JSON sync (main)
│   ├── sync-local.ts            # Local file sync (dev)
│   ├── sync-images.ts           # Image discovery
│   └── generate-portfolio.ts    # PORTFOLIO.md generator
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home page
│   │   └── portfolio/
│   │       ├── page.tsx         # Portfolio grid
│   │       └── [slug]/page.tsx  # Project detail
│   ├── components/
│   │   ├── portfolio/           # Portfolio-specific components
│   │   └── ui/                  # shadcn/ui (generated)
│   └── lib/
│       └── portfolio/
│           ├── loader.ts        # Server-side data loading
│           ├── schema.ts        # Zod validation & transforms
│           ├── types.ts         # TypeScript interfaces
│           └── filters.ts       # Client-safe filter functions
└── docs/                        # Architecture & reference docs
```

## Deployment

The project deploys to Vercel with a git-push workflow:

```powershell
# Full deploy flow
pnpm sync                              # Update portfolio.json from GitHub
git add content/portfolio.json
git commit -m "Sync portfolio data"
git push                                # Triggers Vercel auto-deploy
```

The sync script runs locally (or in CI) before deployment. The build itself requires no API access — it reads the pre-synced JSON.

## Results

**Portfolio System:**
- 15+ active projects displayed across 7 categories
- Content managed entirely through PORTFOLIO.md files in source repositories
- Zero runtime API calls — fully static, sub-second page loads
- Featured project highlighting and priority-based ordering without code changes

**Technical Demonstration:**
- End-to-end TypeScript with strict mode and Zod validation at the data boundary
- Clean server/client component architecture in Next.js 15 App Router
- URL-driven filter state for shareable, bookmarkable views
- Backward-compatible schema transforms for evolving data formats

## Contact

**Robert Cushman**
Business Solution Architect & Full-Stack Developer
Guadalajara, Mexico

📧 info@cushlabs.ai
🔗 [GitHub](https://github.com/RCushmaniii) • [LinkedIn](https://linkedin.com/in/robertcushman) • [Portfolio](https://cushlabs.ai)

## License

© 2026 Robert Cushman. All rights reserved.

---

*Last Updated: 2026-03-01*
