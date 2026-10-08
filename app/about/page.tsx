import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button';
import { SiteFooter } from '@/components/site-footer';
import { JsonLd } from '@/components/structured-data';

const BASE = 'https://riverkin.online';

export const metadata: Metadata = {
  title: 'About RiverKin — Who We Are & How It Started',
  description:
    'RiverKin is citizen science that keeps urban rivers healthy, built on real OneAquaHealth data and FHIR standards. Learn who runs it and how it began.',
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: 'About RiverKin',
    description: 'Who runs RiverKin, how it started, and the data and standards behind it.',
    url: `${BASE}/about`,
    images: ['/icon-512.png'],
  },
};

export default function AboutPage() {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About RiverKin',
    url: `${BASE}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: 'RiverKin',
      url: BASE,
      parentOrganization: { '@type': 'Organization', name: 'Xphora AI Technology Pvt Ltd' },
      sameAs: ['https://github.com/Aakashdeep-Srivastava/riverkin-web', 'https://oneaquahealth.eu/'],
    },
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
          About RiverKin
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">
          RiverKin is citizen science that keeps urban rivers healthy. There are far more rivers than
          there are people paid to watch them, so most urban streams go unseen for weeks. RiverKin
          turns ordinary people and school groups into a distributed, verified network that catches
          what sparse official monitoring misses.
        </p>

        <div className="mt-8 space-y-7 text-[15px] leading-relaxed text-ink-muted">
          <section>
            <h2 className="text-lg font-semibold text-ink">What we do</h2>
            <p className="mt-2">
              The app shows you the river sites near you that most need a look, guides a safe
              five-minute bank-side field check (a few photos and simple questions), has peers verify
              each check, and exports the verified result as standardised{' '}
              <span className="font-medium text-ink">FHIR</span> health data — the same format cities,
              scientists and biodiversity teams already use. Our core principle is{' '}
              <span className="font-medium text-ink">&ldquo;AI asks, humans decide&rdquo;</span>: the
              AI reads your photos and raises questions, but never fills in an answer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">How it started</h2>
            <p className="mt-2">
              RiverKin began as an entry in the{' '}
              <a
                href="https://www.oneaquahealth.eu/oneaquahealth-ieee-global-hackathon/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[var(--action)] underline"
              >
                IEEE OneAquaHealth Global Hackathon 2026
              </a>
              , built around real urban-river monitoring rather than a mock-up.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">The data behind it</h2>
            <p className="mt-2">
              RiverKin is built on real{' '}
              <a
                href="https://oneaquahealth.eu/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[var(--action)] underline"
              >
                OneAquaHealth
              </a>{' '}
              (EU Horizon Europe project) ecology and One-Health-risk data — macroinvertebrate, diatom
              and fish indicators — across pilot cities in Europe (Coimbra, Toulouse, Ghent, Oslo,
              Benevento) plus a Melbourne, Australia pilot. Weather comes from Open-Meteo, biodiversity
              from GBIF, and river geometry from OpenStreetMap.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-ink">Who runs RiverKin</h2>
            <p className="mt-2">
              RiverKin is a project of{' '}
              <span className="font-medium text-ink">Xphora AI Technology Pvt Ltd</span>. We take
              privacy and safety seriously: observe from the bank only; photos are stripped of EXIF
              and faces are blurred; under-16s take part only as pseudonymous members of a
              teacher-led crew, never with a personal account. See our{' '}
              <Link href="/privacy" className="font-medium text-[var(--action)] underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="font-medium text-[var(--action)] underline">
                Terms
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-2 sm:flex-row">
          <Link href="/welcome" className={buttonClasses('primary', 'md')}>
            Open RiverKin
          </Link>
          <Link href="/learn" className={buttonClasses('secondary', 'md')}>
            How it works
          </Link>
          <Link href="/support" className={buttonClasses('secondary', 'md')}>
            Support
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
