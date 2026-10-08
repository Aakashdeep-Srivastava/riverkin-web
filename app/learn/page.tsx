'use client';

import Link from 'next/link';
import { Eye, BookOpen, Camera, ShieldCheck, Users, Sprout, ArrowRight, type LucideIcon } from 'lucide-react';
import { AppBar } from '@/components/app-bar';
import { LEARN_ARTICLES } from '@/lib/learn-content';

interface Card {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const STEPS: Card[] = [
  {
    Icon: Eye,
    title: 'Notice',
    body: 'Open the map and find the stream that most needs a look today — ranked by how long it has gone unseen, recent rain, and open flags.',
  },
  {
    Icon: BookOpen,
    title: 'Understand',
    body: 'Each site shows its real OneAquaHealth ecology (macroinvertebrates, diatoms, fish) and One Health risk — a plain-language picture of the water.',
  },
  {
    Icon: Camera,
    title: 'Act',
    body: 'Walk to the bank, answer a few simple questions, take 1–5 photos. Five minutes, no lab. The AI reads the scene and asks — you decide what you see.',
  },
  {
    Icon: Users,
    title: 'Verify',
    body: 'Other people confirm your check in 20-second cards. Three agreements make it community-verified — people reach consensus, not an algorithm.',
  },
  {
    Icon: Sprout,
    title: 'It counts',
    body: 'Your verified check becomes standardized FHIR health data — the same format cities, scientists and biodiversity teams already use.',
  },
];

/** Learn — how RiverKin works, in the loop order, with the safety + AI stance. */
export default function LearnPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl pb-28">
      <AppBar active="/learn" />
      <div className="px-4 pt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">How RiverKin works</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Turn a five-minute riverside visit into research-grade data — and keep your streams seen.
        </p>

        <ol className="mt-5 space-y-3">
          {STEPS.map(({ Icon, title, body }, i) => (
            <li
              key={title}
              className="flex gap-3 rounded-card border border-unseen bg-surface p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--action)]/12 text-[var(--action)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--action)]">
                  Step {i + 1}
                </p>
                <p className="text-[16px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex gap-3 rounded-card border border-[var(--attention)]/40 bg-[var(--attention)]/10 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--attention)]" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-ink">
            <span className="font-bold">Stay safe.</span> Always photograph from the bank — never enter
            the water. If you see a pipe or sewage, flag it; it goes straight to an expert.
          </p>
        </div>

        <p className="mt-4 text-center text-[12px] text-ink-muted">
          The AI reads your photos and writes questions — it never fills in an answer.{' '}
          <span className="font-semibold text-ink">AI asks, humans decide.</span>
        </p>

        {/* Guides — the SEO + social education cluster. */}
        <section className="mt-9">
          <h2 className="font-display text-[20px] font-semibold text-ink">Guides</h2>
          <p className="mt-1 text-[13px] text-ink-muted">
            Read a river like a scientist — no lab required.
          </p>
          <ul className="mt-4 space-y-3">
            {LEARN_ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/learn/${a.slug}`}
                  className="group flex items-start gap-3 rounded-card border border-unseen bg-surface p-4 shadow-sm hover:border-[var(--action)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink group-hover:text-[var(--action)]">
                      {a.h1}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink-muted">
                      {a.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-ink-muted group-hover:text-[var(--action)]"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
