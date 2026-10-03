'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { fetchSites } from '@/lib/sites-api';
import { mockSites } from '@/lib/mock-data';

/**
 * Guided-tour state. The tour is a step-driven walkthrough of the whole loop
 * (map → site → brief → check → receipt → impact → verify). State is kept in
 * localStorage so it survives the route changes the tour itself drives.
 */

const ACTIVE_KEY = 'rk_tour_active';
const STEP_KEY = 'rk_tour_step';
const SITE_KEY = 'rk_tour_site';
const DONE_KEY = 'rk_tour_done';

export const TOUR_LENGTH = 7;

interface GuideState {
  active: boolean;
  step: number;
  siteId: string | null;
  start: () => void;
  end: () => void;
  setStep: (n: number) => void;
}

const GuideContext = createContext<GuideState | null>(null);

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Has the viewer already finished (or skipped) the guided tour? */
export function hasCompletedTour(): boolean {
  return read(DONE_KEY) === '1';
}

export function GuideProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [step, setStepState] = useState(0);
  const [siteId, setSiteId] = useState<string | null>(null);

  // Restore an in-progress tour on mount (it drives navigation, so it must
  // survive full route changes).
  useEffect(() => {
    if (read(ACTIVE_KEY) === '1') {
      setActive(true);
      setStepState(Number(read(STEP_KEY) ?? '0') || 0);
      setSiteId(read(SITE_KEY));
    }
  }, []);

  const resolveSite = useCallback(() => {
    void fetchSites()
      .then((sites) => {
        const first = (sites && sites[0]) ?? mockSites[0];
        if (first) {
          setSiteId(first.id);
          write(SITE_KEY, first.id);
        }
      })
      .catch(() => {
        const fallback = mockSites[0]?.id ?? null;
        setSiteId(fallback);
        if (fallback) write(SITE_KEY, fallback);
      });
  }, []);

  const start = useCallback(() => {
    setActive(true);
    setStepState(0);
    write(ACTIVE_KEY, '1');
    write(STEP_KEY, '0');
    resolveSite();
  }, [resolveSite]);

  const end = useCallback(() => {
    setActive(false);
    remove(ACTIVE_KEY);
    remove(STEP_KEY);
    write(DONE_KEY, '1');
  }, []);

  const setStep = useCallback((n: number) => {
    setStepState(n);
    write(STEP_KEY, String(n));
  }, []);

  return (
    <GuideContext.Provider value={{ active, step, siteId, start, end, setStep }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide(): GuideState {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error('useGuide must be used within GuideProvider');
  return ctx;
}
