'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PortfolioCard } from './PortfolioCard';
import { CategoryFilter } from './CategoryFilter';
import { SortSelect } from './SortSelect';
import { filterProjects, sortProjects } from '@/lib/portfolio/filters';
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
