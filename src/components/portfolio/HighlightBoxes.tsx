import { Check, X, Gift } from 'lucide-react';
import { t, type Locale } from '@/i18n';
import type { PortfolioProject } from '@/lib/portfolio/types';

interface HighlightBoxesProps {
  project: PortfolioProject;
  locale: Locale;
}

export function HighlightBoxes({ project, locale }: HighlightBoxesProps) {
  const dict = t(locale);
  const { good_for, not_for, what_you_get } = project;

  // Don't render if no override data exists
  if (!good_for?.length && !not_for?.length && !what_you_get?.length) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {good_for && good_for.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
          <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-400 mb-3">
            <Check className="h-4 w-4" />
            {dict.detail_good_for}
          </h3>
          <ul className="space-y-2">
            {good_for.map((item, i) => (
              <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {not_for && not_for.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <h3 className="flex items-center gap-2 font-semibold text-red-800 dark:text-red-400 mb-3">
            <X className="h-4 w-4" />
            {dict.detail_not_for}
          </h3>
          <ul className="space-y-2">
            {not_for.map((item, i) => (
              <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <X className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {what_you_get && what_you_get.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <h3 className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-400 mb-3">
            <Gift className="h-4 w-4" />
            {dict.detail_what_you_get}
          </h3>
          <ul className="space-y-2">
            {what_you_get.map((item, i) => (
              <li key={i} className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Gift className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
