---
# =============================================================================
# PORTFOLIO.MD — AI Scrabble Practice Suite
# =============================================================================
portfolio_enabled: true
portfolio_priority: 4
portfolio_featured: true
portfolio_last_reviewed: "2026-02-20"

title: "AI Scrabble Practice Suite"
tagline: "Five Scrabble practice tools with AI-powered search and timed gameplay, backed by a 370K-word dictionary"
slug: "ai-scrabble-practice"

category: "Games"
target_audience: "Scrabble players looking to sharpen word knowledge and scoring strategy through focused practice"
tags:
  - "react"
  - "typescript"
  - "ai"
  - "openai"
  - "vite"
  - "tailwind-css"
  - "playwright"
  - "i18n"
  - "scrabble"

thumbnail: "public/images/ai-scrabble-practice-thumb.jpg"
hero_images:
  - "public/images/ai-scrabble-practice-01.png"
  - "public/images/ai-scrabble-practice-02.png"
  - "public/images/ai-scrabble-practice-03.png"
  - "public/images/ai-scrabble-practice-04.png"
  - "public/images/ai-scrabble-practice-05.png"
  - "public/images/ai-scrabble-practice-06.png"
  - "public/images/ai-scrabble-practice-07.png"
  - "public/images/ai-scrabble-practice-08.png"
  - "public/images/ai-scrabble-practice-09.png"
  - "public/images/ai-scrabble-practice-10.png"
demo_video_url: "public/video/ai-scrabble-practice-brief.mp4"
demo_video_poster: "public/video/ai-scrabble-practice-brief-poster.jpg"

live_url: "https://scrabble-mini.netlify.app"
demo_url: "https://scrabble-mini.netlify.app"
case_study_url: ""

problem_solved: |
  Scrabble practice tools are either too simple (word checkers) or too powerful (board solvers),
  and neither builds actual skill. Players bounce between fragmented sites for validation, anagram
  solving, and word discovery. No existing tool combines these with AI-powered search and timed
  practice in a single application.

key_outcomes:
  - "370,105-word dictionary with sub-millisecond validation via Set-based lookups"
  - "Anagram solving in under 500ms for 7-tile hands with wildcard support"
  - "AI-powered natural language word search using GPT-4o-mini"
  - "Timed practice game with AI hints and progressive scoring"
  - "Full English/Spanish i18n with locale-based routing"
  - "E2E test coverage across all features via Playwright"

tech_stack:
  - "React 19"
  - "TypeScript 5.8"
  - "Vite 7"
  - "Tailwind CSS 3.4"
  - "OpenAI GPT-4o-mini"
  - "React Router 7"
  - "Playwright"
  - "MSW (Mock Service Worker)"
  - "Netlify"
  - "pnpm"

complexity: "Production"
---

## Overview

The AI Scrabble Practice Suite is a full-featured web application that consolidates five practice tools into a single, fast interface. Players validate words against a 370,000+ entry dictionary, discover high-scoring plays, solve anagrams, search with natural language, and practice under time pressure — all running client-side with sub-second response times.

Version 2.0 introduced two AI-powered features. Magic Search translates plain English queries ("7-letter words ending in -ING with a Z") into validated word results with Scrabble scores. The Practice Game runs timed 5-minute sessions with realistic tile draws and on-demand AI hints, simulating the pressure of competitive play without a board.

The app ships with bilingual support (English/Spanish), dark mode, responsive layouts, and a Playwright E2E test suite covering all major features.

## The Challenge

- **No learning curve in existing tools:** Word checkers confirm validity but don't help players discover new words or understand scoring patterns. Board solvers play the game for you.
- **Fragmented workflow:** Players bounce between separate sites for validation, anagram solving, and word lookup — losing context and momentum.
- **No structured practice:** No tool simulates timed play with realistic tile draws, progressive difficulty, and intelligent feedback.
- **Language barriers:** Most Scrabble tools are English-only with no internationalization support.

## The Solution

**Unified tool suite:**
Five tools share a single 370K-word dictionary and consistent UX — Word Validator, Word Finder, Anagram Solver, Magic Search, and Practice Game. Players stay in one application throughout their practice session.

**AI-powered discovery:**
Magic Search uses GPT-4o-mini to interpret natural language queries and return validated words with scores. Server-side API proxies keep credentials off the client while maintaining fast response times.

**Timed practice with coaching:**
The Practice Game generates realistic tile draws (vowel/consonant balance), runs 60-second rounds, and offers AI-powered hints on demand. Scoring rewards longer words with progressive bonuses, encouraging players to push beyond safe short words.

**Bilingual interface:**
A type-safe i18n system with React Context provides full English and Spanish support with locale-based routing, making the tool accessible to a broader player base.

## Technical Highlights

- **O(1) word validation:** 370K words loaded into a Set for instant dictionary lookups, even on mobile
- **Custom anagram algorithm:** Letter frequency counting with wildcard support processes the full dictionary in under 500ms
- **Server-side API proxies:** Vite dev middleware routes `/api/definition`, `/api/magic-search`, and `/api/practice-hint` through server-side endpoints, protecting API keys
- **Type-safe i18n:** React Context with typed template variables and locale-based routing (`/` and `/es/` prefixes)
- **MSW integration:** Mock Service Worker enables development and testing without live API dependencies
- **Full E2E coverage:** Playwright tests cover all pages, dark mode, responsive layouts, and Spanish locale routing

## Results

**For the Player:**

- Five practice tools in one application — no more switching between sites
- Sub-second response times for all dictionary operations
- AI-powered search and hints that teach rather than solve
- Practice under realistic time pressure with performance tracking

**Technical Demonstration:**

- Efficient large-dataset handling (370K entries) with optimized data structures
- OpenAI API integration with server-side proxying for security
- Production-grade React architecture with TypeScript, i18n, and E2E testing
- Clean separation of concerns: services, components, pages, and utilities

The project demonstrates the full spectrum of modern frontend development — from algorithm design and performance optimization to AI integration and automated testing.
