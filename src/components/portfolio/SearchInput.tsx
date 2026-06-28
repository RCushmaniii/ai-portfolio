"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { t, type Locale } from "@/i18n";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
  locale: Locale;
}

/**
 * Controlled search box. The parent owns the value and debounces the URL sync,
 * so filtering is instant as you type (no lag on the result count).
 */
export function SearchInput({
  value,
  onChange,
  resultCount,
  totalCount,
  locale,
}: SearchInputProps) {
  const dict = t(locale);
  const showCount = value.length > 0;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={dict.portfolio_search_placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-9 bg-muted/50 border-muted-foreground/20"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {resultCount} {dict.portfolio_of} {totalCount}{" "}
          {dict.portfolio_projects}
        </span>
      )}
    </div>
  );
}
