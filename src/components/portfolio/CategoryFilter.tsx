'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { t, type Locale } from '@/i18n';
import type { PortfolioCategory } from '@/lib/portfolio/types';

interface CategoryFilterProps {
  value: PortfolioCategory | 'all' | 'featured';
  onChange: (value: string) => void;
  locale: Locale;
}

export function CategoryFilter({ value, onChange, locale }: CategoryFilterProps) {
  const dict = t(locale);

  const CATEGORIES: Array<{ value: PortfolioCategory | 'all' | 'featured'; label: string }> = [
    { value: 'all', label: dict.cat_all },
    { value: 'featured', label: dict.cat_featured },
    { value: 'AI Automation', label: 'AI Automation' },
    { value: 'Developer Tools', label: 'Dev Tools' },
    { value: 'Templates', label: 'Templates' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Client Work', label: 'Client Work' },
    { value: 'Games', label: 'Games' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Creative', label: 'Creative' },
  ];

  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="h-auto sm:flex-wrap max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:scrollbar-none">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
