'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Droplets, Lock } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api';
import type { ApiExpertItem } from '@/lib/researcher-api';
import { FhirViewer } from './fhir-viewer';

/**
 * Expert review queue + FHIR viewer. Client-side because the queue is RBAC-gated
 * (researcher only, see app/routers/expert.py) and the bearer token lives in the
 * browser — a server component can't carry it. On 401/403 we show a sign-in gate
 * rather than a misleading empty queue; other failures fall back to empty
 * (API unreachable) so the page never breaks.
 */
type State =
  | { status: 'loading' }
  | { status: 'gate' }
  | { status: 'ok'; items: ApiExpertItem[] };

export function ExpertQueue() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiFetch<{ items: ApiExpertItem[] }>('/api/v1/expert/queue');
        if (active) setState({ status: 'ok', items: data.items ?? [] });
      } catch (e) {
        if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
          if (active) setState({ status: 'gate' });
        } else if (active) {
          setState({ status: 'ok', items: [] });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Expert queue
        </h2>
        <p className="mt-2 rounded-card border border-dashed border-unseen bg-surface p-4 text-sm text-ink-muted">
          Loading the review queue…
        </p>
      </div>
    );
  }

  if (state.status === 'gate') {
    return (
      <div className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Expert queue
        </h2>
        <div className="mt-2 rounded-card border border-unseen bg-surface p-5 text-center">
          <Lock className="mx-auto h-6 w-6 text-ink-muted" aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold text-ink">Researcher sign-in required</p>
          <p className="mt-1 text-sm text-ink-muted">
            The expert review queue is restricted to researcher accounts.
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex min-h-tap items-center justify-center rounded-button bg-water px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Sign in as a researcher
          </Link>
        </div>
      </div>
    );
  }

  const items = state.items;
  const firstObsId = items[0]?.observation_id ?? null;

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Expert queue ({items.length})
        </h2>
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {items.map((item) => (
            <li key={item.observation_id} className="rounded-card border border-unseen bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{item.site_name}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--urgent)_12%,var(--surface))] px-2.5 py-0.5 text-xs font-semibold text-[var(--urgent)]">
                  {item.pipe_flag ? <Droplets className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {item.reason}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                Observation #{item.observation_id} · {item.verifier_count} verifier
                {item.verifier_count === 1 ? '' : 's'}
                {item.trust != null ? ` · trust ${(item.trust * 100).toFixed(0)}%` : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-card border border-dashed border-unseen bg-surface p-4 text-sm text-ink-muted">
          No observations awaiting expert review. Pipe/sewage flags and split votes appear here.
        </p>
      )}

      <FhirViewer observationId={firstObsId} />
    </>
  );
}
