import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';

/**
 * Credits footer. The hard rules require crediting OneAquaHealth (sites),
 * Open-Meteo (weather) and the map/tile providers in the UI. Now also credits
 * GBIF (biodiversity), GloFAS/Open-Meteo (discharge) and OpenStreetMap (the real
 * river geometry overlay, ODbL). Also hosts the language switcher.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-unseen px-4 py-6 text-xs text-ink-muted">
      <nav className="mx-auto mb-4 flex max-w-2xl flex-wrap gap-x-4 gap-y-2">
        <Link className="font-medium hover:text-ink" href="/learn">
          Learn
        </Link>
        <Link className="font-medium hover:text-ink" href="/about">
          About
        </Link>
        <Link className="font-medium hover:text-ink" href="/support">
          Support
        </Link>
        <Link className="font-medium hover:text-ink" href="/privacy">
          Privacy
        </Link>
        <Link className="font-medium hover:text-ink" href="/terms">
          Terms
        </Link>
      </nav>
      <p className="mx-auto max-w-2xl leading-relaxed">
        Data &amp; credits: river sites, ecology &amp; One Health risk data from{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://oneaquahealth.eu/"
          target="_blank"
          rel="noreferrer noopener"
        >
          OneAquaHealth
        </a>
        , weather from{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Open-Meteo
        </a>
        , biodiversity from{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://www.gbif.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          GBIF
        </a>
        , river discharge from GloFAS/Copernicus via Open-Meteo, map tiles from{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://azure.microsoft.com/products/azure-maps"
          target="_blank"
          rel="noreferrer noopener"
        >
          Azure Maps
        </a>{' '}
        (data &copy; TomTom), and river geometry &copy;{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer noopener"
        >
          OpenStreetMap
        </a>{' '}
        contributors.
      </p>
      <div className="mx-auto mt-4 flex max-w-2xl justify-end">
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
