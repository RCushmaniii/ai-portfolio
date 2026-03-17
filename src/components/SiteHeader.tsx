'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { t, getLocalizedPath, type Locale } from '@/i18n';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname();
  const dict = t(locale);
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: getLocalizedPath('/featured', locale), label: dict.nav_featured },
    { href: getLocalizedPath('/portfolio', locale), label: dict.nav_portfolio },
  ];

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href={getLocalizedPath('/', locale)} className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo.png" alt="CushLabs" width={28} height={28} className="flex-shrink-0" />
          <span>CUSH<span className="text-cush-orange">LABS</span> <span className="font-normal text-muted-foreground">Portfolio</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-2 text-sm rounded-md transition-colors ${
                isActive(link.href)
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle locale={locale} />
          <ThemeToggle />
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                aria-label={dict.mobile_menu_title}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left font-bold text-lg flex items-center gap-2">
                  <Image src="/logo.png" alt="CushLabs" width={24} height={24} />
                  <span>CUSH<span className="text-cush-orange">LABS</span> <span className="font-normal text-muted-foreground">Portfolio</span></span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-6">
                {/* Navigation links */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {dict.mobile_menu_navigation}
                  </p>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive(link.href)
                            ? 'bg-accent text-accent-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Settings */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    {dict.mobile_menu_settings}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm text-muted-foreground">{dict.mobile_menu_language}</span>
                      <LanguageToggle locale={locale} />
                    </div>
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm text-muted-foreground">{dict.mobile_menu_theme}</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
