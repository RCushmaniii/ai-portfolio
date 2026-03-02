'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { t, getLocalizedPath, type Locale } from '@/i18n';

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname();
  const dict = t(locale);

  const navLinks = [
    { href: getLocalizedPath('/', locale), label: dict.nav_home },
    { href: getLocalizedPath('/portfolio', locale), label: dict.nav_portfolio },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-2 font-bold text-lg">
          CUSH<span className="text-[#FF6A3D]">LABS</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.href === getLocalizedPath('/', locale)
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <LanguageToggle locale={locale} />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
