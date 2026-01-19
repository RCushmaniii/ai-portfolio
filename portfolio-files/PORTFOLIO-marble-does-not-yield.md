# PORTFOLIO

**File:** `docs/PORTFOLIO.MD`  
**Purpose:** Portfolio piece explaining project context, technical decisions, and consulting relevance

### Contract:

### - The parser reads ONLY the YAML block between BEGIN/END.

### - ALL keys in the YAML block are REQUIRED (no omissions).

### - Keep copy concise. This file is for client acquisition.

--- # PORTFOLIO_YAML_BEGIN

# === VISIBILITY & ORDER ===

portfolio_enabled: true
portfolio_priority: 3 # 1-10 (1 shows first)
portfolio_featured: true
portfolio_last_reviewed: "2026-01-05" # YYYY-MM-DD

# === IDENTITY (CARD) ===

title: "The Marble Does Not Yield" # Max 80 chars
tagline: "Bilingual narrative web app demonstrating AI-augmented development and human-centered design." # Max 140 chars
slug: "marble-does-not-yield" # lowercase, hyphens only (unique)

# === CLASSIFICATION (FILTERS) ===

category: "AI Automation" # e.g., AI Automation | Tools | Templates | Client Work
target_audience: "Technical leaders evaluating AI-augmented development capabilities and human-centered design." # Max 120 chars
tags: # Exactly 3–10 tags (recommend 5–7)

- "next-js"
- "typescript"
- "ai-assisted-development"
- "bilingual"
- "accessibility"
- "narrative-design"
- "audio-narration"

# === VISUALS ===

thumbnail_url: "https://marble-does-not-yield.vercel.app/images/main-header-desktop.jpg" # Required, 16:9, clean UI shot
hero_image_urls: # Required, 3–6 external URLs

- "https://marble-does-not-yield.vercel.app/images/main-header-desktop.jpg"
- "https://marble-does-not-yield.vercel.app/images/main-header-mobile.jpg"
- "https://marble-does-not-yield.vercel.app/images/ending.jpg"

demo_video_url: "" # Required (can be empty string)

# === LINKS ===

demo_url: "https://marble-does-not-yield.vercel.app/" # Required production demo link
repo_url: "" # Required (can be empty string)
case_study_url: "" # Required (can be empty string)

# === SALES CONTENT (REQUIRED SECTIONS) ===

what_it_is: |
A production-grade bilingual narrative web application built with Next.js 14, demonstrating how AI-augmented development can deliver human-centered experiences. The site presents long-form literary content in English and Spanish with audio narration, restrained animation, and accessibility-first design. It showcases professional engineering discipline: clear separation of concerns, type-safe internationalization, and deliberate architectural choices that prioritize clarity over complexity.

why_it_matters: # Required: 3–6 bullets, measurable if possible

- "Demonstrates AI as collaborator (not generator) for analysis, refactoring, and design reasoning"
- "Proves bilingual systems can be built without heavy i18n frameworks (zero runtime overhead)"
- "Shows how restraint and accessibility drive better user experiences for cognitively loaded audiences"
- "Validates that small-scope projects can demonstrate senior-level judgment and production discipline"
- "Establishes patterns for narrative-driven products where clarity matters more than novelty"

how_it_works: # Required: 3–7 bullets, user flow oriented

- "User visits site and language is auto-detected from browser preferences"
- "Content loads as static HTML (no runtime dependencies) with optimized images and typography"
- "Optional audio narration plays author-read MP3 for accessibility"
- "Scroll-triggered animations reveal content progressively (respects reduced-motion preferences)"
- "Language switcher allows instant toggle between English and Spanish without page reload"
- "Documentation viewer at /docs provides technical context with responsive navigation"

# === FEATURES & PROOF ===

primary_features: # Required: 3–6 bullets (capabilities)

- "Bilingual support (English/Spanish) with type-safe locale handling and JSON + Markdown architecture"
- "Audio narration with author-read MP3 served as static asset (zero streaming overhead)"
- "Accessibility-first design (WCAG AAA contrast, reduced-motion support, semantic HTML)"
- "Responsive documentation viewer with proper markdown rendering and custom breakpoints"
- "Server-side content processing with client-side interaction only where required"
- "Production-ready deployment with static generation and optimized asset delivery"

proof: # Required: exactly 0–3 bullets (leave [] if none)

- "Deployed to production at marble-does-not-yield.vercel.app with 100% uptime"
- "Documentation system successfully renders 10+ markdown files with proper formatting"
- "Bilingual content maintains perfect symmetry across English and Spanish versions"

# === TECH (REQUIRED, BUT SHORT) ===

tech_stack: # Required: 5–12 items, most important first

- "Next.js 14 (App Router)"
- "TypeScript"
- "React Server Components"
- "Tailwind CSS"
- "react-markdown"
- "remark-gfm"
- "@tailwindcss/typography"
- "Vercel (deployment)"
- "Markdown (content pipeline)"

integrations: # Required: use [] if none

[]

--- # PORTFOLIO_YAML_END

# Optional: Any extra notes go below (ignored by parser).

## Development Notes

This project was built with AI assistance (Claude, Windsurf) as a collaborative tool for:

- Architecture decisions and refactoring
- Documentation generation and maintenance
- Debugging and troubleshooting
- Design system implementation

Key lessons learned documented in `/docs/LESSONS_LEARNED.md` including:

- Markdown rendering challenges and solutions
- Language detection implementation
- Responsive design patterns
- AI-assisted development workflows

## Project Evolution

- v1.0.0: Initial bilingual implementation
- v1.1.0: Refined animations and typography
- v2.0.0: Added audio narration feature
- v2.1.0: Documentation viewer with responsive design

## Technical Highlights

- Custom Tailwind breakpoint at 1180px for optimal tablet/desktop distinction
- Platform-agnostic AI engineering rules in `/docs/AI_ENGINEERING_RULES.md`
- Comprehensive pre-deployment checklist in `/docs/PRE_DEPLOYMENT_CHECKLIST.md`
- Design system documentation with typography and spacing guidelines
