import type { PortfolioProject, PortfolioData, PortfolioCategory, SortOption, ProjectStatus } from './types';

// Order configuration type
interface PortfolioOrderConfig {
  order: string[];
  featured: string[];
}

// Load order config
let orderConfig: PortfolioOrderConfig = { order: [], featured: [] };
try {
  orderConfig = require('@/../../content/portfolio-order.json');
} catch {
  // No order config, use defaults
}

// Normalize legacy fields to new format
function normalizeProject(raw: Record<string, unknown>): PortfolioProject {
  return {
    portfolio_enabled: raw.portfolio_enabled as boolean,
    portfolio_priority: raw.portfolio_priority as number,
    portfolio_featured: (raw.portfolio_featured as boolean) ?? false,
    title: raw.title as string,
    tagline: raw.tagline as string,
    slug: raw.slug as string,
    category: raw.category as PortfolioCategory,
    tech_stack: raw.tech_stack as string[],
    thumbnail: (raw.thumbnail as string) || '',
    status: (raw.status as ProjectStatus) ||
      (raw.complexity === 'Enterprise' ? 'Production' : raw.complexity as ProjectStatus) ||
      'Production',
    problem: (raw.problem as string) || (raw.problem_solved as string) || '',
    solution: (raw.solution as string) || '',
    key_features: (raw.key_features as string[]) || (raw.key_outcomes as string[]) || [],
    metrics: (raw.metrics as string[]) || [],
    demo_url: (raw.demo_url as string) || '',
    live_url: (raw.live_url as string) || '',
    hero_images: (raw.hero_images as string[]) || [],
    tags: (raw.tags as string[]) || [],
    date_completed: raw.date_completed as string | undefined,
    body_markdown: (raw.body_markdown as string) || '',
    repo_name: raw.repo_name as string,
    repo_url: raw.repo_url as string,
    github_stars: raw.github_stars as number,
    github_forks: raw.github_forks as number,
    github_language: raw.github_language as string | null,
    github_updated_at: raw.github_updated_at as string,
    github_description: (raw.github_description as string) || '',
    github_topics: (raw.github_topics as string[]) || [],
  };
}

// Import JSON at build time
let portfolioData: PortfolioData;

try {
  const rawData = require('@/../../content/portfolio.json');
  const projects = rawData.projects.map(normalizeProject).map((p: PortfolioProject) => ({
    ...p,
    // Override featured flag if in order config
    portfolio_featured: orderConfig.featured.includes(p.slug) || p.portfolio_featured,
  }));
  portfolioData = {
    generated_at: rawData.generated_at,
    projects,
  };
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
      // Use order config if available, otherwise fall back to portfolio_priority
      if (orderConfig.order.length > 0) {
        return sorted.sort((a, b) => {
          const aIndex = orderConfig.order.indexOf(a.slug);
          const bIndex = orderConfig.order.indexOf(b.slug);
          // Projects in order config come first, in specified order
          // Projects not in config are sorted by priority and appear after
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.portfolio_priority - b.portfolio_priority;
        });
      }
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
