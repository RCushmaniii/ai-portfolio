# SKILL: TypeScript & Zod Patterns

> Reference guide for TypeScript conventions and Zod validation in this project.

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Type Definition File

```typescript
// src/lib/portfolio/types.ts

/**
 * Portfolio project data structure
 * Combines PORTFOLIO.md frontmatter with GitHub API enrichment
 */
export interface PortfolioProject {
  // === From PORTFOLIO.md frontmatter ===
  
  // Display Control
  portfolio_enabled: boolean;
  portfolio_priority: number;
  portfolio_featured: boolean;
  portfolio_last_reviewed: string;

  // Identity
  title: string;
  tagline: string;
  slug: string;

  // Categorization
  category: PortfolioCategory;
  target_audience: string;
  tags: string[];

  // Visual Assets
  thumbnail: string;
  hero_images: string[];
  demo_video_url: string;

  // Links
  live_url: string;
  case_study_url: string;

  // Business Value
  problem_solved: string;
  key_outcomes: string[];

  // Technical
  tech_stack: string[];
  complexity: ProjectComplexity;

  // === From PORTFOLIO.md body ===
  body_markdown: string;

  // === From GitHub API enrichment ===
  repo_name: string;
  repo_url: string;
  github_stars: number;
  github_forks: number;
  github_language: string | null;
  github_updated_at: string;
  github_description: string;
  github_topics: string[];
}

/**
 * Valid portfolio categories
 */
export type PortfolioCategory = 
  | 'AI Automation' 
  | 'Templates' 
  | 'Tools' 
  | 'Client Work';

/**
 * Project complexity levels
 */
export type ProjectComplexity = 'MVP' | 'Production' | 'Enterprise';

/**
 * Root structure of portfolio.json
 */
export interface PortfolioData {
  generated_at: string;
  projects: PortfolioProject[];
}

/**
 * Sort options for portfolio grid
 */
export type SortOption = 'priority' | 'recent' | 'popular';

/**
 * Filter state for portfolio grid
 */
export interface PortfolioFilters {
  category: PortfolioCategory | 'all';
  sort: SortOption;
}
```

## Zod Schemas

### Why Zod?

1. **Runtime validation** — TypeScript types are compile-time only
2. **External data** — GitHub API responses can't be trusted
3. **User content** — PORTFOLIO.md is user-authored, may have errors
4. **Clear errors** — Zod provides detailed validation messages

### Schema Definition

```typescript
// src/lib/portfolio/schema.ts

import { z } from 'zod';

/**
 * Schema for PORTFOLIO.md frontmatter validation
 */
export const PortfolioFrontmatterSchema = z.object({
  // Display Control
  portfolio_enabled: z.boolean(),
  portfolio_priority: z
    .number()
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must be at most 10'),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),

  // Identity
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be under 100 characters'),
  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .max(200, 'Tagline must be under 200 characters'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),

  // Categorization
  category: z.enum(['AI Automation', 'Templates', 'Tools', 'Client Work'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  target_audience: z.string().max(100).default(''),
  tags: z.array(z.string()).max(10).default([]),

  // Visual Assets
  thumbnail: z.string().url().or(z.literal('')).default(''),
  hero_images: z
    .array(z.string().url())
    .max(10, 'Maximum 10 hero images')
    .default([]),
  demo_video_url: z.string().url().or(z.literal('')).optional().default(''),

  // Links
  live_url: z.string().url().or(z.literal('')).default(''),
  case_study_url: z.string().url().or(z.literal('')).optional().default(''),

  // Business Value
  problem_solved: z
    .string()
    .max(500, 'Problem description must be under 500 characters')
    .default(''),
  key_outcomes: z.array(z.string()).max(10).default([]),

  // Technical
  tech_stack: z.array(z.string()).max(20).default([]),
  complexity: z.enum(['MVP', 'Production', 'Enterprise']).default('Production'),
});

// Infer TypeScript type from schema
export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
```

### Using Zod for Validation

```typescript
// Safe parsing (doesn't throw)
const result = PortfolioFrontmatterSchema.safeParse(data);

if (result.success) {
  // result.data is typed as PortfolioFrontmatter
  console.log(result.data.title);
} else {
  // result.error contains validation details
  console.error(result.error.issues);
}

// Strict parsing (throws on error)
try {
  const validated = PortfolioFrontmatterSchema.parse(data);
  // validated is typed as PortfolioFrontmatter
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.issues);
  }
}
```

### Formatting Zod Errors

```typescript
function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
}

// Usage
const result = schema.safeParse(data);
if (!result.success) {
  console.error(formatZodError(result.error));
}
```

## TypeScript Patterns

### Function Signatures

```typescript
// Always specify return types for exported functions
export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}

// Async functions
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return data.projects;
}

// Functions that can throw
export function parsePortfolioMd(content: string): { 
  frontmatter: Record<string, unknown>; 
  body: string 
} {
  // ...
}
```

### Avoiding `any`

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good - use unknown and narrow
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String((data as { value: unknown }).value);
  }
  throw new Error('Invalid data');
}

// ✅ Better - use Zod for external data
const DataSchema = z.object({ value: z.string() });

function processData(data: unknown): string {
  const parsed = DataSchema.parse(data);
  return parsed.value;
}
```

### Type Guards

```typescript
// Custom type guard
function isPortfolioProject(obj: unknown): obj is PortfolioProject {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'slug' in obj &&
    'title' in obj &&
    'category' in obj
  );
}

// Usage
if (isPortfolioProject(data)) {
  console.log(data.title); // TypeScript knows this is safe
}
```

### Discriminated Unions

```typescript
// For API responses that can succeed or fail
type SyncResult =
  | { success: true; projects: PortfolioProject[] }
  | { success: false; error: string };

function handleResult(result: SyncResult) {
  if (result.success) {
    // TypeScript knows result.projects exists
    console.log(result.projects.length);
  } else {
    // TypeScript knows result.error exists
    console.error(result.error);
  }
}
```

### Utility Types

```typescript
// Partial - all properties optional
type PartialProject = Partial<PortfolioProject>;

// Pick - select specific properties
type ProjectSummary = Pick<PortfolioProject, 'title' | 'slug' | 'tagline'>;

// Omit - exclude properties
type ProjectWithoutGitHub = Omit<PortfolioProject, 
  'repo_name' | 'repo_url' | 'github_stars' | 'github_forks'
>;

// Record - dictionary type
type CategoryProjects = Record<PortfolioCategory, PortfolioProject[]>;

// Extract - extract from union
type AICategory = Extract<PortfolioCategory, 'AI Automation'>;

// Exclude - remove from union
type NonAICategory = Exclude<PortfolioCategory, 'AI Automation'>;
```

### Generic Components

```typescript
// Generic props for reusable components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={projects}
  renderItem={(p) => <span>{p.title}</span>}
  keyExtractor={(p) => p.slug}
/>
```

## JSON Import Typing

```typescript
// When importing JSON, TypeScript infers types but they're loose
import portfolioData from '@/content/portfolio.json';

// Cast to proper type
import type { PortfolioData } from './types';

const data = portfolioData as PortfolioData;

// Or validate at runtime
const data = PortfolioDataSchema.parse(portfolioData);
```

## Common TypeScript Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Type 'X' is not assignable to type 'Y'` | Type mismatch | Check types match or use type assertion |
| `Object is possibly 'undefined'` | Not handling null case | Add null check or use optional chaining |
| `Property 'X' does not exist on type 'Y'` | Wrong property name or type | Verify property exists in interface |
| `Cannot find module '@/...'` | Path alias not configured | Check tsconfig.json paths |
| `'X' only refers to a type` | Using type as value | Import separately or use `typeof` |

## Type Checking Commands

```powershell
# Run TypeScript compiler check
pnpm typecheck

# Or directly
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

## Package.json Scripts

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}
```
