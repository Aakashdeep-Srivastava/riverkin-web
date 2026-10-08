/**
 * Renders a JSON-LD <script> for SEO / AI-search citation. Next injects this in
 * the server-rendered HTML so crawlers and AI answer engines read it directly.
 * Keep the shape valid schema.org; test with Google's Rich Results Test.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is build-time/static data we control, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema — RiverKin as a project/brand, for the site root. */
export const organizationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'RiverKin',
  url: 'https://riverkin.online',
  logo: 'https://riverkin.online/icon-512.png',
  description:
    'RiverKin is citizen science that keeps urban rivers healthy — spot a site that needs a look, run a 5-minute field check, and have peers verify it.',
  // RiverKin is a project of Xphora AI Technology Pvt Ltd (named in the privacy policy).
  parentOrganization: { '@type': 'Organization', name: 'Xphora AI Technology Pvt Ltd' },
  sameAs: ['https://github.com/Aakashdeep-Srivastava/riverkin-web'],
};

/** WebSite schema — names the site entity for search/AI engines. */
export const websiteJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'RiverKin',
  url: 'https://riverkin.online',
};

/** WebApplication schema — RiverKin is a confirmed PWA. */
export const webApplicationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RiverKin',
  url: 'https://riverkin.online',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web (Progressive Web App)',
  description:
    'Citizen-science app for monitoring urban river health: find a site that needs a look, run a 5-minute field check, and have peers verify it.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};
