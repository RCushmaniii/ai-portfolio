'use client';

import { FeaturedCard } from './FeaturedCard';
import type { Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface FeaturedShowcaseProps {
  projects: PortfolioProject[];
  locale: Locale;
}

export function FeaturedShowcase({ projects, locale }: FeaturedShowcaseProps) {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project) => (
        <FeaturedCard key={project.slug} project={project} locale={locale} />
      ))}
    </div>
  );
}
