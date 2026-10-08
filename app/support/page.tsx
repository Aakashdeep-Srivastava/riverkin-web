import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, Github, Handshake, Beaker } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { SiteFooter } from '@/components/site-footer';
import { JsonLd } from '@/components/structured-data';

const BASE = 'https://riverkin.online';

export const metadata: Metadata = {
  title: 'Support RiverKin — Help Keep Rivers Seen',
  description:
    'Support RiverKin: back the open-source project on GitHub Sponsors, contribute to development, or sponsor a pilot city. Every bit keeps urban rivers monitored.',
  alternates: { canonical: `${BASE}/support` },
  openGraph: {
    title: 'Support RiverKin',
    description: 'Back the open-source citizen-science project that keeps urban rivers healthy.',
    url: `${BASE}/support`,
    images: ['/icon-512.png'],
  },
};

// Configured per environment (baked at build time). Leave unset and the UI
// shows a "coming soon" state instead of a broken link.
//  - NEXT_PUBLIC_GITHUB_SPONSORS: full GitHub Sponsors URL (open-source framing)
//  - NEXT_PUBLIC_DONATE_URL:      a Razorpay hosted Payment Page / payment link
//  - NEXT_PUBLIC_GITHUB_REPO:     repo URL (fallback + "contribute code" link)
//  - NEXT_PUBLIC_SPONSOR_EMAIL:   contact for organisational sponsorship
const SPONSORS_URL = process.env.NEXT_PUBLIC_GITHUB_SPONSORS;
const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;
const REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'https://github.com/Aakashdeep-Srivastava/riverkin-web';
const SPONSOR_EMAIL = process.env.NEXT_PUBLIC_SPONSOR_EMAIL ?? 'hello@riverkin.online';

function ExternalCta({
  href,
  children,
  disabled,
  variant = 'primary',
}: {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  if (!href || disabled) {
    return (
      <span className={`${buttonClasses(variant, 'md')} pointer-events-none opacity-50`}>
        {children} — coming soon
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={buttonClasses(variant, 'md')}>
      {children}
    </a>
  );
}

export default function SupportPage() {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Support RiverKin',
    url: `${BASE}/support`,
    description:
      'Ways to support RiverKin: GitHub Sponsors for the open-source project, contributions to development, and pilot-city sponsorship.',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Link>

        <h1 className="font-display mt-4 text-[clamp(1.7rem,5.5vw,2.25rem)] font-semibold leading-tight text-ink">
          Support RiverKin
        </h1>
        <p className="mt-2 text-[17px] leading-relaxed text-ink">
          RiverKin keeps urban rivers seen — spotting the sites that need a look, turning five-minute
          field checks into verified, standardised data that cities and scientists can act on. It is
          built and run by a tiny team. Your support pays for the hosting, maps and AI that keep it
          running, and the work to reach more rivers.
        </p>

        {/* 1. Open source — the primary, cleanest channel. */}
        <section className="mt-8 rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-ink" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Sponsor the open-source project
            </h2>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            RiverKin&apos;s code is open source. Sponsoring on GitHub directly backs development of a
            public good — the map, the field-check loop, the verification engine and the open data
            export — and your sponsorship is public recognition on the project.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <ExternalCta href={SPONSORS_URL}>
              <Heart className="h-4 w-4" aria-hidden="true" /> Sponsor on GitHub
            </ExternalCta>
            <ExternalCta href={REPO_URL} variant="secondary">
              <Github className="h-4 w-4" aria-hidden="true" /> Star / contribute code
            </ExternalCta>
          </div>
        </section>

        {/* 2. Direct contribution — Razorpay. */}
        <section className="mt-5 rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-[var(--cta)]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Make a one-off contribution
            </h2>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            Prefer to give directly? A contribution of any size helps cover a month of hosting or a
            city&apos;s map tiles. Payments are handled securely by Razorpay.
          </p>
          <div className="mt-4">
            <ExternalCta href={DONATE_URL} variant="primary">
              <Heart className="h-4 w-4" aria-hidden="true" /> Contribute
            </ExternalCta>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
            RiverKin is a project of Xphora AI Technology Pvt Ltd, a company — not a registered
            charity — so contributions are not tax-deductible and are not treated as charitable
            donations. They simply support the project&apos;s running costs and development.
          </p>
        </section>

        {/* 3. Organisational sponsorship — the real money for a company. */}
        <section className="mt-5 rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-[var(--action)]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">
              Sponsor a city or partner with us
            </h2>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            Universities, water utilities, municipalities, foundations and companies can sponsor a
            pilot city or fund a feature — with logo placement, access to the open dataset and a
            co-branded river-health report in return. If your organisation works on water, climate or
            civic tech, we&apos;d love to talk.
          </p>
          <div className="mt-4">
            <a
              href={`mailto:${SPONSOR_EMAIL}?subject=RiverKin%20sponsorship`}
              className={buttonClasses('secondary', 'md')}
            >
              <Handshake className="h-4 w-4" aria-hidden="true" /> Talk sponsorship
            </a>
          </div>
        </section>

        {/* 4. Non-money help. */}
        <section className="mt-5 rounded-card border border-unseen bg-surface p-5">
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-[var(--success)]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-ink">No money? Still huge help.</h2>
          </div>
          <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-ink-muted">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action)]" />
              <span>Run a field check on a river near you and share it.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action)]" />
              <span>
                Tell a teacher — a class crew can monitor a local stream all term.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action)]" />
              <span>
                Share a{' '}
                <Link href="/learn" className="font-medium text-[var(--action)] underline">
                  guide
                </Link>{' '}
                on X, YouTube or Instagram.
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <Link href="/welcome" className={buttonClasses('primary', 'md')}>
              Open RiverKin
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
