'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** Fire a funnel event once when this view mounts (drop into a server page). */
export function TrackView({ name, meta }: { name: string; meta?: Record<string, unknown> }) {
  useEffect(() => {
    track(name, meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
