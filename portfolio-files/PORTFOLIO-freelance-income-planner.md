# =============================================================================

# PORTFOLIO.MD — Freelance Income Planner (CushLabs Portfolio Entry v2 STRICT)

# =============================================================================

# Contract:

# - The parser reads ONLY the YAML block between BEGIN/END.

# - ALL keys in the YAML block are REQUIRED (no omissions).

# - Keep copy concise. This file is for client acquisition.

# =============================================================================

--- # PORTFOLIO_YAML_BEGIN

# === VISIBILITY & ORDER ===

portfolio_enabled: true
portfolio_priority: 3
portfolio_featured: false
portfolio_last_reviewed: "2026-01-06"

# === IDENTITY (CARD) ===

title: "Freelance Income Planner"
tagline: "Privacy-first income simulator showing real take-home pay for cross-border freelancers in 60 seconds."
slug: "freelance-income-planner"

# === CLASSIFICATION (FILTERS) ===

category: "Tools"
target_audience: "CFOs and finance leaders evaluating bilingual SaaS tools for multi-currency income planning and privacy architecture."
tags:

- "income-calculator"
- "multi-currency"
- "bilingual-i18n"
- "nextjs-app-router"
- "privacy-first"
- "zustand-state"
- "typescript-calculations"

# === VISUALS ===

thumbnail_url: "https://github.com/RCushmaniii/freelance-income-planner/raw/main/.github/screenshots/app-screen-shot.jpg"
hero_image_urls:

- "https://github.com/RCushmaniii/freelance-income-planner/raw/main/.github/screenshots/app-screen-shot.jpg"
- "https://github.com/RCushmaniii/freelance-income-planner/raw/main/.github/screenshots/forecast-view.jpg"
- "https://github.com/RCushmaniii/freelance-income-planner/raw/main/.github/screenshots/income-planner.jpg"
  demo_video_url: ""

# === LINKS ===

demo_url: "https://freelance-income-planner.vercel.app/"
repo_url: "https://github.com/RCushmaniii/freelance-income-planner"
case_study_url: ""

# === SALES CONTENT (REQUIRED SECTIONS) ===

what_it_is: |
A production-deployed income planning tool that solves the income visibility gap for freelancers earning in one currency while spending in another. Built with Next.js 14 App Router and TypeScript, the platform provides transparent cash flow calculations with sophisticated dual-currency modeling across USD, MXN, and EUR. The architecture demonstrates privacy-by-design: all calculations happen client-side with localStorage persistence, eliminating data collection while maintaining full functionality. Complete bilingual support (English/Spanish) with zero-runtime-overhead internationalization.

why_it_matters:

- "Demonstrates sophisticated multi-currency architecture supporting all 9 USD/MXN/EUR combinations with bidirectional conversion"
- "Proves privacy-first design can deliver full SaaS functionality without accounts, databases, or server-side processing"
- "Shows production-grade bilingual internationalization with complete translation coverage and localized number formatting"
- "Validates complex financial calculations with transparent formula tooltips and real-time What-If scenario modeling"
- "Establishes responsive design competency with mobile-first approach and adaptive documentation viewer"

how_it_works:

- "User enters hourly rate, hours per week, and business/personal expenses in their preferred language"
- "Calculator performs real-time conversions between billing and spending currencies with custom exchange rates"
- "Snapshot view displays transparent cash flow breakdown with effective hourly rate and lifestyle feasibility"
- "Forecast view offers three-scenario planning with monthly income equalizer and strategic insights"
- "All inputs persist to localStorage for seamless return visits without account creation"
- "Documentation viewer provides responsive left-sidebar navigation with proper markdown rendering"

# === FEATURES & PROOF ===

primary_features:

- "Dual-currency model with 9 supported combinations (USD/MXN/EUR billing × USD/MXN/EUR spending)"
- "Three-scenario planning with Pessimistic, Realistic, and Optimistic outcome visualization"
- "Monthly income equalizer with color-coded seasonal variation bars for feast-or-famine modeling"
- "Strategic insights with conditional coaching (Safety Net Test, Burnout Check, Golden Lever analysis)"
- "Formula tooltips on all calculations showing transparent math for every metric"
- "Complete bilingual support with instant EN/ES switching and localized currency formatting"

proof:

- "Deployed to production at freelance-income-planner.vercel.app with Vercel's edge network"
- "Responsive documentation viewer serving 11+ markdown files with proper navigation"
- "Zero data collection with 100% client-side calculations verified via privacy audit"

# === TECH (REQUIRED, BUT SHORT) ===

tech_stack:

- "Next.js 14 (App Router)"
- "TypeScript 5.5+"
- "Tailwind CSS 3.4+"
- "Zustand (state + persist)"
- "Recharts 2.10+"
- "react-markdown"
- "remark-gfm"
- "@tailwindcss/typography"
- "react-hot-toast"
- "Vercel (deployment)"

integrations: []

--- # PORTFOLIO_YAML_END

# =============================================================================

# Optional Development Notes (Ignored by Parser)

# =============================================================================

## Project Evolution

- **Phase 0:** Initial Next.js scaffold with bilingual foundation
- **Phase 1 (v1.0.0):** Core calculator with Snapshot and Forecast views
- **Current:** Production-ready with complete EN/ES localization and documentation
- **Phase 2 (Planned Q2 2026):** AI features for market rate recommendations and NLP queries

## Technical Highlights

### Privacy-First Architecture

**100% Client-Side Processing:**

- All calculations happen in browser JavaScript
- No server-side processing of financial data
- No database, no user accounts, no analytics
- localStorage for state persistence only

**Impact:**

- Zero privacy concerns for sensitive financial data
- Instant calculations with no network latency
- Works offline after initial page load
- GDPR/CCPA compliant by architecture

### Multi-Currency Intelligence

**Sophisticated Dual-Currency Model:**

```typescript
interface CurrencyConfig {
  billingCurrency: "USD" | "MXN" | "EUR";
  spendingCurrency: "USD" | "MXN" | "EUR";
  exchangeRate: number;
}
```

**Supported Combinations:**

- 9 total combinations (3 billing × 3 spending currencies)
- Bidirectional conversion (bill in USD, spend in MXN or vice versa)
- Tax calculations in billing currency
- Final results displayed in spending currency
- Custom exchange rate override capability

### Bilingual Internationalization

**Zero-Runtime-Overhead i18n:**

- Custom translation hook with TypeScript generics
- Locale-aware number and currency formatting
- Language preference persisted to localStorage
- No external i18n libraries (zero bundle overhead)

**Complete Coverage:**

- All UI text (labels, buttons, headings, tooltips)
- Toast notifications and error messages
- Documentation files
- Currency formatting (1,234.56 vs 1.234,56)

### State Management with Zustand

**Benefits:**

- Single source of truth for all app state
- Automatic localStorage synchronization
- Optimistic UI updates
- No prop drilling or context complexity

## Key Learnings

1. **Privacy-First Design:** Client-side calculations eliminate 90% of security concerns
2. **Multi-Currency Complexity:** Supporting 9 combinations requires careful state management
3. **Bilingual i18n:** Complete translation coverage requires planning from day one
4. **Zustand Simplicity:** 1/10th the code of Redux with same functionality
5. **Formula Transparency:** Showing calculations builds trust and educates users
6. **Responsive Docs:** Documentation viewer requires separate mobile/desktop navigation patterns

---

## Contact

**Robert Cushman**  
Solo AI Engineer & Full-Stack Developer  
[CushLabs.ai](https://cushlabs.ai)

📧 robert@cushlabs.ai  
🔗 [GitHub](https://github.com/RCushmaniii)

---

_Last Updated: January 6, 2026 - v1.0.0 Production Ready_
