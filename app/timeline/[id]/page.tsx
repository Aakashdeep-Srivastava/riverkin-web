import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CircleCheck, CloudRain, ClipboardCheck, ShieldQuestion } from 'lucide-react';
import { fetchTimeline, fetchSiteView, type TimelineEntry } from '@/lib/sites-api';
import { getMockSite } from '@/lib/mock-data';

const KIND_META: Record<string, { Icon: typeof CircleCheck; accent: string }> = {
  verification: { Icon: CircleCheck, accent: 'var(--success)' },
  check: { Icon: ClipboardCheck, accent: 'var(--action)' },
  rain: { Icon: CloudRain, accent: 'var(--water)' },
  expert: { Icon: ShieldQuestion, accent: 'var(--attention)' },
};

function fmt(at: string): string {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * C7 — Site timeline. A vertical history of checks, verifications and rain
 * events for a site (newest first), with a short "what changed" summary.
 */
export default async function TimelinePage({ params }: { params: { id: string } }) {
  const [entries, view] = await Promise.all([fetchTimeline(params.id), fetchSiteView(params.id)]);
  const site = view?.site ?? getMockSite(params.id);
  if (!site) notFound();

  const items: TimelineEntry[] = entries ?? [];
  const verifications = items.filter((e) => e.kind === 'verification').length;
  const checks = items.filter((e) => e.kind === 'check').length;

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-24">
      <header className="flex items-center gap-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        <Link
          href={`/sites/${encodeURIComponent(site.id)}`}
          aria-label="Back to site"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-unseen text-ink"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">Timeline</p>
          <h1 className="text-lg font-bold leading-tight text-ink">{site.name}</h1>
        </div>
      </header>

      {/* What changed */}
      <div className="mt-5 rounded-card border border-unseen bg-[var(--action-tint)] p-4">
        <p className="text-sm font-semibold text-ink">What changed?</p>
        <p className="mt-1 text-sm text-ink-muted">
          {items.length === 0
            ? 'No recorded activity yet. Be the first to check this site.'
            : `${checks} ${checks === 1 ? 'check' : 'checks'} and ${verifications} community ${
                verifications === 1 ? 'verification' : 'verifications'
              } on record.`}
        </p>
      </div>

      {/* Vertical timeline */}
      <ol className="mt-6 space-y-0">
        {items.map((e, i) => {
          const meta = KIND_META[e.kind] ?? KIND_META.check;
          const Icon = meta.Icon;
          const last = i === items.length - 1;
          return (
            <li key={`${e.at}-${i}`} className="relative flex gap-4 pb-6">
              {!last ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[19px] top-10 bottom-0 w-px bg-unseen"
                />
              ) : null}
              <span
                className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-unseen bg-surface"
                style={{ color: meta.accent }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="pt-1.5">
                <p className="font-semibold text-ink">{e.label}</p>
                <p className="text-sm text-ink-muted">{fmt(e.at)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
