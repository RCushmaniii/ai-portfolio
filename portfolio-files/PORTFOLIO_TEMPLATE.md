# Portfolio Entry Template

Copy this file to your repo's root as `PORTFOLIO.md` and fill in the values.

---

```yaml
---
# === CONTROL FLAGS ===
portfolio_enabled: true
portfolio_priority: 5          # 1-10 (1 shows first)
portfolio_featured: false

# === CARD DISPLAY ===
title: "Project Title"         # Max 80 chars
tagline: "One-line value prop" # Max 140 chars
slug: "project-slug"           # lowercase, hyphens only (unique)
category: "AI Automation"      # AI Automation | Templates | Tools | Client Work
tech_stack:                    # 3-12 items, most important first
  - "Next.js"
  - "TypeScript"
  - "OpenAI API"
thumbnail: ""                  # URL to 16:9 screenshot (or empty)
status: "Production"           # Production | MVP | Demo | Archived

# === DETAIL PAGE ===
problem: "2-3 sentences describing the pain point this solves."
solution: "2-3 sentences describing how your project solves it."
key_features:                  # 3-6 bullets max
  - "Feature one with measurable impact"
  - "Feature two explaining capability"
  - "Feature three showing value"
metrics:                       # 0-4 bullets (optional proof points)
  - "52% improvement in X"
  - "4.5/5 user satisfaction"

# === LINKS ===
demo_url: ""                   # Live demo URL (or empty)
live_url: ""                   # Production URL if different from demo

# === OPTIONAL ===
hero_images: []                # Up to 6 additional screenshot URLs
tags: []                       # Up to 10 lowercase tags for filtering
date_completed: "2024-11"      # YYYY-MM format
---
```

<!-- Optional: Extended description below (2-3 paragraphs MAX) -->
<!-- Most users won't read this - they'll click demo_url or live_url -->

---

## Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `portfolio_enabled` | Yes | `true` to show, `false` to hide |
| `portfolio_priority` | Yes | 1-10, lower = higher in list |
| `portfolio_featured` | No | `true` for featured badge |
| `title` | Yes | Project name (80 chars max) |
| `tagline` | Yes | One-sentence value prop (140 chars max) |
| `slug` | Yes | URL-safe ID (lowercase, hyphens) |
| `category` | Yes | AI Automation, Templates, Tools, or Client Work |
| `tech_stack` | Yes | 3-12 technologies used |
| `thumbnail` | No | 16:9 image URL |
| `status` | No | Production (default), MVP, Demo, or Archived |
| `problem` | No | Pain point description (300 chars max) |
| `solution` | No | How you solved it (300 chars max) |
| `key_features` | No | 3-6 capability bullets |
| `metrics` | No | 0-4 proof points with numbers |
| `demo_url` | No | Live demo link |
| `live_url` | No | Production URL |
| `hero_images` | No | Additional screenshots (up to 6) |
| `tags` | No | Lowercase filter tags (up to 10) |
| `date_completed` | No | YYYY-MM completion date |

## Writing Tips

- **Tagline**: Lead with outcome, not technology ("Cut support tickets 45%" not "GPT-4 chatbot")
- **Problem/Solution**: Write for decision-makers, not developers
- **Key Features**: Measurable outcomes > technical details
- **Metrics**: Real numbers only - don't fabricate
