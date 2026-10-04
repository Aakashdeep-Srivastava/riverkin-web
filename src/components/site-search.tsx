'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, MapPin } from 'lucide-react';
import { fetchSites } from '@/lib/sites-api';
import { mockSites } from '@/lib/mock-data';
import type { Site } from '@/lib/api-types';

/**
 * Site search — opens a sheet, loads the live site list once, and filters by
 * name or waterbody as you type. Picking a result routes to that site. Falls
 * back to the bundled sites if the API is unreachable.
 */
export function SiteSearch({ transparent = false }: { transparent?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || sites) return;
    void fetchSites().then((live) => setSites(live ?? (mockSites as unknown as Site[])));
  }, [open, sites]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const term = q.trim().toLowerCase();
  const results = (sites ?? [])
    .filter(
      (s) =>
        !term ||
        s.name.toLowerCase().includes(term) ||
        (s.waterbody ?? '').toLowerCase().includes(term),
    )
    .slice(0, 20);

  function go(id: string) {
    setOpen(false);
    setQ('');
    router.push(`/sites/${id}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search sites"
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink-muted hover:text-ink ${
          transparent ? 'rk-glass' : 'bg-surface'
        }`}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="rk-reveal absolute inset-x-0 top-0 max-h-[85vh] overflow-y-auto rounded-b-3xl border-b border-unseen bg-surface pt-[calc(env(safe-area-inset-top)+0.75rem)]">
            <div className="flex items-center gap-2 px-4 pb-3">
              <Search className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a river or site…"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-unseen text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="border-t border-unseen">
              {results.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg)]"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-[var(--action)]" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{s.name}</span>
                      <span className="block truncate text-xs text-ink-muted">
                        {s.waterbody}
                        {typeof s.daysUnseen === 'number' ? ` · ${s.daysUnseen} days unseen` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {sites && results.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-ink-muted">
                  No sites match “{q}”.
                </li>
              ) : null}
              {!sites ? (
                <li className="px-4 py-8 text-center text-sm text-ink-muted">Loading sites…</li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
