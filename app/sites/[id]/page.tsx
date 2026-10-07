import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, CalendarClock, CloudRain, Gauge, Info, ArrowRight } from 'lucide-react';
import { AttentionStatus } from '@/components/attention-status';
import { StatTile } from '@/components/ui/stat-tile';
import { PhotoFrame } from '@/components/ui/photo-frame';
import { SiteImage } from '@/components/ui/site-image';
import { buttonClasses } from '@/components/ui/button';
import { getMockSite, getMockSiteDetail, type GapLevel } from '@/lib/mock-data';
import { fetchSiteView } from '@/lib/sites-api';
import { EcosystemPanel } from '@/components/site/ecosystem-panel';
import { SaveSiteButton } from '@/components/site/save-site-button';
import { TrackView } from '@/components/track-view';

const GAP_META: Record<GapLevel, { label: string; accent: string }> = {
  high: { label: 'High', accent: 'var(--urgent)' },
  medium: { label: 'Medium', accent: 'var(--attention)' },
  low: { label: 'Low', accent: 'var(--success)' },
};

/**
 * C2 — Site attention card. "Why this site, now."
 * Three hero numbers (days since check, rain 48 h, data gap) + a plain-language
 * reason + a photo strip, leading into the mission.
 */
export default async function SitePage({ params }: { params: { id: string } }) {
  const view = await fetchSiteView(params.id);
  const site = view?.site ?? getMockSite(params.id);
  const detail = view?.detail ?? getMockSiteDetail(params.id);
  if (!site || !detail) notFound();

  const gap = GAP_META[detail.gapLevel];

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-36">
      <TrackView name="site_viewed" meta={{ id: params.id }} />
      {/* Hero */}
      <div className="relative">
        <SiteImage
          siteId={site.id}
          aspect="wide"
          label={`${site.name}, ${detail.city}`}
          className="rounded-none md:rounded-b-card"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <Link
            href="/"
            aria-label="Back to map"
            className="rk-glass flex h-10 w-10 items-center justify-center rounded-full text-ink"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="flex gap-2">
            <SaveSiteButton siteId={site.id} />
            <button aria-label="More" className="rk-glass flex h-10 w-10 items-center justify-center rounded-full text-ink">
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pt-5">
        <div>
          <AttentionStatus level={site.attention} />
          <h1 className="font-display mt-1.5 text-[clamp(1.35rem,4.5vw,1.65rem)] font-semibold text-ink">
            {site.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {site.waterbody} · {detail.city}, {detail.country}
          </p>
        </div>

        {/* Three KPIs — each links to the metric's underlying data (the timeline). */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatTile
            value={site.daysUnseen}
            label="Days since check"
            Icon={CalendarClock}
            accent={site.daysUnseen > 14 ? 'var(--urgent)' : undefined}
            href={`/timeline/${site.id}`}
            trend={site.daysUnseen > 14 ? 'up' : site.daysUnseen <= 3 ? 'down' : 'flat'}
            trendLabel="Check history"
          />
          <StatTile
            value={detail.rain48h}
            unit="mm"
            label="Rain last 48 h"
            Icon={CloudRain}
            accent="var(--water)"
            href={`/timeline/${site.id}`}
            trend={detail.rain48h >= 10 ? 'up' : 'flat'}
            trendLabel="Open-Meteo"
          />
          <StatTile
            value={gap.label}
            label="Data gap"
            Icon={Gauge}
            accent={gap.accent}
            href={`/timeline/${site.id}`}
            trend={detail.gapLevel === 'high' ? 'up' : detail.gapLevel === 'low' ? 'down' : 'flat'}
            trendLabel="Ecosystem data"
          />
        </div>

        {/* Why this site */}
        <div className="flex gap-3 rounded-card border border-unseen bg-[var(--action-tint)] p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">Why this site?</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{detail.reason}</p>
          </div>
        </div>

        {/* Real OneAquaHealth ecosystem baseline (ecology + One Health risk) */}
        {view ? (
          <EcosystemPanel
            ecology={view.ecology}
            healthRisk={view.healthRisk}
            biodiversity={view.biodiversity}
            discharge={view.discharge}
            attribution={view.attribution}
          />
        ) : null}

        {/* Timeline link */}
        <Link
          href={`/timeline/${site.id}`}
          className="flex items-center justify-between rounded-card border border-unseen bg-surface px-4 py-3 text-sm font-semibold text-ink hover:border-water"
        >
          View site timeline
          <ArrowRight className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
        </Link>

        {/* Photo strip */}
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Recent photos
          </p>
          <div className="flex gap-2">
            <PhotoFrame aspect="square" className="w-20 shrink-0" />
            <PhotoFrame aspect="square" className="w-20 shrink-0" />
            <PhotoFrame aspect="square" className="w-20 shrink-0" />
            <div className="flex w-20 shrink-0 items-center justify-center rounded-card border border-unseen bg-surface text-sm font-semibold text-ink-muted">
              +{Math.max(detail.photoCount - 3, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-unseen bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
        <div className="mx-auto max-w-md">
          <Link href={`/missions/${site.id}`} className={buttonClasses('primary', 'cta')}>
            Go check it
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
