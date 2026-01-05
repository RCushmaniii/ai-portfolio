# SKILL: shadcn/ui Component Patterns

> Reference guide for using shadcn/ui components in this project.

## Installation

```powershell
# Initialize shadcn/ui (already done in this project)
pnpm dlx shadcn@latest init

# Add individual components as needed
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add skeleton
pnpm dlx shadcn@latest add carousel
```

## Component Location

shadcn/ui components are installed to `src/components/ui/`. These are **your components** — you can modify them, but prefer creating wrapper components instead.

## Core Components for This Project

### Button

```typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// As child (for Link)
import Link from 'next/link';

<Button asChild>
  <Link href="/portfolio">View Portfolio</Link>
</Button>

// With icon
import { ExternalLink } from 'lucide-react';

<Button>
  View Live <ExternalLink className="ml-2 h-4 w-4" />
</Button>
```

### Card

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>

// As a link (clickable card)
import Link from 'next/link';

<Link href={`/portfolio/${project.slug}`} className="block">
  <Card className="h-full transition-colors hover:bg-muted/50">
    {/* Card content */}
  </Card>
</Link>
```

### Badge

```typescript
import { Badge } from '@/components/ui/badge';

// Variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

// Custom colors with className
<Badge className="bg-blue-500 hover:bg-blue-600">AI Automation</Badge>

// Tech stack badges
<div className="flex flex-wrap gap-2">
  {project.tech_stack.map((tech) => (
    <Badge key={tech} variant="secondary">
      {tech}
    </Badge>
  ))}
</div>
```

### Tabs (for Category Filter)

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Basic usage
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="ai-automation">AI Automation</TabsTrigger>
    <TabsTrigger value="templates">Templates</TabsTrigger>
    <TabsTrigger value="tools">Tools</TabsTrigger>
  </TabsList>
  <TabsContent value="all">All projects here</TabsContent>
  <TabsContent value="ai-automation">AI projects here</TabsContent>
</Tabs>

// Controlled (for URL state)
'use client';

const [category, setCategory] = useState('all');

<Tabs value={category} onValueChange={setCategory}>
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    {/* ... */}
  </TabsList>
</Tabs>
```

### Select (for Sort Dropdown)

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select defaultValue="priority">
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="priority">Priority</SelectItem>
    <SelectItem value="recent">Most Recent</SelectItem>
    <SelectItem value="popular">Most Popular</SelectItem>
  </SelectContent>
</Select>

// Controlled
const [sortBy, setSortBy] = useState('priority');

<Select value={sortBy} onValueChange={setSortBy}>
  {/* ... */}
</Select>
```

### Skeleton (for Loading States)

```typescript
import { Skeleton } from '@/components/ui/skeleton';

// Basic shapes
<Skeleton className="h-4 w-[250px]" />        // Text line
<Skeleton className="h-4 w-full" />           // Full width line
<Skeleton className="h-12 w-12 rounded-full" /> // Avatar
<Skeleton className="h-[200px] w-full rounded-lg" /> // Image

// Card skeleton
function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}
```

### Carousel (for Hero Images)

```typescript
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

<Carousel className="w-full">
  <CarouselContent>
    {project.hero_images.map((image, index) => (
      <CarouselItem key={index}>
        <div className="relative aspect-video">
          <Image
            src={image}
            alt={`${project.title} screenshot ${index + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

// Hide controls if only one image
{project.hero_images.length > 1 && (
  <>
    <CarouselPrevious />
    <CarouselNext />
  </>
)}
```

## Composition Patterns

### Portfolio Card Component

```typescript
// src/components/portfolio/PortfolioCard.tsx

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
    <Card className="h-full flex flex-col overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.thumbnail || '/images/fallback-thumbnail.png'}
          alt={project.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {project.portfolio_featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500">
            Featured
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        {/* Category and Stars */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{project.category}</Badge>
          {project.github_stars > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4" />
              {project.github_stars}
            </span>
          )}
        </div>

        {/* Title and Tagline */}
        <h3 className="font-semibold line-clamp-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.tagline}
        </p>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        {/* Tech Stack */}
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

## Styling Guidelines

### Use Tailwind, Not Custom CSS

```typescript
// ❌ Don't create custom CSS classes
<Card className={styles.customCard}>

// ✅ Use Tailwind utilities
<Card className="border-2 border-primary shadow-lg">
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Hide/show based on breakpoint
<span className="hidden md:inline">Full text on desktop</span>
<span className="md:hidden">Short</span>
```

### Dark Mode Support

shadcn/ui components support dark mode automatically if you've configured it. Use semantic color tokens:

```typescript
// ✅ These adapt to dark mode
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<div className="bg-background">Container</div>
<div className="bg-muted">Subtle background</div>
<div className="border-border">Border color</div>

// ❌ Avoid hardcoded colors for text/backgrounds
<p className="text-gray-900">Won't adapt to dark mode</p>
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Importing from wrong path | Always use `@/components/ui/` |
| Missing `"use client"` for interactive components | Add directive when using hooks |
| Forgetting `asChild` for Button with Link | Use `<Button asChild><Link>` |
| Not handling empty states | Check array length before mapping |
| Hardcoding colors | Use Tailwind semantic tokens |
