'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getLocalizedPath, type Locale } from '@/i18n';

interface LanguageToggleProps {
  locale: Locale;
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (target: Locale) => {
    if (target === locale) return;
    // Persist choice in cookie so middleware remembers it
    document.cookie = `locale=${target}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    // Strip /es prefix from current path to get the base path
    const basePath = pathname.replace(/^\/es(\/|$)/, '/');
    const newPath = getLocalizedPath(basePath, target);
    router.push(newPath);
  };

  return (
    <div className="flex items-center rounded-md border text-sm">
      <button
        onClick={() => switchTo('en')}
        className={`px-2 py-1 rounded-l-md transition-colors ${
          locale === 'en'
            ? 'bg-[#FF6A3D] text-white'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => switchTo('es')}
        className={`px-2 py-1 rounded-r-md transition-colors ${
          locale === 'es'
            ? 'bg-[#FF6A3D] text-white'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Cambiar a español"
      >
        ES
      </button>
    </div>
  );
}
