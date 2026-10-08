import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — RiverKin',
  description: 'The terms for using RiverKin, including safety, acceptable use and your content.',
  alternates: { canonical: 'https://riverkin.online/terms' },
};

/** Terms of Service. Review with counsel before a production pilot. */
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <Link
        href="/welcome"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
      </Link>

      <h1 className="font-display mt-4 text-[clamp(1.6rem,5vw,2rem)] font-semibold text-ink">
        Terms of Service
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Last updated 3 October 2026</p>

      <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-ink">
        <section>
          <h2 className="text-base font-semibold">1. Acceptance</h2>
          <p className="mt-1 text-ink-muted">
            By using RiverKin you agree to these Terms and to our{' '}
            <Link href="/privacy" className="font-medium text-[var(--action)] underline">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use the app.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">2. Who may use RiverKin</h2>
          <p className="mt-1 text-ink-muted">
            You may browse as a guest with no account. A personal account is for adults aged 16 or
            over. Under-16s may take part only as pseudonymous members of a teacher-led crew, with
            the school’s authorisation and supervision.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">3. Safety — this matters most</h2>
          <ul className="mt-2 space-y-1.5 text-ink-muted">
            <li>Observe and photograph from the bank only. Never wade or enter the water.</li>
            <li>Never touch water near pipes, outfalls or sewage; keep well back and report it.</li>
            <li>Under-16 crews must have an active Crew Lead check-in nearby before a field check.</li>
            <li>You take part at your own risk and are responsible for your own safety and the law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">4. Acceptable use</h2>
          <p className="mt-1 text-ink-muted">
            Submit honest observations only. Do not upload photos of identifiable people, falsify
            checks or votes, attempt to game trust scores, or use the service unlawfully. We may
            remove content or suspend accounts that break these rules.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">5. Your content</h2>
          <p className="mt-1 text-ink-muted">
            You keep ownership of what you submit. You grant RiverKin and OneAquaHealth a
            non-exclusive licence to use your verified, de-identified observations and photos for
            river-health research and to improve the service. Do not submit anything you do not have
            the right to share.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">6. Verification &amp; data</h2>
          <p className="mt-1 text-ink-muted">
            Observations are peer- and expert-verified. RiverKin is a prioritisation and
            coordination tool, not an official measurement or regulatory record, and we do not
            guarantee the accuracy of any single contribution.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">7. Accounts</h2>
          <p className="mt-1 text-ink-muted">
            You are responsible for activity on your account. Sign in with Microsoft is provided by
            Microsoft under its own terms. You can sign out or delete your account at any time from
            the Me screen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">8. Disclaimer &amp; liability</h2>
          <p className="mt-1 text-ink-muted">
            The service is provided “as is”, without warranties. To the extent permitted by law,
            RiverKin is not liable for any loss or injury arising from field visits or from reliance
            on app content. Nothing here limits liability that cannot be limited by law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">9. Changes &amp; contact</h2>
          <p className="mt-1 text-ink-muted">
            We may update these Terms and will post the new date above. Questions? Email{' '}
            <span className="text-ink">hello@riverkin.app</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
