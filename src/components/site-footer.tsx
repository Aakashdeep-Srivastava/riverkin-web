/**
 * Credits footer. The hard rules require crediting OneAquaHealth (sites),
 * Open-Meteo (weather) and OpenStreetMap (tiles) in the UI.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-unseen px-4 py-6 text-xs text-ink-muted">
      <p className="mx-auto max-w-2xl leading-relaxed">
        Data &amp; credits: river sites from{' '}
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
        , map tiles &copy;{' '}
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
    </footer>
  );
}
