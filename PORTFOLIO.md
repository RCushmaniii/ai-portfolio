---
# =============================================================================
# PORTFOLIO.md — AI Portfolio
# =============================================================================
portfolio_enabled: true
portfolio_priority: 4
portfolio_featured: false
portfolio_last_reviewed: "2026-03-01"

title: "AI Portfolio"
tagline: "A static portfolio system that syncs project data from GitHub repos into a filterable showcase"
slug: "ai-portfolio"

category: "Developer Tools"
target_audience: "Technical founders and engineering managers evaluating consulting work"
tags:
  - "portfolio"
  - "next-js"
  - "typescript"
  - "github-api"
  - "static-site"
  - "tailwind"
  - "shadcn-ui"

thumbnail: "/images/portfolio-card.webp"
slides:
  - src: "/images/portfolio-01.webp"
    alt_en: "Portfolio homepage with featured projects section"
    alt_es: "Pagina principal del portafolio con seccion de proyectos destacados"
  - src: "/images/portfolio-02.webp"
    alt_en: "Portfolio grid with category filtering"
    alt_es: "Cuadricula del portafolio con filtrado por categoria"
  - src: "/images/portfolio-03.webp"
    alt_en: "Portfolio grid in dark mode"
    alt_es: "Cuadricula del portafolio en modo oscuro"
  - src: "/images/portfolio-04.webp"
    alt_en: "Project detail page with image carousel"
    alt_es: "Pagina de detalle del proyecto con carrusel de imagenes"
  - src: "/images/portfolio-05.webp"
    alt_en: "Project detail page — problem and solution sections"
    alt_es: "Pagina de detalle — secciones de problema y solucion"
  - src: "/images/portfolio-06.webp"
    alt_en: "Project detail page — key features and metrics"
    alt_es: "Pagina de detalle — caracteristicas principales y metricas"
  - src: "/images/portfolio-07.webp"
    alt_en: "Project detail page with tech stack sidebar"
    alt_es: "Pagina de detalle con barra lateral de tecnologias"
  - src: "/images/portfolio-08.webp"
    alt_en: "Featured projects showcase page"
    alt_es: "Pagina de vitrina de proyectos destacados"
  - src: "/images/portfolio-09.webp"
    alt_en: "Mobile responsive portfolio grid"
    alt_es: "Cuadricula responsiva del portafolio en movil"
  - src: "/images/portfolio-10.webp"
    alt_en: "Spanish language version of the portfolio"
    alt_es: "Version en espanol del portafolio"
video_url: "/video/portfolio-brief.mp4"
video_poster: "/images/portfolio-brief-poster.webp"

live_url: "https://ai-portfolio-cushlabs.vercel.app"
demo_url: "https://ai-portfolio-cushlabs.vercel.app/"
case_study_url: ""

problem_solved: |
  Maintaining a portfolio across dozens of GitHub repositories creates a content
  management problem. Project descriptions, tech stacks, and status information
  scatter across READMEs and repo settings with no unified display layer. A
  separate portfolio site inevitably falls out of sync with the actual work.

key_outcomes:
  - "15+ projects aggregated from GitHub repos into a single filterable interface"
  - "Zero runtime API calls — fully static, sub-second page loads"
  - "Content managed through PORTFOLIO.md files co-located with source code"
  - "Featured project highlighting and priority ordering without code changes"
  - "Dark mode with system preference detection"

tech_stack:
  - "Next.js 15"
  - "React 19"
  - "TypeScript"
  - "Tailwind CSS"
  - "shadcn/ui"
  - "Zod"
  - "GitHub API"
  - "Vercel"

complexity: "Production"
---

## Overview

AI Portfolio is a Next.js application that powers the project showcase at cushlabs.ai. Each GitHub repository contains a `PORTFOLIO.md` file with structured YAML frontmatter describing the project. A sync script fetches these files via the GitHub API, validates them through a Zod schema, enriches entries with live metadata (stars, forks, language, topics), and generates a static JSON file consumed at build time.

The result is a portfolio site with zero runtime dependencies on external APIs. Content updates follow a straightforward workflow: edit a `PORTFOLIO.md` in any repo, run the sync, and deploy.

## The Challenge

- **Scattered content:** Project descriptions live in READMEs, repo settings, and personal notes with no single source of truth for portfolio display
- **Manual sync burden:** Keeping a portfolio site current with 20+ active repositories requires constant manual updates that inevitably fall behind
- **Runtime fragility:** Fetching GitHub API data at page load introduces rate limits, latency, and single points of failure for a site that should always work

## The Solution

**Content co-location:** Each repository owns its portfolio entry through a PORTFOLIO.md file at its root. The content lives alongside the code it describes and stays version-controlled.

**Automated data pipeline:** A TypeScript sync script queries GitHub for all repositories, fetches and parses each PORTFOLIO.md, validates data through a Zod schema with backward-compatible transforms, and outputs a single JSON file.

**Static rendering:** Next.js App Router serves statically-generated pages. Server components load the JSON at build time while client components handle interactive filtering and sorting through URL search parameters.

## Technical Highlights

- **Zod schema with backward-compatible transforms:** Normalizes old and new PORTFOLIO.md formats automatically during sync
- **Server/client component split:** `loader.ts` reads data server-side via `fs`; `filters.ts` provides pure functions safe for client components
- **URL-driven filter state:** Category and sort selections stored in search params for shareable, bookmarkable views
- **Order override config:** `portfolio-order.json` controls display priority and featured badges without touching code
- **Image domain security:** `next.config.ts` restricts remote images to GitHub-hosted domains only
- **Suspense boundary for useSearchParams:** Required by Next.js 15 for static generation with client-side URL state

## Results

**For the End User:**
- Professional portfolio browsable by category with instant client-side filtering
- Responsive detail pages with image carousels, tech stack display, and markdown rendering
- Fast page loads with no spinner or loading state for initial content

**Technical Demonstration:**
- End-to-end TypeScript with strict mode and Zod validation at the data boundary
- Clean separation of build-time data loading and runtime interactivity
- Pragmatic architecture that avoids unnecessary complexity — no CMS, no database, no serverless functions
