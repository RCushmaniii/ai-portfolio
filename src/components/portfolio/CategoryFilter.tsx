'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PortfolioCategory } from '@/lib/portfolio/types';

const CATEGORIES: Array<{ value: PortfolioCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'AI Automation', label: 'AI Automation' },
  { value: 'Templates', label: 'Templates' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Client Work', label: 'Client Work' },
];

interface CategoryFilterProps {
  value: PortfolioCategory | 'all';
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="flex-wrap h-auto">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
