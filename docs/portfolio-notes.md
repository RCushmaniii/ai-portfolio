# Portfolio Sync Engine — Project Files

These files provide context and templates to help Claude Code (and other AI coding assistants) successfully build the Portfolio Sync Engine.

## File Overview

```
project-files/
├── README.md                     # This file
├── CLAUDE.md                     # Primary context file for Claude Code
├── .cursorrules                  # IDE-specific rules for Cursor
│
├── skills/                       # Technical reference guides
│   ├── nextjs-app-router.md      # Next.js 14 patterns
│   ├── shadcn-ui-patterns.md     # Component usage
│   ├── github-sync-patterns.md   # GitHub API & sync script
│   └── typescript-zod-patterns.md # TypeScript & validation
│
└── templates/
    ├── PORTFOLIO.md              # Blank template for repos
    └── examples/
        ├── PORTFOLIO-ai-webscraper.md   # Example: AI WebScraper
        └── PORTFOLIO-ny-ai-chatbot.md   # Example: NY AI Chatbot
```

## How to Use These Files

### 1. Project Setup (One-time)

Copy these files to your new project root:

```powershell
# After creating your project
cp CLAUDE.md path/to/portfolio-sync-engine/
cp .cursorrules path/to/portfolio-sync-engine/

# Create skills directory
mkdir -p path/to/portfolio-sync-engine/.claude/skills
cp skills/*.md path/to/portfolio-sync-engine/.claude/skills/
```

### 2. Claude Code Context

When working in Claude Code:
- Claude automatically reads `CLAUDE.md` from project root
- Reference skills with: "See `.claude/skills/nextjs-app-router.md` for patterns"
- The `.cursorrules` file works automatically in Cursor IDE

### 3. Add PORTFOLIO.md to Your Repos

For each repo you want in your portfolio:

1. Copy `templates/PORTFOLIO.md` to the repo root
2. Fill in all frontmatter fields
3. Write the body content (Overview, Challenge, Solution, etc.)
4. Add screenshots to hero_images (optional but recommended)
5. Commit and push

### 4. Run the Sync

After PORTFOLIO.md files are in place:

```powershell
cd portfolio-sync-engine
pnpm sync
```

## Quick Reference

### CLAUDE.md
The main context file that tells Claude Code:
- What the project is and does
- Key architectural decisions
- File structure and naming conventions
- Code patterns to follow
- Common mistakes to avoid

### Skills Files

| File | Use When |
|------|----------|
| `nextjs-app-router.md` | Building pages, layouts, dynamic routes |
| `shadcn-ui-patterns.md` | Using UI components |
| `github-sync-patterns.md` | Working on the sync script |
| `typescript-zod-patterns.md` | Type definitions, validation |

### Templates

| File | Use For |
|------|---------|
| `PORTFOLIO.md` | Starting point for any repo |
| `PORTFOLIO-ai-webscraper.md` | Example for full-stack data tool |
| `PORTFOLIO-ny-ai-chatbot.md` | Example for AI/SaaS product |

## Recommended Workflow

1. **Start Claude Code session** with the main prompt file
2. **Let Claude read CLAUDE.md** (it does this automatically)
3. **Reference skills** when working on specific areas
4. **Use templates** when adding PORTFOLIO.md to repos
5. **Test sync** early with one repo before adding all

## Tips for Success

### Give Claude Context
- Always have `CLAUDE.md` in project root
- Point Claude to relevant skills when asking about specific patterns
- Share error messages in full

### Keep Skills Updated
- If you change patterns, update the skills files
- Skills should reflect actual project conventions

### PORTFOLIO.md Quality
- Fill in ALL frontmatter fields (empty strings are fine)
- Write for a technical founder with 2 minutes to evaluate
- Include screenshots when possible

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Claude ignores conventions | Make sure CLAUDE.md is in project root |
| Sync finds no repos | Check GITHUB_TOKEN is set correctly |
| Validation errors | Check Zod error output, fix frontmatter |
| Missing images | Use empty strings, add fallback-thumbnail.png |

---

*These files were generated on 2024-12-28 for the Portfolio Sync Engine project.*
