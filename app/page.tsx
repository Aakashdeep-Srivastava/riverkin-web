import { AttentionSummary } from '@/components/attention-summary';
import { MapPanel } from '@/components/map-panel';
import { SiteCard } from '@/components/site-card';
import { SiteFooter } from '@/components/site-footer';
import { LEVEL_RANK } from '@/lib/attention';
import { mockSites } from '@/lib/mock-data';

/**
 * C1 — Attention map ("River Operations Console").
 *
 * A keeper's situational-awareness board: a live globe of river sites, a
 * mission-control summary ledger, the single top-priority site called out, and
 * an accessible, keyboard-reachable list of every site ordered by how long it
 * has gone unseen. Hierarchy follows the design system: River → Attention →
 * Mission → Human → Verification → Impact.
 */
export default function HomePage() {
  // Most-urgent first, then longest-unseen within a level.
  const sites = [...mockSites].sort(
    (a, b) => LEVEL_RANK[a.attention] - LEVEL_RANK[b.attention] || b.daysUnseen - a.daysUnseen,
  );

  const maxDays = sites.reduce((m, s) => Math.max(m, s.daysUnseen), 0);
  const urgentCount = sites.filter((s) => s.attention === 'urgent').length;
  const daysOwed = sites.reduce((sum, s) => sum + s.daysUnseen, 0);

  const [lead, ...rest] = sites;

  return (
    <main className="relative mx-auto max-w-2xl px-4 pb-10">
      {/* Ambient operations-console backdrop (decorative, fixed). */}
      <div aria-hidden="true" className="rk-atmosphere" />

      {/* Command header — the AI identity is a radar glyph + live status only. */}
      <header className="rk-reveal pt-7" style={{ animationDelay: '0ms' }}>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-unseen bg-surface px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          <span className="rk-ping" aria-hidden="true" />
          Scanning {sites.length} sites
        </p>
        <h1 className="text-[clamp(1.9rem,7vw,2.5rem)] font-bold leading-[1.05] tracking-tight text-ink">
          River attention
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-muted">
          Sites near you, ordered by how long they&rsquo;ve gone unseen. Pick the one that needs a
          look and run a quick field check.
        </p>
      </header>

      {/* Mission-control summary ledger. */}
      <div className="rk-reveal mt-6" style={{ animationDelay: '70ms' }}>
        <AttentionSummary urgentCount={urgentCount} daysOwed={daysOwed} siteCount={sites.length} />
      </div>

      {/* Live attention map. */}
      <div className="rk-reveal mt-7" style={{ animationDelay: '100ms' }}>
        <MapPanel />
      </div>

      {/* Top-priority site, called out. */}
      {lead ? (
        <div className="mt-8">
          <SiteCard site={lead} maxDays={maxDays} index={0} featured />
        </div>
      ) : null}

      {/* Every other site, keyboard-reachable. */}
      {rest.length > 0 ? (
        <section aria-labelledby="site-list-heading" className="mt-8">
          <h2
            id="site-list-heading"
            className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted"
          >
            All sites
          </h2>
          <ul className="space-y-3">
            {rest.map((site, i) => (
              <li key={site.id}>
                <SiteCard site={site} maxDays={maxDays} index={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-6">
        <SiteFooter />
      </div>
    </main>
  );
}
