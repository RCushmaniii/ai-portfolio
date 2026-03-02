'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { t, getLocaleFromPathname, getLocalizedPath } from '@/i18n';

export default function PortfolioError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const dict = t(locale);

  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">{dict.error_title}</h2>
      <p className="text-muted-foreground mb-8">{dict.error_description}</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>{dict.error_try_again}</Button>
        <Button variant="outline" asChild>
          <Link href={getLocalizedPath('/', locale)}>{dict.error_go_home}</Link>
        </Button>
      </div>
    </div>
  );
}
