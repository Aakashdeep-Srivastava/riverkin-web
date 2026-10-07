'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { locales, localeNames } from '@/i18n/config';

/**
 * Language switcher — writes the NEXT_LOCALE cookie and reloads so the server
 * re-renders with the chosen locale (src/i18n/request.ts reads the cookie). No
 * route change: this is next-intl's "without i18n routing" setup.
 */
export function LanguageSwitcher() {
  const current = useLocale();
  const t = useTranslations('footer');
  const [pending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        value={current}
        onChange={onChange}
        disabled={pending}
        aria-label={t('language')}
        className="min-h-tap rounded-button border border-unseen bg-surface px-2 py-1 text-xs text-ink"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
