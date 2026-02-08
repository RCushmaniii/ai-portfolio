import type { PortfolioProject, PortfolioCategory, SortOption } from './types';

export function filterProjects(
  projects: PortfolioProject[],
  category: PortfolioCategory | 'all'
): PortfolioProject[] {
  if (category === 'all') return projects;
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
