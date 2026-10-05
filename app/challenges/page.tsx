'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  Flame,
  Clock,
  MapPin,
  Users,
  Footprints,
  Droplet,
  Sprout,
  AlertTriangle,
  Map as MapIcon,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { RiverMark } from '@/components/ui/logo';
import { InviteCard } from '@/components/community/invite-card';
import {
  getChallenges,
  getProfile,
  joinChallenge,
  type Challenge,
  type ChallengeKind,
  type ChallengeStatus,
  type CommunityProfile,
} from '@/lib/community';

const KIND_ICON: Record<ChallengeKind, LucideIcon> = {
  run: Footprints,
  check: Droplet,
  biodiversity: Sprout,
  pollution: AlertTriangle,
  map: MapIcon,
};
const KIND_TINT: Record<ChallengeKind, string> = {
  run: '#1E7BFF',
  check: '#2FA7D9',
  biodiversity: '#2FA36B',
  pollution: '#E5724D',
  map: '#7A5AF8',
};

const TABS: { key: ChallengeStatus; label: string }[] = [
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

function Thumb({ kind, size = 'md' }: { kind: ChallengeKind; size?: 'md' | 'lg' }) {
  const Icon = KIND_ICON[kind];
  const tint = KIND_TINT[kind];
  const dim = size === 'lg' ? 'h-16 w-16' : 'h-14 w-14';
  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-2xl`}
      style={{ background: `linear-gradient(145deg, ${tint}22 0%, ${tint}11 100%)` }}
      aria-hidden="true"
    >
      <Icon className="h-6 w-6" style={{ color: tint }} />
    </span>
  );
}

function ChallengeRow({ c, onJoin, joined }: { c: Challenge; onJoin: (id: string) => void; joined: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-unseen bg-surface p-3">
      <Thumb kind={c.kind} />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-ink">{c.title}</p>
        <p className="mt-0.5 line-clamp-2 text-[12px] text-ink-muted">{c.blurb}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{c.daysLeft}d left</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{c.joined} joined</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onJoin(c.id)}
        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-bold ${
          joined ? 'bg-[var(--success)]/15 text-[var(--success)]' : 'bg-[var(--action)]/12 text-[var(--action)]'
        }`}
      >
        {joined ? 'Joined' : 'Join'}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ChallengesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<ChallengeStatus>('live');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [profile, setProfile] = useState<CommunityProfile | null>(null);

  useEffect(() => {
    void getChallenges().then(setChallenges);
    void getProfile().then(setProfile);
  }, []);

  const handleJoin = async (id: string) => {
    const r = await joinChallenge(id);
    if (r) {
      setProfile(r.profile);
      setChallenges((cs) => cs.map((c) => (c.id === id ? r.challenge : c)));
    }
  };

  const joinedIds = profile?.joinedIds ?? [];
  const featured = challenges.find((c) => c.featured && c.status === 'live');
  const list = challenges.filter((c) => c.status === tab && c.id !== featured?.id);
  const joinedCount = joinedIds.length;
  const sitesTarget = featured?.sites ?? 5;
  const covered = Math.min(joinedCount, sitesTarget);
  const FeaturedIcon = featured ? KIND_ICON[featured.kind] : Footprints;

  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      {/* Header with a soft river-toned hero wash. */}
      <div
        className="px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-4"
        style={{ background: 'linear-gradient(135deg, #DCEAF7 0%, #EAF3EC 60%, var(--bg) 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-ink" aria-hidden="true" />
            </button>
            <RiverMark className="h-7 w-7" />
            <span className="text-lg font-bold tracking-tight text-ink">RiverKin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm">
              <Bell className="h-4 w-4 text-ink" aria-hidden="true" />
            </span>
            <Link href="/me" className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--action)] text-sm font-bold text-white">K</Link>
          </div>
        </div>

        <h1 className="mt-3 text-[32px] font-extrabold leading-none tracking-tight text-ink">Challenges</h1>
        <p className="mt-1.5 max-w-sm text-[14px] leading-snug text-ink-muted">
          Join community challenges, explore rivers and help keep our freshwater ecosystems healthy.
        </p>

        {/* Tabs */}
        <div className="mt-4 flex gap-2" role="tablist" aria-label="Challenge status">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-semibold ${
                  active ? 'bg-[var(--action)] text-white' : 'border border-unseen bg-surface text-ink'
                }`}
              >
                {t.label}
                {t.key === 'live' ? (
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : 'bg-[var(--success)]'}`} />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* Featured (live only) */}
        {tab === 'live' && featured ? (
          <div
            className="overflow-hidden rounded-card p-4 text-white shadow-[var(--rk-shadow-lift)]"
            style={{ background: 'linear-gradient(135deg, #0E4FA0 0%, #0A2A52 100%)' }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success)]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                <Flame className="h-3.5 w-3.5" /> Live now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold">
                <Clock className="h-3.5 w-3.5" /> {featured.daysLeft} days left
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <FeaturedIcon className="h-6 w-6" aria-hidden="true" />
              <h2 className="text-[26px] font-extrabold leading-none">{featured.title}</h2>
            </div>
            <p className="mt-2 max-w-sm text-[14px] text-white/85">{featured.blurb}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/90">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{featured.city}</span>
              <span className="inline-flex items-center gap-1"><Footprints className="h-4 w-4" />{featured.meta}</span>
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{featured.joined} joined</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleJoin(featured.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[14px] font-bold text-[var(--action)]"
              >
                {joinedIds.includes(featured.id) ? 'Joined ✓' : 'Join Challenge'}
                {!joinedIds.includes(featured.id) ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-4 py-3 text-[14px] font-semibold text-white"
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" /> View map
              </Link>
            </div>
          </div>
        ) : null}

        {/* Your progress */}
        {tab === 'live' ? (
          <div className="rounded-card border border-unseen bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-ink">Your Progress</p>
              <Link href="/rewards" className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-[var(--action)]">
                See details <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="var(--unseen)" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" stroke="url(#rk-c)" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - Math.max(0.05, covered / sitesTarget))}
                  />
                  <defs>
                    <linearGradient id="rk-c" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#1E7BFF" /><stop offset="1" stopColor="#2FA36B" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center"><Leaf className="h-6 w-6 text-[#2FA36B]" /></span>
              </div>
              <div>
                <p className="text-[20px] font-extrabold leading-none text-ink tabular-nums">{covered}/{sitesTarget}</p>
                <p className="text-[12px] text-ink-muted">sites covered</p>
              </div>
              <div className="ml-auto flex items-center gap-3 text-center">
                {[
                  { Icon: Users, tint: '#1E7BFF', v: featured?.joined ?? 0, l: 'Joined' },
                  { Icon: ShieldCheck, tint: '#2FA7D9', v: profile?.missions ?? 0, l: 'Missions' },
                  { Icon: Leaf, tint: '#2FA36B', v: profile?.checks ?? 0, l: 'Checks' },
                  { Icon: Trophy, tint: '#F2A93B', v: profile?.riversHelped ?? 0, l: 'Rivers' },
                ].map(({ Icon, tint, v, l }) => (
                  <div key={l} className="flex w-11 flex-col items-center gap-0.5">
                    <Icon className="h-4 w-4" style={{ color: tint }} aria-hidden="true" />
                    <span className="text-[15px] font-extrabold text-ink tabular-nums">{v}</span>
                    <span className="text-[10px] text-ink-muted">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* More challenges */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[15px] font-bold text-ink">{tab === 'live' ? 'More Challenges' : TABS.find((t) => t.key === tab)?.label}</p>
          </div>
          {list.length ? (
            <div className="space-y-3">
              {list.map((c) => (
                <ChallengeRow key={c.id} c={c} onJoin={handleJoin} joined={joinedIds.includes(c.id)} />
              ))}
            </div>
          ) : (
            <p className="rounded-card border border-unseen bg-surface p-6 text-center text-sm text-ink-muted">
              No {tab} challenges right now — check back soon.
            </p>
          )}
        </div>

        {/* Invite */}
        <InviteCard />
      </div>
    </main>
  );
}
