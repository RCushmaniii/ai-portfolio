'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PortfolioCard } from './PortfolioCard';
import { CategoryFilter } from './CategoryFilter';
import { SortSelect } from './SortSelect';
import { filterProjects, sortProjects } from '@/lib/portfolio/filters';
import type { PortfolioProject, PortfolioCategory, SortOption } from '@/lib/portfolio/types';

const VALID_CATEGORIES: ReadonlySet<string> = new Set([
  'all', 'AI Automation', 'Templates', 'Tools', 'Developer Tools',
  'Client Work', 'Games', 'Marketing', 'Creative',
]);
const VALID_SORTS: ReadonlySet<string> = new Set(['priority', 'recent', 'popular']);

interface PortfolioGridProps {
  projects: PortfolioProject[];
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawCategory = searchParams.get('category') || 'all';
  const rawSort = searchParams.get('sort') || 'priority';
  const category: PortfolioCategory | 'all' = VALID_CATEGORIES.has(rawCategory)
    ? (rawCategory as PortfolioCategory | 'all')
    : 'all';
  const sort: SortOption = VALID_SORTS.has(rawSort)
    ? (rawSort as SortOption)
    : 'priority';

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
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No projects found in this category.
          </p>
          <button
            onClick={() => updateParams('category', 'all')}
            className="text-sm text-primary hover:underline"
          >
            View all projects
          </button>
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
