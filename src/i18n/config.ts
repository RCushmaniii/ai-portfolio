export const LOCALES = ['en', 'es'] as const;
export const DEFAULT_LOCALE = 'en';

export type Locale = (typeof LOCALES)[number];

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
