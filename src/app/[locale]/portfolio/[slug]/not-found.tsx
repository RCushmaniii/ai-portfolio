'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { t, getLocaleFromPathname, getLocalizedPath } from '@/i18n';

export default function NotFound() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dict = t(locale);

  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">{dict.not_found_project_title}</h2>
      <p className="text-muted-foreground mb-8">{dict.not_found_project_description}</p>
      <Button asChild>
        <Link href={getLocalizedPath('/portfolio', locale)}>
          {dict.error_back_portfolio}
        </Link>
      </Button>
    </div>
  );
}
