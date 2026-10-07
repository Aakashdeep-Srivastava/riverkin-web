import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { resolveLocale } from './config';

/**
 * next-intl request config — "App Router without i18n routing" mode. The active
 * locale comes from the NEXT_LOCALE cookie (set by the language switcher), so we
 * avoid restructuring all 23 routes under an [locale] segment. Locale constants
 * live in ./config (client-safe); this module is server-only (next/headers).
 */
export default getRequestConfig(async () => {
  const locale = resolveLocale(cookies().get('NEXT_LOCALE')?.value);
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
