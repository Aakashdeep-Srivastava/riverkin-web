import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { LEARN_ARTICLES, getArticle } from '@/lib/learn-content';
import { JsonLd } from '@/components/structured-data';
import { buttonClasses } from '@/components/ui/button';
import { SiteFooter } from '@/components/site-footer';

const BASE = 'https://riverkin.online';

/** Pre-render every guide at build time. */
export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  const url = `${BASE}/learn/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      images: ['/icon-512.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default function LearnArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const url = `${BASE}/learn/${article.slug}`;

  const articleLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.h1,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { '@type': 'Organization', name: 'RiverKin' },
    publisher: {
      '@type': 'Organization',
      name: 'RiverKin',
      logo: { '@type': 'ImageObject', url: `${BASE}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${BASE}/icon-512.png`,
  };

  const faqLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Learn', item: `${BASE}/learn` },
      { '@type': 'ListItem', position: 2, name: article.h1, item: url },
    ],
  };

  const others = LEARN_ARTICLES.filter((a) => a.slug !== article.slug);
  const shareText = encodeURIComponent(article.hook);
  const shareUrl = encodeURIComponent(url);

  return (
    <>
      <JsonLd data={[articleLd, faqLd, breadcrumbLd]} />
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All guides
        </Link>

        <article className="mt-4">
          <h1 className="font-display text-[clamp(1.7rem,5.5vw,2.25rem)] font-semibold leading-tight text-ink">
            {article.h1}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {article.readMinutes} min read
          </p>

          <p className="mt-5 text-[17px] leading-relaxed text-ink">{article.intro}</p>

          <div className="mt-8 space-y-7">
            {article.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-lg font-semibold text-ink">{s.h}</h2>
                {s.p?.map((para, i) => (
                  <p key={i} className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {para}
                  </p>
                ))}
                {s.ul && (
                  <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-ink-muted">
                    {s.ul.map((li, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--action)]" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* FAQ — rendered on-page and mirrored in FAQ JSON-LD above. */}
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">Frequently asked questions</h2>
            <dl className="mt-4 space-y-5">
              {article.faq.map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-ink-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Primary CTA into the app. */}
          <div className="mt-10 rounded-card border border-unseen bg-surface p-5">
            <h2 className="font-display text-lg font-semibold text-ink">
              See it for yourself
            </h2>
            <p className="mt-1 text-[15px] text-ink-muted">
              Open the map, find a river near you that needs a look, and run a five-minute check.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/welcome" className={buttonClasses('primary', 'md')}>
                Open RiverKin
              </Link>
              <Link href="/support" className={buttonClasses('secondary', 'md')}>
                Support the project
              </Link>
            </div>
          </div>

          {/* Share — the article hook is the ready-made caption. */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-ink-muted">Share:</span>
            <a
              className="font-medium text-[var(--action)] underline"
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              X
            </a>
            <a
              className="font-medium text-[var(--action)] underline"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
            <a
              className="font-medium text-[var(--action)] underline"
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Facebook
            </a>
          </div>

          {/* Internal links — the content cluster. */}
          {others.length > 0 && (
            <nav className="mt-10 border-t border-unseen pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                Keep reading
              </h2>
              <ul className="mt-3 space-y-3">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/learn/${a.slug}`} className="group block">
                      <span className="font-medium text-ink group-hover:text-[var(--action)]">
                        {a.h1}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">{a.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
