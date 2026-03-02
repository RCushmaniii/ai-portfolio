import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { t, getLocalizedPath, type Locale } from '@/i18n';

interface BreadcrumbProps {
  projectTitle: string;
  locale: Locale;
}

export function Breadcrumb({ projectTitle, locale }: BreadcrumbProps) {
  const dict = t(locale);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link href={getLocalizedPath('/', locale)} className="hover:text-foreground transition-colors">
        {dict.breadcrumb_home}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link href={getLocalizedPath('/portfolio', locale)} className="hover:text-foreground transition-colors">
        {dict.breadcrumb_portfolio}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
        {projectTitle}
      </span>
    </nav>
  );
}
