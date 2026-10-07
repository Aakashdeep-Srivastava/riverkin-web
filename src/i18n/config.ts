/**
 * Pure i18n constants — safe to import from client components (no server-only
 * imports like next/headers; request.ts re-exports from here).
 */
export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
};

export function resolveLocale(value: string | undefined | null): Locale {
  return (locales as readonly string[]).includes(value ?? '')
    ? (value as Locale)
    : defaultLocale;
}
