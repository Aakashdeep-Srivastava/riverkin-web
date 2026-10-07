import { Fish, Bug, Microscope, HeartPulse, FlaskConical, Sprout, Waves } from 'lucide-react';
import type { Biodiversity, Discharge, Ecology, HealthRisk } from '@/lib/sites-api';

/**
 * Real OneAquaHealth baseline for a site: biological/chemical ecological status
 * (WFD classes, "one out, all out") and the One Health risk score. Status is
 * colour + icon + label (never colour alone — WCAG). Source labelled below.
 */

const ELEMENT_META: Record<string, { label: string; Icon: typeof Fish }> = {
  macroinvertebrates: { label: 'Macroinvertebrates', Icon: Bug },
  diatoms: { label: 'Diatoms', Icon: Microscope },
  fish: { label: 'Fish', Icon: Fish },
};

function sampledOn(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

/** Minimal inline sparkline for the discharge series (no chart lib). */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 72;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" stroke="var(--water)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EcosystemPanel({
  ecology,
  healthRisk,
  biodiversity,
  discharge,
  attribution,
}: {
  ecology: Ecology | null;
  healthRisk: HealthRisk | null;
  biodiversity?: Biodiversity | null;
  discharge?: Discharge | null;
  attribution: string | null;
}) {
  if (!ecology && !healthRisk && !biodiversity && !discharge) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
        Ecosystem health
      </h2>

      {ecology ? (
        <div className="rounded-card border border-unseen bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Ecological status</p>
            {ecology.status ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white"
                style={{ background: ecology.color }}
              >
                {ecology.status}
              </span>
            ) : (
              <span className="text-xs text-ink-muted">Sampled</span>
            )}
          </div>

          <ul className="mt-3 grid grid-cols-3 gap-2">
            {ecology.elements.map((el) => {
              const meta = ELEMENT_META[el.element] ?? { label: el.element, Icon: Bug };
              const Icon = meta.Icon;
              return (
                <li
                  key={el.element}
                  className="flex flex-col items-center gap-1 rounded-xl border border-unseen bg-[var(--bg)] p-2 text-center"
                >
                  <Icon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-ink-muted">{meta.label}</span>
                  <span className="text-xs font-semibold text-ink">
                    {el.quality ?? '—'}
                    {el.richness != null ? (
                      <span className="font-normal text-ink-muted"> · {el.richness} taxa</span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>

          {ecology.nitrate != null ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Nitrate {ecology.nitrate} mg/L
              {sampledOn(ecology.date) ? <span>· {sampledOn(ecology.date)}</span> : null}
            </p>
          ) : null}
        </div>
      ) : null}

      {healthRisk ? (
        <div className="rounded-card border border-unseen bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <HeartPulse className="h-4 w-4" aria-hidden="true" style={{ color: healthRisk.color }} />
              One Health risk
            </p>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize text-white"
              style={{ background: healthRisk.color }}
            >
              {healthRisk.band}
            </span>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-ink-muted">
            {healthRisk.pathogen != null ? <span>Pathogen {healthRisk.pathogen}</span> : null}
            {healthRisk.fecal != null ? <span>Faecal {healthRisk.fecal}</span> : null}
            {healthRisk.arg != null ? <span>AMR {healthRisk.arg}</span> : null}
          </div>
        </div>
      ) : null}

      {biodiversity ? (
        <div className="rounded-card border border-unseen bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Sprout className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
              Biodiversity nearby
            </p>
            <span className="text-xs text-ink-muted">within {biodiversity.radius_km} km</span>
          </div>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="text-2xl font-bold tabular-nums text-ink">
              {biodiversity.species_richness}
              <span className="ml-1 text-xs font-normal text-ink-muted">species</span>
            </span>
            <span className="text-sm tabular-nums text-ink-muted">
              {biodiversity.occurrences} records
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-muted">{biodiversity.indicator}</p>
          <p className="mt-2 text-[11px] text-ink-muted">{biodiversity.attribution}</p>
        </div>
      ) : null}

      {discharge ? (
        <div className="rounded-card border border-unseen bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <Waves className="h-4 w-4 text-[var(--water)]" aria-hidden="true" />
              River discharge
            </p>
            <Sparkline values={discharge.series.map((p) => p.value)} />
          </div>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="text-2xl font-bold tabular-nums text-ink">
              {discharge.latest_m3s}
              <span className="ml-1 text-xs font-normal text-ink-muted">m³/s</span>
            </span>
            <span className="text-sm tabular-nums text-ink-muted">
              30-day avg {discharge.mean_30d_m3s} m³/s
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-muted">{discharge.grid_note}</p>
          <p className="mt-2 text-[11px] text-ink-muted">{discharge.attribution}</p>
        </div>
      ) : null}

      {attribution ? (
        <p className="text-[11px] leading-relaxed text-ink-muted">{attribution}</p>
      ) : null}
    </section>
  );
}
