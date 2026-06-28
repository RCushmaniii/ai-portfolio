# Session Log — ai-portfolio

Entries are newest-first. Each entry documents one Claude Code working session.

---

## Session: 2026-06-27

### Accomplished

- Security: 15 → 0 Dependabot alerts (8 high). next→15.5.19 + postcss→8.5.15 (#39), transitive postcss override (#40), js-yaml→4.3.0 + dismissed dev-scoped alert.
- CI action bumps combined into one PR (#41); fixed flaky smoke tests (networkidle → domcontentloaded).
- Unified project cards: shared `ProjectCard`, home shows 9 featured (#42); removed dead `PortfolioCard`.
- Schema migration + data refresh 31 → 35 projects, 0 sync errors (#43): hero_images now `{src,alt_en,alt_es}` objects threaded through to a locale-aware `ImageCarousel`; tolerant YAML parse recovers duplicate-key repos; disabled-repo pre-check.
- Major upgrades (#44): Next 16, react-markdown 10, tailwind-merge 3, eslint-config-next 16; migrated to ESLint flat config (`next lint` removed in 16).
- Thumbnails now resolve to R2 CDN with branded fallback, matching cushlabs (#45): removed 28 local thumbnail overrides; verified all 32 R2 URLs return 200.
- Spanish audit clean (zero Iberian markers); polished `not_found` to simple past.

### Decisions Made

- Tolerant YAML parse (log + recover) over editing 8 source repos: real root cause is a health-audit generator that appends `health_status` instead of replacing.
- R2-canonical thumbnails (remove overrides) over local self-hosting: matches user intent + cushlabs reference. Reversible via git.
- Bundled the 4 majors in one verified PR (typecheck + build + 9/9 e2e gating).

### Immediate Next Steps

- [ ] Decide #21 (Vercel Web Analytics PR) — feature, left open.
- [ ] Give `ny-english-messenger-bot` + `cushlabs-sticker-gen` real thumbnails (PORTFOLIO.md + R2 upload) to replace branded card.
- [ ] Fix the health-audit generator (owning repo) that creates duplicate `health_status` keys.

### Technical Debt

- ai-portfolio and cushlabs maintain two independent sync+resolve pipelines that will keep drifting — needs a single source of truth (shared module or ai-portfolio consuming cushlabs' generated JSON).

### Open Questions / Blockers

- Architecture: should ai-portfolio stay a separate app or fold into the cushlabs Astro site? (product decision)

---

<!-- New entries go above this line -->
