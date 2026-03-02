'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { t, type Locale } from '@/i18n';
import type { SortOption } from '@/lib/portfolio/types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: string) => void;
  locale: Locale;
}

export function SortSelect({ value, onChange, locale }: SortSelectProps) {
  const dict = t(locale);

  const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
    { value: 'priority', label: dict.sort_priority },
    { value: 'recent', label: dict.sort_recent },
    { value: 'popular', label: dict.sort_popular },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={dict.sort_by} />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
