import type { PortfolioProject, PortfolioCategory, SortOption } from './types';

export function searchProjects(
  projects: PortfolioProject[],
  query: string
): PortfolioProject[] {
  const q = query.trim().toLowerCase();
  if (!q) return projects;

  return projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function filterProjects(
  projects: PortfolioProject[],
  category: PortfolioCategory | 'all' | 'featured'
): PortfolioProject[] {
  if (category === 'all') return projects;
  if (category === 'featured') return projects.filter((p) => p.portfolio_featured);
  return projects.filter((p) => p.category === category);
}

export function sortProjects(
  projects: PortfolioProject[],
  sortBy: SortOption,
  orderConfig?: { order: string[] }
): PortfolioProject[] {
  const sorted = [...projects];

  switch (sortBy) {
    case 'priority':
      // Use order config if available, otherwise fall back to portfolio_priority
      if (orderConfig && orderConfig.order.length > 0) {
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
