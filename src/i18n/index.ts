import { en } from './translations/en';
import { es } from './translations/es';
import { DEFAULT_LOCALE, type Locale } from './config';

export type { Locale } from './config';
export { LOCALES, DEFAULT_LOCALE, isValidLocale } from './config';

export type TranslationDict = { [K in keyof typeof en]: string };

const dictionaries: Record<Locale, TranslationDict> = { en, es };

/** Get the translation dictionary for a locale */
export function t(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/** Replace {key} placeholders in a template string */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

/** Extract locale from a pathname (e.g. /es/portfolio → 'es', /portfolio → 'en') */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'es') return 'es';
  return 'en';
}

/** Build a localized path: adds /es prefix for Spanish, strips it for English */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove any existing /es prefix
  const cleanPath = path.replace(/^\/es(\/|$)/, '/');
  if (locale === 'es') {
    return `/es${cleanPath === '/' ? '' : cleanPath}`;
  }
  return cleanPath || '/';
}
