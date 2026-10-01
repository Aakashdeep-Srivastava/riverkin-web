import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ScreenHeader } from '@/components/screen-header';
import { MapPlaceholder } from '@/components/map-placeholder';
import { AttentionStatus } from '@/components/attention-status';
import { SiteFooter } from '@/components/site-footer';
import { mockSites } from '@/lib/mock-data';

/**
 * C1 — Attention map.
 * Full-screen map (placeholder here) + an accessible list of the same sites.
 */
export default function HomePage() {
  // Sort most-unseen first so the list leads with what needs a look.
  const sites = [...mockSites].sort((a, b) => b.daysUnseen - a.daysUnseen);

  return (
    <main className="mx-auto max-w-2xl">
      <ScreenHeader
        title="River attention"
        subtitle="Sites near you, ordered by how long they've gone unseen."
        aiStatus="Scanning 4 sites"
      />

      <div className="px-4 pt-4">
        <MapPlaceholder />
      </div>

      <section aria-labelledby="site-list-heading" className="px-4 pt-6">
        <h2 id="site-list-heading" className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Sites
        </h2>
        <ul className="mt-2 space-y-2">
          {sites.map((site) => (
            <li key={site.id}>
              <Link
                href={`/status/${site.id}`}
                className="flex min-h-tap items-center justify-between gap-3 rounded-card border border-unseen bg-surface p-4 hover:border-water"
              >
                <div>
                  <p className="font-semibold text-ink">{site.name}</p>
                  <p className="text-sm text-ink-muted">
                    {site.waterbody} ·{' '}
                    {site.daysUnseen === 0 ? 'seen today' : `${site.daysUnseen} days unseen`}
                  </p>
                  <AttentionStatus level={site.attention} className="mt-1.5" />
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
