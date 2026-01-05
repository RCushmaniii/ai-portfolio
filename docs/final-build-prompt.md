# Portfolio Sync Engine — Build Prompt

You are an expert full-stack developer. Build a Next.js application that aggregates portfolio project data from GitHub repositories and displays them in a professional, filterable portfolio interface.

---

## PROJECT CONTEXT

**Business Goal:** Create a portfolio showcase for CushLabs.ai (AI consulting) that automatically pulls project data from GitHub repos containing `PORTFOLIO.md` files.

**How It Works:**
1. Each GitHub repo has a `PORTFOLIO.md` file with structured frontmatter
2. A sync script fetches these files + GitHub API metadata
3. Outputs `content/portfolio.json`
4. Next.js consumes JSON at build time → static pages

**GitHub User:** `RCushmaniii`

---

## TECH STACK (Use Exactly)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3+ |
| Components | shadcn/ui |
| Package Manager | pnpm |
| Runtime | Node.js 20+ |
| Deployment | Vercel |

---

## STEP 1: PROJECT INITIALIZATION

Run these commands:

```powershell
# Create Next.js project
pnpm create next-app@latest portfolio-sync-engine --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd portfolio-sync-engine

# Install dependencies
pnpm add embla-carousel-react react-markdown lucide-react class-variance-authority clsx tailwind-merge
pnpm add -D tsx gray-matter zod dotenv @types/node

# Initialize shadcn/ui
pnpm dlx shadcn@latest init

# Add required shadcn components
pnpm dlx shadcn@latest add button card badge tabs select skeleton
```

---

## STEP 2: CREATE FILE STRUCTURE

Create these files and folders:

```
portfolio-sync-engine/
├── .env.local                   # GITHUB_TOKEN=ghp_xxx (create manually)
├── .env.example
├── content/
│   └── portfolio.json           # Will be generated
├── scripts/
│   └── sync-portfolio.ts
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── portfolio/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           ├── page.tsx
│   │           └── not-found.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn (auto-generated)
│   │   └── portfolio/
│   │       ├── PortfolioGrid.tsx
│   │       ├── PortfolioCard.tsx
│   │       ├── PortfolioDetail.tsx
│   │       ├── ImageCarousel.tsx
│   │       ├── CategoryFilter.tsx
│   │       ├── SortSelect.tsx
│   │       └── TechBadges.tsx
│   └── lib/
│       ├── portfolio/
│       │   ├── types.ts
│       │   ├── schema.ts
│       │   ├── loader.ts
│       │   └── filters.ts
│       └── utils.ts
└── public/
    └── images/
        └── fallback-thumbnail.png
```

---

## STEP 3: TYPE DEFINITIONS

### `src/lib/portfolio/types.ts`

```typescript
export type PortfolioCategory = 'AI Automation' | 'Templates' | 'Tools' | 'Client Work';
export type ProjectComplexity = 'MVP' | 'Production' | 'Enterprise';
export type SortOption = 'priority' | 'recent' | 'popular';

export interface PortfolioProject {
  // From PORTFOLIO.md frontmatter
  portfolio_enabled: boolean;
  portfolio_priority: number;
  portfolio_featured: boolean;
  portfolio_last_reviewed: string;
  title: string;
  tagline: string;
  slug: string;
  category: PortfolioCategory;
  target_audience: string;
  tags: string[];
  thumbnail: string;
  hero_images: string[];
  demo_video_url: string;
  live_url: string;
  case_study_url: string;
  problem_solved: string;
  key_outcomes: string[];
  tech_stack: string[];
  complexity: ProjectComplexity;
  
  // From PORTFOLIO.md body
  body_markdown: string;
  
  // From GitHub API
  repo_name: string;
  repo_url: string;
  github_stars: number;
  github_forks: number;
  github_language: string | null;
  github_updated_at: string;
  github_description: string;
  github_topics: string[];
}

export interface PortfolioData {
  generated_at: string;
  projects: PortfolioProject[];
}

export interface PortfolioFilters {
  category: PortfolioCategory | 'all';
  sort: SortOption;
}
```

### `src/lib/portfolio/schema.ts`

```typescript
import { z } from 'zod';

export const PortfolioFrontmatterSchema = z.object({
  portfolio_enabled: z.boolean(),
  portfolio_priority: z.number().min(1).max(10),
  portfolio_featured: z.boolean().optional().default(false),
  portfolio_last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(['AI Automation', 'Templates', 'Tools', 'Client Work']),
  target_audience: z.string().max(100).default(''),
  tags: z.array(z.string()).max(10).default([]),
  thumbnail: z.string().url().or(z.literal('')).default(''),
  hero_images: z.array(z.string().url()).max(10).default([]),
  demo_video_url: z.string().url().or(z.literal('')).optional().default(''),
  live_url: z.string().url().or(z.literal('')).default(''),
  case_study_url: z.string().url().or(z.literal('')).optional().default(''),
  problem_solved: z.string().max(500).default(''),
  key_outcomes: z.array(z.string()).max(10).default([]),
  tech_stack: z.array(z.string()).max(20).default([]),
  complexity: z.enum(['MVP', 'Production', 'Enterprise']).default('Production'),
});

export type PortfolioFrontmatter = z.infer<typeof PortfolioFrontmatterSchema>;
```

---

## STEP 4: SYNC SCRIPT

### `scripts/sync-portfolio.ts`

```typescript
import 'dotenv/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { PortfolioFrontmatterSchema } from '../src/lib/portfolio/schema';
import type { PortfolioProject, PortfolioData } from '../src/lib/portfolio/types';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USER = 'RCushmaniii';
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'portfolio.json');

interface GitHubRepo {
  name: string;
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
      if (response.status === 401) throw new Error('Invalid GitHub token');
      if (response.status === 403) throw new Error('Rate limit exceeded');
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;
    repos.push(...data.filter((r: GitHubRepo) => !r.private));
    page++;
    if (page > 10) break;
  }

  return repos;
}

async function fetchPortfolioMd(repoName: string, token: string): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${GITHUB_USER}/${repoName}/contents/PORTFOLIO.md`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'portfolio-sync-script',
      },
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  return response.text();
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('🔄 Starting portfolio sync...\n');

  const repos = await fetchUserRepos(token);
  console.log(`📦 Found ${repos.length} public repositories\n`);

  const projects: PortfolioProject[] = [];

  for (const repo of repos) {
    process.stdout.write(`  ${repo.name}: `);

    try {
      const content = await fetchPortfolioMd(repo.name, token);
      
      if (!content) {
        console.log('⏭️  No PORTFOLIO.md');
        continue;
      }

      const { data: frontmatter, content: body } = matter(content);
      const result = PortfolioFrontmatterSchema.safeParse(frontmatter);

      if (!result.success) {
        console.log('❌ Invalid frontmatter');
        result.error.issues.forEach((issue) => {
          console.log(`     - ${issue.path.join('.')}: ${issue.message}`);
        });
        continue;
      }

      if (!result.data.portfolio_enabled) {
        console.log('⏭️  Disabled');
        continue;
      }

      const project: PortfolioProject = {
        ...result.data,
        body_markdown: body.trim(),
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
    }
  }

  projects.sort((a, b) => a.portfolio_priority - b.portfolio_priority);

  const output: PortfolioData = {
    generated_at: new Date().toISOString(),
    projects,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n📄 Wrote to: ${OUTPUT_PATH}`);
  console.log(`✅ Sync complete: ${projects.length} projects\n`);
}

main().catch(console.error);
```

### Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "sync": "npx tsx scripts/sync-portfolio.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## STEP 5: DATA LOADER

### `src/lib/portfolio/loader.ts`

```typescript
import type { PortfolioProject, PortfolioData, PortfolioCategory, SortOption } from './types';

// Import JSON at build time
let portfolioData: PortfolioData;

try {
  portfolioData = require('@/content/portfolio.json');
} catch {
  portfolioData = { generated_at: '', projects: [] };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects;
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  return portfolioData.projects.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  return portfolioData.projects.filter((p) => p.portfolio_featured);
}

export function filterProjects(
  projects: PortfolioProject[],
  category: PortfolioCategory | 'all'
): PortfolioProject[] {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}

export function sortProjects(
  projects: PortfolioProject[],
  sortBy: SortOption
): PortfolioProject[] {
  const sorted = [...projects];
  
  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => a.portfolio_priority - b.portfolio_priority);
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.github_updated_at).getTime() - new Date(a.github_updated_at).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.github_stars - a.github_stars);
    default:
      return sorted;
  }
}
```

### `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## STEP 6: COMPONENTS

### `src/components/portfolio/PortfolioCard.tsx`

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioCardProps {
  project: PortfolioProject;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {project.portfolio_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
            Featured
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{project.category}</Badge>
          {project.github_stars > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 fill-current" />
              {project.github_stars}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2 mt-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.tagline}
        </p>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tech_stack.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/portfolio/${project.slug}`}>
            View Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### `src/components/portfolio/PortfolioGrid.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PortfolioCard } from './PortfolioCard';
import { CategoryFilter } from './CategoryFilter';
import { SortSelect } from './SortSelect';
import { filterProjects, sortProjects } from '@/lib/portfolio/loader';
import type { PortfolioProject, PortfolioCategory, SortOption } from '@/lib/portfolio/types';

interface PortfolioGridProps {
  projects: PortfolioProject[];
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = (searchParams.get('category') as PortfolioCategory | 'all') || 'all';
  const sort = (searchParams.get('sort') as SortOption) || 'priority';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'priority') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredAndSorted = useMemo(() => {
    const filtered = filterProjects(projects, category);
    return sortProjects(filtered, sort);
  }, [projects, category, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <CategoryFilter
          value={category}
          onChange={(value) => updateParams('category', value)}
        />
        <SortSelect
          value={sort}
          onChange={(value) => updateParams('sort', value)}
        />
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No projects found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### `src/components/portfolio/CategoryFilter.tsx`

```typescript
'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PortfolioCategory } from '@/lib/portfolio/types';

const CATEGORIES: Array<{ value: PortfolioCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'AI Automation', label: 'AI Automation' },
  { value: 'Templates', label: 'Templates' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Client Work', label: 'Client Work' },
];

interface CategoryFilterProps {
  value: PortfolioCategory | 'all';
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="flex-wrap h-auto">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

### `src/components/portfolio/SortSelect.tsx`

```typescript
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortOption } from '@/lib/portfolio/types';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'priority', label: 'Priority' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### `src/components/portfolio/ImageCarousel.tsx`

```typescript
'use client';

import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-video">
                <Image
                  src={src}
                  alt={`${title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
```

### `src/components/portfolio/PortfolioDetail.tsx`

```typescript
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from './ImageCarousel';
import { ArrowLeft, ExternalLink, Github, Star, Check } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface PortfolioDetailProps {
  project: PortfolioProject;
}

export function PortfolioDetail({ project }: PortfolioDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link & External Links */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
        <div className="flex gap-2">
          {project.live_url && (
            <Button asChild>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                View Live <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* Hero Carousel */}
      <ImageCarousel images={project.hero_images} title={project.title} />

      {/* Header */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">{project.complexity}</Badge>
          {project.github_stars > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-current" />
              {project.github_stars}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{project.tagline}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Problem */}
      {project.problem_solved && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">The Problem</h2>
          <p className="text-muted-foreground">{project.problem_solved}</p>
        </section>
      )}

      {/* Key Outcomes */}
      {project.key_outcomes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Key Outcomes</h2>
          <ul className="space-y-2">
            {project.key_outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Markdown Body */}
      {project.body_markdown && (
        <section className="mb-8 prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{project.body_markdown}</ReactMarkdown>
        </section>
      )}

      {/* CTA */}
      <section className="mt-12 p-6 bg-muted rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to discuss a similar solution?</h2>
        <p className="text-muted-foreground mb-4">
          Let's explore how AI automation can help your business.
        </p>
        <Button size="lg" asChild>
          <a href="https://cushlabs.ai/contact">Schedule a Consultation</a>
        </Button>
      </section>
    </div>
  );
}
```

---

## STEP 7: PAGES

### `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | CushLabs',
    default: 'CushLabs - AI Consulting & Automation',
  },
  description: 'AI automation solutions for SMBs in Mexico and LATAM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
```

### `src/app/page.tsx`

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">CushLabs.ai</h1>
      <p className="text-xl text-muted-foreground mb-8">
        AI Consulting & Automation for SMBs
      </p>
      <Button size="lg" asChild>
        <Link href="/portfolio">View Portfolio</Link>
      </Button>
    </div>
  );
}
```

### `src/app/portfolio/page.tsx`

```typescript
import { Suspense } from 'react';
import { getPortfolioProjects } from '@/lib/portfolio/loader';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Portfolio',
  description: 'AI automation projects and solutions by CushLabs',
};

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-lg" />
      ))}
    </div>
  );
}

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">
          AI-powered solutions and automation projects
        </p>
      </div>

      <Suspense fallback={<LoadingGrid />}>
        <PortfolioGrid projects={projects} />
      </Suspense>
    </div>
  );
}
```

### `src/app/portfolio/[slug]/page.tsx`

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolioProjects, getProjectBySlug } from '@/lib/portfolio/loader';
import { PortfolioDetail } from '@/components/portfolio/PortfolioDetail';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getPortfolioProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-8">
      <PortfolioDetail project={project} />
    </div>
  );
}
```

### `src/app/portfolio/[slug]/not-found.tsx`

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The project you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link href="/portfolio">Back to Portfolio</Link>
      </Button>
    </div>
  );
}
```

---

## STEP 8: CONFIGURATION FILES

### `.env.example`

```
# GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
# Required scope: public_repo
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
```

### Create placeholder `content/portfolio.json`

```json
{
  "generated_at": "",
  "projects": []
}
```

---

## STEP 9: TEST THE BUILD

```powershell
# 1. Set up environment
copy .env.example .env.local
# Edit .env.local and add your GITHUB_TOKEN

# 2. Run sync (after adding PORTFOLIO.md to at least one repo)
pnpm sync

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000/portfolio
```

---

## IMPLEMENTATION ORDER

1. **Run initialization commands** (Step 1)
2. **Create all files** in order (Steps 2-8)
3. **Add PORTFOLIO.md** to at least one GitHub repo
4. **Run sync** and test
5. **Fix any TypeScript errors**
6. **Test responsive layout**

---

## CRITICAL NOTES

- **No `any` types** — Use proper interfaces everywhere
- **Server Components by default** — Only add `"use client"` when needed
- **Static generation** — Use `generateStaticParams` for dynamic routes
- **Don't modify** files in `src/components/ui/` — Create wrappers instead
- **Don't edit** `content/portfolio.json` — It's generated by sync
- **Run `pnpm sync`** before `pnpm build` to ensure data exists

---

## SUCCESS CRITERIA

✅ `pnpm sync` populates `content/portfolio.json`  
✅ `/portfolio` displays project cards in responsive grid  
✅ Category filter and sort work correctly  
✅ `/portfolio/[slug]` shows full project details  
✅ Image carousel works with navigation  
✅ External links open in new tabs  
✅ `pnpm build` completes without errors  
✅ TypeScript strict mode passes

---

**BEGIN IMPLEMENTATION NOW. Start with Step 1 (project initialization), then proceed through each step sequentially.**