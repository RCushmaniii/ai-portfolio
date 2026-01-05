import type { PortfolioProject, PortfolioData, PortfolioCategory, SortOption } from './types';

// Import JSON at build time
let portfolioData: PortfolioData;

try {
  portfolioData = require('@/../../content/portfolio.json');
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
