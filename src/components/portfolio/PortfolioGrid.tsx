'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PortfolioCard } from './PortfolioCard';
import { CategoryFilter } from './CategoryFilter';
import { SortSelect } from './SortSelect';
import { SearchInput } from './SearchInput';
import { filterProjects, sortProjects, searchProjects } from '@/lib/portfolio/filters';
import type { PortfolioProject, PortfolioCategory, SortOption } from '@/lib/portfolio/types';

const VALID_CATEGORIES: ReadonlySet<string> = new Set([
  'all', 'featured', 'AI Automation', 'Templates', 'Tools', 'Developer Tools',
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
  const search = searchParams.get('search') || '';
  const category: PortfolioCategory | 'all' | 'featured' = VALID_CATEGORIES.has(rawCategory)
    ? (rawCategory as PortfolioCategory | 'all' | 'featured')
    : 'all';
  const sort: SortOption = VALID_SORTS.has(rawSort)
    ? (rawSort as SortOption)
    : 'priority';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const defaults: Record<string, string> = { category: 'all', sort: 'priority', search: '' };
    if (value === defaults[key] || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredAndSorted = useMemo(() => {
    const searched = searchProjects(projects, search);
    const filtered = filterProjects(searched, category);
    return sortProjects(filtered, sort);
  }, [projects, search, category, sort]);

  const isFiltered = search.length > 0 || category !== 'all';

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={(value) => updateParams('search', value)}
          resultCount={filteredAndSorted.length}
          totalCount={projects.length}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <CategoryFilter
          value={category}
          onChange={(value) => updateParams('category', value)}
        />
        <SortSelect
          value={sort}
          onChange={(value) => updateParams('sort', value)}
        />
      </div>

      {/* Project count */}
      <div className="text-sm text-muted-foreground mb-6">
        Showing {filteredAndSorted.length} of {projects.length} projects
      </div>

      {/* Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            {search
              ? `No projects found matching "${search}".`
              : 'No projects found in this category.'}
          </p>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
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
