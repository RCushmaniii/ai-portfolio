# SKILL: Next.js 14 App Router Patterns

> Reference guide for Next.js App Router conventions used in this project.

## File-Based Routing

```
src/app/
├── layout.tsx          # Root layout (wraps all pages)
├── page.tsx            # Home page (/)
├── globals.css         # Global styles
├── portfolio/
│   ├── page.tsx        # /portfolio
│   └── [slug]/
│       └── page.tsx    # /portfolio/:slug (dynamic)
```

## Page Component Pattern

```typescript
// Server Component (default) - can fetch data directly
// src/app/portfolio/page.tsx

import { getPortfolioProjects } from '@/lib/portfolio/loader';

export const metadata = {
  title: 'Portfolio | CushLabs',
  description: 'AI automation projects and solutions',
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();
  
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>
      <PortfolioGrid projects={projects} />
    </main>
  );
}
```

## Dynamic Routes with Static Generation

```typescript
// src/app/portfolio/[slug]/page.tsx

import { getPortfolioProjects, getProjectBySlug } from '@/lib/portfolio/loader';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Generate all possible slug values at build time
export async function generateStaticParams() {
  const projects = await getPortfolioProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.title} | CushLabs Portfolio`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export default async function ProjectPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }
  
  return <PortfolioDetail project={project} />;
}
```

## Layout Pattern

```typescript
// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | CushLabs',
    default: 'CushLabs - AI Consulting',
  },
  description: 'AI automation solutions for SMBs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

## Client Components

Use `"use client"` directive only when needed:

```typescript
// src/components/portfolio/CategoryFilter.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'ai-automation', label: 'AI Automation' },
  { value: 'templates', label: 'Templates' },
  { value: 'tools', label: 'Tools' },
];

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentCategory = searchParams.get('category') || 'all';
  
  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  return (
    <Tabs value={currentCategory} onValueChange={handleCategoryChange}>
      <TabsList>
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

## Data Fetching Pattern

```typescript
// src/lib/portfolio/loader.ts

import portfolioData from '@/content/portfolio.json';
import type { PortfolioProject, PortfolioData } from './types';

// Type assertion for imported JSON
const data = portfolioData as PortfolioData;

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  // In real app, this could be async (reading from file, etc.)
  return data.projects;
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const projects = await getPortfolioProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const projects = await getPortfolioProjects();
  return projects.filter((p) => p.portfolio_featured);
}
```

## Error Handling

```typescript
// src/app/portfolio/[slug]/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The project you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/portfolio">Back to Portfolio</Link>
      </Button>
    </div>
  );
}
```

## Loading States

```typescript
// src/app/portfolio/loading.tsx

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

## Image Optimization

```typescript
import Image from 'next/image';

// For known dimensions (recommended)
<Image
  src={project.thumbnail}
  alt={project.title}
  width={400}
  height={225}
  className="object-cover"
/>

// For fill mode (when dimensions unknown)
<div className="relative aspect-video">
  <Image
    src={project.thumbnail}
    alt={project.title}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>

// For external images, add domain to next.config.ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};
```

## Link Component

```typescript
import Link from 'next/link';

// Internal navigation
<Link href="/portfolio" className="hover:underline">
  Portfolio
</Link>

// With dynamic segment
<Link href={`/portfolio/${project.slug}`}>
  View Project
</Link>

// External link (use regular <a>)
<a 
  href={project.live_url} 
  target="_blank" 
  rel="noopener noreferrer"
>
  View Live
</a>
```

## Common Mistakes to Avoid

| Mistake | Problem | Solution |
|---------|---------|----------|
| `"use client"` on page.tsx | Breaks static generation | Keep pages as server components |
| `useState` in server component | Runtime error | Move state to client component |
| `useEffect` for data fetching | Unnecessary in App Router | Use async server components |
| Missing `generateStaticParams` | Dynamic routes won't pre-render | Always define for [slug] routes |
| Direct JSON import without types | No type safety | Cast to typed interface |
