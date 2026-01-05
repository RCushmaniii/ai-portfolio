---
trigger: always_on
---

# Project Rules\n\n(migrated from .cursorrules)\n\n# Portfolio Sync Engine â€” Cursor Rules

You are working on a Next.js 14 portfolio application that aggregates project data from GitHub repositories.

## Project Context

- **Purpose:** Display AI consulting portfolio for CushLabs.ai
- **Data source:** PORTFOLIO.md files in GitHub repos â†’ sync script â†’ portfolio.json
- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Package manager:** pnpm
- **Deployment:** Vercel

## Code Style

### TypeScript
- Use strict mode (no `any` types)
- Always specify return types for exported functions
- Use Zod for validating external data (GitHub API, JSON files)
- Prefer `interface` over `type` for object shapes
- Use `type` for unions and primitives

### React/Next.js
- Use Server Components by default
- Only add `"use client"` when hooks or interactivity are needed
- Use `generateStaticParams` for dynamic routes
- Prefer `async/await` over `.then()` chains
- Use Next.js Image component for images

### Styling
- Use Tailwind CSS utility classes
- Use shadcn/ui components from `@/components/ui/`
- Don't create custom CSS files
- Use semantic color tokens (text-foreground, bg-muted, etc.)
- Mobile-first responsive design

### File Organization
- Pages in `src/app/`
- Reusable components in `src/components/`
- shadcn/ui components in `src/components/ui/` (don't modify)
- Custom portfolio components in `src/components/portfolio/`
- Utilities and types in `src/lib/`

## Key Files

- `content/portfolio.json` â€” Generated data (never edit manually)
- `scripts/sync-portfolio.ts` â€” GitHub â†’ JSON sync script
- `src/lib/portfolio/types.ts` â€” TypeScript interfaces
- `src/lib/portfolio/loader.ts` â€” Data loading functions
- `CLAUDE.md` â€” Detailed project context

## Common Patterns

### Data Loading
```typescript
// src/lib/portfolio/loader.ts
import portfolioData from '@/content/portfolio.json';
import type { PortfolioData } from './types';

const data = portfolioData as PortfolioData;

export async function getPortfolioProjects() {
  return data.projects;
}
```

### Page Component
```typescript
// Server component with async data
export default async function Page() {
  const data = await getData();
  return <Component data={data} />;
}
```

### Client Component
```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(initial);
  // ...
}
```

### shadcn/ui Usage
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

// Use asChild for custom elements
<Button asChild>
  <Link href="/path">Click</Link>
</Button>
```

## Don't Do

- Don't use `getServerSideProps` or `getStaticProps` (App Router doesn't use these)
- Don't fetch GitHub API at runtime (use pre-synced JSON)
- Don't modify files in `src/components/ui/`
- Don't use CSS modules or styled-components
- Don't add `"use client"` to page components unnecessarily
- Don't edit `content/portfolio.json` manually

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm sync         # Sync portfolio from GitHub
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
```

## Environment Variables

- `GITHUB_TOKEN` â€” Required for sync script only (not exposed to client)
- `NEXT_PUBLIC_SITE_URL` â€” Optional, for OG images

