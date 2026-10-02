import { Globe2 } from 'lucide-react';
import { AttentionMap } from '@/components/attention-map';
import { MapLegend } from '@/components/map-legend';

/**
 * The C1 live-map panel: the real MapLibre globe (or its ambient fallback)
 * dressed as a mission-control display — a labelled header, HUD corner
 * brackets, and the attention legend beneath. The map itself stays fully
 * interactive; the brackets are decorative and pointer-transparent.
 */
export function MapPanel() {
  return (
    <section aria-label="Live attention map" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-ink">
          <Globe2 className="h-4 w-4 text-water" aria-hidden="true" />
          Live map
        </h2>
        <span className="text-[12px] text-ink-muted">Satellite globe · auto-orbit</span>
      </div>

      <div className="relative">
        <AttentionMap />
        {/* HUD corner brackets (decorative). */}
        <span aria-hidden="true" className="rk-bracket rk-bracket-tl" />
        <span aria-hidden="true" className="rk-bracket rk-bracket-tr" />
        <span aria-hidden="true" className="rk-bracket rk-bracket-bl" />
        <span aria-hidden="true" className="rk-bracket rk-bracket-br" />
      </div>

      <MapLegend />
    </section>
  );
}
