'use client';

import { useEffect, useState } from 'react';
import { Download, FileJson } from 'lucide-react';
import { fetchFhirBundle } from '@/lib/researcher-api';

/** Illustrative fallback bundle when the API is unreachable. */
const SAMPLE_BUNDLE = {
  resourceType: 'Bundle',
  type: 'transaction',
  entry: [
    { resource: { resourceType: 'Location', name: 'Sample OAH site' } },
    {
      resource: {
        resourceType: 'Observation',
        status: 'preliminary',
        code: { text: 'Foam/colour/smell' },
      },
    },
    { resource: { resourceType: 'Provenance' } },
  ],
};

/**
 * Live FHIR Bundle viewer + download. Given an observation id it fetches the
 * real transaction Bundle (Observation per field + Provenance) and lets the
 * researcher download it as .json.
 */
export function FhirViewer({ observationId }: { observationId: number | null }) {
  const [bundle, setBundle] = useState<unknown>(SAMPLE_BUNDLE);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (observationId == null) return;
    let active = true;
    void fetchFhirBundle(observationId).then((b) => {
      if (active && b) {
        setBundle(b);
        setLive(true);
      }
    });
    return () => {
      active = false;
    };
  }, [observationId]);

  const json = JSON.stringify(bundle, null, 2);

  function download() {
    const blob = new Blob([json], { type: 'application/fhir+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = observationId ? `riverkin-observation-${observationId}.json` : 'riverkin-bundle.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section aria-labelledby="fhir-heading" className="mt-8">
      <div className="flex items-center justify-between">
        <h2
          id="fhir-heading"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-ink-muted"
        >
          <FileJson className="h-4 w-4" aria-hidden="true" />
          FHIR Bundle {live ? `· observation ${observationId}` : '· sample'}
        </h2>
        <button
          type="button"
          onClick={download}
          className="inline-flex min-h-tap items-center gap-1.5 rounded-button border border-unseen bg-surface px-3 text-sm font-semibold text-ink hover:border-water"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download
        </button>
      </div>
      <pre className="mt-2 max-h-96 overflow-auto rounded-card border border-unseen bg-surface p-4 text-xs text-ink">
        {json}
      </pre>
    </section>
  );
}
