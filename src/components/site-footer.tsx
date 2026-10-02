/**
 * Credits footer. The hard rules require crediting OneAquaHealth (sites),
 * Open-Meteo (weather) and the map-tile provider in the UI. Tiles now come from
 * Azure Maps (data © TomTom), so OpenStreetMap is no longer credited here.
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
        , map tiles from{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://azure.microsoft.com/products/azure-maps"
          target="_blank"
          rel="noreferrer noopener"
        >
          Azure Maps
        </a>{' '}
        (data &copy;{' '}
        <a
          className="underline underline-offset-2 hover:text-ink"
          href="https://www.tomtom.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          TomTom
        </a>
        ).
      </p>
    </footer>
  );
}
