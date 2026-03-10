'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { t, type Locale } from '@/i18n';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  locale: Locale;
}

export function SearchInput({ value, onChange, resultCount, totalCount, locale }: SearchInputProps) {
  const dict = t(locale);
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g. URL param reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onChange('');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showCount = value.length > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={dict.portfolio_search_placeholder}
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-9 pr-9 bg-muted/50 border-muted-foreground/20"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {resultCount} {dict.portfolio_of} {totalCount} {dict.portfolio_projects}
        </span>
      )}
    </div>
  );
}
