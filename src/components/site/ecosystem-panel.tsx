import { Fish, Bug, Microscope, HeartPulse, FlaskConical } from 'lucide-react';
import type { Ecology, HealthRisk } from '@/lib/sites-api';

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

export function EcosystemPanel({
  ecology,
  healthRisk,
  attribution,
}: {
  ecology: Ecology | null;
  healthRisk: HealthRisk | null;
  attribution: string | null;
}) {
  if (!ecology && !healthRisk) return null;

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

      {attribution ? (
        <p className="text-[11px] leading-relaxed text-ink-muted">{attribution}</p>
      ) : null}
    </section>
  );
}
