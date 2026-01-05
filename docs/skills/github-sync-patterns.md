# SKILL: GitHub API & Sync Script Patterns

> Reference guide for the portfolio sync script that fetches data from GitHub.

## Overview

The sync script (`scripts/sync-portfolio.ts`) runs locally to:
1. Fetch all public repos for a GitHub user
2. Check each repo for a `PORTFOLIO.md` file
3. Parse frontmatter and validate against schema
4. Enrich with GitHub API metadata
5. Output `content/portfolio.json`

## Dependencies

```json
{
  "devDependencies": {
    "tsx": "^4.0.0",
    "gray-matter": "^4.0.3",
    "zod": "^3.22.0",
    "dotenv": "^16.0.0"
  }
}
```

## Script Structure

```typescript
// scripts/sync-portfolio.ts

import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Constants
const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'portfolio.json');

// Main execution
async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('🔄 Starting portfolio sync...\n');

  try {
    const projects = await syncPortfolio(token);
    await writeOutput(projects);
    console.log(`\n✅ Sync complete: ${projects.length} projects`);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
```

## GitHub API Functions

### Fetch User Repositories

```typescript
interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
}

async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  
  while (true) {
    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-sync-script',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid GitHub token');
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.length === 0) break;
    
    // Filter out private repos
    repos.push(...data.filter((r: GitHubRepo) => !r.private));
    page++;
    
    // Safety limit
    if (page > 10) break;
  }

  return repos;
}
```

### Fetch PORTFOLIO.md Content

```typescript
async function fetchPortfolioMd(
  repoName: string, 
  token: string
): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw', // Get raw content
        'User-Agent': 'portfolio-sync-script',
      },
    }
  );

  if (response.status === 404) {
    return null; // File doesn't exist
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch PORTFOLIO.md: ${response.status}`);
  }

  return response.text();
}
```

## Frontmatter Parsing

### Using gray-matter

```typescript
import matter from 'gray-matter';

interface ParsedContent {
  frontmatter: Record<string, unknown>;
  body: string;
}

function parsePortfolioMd(content: string): ParsedContent {
  const { data, content: body } = matter(content);
  return {
    frontmatter: data,
    body: body.trim(),
  };
}
```

### Zod Schema for Validation

```typescript
import { z } from 'zod';

export const PortfolioFrontmatterSchema = z.object({
  // Display Control
  portfolio_enabled: z.boolean(),
  portfolio_priority: z.number().min(1).max(10),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  // Identity
  title: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),

  // Categorization
  category: z.enum(['AI Automation', 'Templates', 'Tools', 'Client Work']),
  target_audience: z.string().max(100),
  tags: z.array(z.string()).max(10),

  // Visual Assets
  thumbnail: z.string().url().or(z.literal('')),
  hero_images: z.array(z.string().url()).max(10).default([]),
  demo_video_url: z.string().url().or(z.literal('')).optional().default(''),

  // Links
  live_url: z.string().url().or(z.literal('')),
  case_study_url: z.string().url().or(z.literal('')).optional().default(''),

  // Business Value
  problem_solved: z.string().max(500),
  key_outcomes: z.array(z.string()).max(10),

  // Technical
  tech_stack: z.array(z.string()).max(20),
  complexity: z.enum(['MVP', 'Production', 'Enterprise']),
});

export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
```

### Validation with Error Reporting

```typescript
function validateFrontmatter(
  data: Record<string, unknown>,
  repoName: string
): PortfolioFrontmatter | null {
  const result = PortfolioFrontmatterSchema.safeParse(data);

  if (!result.success) {
    console.error(`  ❌ Invalid frontmatter in ${repoName}:`);
    result.error.issues.forEach((issue) => {
      console.error(`     - ${issue.path.join('.')}: ${issue.message}`);
    });
    return null;
  }

  return result.data;
}
```

## Main Sync Logic

```typescript
import type { PortfolioProject, PortfolioData } from '../src/lib/portfolio/types';

async function syncPortfolio(token: string): Promise<PortfolioProject[]> {
  const repos = await fetchUserRepos(token);
  console.log(`📦 Found ${repos.length} public repositories\n`);

  const projects: PortfolioProject[] = [];

  for (const repo of repos) {
    process.stdout.write(`  ${repo.name}: `);

    try {
      // 1. Fetch PORTFOLIO.md
      const content = await fetchPortfolioMd(repo.name, token);
      
      if (!content) {
        console.log('⏭️  No PORTFOLIO.md');
        continue;
      }

      // 2. Parse frontmatter
      const { frontmatter, body } = parsePortfolioMd(content);

      // 3. Validate
      const validated = validateFrontmatter(frontmatter, repo.name);
      
      if (!validated) {
        continue; // Error already logged
      }

      // 4. Check if enabled
      if (!validated.portfolio_enabled) {
        console.log('⏭️  Disabled');
        continue;
      }

      // 5. Build enriched project
      const project: PortfolioProject = {
        ...validated,
        body_markdown: body,
        repo_name: repo.name,
        repo_url: repo.html_url,
        github_stars: repo.stargazers_count,
        github_forks: repo.forks_count,
        github_language: repo.language,
        github_updated_at: repo.updated_at,
        github_description: repo.description || '',
        github_topics: repo.topics || [],
      };

      projects.push(project);
      console.log('✅ Added');

    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : error}`);
      // Continue to next repo
    }
  }

  // Sort by priority (lower = higher priority)
  projects.sort((a, b) => a.portfolio_priority - b.portfolio_priority);

  return projects;
}
```

## Output Writing

```typescript
async function writeOutput(projects: PortfolioProject[]): Promise<void> {
  const output: PortfolioData = {
    generated_at: new Date().toISOString(),
    projects,
  };

  // Ensure directory exists
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  // Write formatted JSON
  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(output, null, 2),
    'utf-8'
  );

  console.log(`\n📄 Wrote to: ${OUTPUT_PATH}`);
}
```

## Package.json Script

```json
{
  "scripts": {
    "sync": "npx tsx scripts/sync-portfolio.ts",
    "sync:dry": "npx tsx scripts/sync-portfolio.ts --dry-run"
  }
}
```

## Error Handling Patterns

### Rate Limiting

```typescript
// Check rate limit headers
const remaining = response.headers.get('x-ratelimit-remaining');
const resetTime = response.headers.get('x-ratelimit-reset');

if (remaining === '0') {
  const resetDate = new Date(Number(resetTime) * 1000);
  throw new Error(`Rate limited. Resets at ${resetDate.toISOString()}`);
}
```

### Retry Logic

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`  Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Unreachable');
}
```

## TypeScript Configuration for Scripts

```json
// scripts/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["*.ts"]
}
```

## Environment Setup

```powershell
# .env.local (never commit)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```bash
# .env.example (commit this)
# GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
# Required scope: public_repo (read-only access)
GITHUB_TOKEN=ghp_your_token_here
```

## Testing the Sync

```powershell
# Run sync
pnpm sync

# Expected output:
# 🔄 Starting portfolio sync...
#
# 📦 Found 16 public repositories
#
#   ai-webscraper: ✅ Added
#   ai-resume-tailor: ⏭️  No PORTFOLIO.md
#   cushlabs-writing-system: ⏭️  Disabled
#   ...
#
# 📄 Wrote to: C:\...\content\portfolio.json
#
# ✅ Sync complete: 4 projects
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid or expired token | Generate new token |
| `403 Forbidden` | Rate limit exceeded | Wait for reset or use authenticated requests |
| `404 Not Found` | Wrong username or private repo | Verify username, check repo visibility |
| Empty `portfolio.json` | No repos have PORTFOLIO.md | Add PORTFOLIO.md to at least one repo |
| Validation errors | Frontmatter doesn't match schema | Check Zod error messages for specifics |
