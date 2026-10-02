'use client';

import dynamic from 'next/dynamic';
import { ArrowRight, User, Users, Microscope } from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';

const Globe = dynamic(() => import('@/components/ui/globe'), {
  ssr: false,
  loading: () => null,
});

export type Role = 'keeper' | 'crew_lead' | 'researcher';

const ROLES: { role: Role; label: string; sublabel: string; Icon: typeof User; primary?: boolean }[] = [
  { role: 'keeper', label: 'Continue as Kari', sublabel: 'Keeper · adult volunteer', Icon: User, primary: true },
  { role: 'crew_lead', label: 'Crew Lead', sublabel: 'Teacher-led school crew', Icon: Users },
  { role: 'researcher', label: 'Researcher', sublabel: 'Expert review & export', Icon: Microscope },
];

/**
 * The opening screen: a 3D globe of the five OneAquaHealth cities over a
 * "River Night" gradient, with a demo role picker (no passwords — the PRD uses
 * pseudonymous crews and adult-only accounts). This screen is intentionally the
 * one dark surface; the rest of the app stays on the white theme.
 */
export function Entry({ onEnter }: { onEnter: (role: Role) => void }) {
  return (
    <main
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(130% 80% at 50% -10%, #0e2d4a 0%, #071a2b 55%, #04101c 100%)',
      }}
    >
      {/* Globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[2%] h-[72vh] w-[150vw] max-w-[900px] -translate-x-1/2"
      >
        <Globe className="h-full w-full" />
      </div>

      {/* Headline */}
      <div className="relative z-10 px-6 pt-[calc(env(safe-area-inset-top)+2.25rem)]">
        <div className="rk-reveal flex items-center gap-2">
          <RiverMark className="h-8 w-11" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">
            RiverKin
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-auto px-6 pb-[calc(env(safe-area-inset-bottom)+1.75rem)]">
        <div className="rk-reveal" style={{ animationDelay: '120ms' }}>
          <h1 className="text-[clamp(2rem,9vw,3rem)] font-bold leading-[1.05] tracking-tight text-white">
            Find where the river
            <br />
            needs you.
          </h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
            A living map of 106 urban streams across five European cities. Observe. Verify. Protect.
          </p>
        </div>

        {/* Role picker */}
        <div
          className="rk-reveal mt-7 rounded-card border border-white/10 bg-white/5 p-3 backdrop-blur-md"
          style={{ animationDelay: '220ms' }}
        >
          <p className="px-1 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-white/50">
            Choose how you&rsquo;ll help
          </p>
          <div className="space-y-2">
            {ROLES.map(({ role, label, sublabel, Icon, primary }) => (
              <button
                key={role}
                onClick={() => onEnter(role)}
                className={
                  primary
                    ? 'flex min-h-tap w-full items-center gap-3 rounded-button bg-[var(--action)] px-4 py-3 text-left text-white transition-colors hover:bg-[var(--action-strong)]'
                    : 'flex min-h-tap w-full items-center gap-3 rounded-button border border-white/15 bg-white/5 px-4 py-3 text-left text-white transition-colors hover:border-white/40'
                }
              >
                <span
                  className={
                    primary
                      ? 'flex h-9 w-9 items-center justify-center rounded-full bg-white/20'
                      : 'flex h-9 w-9 items-center justify-center rounded-full bg-white/10'
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{label}</span>
                  <span className="block text-xs text-white/60">{sublabel}</span>
                </span>
                <ArrowRight className="h-5 w-5 opacity-70" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-white/40">
          No passwords · pseudonymous crews · sites from OneAquaHealth
        </p>
      </div>
    </main>
  );
}
