'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Share2, MapPin, CalendarDays, Users, Clock, ChevronRight, Star, ShieldCheck,
  Bird, Bug, Fish, Sprout, Shell, Trash2, Pipette, Waves, Droplets, Droplet, CloudRain,
  Thermometer, Wind, Map as MapIcon, Footprints, Camera, FileText, UploadCloud, Leaf,
  type LucideIcon,
} from 'lucide-react';
import { getChallengeById, getProfile, joinChallenge, type Challenge } from '@/lib/community';
import { CHALLENGE_DETAILS, type IconKey } from '@/lib/challenge-content';
import { markEntered, hasEntered } from '@/lib/entry-state';

const ICON: Record<IconKey, LucideIcon> = {
  bird: Bird, bug: Bug, frog: Fish, plant: Sprout, snail: Shell,
  litter: Trash2, pipe: Pipette, algae: Waves, oil: Droplets, fish: Fish,
  rain: CloudRain, droplet: Droplet, thermometer: Thermometer, wind: Wind, flow: Waves,
  map: MapIcon, run: Footprints, camera: Camera, doc: FileText, upload: UploadCloud, pin: MapPin, leaf: Leaf,
};

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? '');
  const detail = CHALLENGE_DETAILS[id];
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    void getChallengeById(id).then((c) => {
      setChallenge(c);
      setLoading(false);
    });
    void getProfile().then((p) => setJoined(!!p?.joinedIds.includes(id)));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-ink-muted">Loading…</p>
      </main>
    );
  }

  if (!challenge || !detail) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-lg font-bold text-ink">Challenge not found</p>
        <Link href="/challenges" className="font-semibold text-[var(--action)]">Back to Challenges</Link>
      </main>
    );
  }

  const accent = detail.accent;
  const covered = joined ? Math.min(1, challenge.sites) : 0;

  async function join() {
    if (!hasEntered()) markEntered('guest');
    await joinChallenge(id);
    setJoined(true);
    void import('@/lib/analytics').then((m) => m.track('challenge_joined', { id }));
    router.push('/');
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl bg-bg pb-[calc(env(safe-area-inset-bottom)+6.5rem)]">
      {/* Hero */}
      <div
        className="relative min-h-[46dvh] bg-cover bg-center px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
        style={
          detail.bg
            ? { backgroundImage: `url(${detail.bg})` }
            : { background: 'linear-gradient(145deg, #0E4FA0 0%, #0A2A52 100%)' }
        }
      >
        {/* Legibility gradient */}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,16,33,0.35) 0%, rgba(5,16,33,0) 30%, rgba(5,16,33,0.55) 78%, rgba(5,16,33,0.85) 100%)' }} />

        <div className="relative flex items-center justify-between">
          <button type="button" onClick={() => router.back()} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={() => { if (navigator.share) void navigator.share({ title: challenge.title, url: window.location.href }); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow"
          >
            <Share2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mt-[26dvh] text-white">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${accent}E6` }}
          >
            Community Challenge
          </span>
          <h1 className="mt-2 text-[34px] font-extrabold leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{challenge.title}</h1>
          <p className="mt-2 max-w-sm text-[15px] text-white/90 drop-shadow">{challenge.blurb}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pb-5 text-[13px] text-white/90">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{challenge.city}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{challenge.window}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{challenge.joined} joined</span>
          </div>
        </div>
      </div>

      <div className="-mt-6 space-y-5 px-4">
        {/* Progress */}
        <div className="rounded-card border border-unseen bg-surface p-4 shadow-[var(--rk-shadow-lift)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink">Challenge Progress</p>
              <p className="mt-1 text-[22px] font-extrabold text-ink">
                {covered} / {challenge.sites} <span className="text-[14px] font-semibold text-ink-muted">{detail.progressNoun} submitted</span>
              </p>
              <div className="mt-2 flex gap-1.5">
                {Array.from({ length: challenge.sites }).map((_, i) => (
                  <span key={i} className="h-2 flex-1 rounded-full" style={{ backgroundColor: i < covered ? accent : 'var(--unseen)' }} />
                ))}
              </div>
            </div>
            <Link href="/" className="flex h-[70px] w-[90px] shrink-0 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(145deg,#CDE8D6,#BBD9F0)' }} aria-label="View on map">
              <MapIcon className="h-6 w-6" style={{ color: accent }} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Why */}
        <section>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h2 className="text-[18px] font-extrabold text-ink">Why this challenge?</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{detail.why}</p>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1A` }}>
              {(() => { const I = ICON[detail.observe[0]?.icon] ?? Leaf; return <I className="h-6 w-6" style={{ color: accent }} aria-hidden="true" />; })()}
            </span>
          </div>

          {/* Stat row */}
          <div className="mt-3 flex items-center rounded-card border border-unseen bg-surface p-3">
            {[
              { Icon: ICON[challenge.kind === 'pollution' ? 'litter' : 'droplet'], v: `${challenge.sites}`, l: `Sites to ${detail.progressNoun === 'reports' ? 'submit' : 'check'}` },
              { Icon: Clock, v: `${challenge.daysLeft} days`, l: 'Left' },
              { Icon: Users, v: `${challenge.joined}`, l: 'People joined' },
              { Icon: challenge.id === 'biodiversity-walk' ? Star : ShieldCheck, v: detail.stat4Title, l: detail.stat4Sub },
            ].map(({ Icon, v, l }, i) => (
              <div key={i} className={`flex flex-1 flex-col items-center gap-0.5 px-1 text-center ${i > 0 ? 'border-l border-unseen' : ''}`}>
                <Icon className="h-4 w-4" style={{ color: accent }} aria-hidden="true" />
                <span className="text-[14px] font-extrabold leading-tight text-ink">{v}</span>
                <span className="text-[10px] leading-tight text-ink-muted">{l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Observe */}
        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-ink">{detail.observeTitle}</h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {detail.observe.map((o) => {
              const I = ICON[o.icon] ?? Leaf;
              return (
                <div key={o.label} className="w-[150px] shrink-0 rounded-card border border-unseen bg-surface p-3">
                  <span className="flex h-12 w-full items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}14` }}>
                    <I className="h-6 w-6" style={{ color: accent }} aria-hidden="true" />
                  </span>
                  <p className="mt-2 text-[13px] font-bold text-ink">{o.label}</p>
                  <p className="text-[11px] leading-snug text-ink-muted">{o.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="mb-2 text-[18px] font-extrabold text-ink">How to contribute?</h2>
          <ol className="space-y-3">
            {detail.steps.map((s, i) => {
              const I = ICON[s.icon] ?? MapPin;
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--action)]/10 text-[14px] font-extrabold" style={{ color: accent }}>{i + 1}</span>
                  <I className="h-5 w-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
                  <div>
                    <p className="text-[15px] font-bold text-ink">{s.title}</p>
                    <p className="text-[12px] text-ink-muted">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Safety */}
        <div className="flex items-start gap-3 rounded-card p-4" style={{ backgroundColor: `${accent}12` }}>
          <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-ink">
            <span className="font-bold" style={{ color: accent }}>Stay safe. </span>
            {detail.safety}
          </p>
        </div>

        {/* CTA */}
        <div>
          <button
            type="button"
            onClick={join}
            className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-4 text-[16px] font-bold text-white shadow-[0_8px_22px_rgba(10,110,255,0.35)]"
            style={{ background: joined ? 'var(--success)' : 'linear-gradient(90deg, #1E7BFF 0%, #0052FF 100%)' }}
          >
            {joined ? 'Joined — open the map' : 'Join Challenge'}
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="mt-2 text-center text-[12px] text-ink-muted">No account required. Takes about 2 minutes.</p>
        </div>
      </div>
    </main>
  );
}
